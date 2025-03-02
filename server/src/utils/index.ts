import jwt from "jsonwebtoken";
import authConfig from "../config/authConfig";

export function generateToken(str: string) {
  return jwt.sign({ id: str }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });
}
