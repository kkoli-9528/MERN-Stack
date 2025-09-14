import { User } from "../models/User.ts";
import { Task } from "../models/Task.ts";

export const seedUsers = async () => {
  await User.deleteMany({});
  await User.insertMany([
    {
      name: "kunal",
      email: "kk56719@gmail.com",
      passwordHash: "Dkd2qhoAZ&,V{53<4;WX$})3EE$8",
    },
    {
      name: "neeraj",
      email: "neerajbutola19@gmail.com",
      passwordHash: "s6Tx!4@L$U`SS\0ktf[:CnA2EN",
    },
  ]);
};

export const seedTasks = async () => {
  await Task.deleteMany({});

  const users = await User.find({});

  await Task.insertMany([
    {
      userId: users[0]._id,
      title: "Finish frontend project",
      description: "Complete all React components",
      status: "todo",
      priority: "high",
    },
    {
      userId: users[1]._id,
      title: "Write backend tests",
      description: "Add unit and integration tests",
      status: "in-progress",
      priority: "medium",
    },
  ]);
};
