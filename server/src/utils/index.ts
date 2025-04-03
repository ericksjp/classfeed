import jwt from "jsonwebtoken";
import authConfig from "../config/authConfig";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";

export function generateToken(str: string) {
  return jwt.sign({ id: str }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
}

export function catchError(...middlewares: ((req: Request, res: Response, next: NextFunction) => Promise<unknown | void> | void)[]) {
  return middlewares.map((middleware) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await middleware(req, res, next);
    } catch (error) {
      return next(error);
    }
  });
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (error && typeof error === "object" && "message" in error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "An error occured"
}

export function extractZodErrors(error: ZodError): { [key: string]: string } {
  return error.errors.reduce((obj: { [key: string]: string }, err: ZodIssue) => {
    obj[err.path[0]] = err.message;
    return obj;
  }, {});
}

export function sanitizeObject<T extends object>(
  obj: T,
  transformations: {
    [K in keyof T]?: () => T[K] | undefined 
  },
): Partial<T> {
  const newObject = JSON.stringify(obj, (key, value) => {
    const func = transformations[key as keyof T];
    return func ? func() : value
  });

  return JSON.parse(newObject);
}
