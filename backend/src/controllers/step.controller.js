const prisma = require("../prisma");
const buildStepPrompt = require("../utils/stepPrompt");
const axios = require("axios");

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

    console.log("🤖 Calling OpenRouter API for steps...");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a senior software mentor."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Step Generator"
        }
      }
    );

    const text = response.data.choices[0].message.content;

    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const steps = JSON.parse(cleanedText);

    await prisma.projectStep.createMany({
      data: steps.map(step => ({
        ...step,
        projectId
      }))
    });

    console.log("✅ Steps generated successfully!");

    res.status(201).json({
      message: "Build-With-Me steps generated",
      steps
    });

  } catch (error) {
    console.error("STEP GENERATION ERROR:", error.response?.data || error);
    res.status(500).json({
      message: "Failed to generate steps",
      error: error.message
    });
  }
};
