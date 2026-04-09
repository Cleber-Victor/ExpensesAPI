import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../models/userModel.js";

const handlerResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

const stripPassword = (user) => {
  if (!user) return user;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    const safeUsers = users.map(stripPassword);
    handlerResponse(res, 200, "Usuários listados com sucesso", safeUsers);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return handlerResponse(res, 404, "User not found");
    handlerResponse(res, 200, "User found", stripPassword(user));
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);
    handlerResponse(res, 201, "User created successfully", stripPassword(user));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserService(req.params.id, req.body);
    if (!user) return handlerResponse(res, 404, "User not found");
    handlerResponse(res, 200, "User updated successfully", stripPassword(user));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await deleteUserService(req.params.id);
    if (!user) return handlerResponse(res, 404, "User not found");
    handlerResponse(res, 200, "User deleted successfully", stripPassword(user));
  } catch (error) {
    next(error);
  }
};
