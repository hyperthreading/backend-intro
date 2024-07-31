import express from "express";
import mockData from "./data/mock.js";
import mongoose from "mongoose";
import Todo from "./models/Todo.js";
import { DATABASE_URL, PORT } from "./env.js";

await mongoose.connect(DATABASE_URL);

const app = express();

app.use(express.json());

const asyncHandler = (handler) => (req, res, next) => {
  handler(req, res, next).catch(next);
};

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

app.post(
  "/todos",
  asyncHandler(async (req, res) => {
    const { title, isComplete } = req.body;
    const newTodo = await Todo.create({
      title,
      isComplete,
    });
    res.json(newTodo);
  })
);

app.patch(
  "/todos/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const patchData = req.body;
    const todo = await Todo.findById(id);

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    for (const key of Object.keys(patchData)) {
      todo[key] = patchData[key];
    }
    await todo.save();

    res.json(todo);
  })
);

app.delete(
  "/todos/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ id });
  })
);

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    res.status(400).json({ message: err.message });
    return;
  } else {
    res
      .status(500)
      .json({ message: "Internal Server Error", content: err.message });
    return;
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
