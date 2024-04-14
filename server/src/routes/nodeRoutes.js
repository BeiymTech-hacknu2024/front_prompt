const express = require("express");
const Tree = require("../models/Tree");
const Node = require("../models/Node");
const { getUser } = require("../middlewares/authMiddleware");
const { deleteTask } = require("../services/service_tasks");
const Task = require("../models/Task");
const { recreateNode } = require("../services/service_recreate_node");
const {
  check_tree_for_done,
} = require("../services/service_check_tree_for_done");

const router = express.Router();

// creating new Node
router.post("/new", getUser, async (req, res) => {
  try {
    const { parNodeId, curNode } = req.body;
    const userId = req.userId;
    await Node.create({
      nodeTitle: curNode.nodeTitle,
      userId: userId,
      children: [],
      isLeaf: true,
    });
    const curNodeId = (await Node.findOne({}, {}, { sort: { createdAt: -1 } }))
      ._id;
    const parNode = await Node.findById(parNodeId);
    parNode.children.push(curNodeId);
    // parNode.isRoot = false;
    parNode.done = false;
    parNode.isLeaf = false;
    await parNode.save();

    res.status(201).json({ message: "Successfully created new Node" });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({ message: "Something Went Wrong in the Server" });
  }
});

async function deleteSubNode(curNodeId, userId, depth) {
  const curNode = await Node.findById(curNodeId);
  if (!curNode) return;

  if (curNode.children.length == 0) {
    // leaf
    if (curNode.taskId) await deleteTask(curNode.taskId, userId);
    await Node.deleteOne({ _id: curNodeId });
    return;
  }
  for (let childInd in curNode.children) {
    const childId = curNode.children[childInd];
    deleteSubNode(childId, userId, depth + 1);
  }
  if (depth !== 0) await Node.deleteOne({ _id: curNodeId });
}

// recreating the subNode
router.post("/recreate", getUser, async (req, res) => {
  try {
    const { nodeId } = req.body;
    const userId = req.userId;
    // console.log(nodeId);
    const node = await Node.findById(nodeId);
    await deleteSubNode(nodeId, userId, 0);
    node.children = [];
    await node.save();

    await recreateNode(userId, node.treeId, nodeId)
      .then(async (response) => {
        await check_tree_for_done(node.treeId);
        res.status(201).json({
          message: "Successfully recreated",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Something Went Wrong in the Server",
        });
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Something Went Wrong in the Server",
    });
  }
});

// deleting the subNode
router.post("/delete", getUser, async (req, res) => {
  try {
    const { nodeId } = req.body;
    const userId = req.userId;
    // console.log(nodeId);

    await deleteSubNode(nodeId, userId);
    await Node.deleteOne({ _id: nodeId });

    const tree = await Tree.findOne({ nodeId: nodeId });
    if (tree) await Tree.deleteOne({ _id: tree._id });
    else await check_tree_for_done(tree._id);

    res.status(201).json({
      message: "Successfully deleted",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "Something Went Wrong in the Server",
    });
  }
});

// set Focus to the Leaf node
router.post("/focus", getUser, async (req, res) => {
  try {
    const { nodeId } = req.body;
    const userId = req.userId;
    const node = await Node.findById(nodeId);

    await Task.create({
      taskTitle: node.nodeTitle,
      userId: userId,
      treeId: node.treeId,
      isNode: true,
      nodeId: nodeId,
    });
    const taskId = (await Task.findOne({}, {}, { sort: { createdAt: -1 } }))
      ._id;

    node.focus = true;
    node.taskId = taskId.toString();
    await node.save();
    res.status(201).json({
      message: "Successfully set Focus",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "Something Went Wrong in the Server",
    });
  }
});

module.exports = router;
