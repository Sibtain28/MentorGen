const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { updatePreferences, getProfile } = require("../controllers/user.controller");

router.put("/preferences", protect, updatePreferences);
router.post("/preferences", protect, updatePreferences);
router.get("/profile", protect, getProfile);

module.exports = router;
