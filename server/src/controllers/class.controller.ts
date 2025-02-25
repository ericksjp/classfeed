import { Request, Response } from "express";

import { Class } from "../models";

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

// get the classes of a teacher
export async function getClasses(req: Request, res: Response) {
  const { id } = req.body;
  try {
    const classes = await Class.findAll({
      where: { teacherId: id },
      raw: true,
    });
    res.status(200).json(classes);
  } catch (err) {
    console.error("Error getting Classes:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// get a class of a teacher by its ID
export async function getClassById(req: Request, res: Response) {
    const { classId } = req.params;
    const { id } = req.body;
    try {
    const _class = await Class.findOne({
        where: { id: classId, teacherId: id },
        raw: true,
    });

      if (!_class) {
        res.status(404).json({ message: "Class not found" });
        return;
      }

      res.status(200).json(_class);
    } catch (err) {
      console.error("Error getting Classes:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

// update a class of a teacher by its ID
export async function updateClass(req: Request, res: Response) {
    const {classId} = req.params;
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

// update the status of a class of a teacher by its ID
export async function updateClassStatus(req: Request, res: Response) {
    const { classId } = req.params;
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

// delete a class of a teacher by its ID
export async function deleteClass(req: Request, res: Response) {
    const { classId } = req.params;
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
