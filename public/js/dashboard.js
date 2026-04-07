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
        document.getElementById('user-greeting').innerText = `Hello, ${user.name.split(' ')[0]}`;
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

  // Functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Adjusting for timezone to just show the simple date
    return new Date(date.getTime() + Math.abs(date.getTimezoneOffset()*60000)).toLocaleDateString();
  };

  const renderExpenses = () => {
    tbody.innerHTML = '';
    
    if (expenses.length === 0) {
      emptyState.classList.remove('hidden');
      document.querySelector('.table-container').classList.add('hidden');
      document.getElementById('total-spend').innerText = '$0.00';
      document.getElementById('expenses-count').innerText = '0';
      return;
    }

    emptyState.classList.add('hidden');
    document.querySelector('.table-container').classList.remove('hidden');

    let total = 0;
    expenses.forEach(exp => {
      total += parseFloat(exp.amount);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(exp.date)}</td>
        <td><strong style="color: var(--text-main)">${exp.description}</strong></td>
        <td><span class="badge">${exp.category}</span></td>
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
      showToast('Failed to load expenses', 'error');
    }
  };

  const handleDelete = async (e) => {
    // Traverse up to find the button if icon is clicked
    let target = e.target;
    if (target.tagName !== 'BUTTON') target = target.closest('button');
    
    const id = target.getAttribute('data-id');
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await apiFetch(`/api/expenses/${id}`, { method: 'DELETE' });
      showToast('Expense deleted', 'success');
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
      showToast('Expense added successfully', 'success');
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
