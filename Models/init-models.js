import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _master_plant from  "./master_plant.js";

export default function initModels(sequelize) {
  const master_plant = _master_plant.init(sequelize, DataTypes);


  return {
    master_plant,
  };
}
