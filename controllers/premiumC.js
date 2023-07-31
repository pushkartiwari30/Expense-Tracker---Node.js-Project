const Expense = require('../models/expenses');
const Income = require('../models/incomes');
const User = require('../models/user');
const sequelize = require('sequelize');

exports.showLeaderboard = async(req,res) =>{
    // refer notes to see what optimisatiosn we did and how does it affects
    // Optim 1: using attributes      // Optim 2: using sequelize fn  // Optim 3: Using Joins (left jon bydefault )//Optim 4 : USing order feature to sort //Potim 5: stroing the total expense and income in the user table. (Explanation in the notes t11)
    try {
        const leaderboardData = await User.findAll({
            attributes: [
              'id',
              'name',
              [sequelize.literal('((totalIncome - totalExpense) / totalIncome) * 100'), 'saving_percentage']
              ],
            order: [['saving_percentage', 'DESC']]
          });
        //console.log(leaderboardData);
        // The leaderboardData variable will now contain an array of objects, each representing a user with their "id", "name", "total_expense", and "saving_percentage".
        res.status(200).json(leaderboardData);
      } catch (err) {
        console.error(err);
      }
}

 