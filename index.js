import express from "express";
import cors from "cors";
import pool from "./src/config/database.js";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());


app.listen(PORT,() =>{
  console.log(`Server running on http://localhost:${PORT}`);
})

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT current_database()");
  res.send(`The database name is: ${result.rows[0].current_database}`);
});