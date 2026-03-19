const express = require("express");
const { getDB } = require("../db/connection");
const { ObjectId } = require("mongodb");

const router = express.Router();

// GET all bookmarks
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const bookmarks = await db
      .collection("bookmarks")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET bookmarks by user
router.get("/user/:userName", async (req, res) => {
  try {
    const db = getDB();
    const bookmarks = await db
      .collection("bookmarks")
      .find({ userName: req.params.userName })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single bookmark
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const bookmark = await db
      .collection("bookmarks")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create bookmark
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { projectId, userName, note } = req.body;
    const bookmark = {
      projectId,
      userName,
      note,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("bookmarks").insertOne(bookmark);
    res.status(201).json({ _id: result.insertedId, ...bookmark });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update bookmark
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { note } = req.body;
    const result = await db.collection("bookmarks").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          note,
          updatedAt: new Date(),
        },
      },
    );
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Bookmark not found" });
    res.json({ message: "Bookmark updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE bookmark
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("bookmarks")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Bookmark not found" });
    res.json({ message: "Bookmark deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
