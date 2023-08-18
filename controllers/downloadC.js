const Expense = require('../models/expenses');
const Income = require('../models/incomes');
const User = require('../models/user');
const FilesDownloaded = require('../models/filesdownloaded');
const S3services = require('../services/S3services');

exports.downloadFile = async (req, res) => {
    try {
        const userId = req.user.id;
        //Checking if the user is a premium user 
        const user = await User.findOne({ where: { id: req.user.id } })
        if (user.ispremiumuser) {
            const allExpenses = await Expense.findAll({ where: { userId: req.user.id } });
            // code for finidibg income 
            const allIncomes = await Income.findAll({ where: { userId: req.user.id } });
            //sending data to s3
            const stringifiedExpenses = JSON.stringify(allExpenses); // allExpenses is an array an we can only add strings to a file. 
            const stringifiedIncomes = JSON.stringify(allIncomes);
            const stringifiedData = stringifiedExpenses + stringifiedIncomes;
            const dataFileName = `ExpenseIncomeData${userId}/${new Date()}.txt`; //New File Created Everyday for every user
            const datafileURL = await S3services.uploadDataToS3(stringifiedData, dataFileName); //this fn will return the file url . fn name can be anything
            //adding the url to url table of mysql database
            await FilesDownloaded.create({
                fileUrl: datafileURL, userId: req.user.id
            });
            //quring the url tabe for all the urls
            const allDataOfURLTable = await FilesDownloaded.findAll({where : {userId: req.user.id}});
            console.log("All Data of the URL Table => ", allDataOfURLTable);
            res.status(200).json({ allDataOfURLTable, success: true });
        }
        else {
            console.log("User is not a premium user");
            res.json({ alert: "You are Not a Premium User", success: false });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}