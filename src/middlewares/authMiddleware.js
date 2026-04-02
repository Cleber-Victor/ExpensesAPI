import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: 401, message: "Token não fornecido" });
  }

  // O Header geralmente vem no formato: "Bearer eyJhbGci..."
  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ status: 401, message: "Erro de formato do token" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ status: 401, message: "Token mal formatado" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback_secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 401, message: "Token inválido" });
    }

    // Extrair o user_id do token e anexar à requisição (req) para uso nos próximos passos
    req.user_id = decoded.user_id;

    return next();
  });
};
