const express = require("express");
const { getUser } = require("../middlewares/authMiddleware");

const { Configuration, OpenAIApi } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { parseTree } = require("../services/service_tree_gpt_parse");
const { parseChatDialog } = require("../services/service_chatHistory");
const { extractTreeJson } = require("../services/service_extract_tree_json");
const { appendNode } = require("../services/service_append_node");
require("dotenv").config();

const router = express.Router();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_GPT_KEY,
  })
);

const geminiai = new GoogleGenerativeAI(process.env.API_KEY);

function generateContent(request) {
  const content = `I have a description of my goal as: ${request}
  Summarize the goal as Goal and follow below commands:
  
    Now, I want to visualize my Goal in view of tree, where my root is the my Goal.
    Therefore, dividing my Goal into different subroots where each subroot represents generalized aspect which should be accomplished in order to complete the main Goal. This process of dividing root and each subroot should continue until reaching the moment when all of the leaves (the nodes which don't have any children) have a capacity to be done in within a week.
    
    Give me the result in view of object i.e node, where it has its "title" (the title of the nodes including root, sub root, and leaves) and "children" array which also consists of the same objects i.e nodes which also have their own titles and possibly empty children array if they are leaves.
    Also, generate between 20 and 40 nodes including the root, subroots, and leaves.

    For example, the structure should be similar to this:
    {
      "title": "Some node title",
      "children": [
        {
          "title": String = "Some children node title",
          "children": Array = [other nodes...]
        }
      ]
    }
    Also, remember that "children" should be an array and that root shouldn't have any leaves !
    Also, if there is no children inside one node, make as {
      "title": "Some node title",
      "children": [
      ]
    }

    Wrap the json file which includes tree structure between keywords: !START! and !END!
    
   Divide the tree into subnodes very, very detailed, remembering that my leaves should be reachable within a week.
  
  And, finally give your overall feedback or advice in 1 sentence to this goal, also wrapping it inside of keywords !RESPONSE START! and !RESPONSE END!`;

  return content;
}

// generating new tree
// router.post("/gpt/new", getUser, async (req, res) => {
//   try {
//     const { request } = req.body;

//     const content = generateContent(request);

//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: content }],
//     });

//     console.log(response);

//     const responseMessage = extractTreeJson(
//       response.data.choices[0].message.content,
//       "!RESPONSE START!",
//       "!RESPONSE END!"
//     );

//     const treeJson = JSON.parse(
//       extractTreeJson(
//         response.data.choices[0].message.content,
//         "!START!",
//         "!END!"
//       )
//     );

//     console.log("treeJson");
//     console.log(treeJson);

//     const treeId = await parseTree(treeJson, req.userId);
//     await parseChatDialog(request, responseMessage, req.userId);

//     res.status(200).json({
//       treeId: treeId,
//       message: "Successfully Prompted",
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(501).json({ message: "Something Went Wrong in the Server" });
//   }
// });

router.post("/gpt/new", getUser, async (req, res) => {
  try {
    const { request } = req.body;

    const content = generateContent(request);

    // const response = await geminiai.getGenerativeModel({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: content }],
    // });

    const model = geminiai.getGenerativeModel({
      model: "gemini-pro",
      // messages: [{ role: "user", content: content }],
    });

    const result = await model.generateContent(content);
    const text = result.response;
    const response = text.text();

    let cleanedText = response.replace(
      /!START!|!END!|\*\*!RESPONSE START!\*\*/g,
      ""
    );

    // console.log(cleanedText);

    const responseMessage = extractTreeJson(
      response,
      "!RESPONSE START!",
      "!RESPONSE END!"
    );

    console.log(response);

    const treeJson = JSON.parse(extractTreeJson(response, "!START!", "!END!"));

    // console.log("treeJson");
    // console.log(treeJson);

    const treeId = await parseTree(treeJson, req.userId);
    await parseChatDialog(request, responseMessage, req.userId);

    res.status(200).json({
      treeId: treeId,
      message: "Successfully Prompted",
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

router.post("/gpt/append/:treeId/:nodeId", getUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { treeId, nodeId } = req.params;

    await appendNode(userId, treeId, nodeId)
      .then((resposne) => {
        res.status(201).json({ message: "Successfully Appended" });
      })
      .catch((err) => {
        console.log(err);
        res.status(501).json({ message: "Something Went Wrong in the Server" });
      });
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

module.exports = router;
