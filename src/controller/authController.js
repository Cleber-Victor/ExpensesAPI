import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmailService } from "../models/userModel.js";

const handlerResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handlerResponse(res, 400, "Email e senha são obrigatórios");
    }

    const user = await getUserByEmailService(email);
    if (!user) {
      return handlerResponse(res, 401, "Credenciais inválidas");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return handlerResponse(res, 401, "Credenciais inválidas");
    }

    const token = jwt.sign(
      { user_id: user.id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "10h" }
    );

    // Evitar enviar a senha no corpo da resposta
    const { password: userPassword, ...userData } = user;

    handlerResponse(res, 200, "Login realizado com sucesso", {
      token,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};
