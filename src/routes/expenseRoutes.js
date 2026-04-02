import express from "express";

import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controller/expenseController.js";

const router = express.Router();

import { authMiddleware } from "../middlewares/authMiddleware.js";

// Aplicamos o middleware de autenticação a todas as rotas que começam com /expenses
router.use("/expenses", authMiddleware);

router.post("/expenses", createExpense);
router.get("/expenses", getAllExpenses);
router.get("/expenses/:id", getExpenseById);
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);

export default router;
