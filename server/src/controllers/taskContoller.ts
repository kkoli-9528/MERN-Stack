import { Request, Response } from "express";
import { Task } from "../models/Task";
import z from "zod";
import { _parse } from "zod/v4/core";

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

    await task.save();

    res.status(201).json({
      userId: task.userId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
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
    const id = req.params.id;

    const task = await Task.find({ userId: id });

    res.status(200).json(
      Object.entries(task).map(([, values]) => ({
        _id: values._id,
        userId: values.userId,
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
      }))
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;

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

    await Task.findByIdAndUpdate(req.params.id, validUpdateData, {
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
