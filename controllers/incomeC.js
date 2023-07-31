const Income = require('../models/incomes');
const User = require('../models/user')

exports.addIncome  = async (req, res) => {
    try {
        //console.log(req.body);
        const amount = req.body.amount;
        const desc = req.body.desc;
        const cat = req.body.cat;
        console.log(req.user.id);
        const income = await Income.create({ amountInc: amount, description: desc, category: cat, userId:req.user.id })
        const totalIncomeData = await User.findByPk(req.user.id)
            .then((user)=>{
                let newTotalIncome = 0;
                console.log(typeof newTotalIncome)
                if(user.totalIncome === null){
                    newTotalIncome = amount;
                }
                else{
                    newTotalIncome = user.totalIncome+parseFloat(amount);
                }
                user.update({totalIncome: newTotalIncome});
                return newTotalIncome;
            });
            console.log(totalIncomeData);
        res.status(201).json({ data: income, totalIncomeData: totalIncomeData });
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteIncome = async (req, res) => {
    try {
        //console.log(req.body.id);
        await Income.destroy({
            where: { id: req.body.id },
        });
        console.log("income deleted");
        res.sendStatus(204);
    }
    catch (err) {
        console.log(err);
    }
}

exports.getIncomes = async(req, res) => {
    try {
        console.log(req.body);
        // we will find all the the incomes having a particular user id. 
        const allIncome = await Income.findAll({where :{userId: req.user.id}})
        // checking if loggedin user is a premium user or not 
        User.findOne({
            where: { id: req.user.id },
            attributes: ['ispremiumuser'] // specify the column I want to retrieve
          })
          .then(user => {
            if (user) {
              console.log(user.ispremiumuser); // value of the 'ispremiumuser' column for the user with mentioned id of the user
              res.status(200).json({allIncome : allIncome, isPremiumUser: user.ispremiumuser});
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