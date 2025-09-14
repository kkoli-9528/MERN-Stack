import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  this.password = await bcrypt.hash(String(this.password), salt);
  next();
});

export const User = model<IUser>("User", UserSchema);
