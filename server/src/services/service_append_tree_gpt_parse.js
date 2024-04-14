const Tree = require("../models/Tree");
const Node = require("../models/Node");
const { default: mongoose } = require("mongoose");
let userId;

async function parseNodeDFS(node, depth, treeId) {
  try {
    if (node.children.length == 0) {
      await Node.create({
        nodeTitle: node.title,
        userId: userId,
        treeId: treeId,
        children: [],
        done: false,
        isRoot: depth === 0 ? true : false,
        isLeaf: true,
      });
      const lastNodeId = (
        await Node.findOne({}, {}, { sort: { createdAt: -1 } })
      )._id;
      return lastNodeId;
    } else {
      let children = [];
      for (let childInd in node.children) {
        const child = node.children[childInd];
        const childId = await parseNodeDFS(child, depth + 1, treeId);
        children.push(childId);
      }

      if (depth === 1) return children;

      await Node.create({
        nodeTitle: node.title,
        userId: userId,
        treeId: treeId,
        children: children,
        done: false,
        isRoot: depth === 0 ? true : false,
        isLeaf: false,
      });

      const lastNodeId = (
        await Node.findOne({}, {}, { sort: { createdAt: -1 } })
      )._id;
      return lastNodeId;
    }
  } catch (err) {
    console.log(err);
    throw new Error("Server Error...");
  }
}

async function parseAppendNode(nodeJson, userid, treeId, nodeId) {
  try {
    userId = userid;

    const appendedChildren = await parseNodeDFS(nodeJson, 1, treeId);
    const node = await Node.findById(nodeId);
    node.isLeaf = false;
    node.focus = false;
    node.children = [...node.children, ...appendedChildren];
    await node.save();
  } catch (err) {
    console.log(err);
    throw new Error("Server Error...");
  }
}

module.exports = { parseAppendNode };
