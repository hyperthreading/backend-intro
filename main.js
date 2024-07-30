import express from "express";
import mockData from "./data/mock.js";
import { create } from "domain";
import mongoose from "mongoose";
import Todo from "./models/Todo.js";
import { DATABASE_URL } from "./env.js";

await mongoose.connect(DATABASE_URL);

const app = express();

app.use(express.json());

app.get("/todos", async (req, res) => {
  const { isComplete, sortBy } = req.query;

  const query = {};

  if (isComplete) {
    const isCompleteTypeCasted = isComplete === "true";
    query.isComplete = isCompleteTypeCasted;
  }

  const sortOptions = {};

  if (sortBy) {
    sortOptions[sortBy] = "desc";
  }

  res.json(await Todo.find(query).sort(sortOptions));
});

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  res.json(todo);
});

app.post("/todos", (req, res) => {
  const { title, isComplete } = req.body;
  const newTodo = {
    id: mockData.length + 1,
    title,
    isComplete,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockData.push(newTodo);
  res.json(newTodo);
});

app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const patchData = req.body;
  const todo = mockData.find((todo) => todo.id === Number(id));

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }
  
  for (const key of Object.keys(patchData)) {
    todo[key] = patchData[key];
  }
  todo.updatedAt = new Date();
  res.json(todo);
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todoIndex = mockData.findIndex((todo) => todo.id === Number(id));

  if (todoIndex === -1) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  mockData.splice(todoIndex, 1);
  res.json({ id: Number(id) });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});