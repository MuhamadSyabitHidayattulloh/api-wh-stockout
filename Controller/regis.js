import RegistrationModel from "../Models/regis.js";
import md5 from "md5";

export const checkNpk = async (req, res) => {
  const { userID } = req.body;
  try {
    const user = await RegistrationModel.checkNpk(userID);
    if (user) {
      res.send("userExisted");
    } else {
      res.send("notExisted");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const updateRole = async (req, res) => {
  const { userID } = req.body;
  try {
    const updated = await RegistrationModel.updateRole(userID);
    res.send(updated ? "updated" : "failedToUpdate");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const showCompany = async (req, res) => {
  try {
    const companies = await RegistrationModel.showCompany();
    res.send(companies.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const showPlant = async (req, res) => {
  const { companyCode } = req.query;
  try {
    const plants = await RegistrationModel.showPlant(companyCode);
    res.send(plants.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const registerNew = async (req, res) => {
  const {
    userID,
    password,
    name,
    company,
    plant,
    buCode,
    email = "-",
  } = req.body;
  const userData = {
    userID,
    password: md5(password),
    name,
    email,
    company,
    plant,
    buCode,
  };

  try {
    const added = await RegistrationModel.registerNew(userData);
    res.send(added ? "addedNewUser" : "failedToAddNewUser");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
