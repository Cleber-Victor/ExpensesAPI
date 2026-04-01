import express from "express";

import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByUser,
} from "../controller/expenseController.js";

const router = express.Router();

router.post("/expenses", createExpense);
router.get("/expenses", getAllExpenses);
router.get("/expenses/user/:userId", getExpensesByUser);
router.get("/expenses/:id", getExpenseById);
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);

export default router;
