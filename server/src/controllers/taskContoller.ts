import { Request, Response } from "express";
import { Task } from "../models/Task";
import z from "zod";
import { _parse } from "zod/v4/core";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const create = async (req: Request, res: Response) => {
  try {
    const { userId, title, description, status, priority } = req.body;

    if (!userId || !title || !description || !status || !priority)
      return res.status(422).json({ error: "All fields required" });

    const User = z.object({
      userId: z.hex().regex(/^[a-fA-F0-9]{24}$/),
      title: z.string().min(3),
      description: z.string().min(3),
      status: z.enum(["todo", "in-progress", "done", "pending"]),
      priority: z.enum(["low", "medium", "high"]),
    });

    const input = {
      userId,
      title,
      description,
      status,
      priority,
    };

    const data = User.parse(input);

    const task = new Task({
      userId: data.userId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
    });

    const savedData = await task.save();

    res.status(201).json({
      userId: savedData.userId,
      title: savedData.title,
      description: savedData.description,
      status: savedData.status,
      priority: savedData.priority,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      res.status(422).json({ zod_error: error.issues.map((v) => v.message) });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const read = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query: any = { userId: req.params.id };

    if (status) query.status = status;

    const tasks = await Task.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const count = await Task.countDocuments(query);

    res.status(200).json({
      data: tasks,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;

    const taskId = req.params?.id;

    const userId = req.user;

    if (!userId || typeof userId !== "object") {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!userId.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (Object.keys(updateData).length === 0)
      return res.status(422).json({ error: "Require a field to update" });

    const userSchema = z.strictObject({
      title: z.string().min(3),
      description: z.string().min(3),
      status: z.enum(["todo", "in-progress", "done", "pending"]),
      priority: z.enum(["low", "medium", "high"]),
    });

    const updateSchema = userSchema.partial();

    const validUpdateData = updateSchema.parse(updateData);

    const task = await Task.findById(taskId);

    if (task?.userId.toString() !== userId.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Task.findByIdAndUpdate(taskId, validUpdateData, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ success: true, message: "Document updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Cast to ObjectId failed")) {
        console.log(error);
        res.status(422).json({ error: "Invalid Task Id" });
      } else if (error instanceof z.ZodError) {
        console.log(error);
        res.status(422).json({ zod_error: error.issues.map((v) => v.message) });
      }
    } else {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const Id = z.hex().regex(/^[a-fA-F0-9]{24}$/);

    const id = req.params.id;

    const validId = Id.parse(id);

    const task = await Task.findById(id);

    const userId = req.user;

    if (!userId || typeof userId !== "object") {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!userId.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("userId: ", userId);

    if (task?.userId.toString() !== userId.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const deleted = await Task.findByIdAndDelete(validId);

    if (deleted === null) res.status(422).json({ error: "Invalid Task Id" });
    else {
      res
        .status(200)
        .json({ success: true, message: "Document deleted successfully" });
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof z.ZodError) {
        console.log(error);
        res.status(422).json({ zod_error: error.issues.map((v) => v.message) });
      } else {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
};

export default { create, read, update, remove };
