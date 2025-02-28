import { connectDBMaster } from "../Config/dbConnection.js";

const RegistrationModel = {
  checkNpk: async (username) => {
    const query = `SELECT username, stockout_wh_role FROM master.dbo.master_login WHERE username = '${username}'`;
    const result = await connectDBMaster(query);
    return result.recordset.length > 0 ? result.recordset[0] : null;
  },

  updateRole: async (username) => {
    const query = `UPDATE master_login SET warehouse_role = '0' WHERE username = '${username}'`;
    const result = await connectDBMaster(query);
    return result.rowsAffected > 0;
  },

  showCompany: async () => {
    const query = `SELECT company_code, company_name_as FROM master_company`;
    const result = await connectDBMaster(query);
    return result;
  },

  showPlant: async (companyCode) => {
    const query = `SELECT plant_code, plant_name FROM master_plant WHERE company_code '${companyCode}'`;
    const result = await connectDBMaster(query);
    return result;
  },

  registerNew: async (userData) => {
    const { userID, password, name, email, company, plant, buCode } = userData;
    let company_code = "";
    if (company === "DNIA") {
      company_code = "D";
    } else if (company === "HDI") {
      company_code = "H";
    } else if (company === "DMIA") {
      company_code = "M";
    } else if (company === "DSIA") {
      company_code = "S";
    } else if (company === "TACI") {
      company_code = "T";
    }
    let plant_code = "";
    if (plant == "SUNTER") {
      plant_code = "0";
    } else if (plant == "BEKASI") {
      plant_code = "1";
    } else if (plant == "FAJAR") {
      plant_code = "5";
    }
    const query = `INSERT INTO master_login (username, password, name, email, bu_code, company_code, plant_code, stockout_wh_role, create_by, create_date, update_by, update_date) 
                                        VALUES ('${userID}', '${password}', '${name}', '${email}', '${buCode}', '${company_code}', '${plant_code}', '1', '${userID}', CURRENT_TIMESTAMP, '${userID}', CURRENT_TIMESTAMP)`;
    const result = await connectDBMaster(query);
    return result.rowsAffected > 0;
  },
};

export default RegistrationModel;
