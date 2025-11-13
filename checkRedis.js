import stockoutQueue from "./queues/stockoutProcessor.js";

async function checkRedisJobs() {
  try {
    console.log("🔍 Checking Redis Queue Status...\n");

    // Get job counts
    const waiting = await stockoutQueue.getWaitingCount();
    const active = await stockoutQueue.getActiveCount();
    const completed = await stockoutQueue.getCompletedCount();
    const failed = await stockoutQueue.getFailedCount();
    const delayed = await stockoutQueue.getDelayedCount();

    console.log("📊 Queue Statistics:");
    console.log(`   ⏳ Waiting:   ${waiting}`);
    console.log(`   🔄 Active:    ${active}`);
    console.log(`   ✅ Completed: ${completed}`);
    console.log(`   ❌ Failed:    ${failed}`);
    console.log(`   ⏰ Delayed:   ${delayed}`);
    console.log(
      `   📦 Total:     ${waiting + active + completed + failed + delayed}\n`
    );

    // Get failed jobs detail
    if (failed > 0) {
      console.log("❌ Failed Jobs Details:");
      const failedJobs = await stockoutQueue.getFailed(0, 10); // Get first 10

      failedJobs.forEach((job, index) => {
        console.log(`\n   [${index + 1}] Job ID: ${job.id}`);
        console.log(`       NPK: ${job.data.NPK}`);
        console.log(
          `       Batch: ${job.data.batchNumber}/${job.data.totalBatches}`
        );
        console.log(
          `       Attempts: ${job.attemptsMade}/${job.opts.attempts}`
        );
        console.log(
          `       Failed At: ${new Date(job.finishedOn).toLocaleString(
            "id-ID"
          )}`
        );
        console.log(`       Error: ${job.failedReason}`);
      });
    }

    // Get waiting jobs
    if (waiting > 0) {
      console.log("\n⏳ Waiting Jobs:");
      const waitingJobs = await stockoutQueue.getWaiting(0, 5); // Get first 5

      waitingJobs.forEach((job, index) => {
        console.log(`\n   [${index + 1}] Job ID: ${job.id}`);
        console.log(`       NPK: ${job.data.NPK}`);
        console.log(
          `       Batch: ${job.data.batchNumber}/${job.data.totalBatches}`
        );
        console.log(`       Records: ${job.data.batchSize}`);
      });
    }

    // Get active jobs
    if (active > 0) {
      console.log("\n🔄 Active Jobs:");
      const activeJobs = await stockoutQueue.getActive(0, 5);

      activeJobs.forEach((job, index) => {
        console.log(`\n   [${index + 1}] Job ID: ${job.id}`);
        console.log(`       NPK: ${job.data.NPK}`);
        console.log(
          `       Batch: ${job.data.batchNumber}/${job.data.totalBatches}`
        );
        console.log(`       Progress: ${job._progress}%`);
      });
    }

    console.log("\n✅ Check completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking Redis:", error);
    process.exit(1);
  }
}

checkRedisJobs();
