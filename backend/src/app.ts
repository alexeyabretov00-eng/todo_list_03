import express, { Express } from 'express';
import cors from 'cors';
import { errorHandler } from './api/middleware/errorHandler';

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (to be added in future tasks)
// app.use('/api/lists', listsRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
