const Node = require("../models/Node");
const { Configuration, OpenAIApi } = require("openai");
const { extractTreeJson } = require("./service_extract_tree_json");
const { parseAppendNode } = require("./service_append_tree_gpt_parse");
const Tree = require("../models/Tree");
const { check_tree_for_done } = require("./service_check_tree_for_done");
const { parseChatDialog } = require("./service_chatHistory");

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_GPT_KEY,
  })
);

function generateAppendContext(appendingNodeTitle) {
  const content = `I have a description of my goal as: ${appendingNodeTitle}
    Summarize the goal as Goal and follow below commands:
    
      Now, I want to visualize my Goal in view of tree, where my root is the my Goal.
      Therefore, dividing my Goal into different subroots where each subroot represents generalized aspect which should be accomplished in order to complete the main Goal. This process of dividing root and each subroot should continue until reaching the moment when all of the leaves (the nodes which don't have any children) have a capacity to be done in within a week.
  
  So, generate me tree NOT including these nodes.
      
      Give me the result in view of object i.e node, where it has its "title" (the title of the nodes including root, sub root, and leaves) and "children" array which also consists of the same objects i.e nodes which also have their own titles and possibly empty children array if they are leaves.
  
      Also, remember that "children" should be an array and that root shouldn't have any leaves!
  
      Wrap the json file which includes tree structure between keywords: !START! and !END!
      
     Divide the tree into subnodes very, very detailed, remembering that my leaves should be reachable within a week.
    
    And, finally give your overall feedback or advice in 1 sentence to this goal, also wrapping it inside of keywords !RESPONSE START! and !RESPONSE END!
  
  And remember, no comments are allowed inside your JSON.`;

  return content;
}

async function recreateNode(userId, treeId, nodeId) {
  try {
    const node = await Node.findById(nodeId);
    const appendingNodeTitle = node.nodeTitle;

    const rootNodeId = (await Tree.findById(treeId)).nodeId;
    const rootNode = await Node.findById(rootNodeId);
    const treeTitle = rootNode.nodeTitle;

    const content = generateAppendContext(appendingNodeTitle);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    });

    const responseMessage = extractTreeJson(
      response.data.choices[0].message.content,
      "!RESPONSE START!",
      "!RESPONSE END!"
    );

    const nodeJson = JSON.parse(
      extractTreeJson(
        response.data.choices[0].message.content,
        "!START!",
        "!END!"
      )
    );
    await parseAppendNode(nodeJson, userId, treeId, nodeId);
    const request = `Recreating the node: ${node.nodeTitle} of tree: ${treeTitle}`;
    await parseChatDialog(request, responseMessage, userId);
    await check_tree_for_done(treeId);

    return "Successfully recreated!";
  } catch (err) {
    console.log(err);
    throw new Error("Server Error...");
  }
}

module.exports = { recreateNode };
