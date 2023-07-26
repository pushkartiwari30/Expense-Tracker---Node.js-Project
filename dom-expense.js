const amount = document.getElementById('amount');
const desc = document.getElementById('desc');
const cat = document.getElementById('cat');

const table = document.getElementById('expenseTable');
const tbody = table.querySelector('tbody');
const newRow = document.createElement('tr');

const premiumButton = document.querySelector('.premium-button');
// const signupButton = document.querySelector('.signup-button');
// const loginButton = document.querySelector('.login-button');

// making a get request to the backend 
const token  = localStorage.getItem('token');
axios.get("http://localhost:3000/expense/getexpenses", {headers: {"Authorization": token}})
    .then((res) => {
        // chekcing if the loggedin user is a premiusm user or not. if he is then : 
               // remove the premium button. 
               if(res.data.isPremiumUser){
                premiumButton.remove();
               }
        
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

premiumButton.addEventListener('click', async function(e){
    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:3000/purchase/premiummembership", {headers: {"Authorization": token}});
    
    
    //following is the code executed after i get response form the buypremium mbership controller. 
    console.log(response);
    var options = {
        "key" : response.data.key_id, // we give the key id so tht razor pay could know that it is a payment request refering to my comany . 
        "order_id" : response.data.order.id, // this order id tells the razor pay about time amount and currency. this is already registered at razorpay. 
        // following handeler will handle the sucess payment . It is a callback fn and it is calledn after success of payment. This cb is eecuted by razorpay itself.
        "handler" : async function (response){
            await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
                order_id : options.order_id,
                payment_id: response.razorpay_payment_id,
                payStatus: true,
            }, { headers: {"Authorization" : token}})
            alert("Congratulations ! You Are Now a Premium User");
            premiumButton.remove(); // removing the premiusm button once the user is a premium user. 
        },
    };
    const rzp1 = new Razorpay(options);  
    rzp1.open(); //this opens the UI of razor pay over our page. 
    e.preventDefault();
    // below code is to handle payment failure case. again this will be executed by razorpay itself. 
    rzp1.on('payment.failed', async function(response){
        console.log(response.error.metadata);
        alert('Payment Failed Please try Again');
        // chaning the pyment stautus to "FAILED" in the order table
        await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
                order_id : response.error.metadata.order_id,
                payment_id: response.error.metadata.payment_id,
                payStatus: false,
            }, { headers: {"Authorization" : token}})
    });
})
