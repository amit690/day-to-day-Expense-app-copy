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
            listItem.textContent = `${expense.category}: $${expense.amount} - ${expense.description}`;
            expenseList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading expenses:', error.response ? error.response.data : error.message);
    }
}

document.addEventListener('DOMContentLoaded', loadExpenses);
