document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';

    axios.post('http://localhost:3000/user/login', { email, password })
        .then(response => {
            const token = response.data.token;
            localStorage.setItem('token', token); // Save token in localStorage

            alert('Login successful');
            window.location.href = 'http://127.0.0.1:5500/forntend/daily%20expenceapp%20feature/expense.html';
        })
        .catch(error => {
            console.error('Login failed:', error);
            errorMessage.textContent = error.response?.data?.error || 'Login failed. Please try again.';
            errorMessage.style.display = 'block';
        });
});

// Redirect to signup page
document.getElementById('signupButton').addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:5500/forntend/Singup/SignUp.html';
});
