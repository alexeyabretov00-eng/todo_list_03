import db from './database';
import fs from 'fs';
import path from 'path';

export function runMigrations(): void {
  console.log('Running database migrations...');

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
  runMigrations();
  process.exit(0);
}
