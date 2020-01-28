const DB = require('../utils/linkDB');
const jwt = require('jsonwebtoken');
const test = (req, res, next) =>{
    res.send('into searchController');
};


const companySelfInfo = async (req, res, next) =>{
    const token = req.headers['authorization'];
    let decoded = jwt.verify(token, 'bunnyshiftkey');
    let ltdID = decoded.id;
    const search = `SELECT ltd_id AS ltdID, ltd_name AS ltdName, ltd_account AS ltdAccount,
    ltd_password AS ltdPassword, ltd_number AS ltdNumber, address, tax_id AS taxID FROM company WHERE ltd_id = "${ltdID}"`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        return res.json({
            Status: '200',
            rows: rows
        });
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}


const staffSelfInfo = async (req, res, next) => {
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const staffID = decoded.id;
    const search = `SELECT staff_id AS staffID, staff_name AS staffName, staff_account AS staffAccount,
    staff_password AS staffPassword, authority, supervisor, staff_number AS staffNumber, ltd_id AS ltdID
     FROM staff WHERE staff_id = "${staffID}"`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        console.log(rows);
        return res.json({
            Status: '200',
            rows:rows
        });
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const staffInfoByCompany = async (req, res, next) =>{
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    const search = `SELECT staff_id AS staffID , staff_name AS staffName, staff_number AS staffNumber
     FROM staff WHERE ltd_id = "${ltdID}" AND in_use = 1`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        console.log(rows);
        return res.json({
            Status: '200',
            rows: rows
        });
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}    


const dateShiftByCompany = async (req, res, next) =>{
    // let ltdID = req.params.ltdID;
    // //let ltdID = req.body.ltdID;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    console.log(ltdID);
    const search = `SELECT date_shift_id AS dateShiftID, date_shift_name AS dateShiftName FROM date_shift WHERE ltd_id = "${ltdID}" AND in_use = 1`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        console.log(rows);
        return res.json({
            Status: '200',
            rows
        });
    } catch (err) {
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const timeShiftByCompany = async (req, res, next) =>{
    // let ltdID = req.params.ltdID;
    // //let ltdID = req.body.ltdID;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
   // console.log(ltdID);
    const search = `SELECT time_shift_id AS timeShiftID, time_shift_name AS timeShiftName, start_time AS startTime,
     end_time AS endTime, number FROM time_shift WHERE ltd_id = "${ltdID}" AND in_use = 1`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        console.log(rows);
        return res.json({
            Status: '200',
            rows
        });
    } catch (err) {
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const weekShiftByCompany = async (req, res, next) =>{
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;

    const search = `SELECT default_week_shift_id AS weekShiftID, monday.date_shift_name AS monday, tuesday.date_shift_name AS tuesday,
    wednesday.date_shift_name AS wednesday, thursday.date_shift_name AS thursday, friday.date_shift_name AS friday,
    saturday.date_shift_name AS saturday, sunday.date_shift_name AS sunday
     FROM (((((( default_week_shift 
    INNER JOIN date_shift AS monday ON default_week_shift.monday = monday.date_shift_id)
    INNER JOIN date_shift AS tuesday ON default_week_shift.tuesday = tuesday.date_shift_id)
    INNER JOIN date_shift AS wednesday ON default_week_shift.wednesday = wednesday.date_shift_id)
    INNER JOIN date_shift AS thursday ON default_week_shift.thursday = thursday.date_shift_id)
    INNER JOIN date_shift AS friday ON default_week_shift.friday = friday.date_shift_id)
    INNER JOIN date_shift AS saturday ON default_week_shift.saturday = saturday.date_shift_id)
    INNER JOIN date_shift AS sunday ON default_week_shift.sunday = sunday.date_shift_id WHERE default_week_shift.ltd_id = "${ltdID}"`; 
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

const shiftByCompany = async (req, res, next) =>{
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    console.log(ltdID);
    const search = `SELECT shift_relationship.sr_id AS srID, date_shift.date_shift_name AS dateShiftName,
     time_shift.time_shift_name AS timeShiftName, time_shift.start_time AS startTime, time_shift.end_time AS endTime,
      time_shift.number AS number, company.ltd_name AS ltdName
    FROM (
        (shift_relationship INNER JOIN  date_shift ON shift_relationship.date_shift_id = date_shift.date_shift_id ) 
        INNER JOIN  time_shift ON shift_relationship.time_shift_id = time_shift.time_shift_id)
    INNER JOIN company ON  time_shift.ltd_id = company.ltd_id WHERE company.ltd_id = "${ltdID}"`;

    //const search = `SELECT date_shift_id ,date_shift_name FROM date_shift WHERE ltd_id = "${ltdID}"`; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        console.log(rows);
        return res.json({
            Status: '200',
            rows
        });
    } catch (err) {
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const shiftAndStaffInfo = async (req, res, next) =>{
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    //console.log(ltdID);
    const searchStaff = `SELECT staff_id AS staffID, staff_name AS staffName, staff_number AS staffNumber FROM staff WHERE ltd_id = "${ltdID}" AND in_use = 1`; 
    const searchShift = `SELECT shift_relationship.sr_id AS srID, date_shift.date_shift_name AS shiftName,
     time_shift.time_shift_name AS timeShiftName, time_shift.start_time AS startTime, time_shift.end_time AS endTime,
      time_shift.number AS number, company.ltd_name AS ltdName
    FROM (
        (shift_relationship INNER JOIN  date_shift ON shift_relationship.date_shift_id = date_shift.date_shift_id ) 
        INNER JOIN  time_shift ON shift_relationship.time_shift_id = time_shift.time_shift_id)
    INNER JOIN company ON  time_shift.ltd_id = company.ltd_id WHERE company.ltd_id = "${ltdID}"`;

    //const search = `SELECT date_shift_id ,date_shift_name FROM date_shift WHERE ltd_id = "${ltdID}"`; 
    const db = await DB();
    try {
        const [shiftInfo] = await db.query(searchShift);
        const [staffInfo] = await db.query(searchStaff);
        return res.json({
            Status: '200',
            staffInfo,
            shiftInfo
        });
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const calendar = async (req, res, next) =>{
    let year = req.params.year;
    let month = req.params.month;
    //console.log(year, month);
    const search = `SELECT date_id AS dateID, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM calendar_date WHERE year = ${year} AND month = ${month}`; 
    // 將date欄位轉成yyyy-mm-dd的格式再回傳
    // let date = req.body.date;
    // const search = `SELECT calendar_date_id, date FROM calendar_date WHERE date = ${date} `; 
    const db = await DB();
    try {
        const [rows, fields] = await db.query(search);
        //console.log(rows);
        return res.json({
            Status: '200',
            rows
        });
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const preSchedule = async (req, res, err) =>{
    let year = req.params.year;
    let month = req.params.month;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;

    const search =  `SELECT ltd_schedule_id AS ltdScheduleID, DATE_FORMAT(date, '%Y-%m-%d') AS date, dayofweek AS dayOfWeek, date_shift_name AS dateShiftName,
     time_shift_name AS timeShiftName, start_time AS startTime, end_time AS endTime, number FROM (
        ltd_schedule INNER JOIN calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
        WHERE ltd_schedule.ltd_id = ${ltdID} AND year = ${year} AND month = ${month}  ORDER BY bunnyshift.ltd_schedule.date_id`;

        const db = await DB();
        try {
            const [rows, fields] = await db.query(search);
            //console.log(rows);
            return res.json({
                Status: '200',
                rows
            });
        } catch (err) {
            console.log(err);
            return res.json({
                Status: '400',
                message: 'Something Wrong...',
            });
        }
}


const schedule = async (req, res, err) =>{
    const year = req.params.year;
    const month = req.params.month;
    const ltdID = req.params.ltdID;
    //console.log("year ", year, "month ", month ,"ltdID ", ltdID)
    const search = `SELECT ltd_schedule.ltd_schedule_id AS ltdScheduleID, DATE_FORMAT(date, '%Y-%m-%d') AS date, dayofweek AS dayOfWeek,
    date_shift_name AS dateShiftName, time_shift_name AS timeShiftName, start_time AS startTime, end_time AS endTime, number,
     staff.staff_name AS staffName FROM (
       (bunnyshift.ltd_schedule INNER JOIN bunnyshift.calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
       INNER JOIN bunnyshift.staff_ltd_schedule_relationship ON ltd_schedule.ltd_schedule_id = staff_ltd_schedule_relationship.ltd_schedule_id)
       INNER JOIN bunnyshift.staff ON staff_ltd_schedule_relationship.staff_id = staff.staff_id WHERE ltd_schedule.ltd_id = "${ltdID}" AND calendar_date.year = "${year}" AND calendar_date.month = "${month}" ORDER BY bunnyshift.ltd_schedule.date_id`;
        
        const db = await DB();
        try {
            const [rows, fields] = await db.query(search);
            console.log(rows);
            return res.json({
                Status: '200',
                into:"schedule",
                rows
            });
        } catch (err) {
            console.log(err);
            return res.json({
                Status: '400',
                message: 'Something Wrong...',
            });
        }
}

const scheduleByDate = async (req, res, err) =>{
    let dateID = req.params.dateID;
    const ltdID = req.params.ltdID;
    const search =   `SELECT ltd_schedule.ltd_schedule_id AS ltdScheduleID, DATE_FORMAT(date, '%Y-%m-%d') AS date, dayofweek AS dayOfWeek,
     date_shift_name AS dateShiftName, time_shift_name AS timeShiftName, start_time AS startTime, end_time AS endTime,
      number, staff.staff_name AS staffName FROM (
        (bunnyshift.ltd_schedule INNER JOIN bunnyshift.calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
        INNER JOIN bunnyshift.staff_ltd_schedule_relationship ON ltd_schedule.ltd_schedule_id = staff_ltd_schedule_relationship.ltd_schedule_id)
        INNER JOIN bunnyshift.staff ON staff_ltd_schedule_relationship.staff_id = staff.staff_id WHERE ltd_schedule.ltd_id = ${ltdID} AND ltd_schedule.date_id = "${dateID}"`;
        
        const db = await DB();
        try {
            const [rows, fields] = await db.query(search);
            console.log(rows);
            return res.json({
                Status: '200',
                rows
            });
        } catch (err) {
            console.log(err);
            return res.json({
                Status: '400',
                message: 'Something Wrong...',
            });
        }
}

const scheduleByStaff = async (req, res, err) =>{
    let year = req.params.year;
    let month = req.params.month;
    let ltdID = req.params.ltdID;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const staffID = decoded.id;

    const search =   `SELECT ltd_schedule.ltd_schedule_id AS ltdScheduleID, DATE_FORMAT(date, '%Y-%m-%d') AS date,
     dayofweek AS dayOfWeek, date_shift_name AS dateShiftName, time_shift_name AS timeShiftName, start_time AS startTime,
      end_time AS endTime, number, staff.staff_name AS staffName FROM (
        (bunnyshift.ltd_schedule INNER JOIN bunnyshift.calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
        INNER JOIN bunnyshift.staff_ltd_schedule_relationship ON ltd_schedule.ltd_schedule_id = staff_ltd_schedule_relationship.ltd_schedule_id)
        INNER JOIN bunnyshift.staff ON staff_ltd_schedule_relationship.staff_id = staff.staff_id WHERE ltd_schedule.ltd_id = ${ltdID} AND year = ${year} AND month = ${month} AND staff.staff_id = ${staffID} ORDER BY bunnyshift.ltd_schedule.date_id`;

        const db = await DB();
        try {
            const [rows, fields] = await db.query(search);
            console.log(rows);
            return res.json({
                Status: '200',
                rows
            });
        } catch (err) {
            console.log(err);
            return res.json({
                Status: '400',
                message: 'Something Wrong...',
            });
        }
}

const leaveList = async (req, res, err) =>{
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;

    const search =   `SELECT ltd_schedule.ltd_schedule_id AS ltdScheduleID, DATE_FORMAT(date, '%Y-%m-%d') AS date, dayofweek AS dayOfWeek,
     date_shift_name AS dateShiftName, time_shift_name AS timeShiftName, start_time AS startTime, end_time AS endTime,
      staff.staff_name AS staffName FROM ((
        ltd_schedule INNER JOIN calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
        INNER JOIN leave_application ON ltd_schedule.ltd_schedule_id = leave_application.ltd_schedule_id)
        INNER JOIN staff ON leave_application.staff_id = staff.staff_id WHERE ltd_schedule.ltd_id = ${ltdID} ORDER BY bunnyshift.ltd_schedule.date_id`;

        const db = await DB();
        try {
            const [rows, fields] = await db.query(search);
            console.log(rows);
            return res.json({
                Status: '200',
                rows
            });
        } catch (err) {
            console.log(err);
            return res.json({
                Status: '400',
                message: 'Something Wrong...',
            });
        }
}

const leaveListByStaff = async (req, res, err) =>{
    let ltdID = req.params.ltdID;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const staffID = decoded.id;
    //console.log("ltdID ", ltdID, "staffID ", staffID)
    const search =`SELECT ltd_schedule.ltd_schedule_id AS ltdScheduleID, DATE_FORMAT(date, '%Y-%m-%d') AS date,
    dayofweek AS dayOfWeek, date_shift_name AS dateShiftName, time_shift_name AS timeShiftName, start_time AS startTime,
     end_time AS endTime, staff.staff_name AS staffName FROM ((
       ltd_schedule INNER JOIN calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
       INNER JOIN leave_application ON ltd_schedule.ltd_schedule_id = leave_application.ltd_schedule_id)
       INNER JOIN staff ON leave_application.staff_id = staff.staff_id WHERE ltd_schedule.ltd_id = "${ltdID}" AND staff.staff_id = "${staffID}" ORDER BY bunnyshift.ltd_schedule.date_id`;

        const db = await DB();
        try {
            const [rows, fields] = await db.query(search);
            //console.log(rows);
            return res.json({
                Status: '200',
                rows
            });
        } catch (err) {
            console.log(err);
            return res.json({
                Status: '400',
                message: 'Something Wrong...',
            });
        }
}
// 
module.exports = {
    test,
    companySelfInfo,
    staffSelfInfo,
    staffInfoByCompany,
    dateShiftByCompany,
    timeShiftByCompany,
    weekShiftByCompany,
    shiftByCompany,
    shiftAndStaffInfo,
    calendar,
    preSchedule,
    schedule,
    scheduleByDate,
    scheduleByStaff,
    leaveList,
    leaveListByStaff
}
