import { NextFunction, Request, Response } from "express";

const validateAuthorization =
 (role: string) => async (req: Request, res: Response, next: NextFunction) => {
  console.log("called", role);
 };

export default validateAuthorization;
