import { Request, Response } from "express";
import { User } from "../models/associations";

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
