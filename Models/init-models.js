var DataTypes = require("sequelize").DataTypes;
var _LS_T_LOT_FORM = require("./LS_T_LOT_FORM");

function initModels(sequelize) {
  var LS_T_LOT_FORM = _LS_T_LOT_FORM(sequelize, DataTypes);

  return {
    LS_T_LOT_FORM,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
