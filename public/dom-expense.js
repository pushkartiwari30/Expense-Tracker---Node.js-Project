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

const downloadButton = document.querySelector('.download-button');
const closeButton = document.getElementById("closeButton");
const overlay = document.getElementById("overlay");
const popup = document.querySelector(".popup");

const paginationExpensesContainer = document.getElementById('paginationExpenses');
const paginationIncomesContainer = document.getElementById('paginationIncomes');

const pageRefreshButton = document.getElementById('pageRefresh');
const rowsPerPage = document.getElementById('rowsPerPage');

const homepageButton = document.querySelector('.homepage-button');
const logoutButton = document.querySelector('.logout-button');

// making a get request to the backend 
const token = localStorage.getItem('token');
let incomeSumTotal = 0;
let expenseSumtotal = 0;


// storing nmber of rows per page in the local stroarge . Bydefault value = 10; 
if (localStorage.getItem('rows') === null) {
    localStorage.setItem('rows', 10);
}

// Storing the page number in local storage  . This willbe used for add expense pagination . 
// Logic: If page == 1 --> add expense. If not then redirect to page 1 and do noting else
localStorage.setItem('expensepage1ornot', true); // by deafult the page is page 1
localStorage.setItem('incomepage1ornot', true); // by deafult the page is page 1

