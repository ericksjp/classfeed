import { Request, Response } from "express";
import { User } from "../models";
import { compareSync, hashSync } from "bcryptjs";
import { generateToken } from "../utils";

async function signup(req: Request, res: Response) {
  const { email, name, password, dateOfBirth, profilePicture } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(422).json({ message: "User already exists!" });
      return;
    }

    const hashedPassword = hashSync(password, 10);

    const {dataValues: user} = await User.create(
      {
        email,
        name,
        password: hashedPassword,
        dateOfBirth,
        profilePicture,
      }
    );

    res.status(201).json({
      message: "User created successfully",
      user: {...user, password: undefined},
      token: generateToken(user.id)
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      raw: true,
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

    const { id, name } = user;

    res.status(200).json({
      success: "You are successfully connected, " + name,
      token: generateToken(id)
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function refresh(req: Request, res: Response) {
  const { id } = req.body;
  res.status(200).json({ token: generateToken(id) });
}

export default {
  login,
  signup,
  refresh
};
