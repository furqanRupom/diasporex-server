import { authServices } from "./auth.services";
import BaseController from "../../shared/baseController";
import { Request, Response } from "express";
import httpStatus from "http-status";

class Controller extends BaseController {
 registerUser = this.catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.userRegistrationIntoDB(req.body);
  this.sendResponse(res, {
   success: true,
   statusCode: httpStatus.CREATED,
   message: "User registered successfully",
   data: result,
  });
 });

 loginUser = this.catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.userLogin(req.body);
  this.sendResponse(res, {
   success: true,
   statusCode: httpStatus.OK,
   message: "User Logged in successfully",
   data: result,
  });
 });
}

// const userRegistration = catchAsync(async (req, res, next) => {
//  const result = await authServices.userRegistrationIntoDB(req.body);
//  sendResponse(res, {
//   success: true,
//   statusCode: httpStatus.CREATED,
//   message: "User Registered successfully",
//   data: result,
//  });
// });

// const userLogin = catchAsync(async (req, res, next) => {
//  const result = await authServices.userLogin(req.body);
//  sendResponse(res, {
//   success: true,
//   statusCode: httpStatus.OK,
//   message: "User Logged in successfully",
//   data: result,
//  });
// });

// export const authController = {
//  userRegistration,
//  userLogin,
// };

export const AuthController = new Controller();
