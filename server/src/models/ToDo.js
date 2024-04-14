const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todoTitle: {
    type: String,
    required: true,
    default: "",
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  taskId: {
    type: String,
    ref: "Task",
    required: true,
  },
  treeId: {
    type: String,
    ref: "Tree",
    default: null,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  boardId: {
    required: true,
    type: Number,
    default: 0,
  },
  order: {
    required: true,
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("ToDo", todoSchema);
