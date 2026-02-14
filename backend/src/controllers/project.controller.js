const prisma = require("../prisma");
const buildProjectPrompt = require("../utils/projectPrompt");
const axios = require("axios");

// Create a project (manual / mock)
exports.createProject = async (req, res) => {
  try {
    const { title, description, difficulty, concepts, estimatedTime } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        difficulty,
        concepts,
        estimatedTime,
        userId: req.user.id
      }
    });

    res.status(201).json({
      message: "Project created",
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's projects
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Generate projects with AI (OpenRouter)
exports.generateProjectsWithAI = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingProjects = await prisma.project.findMany({
      where: { userId }
    });

    if (existingProjects.length > 0) {
      return res.status(200).json({
        message: "Projects already exist",
        projects: existingProjects
      });
    }

    let projects;

    try {
      const prompt = buildProjectPrompt(user);

      console.log("🤖 Calling OpenRouter API...");

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: "You are a senior software engineering mentor."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Project Generator"
          }
        }
      );

      const text = response.data.choices[0].message.content;

      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      projects = JSON.parse(cleanedText);

      console.log("✅ OpenRouter SUCCESS! Generated", projects.length, "projects");

    } catch (aiError) {
      console.error("❌ OpenRouter failed:", aiError.response?.data || aiError.message);

      // Fallback projects
      projects = [
        {
          title: `${user.skillLevel} Level Task Manager`,
          description: `Build a full-stack task management app for ${user.preferred_domain} using ${user.preferred_tech_stack?.join(", ") || "modern tech"}.`,
          difficulty: user.skillLevel || "Intermediate",
          concepts: ["REST API", "Authentication", "Database Design"],
          estimatedTime: "2-3 weeks"
        },
        {
          title: "Real-time Collaboration Tool",
          description: `Create a real-time collaboration platform focused on ${user.preferred_goal}.`,
          difficulty: user.skillLevel || "Advanced",
          concepts: ["WebSockets", "State Management"],
          estimatedTime: "3-4 weeks"
        },
        {
          title: "API-Driven Dashboard",
          description: `Build a dashboard using third-party APIs for analytics.`,
          difficulty: user.skillLevel || "Intermediate",
          concepts: ["API Integration", "Charts"],
          estimatedTime: "2 weeks"
        }
      ];
    }

    const savedProjects = await Promise.all(
      projects.map(p =>
        prisma.project.create({
          data: {
            ...p,
            userId
          }
        })
      )
    );

    res.status(201).json({
      message: "Projects generated successfully",
      projects: savedProjects
    });

  } catch (error) {
    console.error("AI GENERATION ERROR:", error);
    res.status(500).json({
      message: "Failed to generate projects",
      error: error.message
    });
  }
};


// Get single project with progress
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { order: "asc" }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const progress = await prisma.stepProgress.findMany({
      where: {
        userId,
        stepId: { in: project.steps.map(s => s.id) }
      }
    });

    const stepsWithProgress = project.steps.map(step => {
      const p = progress.find(p => p.stepId === step.id);
      return {
        ...step,
        completed: p ? p.completed : false
      };
    });

    res.json({
      project: {
        ...project,
        steps: stepsWithProgress
      }
    });

  } catch (error) {
    console.error("GET PROJECT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
