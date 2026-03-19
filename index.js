import express from "express";
import cors from "cors";
import pool from "./src/config/database.js";
import errorHandling from "./src/middlewares/errorHandling.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT current_database()");
  res.send(`The database name is: ${result.rows[0].current_database}`);
});

// Middleware de erros DEVE vir depois de todas as rotas
app.use(errorHandling);

app.listen(PORT,() =>{
  console.log(`Server running on http://localhost:${PORT}`);
});