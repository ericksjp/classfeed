import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { User } from "../models/";
import { hashSync } from "bcryptjs";
import { EntityNotFoundError, InternalError, ParamError } from "../errors";
import { UserInput } from "../schemas";
import { ValidationError } from "../errors";
import { extractDefinedValues } from "../utils";

async function get(req: Request, res: Response) {
  const { id } = req.body;
  const user = await User.findByPk(id, { raw: true });

  if (!user) {
    throw new EntityNotFoundError(404, "User not found", "ERR_NF");
  }

  res.status(200).json({ ...user, password: undefined });
}

async function remove(req: Request, res: Response) {
  const { id } = req.body;

  const result = await User.destroy({
    where: { id },
  });

  if (result === 0) {
    throw new EntityNotFoundError(404, "User not found", "ERR_NF");
  }

  res.sendStatus(204);
}

async function update(req: Request, res: Response) {
  const updateData = extractDefinedValues({
    email: req.body.email,
    name: req.body.name,
    dateOfBirth: req.body.dateOfBirth,
    password: req.body.password,
    profilePicture: req.body.profilePicture,
  })

  const { error } = UserInput.partial().safeParse(updateData);

  if (updateData.password) {
    updateData.password = hashSync(updateData.password, 10)
  }

  if (error) {
    throw new ValidationError(400, error.errors[0].message, "ERR_VALID");
  }

  const { id } = req.body;
  const user = await User.findByPk(id);

  if (!user) {
    throw new EntityNotFoundError(404, "User not found", "ERR_NF");
  }

  const { dataValues: updatedUser } = await user.update(updateData);

  if (!updatedUser) {
    throw new InternalError(500, "Cannot update user", "ERR_INTERNAL");
  }

  res.status(200).json({ ...updatedUser, password: undefined });
}

async function updateProfilePicture(req: Request, res: Response) {
  const { id } = req.body;
  const file = req.file;

  const user = await User.findByPk(id);

  if(!user) {
    throw new EntityNotFoundError(404, "User not found", "ERR_NF");
  }

  if(!file) {
    throw new ParamError(400, "No image uploaded", "ERR_NF");
  }

  if(user.profilePicture !== "uploads/default_profile_picture.png") {
    const oldImagePath = path.resolve(user.profilePicture);
    fs.unlinkSync(oldImagePath);
  }

  const { dataValues: updatedUser } = await user.update({
    profilePicture: file.path
  });

  res.status(200).json({ ...updatedUser, password: undefined });
}

export default {
  get,
  update,
  remove,
  updateProfilePicture
}
