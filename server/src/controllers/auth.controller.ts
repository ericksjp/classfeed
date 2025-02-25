import { Request, Response } from "express";
import { User } from "../models/associations";
import { compareSync, hashSync } from "bcryptjs";
import authConfig from "../config/authConfig";
import jwt  from 'jsonwebtoken';

export async function signup(req: Request, res: Response) {
  const { email, name, password, dateOfBirth, profilePicture } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(422).json({ message: "User already exists!" });
      return;
    }

    const hashedPassword = hashSync(password, 10);

    const { dataValues } = await User.create({
      email,
      name,
      password: hashedPassword,
      dateOfBirth,
      profilePicture,
    });

    res.status(201).json({ ...dataValues, password: undefined });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
        where: { email },
        raw: true
    });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const authorized = compareSync(password, user.password);

    if (!authorized) {
      res.status(401).json({ message: "Wrong Password" });
      return;
    }

    const { id, name }= user

    res.status(201).json({
        success: "You are successfully connected, " + name,
        token: jwt.sign({id}, authConfig.secret, {expiresIn: authConfig.expiresIn})
    })
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
