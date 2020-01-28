const DB = require('../utils/linkDB');
const authController = require('./authController');

const test = (req, res, next) =>{
    res.send('into loginController');
};

const companyLogin = async (req, res, next) => {
    const {account, password} = req.body

    const post = {ltd_account: account, ltd_password: password};
    const checkAccount = `SELECT ltd_id, ltd_account, ltd_password  FROM company WHERE ltd_account="${account}" AND ltd_password = "${password}"`; 

    const db = await DB();
    let isValid = true;

    try {
        const [rows, fields] = await db.query(checkAccount, post);
        isValid = !rows.length//有值是1 加!變boolean false
        //console.log(rows);
        if (!isValid) { //company exist
            let id = rows[0].ltd_id;
            let account = rows[0].ltd_account;
            let info = [id,account];
            console.log(info);
            let token = await authController.getToken(info,res);
            return res.json({
                Status: '200',
                messgae: 'Company login successful',
                token
            });
        }else{
            return res.json({
                Status: '400',
                messgae: 'Company login failure',
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const staffLogin = async (req, res, next) => {
    console.log(req.body);
    const {account, password} = req.body

    const post = {staff_account: account, staff_password: password};
    const checkAccount = `SELECT staff_id, staff_account, ltd_id FROM staff WHERE staff_account="${account}"`; 

    const db = await DB();
    let isValid = true;

    try {
        const [rows1, fields] = await db.query(checkAccount, post);
        isValid = !rows1.length//有值是1 加!變boolean false
        if (!isValid) { //company exist
            let id = rows1[0].staff_id;
            let account = rows1[0].staff_account;
            let ltdID = rows1[0].ltd_id;
            let info = [id,account,ltdID];
            console.log(info);
            const takeltdInfo = `SELECT ltd_id AS ltdID, ltd_name AS ltdName, ltd_number AS ltdNumber, address, tax_id AS taxID FROM company WHERE ltd_id="${ltdID}"`;
            const [rows] = await db.query(takeltdInfo);

            let token = await authController.getToken(info, res);
            return res.json({
                Status: '200',
                messgae: 'Staff login successful',
                token,
                rows
            });
        }else{
            return res.json({
                Status: '400',
                messgae: 'Staff login failure',
            });
        }
    } catch (err) {
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}



module.exports = {
    test,
    companyLogin,
    staffLogin
}