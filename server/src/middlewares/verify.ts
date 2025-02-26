import {Request, Response, NextFunction} from "express";
import {Class} from "../models"

export async function verifyUserClass(req:Request, res:Response, next:NextFunction){
    try {
        const {id} = req.body;
        const classId = req.params.classId;
        console.log(classId)
        const _class = await Class.findOne({where:{id:classId, teacherId: id}})
        if(!_class){
            res.status(401).json({message:"User not part off class"});
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}