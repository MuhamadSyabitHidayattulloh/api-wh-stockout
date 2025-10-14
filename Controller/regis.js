// Controller/regis.js - Updated with RegistrationService
import { RegistrationService } from "../services/RegistrationService.js";

export const checkNpk = async (req, res) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return res.status(400).json({
        msg: "User ID is required",
        status: "error",
      });
    }

    const userCheck = await RegistrationService.checkUserExists(userID);

    if (userCheck.exists) {
      res.status(200).json({
        msg: "User already exists",
        status: "userExisted",
        data: {
          username: userCheck.username,
          stockout_wh_role: userCheck.stockout_wh_role,
        },
      });
    } else {
      res.status(200).json({
        msg: "User does not exist",
        status: "notExisted",
      });
    }
  } catch (error) {
    console.error("Check NPK error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { userID, role = 0 } = req.body;

    if (!userID) {
      return res.status(400).json({
        msg: "User ID is required",
        status: "error",
      });
    }

    console.log("test", userID);
    const updated = await RegistrationService.updateUserRole(userID, role);

    res.status(200).json({
      msg: updated ? "Role updated successfully" : "Failed to update role",
      status: updated ? "updated" : "failedToUpdate",
      success: updated,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
};

export const showCompany = async (req, res) => {
  try {
    const companies = await RegistrationService.getAllCompanies();

    res.status(200).json({
      msg: "Companies retrieved successfully",
      status: "success",
      data: companies,
    });
  } catch (error) {
    console.error("Show companies error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
};

export const showPlant = async (req, res) => {
  try {
    const { companyCode } = req.query;

    if (!companyCode) {
      return res.status(400).json({
        msg: "Company code is required",
        status: "error",
      });
    }

    const plants = await RegistrationService.getPlantsByCompany(companyCode);

    res.status(200).json({
      msg: "Plants retrieved successfully",
      status: "success",
      data: plants,
    });
  } catch (error) {
    console.error("Show plants error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
};

export const showBU = async (req, res) => {
  try {
    const { companyCode, plantCode } = req.query;

    if (!companyCode || !plantCode) {
      return res.status(400).json({
        msg: "Company code and plant code are required",
        status: "error",
      });
    }

    const bus = await RegistrationService.getBUsByPlant(companyCode, plantCode);

    res.status(200).json({
      msg: "BUs retrieved successfully",
      status: "success",
      data: bus,
    });
  } catch (error) {
    console.error("Show BUs error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
};

export const registerNew = async (req, res) => {
  try {
    const {
      userID,
      password,
      name,
      company,
      plant,
      buCode,
      email = null,
    } = req.body;

    const userData = {
      userID,
      password,
      name,
      email,
      company,
      plant,
      buCode,
    };

    // Validate registration data
    const validation = await RegistrationService.validateRegistrationData(
      userData
    );

    if (!validation.isValid) {
      return res.status(400).json({
        msg: "Validation failed",
        status: "validationError",
        errors: validation.errors,
      });
    }
    // Register new user
    const result = await RegistrationService.registerNewUser(userData);

    if (result.success) {
      res.status(201).json({
        msg: "User registered successfully",
        status: "addedNewUser",
        data: result.user,
      });
    } else {
      res.status(400).json({
        msg: "Failed to register user",
        status: "failedToAddNewUser",
      });
    }
  } catch (error) {
    console.error("Register new user error:", error);

    if (error.message.includes("already exists")) {
      return res.status(409).json({
        msg: "User already exists",
        status: "userExists",
        error: error.message,
      });
    }

    res.status(500).json({
      msg: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
};

// Additional controller methods
export const getUserInfo = async (req, res) => {
  try {
    const { username } = req.params;

    console.log("test", username);
    const userInfo = await RegistrationService.getUserRegistrationInfo(
      username
    );

    if (!userInfo) {
      return res.status(404).json({
        msg: "User not found",
        status: "notFound",
      });
    }

    res.status(200).json({
      msg: "User information retrieved successfully",
      status: "success",
      data: userInfo,
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
};

export const updateStockoutRole = async (req, res) => {
  try {
    const { userID, role = 1 } = req.body;

    if (!userID) {
      return res.status(400).json({
        msg: "User ID is required",
        status: "error",
      });
    }

    const updated = await RegistrationService.updateUserStockoutRole(
      userID,
      role
    );

    res.status(200).json({
      msg: updated
        ? "Stockout role updated successfully"
        : "Failed to update stockout role",
      status: updated ? "updated" : "failedToUpdate",
      success: updated,
    });
  } catch (error) {
    console.error("Update stockout role error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
};

export const validateRegistration = async (req, res) => {
  try {
    const userData = req.body;

    const validation = await RegistrationService.validateRegistrationData(
      userData
    );

    res.status(200).json({
      msg: validation.isValid ? "Validation passed" : "Validation failed",
      status: validation.isValid ? "valid" : "invalid",
      isValid: validation.isValid,
      errors: validation.errors,
    });
  } catch (error) {
    console.error("Validate registration error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
};
