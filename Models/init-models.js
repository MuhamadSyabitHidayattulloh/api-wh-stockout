var DataTypes = require("sequelize").DataTypes;
var _WH_T_TEMPORARY = require("./WH_T_TEMPORARY");

function initModels(sequelize) {
  var WH_T_TEMPORARY = _WH_T_TEMPORARY(sequelize, DataTypes);


  return {
    WH_T_TEMPORARY,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