function getExpenses(page, rows) {
    if (page == 1) {
        localStorage.setItem('expensepage1ornot', true);
    }
    else {
        localStorage.setItem('expensepage1ornot', false);
    }
    axios.get(`http://localhost:3000/expense/getexpenses?page=${page}&rows=${rows}`, { headers: { "Authorization": token } })
        .then((res) => {
            // chekcing if the loggedin user is a premiusm user or not. if he is then : 
            // remove the premium button. 
            if (res.data.isPremiumUser) {
                premiumButton.remove(); //removing buy premium butoon
                //Adding 'You are a premium user'. 
                const parentDiv = document.querySelector('.left-side');
                const premiumDiv = document.createElement('div');
                premiumDiv.textContent = "You are a Premium User";
                premiumDiv.id = "premium-user"
                parentDiv.appendChild(premiumDiv);

                // Adding Leaderboard button 
                const leaderboardButton = document.createElement('button');
                leaderboardButton.textContent = "Click Here to See Expense Leaderboard";
                leaderboardButton.id = "leaderboardbutton";
                parentDiv.appendChild(leaderboardButton);

                leaderboardButton.addEventListener('click', () => {
                    if (leaderboardButton.textContent === "Click Here to See Expense Leaderboard") {

                        console.log("clcked 1");
                        leaderboardButton.textContent = "Click Here to Hide Expense Leaderboard";
                        showLeaderboard();
                    }
                    else if (leaderboardButton.textContent === "Click Here to Hide Expense Leaderboard") {
                        console.log("clcked 2");
                        leaderboardButton.textContent = "Click Here to See Expense Leaderboard";
                        hideLeaderboard();
                    }
                })
            }

            // Pagination Code
            showExpensePagination(res.data);
            // Code fo adding expense to the UI
            console.log(res.data.allExpense);
            const expense = res.data.allExpense;
            expense.forEach(obj => {
                console.log(obj)
                // Create new table row
                const newRow = document.createElement('tr');

                // // Convert ISO timestamp to JavaScript Date object
                const dateObject = new Date(obj.createdAt);
                // Format the date and time in a more readable format
                const date = dateObject.toLocaleDateString(); // Example: '8/18/2023'
                const expenseDetail = [date, obj.amountExp, obj.description, obj.category];
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
            if (res.data.totalExpense == null) {
                expenseSumtotal = 0;
            }
            else {
                expenseSumtotal = res.data.totalExpense;
            }
            totalExpense.innerHTML = expenseSumtotal;

        })
        .catch((err) => {
            console.log(err);
        })
}
function getIncomes(page, rows) {
    if (page == 1) {
        localStorage.setItem('incomepage1ornot', true);
    }
    else {
        localStorage.setItem('incomepage1ornot', false);
    }
    axios.get(`http://localhost:3000/income/getincomes?page=${page}&rows=${rows}`, { headers: { "Authorization": token } })
        .then((res) => {
            // Pagination Code
            showIncomePagination(res.data);
            //console.log(res.data.allIncome);
            const income = res.data.allIncome;
            income.forEach(obj => {
                // Create new table row
                const newRow1 = document.createElement('tr');
                // // Convert ISO timestamp to JavaScript Date object
                const dateObject = new Date(obj.createdAt);
                // Format the date and time in a more readable format
                const date = dateObject.toLocaleDateString(); // Example: '8/18/2023'
                const incomeDetail = [date, obj.amountInc, obj.description, obj.category];
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
            if (res.data.totalIncome == null) {
                incomeSumTotal = 0;
            }
            else {
                incomeSumTotal = res.data.totalIncome;
            }
            totalIncome.innerHTML = incomeSumTotal;
            balance.innerHTML = incomeSumTotal - expenseSumtotal;

        })
        .catch((err) => {
            console.log(err);
        })
}

document.addEventListener('DOMContentLoaded', () => {
    const rows = localStorage.getItem('rows');
    getExpenses(1, rows);
    hideLeaderboard()// hidning the leader booard after refresh
    //   <---------------------------------Get Req for Incomes ---------------------------------> 
    getIncomes(1, rows);
})

addExpenseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    hideLeaderboard(); //closing leaderboard
    const expObj = {
        amount: amount.value,
        desc: desc.value,
        cat: cat.value
    }
    console.log(expObj);
    axios.post("http://localhost:3000/expense/addexpense", expObj, { headers: { "Authorization": token } })
        .then((res) => {
            console.log(res.data.data.id);
            if (localStorage.getItem('expensepage1ornot') === 'true') { // I am not adding expeses for pages other than first page  in the UI
                // Create new table row
                const newRow = document.createElement('tr');
                // Create table data cells
                console.log(amount.value);
                const date = (new Date()).toLocaleDateString();
                const expenseDetail = [date, amount.value, desc.value, cat.value];
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

                // Append the new row to the table body. But on top of the existing list
                tbody.insertBefore(newRow, tbody.firstChild);
                //counting th enumber of exiting rows in page 1
                const rowCount = tbody.rows.length;
                const rows = localStorage.getItem('rows');
                if (rowCount > rows) { // deleting the last row only if 1st page has preexiting 5 rows.
                    const lastRow = tbody.lastElementChild;
                    if (lastRow) {
                        tbody.removeChild(lastRow); //Deleteing that last elemnt of the list of tbody so tha number of rows remian same. 
                    }
                }
            }
            else {
                // not addin the expense but just redicreting to page 1 
                const rows = localStorage.getItem('rows');
                tbody.innerHTML = '';
                getExpenses(1, rows);
                premiumRemoveForPagination();
            }
            //changing the total exp and balance total value in UI
            numExpenseTotal = parseFloat(totalExpense.innerHTML) + parseFloat(amount.value);
            numIncomeTotal = parseFloat(totalIncome.innerHTML)
            numBalance = numIncomeTotal - numExpenseTotal;

            totalExpense.innerHTML = numExpenseTotal.toString()
            balance.innerHTML = numBalance.toString();

            // Reset the form
            addExpenseForm.reset();
        })
        .catch((err) => {
            console.log(err);
        })

})

const deleteFn = function (newRow) {
    hideLeaderboard(); //closing leaderboard
    obj = {
        id: newRow.id,
        amount: newRow.childNodes[1].textContent
    }
    axios.post("http://localhost:3000/expense/deleteexpense", obj, { headers: { "Authorization": token } })
        .then(() => {
            console.log("deleted");
            numExpenseTotal = parseFloat(totalExpense.innerHTML) - parseFloat(newRow.childNodes[1].textContent);
            numIncomeTotal = parseFloat(totalIncome.innerHTML)
            numBalance = numIncomeTotal - numExpenseTotal;

            totalExpense.innerHTML = numExpenseTotal.toString()
            balance.innerHTML = numBalance.toString();
        })
        .catch((err) => {
            console.log(err);
        })
}


// ------------------------------------------INCOME ----------------------------------------------------
addIncomeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    hideLeaderboard(); //closing leaderboard
    const expObj = {
        amount: amount1.value,
        desc: desc1.value,
        cat: cat1.value
    }
    console.log(expObj);
    axios.post("http://localhost:3000/income/addincome", expObj, { headers: { "Authorization": token } })
        .then((res) => {
            console.log(res.data.data.id);
            if (localStorage.getItem('incomepage1ornot') === 'true') { // I am not adding expeses for pages other than first page  in the UI
                // Create new table row
                const newRow1 = document.createElement('tr');
                // Create table data cells
                const date = (new Date()).toLocaleDateString();
                const incomeDetail = [date, amount1.value, desc1.value, cat1.value];
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

                // Append the new row to the table body. But on top of the existing list
                tbody1.insertBefore(newRow1, tbody1.firstChild);
                //counting th enumber of exiting rows in page 1
                const rowCount = tbody1.rows.length;
                const rows = localStorage.getItem('rows');
                //Deleteing that last elemnt of the list of tbody so tha number of rows remian same. 
                if (rowCount > rows) { // deleting the last row only if 1st page has preexiting 5 rows.
                    const lastRow = tbody1.lastElementChild;
                    if (lastRow) {
                        tbody1.removeChild(lastRow);
                    }
                }
            }
            else {
                // not addin the expense but just redicreting to page 1 
                const rows = localStorage.getItem('rows');
                tbody1.innerHTML = '';
                getIncomes(1, rows);
            }
            //changing the total income and balance total value in UI
            numExpenseTotal = parseFloat(totalExpense.innerHTML);
            numIncomeTotal = parseFloat(totalIncome.innerHTML) + parseFloat(amount1.value)
            numBalance = numIncomeTotal - numExpenseTotal;

            totalIncome.innerHTML = numIncomeTotal.toString()
            balance.innerHTML = numBalance.toString();

            // Reset the form
            addIncomeForm.reset();
        })
        .catch((err) => {
            console.log(err);
        });
})

