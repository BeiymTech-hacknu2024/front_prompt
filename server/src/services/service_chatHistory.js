const ChatDialog = require("../models/ChatDialog");

async function parseChatDialog(request, response, userId) {
  try {
    await ChatDialog.create({
      request: request,
      response: response,
      userId: userId,
    });
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = { parseChatDialog };
