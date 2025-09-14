import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { ObjectId } from "mongodb";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(422).json({ error: "All fields required" });

    const email_exists = await User.findOne({ email: email });

    if (email_exists) return res.status(400).json({ error: "User not found" });

    const user = await User.create({
      name,
      email,
      password,
    });

    res.clearCookie("token");

    const token = signToken(new ObjectId(String(user._id)));

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res
      .status(200)
      .json({ id: user._id, message: "User successfully created" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(422).json({ error: "All fields required" });

    const user = await User.findOne({ email: email });

    if (!user) return res.status(400).json({ error: "User already exists" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.clearCookie("token");

    const token = signToken(new ObjectId(String(user._id)));

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res
      .status(200)
      .json({ id: user._id, message: "User successfully logged in" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { register, login };
