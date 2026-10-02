import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folderArg = process.argv[2] || 'database';
const folderPath = path.resolve(__dirname, '..', folderArg);

if (!fs.existsSync(folderPath)) {
  console.error('Folder not found:', folderPath);
  process.exit(1);
}

// Grab all .sql files, sorted so numbered prefixes run in order
const files = fs.readdirSync(folderPath)
  .filter(f => f.endsWith('.sql'))
  .sort();

if (files.length === 0) {
  console.log('No .sql files found in', folderPath);
  process.exit(0);
}

console.log(`Running ${files.length} SQL files from ${folderArg}/\n`);

(async () => {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(folderPath, file), 'utf8');

    // Split into individual statements
    const statements = sql
      .split(/;\s*[\r\n]+/)
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (const stmt of statements) {
      try {
        await db.promise().query(stmt);
      }
      catch (err) {
        console.error(`❌ ${file}: ${err.message}`);
        console.error('   Failed statement:', stmt.slice(0, 80).replace(/\s+/g, ' '));
        process.exit(1);
      }
    }
    console.log(`✅ ${file}`);
  }

  console.log('\nAll tables created.');
  await db.promise().end();
  process.exit(0);
})();