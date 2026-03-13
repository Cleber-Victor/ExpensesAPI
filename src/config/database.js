import dotenv from "dotenv";
import pkg from "pg";

const {Pool} = pkg;
const PORT = 3000;
dotenv.config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT || "5432"),
})

pool.on("connect", () => {
  console.log("Connection pool establised with Database");
});


export default pool;