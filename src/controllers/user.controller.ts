import { Request, Response } from "express";
import { User } from "../models/";
import { EntityNotFoundError, InternalError, ParamError } from "../errors";
import { UserInput } from "../schemas";
import { ValidationError } from "../errors";
import { extractZodErrors, sanitizeObject } from "../utils";
import { compareSync, hashSync } from "bcryptjs";
import storageService from "../services/storage.service";

async function get(req: Request, res: Response) {
    const { id } = req.body;
    const user = await User.findByPk(id).then((user) => user?.getPublicProfile());

    if (!user) {
        throw new EntityNotFoundError(404, "User not found", "ERR_NF");
    }

    res.status(200).json(user);
}

async function remove(req: Request, res: Response) {
    const { id } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
        throw new EntityNotFoundError(404, "User not found", "ERR_NF");
    }

    await user.destroy();
    const { profilePicture } = user.dataValues;
    if (profilePicture !== "default_profile_picture.png") {
        storageService.deleteFile(profilePicture)
    }

    res.sendStatus(204);
}

async function updatePassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ValidationError(400, "Old password and new password are required", "ERR_VALID");
    }

    const { error } = UserInput.pick({ password: true }).safeParse({ password: newPassword });

    if (error) {
        throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
    }

    const { id } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
        throw new EntityNotFoundError(404, "User not found", "ERR_NF");
    }

    if (!compareSync(currentPassword, user.password)) {
        throw new ValidationError(400, "Current password is incorrect", "ERR_VALID");
    }

    await user.update({ password: hashSync(newPassword) });

    res.sendStatus(200);
}

async function update(req: Request, res: Response) {
    const updateData = sanitizeObject(req.body, {
        id: () => undefined,
    });

    const { error } = UserInput.partial().safeParse(updateData);

    if (error) {
        throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
    }

    const { id } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
        throw new EntityNotFoundError(404, "User not found", "ERR_NF");
    }

    const updatedUser = await user.update(updateData).then((user) => user.getPublicProfile());

    if (!updatedUser) {
        throw new InternalError(500, "Cannot update user", "ERR_INTERNAL");
    }

    res.status(200).json(updatedUser);
}

async function updateProfilePicture(req: Request, res: Response) {
    const { id } = req.body;
    const filename = req.file?.filename;

    if (!filename || typeof filename !== "string") {
        throw new ParamError(400, "No image uploaded", "ERR_NF");
    }

    const user = await User.findByPk(id);

    if (!user) {
        throw new EntityNotFoundError(404, "User not found", "ERR_NF");
    }

    if (!filename || typeof filename !== "string") {
        throw new ParamError(400, "No image uploaded", "ERR_NF");
    }

    const updatedUser = await user
        .update({ profilePicture: filename })
        .then((user) => user.getPublicProfile());

    res.status(200).json(updatedUser);
}

async function getProfilePicture(req: Request, res: Response) {
    const { id } = req.body;

    const profilePicture = await User.findByPk(id).then((user) => user?.profilePicture);

    if (!profilePicture) {
        throw new EntityNotFoundError(404, "User not found", "ERR_NF");
    }

    res.status(200).json({ profilePicture });
}

async function deleteProfilePicture(req: Request, res: Response) {
    const { id } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
        throw new EntityNotFoundError(404, "User not found", "ERR_NF");
    }

    if (user.profilePicture === "default_profile_picture.png") {
        throw new ValidationError(409, "Profile picture is already the default one", "ERR_CONFLICT");
    }

    storageService.deleteFile(user.profilePicture);

    await user.update({
        profilePicture: "default_profile_picture.png",
    });

    res.sendStatus(204);
}

export default {
    get,
    update,
    remove,
    updateProfilePicture,
    getProfilePicture,
    deleteProfilePicture,
    updatePassword,
};
