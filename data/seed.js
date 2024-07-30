import mongoose, { mongo } from "mongoose";
import Todo from "../models/Todo.js";
import { DATABASE_URL } from "../env.js";
import mockData from "./mock.js";

await mongoose.connect(DATABASE_URL);

await Todo.deleteMany();
await Todo.insertMany(mockData);

await mongoose.disconnect();
