import dotenv from "dotenv";
dotenv.config();

export const redisConfig = {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || "localhost",
    password: process.env.REDIS_PASSWORD,
  },
};
