import pool from "../config/database.js";

export const getAllExpensesService = async () => {
  const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
  return result.rows;
};

export const getExpensesByUserIdService = async (userId) => {
  const result = await pool.query("SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC", [userId]);
  return result.rows;
};

export const getExpenseByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM expenses WHERE id = $1", [id]);
  return result.rows[0];
};

export const createExpenseService = async (expense) => {
  const { user_id, description, amount, date } = expense;
  const result = await pool.query(
    "INSERT INTO expenses (user_id, description, amount, date) VALUES ($1, $2, $3, $4) RETURNING *",
    [user_id, description, amount, date]
  );
  return result.rows[0];
};

export const updateExpenseService = async (id, expense) => {
  const { description, amount, date } = expense;
  const result = await pool.query(
    "UPDATE expenses SET description = $1, amount = $2, date = $3 WHERE id = $4 RETURNING *",
    [description, amount, date, id]
  );
  return result.rows[0];
};

export const deleteExpenseService = async (id) => {
  const result = await pool.query("DELETE FROM expenses WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};
