document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to dashboard
  if (localStorage.getItem('expense_token')) {
    window.location.href = '/dashboard.html';
  }

  // View Switching
  const loginView = document.getElementById('login-view');
  const signupView = document.getElementById('signup-view');
  
  document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    loginView.classList.add('hidden');
    signupView.classList.remove('hidden');
  });

  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    signupView.classList.add('hidden');
    loginView.classList.remove('hidden');
  });

  // Login Handling
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    setBtnLoading(btn, true);

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('expense_token', res.data.token);
      localStorage.setItem('expense_user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard.html';

    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBtnLoading(btn, false);
    }
  });

  // Signup Handling
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    setBtnLoading(btn, true);

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
      await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      showToast('Conta criada com sucesso! Por favor, faça login.', 'success');
      
      // Switch to login
      document.getElementById('signup-form').reset();
      document.getElementById('show-login').click();

    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBtnLoading(btn, false);
    }
  });
});
