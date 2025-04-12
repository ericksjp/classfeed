import { Response, Request, NextFunction } from 'express'
import authConfig from '../config/authConfig';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenError } from '../errors';

function extractPayloadFromToken(req: Request, _: Response, next: NextFunction, field: "id" | "email") {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new TokenError(401, "Token doesn't exist", "ERR_TOKEN");

  const [, token] = authHeader.split(" ");
  jwt.verify(token, authConfig.secret, (error, decoded) => {
    if (error || (decoded as JwtPayload)[field] === undefined) {
      throw new TokenError(401, "Invalid Token", "ERR_TOKEN");
    }

    req.body[field] = (decoded as JwtPayload)[field];

    next();
  });
}

export function authEmail(req: Request, res: Response, next: NextFunction) {
  extractPayloadFromToken(req, res, next, "email")
}

export function authId(req: Request, res: Response, next: NextFunction) {
  extractPayloadFromToken(req, res, next, "id")
}
