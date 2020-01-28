const DB = require('../utils/linkDB');

const test = (req, res, next) =>{
    res.send('into registerController');
};


const companyRegister = async (req, res, next) => {
    // name, account can not duplicate
    const { name, account, password, number, address, taxID } = req.body

    const post = {ltd_name: name, ltd_account: account, ltd_password: password, ltd_number: number, address: address, tax_id: taxID, in_use: 1};
    const checkName = `SELECT ltd_name FROM company WHERE ltd_name="${name}"`; 
    const checkAccount = `SELECT ltd_name FROM company WHERE ltd_name="${account}"`; 
    const sql = `INSERT INTO company SET ?`;
    const db = await DB();
    let isValid = true;
    // check company name
    try {
        const [rows, fields] = await db.query(checkName, post);
        isValid = !rows.length//有值是1 加!變boolean false
        if (!isValid) { //company exist
            return res.json({
                Status: '409',
                messgae: 'Company name exist, cannot register',
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }

    //check account
    try {
        const [rows, fields] = await db.query(checkAccount, post);
        isValid = !rows.length//有值是1 加!變boolean false
        if (!isValid) { //company exist
            return res.json({
                Status: '409',
                messgae: 'Company account exist, cannot register’',
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }

    if (isValid) {
        try {
            const [rows, fields] = await db.query(sql, post);
            console.log(rows);
            let companyID = rows.insertId;
            return res.json({
                Status: '200',
                message: 'Company register successful',
                companyID
            });
        } catch (err) {
            return res.json({
                Status: '400',
                message: 'Company register failure',
            }); 
        }
    }
};


const staffRegister = async (req, res, next) => {    
    // name account can not duplicate , lid_id must exist
    const{name, account, password, number, authority, supervisor, ltdID} = req.body;

    const post = {staff_name: name, staff_account: account, staff_password: password,
         staff_number: number, authority: authority, supervisor: supervisor, ltd_id: ltdID, in_use: 1};
    const checkAccount = `SELECT staff_account FROM staff WHERE staff_account = "${account}"`;
    const checkCompany = `SELECT ltd_id FROM company WHERE ltd_id = "${ltdID}"`;
    const sql = `INSERT INTO staff SET ?`;
    const db = await DB();
    let isAccountValid = true;
    let isCompanyValid = true;

    //chcek account 
     try {
        const [rows, fields] = await db.query(checkAccount,post);
        isAccountValid = !rows.length;
       // console.log(isAccountValid + ' after');
        if(!isAccountValid){ //account exist
            return res.json({
                Status: '409',
                message:'Staff account exist, cannot register',
            });
        }
    } catch (err){
        return res.json({
            Status: '400',
            message: 'Chcek account something wrong',
        });
    }    

    //check company
    try {
        const [rows, fields] = await db.query(checkCompany,post);
        isCompanyValid = !rows.length; //有值是true +!變false 
        console.log(isCompanyValid);
        if(!isCompanyValid && isAccountValid){ 
            try {
                const [rows, fields] = await db.query(sql, post);
                console.log(rows);
                return res.json({
                    Status: '200',
                    message: 'Staff register successful',
                });
            } catch (err) {
                return res.json({
                    Status: '400',
                    message: 'Staff register failure',
                }); 
            }
        }else {
            return res.json({
                Status: '400',
                message: 'Company not exist',
            });
        }
    } catch (err){
        return res.json({
            Status: '400',
            message: 'Something Wrong',
        });
    }    
}


module.exports = {
    test,
    companyRegister,
    staffRegister
}


