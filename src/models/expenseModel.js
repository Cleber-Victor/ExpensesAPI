import pool from "../config/database.js";

export const getAllExpensesService = async () => {
  const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
  return result.rows;
};

export const getExpensesByUserIdService = async (userId, options = {}) => {
  const { filter, start_date, end_date } = options;
  let query = "SELECT * FROM expenses WHERE user_id = $1";
  const params = [userId];

  if (filter === 'past_week') {
    query += " AND date >= CURRENT_DATE - INTERVAL '7 days'";
  } else if (filter === 'past_month') {
    query += " AND date >= CURRENT_DATE - INTERVAL '1 month'";
  } else if (filter === 'last_3_months') {
    query += " AND date >= CURRENT_DATE - INTERVAL '3 months'";
  } else if (start_date && end_date) {
    params.push(start_date, end_date);
    query += ` AND date >= $${params.length - 1} AND date <= $${params.length}`;
  } else if (start_date) {
    params.push(start_date);
    query += ` AND date >= $${params.length}`;
  } else if (end_date) {
    params.push(end_date);
    query += ` AND date <= $${params.length}`;
  }

  query += " ORDER BY date DESC";

  const result = await pool.query(query, params);
  return result.rows;
};

export const getExpenseByIdService = async (id, userId) => {
  const result = await pool.query("SELECT * FROM expenses WHERE id = $1 AND user_id = $2", [id, userId]);
  return result.rows[0];
};

export const createExpenseService = async (expense) => {
  const { user_id, description, amount, date, category } = expense;
  const result = await pool.query(
    "INSERT INTO expenses (user_id, description, amount, date, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [user_id, description, amount, date, category]
  );
  return result.rows[0];
};

export const updateExpenseService = async (id, userId, expense) => {
  const { description, amount, date, category } = expense;
  const result = await pool.query(
    "UPDATE expenses SET description = $1, amount = $2, date = $3, category = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
    [description, amount, date, category, id, userId]
  );
  return result.rows[0];
};

export const deleteExpenseService = async (id, userId) => {
  const result = await pool.query("DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *", [id, userId]);
  return result.rows[0];
};
