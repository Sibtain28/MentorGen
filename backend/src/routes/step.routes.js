const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { generateProjectSteps } = require("../controllers/step.controller");

router.post("/:projectId/generate-steps", protect, generateProjectSteps);

module.exports = router;
