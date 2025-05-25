// Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Show error message
function showError(input, message) {
  const parent = input.parentElement;
  const existingError = parent.querySelector('.error-message');
  if (existingError) parent.removeChild(existingError);

  input.classList.add('error');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  parent.appendChild(errorDiv);

  input.focus();
}

// Login & reset handling
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const resetForm = document.getElementById('reset-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('login-email');
      const password = document.getElementById('login-password');

      if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        return;
      }

      if (!password.value) {
        showError(password, 'Password is required');
        return;
      }

      try {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value, password: password.value }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Save token in localStorage
        localStorage.setItem('token', data.token);
        console.log("Token saved to localStorage:",data.token);
        alert('Login successful!');
        window.location.href = 'dashboard.html';
      } catch (err) {
        alert(err.message || 'An error occurred during login');
      }
    });
  }

  if (resetForm) {
    resetForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('reset-email');
      if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        return;
      }

      try {
        const res = await fetch('/api/v1/auth/forgotpassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to send reset link');
        }

        resetForm.innerHTML = `
          <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Reset Link Sent</h3>
            <p>We've sent a password reset link to ${email.value}. Please check your inbox.</p>
            <a href="login.html" class="btn btn-primary">Back to Login</a>
          </div>
        `;
      } catch (err) {
        alert(err.message || 'An error occurred during password reset');
      }
    });
  }
});
