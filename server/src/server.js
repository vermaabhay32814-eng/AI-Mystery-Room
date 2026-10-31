'use strict';

require('dotenv').config();

// ── Validate required environment variables before anything else ──────────────
const REQUIRED_ENV_VARS = [
  'PORT',
  'MONGODB_URI',
  'GEMINI_API_KEY',
  'GEMINI_MODEL',
  'CLIENT_ORIGIN',
  'JWT_SECRET',
];

const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.error(
    `[Startup] Missing required environment variables: ${missing.join(', ')}\n` +
      'Copy .env.example to .env and fill in all values.'
  );
  process.exit(1);
}

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      `[Server] AI Mystery Room API running on http://localhost:${PORT} ` +
        `(${process.env.NODE_ENV || 'development'})`
    );
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully…`);
    server.close(() => {
      console.log('[Server] HTTP server closed');
      process.exit(0);
    });

    // Force exit after 10 s
    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled rejection:', reason);
  });
}

start().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
