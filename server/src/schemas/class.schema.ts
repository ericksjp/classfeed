import { z } from "zod";

const ClassInput = z.object({
    name: z
        .string()
        .trim()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(255, { message: "Name must be at most 100 characters long" }),

    subject: z
        .string()
        .trim()
        .min(3, { message: "Subject must be at least 3 characters long" })
        .max(255, { message: "Subject must be at most 100 characters long" }),

    institution: z
        .string()
        .trim()
        .min(3, { message: "Institution must be at least 3 characters long" })
        .max(255, { message: "Institution must be at most 100 characters long" }),

    status: z.enum(["Ativo", "Arquivado"], { message: "Invalid status" }),

    location: z.union([z.tuple([z.number(), z.number()]), z.null()]).optional(),

    teacherId: z.string().uuid({ message: "Invalid teacher ID" }),
});

export default ClassInput;
