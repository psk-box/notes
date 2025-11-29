import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/notes";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    return await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectToDatabase;