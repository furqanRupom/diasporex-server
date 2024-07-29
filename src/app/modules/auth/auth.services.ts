import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../prisma";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { config } from "../../config";

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
        const { name, email, role } = user;
        /* create access token */
        const accessToken = jwtHelpers.generateToken(
            { name, email, role },
            config.secret_access_token as string,
            config.access_token_expires_in as string,
        );
        /* create refresh token */
        const refreshToken = jwtHelpers.generateToken(
            { name, email, role },
            config.refresh_token as string,
            config.refresh_token_exp as string,
        );
        return {
            accessToken,
            refreshToken,
        };
    }
}

export const AuthService = new Service();
