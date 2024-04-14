const Tree = require("../models/Tree");
const Node = require("../models/Node");
const Task = require("../models/Task");
const ToDo = require("../models/ToDo");

async function check_task_for_done(node) {
  if (!node.taskId) return 0;
  const taskId = node.taskId;

  const task = await Task.findById(taskId);
  let num_children_done = 0;

  for (const todoId of task.todos) {
    const todo = await ToDo.findById(todoId);
    if (todo.done) num_children_done++;
  }

  if (num_children_done === task.todos.length && num_children_done !== 0) {
    task.done = true;
    await task.save();
    return 1;
  } else {
    task.done = false;
    await task.save();
    return 0;
  }
}

async function dfs_is_done(curNodeId) {
  const curNode = await Node.findById(curNodeId);
  if (!curNode) return 0;

  // reached leaf node
  if (curNode.children.length === 0) {
    const isTaskDone = await check_task_for_done(curNode);
    if (isTaskDone) {
      curNode.done = true;
      await curNode.save();
      return 1;
    } else {
      curNode.done = false;
      await curNode.save();
      return 0;
    }
  }

  // else moving to the subNode:
  let num_children_done = 0,
    tot_children = 0;

  for (const childId of curNode.children) {
    if (await Node.findById(childId)) tot_children++;

    const isChildDone = await dfs_is_done(childId);
    if (isChildDone) num_children_done++;
  }

  if (num_children_done === tot_children) {
    curNode.done = true;
    await curNode.save();
    return 1;
  } else {
    curNode.done = false;
    await curNode.save();
    return 0;
  }
}

async function check_tree_for_done(treeId) {
  const tree = await Tree.findById(treeId);
  if (!tree) return 0;

  const isTreeDone = await dfs_is_done(tree.nodeId);

  if (isTreeDone) {
    tree.done = true;
    await tree.save();
    return 1;
  } else {
    tree.done = false;
    await tree.save();
    return 0;
  }
}

module.exports = { check_tree_for_done };
