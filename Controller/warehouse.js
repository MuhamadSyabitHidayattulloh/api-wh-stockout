import { OneWayKanbanProcessed } from "../functions/OneWayKanbanProcessed.js";
import {
  createDataLotSizing,
  createDataLotSizingMisuzumashi,
  getCategoryPart,
  getDataMasterLotSizing,
  getDataSeparationByOneWayKanbanModels,
  getDataStoragingByOneWayKanbanModels,
  getLineIdPart,
  getLocationPart,
  getModelAndProductShoppingList,
  getShoppingList,
  stockoutMisuzumashiModels,
  stockOutWithoutInstruction,
} from "../Models/warehouse.js";

export const getDataStoragingByOneWayKanban = async (req, res) => {
  try {
    const dataStoraging = (
      await getDataStoragingByOneWayKanbanModels(req.params.id)
    ).recordset;

    // poolStorgaing.close();

    res.status(200).json({
      msg: "get data success",
      data: dataStoraging,
    });
  } catch (error) {
    // poolStorgaing.close();
    res.status(400).json({
      msg: "get data failed",
      errMsg: error,
    });
  }
};

export const getDataSeparationByOneWayKanban = async (req, res) => {
  try {
    const dataSeparation = (
      await getDataSeparationByOneWayKanbanModels(req.params.id)
    ).recordset;
    res.status(200).json({
      msg: "get data success",
      data: dataSeparation,
    });
  } catch (error) {
    res.status(400).json({
      msg: "get data failed",
      errMsg: error,
    });
  }
};

export const getTotalDataSeparation = async (req, res) => {
  try {
    const dataArray = req.body.data;
    // console.log(dataArray);

    let result = [];
    if (dataArray.length > 0) {
      for (let index = 0; index < dataArray.length; index++) {
        const dataSeparation = (
          await getDataSeparationByOneWayKanbanModels(dataArray[index])
        ).recordset;

        result.push(...dataSeparation);
      }
    }

    res.status(200).json({
      msg: "get data success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      msg: "get data failed",
      errMsg: error,
    });
  }
};

export const getTotalDataStoraging = async (req, res) => {
  try {
    const dataArray = req.body.data;

    let result = [];
    if (dataArray.length > 0) {
      for (let index = 0; index < dataArray.length; index++) {
        const dataStoraging = (
          await getDataStoragingByOneWayKanbanModels(dataArray[index])
        ).recordset;

        result.push(...dataStoraging);
      }
    }

    res.status(200).json({
      msg: "get data success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      msg: "get data failed",
      errMsg: error,
    });
  }
};

export const stockoutWithoutInstructionController = async (req, res) => {
  try {
    const data = req.body.data;

    const processedData = [];
    const lotFormData = [];
    const failedProcessedData = [];
    const failedLotData = [];

    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        try {
          const qrKanban = new OneWayKanbanProcessed(data[index].imgData);
          const pattern = "NO INST";
          const timeScan = data[index].timeScan || null;
          const partno = qrKanban.getPartNumber();
          const uniqueId = qrKanban.getUniqueCode();
          const qty = qrKanban.getQtyPerKanban();
          const partLoc = await getLocationPart(partno);
          const partLineId = await getLineIdPart(partno);
          const whCode = qrKanban.getWhCode();
          const imgData = data[index].imgData;
          const lotSizeData = await getDataMasterLotSizing(partno);
          const kbn_scan = 1;
          const kbn_std = lotSizeData.std_kbn_ro;
          const qty_scan = lotSizeData.qty_scan;
          const kbn_lot = lotSizeData.qty_after_ls;
          const line_id = lotSizeData.ls_table;
          const status = 1;

          processedData.push({
            pattern: pattern,
            idbox_no: imgData,
            timescan_idbox: timeScan,
            partno: partno,
            kbn_seq: uniqueId,
            qty_kbn_std: qty,
            qty_kbn_act: 1,
            wh_loc: partLoc,
            line_id: partLineId,
            operator: data[index].NPK,
            status: 1,
            complete: 1,
            create_by: data[index].NPK,
            create_date: timeScan,
            wh_code: whCode,
          });

          if (lotSizeData.lot_sizing > 0) {
            lotFormData.push({
              partno: partno,
              kbn_scan: kbn_scan,
              kbn_std: kbn_std,
              qty_scan: qty_scan,
              kbn_lot: kbn_lot,
              create_by: data[index.NPK],
              create_date: timeScan,
              line_id: line_id,
              wh_code: whCode,
              status: status,
            });
          }
        } catch (error) {
          console.error(
            `Error processing data with imgData : ${imgData}`,
            error
          );
          failedProcessedData.push({
            ...data[index],
            error: error.message,
          });
        }
      }
    }

    if (lotFormData.length > 0) {
      const lotResult = await createDataLotSizing(lotFormData);
      failedLotData.push(...lotResult.failedData);
    }

    await stockOutWithoutInstruction(processedData);

    res.status(200).json({
      msg: "Insert data success",
      failedLotData,
      failedProcessedData,
    });
  } catch (error) {
    console.log(error);
    if (error.message === "Data kosong") {
      res.status(400).json({
        msg: "Data tidak terdaftar",
        errMsg: error,
      });
    } else if (error.message === "Data tidak dapat di proses") {
      res.status(400).json({
        msg: "Data tidak dapat di proses",
        errMsg: error,
      });
    } else if (error.code === "PART_NOT_FOUND") {
      res.status(401).json({
        msg: "Part number tidak ditemukan. Periksa Master WH",
        errMsg: error,
      });
    } else if (error.code === "GET_LINE_ID_PART_ERROR") {
      res.status(401).json({
        msg: "Terjadi kesalahan pada server.",
        errMsg: error,
      });
    } else {
      res.status(500).json({
        msg: "Internal Server Error, Data tidak terdaftar",
        errMsg: error,
      });
    }
  }
};

