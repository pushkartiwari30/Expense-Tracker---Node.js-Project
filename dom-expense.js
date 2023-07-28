const amount = document.getElementById('amount');
const desc = document.getElementById('desc');
const cat = document.getElementById('cat');

const table = document.getElementById('expenseTable');
const tbody = table.querySelector('tbody');
const newRow = document.createElement('tr');

const amount1 = document.getElementById('amount1');
const desc1 = document.getElementById('desc1');
const cat1 = document.getElementById('cat1');

const table1 = document.getElementById('incomeTable');
const tbody1 = table1.querySelector('tbody');
const newRow1 = document.createElement('tr');

const totalExpense = document.querySelector('.total-expense');
const totalIncome = document.querySelector('.total-income');
const balance = document.querySelector('.balance');


const premiumButton = document.querySelector('.premium-button');
const leaderboardContainer = document.querySelector('.leaderboard-container');
const tableBody = document.querySelector('.leaderboard-table tbody');

// const signupButton = document.querySelector('.signup-button');
// const logoutButton = document.querySelector('.logout-button');

// making a get request to the backend 
const token = localStorage.getItem('token');
let incomeSumTotal = 0;
let expenseSumtotal = 0;

document.addEventListener('DOMContentLoaded', ()=>{
    axios.get("http://localhost:3000/expense/getexpenses", { headers: { "Authorization": token } })
    .then((res) => {
        // chekcing if the loggedin user is a premiusm user or not. if he is then : 
        // remove the premium button. 
        if (res.data.isPremiumUser) {
            premiumButton.remove(); //removing premium butoon
            //Adding 'You are a premium user'. 
            const parentDiv = document.querySelector('.left-side');
            const premiumDiv = document.createElement('div');
            premiumDiv.textContent = "You are a Premium User";
            premiumDiv.id = "premium-user"
            parentDiv.appendChild(premiumDiv);

            // Adding Leaderboard button 
            const leaderboardButton = document.createElement('button');
            leaderboardButton.textContent = "Click Here to See Saving's Leaderboard";
            leaderboardButton.id = "leaderboardbutton";
            parentDiv.appendChild(leaderboardButton);

            leaderboardButton.addEventListener('click', ()=>{
                if(leaderboardButton.textContent === "Click Here to See Saving's Leaderboard"){
                    
                    console.log("clcked 1");
                    leaderboardButton.textContent = "Click Here to Hide Saving's Leaderboard";
                    showLeaderboard();
                }
                else if(leaderboardButton.textContent === "Click Here to Hide Saving's Leaderboard"){
                    console.log("clcked 2");
                    leaderboardButton.textContent = "Click Here to See Saving's Leaderboard";
                    hideLeaderboard();
                }
            })
        }

        //console.log(res.data.allExpense);
        const expense = res.data.allExpense;
        expense.forEach(obj => {
            // Create new table row
            const newRow = document.createElement('tr');

            expenseSumtotal=expenseSumtotal+obj.amount;
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
        //console.log(expenseSumtotal);
        totalExpense.innerHTML = expenseSumtotal;

    })
    .catch((err) => {
        console.log(err);
    })
    hideLeaderboard()// hidning the leader booard after refresh
    //   <---------------------------------Get Req for Incomes ---------------------------------> 
    axios.get("http://localhost:3000/income/getincomes", { headers: { "Authorization": token } })
    .then((res) => {
        //console.log(res.data.allIncome);
        const income = res.data.allIncome;
        income.forEach(obj => {
            // Create new table row
            const newRow1 = document.createElement('tr');
            incomeSumTotal=incomeSumTotal+obj.amount; // to dsply the sum of income on UI
            const incomeDetail = [obj.amount, obj.description, obj.category];
            incomeDetail.forEach(function (value) {
                const newCell1 = document.createElement('td');
                newCell1.textContent = value;
                newRow1.appendChild(newCell1);
            });

            // Create delete button cell
            const deleteCell1 = document.createElement('td');
            const deleteButton1 = document.createElement('button');
            deleteButton1.textContent = 'Delete';
            deleteButton1.classList.add('delete-button1');

            newRow1.id = obj.id;

            deleteButton1.addEventListener('click', function () {
                // Remove the row from the table when delete button is clicked
                deleteFn1(newRow1);
                newRow1.remove();
            });
            deleteCell1.appendChild(deleteButton1);
            newRow1.appendChild(deleteCell1);

            // Append the new row to the table body
            tbody1.appendChild(newRow1); 
        });
        console.log(incomeSumTotal);
        totalIncome.innerHTML = incomeSumTotal;
        balance.innerHTML = incomeSumTotal-expenseSumtotal;

    })
    .catch((err) => {
        console.log(err);
    })
})

addExpenseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const expObj = {
        amount: amount.value,
        desc: desc.value,
        cat: cat.value
    }
    console.log(expObj);
    axios.post("http://localhost:3000/expense/addexpense", expObj, { headers: { "Authorization": token } })
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
        //changing the total exp and balance total value in UI
        numExpenseTotal =parseFloat(totalExpense.innerHTML)+parseFloat(amount.value);
        numIncomeTotal= parseFloat(totalIncome.innerHTML)
        numBalance = numIncomeTotal-numExpenseTotal;
         
        totalExpense.innerHTML = numExpenseTotal.toString()
        balance.innerHTML= numBalance.toString();
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


addIncomeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const expObj = {
        amount: amount1.value,
        desc: desc1.value,
        cat: cat1.value
    }
    console.log(expObj);
    axios.post("http://localhost:3000/income/addincome", expObj, { headers: { "Authorization": token } })
        .then((res) => {
            console.log(res.data.data.id);
            // Create new table row
            const newRow1 = document.createElement('tr');
            // Create table data cells
            const incomeDetail = [amount1.value, desc1.value, cat1.value];
            incomeDetail.forEach(function (value) {
                const newCell1 = document.createElement('td');
                newCell1.textContent = value;
                newRow1.appendChild(newCell1);
            });

            // Create delete button cell
            const deleteCell1 = document.createElement('td');
            const deleteButton1 = document.createElement('button');
            deleteButton1.textContent = 'Delete';
            deleteButton1.classList.add('delete-button1');

            newRow1.id = res.data.data.id;

            deleteButton1.addEventListener('click', function () {
                // Remove the row from the table when delete button is clicked
                deleteFn1(newRow1);
                newRow1.remove();
            });
            deleteCell1.appendChild(deleteButton1);
            newRow1.appendChild(deleteCell1);



            // Append the new row to the table body
            tbody1.appendChild(newRow1);
            // Reset the form
            addIncomeForm.reset();

        })
        .catch((err) => {
            console.log(err);
        });
        //changing the total income and balance total value in UI
        numExpenseTotal =parseFloat(totalExpense.innerHTML);
        numIncomeTotal= parseFloat(totalIncome.innerHTML)+parseFloat(amount1.value)
        numBalance = numIncomeTotal-numExpenseTotal;
         
        totalIncome.innerHTML = numIncomeTotal.toString()
        balance.innerHTML= numBalance.toString();
})

