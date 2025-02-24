import { Request, Response } from "express";
import User from "../models/user.model";
import { hashSync } from "bcryptjs";

export async function getUsers(req: Request, res: Response) {
  try {
    const resp = await User.findAll({
      attributes: ["id", "name", "email", "profilePicture", "dateOfBirth"],
    });
    res.status(200).json(resp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { dataValues } = user;

    res.status(200).json({ ...dataValues, password: undefined });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteUserById(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    const result = await User.destroy({
      where: {
        id: userId,
      },
    });

    if (result === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { email, name, dateOfBirth, profilePicture } = req.body;
    let { password } = req.body;

    if (password) {
      password = hashSync(password, 10);
    }

    const { dataValues } = await user.update({
      email,
      name,
      dateOfBirth,
      profilePicture,
      password,
    });

    res.status(200).json({ ...dataValues, password: undefined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
