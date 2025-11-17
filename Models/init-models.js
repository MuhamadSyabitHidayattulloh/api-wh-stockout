import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _STOCKOUT_T_TRANSACTION from  "./STOCKOUT_T_TRANSACTION.js";

export default function initModels(sequelize) {
  const STOCKOUT_T_TRANSACTION = _STOCKOUT_T_TRANSACTION.init(sequelize, DataTypes);


  return {
    STOCKOUT_T_TRANSACTION,
  };
}
