import Queue from "bull";
import { redisConfig } from "../Config/redis.js";
import STOCKOUT_ERROR_LOG from "../Models/STOCKOUT_ERROR_LOG.js";
import { literal } from "sequelize";
import { WarehouseService } from "../services/warehouseService.js";
import { StockoutService } from "../services/stockoutService.js";

// Buat queue untuk processing
const stockoutQueue = new Queue("stockoutProcessing", redisConfig);

// Konfigurasi default options
stockoutQueue.defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: true,
  removeOnFail: false,
};

// Process jobs
stockoutQueue.process(async (job) => {
  const { data, NPK, timeScan, batchNumber, totalBatches, batchSize } =
    job.data;

  try {
    await job.progress(10);

    // Proses data menggunakan service
    const { processedData, failedProcessedData, lotFormData, failedLotData } =
      await StockoutService.processStockoutData(data, NPK, timeScan);

    await job.progress(50);

    // Proses lot sizing
    if (lotFormData.length > 0) {
      await StockoutService.lotFormDataProcess(lotFormData);
    }

    await StockoutService.fifoChecking(data, NPK);
    await StockoutService.stockoutTemporaryData(data);

    await job.progress(75);

    // // Proses stockout dengan batching menggunakan WarehouseService
    // const totalBatches = Math.ceil(processedData.length / 100);
    // let allFailedData = [];

    // for (let i = 0; i < processedData.length; i += 100) {
    //   const batchNumber = Math.floor(i / 100) + 1;
    //   await job.progress(75 + (batchNumber / totalBatches) * 20);

    //   try {
    //     // Use WarehouseService instead of direct warehouse.js import
    //     await WarehouseService.stockOutWithoutInstruction(
    //       processedData.slice(i, i + 100)
    //     );
    //     console.log(`✅ Batch ${batchNumber} success`);
    //   } catch (error) {
    //     console.error(`❌ Batch ${batchNumber} failed:`, error.message);
    //     allFailedData.push(
    //       ...processedData.slice(i, i + 100).map((item) => ({
    //         ...item,
    //         error: error.message,
    //         batchNumber: batchNumber,
    //       }))
    //     );
    //   }
    // }

    try {
      await WarehouseService.stockOutWithoutInstruction(processedData);
    } catch (error) {
      console.error(
        `❌ Batch ${batchNumber}/${totalBatches} gagal:`,
        error.message
      );
      throw error;
    }

    // Update FLAGDX
    await StockoutService.updateFlagDX(NPK, timeScan);

    // Log failed data jika ada
    if (failedProcessedData.length > 0 || failedLotData.length > 0) {
      await STOCKOUT_ERROR_LOG.bulkCreate(
        [...failedProcessedData, ...failedLotData].map((item) => ({
          NPK: NPK,
          ERROR_DATE: literal("GETDATE()"),
          ERROR_TYPE: item.error ? "PROCESS_ERROR" : "LOT_ERROR",
          ERROR_MESSAGE: item.error || "Lot sizing calculation failed",
          RAW_DATA: JSON.stringify(item),
          STATUS: "PENDING",
          CREATED_AT: literal("GETDATE()"),
        })),
        { returning: false }
      );
    }

    if (allFailedData.length > 0) {
      console.log(`❌ Total failed records: ${allFailedData.length}`);
      await STOCKOUT_ERROR_LOG.bulkCreate(
        allFailedData.map((item) => ({
          NPK: NPK,
          ERROR_DATE: literal("GETDATE()"),
          ERROR_TYPE: "BATCH_ERROR",
          ERROR_MESSAGE: item.error,
          RAW_DATA: JSON.stringify(item),
          STATUS: "PENDING",
          CREATED_AT: literal("GETDATE()"),
        })),
        { returning: false }
      );
    }

    await job.progress(100);

    return {
      success: true,
      batchNumber: batchNumber,
      totalBatches: totalBatches,
      batchSize: batchSize,
      failedProcessedData,
      failedLotData,
    };
  } catch (error) {
    console.error(`Job processing error in batch ${batchNumber}:`, error);

    await STOCKOUT_ERROR_LOG.create({
      NPK: NPK,
      ERROR_DATE: literal("GETDATE()"),
      ERROR_TYPE: "BATCH_PROCESSING_ERROR",
      ERROR_MESSAGE: `Batch ${batchNumber} error: ${error.message}`,
      RAW_DATA: JSON.stringify(data),
      STATUS: "PENDING",
      CREATED_AT: literal("GETDATE()"),
    });
    throw error;
  }
});

// Handle events
stockoutQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

stockoutQueue.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error);
});

stockoutQueue.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% ready`);
});

export default stockoutQueue;
