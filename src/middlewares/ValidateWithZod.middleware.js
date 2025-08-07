import { ZodError } from "zod";
import { APIError } from "../utils/apiError.js";

export const ValidateWithZod = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      throw new APIError(400, error.issues[0].message);
    }
    next(error);
  }
};
