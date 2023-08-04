const Income = require('../models/incomes');
const User = require('../models/user');
const sequelize = require('../util/database');


exports.addIncome = async (req, res) => {
    const t = await sequelize.transaction(); // Creating transaction object
    try {
        const amount = req.body.amount;
        console.log("Amount =")
        console.log(amount);
        const desc = req.body.desc;
        const cat = req.body.cat;
        console.log(req.user.id);

        const income = await Income.create(
            { amountInc: amount, description: desc, category: cat, userId: req.user.id },
            { transaction: t }
        );
        const user = await User.findByPk(req.user.id, { transaction: t });
        console.log(user);
        let newTotalIncome = 0;
        if (user.totalIncome === null) {
            newTotalIncome = amount;
        }
        else {
            newTotalIncome = user.totalIncome + parseFloat(amount);
        }

        await user.update({ totalIncome: newTotalIncome }, { transaction: t });
        await t.commit(); // Commit the transaction
        console.log(newTotalIncome);
        console.log("updated")
        res.status(201).json({ data: income });
    } catch (err) {
        //await t.rollback();
        console.error(err);
        res.status(500).json({ error: err });
    }
};

exports.deleteIncome = async (req, res) => {
    const t = await sequelize.transaction(); // Creating transaction object
    try {
        //console.log(req.body.id);
        await Income.destroy({
            where: { id: req.body.id },
            transaction: t
        });
        // Changing the totalIncome data in the user table
        const user = await User.findByPk(req.user.id, { transaction: t });
        if (user) {
            const newTotalIncome = user.totalIncome - parseFloat(req.body.amount);
            await user.update({ totalIncome: newTotalIncome }, { transaction: t });
            await t.commit(); // Commit the transaction
            console.log("Income deleted");
            res.sendStatus(204);
        } else {
            await t.rollback(); // Rollback the transaction
            console.log("User not found");
            res.sendStatus(404);
        }
    }
    catch (err) {
        await t.rollback(); // Rollback the transaction
        console.error(err);
        res.status(500).json({ error: err });
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