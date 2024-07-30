import { NextFunction, Request, Response } from "express";
import ApiError from "./apiError";

interface CustomRequest extends Request {
 role?: string;
}

const validateAuthorization =
 (allowedRoles: string[]) =>
 async (req: CustomRequest, res: Response, next: NextFunction) => {
  const role = req.role;

  if (role && !allowedRoles.includes(role)) {
   throw new ApiError(403, "Forbidden access!");
  }
  next();
 };

export default validateAuthorization;
