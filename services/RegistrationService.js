// services/RegistrationService.js
import MASTER_LOGIN from "../Models/MASTER_LOGIN.js";
import MASTER_COMPANY from "../Models/MASTER_COMPANY.js";
import MASTER_PLANT from "../Models/MASTER_PLANT.js";
import { AuthService } from "./AuthService.js";

export class RegistrationService {
  static async checkUserExists(username) {
    try {
      const user = await MASTER_LOGIN.findOne({
        where: { username: username },
        attributes: ["username", "stockout_wh_role"],
      });

      return user
        ? {
            username: user.username,
            stockout_wh_role: user.stockout_wh_role,
            exists: true,
          }
        : { exists: false };
    } catch (error) {
      console.error("Error checking user existence", error);
      throw error;
    }
  }

  static async updateUserRole(username, role = 0) {
    try {
      const [affectedRows] = await MASTER_LOGIN.update(
        { warehouse_role: role },
        { where: { username: username } }
      );

      return affectedRows > 0;
    } catch (error) {
      console.error("Error updating user role", error);
      throw error;
    }
  }

  static async getAllCompanies() {
    try {
      const companies = await MASTER_COMPANY.findAll({
        where: { active_flag: "A" },
        attributes: ["company_code", "company_name_as"],
        order: [["company_name_as", "ASC"]],
      });

      return companies;
    } catch (error) {
      console.error("Error fetching companies", error);
      throw error;
    }
  }

  static async getPlantsByCompany(companyCode) {
    try {
      const plants = await MASTER_PLANT.findAll({
        where: {
          company_code: companyCode,
          active_flag: "A",
        },
        attributes: ["plant_code", "plant_name"],
        order: [["plant_name", "ASC"]],
      });

      return plants;
    } catch (error) {
      console.error("Error fetching plants", error);
      throw error;
    }
  }

  static async registerNewUser(userData) {
    try {
      const { userID, password, name, email, company, plant, buCode } =
        userData;

      // Validate input
      if (!userID || !password || !name) {
        throw new Error("Required fields missing: userID, password, name");
      }

      // Check if user already exists
      const existingUser = await this.checkUserExists(userID);
      if (existingUser.exists) {
        throw new Error("User already exists");
      }

      // Map company names to codes
      const companyCode = this.mapCompanyNameToCode(company);
      if (!companyCode) {
        throw new Error("Invalid company name");
      }

      // Map plant names to codes
      const plantCode = this.mapPlantNameToCode(plant);
      if (plantCode === null) {
        throw new Error("Invalid plant name");
      }

      // Hash password
      const hashedPassword = AuthService.generatePasswordHash(password);

      // Create new user
      const newUser = await MASTER_LOGIN.create({
        username: userID,
        password: hashedPassword,
        name: name,
        email: email || null,
        bu_code: buCode || null,
        company_code: companyCode,
        plant_code: plantCode,
        stockout_wh_role: 1,
        created_by: userID,
        created_date: new Date(),
        updated_by: userID,
        updated_date: new Date(),
        active_flag: "Y",
      });

      return {
        success: true,
        user: {
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          company_code: newUser.company_code,
          plant_code: newUser.plant_code,
        },
      };
    } catch (error) {
      console.error("Error registering new user", error);
      throw error;
    }
  }

  static mapCompanyNameToCode(companyName) {
    const companyMap = {
      DNIA: "D",
      HDI: "H",
      DMIA: "M",
      DSIA: "S",
      TACI: "T",
    };

    return companyMap[companyName] || null;
  }

  static mapPlantNameToCode(plantName) {
    const plantMap = {
      SUNTER: "0",
      BEKASI: "1",
      FAJAR: "5",
    };

    return plantMap[plantName] !== undefined ? plantMap[plantName] : null;
  }

  static async validateRegistrationData(userData) {
    const errors = [];

    const { userID, password, name, email, company, plant } = userData;

    // Basic validation
    if (!userID || userID.trim().length < 3) {
      errors.push("User ID must be at least 3 characters");
    }

    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (!name || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Invalid email format");
    }

    if (!company || !this.mapCompanyNameToCode(company)) {
      errors.push("Invalid company selection");
    }

    if (!plant || this.mapPlantNameToCode(plant) === null) {
      errors.push("Invalid plant selection");
    }

    // Check if username already exists
    if (userID) {
      const existingUser = await this.checkUserExists(userID);
      if (existingUser.exists) {
        errors.push("Username already exists");
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  static async updateUserStockoutRole(username, role = 1) {
    try {
      const [affectedRows] = await MASTER_LOGIN.update(
        {
          stockout_wh_role: role,
          updated_date: new Date(),
          updated_by: username,
        },
        { where: { username: username } }
      );

      return affectedRows > 0;
    } catch (error) {
      console.error("Error updating user stockout role", error);
      throw error;
    }
  }

  static async getUserRegistrationInfo(username) {
    try {
      const user = await MASTER_LOGIN.findOne({
        where: { username: username },
        attributes: [
          "username",
          "name",
          "email",
          "company_code",
          "plant_code",
          "stockout_wh_role",
          "created_date",
        ],
      });

      if (!user) {
        return null;
      }

      // Get company and plant details
      const company = await MASTER_COMPANY.findOne({
        where: { company_code: user.company_code },
        attributes: ["company_name_as"],
      });

      const plant = await MASTER_PLANT.findOne({
        where: {
          company_code: user.company_code,
          plant_code: user.plant_code,
        },
        attributes: ["plant_name"],
      });

      return {
        username: user.username,
        name: user.name,
        email: user.email,
        company: {
          code: user.company_code,
          name: company ? company.company_name_as : null,
        },
        plant: {
          code: user.plant_code,
          name: plant ? plant.plant_name : null,
        },
        stockout_wh_role: user.stockout_wh_role,
        registered_date: user.created_date,
      };
    } catch (error) {
      console.error("Error getting user registration info", error);
      throw error;
    }
  }
}
