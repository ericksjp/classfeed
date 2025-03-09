import { Request, Response } from "express";
import { User } from "../models";
import { compareSync, hashSync } from "bcryptjs";
import { generateToken } from "../utils";
import { UserInput } from "../schemas";
import { AuthorizationError, ConflictError, EntityNotFoundError, InternalError, ValidationError } from "../errors";

async function signup(req: Request, res: Response) {
  const { email, name, password, dateOfBirth } = req.body;
  const { error } = UserInput.safeParse(req.body);

  if (error) {
    throw new ValidationError(400, error.errors[0].message, "ERR_VALID")
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new ConflictError(409, "User already exists", "ERR_CONFLICT");
  }

  const hashedPassword = hashSync(password, 10);

  const {dataValues: user} = await User.create(
    { email, name, password: hashedPassword, dateOfBirth },
  );

  if (!user) {
    throw new InternalError(500, "User creation failed", "ERR_INTERNAL");
  }

  res.status(201).json({
    message: "User created successfully",
    user: {...user, password: undefined},
    token: generateToken(user.id)
  });
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const { error } = UserInput.partial().safeParse({email, password});
  if (error) {
    throw new ValidationError(400, error.errors[0].message, "ERR_VALID");
  }

  const user = await User.findOne({ where: { email }, raw: true });
  if (!user) {
    throw new EntityNotFoundError(404, "User not found", "ERR_NF");
  }

  const authorized = compareSync(password, user.password);

  if (!authorized) {
    throw new AuthorizationError(401, "Wrong Password", "ERR_AUTH");
  }

  res.status(200).json({
    success: "You are successfully connected, " + user.name,
    token: generateToken(user.id),
  });
}

async function refresh(req: Request, res: Response) {
  res.status(200).json({ token: generateToken(req.body.id) });
}

export default {
  login,
  signup,
  refresh
};
