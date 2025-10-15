import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _master_login from  "./master_login.js";

export default function initModels(sequelize) {
  const master_login = _master_login.init(sequelize, DataTypes);


  return {
    master_login,
  };
}
