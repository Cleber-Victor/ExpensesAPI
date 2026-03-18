import pool from "../config/database";

export const getAllUsersModel = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

export const getUserByIdModel = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const createUserModel = async (user) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [user.name, user.email, user.password]
  );
  return result.rows[0];
};

export const updateUserModel = async (id, user) => {
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
    [user.name, user.email, user.password, id]
  );
  return result.rows[0];
};

export const deleteUserModel = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};
