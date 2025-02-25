import { Request, Response } from "express";

import { Class } from "../models/associations";

export async function createClass(req: Request, res: Response) {
    const { id, name, subject, institution, status, location } = req.body;

    try {
        const newClass = await Class.create({
            name,
            subject,
            institution,
            status,
            location,
            teacherId: id
        });

        res.status(201).json(newClass);
    } catch(err) {
        console.error("Error creating Class:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}