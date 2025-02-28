import { body } from "express-validator";

export const loginValidationQR = [
  body("USERNAME")
    .notEmpty()
    .isString()
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
