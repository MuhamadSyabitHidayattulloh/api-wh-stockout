import { confirmLoginModelQr } from "../Models/login.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import master_login from "../Models/master_login.js";
import CryptoJS from "crypto-js";
import { Op } from "sequelize";
dotenv.config();

export const confirmLoginStockoutApps = async (req, res) => {
  try {
    const passwordHash = CryptoJS.MD5(req.body.PASSWORD).toString(
      CryptoJS.enc.Hex
    );

    const data = await master_login.findOne({
      attributes: ["username", "plant_code", "name"],
      where: {
        username: req.body.USERNAME,
        password: passwordHash.toLowerCase() || passwordHash.toUpperCase(),
        stockout_wh_role: { [Op.gt]: 0 },
      },
    });

    if (!data) {
      return res.status(401).json({
        msg: "Data tidak terdaftar dan tidak dapat akses login",
      });
    }

    //jwt
    const token = jwt.sign(
      { username: data.username },
      process.env.JWT_SECRET,
      { algorithm: "HS256" } // Algoritma standar
    );

    const loginData = {
      USERID: data.username.trim(),
      plant_code: data.plant_code.trim(),
      USERNAME: data.name.trim().split(" ")[0],
      token: token,
    };

    res.status(200).json({
      msg: "get data success login",
      data: loginData,
    });
  } catch (error) {
    res.status(400).json({
      msg: "get data failed",
      errMsg: error,
    });
  }
};

export const confirmLoginQrStockoutApps = async (req, res) => {
  try {
    // console.log(req.body);
    const result = await confirmLoginModelQr(req.body);
    //jwt
    const token = jwt.sign(
      { username: result.username },
      process.env.JWT_SECRET,
      { algorithm: "HS256" } // Algoritma standar
    );

    const loginData = {
      username: result.username,
      plant_code: result.plant_code.trim(),
      name: result.name,
      token: token,
    };

    res.status(200).json({
      msg: "get data success login",
      data: loginData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "get data failed !",
      errMsg: error,
    });
  }
};
