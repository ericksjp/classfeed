import {z} from "zod"

const uuidSchema = z.string().uuid()
const dateSchema = z.coerce.date();

function isUuidValid(uuid: string): boolean {
  const {error} = uuidSchema.safeParse(uuid);
  return !error;
}

function isDateValid(date: string): boolean {
  const {error} = dateSchema.safeParse(date);
  return !error
}

export {
  isUuidValid,
  isDateValid,
}

