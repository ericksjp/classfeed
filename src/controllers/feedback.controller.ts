import { Request, Response } from "express";
import { Feedback, Class, Lesson } from "../models";
import { EntityNotFoundError, ValidationError } from "../errors";
import { isUuidValid } from "../utils/validation";
import { FeedbackInput } from "../schemas";

async function findFeedbacks(classId: string, lessonId: string, options: { feedbackId?: string; studentId?: string } = {}) {
    const { feedbackId, studentId } = options;
    if (!isUuidValid(lessonId)) throw new ValidationError(400, "Invalid LessonId", "ERR_VALID");
    if (feedbackId && !isUuidValid(feedbackId)) throw new ValidationError(400, "Invalid FeedbackId", "ERR_VALID");

    // First ensure the lesson belongs to the class
    const lesson = await Lesson.findOne({ where: { id: lessonId, classId } });
    if (!lesson) throw new EntityNotFoundError(404, "Lesson not found", "ERR_NF");

    const where: any = { lessonId };
    if (feedbackId) where.id = feedbackId;
    if (studentId) where.studentId = studentId;

    const feedbacks = await Feedback.findAll({ where });
    return feedbacks;
}

async function getFeedbacks(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) throw new EntityNotFoundError(404, "Class not found", "ERR_NF");

    // If it's a student (userInstance present), only show their own feedbacks
    const studentId = req.body.userInstance ? req.body.id : undefined;

    const feedbacks = await findFeedbacks(classInstance.id, req.params.lessonId, { studentId });

    const protectedFeedbacks = feedbacks.map((feedback: Feedback) =>
        feedback.anonymous ? { ...feedback.get(), studentId: undefined } : feedback.get(),
    );

    res.status(200).json(protectedFeedbacks);
}

async function getFeedbackById(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) throw new EntityNotFoundError(404, "Class not found", "ERR_NF");

    const [feedback] = await findFeedbacks(classInstance.id, req.params.lessonId, { feedbackId: req.params.feedbackId });
    if (!feedback) {
        throw new EntityNotFoundError(404, "Feedback not found", "ERR_NF");
    }

    const studentId = feedback.anonymous ? undefined : feedback.studentId;
    res.status(200).send({ ...feedback.get(), studentId });
}

async function createFeedback(req: Request, res: Response) {
    const { lessonId } = req.params;
    if (!isUuidValid(lessonId)) throw new ValidationError(400, "invalid LessonId", "ERR_VALID");

    const { error, data } = FeedbackInput.safeParse({ ...req.body, studentId: req.body.id, lessonId });
    if (error) throw new ValidationError(400, error.errors[0].message, "ERR_VALID");

    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) throw new EntityNotFoundError(404, "Lesson not found", "ERR_NF");

    const newFeedback = await Feedback.create(data);
    res.status(200).json(newFeedback);
}

async function deleteFeedback(req: Request, res: Response) {
    const { lessonId, feedbackId } = req.params;
    if (!isUuidValid(lessonId) || !isUuidValid(feedbackId)) throw new ValidationError(400, "Invalid ID", "ERR_VALID");

    const feedback = await Feedback.findOne({ where: { id: feedbackId, lessonId } });
    if (!feedback) throw new EntityNotFoundError(404, "Feedback not found", "ERR_NF");

    await feedback.destroy();
    res.sendStatus(204);
}

async function getClassFeedbacks(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) throw new EntityNotFoundError(404, "Class not found", "ERR_NF");

    const userId = req.body.id;
    const isStudent = !!req.body.userInstance;

    // Get all lessons for this class to filter feedbacks
    const lessons = await Lesson.findAll({ where: { classId: classInstance.id } });
    const lessonIds = lessons.map(l => l.id);

    const where: any = { lessonId: lessonIds };
    if (isStudent) where.studentId = userId;

    const feedbacks = await Feedback.findAll({
        where,
        include: [{ model: Lesson, attributes: ["title"] }]
    });

    const protectedFeedbacks = feedbacks.map((feedback: any) => {
        const data = feedback.get();
        return {
            ...data,
            studentId: data.anonymous ? undefined : data.studentId,
            lessonTitle: data.Lesson?.title
        };
    });

    res.status(200).json(protectedFeedbacks);
}

export default {
    getFeedbacks,
    getFeedbackById,
    getClassFeedbacks,
    createFeedback,
    deleteFeedback,
};
