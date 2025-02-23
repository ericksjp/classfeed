import { Request, Response } from "express";
import User from "../models/user.model";
import { compareSync, hashSync } from "bcryptjs";

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
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const isPasswordValid = compareSync(password, user.dataValues.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid Password" });
      return;
    }

    res.status(201).json({ ...user.dataValues, password: undefined });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
