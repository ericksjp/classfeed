import { Request, Response } from "express";

import { Class, User } from "../models";
import { ClassInput, UserInput } from "../schemas";
import { ConflictError, EntityNotFoundError, ParamError, ValidationError } from "../errors";
import { isUuidValid } from "../utils/validation";
import { extractDefinedValues } from "../utils";
import { buildImageUrl } from "../utils/imageUrl";

export async function createClass(req: Request, res: Response) {
  const { id: teacherId, name, subject, institution, status, location } = req.body;
  const { error } = ClassInput.safeParse({ teacherId, name, subject, institution, status, location });

  if (error) {
    throw new ValidationError(400, error.errors[0].message, "ERR_VALID");
  }

  const newClass = await Class.create({
    name,
    subject,
    institution,
    status,
    location,
    teacherId
  });

  res.status(201).json(newClass);
}

export async function getClasses(req: Request, res: Response) {
  const { id } = req.body;
  const role = (req.query.role as string) || undefined;
  const classes: { teacherClasses?: unknown[]; studentClasses?: unknown[] } = {};

  const fetchAsTeacher = !role || role === "teacher";
  const fetchAsStudent = !role || role === "student";

  if (!fetchAsStudent && !fetchAsTeacher) throw new ParamError( 400, "Invalid role value. Accepted values: 'teacher' or 'student'", "ERR_BAD_REQUEST");

  if (fetchAsTeacher) classes.teacherClasses = await getTeacherClasses(id);
  if (fetchAsStudent) classes.studentClasses = await getStudentClasses(id);

  res.status(200).json(classes);
}

export async function getClassById(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
  }

  const { dataValues: _class } = classInstance;
  const teacher = await User.findByPk(_class.teacherId, {
    raw: true,
    attributes: ["name", "id", "email", "profilePicture"]
  });

  teacher!.profilePicture = buildImageUrl(req.protocol, req.hostname, teacher!.profilePicture);
  res.status(200).json({ ..._class, teacherId: undefined, teacher });
  return;
}

export async function updateClass(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF")
  }

  // prevent sequelize from updating undefined values
  const updateData = extractDefinedValues({
    name: req.body.name,
    subject: req.body.subject,
    institution: req.body.institution,
    status: req.body.status,
    location: req.body.location,
  })

  const {error} = ClassInput.partial().safeParse(updateData)

  if (error) {
    throw new ValidationError(400, error.errors[0].message, "ERR_VALID")
  }

  classInstance.set(updateData);
  await classInstance.save();

  res.status(200).json(classInstance);
}

export async function deleteClass(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF")
  }

  await classInstance.destroy();

  res.status(204).send()
}

export async function getStudents(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
  }

  const response = await Class.findByPk(classInstance.id, {
    include: {
      model: User,
      attributes: ["id", "name", "email", "profilePicture", "dateOfBirth"],
      through: { attributes: [] },
    },
  });

  res.status(200).json(response?.Users || []);
}

export async function getStudent(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
  }

  const { studentId } = req.params;
  const response = await Class.findByPk(classInstance.id, {
    include: {
      model: User,
      attributes: ["id", "name", "email", "profilePicture", "dateOfBirth"],
      where: {
        id: studentId,
      },
      through: { attributes: [] },
      required: true,
    },
  });

  if (!response || !response.Users || response.Users.length === 0) {
    throw new EntityNotFoundError(404, "Student not found", "ERR_NF");
  }

  res.status(200).json(response.Users[0]);
}

export async function addStudent(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
  }

  const { email } = req.body;
  const { error } = UserInput.partial().safeParse({ email });

  if (error) {
    throw new ValidationError(400, error.errors[0].message, "ERR_VALID");
  }

  const student = await User.findOne({ where: { email } });
  if (!student) {
    throw new EntityNotFoundError(404, "User not found", "ERR_NF");
  }

  const response = await classInstance.addUser(student);
  if (!response) {
    throw new ConflictError(409, "User already in the class", "ERR_CONFLICT");
  }

  res.status(200).json({message: "User added to the class"});
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

  res.status(200).json({message: "User removed from the class"});
}

/*-------- utils -------------*/

async function getTeacherClasses(userId: string) {
  return await Class.findAll({
    where: { teacherId: userId },
    raw: true,
  });
}

async function getStudentClasses(userId: string) {
  return await Class.findAll({
    raw: true,
    attributes: ['id', 'name', 'subject', 'institution', 'status', 'location', 'teacherId'],
    include: {
      model: User,
      attributes: [],
      where: { id: userId },
      required: true,
    },
  });
}
