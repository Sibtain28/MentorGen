const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { generateProjectsWithAI } = require("../controllers/project.controller");

const {
  createProject,
  getMyProjects
} = require("../controllers/project.controller");

router.post("/", protect, createProject);
router.get("/", protect, getMyProjects);
router.post("/generate", protect, generateProjectsWithAI);

module.exports = router;
