import { Request, Response } from "express";
import { Feedback, Class, Lesson } from "../models";
import { EntityNotFoundError, ValidationError } from "../errors";
import { isUuidValid } from "../utils/validation";
import { FeedbackInput } from "../schemas";

async function findFeedbacks(classId: string, lessonId: string, feedbackId?: string) {
    if (!isUuidValid(lessonId)) throw new ValidationError(400, "Invalid LessonId", "ERR_VALID");
    if (feedbackId && !isUuidValid(feedbackId)) throw new ValidationError(400, "Invalid FeedbackId", "ERR_VALID");

    const lesson = await Lesson.findOne({
        where: { id: lessonId, classId },
        include: {
            model: Feedback,
            where: feedbackId ? { id: feedbackId } : undefined,
        },
    });

    if (!lesson) throw new EntityNotFoundError(404, "Lesson not found", "ERR_NF");

    return lesson.Feedbacks || [];
}

async function getFeedbacks(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) throw new EntityNotFoundError(404, "Class not found", "ERR_NF");

    const feedbacks = await findFeedbacks(classInstance.id, req.params.lessonId);

    const protectedFeedbacks = feedbacks.map((feedback: Feedback) =>
        feedback.anonymous ? { ...feedback.get(), studentId: undefined } : feedback.get(),
    );

    res.status(200).json(protectedFeedbacks);
}

async function getFeedbackById(req: Request, res: Response) {
    const classInstance = req.body.classInstance as Class;
    if (!classInstance) throw new EntityNotFoundError(404, "Class not found", "ERR_NF");

    const [feedback] = await findFeedbacks(classInstance.id, req.params.lessonId, req.params.feedbackId);
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

export default {
    getFeedbacks,
    getFeedbackById,
    createFeedback,
    deleteFeedback,
};
