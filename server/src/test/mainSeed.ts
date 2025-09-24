import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Task } from "../models/Task";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

async function seed() {
  try {
    if (
      typeof process.env.MONGO_DB_URL !== "string" ||
      !process.env.MONGO_DB_URL.trim()
    )
      throw new Error("DB Connection Failed");

    const MONGO_URI = process.env.MONGO_DB_URL;

    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Task.deleteMany({});
    console.log("Cleared existing tasks");

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const password = await bcrypt.hash("hashedpassword123", salt);

    const users = await User.insertMany(
      Array.from({ length: 5 }).map(() => ({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: password,
      }))
    );

    const tasks = Array.from({ length: 50 }).map(() => ({
      userId: faker.helpers.arrayElement(users)._id,
      title: faker.lorem.words(),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement([
        "todo",
        "in-progress",
        "done",
        "pending",
      ]),
      priority: faker.helpers.arrayElement(["low", "medium", "high"]),
    }));

    await Task.insertMany(tasks);
    console.log("Inserted dummy tasks:", tasks.length);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seed();
