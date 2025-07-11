import {
  connectDBStoraging,
  connectDBWarehouse,
} from "../Config/dbConnection.js";

export const getDataSeparationByOneWayKanbanModels = async (id) => {
  /* 
  ##############################################################################
  NOTE : Using knex
  AUTHOR : BRAV
  ##############################################################################
  */
  const knex = connectDBWarehouse();
  const query = await knex.raw(`SELECT [id]
  ,[sj_code]
  ,[trolley]
  ,[partno]
  ,[vndnr]
  ,[slpno]
  ,[qty]
  ,[imgdata]
  ,[separation]
  ,[trf_date]
FROM [WAREHOUSE].[dbo].[DTD2_SEPARATION] where imgdata = '${id}'`);

  // return await connectDBWarehouse(query);
  return query;
};

export const getDataStoragingByOneWayKanbanModels = async (id) => {
  const query = `SELECT [log_id]
    ,[storaging_id]
    ,[separation_id]
    ,[temp_id]
    ,[sj_code]
    ,[imgdata]
    ,[qty]
    ,[kanban_partno]
    ,[store_id]
    ,[created_date]
    ,[created_by]
    ,[updated_date]
    ,[updated_by]
FROM [DX_STORAGE].[dbo].[STORAGE_T_LOG] where imgdata = '${id}'`;

  return await connectDBStoraging(query);
};

export const getDataSeparationByOneWayKanbanTestModels = async () => {
  /* 
  ##############################################################################
  NOTE : Using knex
  AUTHOR : BRAV
  ##############################################################################
  */
  const knex = connectDBWarehouse();
  const query = await knex.raw(`
    SELECT TOP 1 *
    FROM [WAREHOUSE].[dbo].[DTD2_SEPARATION] order by id desc`);

  // return await connectDBWarehouse(query);
  return query;
};

export const stockoutMisuzumashiModels = async (data) => {
  const knex = connectDBWarehouse();
  try {
    const result = data.map((data) => ({
      transaction_id: data.transaction_id,
      pattern: data.pattern,
      idbox_no: data.idbox_no,
      timescan_idbox: data.timescan_idbox,
      partno: data.partno,
      kbn_seq: data.kbn_seq,
      qty_kbn_std: data.qty_kbn_std,
      qty_kbn_act: data.qty_kbn_act,
      wh_loc: data.wh_loc,
      line_id: data.line_id,
      operator: data.operator,
      status: data.status,
      complete: data.complete,
      create_by: data.create_by,
      create_date: data.create_date,
      wh_code: data.wh_code,
    }));
    const submit = await knex("LS_T_REPORT_MOBILE_1").insert(result);
    console.log(submit);
    return submit;
  } catch (error) {
    console.error("Error stockOutWithoutInstruction", error);
    throw error;
  } finally {
    knex.destroy;
  }
};

export const stockOutWithoutInstruction = async (data) => {
  /* 
  ##############################################################################
  NOTE : Menggunakan metode bulk insert untuk membuat efisensi insert data ke SQL
  AUTHOR : BRAV
  ##############################################################################
  */
  // console.log(data);

  const knex = connectDBWarehouse();
  const failedData = [];
  let successCount = 0;
  try {
    const result = data.map((data) => ({
      transaction_id: data.transaction_id,
      pattern: data.pattern,
      idbox_no: data.idbox_no,
      timescan_idbox: data.timescan_idbox,
      partno: data.partno,
      kbn_seq: data.kbn_seq,
      qty_kbn_std: data.qty_kbn_std,
      qty_kbn_act: data.qty_kbn_act,
      wh_loc: data.wh_loc,
      line_id: data.line_id,
      operator: data.operator,
      status: data.status,
      complete: data.complete,
      create_by: data.create_by,
      create_date: data.create_date,
      wh_code: data.wh_code,
    }));
    const submit = await knex("LS_T_REPORT_MOBILE_1").insert(result);
    console.log(submit);
    return submit;
  } catch (error) {
    console.error("Error stockOutWithoutInstruction", error);
    throw error;
  } finally {
    knex.destroy;
  }

  return { successCount, failedData };
};

