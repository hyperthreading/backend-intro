import mongoose from 'mongoose';

const DATABASE_URL = "mongodb+srv://test_codeit:codeit1234@cluster0.ghbh8pn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

await mongoose.connect(DATABASE_URL);

console.log("Connected to MongoDB");

await mongoose.disconnect();