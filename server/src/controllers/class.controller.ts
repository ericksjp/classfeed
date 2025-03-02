import { Request, Response } from "express";

import { Class, User } from "../models";

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

export async function getStudents(req: Request, res: Response) {
  const { classId } = req.params;
  try {
    const response = await Class.findByPk(classId, {
      include: {
        model: User,
        attributes: ["id", "name", "email", "profilePicture", "dateOfBirth"],
        through: { attributes: [] }
      },
    });

    res.status(200).json(response);
  } catch (err) {
    console.error("Error deleting Class:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getStudent(req: Request, res: Response) {
  const { classId } = req.params;
  const { studentId } = req.params;
  try {
    const response = await Class.findByPk(classId, {
      include: {
        model: User,
        attributes: ["id", "name", "email", "profilePicture", "dateOfBirth"],
        where: {
          id: studentId
        },
        through: { attributes: [] }
      },
    });

    res.status(200).json(response);
  } catch (err) {
    console.error("Error deleting Class:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function addStudent(req: Request, res: Response) {
  const { classId } = req.params;
  const { email } = req.body;
  try {
    const _class = await Class.findByPk(classId);
    if (!_class) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    const student = await User.findOne({
      where: { email },
    });

    if (!student) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const response = await _class.addUser(student);
    if (!response) {
      res.status(400).json({ message: "User already in the class" });
      return
    }
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function removeStudent(req: Request, res: Response) {
  const { classId } = req.params;
  const studentId = req.params.studentId || req.body.id
  console.log("studentId: " + studentId)

  try {
    const _class = await Class.findByPk(classId);
    if (!_class) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    const student = await User.findByPk(studentId);

    if (!student) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const response = await _class.removeUser(student);
    console.log(response)
    if (response === 0) {
      res.status(400).json({ message: "User is not in the class" });
      return
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
