const express = require("express");
const { getDB } = require("../db/connection");
const { ObjectId } = require("mongodb");

const router = express.Router();

// GET all feedback with optional sort
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const { sort } = req.query;
    let sortQuery = { createdAt: -1 };
    if (sort === "asc") sortQuery = { rating: 1 };
    if (sort === "desc") sortQuery = { rating: -1 };
    const feedback = await db
      .collection("feedback")
      .find()
      .sort(sortQuery)
      .toArray();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET feedback by project
router.get("/project/:projectId", async (req, res) => {
  try {
    const db = getDB();
    const { sort } = req.query;
    let sortQuery = { createdAt: -1 };
    if (sort === "asc") sortQuery = { rating: 1 };
    if (sort === "desc") sortQuery = { rating: -1 };
    const feedback = await db
      .collection("feedback")
      .find({ projectId: req.params.projectId })
      .sort(sortQuery)
      .toArray();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single feedback
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const feedback = await db
      .collection("feedback")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create feedback
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { projectId, userName, rating, comment } = req.body;
    const feedback = {
      projectId,
      userName,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("feedback").insertOne(feedback);
    res.status(201).json({ _id: result.insertedId, ...feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update feedback
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { userName, rating, comment } = req.body;
    const result = await db.collection("feedback").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          userName,
          rating,
          comment,
          updatedAt: new Date(),
        },
      },
    );
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Feedback not found" });
    res.json({ message: "Feedback updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE feedback
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("feedback")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