export const getLastDataStockOut = async () => {
  /* 
  ##############################################################################
  NOTE : Using knex
  AUTHOR : BRAV
  ##############################################################################
  */
  const knex = connectDBWarehouse();
  try {
    const result = await knex("STOCKOUT_T_TRANSACTION")
      .select("SLIP", "FILENAME")
      .orderBy("TGL", "DESC")
      .orderBy("JAM", "DESC")
      .first();
    return result;
  } catch (error) {
    console.error("Error getLastDataStockOut", error);
    throw error;
  } finally {
    knex.destroy;
  }
};

export const getLocationPart = async (data) => {
  const knex = connectDBWarehouse();
  try {
    const result = await knex("WH_M_PART_LOC")
      .select("store_location")
      .where("partno", data);
    return result.length > 0 ? result[0].store_location : "";
  } catch (error) {
    console.error("Error getLocationPart", error);
    throw error;
  } finally {
    knex.destroy;
  }
};

export const getLineIdPart = async (data) => {
  const knex = connectDBWarehouse();
  try {

    const result = await knex("WH_M_PARTNO")
      .select("ls_table")
      .whereRaw("LOWER(partno) LIKE LOWER(?)", [`%${data}%`]);
    

    if (result.length === 0) {
      // Jika data tidak ditemukan, throw error dengan kode tertentu
      const error = new Error("Part number not found");
      error.code = "PART_NOT_FOUND";
      throw error;
    }

    return result.length > 0 ? result[0].ls_table : "";
  } catch (error) {
    // console.error("Error getLineIdPart", error);
    if (!error.code) {
      error.code = "GET_LINE_ID_PART_ERROR";
    }
    throw error;
  } finally {
    knex.destroy;
  }
};

export const getCategoryPart = async (data) => {
  const knex = connectDBWarehouse();
  try {
    const result = await knex("M_PART_CATEGORY")
      .select("product", "model")
      .where("category_partno", data);
    return result[0];
  } catch (error) {
    console.error("Errorr getCategoryPart", error);
  } finally {
    knex.destroy;
  }
};

export const getShoppingList = async (partno) => {
  const knex = connectDBWarehouse();
  try {
    // console.log(partno);
    const categoryId = await knex("M_PART_CATEGORY")
      .select("category_id", "model", "product")
      .where("category_partno", partno);
    const childPart = await knex("M_PART_CATEGORY_MAPPING")
      .select("child_partno", "line_code", "qty")
      .where("category_id", categoryId[0].category_id);
    const detailChildPart = await Promise.all(
      childPart.map(async (item) => {
        const result = await knex("WH_M_PARTNO")
          .select("part_name")
          .where("partno", item.child_partno);
        const partName = result.length > 0 ? result[0].part_name : null;
        const partLoc = await knex("WH_M_PART_LOC")
          .select("store_location")
          .where("partno", item.child_partno);
        const part_loc = result.length > 0 ? partLoc[0].store_location : null;
        return {
          child_partno: item.child_partno,
          line_code: item.line_code,
          part_name: partName,
          part_loc: part_loc,
          qty: item.qty,
        };
      })
    );
    return detailChildPart;
  } catch (error) {
    console.error("Errorr getShoppingList", error);
    throw error;
  } finally {
    knex.destroy;
  }
};

export const getModelAndProductShoppingList = async (partno) => {
  const knex = connectDBWarehouse();
  try {
    const result = await knex("M_PART_CATEGORY")
      .select("model", "product")
      .where("category_partno", partno);
    const model = result.length > 0 ? result[0].model : null;
    const product = result.length > 0 ? result[0].product : null;
    return {
      model: model,
      product: product,
    };
  } catch (error) {
    console.error("Errorr getModelAndProductShoppingList", error);
  } finally {
    knex.destroy;
  }
};

export const getDataMasterLotSizing = async (data) => {
  const knex = connectDBWarehouse();
  try {
    const result = await knex("WH_M_PARTNO")
      .select(
        "qty_lot",
        "ls_table",
        "qty_scan",
        "std_kbn_ro",
        "lot_sizing",
        "qty_after_ls"
      )
      .where("partno", data);
    const qty_lot = result.length > 0 ? result[0].qty_lot : null;
    const ls_table = result.length > 0 ? result[0].ls_table : null;
    const qty_scan = result.length > 0 ? result[0].qty_scan : null;
    const std_kbn_ro = result.length > 0 ? result[0].std_kbn_ro : null;
    const lot_sizing = result.length > 0 ? result[0].lot_sizing : null;
    const qty_after_ls = result.length > 0 ? result[0].qty_after_ls : null;
    return {
      qty_lot: qty_lot,
      ls_table: ls_table,
      qty_scan: qty_scan,
      std_kbn_ro: std_kbn_ro,
      lot_sizing: lot_sizing,
      qty_after_ls: qty_after_ls,
    };
  } catch (error) {
    console.error("Errorr getDataMasterLotsizing", error);
  } finally {
    knex.destroy;
  }
};

