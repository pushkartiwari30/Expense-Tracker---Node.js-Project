const amount = document.getElementById('amount');
const desc = document.getElementById('desc');
const cat = document.getElementById('cat');

const table = document.getElementById('expenseTable');
const tbody = table.querySelector('tbody');
const newRow = document.createElement('tr');


// making a get request to the backend 
const token  = localStorage.getItem('token');
axios.get("http://localhost:3000/expense/getexpenses", {headers: {"Authorization": token}})
    .then((res) => {
        //console.log(res.data.allExpense);
        const expense = res.data.allExpense;
        expense.forEach(obj => {
            // Create new table row
            const newRow = document.createElement('tr');
    
            const expenseDetail = [obj.amount, obj.description, obj.category];
            expenseDetail.forEach(function (value) {
                const newCell = document.createElement('td');
                newCell.textContent = value;
                newRow.appendChild(newCell);
            });

            // Create delete button cell
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');

            newRow.id = obj.id;

            deleteButton.addEventListener('click', function () {
                // Remove the row from the table when delete button is clicked
                deleteFn(newRow);
                newRow.remove();
            });
            deleteCell.appendChild(deleteButton);
            newRow.appendChild(deleteCell);

            // Append the new row to the table body
            tbody.appendChild(newRow);
        });

    })
    .catch((err) => {
        console.log(err);
    })


addExpenseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const expObj = {
        amount: amount.value,
        desc: desc.value,
        cat: cat.value
    }
    console.log(expObj);
    axios.post("http://localhost:3000/expense/addexpense", expObj, {headers: {"Authorization": token}})
        .then((res) => {
            console.log(res.data.data.id);
            // Create new table row
            const newRow = document.createElement('tr');
            // Create table data cells
            const expenseDetail = [amount.value, desc.value, cat.value];
            expenseDetail.forEach(function (value) {
                const newCell = document.createElement('td');
                newCell.textContent = value;
                newRow.appendChild(newCell);
            });

            // Create delete button cell
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');

            newRow.id = res.data.data.id;

            deleteButton.addEventListener('click', function () {
                // Remove the row from the table when delete button is clicked
                deleteFn(newRow);
                newRow.remove();
            });
            deleteCell.appendChild(deleteButton);
            newRow.appendChild(deleteCell);



            // Append the new row to the table body
            tbody.appendChild(newRow);
            // Reset the form
            addExpenseForm.reset();

        })
        .catch((err) => {
            console.log(err);
        })
})

const deleteFn = function (newRow) {
    console.log(newRow.id);
    obj = {
        id: newRow.id
    }
    axios.post("http://localhost:3000/expense/deleteexpense", obj)
        .then(() => {
            console.log("deleted")
        })
        .catch((err) => {
            console.log(err);
        })
}