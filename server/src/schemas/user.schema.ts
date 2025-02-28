import { z } from "zod";

const UserInput = z.object({
  name: z.string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" }),

  email: z.string()
    .trim()
    .email({ message: "Invalid email" })
    .max(255, { message: "Name must be at most 255 characters long" }),

  profilePicture: z.string()
    .trim()
    .url({ message: "Invalid URL" }),

  dateOfBirth: z.coerce.date()
    .max(new Date(), { message: "Date of birth must be in the past" }),

  password: z.string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(255, { message: "Password must be at most 255 characters long"})
});

export default UserInput;
