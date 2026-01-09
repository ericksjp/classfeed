import { z } from "zod";

const LessonInput = z.object({
    title: z
        .string({ required_error: "Title is required" })
        .trim()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(255, { message: "Title must be at most 255 characters long" }),

    dateTime: z.coerce.date().default(new Date()),

    classId: z.string({ message: "ClassId is required" }).uuid({ message: "Invalid ClassId" }),
});

export default LessonInput;
