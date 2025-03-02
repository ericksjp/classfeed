import { Request, Response, NextFunction } from "express";
import { Class, User } from "../models";

export function isUserPartOfClass(req: Request, res: Response, next: NextFunction) {
  checkUserInClass(req, res, next, 'both');
}

export function isUserTeacher(req: Request, res: Response, next: NextFunction) {
  checkUserInClass(req, res, next, 'teacher');
}

export function isUserStudent(req: Request, res: Response, next: NextFunction) {
  checkUserInClass(req, res, next, 'student');
}

async function checkUserInClass(req: Request, res: Response, next: NextFunction, role: 'teacher' | 'student' | 'both') {
  try {
    const { id } = req.body;
    const classId = req.params.classId;

    if (!classId) {
      return res.status(400).json({ message: "Class ID required." });
    }

    let classAsTeacher = null;
    let classAsStudent = null;

    if (role === "teacher" || role === "both") {
      classAsTeacher = await Class.findOne({
        where: { id: classId, teacherId: id },
        raw: true,
      });
      if (classAsTeacher) {
        req.body.classInstance = classAsTeacher;
      } else if (role === "teacher") {
        return res.status(403).json({ message: "You are not authorized as a teacher for this class." });
      }
    }

    if (role === 'student' || role === 'both') {
      classAsStudent = await Class.findOne({
        where: { id: classId },
        include: [{
          model: User,
          where: { id: id },
          attributes: ['id', 'name', 'email'],
          required: true,
        }],
      });

      if (classAsStudent) {
        req.body.classInstance = classAsStudent;
        req.body.userInstance = classAsStudent.Users?.[0];
      } else if (role === 'student') {
        return res.status(403).json({ message: "You are not enrolled as a student in this class." });
      }
    }

    if (role === 'both' && !classAsTeacher && !classAsStudent) {
      return res.status(403).json({ message: "You are not part of this class as a teacher or student." });
    }

    next();
  } catch (error) {
    console.error("Error in checkUserInClass:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
