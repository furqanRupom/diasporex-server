import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse";
import { authServices } from "./auth.services"

const userRegistration = catchAsync(async(req,res,next) => {
    const result = await authServices.userRegistrationIntoDB(req.body);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User Registered successfully",
        data:result

    })
})

const userLogin = catchAsync(async (req, res, next) => {
    const result = await authServices.userLogin(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged in successfully",
        data: result

    })
})




export const authController = {
 userRegistration,
 userLogin
}