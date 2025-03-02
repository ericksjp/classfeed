import jwt from "jsonwebtoken";
import authConfig from "../config/authConfig";
import { NextFunction, Request, Response } from "express";

export function generateToken(str: string) {
  return jwt.sign({ id: str }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
}

export function tryCatchWrapper(controller: (req: Request, res: Response, next: NextFunction) => Promise<unknown | void> | void) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

export function multiTryCatchWrapper(middlewares: ((req: Request, res: Response, next: NextFunction) => Promise<unknown | void> | void)[]) {
  return middlewares.map((middleware) => tryCatchWrapper(middleware));
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

export function extractDefinedValues<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  (Object.keys(obj) as (keyof T)[]).forEach((key) => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });

  return result;
}
