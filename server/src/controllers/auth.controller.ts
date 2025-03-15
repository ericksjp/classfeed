import { Request, Response } from "express";
import { User } from "../models";
import { compareSync, hashSync } from "bcryptjs";
import { extractZodErrors, generateToken } from "../utils";
import { UserInput } from "../schemas";
import { AuthorizationError, ConflictError, InternalError, ValidationError } from "../errors";
import { buildImageUrl } from "../utils/imageUrl";

async function signup(req: Request, res: Response) {
  const { email, name, password, dateOfBirth } = req.body;
  const { error } = UserInput.safeParse(req.body);

  if (error) {
    throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new ConflictError(409, "User already exists", "ERR_CONFLICT");
  }

  const {dataValues: user} = await User.create(
    { email, name, password, dateOfBirth },
  );

  if (!user) {
    throw new InternalError(500, "User creation failed", "ERR_INTERNAL");
  }

  res.status(201).json({
    message: "User created successfully",
    user: {...user, profilePicture: buildImageUrl(req.protocol, req.hostname, user.profilePicture), password: undefined},
    token: generateToken(user.id)
  });
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const { error } = UserInput.pick({email: true, password: true}).safeParse({email, password});
  if (error) {
    throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
  }

  const user = await User.findOne({ where: { email }, raw: true });
  if (!user || !compareSync(password, user.password)) {
    throw new AuthorizationError(401, "Incorrect email or password", "ERR_AUTH");
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
