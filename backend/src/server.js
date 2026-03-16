const express = require("express");
const { connectDB } = require("./db/connection");

const projectsRouter = require("./routes/projects");
const feedbackRouter = require("./routes/feedback");
const bookmarksRouter = require("./routes/bookmarks");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api/projects", projectsRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/bookmarks", bookmarksRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
