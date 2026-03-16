const express = require("express");
const { getDB } = require("../db/connection");
const { ObjectId } = require("mongodb");

const router = express.Router();

// GET all projects with optional filters
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const { techStack, category, date } = req.query;
    let query = {};
    if (techStack) query.techStack = { $in: [techStack] };
    if (category) query.category = category;
    if (date) query.createdAt = { $gte: new Date(date) };
    const projects = await db.collection("projects").find(query).toArray();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET stats
router.get("/stats", async (req, res) => {
  try {
    const db = getDB();
    const projects = await db.collection("projects").find().toArray();
    const techStackCounts = {};
    const categoryCounts = {};
    projects.forEach((p) => {
      p.techStack.forEach((t) => {
        techStackCounts[t] = (techStackCounts[t] || 0) + 1;
      });
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    res.json({ techStackCounts, categoryCounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const project = await db
      .collection("projects")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create project
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const {
      title,
      description,
      techStack,
      category,
      githubLink,
      demoURL,
      authorName,
    } = req.body;
    const project = {
      title,
      description,
      techStack,
      category,
      githubLink,
      demoURL,
      authorName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("projects").insertOne(project);
    res.status(201).json({ _id: result.insertedId, ...project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update project
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const {
      title,
      description,
      techStack,
      category,
      githubLink,
      demoURL,
      authorName,
    } = req.body;
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          title,
          description,
          techStack,
          category,
          githubLink,
          demoURL,
          authorName,
          updatedAt: new Date(),
        },
      },
    );
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("projects")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
