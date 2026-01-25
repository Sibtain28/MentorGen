const express = require("express");
const router = express.Router();

const { register,login } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);

const { protect } = require("../middlewares/auth.middleware");

router.get("/me", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

module.exports = router;
