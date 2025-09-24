import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) res.status(403).json({ message: "Authentication required" });

  jwt.verify(String(token), process.env.TOKEN_SECRET!, (err) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    next();
  });
};

export default auth;
