// services/RegistrationService.js
import MASTER_LOGIN from "../Models/MASTER_LOGIN.js";
import MASTER_COMPANY from "../Models/MASTER_COMPANY.js";
import MASTER_PLANT from "../Models/MASTER_PLANT.js";
import MASTER_BU from "../Models/MASTER_BU.js";
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
      console.log(username, role);
      const [affectedRows] = await MASTER_LOGIN.update(
        { stockout_wh_role: role },
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
        attributes: ["company_code", "company_name", "company_name_as"],
        order: [["company_name", "ASC"]],
      });

      // Trim whitespace from all string fields
      return companies.map((company) => ({
        ...company.toJSON(),
        company_name: company.company_name?.trim(),
        company_name_as: company.company_name_as?.trim(),
      }));
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
        attributes: ["plant_code", "plant_name", "plant_name_alias"],
        order: [["plant_name", "ASC"]],
      });

      // Trim whitespace from all string fields
      return plants.map((plant) => ({
        ...plant.toJSON(),
        plant_name: plant.plant_name?.trim(),
        plant_name_alias: plant.plant_name_alias?.trim(),
      }));
    } catch (error) {
      console.error("Error fetching plants", error);
      throw error;
    }
  }

  static async getBUsByPlant(companyCode, plantCode) {
    try {
      const bus = await MASTER_BU.findAll({
        where: {
          company_code: companyCode,
          plant_code: plantCode,
          active_flag: "A",
        },
        attributes: ["bu_code", "bu_name", "bu_name_alias"],
        order: [["bu_name", "ASC"]],
      });

      // Trim whitespace from all string fields
      return bus.map((bu) => ({
        ...bu.toJSON(),
        bu_name: bu.bu_name?.trim(),
        bu_name_alias: bu.bu_name_alias?.trim(),
      }));
    } catch (error) {
      console.error("Error fetching BUs", error);
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

      // Validate company code exists
      const companyRecord = await MASTER_COMPANY.findOne({
        where: { company_code: company, active_flag: "A" },
      });

      if (!companyRecord) {
        throw new Error("Invalid company code");
      }

      // Validate plant code exists for the company
      const plantRecord = await MASTER_PLANT.findOne({
        where: {
          company_code: company,
          plant_code: plant,
          active_flag: "A",
        },
      });
      if (!plantRecord) {
        throw new Error("Invalid plant code for the selected company");
      }

      // Validate BU code if provided
      let buRecord = null;
      if (buCode) {
        buRecord = await MASTER_BU.findOne({
          where: {
            company_code: company,
            plant_code: plant,
            bu_code: buCode,
            active_flag: "A",
          },
        });
        if (!buRecord) {
          throw new Error("Invalid BU code for the selected company and plant");
        }
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
        company_code: company,
        plant_code: plant,
        stockout_wh_role: 1,
        create_by: userID,
        create_date: new Date(),
        active_flag: "A",
      });
      console.log("test", newUser);

      return {
        success: true,
        user: {
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          company_code: newUser.company_code,
          plant_code: newUser.plant_code,
          bu_code: newUser.bu_code,
        },
      };
    } catch (error) {
      console.error("Error registering new user", error);
      throw error;
    }
  }

  static async validateRegistrationData(userData) {
    const errors = [];

    const { userID, password, name, email, company, plant, buCode } = userData;

    console.log("test", userID);
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

    if (!company) {
      errors.push("Company is required");
    }

    if (!plant) {
      errors.push("Plant is required");
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
          update_date: new Date(),
          update_by: username,
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
          "create_date",
        ],
      });

      if (!user) {
        return null;
      }

      // Get company and plant details
      const company = await MASTER_COMPANY.findOne({
        where: { company_code: user.company_code },
        attributes: ["company_name", "company_name_as"],
      });

      const plant = await MASTER_PLANT.findOne({
        where: {
          company_code: user.company_code,
          plant_code: user.plant_code,
        },
        attributes: ["plant_name"],
      });

      const bu = user.bu_code
        ? await MASTER_BU.findOne({
            where: {
              company_code: user.company_code,
              plant_code: user.plant_code,
              bu_code: user.bu_code,
            },
            attributes: ["bu_name", "bu_name_alias"],
          })
        : null;

      return {
        username: user.username,
        name: user.name,
        email: user.email,
        company: {
          code: user.company_code,
          name: company ? company.company_name : null,
          alias: company ? company.company_name_as : null,
        },
        plant: {
          code: user.plant_code,
          name: plant ? plant.plant_name : null,
        },
        bu: user.bu_code
          ? {
              code: user.bu_code,
              name: bu ? bu.bu_name : null,
              alias: bu ? bu.bu_name_alias : null,
            }
          : null,
        stockout_wh_role: user.stockout_wh_role,
        registered_date: user.create_date,
      };
    } catch (error) {
      console.error("Error getting user registration info", error);
      throw error;
    }
  }
}