const deleteFn1 = function (newRow1) {
    hideLeaderboard(); //closing leaderboard
    obj = {
        id: newRow1.id,
        amount: newRow1.childNodes[1].textContent
    }
    axios.post("http://localhost:3000/income/deleteincome", obj, { headers: { "Authorization": token } })
        .then(() => {
            console.log("deleted");
            //changing the total income and balance total value in UI
            numExpenseTotal = parseFloat(totalExpense.innerHTML);
            numIncomeTotal = parseFloat(totalIncome.innerHTML) - parseFloat(newRow1.childNodes[1].textContent)
            numBalance = numIncomeTotal - numExpenseTotal;

            totalIncome.innerHTML = numIncomeTotal.toString()
            balance.innerHTML = numBalance.toString();
        })
        .catch((err) => {
            console.log(err);
        })
}






//                     //            //     //       PREMIUM            //             //      //               //  

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
            leaderboardButton.textContent = "Click Here to See Expense Leaderboard";
            leaderboardButton.id = "leaderboardbutton";
            parentDiv.appendChild(leaderboardButton);

            leaderboardButton.addEventListener('click', () => {
                if (leaderboardButton.textContent === "Click Here to See Expense Leaderboard") {

                    console.log("clcked 1");
                    leaderboardButton.textContent = "Click Here to Hide Expense Leaderboard";
                    showLeaderboard();
                }
                else if (leaderboardButton.textContent === "Click Here to Hide Expense Leaderboard") {
                    console.log("clcked 2");
                    leaderboardButton.textContent = "Click Here to See Expense Leaderboard";
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
const showLeaderboard = async () => {
    console.log("Show Lead button Clicked");
    await axios.get("http://localhost:3000/premium/showLeaderboard")
        .then((res) => {
            console.log(res.data);
            // Toggle the visibility of the div
            if (leaderboardContainer.style.display === 'none') {
                leaderboardContainer.style.display = 'block';
            }
            // adding data to the table
            let r = 1; // this  is count for rank display
            res.data.forEach((user) => {
                console.log(user);
                const row = document.createElement('tr');
                const rankCell = document.createElement('td');
                const nameCell = document.createElement('td');
                const expenseCell = document.createElement('td');

                rankCell.textContent = r;
                r++;
                nameCell.textContent = user.name;
                if (user.saving_percentage !== null) {
                    console.log(typeof parseFloat(user.saving_percentage.toFixed(2)))
                    expenseCell.textContent = (100 - parseFloat(user.saving_percentage)).toFixed(2) + "%";
                }
                else {
                    expenseCell.textContent = "Expense or Income or Both Not Added"
                }

                row.appendChild(rankCell);
                row.appendChild(nameCell);
                row.appendChild(expenseCell);
                tableBody.appendChild(row);
                console.log(user.total_expense);
            })
        })
    return;
};

const hideLeaderboard = () => {
    console.log("Hide Lead button Clicked");
    leaderboardContainer.style.display = 'none'; // removing leader borad from UI
    // Chnaging the text content of the button 
    const leaderboardButton = document.getElementById('leaderboardbutton');
    if (leaderboardButton !== null) {
        leaderboardButton.textContent = "Click Here to See Expense Leaderboard"
    }
    // Remove all rows from the table body ; I i dont do this then new data is added below this everytime 'see leaderboard' button is clicked
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    return;
};



//          //        //     //        DOWNLOAD EXPENSE+INCOME FILE            //      //      //               //
downloadButton.addEventListener('click', (e) => {
    console.log("download button clicked");
    axios.get("http://localhost:3000/user/download", { headers: { "Authorization": token } })
        .then((res) => {
            if (res.data.success) {
                overlay.style.display = "flex"; // or "block"
                popup.style.display = "block";
                closeButton.addEventListener("click", () => {
                    overlay.style.display = "none";
                    popup.style.display = "none";
                });
                const allDataOfURLTable = res.data.allDataOfURLTable;
                allDataOfURLTable.forEach(file => {
                    const URL = file.fileUrl;
                    // // Convert ISO timestamp to JavaScript Date object
                    const dateObject = new Date(file.createdAt);
                    // Format the date and time in a more readable format
                    const date = dateObject.toLocaleDateString(); // Example: '8/18/2023'
                    const time = dateObject.toLocaleTimeString(); // Example: '3:31:04 PM'

                    const data = { date, time, URL };
                    const tableBody = document.getElementById('tableBody');
                    const row = document.createElement('tr');
                    const dateCell = document.createElement('td');
                    dateCell.textContent = data.date;
                    row.appendChild(dateCell);

                    const timeCell = document.createElement('td');
                    timeCell.textContent = data.time;
                    row.appendChild(timeCell);

                    const urlCell = document.createElement('td');
                    const urlLink = document.createElement('a');
                    urlLink.href = data.URL;
                    urlLink.target = '_blank';

                    // Truncate the URL to show only the first 20 characters
                    const maxLength = 22;
                    const truncatedURL = data.URL.length > maxLength ? data.URL.substring(0, maxLength) + '...' : data.URL;
                    urlLink.textContent = truncatedURL;

                    urlCell.appendChild(urlLink);
                    row.appendChild(urlCell);
                    tableBody.appendChild(row);
                });
            }
            else {
                alert(`${res.data.alert}`);
            }
        }).catch((err) => {
            console.log(err);
        });
})

//          //        //     //        PAGINATION FN            //      //      //               //
function showExpensePagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
    paginationExpensesContainer.innerHTML = '';
    const rows = localStorage.getItem('rows');
    // coee for first page : 
    if (previousPage > 1) {
        const btn0 = document.createElement('button');
        btn0.innerHTML = 1
        btn0.addEventListener('click', () => {
            tbody.innerHTML = '';
            getExpenses(1, rows);
            premiumRemoveForPagination();
        });
        paginationExpensesContainer.appendChild(btn0);
    }
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage
        btn2.addEventListener('click', () => {
            tbody.innerHTML = '';
            getExpenses(previousPage, rows);
            premiumRemoveForPagination();
        });
        paginationExpensesContainer.appendChild(btn2);
    }
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    btn1.addEventListener('click', () => {
        tbody.innerHTML = '';
        getExpenses(currentPage, rows);
        premiumRemoveForPagination();
    });
    paginationExpensesContainer.appendChild(btn1);
    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => {
            tbody.innerHTML = '';
            getExpenses(nextPage, rows);
            premiumRemoveForPagination();
        });
        paginationExpensesContainer.appendChild(btn3);
    }
    if (lastPage > nextPage) {
        const btn4 = document.createElement('button');
        btn4.innerHTML = lastPage;
        btn4.addEventListener('click', () => {
            tbody.innerHTML = '';
            getExpenses(lastPage, rows);
            premiumRemoveForPagination();
        });
        paginationExpensesContainer.appendChild(btn4);
    }
}

function showIncomePagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
    paginationIncomesContainer.innerHTML = '';
    const rows = localStorage.getItem('rows');
    // code for first page : 
    if (previousPage > 1) {
        const btn0 = document.createElement('button');
        btn0.innerHTML = 1
        btn0.addEventListener('click', () => {
            tbody1.innerHTML = '';
            getIncomes(1, rows);
        });
        paginationIncomesContainer.appendChild(btn0);
    }
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage
        btn2.addEventListener('click', () => {
            tbody1.innerHTML = '';
            getIncomes(previousPage, rows);
        });
        paginationIncomesContainer.appendChild(btn2);
    }
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    btn1.addEventListener('click', () => {
        tbody1.innerHTML = '';
        getIncomes(currentPage, rows);
    });
    paginationIncomesContainer.appendChild(btn1);
    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => {
            tbody1.innerHTML = '';
            getIncomes(nextPage, rows);
        });
        paginationIncomesContainer.appendChild(btn3);
    }
    if (lastPage > nextPage) {
        const btn4 = document.createElement('button');
        btn4.innerHTML = lastPage;
        btn4.addEventListener('click', () => {
            tbody1.innerHTML = '';
            getIncomes(lastPage, rows);
        });
        paginationIncomesContainer.appendChild(btn4);
    }
}

//This fn is for removing the extra prmium tag and showleaderboard button that comes up when pagination button sare clicked. 
function premiumRemoveForPagination() {
    const premiumUserTag = document.getElementById('premium-user');
    const leaderboardButton = document.getElementById('leaderboardbutton');

    if (premiumUserTag && leaderboardButton) {
        premiumUserTag.remove();
        leaderboardButton.remove();
    }
}

//                          //                   No. of rows per page          //                                 //

pageRefreshButton.addEventListener('click', () => {
    const rows = rowsPerPage.value;
    localStorage.setItem('rows', rows);
    getExpenses(1, rows);
    tbody.innerHTML = '';
    getIncomes(1, rows);
    tbody1.innerHTML = '';
    premiumRemoveForPagination();
})

// --------------------------------------------------Home Page Redirecting ---------------------------------//
homepageButton.addEventListener('click', () => {
    window.location.href = 'home.html';
    localStorage.removeItem('token'); //logging out
})
// --------------------------------------------------Log Out  ---------------------------------------------//
logoutButton.addEventListener('click', () => {
    window.location.href = 'home.html';
    localStorage.removeItem('token'); //logging out
})