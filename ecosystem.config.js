module.exports = {
  apps: [
    {
      name: "api-wh-stockout",
      script: "./index.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
