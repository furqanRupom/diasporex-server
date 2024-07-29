import { NextFunction, Request, Response } from "express";
import { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "./apiError";
import { jwtHelpers } from "../helpers/jwtHelpers";

// Define a custom type for extending the Request object
type CustomRequest = Request & {
 name?: string;
 email?: string;
 role?: string;
};

// Define a custom type for extending the JWT Payload object
type CustomJWTPayload = JwtPayload & {
 name?: string;
 email?: string;
 role?: string;
};

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
 const token = req.headers.authorization;
 if (token) {
  const isVerified: CustomJWTPayload | null = jwtHelpers.verifyToken(
   token,
   process.env.JWT_TOKEN as Secret,
  );
  if (!isVerified) {
   throw new ApiError(400, "Invalid token");
  } else {
   // Assign custom properties to the req object
   req.name = isVerified?.id as string;
   req.email = isVerified?.email as string;
   req.role = isVerified?.role as string;

   next();
  }
 } else {
  throw new ApiError(400, "Token not found");
 }
};

export default verifyToken;
