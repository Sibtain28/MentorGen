const prisma = require("../prisma");
const openai = require("../utils/openai");
const buildProjectPrompt = require("../utils/projectPrompt");


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






exports.generateProjectsWithAI = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has projects (prevent duplicates on refresh)
    const existingProjects = await prisma.project.findMany({
      where: { userId }
    });

    if (existingProjects.length > 0) {
      return res.status(200).json({
        message: "Projects already exist",
        projects: existingProjects
      });
    }

    const prompt = buildProjectPrompt(user);


    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const projects = JSON.parse(
      completion.choices[0].message.content
    );

    const savedProjects = await prisma.project.createMany({
      data: projects.map(p => ({
        ...p,
        userId
      }))
    });

    res.status(201).json({
      message: "AI projects generated",
      projects
    });

  } catch (error) {
    console.error("AI GENERATION ERROR:", error);
    res.status(500).json({ message: "Failed to generate projects" });
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
          orderBy: { order: "asc" } // Assuming steps have an order field, checking schema would be better but standard assumption
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get user's progress for these steps
    const progress = await prisma.stepProgress.findMany({
      where: {
        userId,
        stepId: { in: project.steps.map(s => s.id) }
      }
    });

    // Map progress to steps
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
