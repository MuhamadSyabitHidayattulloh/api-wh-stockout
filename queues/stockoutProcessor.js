import Queue from "bull";
import { redisConfig } from "../Config/redis.js";
import {
  createDataLotSizing,
  stockOutWithoutInstruction,
} from "../Models/warehouse.js";
import { StockoutService } from "../services/stockoutService.js";
import STOCKOUT_ERROR_LOG from "../Models/STOCKOUT_ERROR_LOG.js";
import moment from "moment";

// Buat queue untuk processing
const stockoutQueue = new Queue("stockoutProcessing", redisConfig);

// Konfigurasi default options
stockoutQueue.defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: true, // Hapus job yang sukses
  removeOnFail: false, // Simpan job yang gagal untuk analisis
};

// Process jobs
stockoutQueue.process(async (job) => {
  const { data, NPK, timeScan } = job.data;

  try {
    // Update progress
    await job.progress(10);

    // Proses data menggunakan service
    const { processedData, failedProcessedData, lotFormData, failedLotData } =
      await StockoutService.processStockoutData(data, NPK, timeScan);

    // console.log("process data", processedData)
    // console.log("failed data", failedProcessedData)
    // console.log("lot form data", lotFormData)
    // console.log("failed lot data", failedLotData)

    // Update progress
    await job.progress(50);

    // Proses lot sizing
    if (lotFormData.length > 0) {
      await createDataLotSizing(lotFormData);
    }

    // Update progress
    await job.progress(75);

    // Proses stockout
    await stockOutWithoutInstruction(processedData);

    // Update FLAGDX
    await StockoutService.updateFlagDX(NPK, timeScan);

    // Log failed data jika ada
    if (failedProcessedData.length > 0 || failedLotData.length > 0) {

      // const currentTime = moment().format("YYYY-MM-DD HH:mm:ss")
      const currentTime = new Date()

      await STOCKOUT_ERROR_LOG.bulkCreate(
        [...failedProcessedData, ...failedLotData].map((item) => ({
          NPK: NPK,
          ERROR_DATE: currentTime,
          ERROR_TYPE: item.error ? "PROCESS_ERROR" : "LOT_ERROR",
          ERROR_MESSAGE: item.error || "Lot sizing calculation failed",
          RAW_DATA: JSON.stringify(item),
          STATUS: "PENDING", // PENDING, RESOLVED, IGNORED
          CREATED_AT: currentTime
        })), {
          returning: false
        }
      );
    }
    console.log(failedProcessedData)

    // Update progress
    await job.progress(100);

    return {
      success: true,
      failedProcessedData,
      failedLotData,
    };
  } catch (error) {
    console.error("Job processing error:", error);
    
    // const currentTime = moment().format("YYYY-MM-DD HH:mm:ss")
    const currentTime = new Date()

    // Log system error
    await STOCKOUT_ERROR_LOG.create({
      NPK: NPK,
      ERROR_DATE: currentTime,
      ERROR_TYPE: "SYSTEM_ERROR",
      ERROR_MESSAGE: error.message,
      RAW_DATA: JSON.stringify(data),
      STATUS: "PENDING",
      CREATED_AT: currentTime
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
