import { Request, Response, NextFunction } from "express";
import { Class, User } from "../models";
import { isUuidValid } from "../utils/validation";
import { ValidationError, AuthorizationError } from "../errors";

export function isUserPartOfClass(req: Request, res: Response, next: NextFunction) {
    checkUserInClass(req, res, next, "both");
}

export function isUserTeacher(req: Request, res: Response, next: NextFunction) {
    checkUserInClass(req, res, next, "teacher");
}

export function isUserStudent(req: Request, res: Response, next: NextFunction) {
    checkUserInClass(req, res, next, "student");
}

async function checkUserInClass(req: Request, res: Response, next: NextFunction, role: "teacher" | "student" | "both") {
    const { id } = req.body;
    const { classId } = req.params;

    if (!isUuidValid(classId)) {
        return next(new ValidationError(400, "Invalid classId", "ERR_BAD_REQUEST"));
    }

    let teacherClass = null;
    let studentClass = null;

    function teacherQuery() {
        return Class.findOne({
            where: { id: classId, teacherId: id },
            include: [{ model: User }]
        });
    }

    function studentQuery() {
        return Class.findOne({
            where: { id: classId },
            include: [{ model: User, where: { id }, required: true }],
        });
    }

    if (role === "both") {
        [teacherClass, studentClass] = await Promise.all([teacherQuery(), studentQuery()]);
        if (!teacherClass && !studentClass) {
            return next(
                new AuthorizationError(403, "You are neither the teacher nor a student in this class", "ERR_FORBIDDEN"),
            );
        }
    }

    if (role === "teacher") {
        teacherClass = await teacherQuery();
        if (!teacherClass)
            return next(new AuthorizationError(403, "You are not the teacher for this class", "ERR_FORBIDDEN"));
    }

    if (role === "student") {
        studentClass = await studentQuery();
        if (!studentClass)
            return next(
                new AuthorizationError(403, "You are not enrolled as a student in this class", "ERR_FORBIDDEN"),
            );
    }

    req.body.classInstance = teacherClass || studentClass;
    req.body.userInstance = studentClass?.Users?.[0] ?? null;

    next();
}
