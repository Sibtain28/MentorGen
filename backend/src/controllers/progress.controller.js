const prisma = require("../prisma");

// Mark step complete / incomplete
exports.toggleStepProgress = async (req, res) => {
  try {
    const { stepId } = req.params;
    const userId = req.user.userId;

    const existing = await prisma.stepProgress.findFirst({
      where: { stepId, userId }
    });

    let progress;

    if (existing) {
      progress = await prisma.stepProgress.update({
        where: { id: existing.id },
        data: { completed: !existing.completed }
      });
    } else {
      progress = await prisma.stepProgress.create({
        data: {
          stepId,
          userId,
          completed: true
        }
      });
    }

    res.json({
      message: "Step progress updated",
      progress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update progress" });
  }
};

// Get project progress
exports.getProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const steps = await prisma.projectStep.findMany({
      where: { projectId }
    });

    const completedSteps = await prisma.stepProgress.count({
      where: {
        userId,
        completed: true,
        stepId: { in: steps.map(s => s.id) }
      }
    });

    const progressPercent = steps.length
      ? Math.round((completedSteps / steps.length) * 100)
      : 0;

    res.json({
      totalSteps: steps.length,
      completedSteps,
      progressPercent
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};
