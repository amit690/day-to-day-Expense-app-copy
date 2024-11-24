// Helper function to check if user is a premium user
async function checkPremiumStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await axios.get('http://localhost:3000/user/status', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.isPremium) {
            document.getElementById('buy-premium-btn').style.display = 'none'; // Hide the button
            document.getElementById('premium-status').textContent = 'You are a premium user!';
        } else {
            document.getElementById('buy-premium-btn').style.display = 'block'; // Show the button
            document.getElementById('premium-status').textContent = ''; // Clear any premium message
        }
    } catch (error) {
        console.error('Error checking premium status:', error.response ? error.response.data : error.message);
    }
}

// Event listener for "Buy Premium" button
document.getElementById('buy-premium-btn').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/purchase/premium', {}, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const { orderId, key_id } = response.data; // Razorpay order ID and API key

        // Open Razorpay payment gateway
        const options = {
            key: response.data.key_id, // Razorpay key ID from the backend
            amount: response.data.amount, // Amount in paisa
            currency: 'INR',
            name: 'Expense App Premium',
            description: 'Upgrade to Premium',
            order_id: response.data.orderId, // Razorpay order ID
            handler: async function (paymentResponse) {
                try {
                    const verificationResponse = await axios.post(
                        'http://localhost:3000/purchase/verify',
                        {
                            payment_id: paymentResponse.razorpay_payment_id,
                            order_id: paymentResponse.razorpay_order_id,
                            signature: paymentResponse.razorpay_signature,
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    if (verificationResponse.data.success) {
                        alert('Premium Activated!');
                        checkPremiumStatus(); // Refresh premium status
                    } else {
                        alert('Payment verification failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Verification Error:', error.response ? error.response.data : error.message);
                    alert('Payment verification failed. Please try again.');
                }
            },
            theme: {
                color: '#4CAF50', // Optional custom theme color
            },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
    } catch (error) {
        console.error('Error initiating payment:', error.response ? error.response.data : error.message);
        alert('Failed to start payment. Please try again.');
    }
});

// Load expenses and check premium status when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    checkPremiumStatus();
});

// Add expense form logic remains unchanged
document.getElementById('add-expense-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    const expenseAmount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    try {
        const response = await axios.post('http://localhost:3000/expense/add-expense', {
            amount: expenseAmount,
            description: description,
            category: category
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 201) {
            document.getElementById('add-expense-form').reset();
            loadExpenses();
        } else {
            console.error('Failed to add expense:', response.data.message);
        }
    } catch (error) {
        console.error('Error adding expense:', error.response ? error.response.data : error.message);
    }
});

async function loadExpenses() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await axios.get('http://localhost:3000/expense/get-expenses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const expenses = response.data;
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = '';

        expenses.forEach(expense => {
            const listItem = document.createElement('li');
            listItem.textContent = `${expense.category}: ₹${expense.amount} - ${expense.description}`;
            expenseList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading expenses:', error.response ? error.response.data : error.message);
    }
}
