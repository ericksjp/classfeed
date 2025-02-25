import { Response, Request, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken';
import authConfig from '../config/authConfig';

export default function(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).json({error: "Token doesn't exist"});
        return;
    }

    const [, token] = authHeader.split(' ');
    try {
        const decoded = jwt.verify(token, authConfig.secret) as JwtPayload;
        req.body.id = decoded.id;
        next();
        return;
    } catch {
        res.status(401).json({error: "Invalid token"});
        return;
    }
}
