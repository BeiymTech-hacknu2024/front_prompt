const express = require("express");
const ChatDialog = require("../models/ChatDialog");
const router = express.Router();
const { getUser } = require("../middlewares/authMiddleware");

// get all of the chat history
router.get("/", getUser, async (req, res) => {
  try {
    const userId = req.userId;
    const chatHistory = await ChatDialog.find({ userId: userId });
    res.status(200).json({
      chatHistory: chatHistory,
      message: "Successfully retrieved the chat history",
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

module.exports = router;
