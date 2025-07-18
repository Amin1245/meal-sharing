import knex from 'knex';

console.log('DATABASE_URL from environment:', process.env.DATABASE_URL);

const db = knex({
 
  client: process.env.DATABASE_URL ? 'pg' : 'mysql2', 
  connection: process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } 
  } : {
   
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'meal_sharing',
    port: process.env.DB_PORT || 3306, 
  },
});

export default db;