export const createDataLotSizing = async (data) => {
  const knex = connectDBWarehouse();
  const failedData = [];
  let successCount = 0;
  try {
    for (const lot of data) {
      try {
        const result = {
          partno: lot.partno,
          kbn_scan: lot.kbn_scan,
          kbn_std: lot.kbn_std,
          qty_scan: lot.qty_scan,
          kbn_lot: lot.kbn_lot,
          create_by: lot.create_by,
          create_date: lot.create_date,
          line_id: lot.line_id,
          status: lot.status || null,
          wh_code: lot.wh_code,
        };
        await knex("LS_T_LOT_FORM").insert(result);
      } catch (error) {
        console.log(error);
        console.error("Error inserting lot data: ", lot, error);
        failedData.push({ ...lot, error: error.message });
      }
    }
  } catch (error) {
    console.error("Errorr createDataLotSizing", error);
  } finally {
    knex.destroy;
  }
  return { successCount, failedData };
};

export const getDataLotForm = async (partno, wh_code, line_id) => {
  const knex = connectDBWarehouse();
  try {
    const result = await knex("LS_T_LOT_FORM")
      .select("kbn_scan", "kbn_std", "id", "kbn_lot")
      .where({
        partno: partno,
        status: 0,
        wh_code: wh_code,
        line_id: line_id,
      });
    return result;
  } catch (error) {
    console.error("Error get data lot form: ", error);
  } finally {
    knex.destroy;
  }
};

export const createDataLotSizingMisuzumashi = async (data) => {
  const knex = connectDBWarehouse();
  try {
    const result = data.map((data) => ({
      partno: data.partno,
      kbn_scan: data.kbn_scan,
      kbn_std: data.kbn_std,
      qty_scan: data.qty_scan,
      kbn_lot: data.kbn_lot,
      create_by: data.create_by,
      create_date: data.create_date,
      line_id: data.line_id,
      status: data.status,
      wh_code: data.wh_code,
    }));
    const submit = await knex("LS_T_LOT_FORM").insert(result);
    return submit;
  } catch (error) {
    console.error("Errorr createDataLotSizing", error);
  } finally {
    knex.destroy;
  }
};

export const getDataStorage = async (data) => {
  const knex = connectDBWarehouse();
  try {
    const result = await knex("WH_T_TEMPORARY")
      .select("storaging_id", "imgdata", "partno")
      .whereIn("imgdata", data);
    return result;
  } catch (error) {
    console.error("Errorr getDataStorage", error);
  } finally {
    knex.destroy;
  }
};

export const checkDataStockout = async (data) => {
  const knex = connectDBWarehouse();
  try {
    const result = await knex("LS_T_REPORT_MOBILE")
      .select("idbox_no")
      .where("idbox_no", data);
    const status = result.length > 0 ? true : false;
    return status;
  } catch (error) {
    console.error("Error checkDataStockout", error);
  } finally {
    knex.destroy;
  }
};

export const checkDataStockoutMisuzumashi = async (data) => {
  const knex = connectDBWarehouse();
  try {
    const result = await knex("LS_T_REPORT_MOBILE_1")
      .select("idbox_no")
      .where("idbox_no", data);
    const status = result.length > 0 ? true : false;
    return status;
  } catch (error) {
    console.error("Error checkDataStockout", error);
  } finally {
    knex.destroy;
  }
};

export const deleteDataStorage = async (data) => {
  const knex = connectDBWarehouse();
  try {
    const result = await knex("WH_T_TEMPORARY").whereIn("imgdata", data).del();
    return result;
  } catch (error) {
    console.error("Errorr deleteDataStorage", error);
  } finally {
    knex.destroy;
  }
};
