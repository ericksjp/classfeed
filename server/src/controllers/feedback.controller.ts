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
}
