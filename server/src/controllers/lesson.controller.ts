import {Request, Response} from "express";
import {Lesson} from "../models"

export async function getlessons(req:Request, res:Response){
    const {classId} = req.params;
    try {
        const lessons = await Lesson.findAll({
            where:{classId}, 
            raw:true,
        });
        res.status(200).json(lessons);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function getLessonById(req:Request, res:Response){
    const {classId} = req.params;
    const {lessonId} = req.params;
    try {
        const lesson = await Lesson.findOne({
            where:{classId, id:lessonId},
            raw: true,
        })
        if(!lesson){
            res.status(404).json({message:"Lesson not found"});
            return;
        }
        res.status(200).json(lesson);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }

}
export async function createLesson(req:Request, res:Response){
    const {title}= req.body;
    const {classId} = req.params
    try {
        const newLesson = await Lesson.create({
            title,
            classId
        });
        res.status(201).json(newLesson);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export async function updateLesson(req:Request, res:Response){
    const {lessonId} = req.params;
    try {
        const {title} = req.body;
        const [updatedData] = await Lesson.update(
            {title},
            {where:{
                id: lessonId,
            }}
        );
        if(updatedData === 0){
            res.status(404).json({message: "Lesson not found"});
            return;
        }
        res.status(200).json(await Lesson.findByPk(lessonId));
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export async function deleteLesson(req:Request, res:Response){
    const {lessonId} = req.params;
    try {
        const deletedData = await Lesson.destroy({
            where:{
                id: lessonId,
            },
        })
        if(deletedData === 0){
            res.status(404).json({message: "Lesson not found"});
            return;
        }
        res.status(200).json({message: "Lesson delete with success"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}


