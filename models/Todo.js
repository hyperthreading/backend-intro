import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  isComplete: Boolean,
}, {
  timestamps: true,
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;