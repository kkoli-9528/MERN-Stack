import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config({ quiet: true });

export const signToken = (id: ObjectId) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn: "15m",
  });
};
