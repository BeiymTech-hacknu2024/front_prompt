const Tree = require("../models/Tree");
const Node = require("../models/Node");
const { default: mongoose } = require("mongoose");
let userId;

async function parseNodeDFS(node, depth, treeId) {
  // console.log(nod);

  if (node.children == undefined || node.children.length == 0) {
    await Node.create({
      nodeTitle: node.title,
      userId: userId,
      treeId: treeId,
      children: [],
      done: false,
      isRoot: depth === 0 ? true : false,
      isLeaf: true,
    });
    const lastNodeId = (await Node.findOne({}, {}, { sort: { createdAt: -1 } }))
      ._id;
    return lastNodeId;
  } else {
    let children = [];
    for (let childInd in node.children) {
      const child = node.children[childInd];
      const childId = await parseNodeDFS(child, depth + 1, treeId);
      children.push(childId);
    }
    // console.log(children);
    await Node.create({
      nodeTitle: node.title,
      userId: userId,
      treeId: treeId,
      children: children,
      done: false,
      isRoot: depth === 0 ? true : false,
      isLeaf: false,
    });

    const lastNodeId = (await Node.findOne({}, {}, { sort: { createdAt: -1 } }))
      ._id;
    return lastNodeId;
  }
}

async function parseTree(treeJson, userid) {
  userId = userid;
  const treeObjectId = new mongoose.Types.ObjectId();
  const treeId = treeObjectId.toString();

  const rootNodeId = await parseNodeDFS(treeJson, 0, treeId);
  await Tree.create({
    _id: treeObjectId,
    nodeId: rootNodeId,
    userId: userId,
    done: false,
  });

  const lastTreeId = (await Tree.findOne({}, {}, { sort: { createdAt: -1 } }))
    ._id;
  return lastTreeId;
}

module.exports = { parseTree };
