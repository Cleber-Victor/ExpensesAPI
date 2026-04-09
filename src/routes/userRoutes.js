import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import{
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/userController.js";

const router = express.Router();

// Criação de usuário é pública
router.post("/users", createUser);

// Demais rotas são protegidas
router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;