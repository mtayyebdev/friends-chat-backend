import * as z from "zod";

const SignupValidation = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(13, "Phone number must be at most 13 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

const LoginValidation = z.object({
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(13, "Phone number must be at most 13 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

export { SignupValidation, LoginValidation };
