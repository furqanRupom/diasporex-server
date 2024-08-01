import { Status, User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../prisma";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { config } from "../../config";
import { JwtPayload } from "jsonwebtoken";
import EmailSender from "../../mailer/EmailSender";
import verifyToken from "../../middlewares/verifyToken";
import ApiError from "../../middlewares/apiError";
import httpStatus from "http-status";

class Service {
    async registerUser(payload: User) {
        const hashedPassword = await bcrypt.hash(payload.password, 12);
        const createUser = await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: hashedPassword,
            },
            select: {
                name: true,
                email: true,
            },
        });
        return createUser;
    }

    async loginUser(payload: { email: string; password: string }) {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: payload.email,
            },
        });
        const isPasswordMatched = await bcrypt.compare(
            payload.password,
            user.password,
        );
        if (!isPasswordMatched) {
            throw new Error("password is incorrect");
        }
        const { name, email, role, id } = user;
        /* create access token */
        const accessToken = jwtHelpers.generateToken(
            { name, email, role, id },
            config.secret_access_token as string,
            config.access_token_expires_in as string,
        );
        /* create refresh token */
        const refreshToken = jwtHelpers.generateToken(
            { name, email, role, id },
            config.refresh_token as string,
            config.refresh_token_exp as string,
        );
        return {
            accessToken,
            refreshToken,
        };
    }



    async forgotPassword(payload: JwtPayload) {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: payload.email,
                status: Status.ACTIVE
            }
        });

        const resetToken = jwtHelpers.generateToken({id:user.id,name:user.name,email:user.email,role:user.role},config.reset_pass_token as string,config.reset_pass_exp as string)


        const resetPassLink = config.reset_pass_link + `/reset-password?userId=${user.id}&token=${resetToken}`
          

        EmailSender(payload.email as string,resetPassLink)
    }


    async resetPassword(token:string,payload: { id: string, password: string }) {
        const validToken = jwtHelpers.verifyToken(token, config.reset_pass_token as string)

        if (!validToken) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token provided')
        }

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: payload.id,
                status: Status.ACTIVE
            }
        })

     

        const hashedPassword = await bcrypt.hash(payload.password, 12);
        const resetPassword = await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                password: hashedPassword
            },
            select:{
                id:true,
                name:true,
                email:true,
                role:true
            }
        })
        return resetPassword;
    }
}

export const AuthService = new Service();
