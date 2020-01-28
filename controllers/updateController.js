const DB = require('../utils/linkDB');
const jwt = require('jsonwebtoken');
const test = (req, res, next) =>{
    res.send('into updateController');
};

const updateCompanyInfo = async (req, res, err) =>{
    const {name, password, number, address, taxID } = req.body
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    const sql = `UPDATE company SET ltd_name = "${name}", ltd_password = "${password}", 
    ltd_number = "${number}", address = "${address}", tax_id = "${taxID}" WHERE ltd_id = "${ltdID}"`;
    const db = await DB();

    try{
        const [rows] = await db.query(sql);
        return res.json({
            Status: '200',
            message: 'Update company info successful'
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const updateStaffInfo = async (req, res, err) =>{
    const{name, password, authority, supervisor, number} = req.body;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const staffID = decoded.id;
    const sql = `UPDATE staff SET staff_name = "${name}", staff_password = "${password}", 
    staff_number = "${number}", authority = "${authority}", supervisor = "${supervisor}" WHERE staff_id = ${staffID}`;
    const db = await DB();

    try{
        const [rows] = await db.query(sql);
        return res.json({
            Status: '200',
            message: 'Update staff info successful'
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}


const updateDateShift = async (req, res, err) =>{
    const{dateShiftID, dateShiftName} = req.body;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    const sql = `UPDATE date_shift SET date_shift_name = "${dateShiftName}" WHERE ltd_id = ${ltdID} AND date_shift_id = "${dateShiftID}"`;
    const db = await DB();

    try{
        const [rows] = await db.query(sql);
        return res.json({
            Status: '200',
            message: 'Update date shift info successful'
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const updateTimeShift = async (req, res, err) =>{
    const{timeShiftID, timeShiftName, startTime, endTime, number} = req.body;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    const sql = `UPDATE time_shift SET time_shift_name = "${timeShiftName}", start_time = "${startTime}",
        end_time = "${endTime}", number = "${number}" WHERE ltd_id = ${ltdID} AND time_shift_id = "${timeShiftID}"`;
    const db = await DB();

    try{
        const [rows] = await db.query(sql);
        return res.json({
            Status: '200',
            message: 'Update time shift info successful'
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const updateWeekShift = async (req, res, err) =>{
    const{weekShiftID, monday, tuesday, wednesday, thursday, friday, saturday, sunday} = req.body;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    const sql = `UPDATE default_week_shift SET monday = "${monday}", tuesday = "${tuesday}",
    wednesday = "${wednesday}", thursday = "${thursday}", friday = "${friday}", saturday = "${saturday}", sunday = "${sunday}"
     WHERE ltd_id = ${ltdID} AND default_week_shift_id = "${weekShiftID}"`;
    const db = await DB();

    try{
        const [rows] = await db.query(sql);
        return res.json({
            Status: '200',
            message: 'Update week shift info successful'
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}


module.exports = {
    test,
    updateCompanyInfo,
    updateStaffInfo,
    updateDateShift,
    updateTimeShift,
    updateWeekShift
}