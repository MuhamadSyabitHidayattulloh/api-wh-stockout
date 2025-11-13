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

    await WarehouseService.stockOutWithoutInstruction(processedData);

    // Update FLAGDX
    await StockoutService.updateFlagDX(NPK, timeScan);

    // Log failed data jika ada
    const allFailedData = [...failedProcessedData, ...failedLotData];

    if (allFailedData.length > 0) {
      console.log(`❌ Total failed records: ${allFailedData.length}`);

      // Log ke error log
      await STOCKOUT_ERROR_LOG.bulkCreate(
        allFailedData.map((item) => ({
          NPK: NPK,
          ERROR_DATE: literal("GETDATE()"),
          ERROR_TYPE: item.error ? "PROCESS_ERROR" : "LOT_ERROR",
          ERROR_MESSAGE: item.error || "Processing failed",
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
    console.error(
      `❌ Job processing error in batch ${batchNumber}/${totalBatches}:`,
      error
    );

    try {
      // Log error ke database
      await STOCKOUT_ERROR_LOG.create({
        NPK: NPK,
        ERROR_DATE: literal("GETDATE()"),
        ERROR_TYPE: "BATCH_PROCESSING_ERROR",
        ERROR_MESSAGE: `Batch ${batchNumber}/${totalBatches} error: ${error.message}`,
        RAW_DATA: JSON.stringify(data),
        STATUS: "PENDING",
        CREATED_AT: literal("GETDATE()"),
      });

      // ✅ Hapus job dari Redis setelah berhasil log ke database
      // Data sudah aman di database, tidak perlu di Redis lagi
      await job.remove();
      console.log(
        `🗑️ Job ${job.id} removed from Redis after logging error to DB`
      );

      // ✅ Log berhasil, error sudah di-handle, JANGAN throw error
      // Job dianggap "handled" meskipun gagal proses
      return;
    } catch (logError) {
      console.error(
        "⚠️ Failed to log error to database, keeping job in Redis:",
        logError
      );
      // Jika logging gagal, throw error untuk trigger retry
      throw error;
    }
  }
});

// Handle events
stockoutQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

stockoutQueue.on("failed", async (job, error) => {
  console.error(`Job ${job.id} failed with error:`, error);

  // Jika sudah exhaust semua attempts (3x), hapus dari Redis
  if (job.attemptsMade >= job.opts.attempts) {
    console.log(
      `🗑️ Job ${job.id} exhausted all ${job.opts.attempts} attempts, removing from Redis`
    );
    try {
      await job.remove();
    } catch (removeError) {
      console.error(`Failed to remove job ${job.id}:`, removeError);
    }
  }
});

stockoutQueue.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% ready`);
});

export default stockoutQueue;
