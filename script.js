let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const balanceElement = document.getElementById('balance');
const transactionList = document.getElementById('transactionList');
const expenseChartElement = document.getElementById('expenseChart');
let expenseChart;

document.getElementById('addTransaction').addEventListener('click', addTransaction);

function addTransaction() {
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter valid inputs.');
        return;
    }

    const transaction = { id: Date.now(), description, amount, type };
    transactions.push(transaction);

    saveTransactions();
    updateUI();
    resetForm();
}

function updateUI() {
    let balance = 0;
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);
        li.innerHTML = `
            ${transaction.description} 
            <span>${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}</span>
            <button class="edit-btn" data-id="${transaction.id}">Edit</button>
            <button class="delete-btn" data-id="${transaction.id}">Delete</button>
        `;

        transactionList.appendChild(li);

        balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
    });

    balanceElement.textContent = balance.toFixed(2);
    updateChart();

    transactionList.querySelectorAll('.edit-btn').forEach(button => 
        button.addEventListener('click', editTransaction));
    transactionList.querySelectorAll('.delete-btn').forEach(button => 
        button.addEventListener('click', deleteTransaction));
}

function resetForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('type').value = 'income';
}

function updateChart() {
    const income = transactions.filter(t => t.type === 'income')
                               .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense')
                                .reduce((sum, t) => sum + t.amount, 0);

    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(expenseChartElement, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#4CAF50', '#FF5733']
            }]
        }
    });
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    updateUI();
}

function editTransaction(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    const transaction = transactions.find(t => t.id === id);

    if (!transaction) return;

    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;

    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateUI();
}

function deleteTransaction(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateUI();
}

// Initial load
loadTransactions();

