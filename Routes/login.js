import express from "express";
import {
  confirmLoginQrStockoutApps,
  confirmLoginStockoutApps,
} from "../Controller/login.js";
import { loginValidation } from "../Validation/loginValidation.js";
import { loginValidationQR } from "../Validation/loginValidationQr.js";
import { validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/Stockout/confirmLogin",
  loginValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  },
  confirmLoginStockoutApps
);

router.post(
  "/Stockout/confirmLoginQr",
  loginValidationQR,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  },
  confirmLoginQrStockoutApps
);

router.get("/testRoute", async (req, res) =>
  res.send("PE Development 2024 asep")
);

export default router;
