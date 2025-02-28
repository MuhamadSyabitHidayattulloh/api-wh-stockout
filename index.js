import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import warehouseRoutes from "./Routes/warehouse.js";
import compression from "compression";
import loginAppsRoutes from "./Routes/login.js";
import registrationRoutes from "./Routes/regis.js";

const app = express();
app.use(compression());
http.globalAgent.maxSockets = Infinity;

dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.use(express.static("./public"));
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/loginApps", loginAppsRoutes);
app.use("/api/registration", registrationRoutes);

server.listen(port, () => {
  console.log("Server Already Run On Port " + port);
});

export default server;
