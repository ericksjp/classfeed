import { z } from "zod";

const LessonInput = z.object({
  title: z.string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(255, { message: "Title must be at most 255 characters long" }),

  dateTime: z.coerce.date().default(new Date()),

  classId: z.string()
    .uuid({ message: "Invalid class ID" }),
});

export default LessonInput;
