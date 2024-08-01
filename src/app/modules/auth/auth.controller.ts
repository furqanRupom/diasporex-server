import BaseController from "../../shared/baseController";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.services";

class Controller extends BaseController {
    registerUser = this.catchAsync(async (req: Request, res: Response) => {
        const result = await AuthService.registerUser(req.body);
        this.sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User registered successfully",
            data: result,
        });
    });

    loginUser = this.catchAsync(async (req: Request, res: Response) => {
        const result = await AuthService.loginUser(req.body);
        this.sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged in successfully",
            data: result,
        });
    });

    forgotPassword = this.catchAsync(async(req:Request,res:Response) => {
        const result = await AuthService.forgotPassword(req.body);
        this.sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Check your Email ",
            data: result,
        });
    })

    resetPassword = this.catchAsync(async (req: Request, res: Response) => {
        const token = req.headers.authorization || "";
        const result = await AuthService.resetPassword(token,req.body);
        this.sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Password reset successfully ",
            data: result,
        });
    });
}

export const AuthController = new Controller();
