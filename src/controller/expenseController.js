import {
  createExpenseService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
  getExpensesByUserIdService,
} from "../models/expenseModel.js";

const handlerResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

const VALID_CATEGORIES = ["Groceries", "Leisure", "Electronics", "Utilities", "Clothing", "Health", "Others"];

const validateExpenseInput = (res, { amount, category }) => {
  if (amount !== undefined && Number(amount) <= 0) {
    handlerResponse(res, 400, "O valor (amount) deve ser estritamente positivo.");
    return false;
  }
  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    handlerResponse(res, 400, `Categoria inválida. Os valores permitidos são: ${VALID_CATEGORIES.join(", ")}`);
    return false;
  }
  return true;
};

export const getAllExpenses = async (req, res, next) => {
  try {
    const { filter, start_date, end_date } = req.query;
    
    // Agora o 'getAllExpenses' extrai os filtros da URL e passa para a busca
    const expenses = await getExpensesByUserIdService(req.user_id, { filter, start_date, end_date });
    handlerResponse(res, 200, "Despesas listadas com sucesso", expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await getExpenseByIdService(req.params.id, req.user_id);
    if (!expense) return handlerResponse(res, 404, "Despesa não encontrada");
    handlerResponse(res, 200, "Despesa encontrada", expense);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    if (!validateExpenseInput(res, req.body)) return;

    // Injetamos forçosamente o user_id do cara que está logado
    const expenseData = { ...req.body, user_id: req.user_id };
    const expense = await createExpenseService(expenseData);
    handlerResponse(res, 201, "Despesa criada com sucesso", expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    if (!validateExpenseInput(res, req.body)) return;

    const expense = await updateExpenseService(req.params.id, req.user_id, req.body);
    if (!expense) return handlerResponse(res, 404, "Despesa não encontrada ou usuário sem permissão");
    handlerResponse(res, 200, "Despesa atualizada com sucesso", expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await deleteExpenseService(req.params.id, req.user_id);
    if (!expense) return handlerResponse(res, 404, "Despesa não encontrada ou usuário sem permissão");
    handlerResponse(res, 200, "Despesa deletada com sucesso", expense);
  } catch (error) {
    next(error);
  }
};
