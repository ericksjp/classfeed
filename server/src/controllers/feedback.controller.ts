import {Request, Response} from "express";
import { Feedback, Class} from "../models";

export async function getFeedbacks(req:Request, res:Response){
    try {
        const {id} = req.body;
        const {classId} = req.params;
        const {lessonId} = req.params;
        const teacher = await Class.findOne({
            where:{
                id:classId,
                teacherId: id,
            }
        })
        console.log("Professor: " + teacher);
        if(!teacher){
            res.status(403).json({message: "Error authorization denied"});
            return;
        }
        const feedbacks = await Feedback.findAll({where:{lessonId}})
        res.status(200).json(feedbacks);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function getFeedbackById(req:Request, res:Response){
    try {
        const {feedbackId} = req.params;
        const {lessonId} = req.params;
        const lessonFeedbackExists = await Feedback.findOne({where:{lessonId}})
        if(!lessonFeedbackExists){
            res.status(404).json({message: "Feedback does not exist in lesson"});
            return;
        }
        const feedback = await Feedback.findOne({where:{lessonId, id:feedbackId}});
        if(!feedback){
            res.status(404).json({message: "Feedback not found"});
            return;
        }
        res.status(200).json(feedback);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}export async function createFeedback(req:Request, res:Response){
    try {
        const {id} = req.body;
        const {lessonId, anonymous,comment,
            content,methodology,engagement} = req.body;
        const {classId} = req.params;
        const teacher = await Class.findOne({
            where:{
                id:classId,
                teacherId: id,
            }
        })
        if(teacher){
            res.status(403).json({message: "Error authorization denied"});
            return;
        }
        const newFeedback = await Feedback.create({
            lessonId,
            studentId: id,
            anonymous,
            comment,
            content,
            methodology,
            engagement
        });
        if(anonymous === true){
            const response = {
                id: newFeedback.id,
                lessonId: newFeedback.lessonId,
                anonymous:newFeedback.anonymous,
                comment: newFeedback.comment,
                content: newFeedback.content,
                methodology: newFeedback.methodology,
                engagement: newFeedback.engagement
            }
            res.status(201).json(response);
            return;
        }
        res.status(201).json(newFeedback);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function deleteFeedback(req:Request, res:Response){
    try {
        const {lessonId} = req.params;
        const {feedbackId} = req.params
        const lessonFeedbackExists = await Feedback.findOne({where:{lessonId, id:feedbackId}})
        if(!lessonFeedbackExists){
            res.status(404).json({message: "Feedback does not exist in lesson"});
            return;
        }
        const deletedData = await Feedback.destroy({
            where:{
                id:feedbackId
            }
        })
        if(deletedData === 0){
            res.status(404).json({message: "Feedback not found"});
            return;
        }
        res.status(200).json({message: "Feedback deleted successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}