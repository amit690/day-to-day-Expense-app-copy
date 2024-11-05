// Event listener for the form submission
document.getElementById('add-expense-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const expenseAmount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    try {
        // Send the expense data to the backend
        const response = await axios.post('http://localhost:3000/expense/add-expense', {
            amount: expenseAmount,
            description: description,
            category: category
        });

        if (response.status === 201) {
            // Successfully added, so clear form and reload expenses
            document.getElementById('add-expense-form').reset();
            loadExpenses(); // Reload the list of expenses
        } else {
            console.error('Failed to add expense:', response.data.message);
        }
    } catch (error) {
        console.error('Error adding expense:', error.response ? error.response.data : error.message);
    }
});

// Function to load expenses from the backend and display them
async function loadExpenses() {
    try {
        const response = await axios.get('http://localhost:3000/expense/get-expenses');
        const expenses = response.data;

        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = ''; // Clear the list

        // Display each expense item
        expenses.forEach(expense => {
            const listItem = document.createElement('li');
            listItem.textContent = `${expense.category}: $${expense.amount} - ${expense.description}`;
            expenseList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading expenses:', error.response ? error.response.data : error.message);
    }
}

// Load expenses on page load
document.addEventListener('DOMContentLoaded', loadExpenses);
