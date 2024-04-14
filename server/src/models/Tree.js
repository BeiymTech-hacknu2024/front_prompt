const mongoose = require("mongoose");

const treeSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    ref: "Node",
    required: true,
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tree", treeSchema);
