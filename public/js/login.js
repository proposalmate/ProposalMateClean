// Login functionality
document.addEventListener('DOMContentLoaded', function() {
  setupLoginForm();
});

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate required fields
    if (!email || !password) {
      showError(email ? document.getElementById('password') : document.getElementById('email'), 
                'Please enter both email and password');
      return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;

    // Use the API utility to login
    window.ProposalMateAPI.auth.login(email, password)
      .then(data => {
        console.log('Login successful');
        
        // Save token in localStorage
        localStorage.setItem('token', data.token);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      })
      .catch(error => {
        console.error('Login error:', error);
        showError(document.getElementById('email'), 'Invalid email or password');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
  });
}

function showError(input, message) {
  const parent = input.parentElement;
  const existingError = parent.querySelector('.error-message');
  if (existingError) {
    parent.removeChild(existingError);
  }

  input.classList.add('error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  parent.appendChild(errorDiv);
  input.focus();
}
