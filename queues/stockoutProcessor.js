import Queue from "bull";
import { redisConfig } from "./config/redis.js";
import {
  createDataLotSizing,
  stockOutWithoutInstruction,
} from "../Models/warehouse.js";
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

    // Update progress
    await job.progress(100);

    return {
      success: true,
      failedProcessedData,
      failedLotData,
    };
  } catch (error) {
    console.error("Job processing error:", error);
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
