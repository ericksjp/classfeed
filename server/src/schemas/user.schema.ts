import { z } from "zod";

const UserInput = z.object({
  name: z.string({message: "Name is required"})
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" }),

  email: z.string({ message: "Email is required"})
    .trim()
    .email({ message: "Invalid email" })
    .max(255, { message: "Name must be at most 255 characters long" }),

  birthDate: z
    .coerce
    .date()
    .nullable()
    .optional()
    .refine((date) => !date || date <= new Date(), { message: "birthDate must be in the past" }),

  password: z.string({message: "Password is required"})
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(255, { message: "Password must be at most 255 characters long"})
});

export default UserInput;
