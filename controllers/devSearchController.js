const DB = require('../utils/linkDB');
const test = (req, res, next) =>{
    res.send('into devSearchController');
};

const company = async (req, res, next) =>{
    const search = `SELECT * FROM company`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        console.log(rows);
        return res.json({
            Status: '200',
            rows: rows
        });
    } catch (err) {
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const staff = async (req, res, next) => {
    const search = `SELECT * FROM staff`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        console.log(rows);
        return res.json({
            Status: '200',
            rows:rows
        });
    } catch (err) {
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const dateShift = async (req, res, next) =>{
    const search = `SELECT * FROM date_shift`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        console.log(rows);
        return res.json({
            Status: '200',
            rows: rows
        });
    } catch (err) {
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}


const timeShift = async (req, res, next) =>{
    const search = `SELECT * FROM time_shift`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        console.log(rows);
        return res.json({
            Status: '200',
            rows: rows
        });
    } catch (err) {
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

module.exports = {
    test,
    company,
    staff,
    dateShift,
    timeShift,
}
