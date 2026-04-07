// Constants
const API_BASE = ''; // Same origin

// UI Utilities
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'check-circle' : 'warning-circle';
  
  toast.innerHTML = `
    <i class="ph-fill ph-${icon}" style="font-size: 1.5rem; color: ${type === 'success' ? 'var(--secondary)' : 'var(--danger)'}"></i>
    <span style="font-size: 0.95rem; font-weight: 500">${message}</span>
  `;

  container.appendChild(toast);

  // Remove after 4s
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function setBtnLoading(btn, isLoading) {
  if (isLoading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

// API Wrapper
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('expense_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Unauthorized - clear token and redirect unless we're already on index
        if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
           localStorage.removeItem('expense_token');
           localStorage.removeItem('expense_user');
           window.location.href = '/';
        }
      }
      throw new Error((data && data.error) || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw error;
  }
}
