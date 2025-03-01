import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import stockoutQueue from "../queues/stockoutProcessor.js";

// Buat Express app khusus untuk monitoring
const app = express();

// Setup Bull Board
const serverAdapter = new ExpressAdapter();
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(stockoutQueue)],
  serverAdapter: serverAdapter,
});

// Basic auth middleware untuk security
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  const credentials = Buffer.from(
    (process.env.BULL_BOARD_USER || "admin") +
      ":" +
      (process.env.BULL_BOARD_PASS || "admin")
  ).toString("base64");

  if (!auth || auth.split(" ")[1] !== credentials) {
    res.setHeader("WWW-Authenticate", "Basic");
    res.status(401).send("Authentication required");
    return;
  }
  next();
};

// Gunakan basic auth
app.use("/admin/queues", basicAuth, serverAdapter.getRouter());

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.MONITOR_PORT || 3500;

app.listen(PORT, () => {
  console.log(`Bull Board is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT}/admin/queues`);
});
