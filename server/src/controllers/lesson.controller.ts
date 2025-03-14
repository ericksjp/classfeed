import {Request, Response} from "express";
import {Class, Lesson} from "../models"
import { EntityNotFoundError, ValidationError } from "../errors";
import { isUuidValid } from "../utils/validation";
import { LessonInput } from "../schemas";
import { extractDefinedValues, extractZodErrors } from "../utils";

export async function getlessons(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
  }

  const lessons = await Lesson.findAll({
    where: { classId: classInstance.id },
    raw: true,
  });
  res.status(200).json(lessons);
}

export async function getLessonById(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
  }

  const { lessonId } = req.params;
  if (!isUuidValid(lessonId)) {
    throw new ValidationError(400, "Invalid lessonId", "ERR_VALID");
  }

  const lesson = await Lesson.findOne({
    where: { classId: classInstance.id, id: lessonId },
    raw: true,
  });

  if (!lesson) {
    throw new ValidationError(404, "Lesson not found", "ERR_NF");
  }

  res.status(200).json(lesson);
}

export async function createLesson(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
  }

  const { title, dateTime } = req.body;
  const { error } = LessonInput.safeParse({ title, classId: classInstance.id, dateTime });

  if (error) {
    throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
  }

  const newLesson = await Lesson.create({
    title,
    classId: classInstance.id,
    dateTime,
  });
  res.status(200).json(newLesson);
}

export async function updateLesson(req:Request, res:Response){
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
  }

  const { lessonId } = req.params;

  if (!isUuidValid(lessonId)) {
    throw new ValidationError(400, "Invalid lessonId", "ERR_BAD_REQUEST");
  }

  const updateData = extractDefinedValues({
    title: req.body.title,
    dateTime: req.body.dateTime,
  })

  const { error }= LessonInput.partial().safeParse(updateData);

  if (error) {
    throw new ValidationError(400, "Invalid Input Data", "ERR_VALID", extractZodErrors(error));
  }

  const updated = await Lesson.update(updateData, {
    where: { id: lessonId, classId: classInstance.id },
    returning: ["id", "title", "classId", "dateTime", ]
  });

  if(updated[0] === 0){
    throw new EntityNotFoundError(404, "Lesson not Found", "ERR_NF");
  }

  res.status(200).json(updated[1][0]);
}

export async function deleteLesson(req: Request, res: Response) {
  const classInstance = req.body.classInstance as Class;
  if (!classInstance) {
    throw new EntityNotFoundError(404, "Class not found", "ERR_NF");
  }

  const { lessonId } = req.params;

  if (!isUuidValid(lessonId)) {
    throw new ValidationError(400, "Invalid lessonId", "ERR_BAD_REQUEST");
  }

  const count = await Lesson.destroy({
    where: {
      id: lessonId,
      classId: classInstance.id,
    },
  });

  if (count === 0) throw new EntityNotFoundError(404, "Lesson not Found", "ERR_NF");

  res.sendStatus(204);
}
