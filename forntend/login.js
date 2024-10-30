document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';

    // Send login request to backend
    axios.post('http://localhost:3000/user/login', { email, password })
        .then(response => {
            console.log('Login successful:', response.data);
            alert('login successfull');
            // Redirect to another page upon successful login
            // window.location.href = '/home';
        })
        .catch(error => {
            console.error('Login failed:', error);

            if (error.response && error.response.status === 401) {
                if (error.response.data.error === 'Invalid email') {
                    errorMessage.textContent = 'Incorrect email. Please try again.';
                } else if (error.response.data.error === 'Invalid password') {
                    errorMessage.textContent = 'Incorrect password. Please try again.';
                } else {
                    errorMessage.textContent = 'Login failed. Please check your credentials.';
                }
                errorMessage.style.display = 'block';
            }
        });
});

// Redirect to signup page
document.getElementById('signupButton').addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:5500/forntend/SignUp.html';
});
