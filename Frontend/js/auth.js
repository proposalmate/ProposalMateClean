// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const email = document.getElementById('login-email');
            const password = document.getElementById('login-password');
            
            // Validate email
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                return;
            }
            
            // Validate password
            if (!password.value) {
                showError(password, 'Password is required');
                return;
            }
            
            // If all validations pass, simulate login
           fetch("/api/v1/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: email.value,
    password: password.value
  })
})
.then(res => res.json())
.then(data => {
  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "/pages/dashboard.html";
  } else {
    showError(password, "Login failed.");
  }
})
.catch(err => {
  showError(password, "Something went wrong. Try again.");
});

        });
    }
    
    // Password reset functionality
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email field
            const email = document.getElementById('reset-email');
            
            // Validate email
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                return;
            }
            
            // Simulate password reset
            simulatePasswordReset(email.value);
        });
    }
});

// Simulate login process
function simulateLogin(email) {
    // Show loading state
    const submitButton = document.querySelector('#login-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    // Simulate API call with timeout
    setTimeout(function() {
        // Redirect to dashboard after successful login
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Simulate password reset process
function simulatePasswordReset(email) {
    // Show loading state
    const submitButton = document.querySelector('#reset-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call with timeout
    setTimeout(function() {
        // Show success message
        const resetForm = document.getElementById('reset-form');
        resetForm.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>Reset Link Sent</h3>
                <p>We've sent a password reset link to ${email}. Please check your email and follow the instructions.</p>
                <a href="login.html" class="btn btn-primary">Back to Login</a>
            </div>
        `;
    }, 1500);
}
