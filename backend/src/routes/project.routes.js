const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  createProject,
  getMyProjects,
  getProjectById,
  generateProjectsWithAI
} = require("../controllers/project.controller");

router.post("/", protect, createProject);
router.get("/", protect, getMyProjects);
router.post("/generate", protect, generateProjectsWithAI);
router.get("/:id", protect, getProjectById);

module.exports = router;
