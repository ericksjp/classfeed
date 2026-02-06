import { Request, Response } from "express";
import { User } from "../models";
import { compareSync, hashSync } from "bcryptjs";
import { extractZodErrors, generateToken } from "../utils";
import { sendOTPMail } from "../services/mail.service";
import { UserInput } from "../schemas";
import { AuthorizationError, ConflictError, InternalError, ValidationError } from "../errors";
import * as Otp from "../services/opt.service";

async function saveUserWithOtp(req: Request, res: Response) {
    const { email, name, password, birthDate } = req.body;
    const { error } = UserInput.safeParse(req.body);

    if (error) {
        throw new ValidationError(400, "Invalid Input Data. Check the Details!", "ERR_VALID", extractZodErrors(error));
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        throw new ConflictError(409, "User already exists", "ERR_CONFLICT");
    }

    const otp = Otp.saveUser({
        email,
        name,
        birthDate: birthDate,
        password: hashSync(password),
        profilePicture: "default_profile_picture.png",
    });

    sendOTPMail(email, name, otp);

    res.status(200).json({
        message: "Sucess. Confirm the OTP code to create the user.",
        token: generateToken({ email: email }),
    });
}

async function persistUser(req: Request, res: Response) {
    const { email } = req.body;

    const otpCode = req.body.code as string;

    const user = Otp.retrieveUser(email, otpCode);

    const createdUser = await User.create(user).then(
        (user) => user && user.getPublicProfile(),
    );

    if (!createdUser) {
        throw new InternalError(500, "User creation failed", "ERR_INTERNAL");
    }

    res.status(201).json({
        message: "User created successfully",
        user: createdUser,
        token: generateToken({ id: createdUser.id }),
    });
}

async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { error } = UserInput.pick({ email: true, password: true }).safeParse({ email, password });
    if (error) {
        throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !compareSync(password, user.password)) {
        throw new AuthorizationError(401, "Incorrect email or password", "ERR_AUTH");
    }

    const publicProfile = user.getPublicProfile();

    res.status(200).json({
        success: "You are successfully connected, " + user.name,
        token: generateToken({ id: user.id }),
        user: publicProfile,
    });
}

async function refresh(req: Request, res: Response) {
    res.status(200).json({ token: generateToken({ id: req.body.id }) });
}

export default {
    persistUser,
    login,
    saveUserWithOtp,
    refresh,
};
