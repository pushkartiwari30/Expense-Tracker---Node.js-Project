const Expense = require('../models/expenses');
const Income = require('../models/incomes');
const User = require('../models/user');
const sequelize = require('sequelize');

exports.showLeaderboard = async(req,res) =>{
    // refer notes to see what optimisatiosn we did and how does it affects
    // Optim 1: using attributes      // Optim 2: using sequelize fn  // Optim 3: Using Joins (left jon bydefault )//Optim 4 : USing order feature to sort
    try {
        const leaderboardData = await User.findAll({
            attributes: [
              'id',
              'name',
              [sequelize.fn('sum', sequelize.col('amountExp')), 'total_expense'],
            ],
            include: [
              {
                model: Expense,
                attributes: []
              },
            ],
            group: ['user.id'],
            order:[['total_expense','DESC']]
          });



        // see whta yash sir wrotw in yh code and checkc if according to hi code i am getting the tota correct separately. 


          
          // The leaderboardData variable will now contain an array of objects, each representing a user with their "id", "name", "total_expense", and "total_income".
          
        //console.log(leaderboardData);
        //console.log(leaderboardDataExpense);

        res.status(200).json(leaderboardData);
        
      } catch (err) {
        console.error(err);
      }
}

 