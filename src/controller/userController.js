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

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    handlerResponse(res, 200, "Usuários listados com sucesso", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return handlerResponse(res, 404, "User not found");
    handlerResponse(res, 200, "post fetched", user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);
    handlerResponse(res, 201, "User created successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserService(req.params.id, req.body);
    if (!user) return handlerResponse(res, 404, "User not found");
    handlerResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await deleteUserService(req.params.id);
    if (!user) return handlerResponse(res, 404, "User not found");
    handlerResponse(res, 200, "User deleted successfully", user);
  } catch (error) {
    next(error);
  }
};
