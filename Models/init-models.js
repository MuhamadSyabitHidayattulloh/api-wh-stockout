var DataTypes = require("sequelize").DataTypes;
var _LS_T_LOT_FORM_1 = require("./LS_T_LOT_FORM_1");

function initModels(sequelize) {
  var LS_T_LOT_FORM_1 = _LS_T_LOT_FORM_1(sequelize, DataTypes);


  return {
    LS_T_LOT_FORM_1,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
