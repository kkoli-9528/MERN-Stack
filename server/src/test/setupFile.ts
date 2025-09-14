import mongoose from "mongoose";
import { User } from "../models/User";
import { Task } from "../models/Task";

beforeAll(async () => {
  try {
    if (
      typeof process.env["MONGO_URI"] !== "string" ||
      !process.env["MONGO_URI"]
    )
      throw new Error("DB Connection Failed");
    await mongoose.connect(process.env["MONGO_URI"]);
    await User.syncIndexes();
    await Task.syncIndexes();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

beforeEach(async () => {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
  } catch (error) {
    console.error(error);
  }
});

afterAll(async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
