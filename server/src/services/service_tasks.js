const Task = require("../models/Task");
const ToDo = require("../models/ToDo");
const Node = require("../models/Node");

async function deleteTask(taskId, userId) {
  try {
    const task = await Task.findById(taskId);

    if (task.nodeId) {
      const node = await Node.findById(task.nodeId);
      if (node) {
        node.focus = false;
        node.save();
      }
    }

    await ToDo.deleteMany({ userId: userId, taskId: taskId });
    await Task.deleteOne({ _id: taskId, userId: userId });
  } catch (err) {
    console.log("Error: ");
    console.log(err.message);
  }
}

module.exports = { deleteTask };
