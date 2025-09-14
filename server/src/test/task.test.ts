import { Task } from "../models/Task";
import { Types } from "mongoose";
import { User } from "../models/User";

describe("Task Model", () => {
  it("should create a few tasks with valid data", async () => {
    await User.insertMany([
      {
        name: "kunal",
        email: "kk56719@gmail.com",
        password: "plainTextPassword1",
      },
      {
        name: "neeraj",
        email: "neerajbutola19@gmail.com",
        password: "plainTextPassword2",
      },
    ]);

    const users = await User.find({});

    expect(users.length).toBeGreaterThan(0);

    const task1 = new Task({
      userId: users[0]._id,
      title: "Write backend tests",
      description: "Add unit and integration tests",
      status: "in-progress",
      priority: "medium",
    });

    await task1.save();

    const task2 = new Task({
      userId: users[1]._id,
      title: "First Project",
      status: "todo",
      priority: "low",
    });

    await task2.save();

    expect(task1.userId).toBeInstanceOf(Types.ObjectId);
    expect(typeof task1.title).toBe("string");
    expect(typeof task1.description).toBe("string");
    expect(["todo", "in-progress", "done"]).toContain(task1.status);
    expect(["low", "medium", "high"]).toContain(task1.priority);

    expect(task2.userId).toBeInstanceOf(Types.ObjectId);
    expect(typeof task2.title).toBe("string");
    expect(task2.description).toBeUndefined();
    expect(["todo", "in-progress", "done"]).toContain(task2.status);
    expect(["low", "medium", "high"]).toContain(task2.priority);
  });

  it("should default status to “pending”", async () => {
    await User.create({
      name: "kunal",
      email: "kk5667@gmail.com",
      password: "plainTextPassword1",
    });

    const users = await User.find({ name: "kunal" });

    const task = new Task({
      userId: users[0]._id,
      title: "Write backend tests",
      description: "Add unit and integration tests",
      priority: "medium",
    });

    await task.save();

    expect(task.userId).toBeInstanceOf(Types.ObjectId);
    expect(typeof task.title).toBe("string");
    expect(typeof task.description).toBe("string");
    expect(task.status).toBe("pending");
    expect(["low", "medium", "high"]).toContain(task.priority);
  });

  it("should not allow assigning to non-existent users", async () => {
    const id = new Types.ObjectId();

    const task = new Task({
      userId: id,
      title: "Write backend tests",
      description: "Add unit and integration tests",
      priority: "medium",
    });

    await expect(task.validate()).rejects.toThrow(/userId does not exist/);
  });
});
