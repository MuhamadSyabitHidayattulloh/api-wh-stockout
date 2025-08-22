// Models/init-models.js
import { DataTypes } from "sequelize";
import _WH_T_FIFO from "./WH_T_FIFO.js";
import _LS_T_LOT_FORM from "./LS_T_LOT_FORM.js";
import _STOCKOUT_ERROR_LOG from "./STOCKOUT_ERROR_LOG.js";
import _STOCKOUT_T_TRANSACTION_2 from "./STOCKOUT_T_TRANSACTION_2.js";
import _WH_T_TEMPORARY from "./WH_T_TEMPORARY.js";
import _MASTER_LOGIN from "./MASTER_LOGIN.js";

function initModels(sequelize) {
  const WH_T_FIFO = _WH_T_FIFO(sequelize, DataTypes);
  const LS_T_LOT_FORM = _LS_T_LOT_FORM(sequelize, DataTypes);
  const STOCKOUT_ERROR_LOG = _STOCKOUT_ERROR_LOG(sequelize, DataTypes);
  const STOCKOUT_T_TRANSACTION_2 = _STOCKOUT_T_TRANSACTION_2(
    sequelize,
    DataTypes
  );
  const WH_T_TEMPORARY = _WH_T_TEMPORARY(sequelize, DataTypes);
  const MASTER_LOGIN = _MASTER_LOGIN(sequelize, DataTypes);

  return {
    WH_T_FIFO,
    LS_T_LOT_FORM,
    STOCKOUT_ERROR_LOG,
    STOCKOUT_T_TRANSACTION_2,
    WH_T_TEMPORARY,
    MASTER_LOGIN,
  };
}

export { initModels };
export default initModels;
