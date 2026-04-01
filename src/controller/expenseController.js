import {
  createExpenseService,
  getAllExpensesService,
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

export const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await getAllExpensesService();
    handlerResponse(res, 200, "Despesas listadas com sucesso", expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpensesByUser = async (req, res, next) => {
  try {
    const expenses = await getExpensesByUserIdService(req.params.userId);
    handlerResponse(res, 200, "Despesas do usuário listadas com sucesso", expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await getExpenseByIdService(req.params.id);
    if (!expense) return handlerResponse(res, 404, "Despesa não encontrada");
    handlerResponse(res, 200, "Despesa encontrada", expense);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const expense = await createExpenseService(req.body);
    handlerResponse(res, 201, "Despesa criada com sucesso", expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await updateExpenseService(req.params.id, req.body);
    if (!expense) return handlerResponse(res, 404, "Despesa não encontrada");
    handlerResponse(res, 200, "Despesa atualizada com sucesso", expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await deleteExpenseService(req.params.id);
    if (!expense) return handlerResponse(res, 404, "Despesa não encontrada");
    handlerResponse(res, 200, "Despesa deletada com sucesso", expense);
  } catch (error) {
    next(error);
  }
};
