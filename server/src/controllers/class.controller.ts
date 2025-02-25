import { Request, Response } from "express";

import { Class } from "../models/associations";
import db from "../models";
import Sequelize from "sequelize";

const allowedStatuses = ["Ativo", "Arquivado"];

export async function createClass(req: Request, res: Response) {
    const { id, name, subject, institution, status, location } = req.body;

    try {
        if(!allowedStatuses.includes(status)) {
            res.status(400).json({ message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` });
            return;
        }

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

export async function getClasses(req: Request, res: Response) {
    const { id } = req.body;

    try {
        const classes = await db.query(
            `
            SELECT C.*
            FROM Classes C
            LEFT JOIN User_Class UC ON C.id = UC.class_id
            LEFT JOIN Users U ON U.id = UC.user_id OR U.id = C.teacher_id
            WHERE U.id = :userId;
            `,
            {
                replacements: { userId: id },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        if(classes.length === 0 ) {
            res.status(404).json({ message: "You are not part of any class" });
            return;
        }

        res.status(200).json(classes);
    } catch(err) {
        console.error("Error getting Classes:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getClassById(req: Request, res: Response) {
    const classId = req.params.id;
    const { id } = req.body;

    try {   
        const myClass = await db.query(
            `
            SELECT C.*
            FROM Classes C
            LEFT JOIN User_Class UC ON C.id = UC.class_id
            LEFT JOIN Users U ON U.id = UC.user_id OR U.id = C.teacher_id
            WHERE U.id = :userId AND C.id = :classId;
            `,
            {
                replacements: { userId: id, classId },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        if(myClass.length === 0 ) {
            res.status(404).json({ message: "Class not found" });
            return;
        }

        res.status(200).json(myClass);
    } catch(err) {
        console.error("Error getting Class by id:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateClass(req: Request, res: Response) {
    const classId = req.params.id;
    const { id, name, subject, institution, status, location } = req.body;

    try {
        if(!allowedStatuses.includes(status)) {
            res.status(400).json({ message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` });
            return;
        }

        const [updatedRows] = await Class.update({
            name,
            subject,
            institution,
            status,
            location
        },
        {
            where: {teacherId: id, id: classId}
        }
        );

        if(updatedRows === 0) {
            res.status(404).json({ message: `Failed to update the class with the given ID (${classId})` });
            return;
        }

        res.status(200).json(await Class.findByPk(classId));
    } catch(err) {
        console.error("Error updating Class:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateClassStatus(req: Request, res: Response) {
    const classId = req.params.id;
    const { id, status } = req.body;

    try {
        if(!allowedStatuses.includes(status)) {
            res.status(400).json({ message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` });
            return;
        }

        const [updatedRows] = await Class.update({
            status
        },
        {
            where: { teacherId: id, id: classId }
        }
        );

        if(updatedRows === 0) {
            res.status(404).json({ message: `Failed to update the class with the given ID (${classId})` });
            return;
        }

        res.status(200).json(await Class.findByPk(classId));
    } catch(err) {
        console.error("Error updating Class status:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteClass(req: Request, res: Response) {
    const classId = req.params.id;
    const { id } = req.body;

    try {
        const deletedRows = await Class.destroy({
            where: { teacherId: id, id: classId }
        });

        if(deletedRows === 0) {
            res.status(404).json({ message: `Failed to delete the class with the given ID (${classId})` });
            return;
        }

        res.status(200).json({ message: `The class with ID (${classId}) has been successfully deleted` })
    } catch(err) {
        console.error("Error deleting Class:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}