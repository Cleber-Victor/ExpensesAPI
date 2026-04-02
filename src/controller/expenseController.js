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
    // Agora o 'getAllExpenses' só traz as despesas daquele usuário!
    const expenses = await getExpensesByUserIdService(req.user_id);
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
