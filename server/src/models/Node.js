const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  nodeTitle: {
    type: String,
    required: true,
    default: "",
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  treeId: {
    type: String,
    ref: "Tree",
    required: true,
  },
  taskId: {
    type: String,
    ref: "Task",
    default: null,
  },
  children: [
    {
      type: String,
      ref: "Node",
    },
  ],
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  focus: {
    type: Boolean,
    required: true,
    default: false,
  },
  isRoot: {
    type: Boolean,
    required: true,
    default: false,
  },
  isLeaf: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Node", nodeSchema);
