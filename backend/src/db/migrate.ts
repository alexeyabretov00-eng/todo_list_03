import { initDatabase, getDatabase } from './database';
import fs from 'fs';
import path from 'path';

export async function runMigrations(): Promise<void> {
  console.log('Running database migrations...');

  await initDatabase();
  const db = getDatabase();

  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql')).sort();

  for (const file of migrationFiles) {
    const migrationPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log(`Applying migration: ${file}`);
    db.exec(sql);
  }

  console.log('Migrations completed successfully');
}

if (require.main === module) {
  runMigrations().then(() => process.exit(0)).catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
