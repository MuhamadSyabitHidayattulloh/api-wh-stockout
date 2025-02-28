import express from "express";
import * as registrationController from "../Controller/regis.js";

const router = express.Router();

router.post("/checkNpk", registrationController.checkNpk);
router.post("/updateRole", registrationController.updateRole);
router.get("/showCompany", registrationController.showCompany);
router.get("/showPlant", registrationController.showPlant);
router.post("/registerNew", registrationController.registerNew);
router.get("/testRoute", (req, res) => res.send("testRoute"));

export default router;
