import { Response, Request, NextFunction } from 'express'
import authConfig from '../config/authConfig';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenError } from '../errors';


export default function (req: Request, _: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new TokenError(401, "Token doesn't exist", "ERR_TOKEN");

  const [, token] = authHeader.split(" ");
  jwt.verify(token, authConfig.secret, (error, decoded) => {
    if (error) {
      throw new TokenError(401, "Invalid Token", "ERR_TOKEN");
    }

    req.body.id = (decoded as JwtPayload).id;
    next();
  });
}