// export const stockoutMisuzumashiController = async (req, res) => {
//   try {
//     const data = req.body.data;

//     const processedData = [];
//     const lotFormData = [];

//     if (data.length > 0) {
//       for (let index = 0; index < data.length; index++) {
//         const qrKanban = new OneWayKanbanProcessed(data[index].imgData);
//         const pattern = "NO INST";
//         const timeScan = data[index].timeScan || null;
//         const partno = qrKanban.getPartNumber();
//         const uniqueId = qrKanban.getUniqueCode();
//         const qty = qrKanban.getQtyPerKanban();
//         const partLoc = await getLocationPart(partno);
//         const partLineId = await getLineIdPart(partno);
//         const whCode = qrKanban.getWhCode();
//         const imgData = data[index].imgData;
//         const lotSizeData = await getDataMasterLotSizing(partno);
//         const kbn_scan = 1;
//         const kbn_std = lotSizeData.std_kbn_ro;
//         const qty_scan = lotSizeData.qty_scan;
//         const kbn_lot = lotSizeData.qty_after_ls;
//         const line_id = lotSizeData.ls_table;
//         const status = 1;

//         processedData.push({
//           pattern: pattern,
//           idbox_no: imgData,
//           timescan_idbox: timeScan,
//           partno: partno,
//           kbn_seq: uniqueId,
//           qty_kbn_std: qty,
//           qty_kbn_act: 1,
//           wh_loc: partLoc,
//           line_id: partLineId,
//           operator: data[index].NPK,
//           status: 1,
//           complete: 1,
//           create_by: data[index].NPK,
//           create_date: timeScan,
//           wh_code: whCode,
//         });

//         if (lotSizeData.lot_sizing > 0) {
//           lotFormData.push({
//             partno: partno,
//             kbn_scan: kbn_scan,
//             kbn_std: kbn_std,
//             qty_scan: qty_scan,
//             kbn_lot: kbn_lot,
//             create_by: data[index.NPK],
//             create_date: timeScan,
//             line_id: line_id,
//             wh_code: whCode,
//             status: status,
//           });
//         }
//       }
//     }

//     if (lotFormData.length > 0) {
//       await createDataLotSizingMisuzumashi(lotFormData);
//     }
//     await stockoutMisuzumashiModels(processedData);

//     res.status(200).json({
//       msg: "Insert data success",
//     });
//   } catch (error) {
//     console.log(error);
//     if (error.message === "Data kosong") {
//       res.status(400).json({
//         msg: "Data tidak terdaftar",
//         errMsg: error,
//       });
//     } else if (error.message === "Data tidak dapat di proses") {
//       res.status(400).json({
//         msg: "Data tidak dapat di proses",
//         errMsg: error,
//       });
//     } else if (error.code === "PART_NOT_FOUND") {
//       res.status(401).json({
//         msg: "Part number tidak ditemukan. Periksa Master WH",
//         errMsg: error,
//       });
//     } else if (error.code === "GET_LINE_ID_PART_ERROR") {
//       res.status(401).json({
//         msg: "Terjadi kesalahan pada server.",
//         errMsg: error,
//       });
//     } else {
//       res.status(500).json({
//         msg: "Internal Server Error, Data tidak terdaftar",
//         errMsg: error,
//       });
//     }
//   }
// };

export const getPartCategoryShopping = async (req, res) => {
  try {
    const data = req.body.partNumberAssy;
    const result = await getCategoryPart(data);

    res.status(200).json({
      msg: "Get data success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Get data failed",
      errMsg: error,
    });
  }
};

export const getDetailShoppingList = async (req, res) => {
  try {
    const partNumberAssy = req.body.partNumberAssy;
    const modelAndProduct = await getModelAndProductShoppingList(
      partNumberAssy
    );
    const model = modelAndProduct.model;
    const product = modelAndProduct.product;
    const resultShoppingList = await getShoppingList(partNumberAssy);

    res.status(200).json({
      msg: "Get data berhasil !!!",
      result: {
        partNumberAssy: partNumberAssy,
        model: model,
        product: product,
        shoppingList: resultShoppingList,
      },
    });
  } catch (error) {
    res.status(400).json({
      msg: "Get data gagal !!!",
      errMsg: error,
    });
  }
};

export const stockoutInstructionController = async (req, res) => {
  try {
    res.status(200).json({
      msg: "Insert data berhasil !!!",
    });
  } catch (error) {
    res.status(400).json({
      msg: "Insert data gagal !!!",
      errMsg: error,
    });
  }
};
