const express = require("express");
const authenticate = require("../middlewares/authenticate");
const TimeLog = require("../models/timelog.model");
const Task = require("../models/task.model");
const router = express.Router();

/**
 * 🟢 Start tracking for a task
 */
router.post("/start/:taskId", authenticate, async (req, res) => {
  try {
    console.log("⏱️ Start tracking requested:", {
      userId: req.id,
      taskId: req.params.taskId,
    });

    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.id,
    })
      .lean()
      .exec();

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    const active = await TimeLog.findOne({
      taskId: req.params.taskId,
      userId: req.id,
      endTime: null,
    })
      .lean()
      .exec();

    if (active) {
      return res.status(400).send({ message: "Tracking already active" });
    }

    const log = await TimeLog.create({
      taskId: req.params.taskId,
      userId: req.id,
      startTime: new Date(),
    });

    return res.status(201).send({ message: "started", data: log });
  } catch (err) {
    console.error("❌ Error in POST /time/start/:taskId:", err);
    return res.status(500).send({ message: err.message });
  }
});

/**
 * 🟢 Stop tracking for a task (closest open log)
 */
router.post("/stop/:taskId", authenticate, async (req, res) => {
  try {
    console.log("⏹️ Stop tracking requested:", {
      userId: req.id,
      taskId: req.params.taskId,
    });

    const active = await TimeLog.findOne({
      taskId: req.params.taskId,
      userId: req.id,
      endTime: null,
    }).sort({ startTime: -1 });

    if (!active) {
      return res.status(400).send({ message: "No active tracking session" });
    }

    active.endTime = new Date();
    await active.save();

    return res.status(200).send({ message: "stopped", data: active });
  } catch (err) {
    console.error("❌ Error in POST /time/stop/:taskId:", err);
    return res.status(500).send({ message: err.message });
  }
});

/**
 * 🟢 List logs for a task + total duration
 */
router.get("/task/:taskId", authenticate, async (req, res) => {
  try {
    console.log("📊 Fetching time logs:", {
      userId: req.id,
      taskId: req.params.taskId,
    });

    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.id,
    })
      .lean()
      .exec();

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    const logs = await TimeLog.find({
      taskId: req.params.taskId,
      userId: req.id,
    })
      .sort({ startTime: -1 })
      .lean()
      .exec();

    const now = Date.now();
    const totalMs = logs.reduce((sum, l) => {
      const end = l.endTime ? new Date(l.endTime).getTime() : now;
      const start = new Date(l.startTime).getTime();
      return sum + Math.max(0, end - start);
    }, 0);

    return res.status(200).send({ data: logs, totalMs });
  } catch (err) {
    console.error("❌ Error in GET /time/task/:taskId:", err);
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
