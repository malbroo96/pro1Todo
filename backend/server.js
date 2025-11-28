import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env

const app = express();
app.use(express.json());
app.use(cors());

// -------------------------------------------
//  MONGODB CONNECTION
// -------------------------------------------
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// -------------------------------------------
//  SCHEMA & MODEL
// -------------------------------------------
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

// -------------------------------------------
//  ROUTES
// -------------------------------------------

// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add a new todo
app.post("/todos", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: false,
  });

  const saved = await todo.save();
  res.json(saved);
});

// Update text
app.put("/todos/:id", async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true }
  );
  res.json(updated);
});

// Update completed status
app.patch("/todos/:id", async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updated);
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo Deleted" });
});

// -------------------------------------------
//  SERVER START
// -------------------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
