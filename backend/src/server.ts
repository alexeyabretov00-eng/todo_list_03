import app from './app';
import { runMigrations } from './db/migrate';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

// Run migrations on startup
try {
  runMigrations();
} catch (error) {
  console.error('Failed to run migrations:', error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
