const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8080"],
  credentials: true
}));
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({"message": "this is it"})
});

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/users", require("./routes/user.routes"));

app.use("/api/projects", require("./routes/project.routes"));



module.exports = app;
