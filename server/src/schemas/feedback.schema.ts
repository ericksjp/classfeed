import { z } from "zod"

const FeedbackInput = z.object({
  lessonId: z.string()
    .uuid({ message: "Invalid lesson ID" }),

  studentId: z.string()
    .uuid({ message: "Invalid student ID" }),

  anonymous: z.boolean().default(false),

  comment: z.string()
    .trim()
    .max(500, { message: "Comment must be at most 500 characters long" })
    .nullable()
    .optional(),

  content: z.number()
    .int()
    .min(1, { message: "Content rating must be at least 1" })
    .max(5, { message: "Content rating must be at most 5" })
    .nullable()
    .optional(),

  methodology: z.number()
    .int()
    .min(1, { message: "Methodology rating must be at least 1" })
    .max(5, { message: "Methodology rating must be at most 5" })
    .nullable()
    .optional(),

  engagement: z.number()
    .int()
    .min(1, { message: "Engagement rating must be at least 1" })
    .max(5, { message: "Engagement rating must be at most 5" })
    .nullable()
    .optional(),
}).refine((data) => {
  const ratings = [data.content, data.methodology, data.engagement]
  let nullCount = 0;
  ratings.forEach((val) => val === null && nullCount++)
  return nullCount < 3;
}, {
  message: "At least one of content, methodology, or engagement must be provided",
  path: ["content", "methodology", "engagement"],
});

export default FeedbackInput
