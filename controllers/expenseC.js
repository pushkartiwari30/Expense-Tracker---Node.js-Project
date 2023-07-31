const Expense = require('../models/expenses');
const User = require('../models/user');

exports.addExpense  = async (req, res) => {
    try {
        //console.log(req.body);
        const amount = req.body.amount;
        const desc = req.body.desc;
        const cat = req.body.cat;
        console.log(req.user.id);
        const expense = await Expense.create({ amountExp: amount, description: desc, category: cat, userId:req.user.id });
        const totalExpenseData = await User.findByPk(req.user.id)
            .then((user)=>{
                let newTotalExpense = 0;
                console.log(typeof newTotalExpense)
                if(user.totalExpense === null){
                    newTotalExpense = amount;
                }
                else{
                    newTotalExpense = user.totalExpense+parseFloat(amount);
                }
                user.update({totalExpense: newTotalExpense});
                return newTotalExpense;
            });
            console.log(totalExpenseData);
        res.status(201).json({ data: expense, totalExpenseData: totalExpenseData });
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.destroy({
            where: { id: req.body.id },
        });
        //changing the toralExpense data in the user table
        await User.findByPk(req.user.id)
            .then((user)=>{
                newTotalExpense = user.totalExpense-parseFloat(req.body.amount);
                user.update({totalExpense: newTotalExpense});
                //return newTotalExpense;
            });
        console.log("expense deleted");
        res.sendStatus(204);
    }
    catch (err) {
        console.log(err);
    }
}

exports.getExpenses = async(req, res) => {
    try {
        console.log(req.body);
        // we will find all the the expenses having a particular user id. 
        const allExpense = await Expense.findAll({where :{userId: req.user.id}})
        // checking if loggedin user is a premium user or not 
        User.findOne({
            where: { id: req.user.id },
            attributes: ['ispremiumuser'] // specify the column I want to retrieve
          })
          .then(user => {
            if (user) {
              console.log(user.ispremiumuser); // value of the 'ispremiumuser' column for the user with mentioned id of the user
              res.status(200).json({allExpense : allExpense, isPremiumUser: user.ispremiumuser});
            } else {
              console.log("User not found.");
            }
          })
          .catch(err => {
            console.error('Error:', err);
          });
        
        
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}