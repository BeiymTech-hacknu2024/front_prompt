const Node = require("../models/Node");

async function get_populated_node(nodeId) {
  try {
    const node = await Node.findById(nodeId);
    await node.populate("children");

    return node;
  } catch (err) {
    console.log(err.message);
    return {
      message: "Something Went Wrong in the Server",
    };
  }
}

module.exports = { get_populated_node };
