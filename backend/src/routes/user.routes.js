const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { updatePreferences } = require("../controllers/user.controller");

router.put("/preferences", protect, updatePreferences);

module.exports = router;
