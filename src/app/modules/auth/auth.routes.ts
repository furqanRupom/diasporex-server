import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { authValidations } from "./auth.validation";


const router = express.Router();


router.post('/register', validateRequest(authValidations.userRegisterSchemaValidation), authController.userRegistration);

router.post('/login', validateRequest(authValidations.userLoginValidation), authController.userLogin);

export const authRoutes = router;