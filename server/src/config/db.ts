import mongoose from "mongoose";
import dotenv from "dotenv";

const db = async () => {
  try {
    dotenv.config({ quiet: true });
    if (
      typeof process.env.MONGO_DB_URL !== "string" ||
      !process.env.MONGO_DB_URL.trim()
    )
      throw new Error("DB Connection Failed");
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default db;
