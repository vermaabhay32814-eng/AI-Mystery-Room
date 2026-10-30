// server/src/controllers/health.controller.js
import { isDbConnected } from '../config/db.js';

export const getHealth = (req, res) => {
  const dbStatus = isDbConnected();
  const uptime = process.uptime();

  const isHealthy = dbStatus;

  return res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? 'healthy' : 'degraded',
    uptime: Math.floor(uptime),
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus ? 'connected' : 'disconnected',
      server: 'running'
    }
  });
};
