import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import teeRouter from './routes/tee.routes';
import tranchesRouter from './routes/tranches.routes';
import hsmRouter from './routes/hsm.routes';
import healthRouter from './routes/health.routes';
import elizaRouter from './routes/eliza.routes';
import alertRouter from './routes/alert.routes';
import telegramRouter from './routes/telegram.routes';
import chatRouter from './routes/chat.routes';
import loanRouter from './routes/loan.routes';
import { initRealtimeSocket } from './sockets/realtime.socket';
import { logger } from './utils/logger';


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  path: '/socket.io/'
});


// === LOVABLE CORS (matches credtrust frontend) ===
const lovableCors = cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:4173',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080',
    /https:\/\/.*\.lovable\.app/,
    /https:\/\/.*\.lovable\.dev/,
    'https://lucylow.github.io'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
app.use(lovableCors);
app.options('*', cors()); // Preflight


// Security + Logging
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));


// Rate limiting (matches frontend retry logic)
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));


// === ROUTES ===
app.use('/api/tee', teeRouter);
app.use('/api/tranches', tranchesRouter);
app.use('/api/hsm', hsmRouter);
app.use('/api/health', healthRouter);
app.use('/api/eliza', elizaRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/telegram', telegramRouter);
app.use('/api/chat', chatRouter);
app.use('/api/loan', loanRouter);


// Health endpoint (root level for load balancers)
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  env: process.env.NODE_ENV || 'dev',
  timestamp: new Date().toISOString(),
  services: {
    eliza: 'active',
    tee: 'ready',
    pricing: 'active',
    telegram: process.env.TELEGRAM_BOT_TOKEN ? 'connected' : 'mock_mode',
    discord: process.env.DISCORD_TOKEN ? 'connected' : 'mock_mode'
  }
}));


// Socket.io realtime (consolidated handler)
initRealtimeSocket(io);


// 404 + Error handler
app.use('*', (req, res) => res.status(404).json({ error: 'Not found', path: req.originalUrl }));

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({ 
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


const PORT = Number(process.env.PORT) || 4000;
httpServer.listen(PORT, () => {
  logger.info(`🚀 CredTrust Backend: http://localhost:${PORT}`);
  logger.info(`📡 WebSocket: ws://localhost:${PORT}/socket.io/`);
  logger.info(`📋 Health: http://localhost:${PORT}/health`);
});
