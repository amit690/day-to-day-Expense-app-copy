document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting

    // Get form fields
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    let formValid = true;

    // Reset previous errors
    [nameField, emailField, passwordField].forEach(field => {
        field.classList.remove('input-error');
        document.getElementById(`${field.id}Warning`).style.display = 'none';
    });

    // Check each field for empty values
    if (nameField.value.trim() === '') {
        showWarning(nameField, 'Please fill in this field');
        formValid = false;
    }
    if (emailField.value.trim() === '') {
        showWarning(emailField, 'Please fill in this field');
        formValid = false;
    }
    if (passwordField.value.trim() === '') {
        showWarning(passwordField, 'Please fill in this field');
        formValid = false;
    }

    // If the form is valid, send a POST request with Axios
    if (formValid) {
        axios.post('/signup', {
            name: nameField.value,
            email: emailField.value,
            password: passwordField.value
        })
        .then(response => {
            console.log('Success:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

// Function to display warning message and add red border
function showWarning(field, message) {
    const warningElement = document.getElementById(`${field.id}Warning`);
    warningElement.textContent = message;
    warningElement.style.display = 'block';
    field.classList.add('input-error');
}
