const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  toggleStepProgress,
  getProjectProgress
} = require("../controllers/progress.controller");

router.post("/step/:stepId", protect, toggleStepProgress);
router.get("/project/:projectId", protect, getProjectProgress);

module.exports = router;
