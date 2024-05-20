import { NextFunction, Request, Response } from "express";

export async function isLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.username) {
    next();
  } else {
    res.status(400).json({ message: "You are not logged in" });
  }
}
