const express = require("express");
const mongoose = require("mongoose");
const ToDo = require("../models/ToDo");
const { getUser } = require("../middlewares/authMiddleware");
const {
  check_tree_for_done,
} = require("../services/service_check_tree_for_done");
const Tree = require("../models/Tree");

const router = express.Router();

// Get all todos route
router.get("/", getUser, async (req, res) => {
  // Get all todos logic
  try {
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // Handle invalid userId here
      return res.status(400).json({ message: "Invalid userId" });
    }

    const todos = await ToDo.find({ userId: userId }).populate("taskId");
    res
      .status(200)
      .json({ todos: todos, meassage: "All todos were retrieved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong in the Server" });
  }
});

// Update boards route
router.post("/boardsUpdate", getUser, async (req, res) => {
  // Update boards logic
  try {
    const { mergedTodos } = req.body;
    const treeId = mergedTodos[0].treeId;

    await mergedTodos.forEach(async (item) => {
      const todo = await ToDo.findById(item._id);
      todo.order = item.order;
      todo.boardId = item.boardId;
      todo.done = item.done;
      todo.treeId = item.treeId;
      await todo.save();
    });

    await check_tree_for_done(treeId);

    res.json({ message: "Successfully updated Boards" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong in the Server" });
  }
});

// Rechecking todos route
router.post("/", getUser, async (req, res) => {
  // Rechecking todo logic
  try {
    const { todoIds } = req.body;
    const treeId = (await ToDo.findById(todoIds[0])).treeId;

    for (const todoId of todoIds) {
      const todo = await ToDo.findById(todoId);

      todo.boardId = todo.done ? 0 : 3;
      todo.done = !todo.done;

      await todo.save();
    }

    await check_tree_for_done(treeId);

    res.json({ message: "Successfully Updated the Tree" });
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

// Rechecking todo route
router.post("/:todoId", getUser, async (req, res) => {
  // Rechecking todo logic
  try {
    const { todoId } = req.params;
    const todo = await ToDo.findOne({ _id: todoId, userId: req.userId });

    todo.boardId = todo.done ? 0 : 3;
    todo.done = !todo.done;

    await todo.save();

    await check_tree_for_done(todo.treeId);

    res.json({ message: "Successfully Toggled the ToDo" });
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

module.exports = router;
