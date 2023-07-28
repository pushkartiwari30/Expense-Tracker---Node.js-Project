const Expense = require('../models/expenses');
const Income = require('../models/incomes');
const User = require('../models/user');

exports.showLeaderboard = async(req,res) =>{
    try {
        const expenses = await Expense.findAll();
        const incomes = await Income.findAll();
        const users = await User.findAll();
        userAggregatedExpenses= {}; // an object that will stro the all the expense of respectibe userIds as key value pairs
        expenses.forEach(expense => {
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId]+expense.amount;            
            }
            else{
                userAggregatedExpenses[expense.userId] = expense.amount;
            }
        });
        userAggregatedIncomes= {}; // an object that will stro the all the expense of respectibe userIds as key value pairs
        
        var userLeaderboardDetails = [];
        users.forEach(user =>{
            if(userAggregatedExpenses[user.id]==undefined){ // for those user who have not added any expense
                userLeaderboardDetails.push({name: user.name, total_cost: 0});
            }
            else{
                userLeaderboardDetails.push({name: user.name, total_cost: userAggregatedExpenses[user.id]});
            }
        })
        //console.log(userAggregatedExpenses);
        userLeaderboardDetails.sort((a,b)=> a.total_cost-b.total_cost )
        console.log(userLeaderboardDetails);
        res.status(200).json(userLeaderboardDetails);
        
      } catch (err) {
        console.error(err);
      }
}

 