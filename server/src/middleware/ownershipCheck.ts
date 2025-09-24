import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ownershipCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);

    if (typeof decoded === "string" || !("id" in decoded)) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default ownershipCheck;
