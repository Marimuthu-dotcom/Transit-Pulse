import mysql from 'mysql2';
import { DB } from './env.js';

const db = mysql.createConnection({
  host: DB.host,
  port: DB.port,
  user: DB.user,
  password: DB.password,
  database: DB.database,
});

db.connect((err) => {
  if (err) {
    console.warn('⚠️ MySQL not available at startup:', err.message);
    console.warn('The backend will continue running, but database-backed routes may fail until MySQL is reachable.');
    return;
  }
  console.log(`✅ MySQL connected: ${DB.database}@${DB.host}:${DB.port}`);
});

export function pingDatabase() 
{
  return new Promise((resolve, reject) => 
  {
    db.query('SELECT 1 AS ok', (err, rows) => 
    {
      if (err) 
        return reject(err);
      resolve(rows[0].ok === 1);
    });
  });
}

// Surface runtime errors (server crash, network drop, etc.)
db.on('error', (err) => 
{
  console.error('MySQL runtime error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') 
  {
    console.error('Connection lost — the app will retry on the next query.');
  }
});

export default db;