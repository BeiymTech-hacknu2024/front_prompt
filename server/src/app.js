const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Import route files
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const todoRoutes = require("./routes/todoRoutes");
const treeRoutes = require("./routes/treeRoutes");
const nodeRoutes = require("./routes/nodeRoutes");
const gptRoutes = require("./routes/gptRoutes");
const chatHistoryRoutes = require("./routes/chatHistoryRoutes");

// Mount routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/todos", todoRoutes);
app.use("/trees", treeRoutes);
app.use("/trees", gptRoutes);
app.use("/nodes", nodeRoutes);
app.use("/chatHistory", chatHistoryRoutes);

module.exports = app;
