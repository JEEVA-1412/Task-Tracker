import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Todos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define Schema
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  status: { type: String, enum: ["started", "progress", "completed"], default: "started" },
  assignedTo: { type: String, required: true },
});

// ✅ Model (Collection name = todo)
const Todo = mongoose.model("todo", todoSchema);

// ✅ Routes

// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add a new todo
app.post("/todos", async (req, res) => {
  const { task, status, assignedTo } = req.body;
  try {
    const newTodo = new Todo({ task, status, assignedTo });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(400).json({ error: "Failed to add todo" });
  }
});

// Update a todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { task, status, assignedTo } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { task, status, assignedTo },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ error: "Failed to update todo" });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Todo.findByIdAndDelete(id);
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete todo" });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
