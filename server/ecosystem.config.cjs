/**
 * PM2 Ecosystem Configuration
 *
 * This file configures PM2 for running the FLOWER server in cluster mode.
 * Cluster mode allows the server to utilize all CPU cores for better performance.
 *
 * Usage:
 *   npm run pm2:start    - Start the server
 *   npm run pm2:stop     - Stop the server
 *   npm run pm2:restart  - Restart the server
 *   npm run pm2:logs     - View logs
 *   npm run pm2:monit    - Monitor in terminal
 */
module.exports = {
  apps: [
    {
      name: "flower-server",
      script: "./dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      // Graceful shutdown
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      merge_logs: true,
      // Auto-restart on crash
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
  ],
};
