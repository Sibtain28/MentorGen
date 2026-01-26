const prisma = require("../prisma");

exports.updatePreferences = async (req, res) => {
  try {
    const { skillLevel, preferred_domain, preferred_tech_stack, preferred_goal } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        skillLevel,
        preferred_domain,
        preferred_tech_stack,
        preferred_goal,
        onboarding_completed: true
      }
    });

    res.json({
      message: "Preferences saved successfully",
      preferences: {
        skillLevel: user.skillLevel,
        preferred_domain: user.preferred_domain,
        preferred_tech_stack: user.preferred_tech_stack,
        preferred_goal: user.preferred_goal
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        skillLevel: true,
        preferred_domain: true,
        preferred_tech_stack: true,
        preferred_goal: true,
        onboarding_completed: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
