import { model, Schema, Document, Types } from "mongoose";
import { User } from "./User";

interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string | undefined;
  status: "todo" | "in-progress" | "done" | "pending";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: undefined },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done", "pending"],
      index: true,
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

TaskSchema.pre("validate", async function (this: ITask) {
  const userExists = await User.exists({ _id: this.userId });
  if (!userExists) this.invalidate("userId", "userId does not exist");
});

export const Task = model<ITask>("Task", TaskSchema);
