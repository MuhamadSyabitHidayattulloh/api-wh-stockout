import CryptoJS from "crypto-js";
import { connectDBMaster } from "../Config/dbConnection.js";

export const confirmLoginModel = async (data) => {
  const passwordHash = CryptoJS.MD5(data.PASSWORD).toString(CryptoJS.enc.Hex);
  // console.log(passwordHash);
  const query = `SELECT  username, plant_code, name
    FROM [master].[dbo].[master_login] 
    where username = '${
      data.USERNAME
    }' and (password = '${passwordHash.toLowerCase()}' or password = '${passwordHash.toUpperCase()}') and stockout_wh_role > 0
    `;
  const result = await connectDBMaster(query);
  return result;
};

export const confirmLoginModelQr = async (data) => {
  const usernameEncrypted = data.USERNAME;

  const query = ` SELECT username, plant_code, name from [master].[dbo].[master_login]
  where (password = '${data.PASSWORD.toUpperCase()}' or password = '${data.PASSWORD.toLowerCase()}')  and stockout_wh_role > 0`;
  const result = await connectDBMaster(query);
  let foundTargetHash = false;
  if (result.recordset != "") {
    // console.log(result.recordset);
    const processedUsers = result.recordset.map((user) => {
      // trim the username
      let trimmedUsername = user.username.trim();
      // generate MD5 hash
      let md5Hash = CryptoJS.MD5(trimmedUsername).toString(CryptoJS.enc.Hex);
      // convert MD5 hash to uppercase
      return {
        usernameAfter: md5Hash.toUpperCase(),
        username: trimmedUsername,
        plant_code: user.plant_code,
        name: user.name,
      };
    });
    foundTargetHash =
      processedUsers.find((item) => item.usernameAfter === usernameEncrypted) ||
      false;
  }
  // console.log(result);
  return foundTargetHash;
};
