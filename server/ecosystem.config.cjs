module.exports = {
  apps: [
    {
      name: "sarvhit-server",
      script: "./server.js",
      instances: "max", // Run on all available CPU cores
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G", // Restart if memory exceeds 1GB
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
