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
        userId: req.user.userId
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
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};






exports.generateProjectsWithAI = async (req, res) => {
  try {
    const userId = req.user.userId;
    

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
