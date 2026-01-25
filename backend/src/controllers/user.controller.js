const prisma = require("../prisma");

exports.updatePreferences = async (req, res) => {
  try {
    const { skillLevel, domain, goal, techStack } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        skillLevel,
        domain,
        goal,
        techStack
      }
    });

    res.json({
      message: "Preferences saved successfully",
      preferences: {
        skillLevel: user.skillLevel,
        domain: user.domain,
        goal: user.goal,
        techStack: user.techStack
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
