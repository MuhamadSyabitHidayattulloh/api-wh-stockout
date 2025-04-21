var DataTypes = require("sequelize").DataTypes;
var _WH_T_FIFO = require("./WH_T_FIFO");

function initModels(sequelize) {
  var WH_T_FIFO = _WH_T_FIFO(sequelize, DataTypes);


  return {
    WH_T_FIFO,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