const deleteFn1 = function (newRow1) {
    console.log(newRow1.id);
    obj = {
        id: newRow1.id
    }
    axios.post("http://localhost:3000/income/deleteincome", obj)
        .then(() => {
            console.log("deleted")
        })
        .catch((err) => {
            console.log(err);
        })
}






//                     //            //     //        PREMIUM            //                   //      //               //  

premiumButton.addEventListener('click', async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:3000/purchase/premiummembership", { headers: { "Authorization": token } });


    //following is the code executed after i get response form the buypremium mbership controller. 
    console.log(response);
    var options = {
        "key": response.data.key_id, // we give the key id so tht razor pay could know that it is a payment request refering to my comany . 
        "order_id": response.data.order.id, // this order id tells the razor pay about time amount and currency. this is already registered at razorpay. 
        // following handeler will handle the sucess payment . It is a callback fn and it is calledn after success of payment. This cb is eecuted by razorpay itself.
        "handler": async function (response) {
            await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                payStatus: true,
            }, { headers: { "Authorization": token } })
            alert("Congratulations ! You Are Now a Premium User");
            premiumButton.remove(); // removing the premiusm button once the user is a premium user.
            //Adding 'You are a premium user'. 
            const parentDiv = document.querySelector('.left-side');
            const premiumDiv = document.createElement('div');
            premiumDiv.textContent = "You are a Premium User";
            premiumDiv.id = "premium-user";
            parentDiv.appendChild(premiumDiv);

            // Adding Leaderboard button 
            const leaderboardButton = document.createElement('button');
            leaderboardButton.textContent = "Click Here to See Saving's Leaderboard";
            leaderboardButton.id = "leaderboardbutton";
            parentDiv.appendChild(leaderboardButton);

            leaderboardButton.addEventListener('click', ()=>{
                if(leaderboardButton.textContent === "Click Here to See Saving's Leaderboard"){
                    
                    console.log("clcked 1");
                    leaderboardButton.textContent = "Click Here to Hide Saving's Leaderboard";
                    showLeaderboard();
                }
                else if(leaderboardButton.textContent === "Click Here to Hide Saving's Leaderboard"){
                    console.log("clcked 2");
                    leaderboardButton.textContent = "Click Here to See Saving's Leaderboard";
                    hideLeaderboard();
                }
            })
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open(); //this opens the UI of razor pay over our page. 
    e.preventDefault();
    // below code is to handle payment failure case. again this will be executed by razorpay itself. 
    rzp1.on('payment.failed', async function (response) {
        console.log(response.error.metadata);
        alert('Payment Failed Please try Again');
        // chaning the pyment stautus to "FAILED" in the order table
        await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
            order_id: response.error.metadata.order_id,
            payment_id: response.error.metadata.payment_id,
            payStatus: false,
        }, { headers: { "Authorization": token } })
    });
})


// Leader Board 
const showLeaderboard = async() =>{
    console.log("Show Lead button Clicked");
    await axios.get("http://localhost:3000/premium/showLeaderboard")
        .then((res)=>{
            console.log(res.data);
            // Toggle the visibility of the div
            if (leaderboardContainer.style.display === 'none') {
                leaderboardContainer.style.display = 'block';
            }
            // adding data to the table
            let r=1; // this  is count for rank display
            res.data.forEach((user)=>{
                const row = document.createElement('tr');
                const rankCell = document.createElement('td');
                const nameCell = document.createElement('td');
                const expenseCell = document.createElement('td');

                rankCell.textContent = r;
                r++;
                nameCell.textContent = user.name;
                expenseCell.textContent = user.total_cost;

                row.appendChild(rankCell);
                row.appendChild(nameCell);
                row.appendChild(expenseCell);

                tableBody.appendChild(row);
            })                                                                                  
        })
    return;
};

const hideLeaderboard = () =>{
    console.log("Hide Lead button Clicked");
    leaderboardContainer.style.display = 'none';
    // Remove all rows from the table body
    while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
    }
    return; 
};