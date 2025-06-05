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

// Show toast notification
function showToast(message, type = 'error') {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    document.body.removeChild(existingToast);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add to body
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Hide toast after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 5000);
}

// Registration handling
document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signup-form');
  console.log('Registration script loaded');

  if (signupForm) {
    console.log('Signup form found, attaching event listener');
    
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      console.log('Signup form submitted');

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirm-password');
      const terms = document.getElementById('terms');

      // Reset previous errors
      document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      document.querySelectorAll('.error-message').forEach(el => el.remove());

      // Validate name
      if (!name.value.trim()) {
        showError(name, 'Name is required');
        return;
      }

      // Validate email
      if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        return;
      }

      // Validate password
      if (password.value.length < 8) {
        showError(password, 'Password must be at least 8 characters long');
        return;
      }

      // Validate password confirmation
      if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match');
        return;
      }

      // Validate terms
      if (!terms.checked) {
        showError(terms, 'You must agree to the Terms of Service and Privacy Policy');
        return;
      }

      // Show loading state
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

      try {
        console.log('Sending registration request to API');
        
        // Get the base URL dynamically
        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
          ? '' // Empty for local development
          : ''; // Empty for production too since we're using relative URLs
        
        const apiUrl = `${baseUrl}/api/v1/auth/register`;
        console.log('API URL:', apiUrl);
        
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value
          }),
          // Add credentials to ensure cookies are sent
          credentials: 'same-origin'
        });

        console.log('API response status:', res.status);
        const data = await res.json();
        console.log('API response data:', data);

        if (!res.ok) {
          throw new Error(data.error || data.message || 'Registration failed');
        }

        if (!data.success || !data.token) {
          throw new Error('Registration response missing token or success status');
        }

        // Save token in localStorage
        localStorage.setItem('token', data.token);
        
        // Save user data
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('User data saved to localStorage:', data.user);
        } else {
          console.warn('User data missing from response');
        }
        
        // Show success message and redirect
        signupForm.innerHTML = `
          <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Registration Successful!</h3>
            <p>Your account has been created. You will be redirected to the dashboard in a moment.</p>
          </div>
        `;
        
        showToast('Registration successful! Redirecting...', 'success');
        
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 2000);
        
      } catch (err) {
        console.error('Registration error:', err);
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Show error message with more details
        const errorMessage = err.message || 'An error occurred during registration';
        showToast(errorMessage);
        
        // Add error details to console for debugging
        console.error('Error details:', {
          message: err.message,
          stack: err.stack
        });
      }
    });
  } else {
    console.warn('Signup form not found in the document');
  }
});
