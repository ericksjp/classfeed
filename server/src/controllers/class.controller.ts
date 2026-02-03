import { Request, Response } from "express";

import { Class, User } from "../models";
import { ClassInput, UserInput } from "../schemas";
import { ConflictError, EntityNotFoundError, ParamError, ValidationError } from "../errors";
import { isUuidValid } from "../utils/validation";
import { extractZodErrors, sanitizeObject } from "../utils";

export async function createClass(req: Request, res: Response) {
    const { id: teacherId, name, subject, institution, status, location } = req.body;
    const { error } = ClassInput.safeParse({ teacherId, name, subject, institution, status, location });

    if (error) {
        throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
    }

    const newClass = await Class.create({
        name,
        subject,
        institution,
        status,
        location,
        teacherId,
    });

    res.status(201).json(newClass);
}

export async function getClasses(req: Request, res: Response) {
    const { id } = req.body;
    const role = (req.query.role as string) || undefined;
    const classes: { teacherClasses?: unknown[]; studentClasses?: unknown[] } = {};

    const fetchAsTeacher = !role || role === "teacher";
    const fetchAsStudent = !role || role === "student";

    if (!fetchAsStudent && !fetchAsTeacher)
        throw new ParamError(400, "Invalid role value. Accepted values: 'teacher' or 'student'", "ERR_BAD_REQUEST");

    if (fetchAsTeacher) classes.teacherClasses = await getTeacherClasses(id);
    if (fetchAsStudent) classes.studentClasses = await getStudentClasses(id);

    res.status(200).json(classes);
}

export async function getClassById(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) {
        throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
    }

    const teacher = await User.findByPk(classInstance.teacherId).then(
        (user) => user?.getPublicProfile(req.protocol, req.hostname),
    );

    const students = classInstance.Users?.map((user) =>
        user.getPublicProfile(req.protocol, req.hostname)
    ) || [];

    res.status(200).json({
        ...classInstance.dataValues,
        teacherId: undefined,
        teacher,
        students
    });
    return;
}

export async function updateClass(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) {
        throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
    }

    // prevent sequelize from updating undefined values
    const updateData = sanitizeObject(req.body, {});

    const { error } = ClassInput.partial().safeParse(updateData);

    if (error) {
        throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
    }

    classInstance.set(updateData);
    await classInstance.save();

    res.status(200).json(classInstance);
}

export async function deleteClass(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) {
        throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
    }

    await classInstance.destroy();

    res.status(204).send();
}

export async function getStudents(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) {
        throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
    }

    const students = await Class.findByPk(classInstance.id, {
        include: {
            model: User,
            through: { attributes: [] },
        },
    }).then((_class) => {
        const students = _class?.Users;
        if (!students) return undefined;
        return students.map((user) => user.getPublicProfile(req.protocol, req.hostname));
    });

    res.status(200).json(students);
}

export async function getStudent(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) {
        throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
    }

    const { studentId } = req.params;

    const student = await Class.findByPk(classInstance.id, {
        include: {
            model: User,
            where: { id: studentId },
            required: true,
        },
    }).then((_class) => {
        const student = _class?.Users?.at(0);
        if (!student) return undefined;
        return student.getPublicProfile(req.protocol, req.hostname);
    });

    if (!student) {
        throw new EntityNotFoundError(404, "Student not found", "ERR_NF");
    }

    res.status(200).json(student);
}

export async function addStudent(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) {
        throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
    }

    const { email } = req.body;
    const { error } = UserInput.pick({ email: true }).safeParse({ email });

    if (error) {
        throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
    }

    const student = await User.findOne({ where: { email } });
    if (!student) {
        throw new EntityNotFoundError(404, "User not found", "ERR_NF");
    }

    const response = await classInstance.addUser(student);
    if (!response) {
        throw new ConflictError(409, "User already in the class", "ERR_CONFLICT");
    }

    res.status(200).json({ message: "User added to the class" });
}

export async function removeStudent(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) {
        throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
    }

    let studentIntance = req.body.userInstance as User | null;

    if (!studentIntance) {
        const studentId = req.params.studentId;

        if (!isUuidValid(studentId)) {
            throw new ValidationError(400, "Invalid userId", "ERR_VALID");
        }

        studentIntance = await User.findByPk(studentId);

        if (!studentIntance) {
            throw new EntityNotFoundError(404, "User not found", "ERR_NF");
        }
    }

    const removeCount = await classInstance.removeUser(studentIntance);
    if (removeCount === 0) {
        throw new EntityNotFoundError(404, "User not in the class", "ERR_NF");
    }

    res.status(200).json({ message: "User removed from the class" });
}

/*-------- utils -------------*/

async function getTeacherClasses(userId: string) {
    return await Class.findAll({
        where: { teacherId: userId },
    });
}

async function getStudentClasses(userId: string) {
    return await Class.findAll({
        include: {
            model: User,
            attributes: [],
            where: { id: userId },
            required: true,
        },
    });
}
