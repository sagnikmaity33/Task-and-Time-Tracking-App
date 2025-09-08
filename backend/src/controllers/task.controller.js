const express = require("express");
const authenticate = require("../middlewares/authenticate");
const Task = require("../models/task.model");
const router = express.Router();

/**
 * 🛠️ Utility: Convert frontend filter/status to DB format
 */
const normalizeStatus = (status) => {
  if (status === "pending") return "Pending";
  if (status === "completed") return "Completed";
  if (status === "in-progress") return "In Progress";
  return status;
};

/**
 * 🟢 Get tasks (with optional filter & tag)
 */
router.get("/:id", authenticate, async (req, res) => {
  try {
    console.log("✅ Authenticated User ID:", req.id);

    const filter = req.query.filter;
    let tasks;

    if (req.params.id === "all") {
      if (filter === "all") {
        tasks = await Task.find({ userId: req.id }).lean().exec();
      } else {
        const dbStatus = normalizeStatus(filter);
        tasks = await Task.find({ userId: req.id, status: dbStatus })
          .lean()
          .exec();
      }
    } else {
      if (filter === "all") {
        tasks = await Task.find({ userId: req.id, tag: req.params.id })
          .lean()
          .exec();
      } else {
        const dbStatus = normalizeStatus(filter);
        tasks = await Task.find({
          userId: req.id,
          tag: req.params.id,
          status: dbStatus,
        })
          .lean()
          .exec();
      }
    }

    return res.status(200).send({ data: tasks, status: "success" });
  } catch (error) {
    console.error("❌ Error in GET /task/:id:", error);
    res.status(500).send({ message: error.message });
  }
});

/**
 * 🟢 Add a new task
 */
router.post("/addtask", authenticate, async (req, res) => {
  try {
    req.body.userId = req.id;
    const task = await Task.create(req.body);
    res.status(201).send({ status: "success", data: task });
  } catch (error) {
    console.error("❌ Error in POST /task/addtask:", error);
    res.status(500).send({ message: error.message });
  }
});

/**
 * 🟢 Get task counts by tag
 */
router.get("/gettask/auth", authenticate, async (req, res) => {
  try {
    console.log("✅ Authenticated User ID:", req.id);

    const All = (await Task.countDocuments({ userId: req.id })) || 0;
    const Personal =
      (await Task.countDocuments({ userId: req.id, tag: "personal" })) || 0;
    const Official =
      (await Task.countDocuments({ userId: req.id, tag: "official" })) || 0;
    const Others =
      (await Task.countDocuments({ userId: req.id, tag: "others" })) || 0;

    res.status(200).send({
      All,
      Personal,
      Official,
      Others,
      message: "success",
    });
  } catch (error) {
    console.error("❌ Error in GET /task/gettask/auth:", error);
    res.status(500).send({ message: error.message });
  }
});

/**
 * 🟢 Update a task
 */
router.patch("/:id", authenticate, async (req, res) => {
  try {
    if (req.body.status) {
      req.body.status = normalizeStatus(req.body.status);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.id },
      req.body
    );

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send({ message: "success" });
  } catch (error) {
    console.error("❌ Error in PATCH /task/:id:", error);
    res.status(500).send({ message: error.message });
  }
});

/**
 * 🟢 Delete a task
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.id,
    });

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send({ message: "success" });
  } catch (error) {
    console.error("❌ Error in DELETE /task/:id:", error);
    res.status(500).send({ message: error.message });
  }
});

/**
 * 🟢 Update a subtask
 */
router.patch("/:id/:subid", authenticate, async (req, res) => {
  try {
    const taskOwner = await Task.findOne({
      _id: req.params.id,
      userId: req.id,
    })
      .lean()
      .exec();

    if (!taskOwner) {
      return res.status(404).send({ message: "Task not found" });
    }

    if (req.body.status) {
      req.body.status = normalizeStatus(req.body.status);
    }

    await Task.updateOne(
      { _id: req.params.id, "subtasks._id": req.params.subid },
      { $set: { "subtasks.$": req.body } }
    );

    res.status(200).send({ message: "success" });
  } catch (error) {
    console.error("❌ Error in PATCH /task/:id/:subid:", error);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
