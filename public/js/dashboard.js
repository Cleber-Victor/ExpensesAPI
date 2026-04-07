document.addEventListener('DOMContentLoaded', () => {
  // Check auth
  const token = localStorage.getItem('expense_token');
  if (!token) {
    window.location.href = '/';
    return;
  }

  // Load User Data
  const userStr = localStorage.getItem('expense_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.name) {
        document.getElementById('user-greeting').innerText = `Olá, ${user.name.split(' ')[0]}`;
      } else {
        localStorage.removeItem('expense_user');
      }
    } catch (e) {
      localStorage.removeItem('expense_user');
    }
  }

  // DOM Elements
  const logoutBtn = document.getElementById('logout-btn');
  const addBtn = document.getElementById('add-expense-btn');
  const filterSelect = document.getElementById('filter-select');
  const modal = document.getElementById('expense-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const cancelModalBtn = document.getElementById('cancel-modal');
  const expenseForm = document.getElementById('expense-form');
  const tbody = document.getElementById('expenses-table-body');
  const emptyState = document.getElementById('empty-state');
  
  // State
  let expenses = [];

  const categoryMap = {
    'Groceries': 'Supermercado',
    'Leisure': 'Lazer',
    'Electronics': 'Eletrônicos',
    'Utilities': 'Contas Básicas',
    'Clothing': 'Roupas',
    'Health': 'Saúde',
    'Others': 'Outros'
  };

  // Functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + Math.abs(date.getTimezoneOffset()*60000)).toLocaleDateString('pt-BR');
  };

  const renderExpenses = () => {
    tbody.innerHTML = '';
    
    if (expenses.length === 0) {
      emptyState.classList.remove('hidden');
      document.querySelector('.table-container').classList.add('hidden');
      document.getElementById('total-spend').innerText = 'R$ 0,00';
      document.getElementById('expenses-count').innerText = '0';
      return;
    }

    emptyState.classList.add('hidden');
    document.querySelector('.table-container').classList.remove('hidden');

    let total = 0;
    expenses.forEach(exp => {
      total += parseFloat(exp.amount);
      const tr = document.createElement('tr');
      const catTranslated = categoryMap[exp.category] || exp.category;

      tr.innerHTML = `
        <td>${formatDate(exp.date)}</td>
        <td><strong style="color: var(--text-main)">${exp.description}</strong></td>
        <td><span class="badge">${catTranslated}</span></td>
        <td style="color: var(--danger); font-weight: 600;">-${formatCurrency(exp.amount)}</td>
        <td>
          <div class="actions">
            <button class="btn btn-danger delete-btn" data-id="${exp.id}" style="padding: 0.3rem 0.6rem; font-size: 1rem;">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('total-spend').innerText = formatCurrency(total);
    document.getElementById('expenses-count').innerText = expenses.length;

    // Attach delete listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', handleDelete);
    });
  };

  const loadExpenses = async () => {
    try {
      const filter = filterSelect.value;
      const url = filter ? `/api/expenses?filter=${filter}` : '/api/expenses';
      const res = await apiFetch(url);
      expenses = res.data || [];
      renderExpenses();
    } catch (err) {
      showToast('Falha ao carregar despesas', 'error');
    }
  };

  const handleDelete = async (e) => {
    let target = e.target;
    if (target.tagName !== 'BUTTON') target = target.closest('button');
    
    const id = target.getAttribute('data-id');
    if (!confirm('Tem certeza que deseja apagar esta despesa?')) return;

    try {
      await apiFetch(`/api/expenses/${id}`, { method: 'DELETE' });
      showToast('Despesa apagada', 'success');
      loadExpenses();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openModal = () => {
    expenseForm.reset();
    document.getElementById('exp-date').valueAsDate = new Date();
    modal.classList.add('active');
  };

  const closeModal = () => {
    modal.classList.remove('active');
  };

  // Event Listeners
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('expense_token');
    localStorage.removeItem('expense_user');
    window.location.href = '/';
  });

  addBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);
  
  filterSelect.addEventListener('change', loadExpenses);

  expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    setBtnLoading(btn, true);

    const payload = {
      description: document.getElementById('exp-desc').value,
      amount: parseFloat(document.getElementById('exp-amount').value),
      date: document.getElementById('exp-date').value,
      category: document.getElementById('exp-category').value
    };

    try {
      await apiFetch('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast('Despesa adicionada com sucesso', 'success');
      closeModal();
      loadExpenses();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBtnLoading(btn, false);
    }
  });

  // Initial Load
  loadExpenses();
});
