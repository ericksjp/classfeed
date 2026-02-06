import jwt from "jsonwebtoken";
import authConfig from "../config/authConfig";
import { RequestHandler } from "express";
import { ZodError, ZodIssue } from "zod";
import { ModelStatic, Model } from "sequelize";

export function generateToken(payload: { [key: string]: string }) {
    return jwt.sign(payload, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
    });
}

export function tryCatch(...middlewares: RequestHandler[]): RequestHandler[] {
    return middlewares.map((middleware) => {
        return async function (req, res, next) {
            try {
                await middleware(req, res, next);
            } catch (error) {
                return next(error);
            }
        };
    });
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    if (error && typeof error === "object" && "message" in error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    return "An error occured";
}

export function extractZodErrors(error: ZodError): { [key: string]: string } {
    return error.errors.reduce((obj: { [key: string]: string }, err: ZodIssue) => {
        obj[err.path[0]] = err.message;
        return obj;
    }, {});
}

export function sanitizeObject<T extends object>(
    obj: T,
    transformations: { [K in keyof T]?: () => T[K] | undefined },
): Partial<T> {
    const newObject = JSON.stringify(obj, (key, value) => {
        const func = transformations[key as keyof T];
        return func ? func() : value;
    });

    return JSON.parse(newObject);
}

export function validateModels(
    currentModel: string,
    required: string[],
    models: { [key: string]: ModelStatic<Model> },
): void {
    const missingModels = required.filter((modelName) => !models[modelName]);

    if (missingModels.length === 0) return;

    const availableModels = Object.keys(models).sort();

    throw new Error(
        `Missing required model${missingModels.length > 1 ? "s" : ""} for association with "${currentModel}" model:\n` +
            `• Missing: ${missingModels.map((m) => `"${m}"`).join(", ")}\n` +
            `• Available models: ${availableModels.map((m) => `"${m}"`).join(", ")}`,
    );
}

export function generateOTP(length: number) {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
