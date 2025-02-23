import { Request, Response } from "express";
import User from "../models/user.model";

export async function getUsers(req: Request, res: Response) {
  const resp = await User.findAll();
  res.send(resp);
}

export async function addUser(req: Request, res: Response) {
  const user = req.body;
  try {
    const newUser = await User.create(user);
    res.status(201).send(newUser);
  } catch (err) {
    console.error(err);
    res.send(500);
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

    res.status(200).json({...dataValues, password: undefined});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUserById(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    const result = await User.destroy({
      where: {
        id: userId
      }
    })

    if (result === 0) {
      res.status(404).json({message: "User not found"})
      return;
    }

    res.status(204).json()
  } catch(error) {
    console.error(error)
    res.status(500).json({message: "Internal server error"})
  }
}
