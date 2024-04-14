const mongoose = require("mongoose");

const ChatDialogSchema = new mongoose.Schema({
  request: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ChatDialog", ChatDialogSchema);
