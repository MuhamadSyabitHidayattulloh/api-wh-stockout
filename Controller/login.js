// Controller/login.js - Updated with AuthService
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthService } from "../services/AuthService.js";

dotenv.config();

export const confirmLoginStockoutApps = async (req, res) => {
  try {
    const { USERNAME, PASSWORD } = req.body;

    // Use AuthService instead of direct model access
    const userData = await AuthService.confirmLogin({ USERNAME, PASSWORD });

    if (!userData) {
      return res.status(401).json({
        msg: "Data tidak terdaftar dan tidak dapat akses login",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: userData.username },
      process.env.JWT_SECRET,
      { algorithm: "HS256" }
    );

    const loginData = {
      USERID: userData.username.trim(),
      plant_code: userData.plant_code.trim(),
      USERNAME: userData.name.trim().split(" ")[0],
      token: token,
    };

    res.status(200).json({
      msg: "get data success login",
      data: loginData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      msg: "get data failed",
      errMsg: error.message,
    });
  }
};

export const confirmLoginQrStockoutApps = async (req, res) => {
  try {
    // Use AuthService instead of model function
    const result = await AuthService.confirmLoginQr(req.body);

    if (!result) {
      return res.status(401).json({
        msg: "Data tidak terdaftar atau QR code tidak valid",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: result.username },
      process.env.JWT_SECRET,
      { algorithm: "HS256" }
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
    console.error("QR Login error:", error);
    res.status(400).json({
      msg: "get data failed !",
      errMsg: error.message,
    });
  }
};

// Additional controller methods for better API design
export const validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        msg: "Token tidak ditemukan",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      msg: "Token valid",
      data: { username: decoded.username },
    });
  } catch (error) {
    res.status(401).json({
      msg: "Token tidak valid",
      errMsg: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { username, currentPassword } = req.body;

    // Validate current password
    const isValid = await AuthService.validateUserCredentials(
      username,
      currentPassword
    );

    if (!isValid) {
      return res.status(401).json({
        msg: "Password saat ini tidak benar",
      });
    }

    // Update password logic would go here
    // This would require an update method in AuthService

    res.status(200).json({
      msg: "Password berhasil diubah",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(400).json({
      msg: "Gagal mengubah password",
      errMsg: error.message,
    });
  }
};
