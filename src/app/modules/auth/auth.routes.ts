import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { authValidations } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post(
 "/register",
 validateRequest(authValidations.userRegisterSchemaValidation),
 AuthController.registerUser,
);

router.post(
 "/login",
 validateRequest(authValidations.userLoginValidation),
 AuthController.loginUser,
);

export const authRoutes = router;
