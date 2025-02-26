import { Request, Response } from "express";
import { User } from "../models/";
import { hashSync } from "bcryptjs";

export async function get(req: Request, res: Response) {
  try {
    const { id } = req.body
    const user = await User.findByPk(id, {raw: true});

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ ...user, password: undefined });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.body

    const result = await User.destroy({
      where: {
        id: id,
      },
    });

    if (result === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.body;
    const user = await User.findByPk(id);

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

export default {
  get,
  update,
  remove,
}
