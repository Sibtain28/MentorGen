const prisma = require("../prisma");
const openai = require("../utils/openai");
const buildStepPrompt = require("../utils/stepPrompt");

exports.generateProjectSteps = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const prompt = buildStepPrompt(project);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5
    });

    const steps = JSON.parse(
      completion.choices[0].message.content
    );

    await prisma.projectStep.createMany({
      data: steps.map(step => ({
        ...step,
        projectId
      }))
    });

    res.status(201).json({
      message: "Build-With-Me steps generated",
      steps
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate steps" });
  }
};
