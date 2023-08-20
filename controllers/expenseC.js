const Expense = require('../models/expenses');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.addExpense = async (req, res) => {
    const t = await sequelize.transaction(); // Creating transaction object
    try {
        const amount = req.body.amount;
        const desc = req.body.desc;
        const cat = req.body.cat;
        console.log(req.user.id);

        const expense = await Expense.create(
            { amountExp: amount, description: desc, category: cat, userId: req.user.id },
            { transaction: t }
        );
        const user = await User.findByPk(req.user.id, { transaction: t });

        let newTotalExpense = 0;
        if (user.totalExpense === null) {
            newTotalExpense = amount;
        }
        else {
            newTotalExpense = user.totalExpense + parseFloat(amount);
        }

        await user.update({ totalExpense: newTotalExpense }, { transaction: t });
        await t.commit(); // Commit the transaction
        console.log(newTotalExpense);
        res.status(201).json({ data: expense });

    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: err });
    }
};
exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction(); // Creating transaction object
    try {
        await Expense.destroy({
            where: { id: req.body.id },
            transaction: t
        });
        // Changing the totalExpense data in the user table
        const user = await User.findByPk(req.user.id, { transaction: t });
        if (user) {
            const newTotalExpense = user.totalExpense - parseFloat(req.body.amount);
            await user.update({ totalExpense: newTotalExpense }, { transaction: t });
            await t.commit(); // Commit the transaction
            console.log("Expense deleted");
            res.sendStatus(204);
        } else {
            await t.rollback(); // Rollback the transaction
            console.log("User not found");
            res.sendStatus(404);
        }
    } catch (err) {
        await t.rollback(); // Rollback the transaction
        console.error(err);
        res.status(500).json({ error: err });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        let allExpense;
        let totalEntries;
        console.log(req.body);
        const page = parseInt(req.query.page);
        const rows = parseInt(req.query.rows);
        console.log("ROWS ==> ", rows);
        const offset = (page - 1) * rows; // the offset based on the page number and number of expenses per page

        await Expense.count({where: {userId: req.user.id}})
            .then(async (total) => {
                console.log("Total ==>", total);
                totalEntries = total;
                // we will find all the the expenses having a particular user id. 
                allExpense = await Expense.findAll({
                    where: { userId: req.user.id },
                    order: [['id', 'DESC']],
                    limit: rows,
                    offset: offset,
                });
            })
        // checking if loggedin user is a premium user or not 
        User.findOne({
            where: { id: req.user.id },
            attributes: ['ispremiumuser', 'totalExpense'], // specify the column I want to retrieve
        })
            .then(user => {
                if (user) {
                    console.log(user.ispremiumuser); // value of the 'ispremiumuser' column for the user with mentioned id of the user
                    res.status(200).json({
                        allExpense: allExpense,
                        isPremiumUser: user.ispremiumuser,
                        totalExpense: user.totalExpense,
                        currentPage: page,
                        hasNextPage: rows * page < totalEntries,
                        nextPage: page + 1,
                        hasPreviousPage: page > 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalEntries / rows)
                    });
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