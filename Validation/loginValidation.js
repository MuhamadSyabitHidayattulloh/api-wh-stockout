import { body } from "express-validator";

export const loginValidation = [
  body("USERNAME")
    .notEmpty()
    .isString()
    .isAlphanumeric()
    .withMessage("Username must contain only alphanumeric characters")
    .trim()
    .custom((value) => {
      if (/\s/.test(value)) {
        throw new Error("Username must not contain spaces");
      }
      return true;
    }),

  body("PASSWORD")
    .notEmpty()
    .isString()
    .trim()
    .custom((value) => {
      if (/\s/.test(value)) {
        throw new Error("Password must not contain spaces");
      }
      return true;
    }),
];
