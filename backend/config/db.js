// const { Pool } = require("pg");
// require("dotenv").config();

// let pool;

// if (process.env.DATABASE_URL) {
//   // 🟢 Neon (Cloud DB)
//   pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });
// } else {
//   // 🔵 Docker / Local DB
//   pool = new Pool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//   });
// }

// module.exports = pool;

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

module.exports = pool;