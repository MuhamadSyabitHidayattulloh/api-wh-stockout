// services/AuthService.js
import CryptoJS from "crypto-js";
import MASTER_LOGIN from "../Models/MASTER_LOGIN.js";
import { Op } from "sequelize";

export class AuthService {
  static async confirmLogin(credentials) {
    try {
      const { USERNAME, PASSWORD } = credentials;
      const passwordHash = CryptoJS.MD5(PASSWORD).toString(CryptoJS.enc.Hex);

      const result = await MASTER_LOGIN.findOne({
        where: {
          username: USERNAME,
          [Op.or]: [
            { password: passwordHash.toLowerCase() },
            { password: passwordHash.toUpperCase() },
          ],
          stockout_wh_role: {
            [Op.gt]: 0,
          },
        },
        attributes: ["username", "plant_code", "name"],
      });

      return result;
    } catch (error) {
      console.error("Error confirmLogin", error);
      throw error;
    }
  }

  static async confirmLoginQr(credentials) {
    try {
      const { USERNAME: usernameEncrypted, PASSWORD } = credentials;

      // Find users with matching password
      const users = await MASTER_LOGIN.findAll({
        where: {
          [Op.or]: [
            { password: PASSWORD.toUpperCase() },
            { password: PASSWORD.toLowerCase() },
          ],
          stockout_wh_role: {
            [Op.gt]: 0,
          },
        },
        attributes: ["username", "plant_code", "name"],
      });

      let foundTargetHash = false;

      if (users.length > 0) {
        const processedUsers = users.map((user) => {
          // trim the username
          const trimmedUsername = user.username.trim();
          // generate MD5 hash
          const md5Hash = CryptoJS.MD5(trimmedUsername).toString(
            CryptoJS.enc.Hex
          );

          return {
            usernameAfter: md5Hash.toUpperCase(),
            username: trimmedUsername,
            plant_code: user.plant_code,
            name: user.name,
          };
        });

        foundTargetHash =
          processedUsers.find(
            (item) => item.usernameAfter === usernameEncrypted.toUpperCase()
          ) || false;
      }

      return foundTargetHash;
    } catch (error) {
      console.error("Error confirmLoginQr", error);
      throw error;
    }
  }

  static async validateUserCredentials(username, password) {
    try {
      const user = await MASTER_LOGIN.findOne({
        where: { username: username },
        attributes: [
          "username",
          "password",
          "plant_code",
          "name",
          "stockout_wh_role",
        ],
      });

      if (!user || user.stockout_wh_role <= 0) {
        return null;
      }

      const passwordHash = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
      const isPasswordValid =
        user.password === passwordHash.toLowerCase() ||
        user.password === passwordHash.toUpperCase();

      if (!isPasswordValid) {
        return null;
      }

      return {
        username: user.username,
        plant_code: user.plant_code,
        name: user.name,
      };
    } catch (error) {
      console.error("Error validateUserCredentials", error);
      throw error;
    }
  }

  static generatePasswordHash(password) {
    return CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
  }

  static generateUsernameHash(username) {
    const trimmedUsername = username.trim();
    return CryptoJS.MD5(trimmedUsername)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();
  }
}
