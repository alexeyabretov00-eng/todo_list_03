import express, { Express } from 'express';
import { errorHandler } from './api/middleware/errorHandler';
import listsRouter from './api/routes/lists';
import elementsRouter from './api/routes/elements';
import subItemsRouter from './api/routes/subitems';

const app: Express = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/lists', listsRouter);
app.use('/api/elements', elementsRouter);
app.use('/api/subitems', subItemsRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
