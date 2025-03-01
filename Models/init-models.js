var DataTypes = require("sequelize").DataTypes;
var _STOCKOUT_T_TRANSACTION_2 = require("./STOCKOUT_T_TRANSACTION_2");

function initModels(sequelize) {
  var STOCKOUT_T_TRANSACTION_2 = _STOCKOUT_T_TRANSACTION_2(sequelize, DataTypes);


  return {
    STOCKOUT_T_TRANSACTION_2,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
