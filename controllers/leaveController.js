const DB = require('../utils/linkDB');
const jwt = require('jsonwebtoken');
const test = (req, res, next) =>{
    res.send('into leaveController');
};


const leaveNeedDeputy = async (req, res, err) =>{// 測試完
    // 從token 包含 id  account
    //ex { id: 1, account: 'Astaff', iat: 1579245594, exp: 1579288794 }
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const staffID = decoded.id;

    const {ltdScheduleID, time, deputyID, approverLtdID} = req.body;
    const post = {ltd_schedule_id: ltdScheduleID, staff_id: staffID,
         submit_time: time, deputy: deputyID, approver_ltd_id: approverLtdID, status_id: 1};
    const sql = `INSERT INTO cover_application SET ?`; 
    const db = await DB();
    try{
        const [rows, fields] = await db.query(sql,post);
        return res.json({
            Status: '200',
            message: 'you submit a cover application',
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const leaveWithoutDeputy = async (req, res, err) =>{//
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const staffID = decoded.id;

    const {ltdScheduleID, time, approverLtdID} = req.body;
    const post = {ltd_schedule_id: ltdScheduleID, staff_id: staffID,
        submit_time: time, approver_ltd_id: approverLtdID, status_id: 2};
    const sql = `INSERT INTO cover_application SET ?`; 
    const db = await DB();
    try{
        const [rows, fields] = await db.query(sql,post);
        return res.json({
            Status: '200',
            message: 'you submit a leave application',
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

//公司看所有請假紀錄
const checkAllLeaveInfoByCompany = async (req, res, err) =>{
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;

    const sql = `SELECT leave_id AS leaveID, staff.staff_name AS staffName, submit_time AS submitTime, deputy.staff_name AS deputy, DATE_FORMAT(calendar_date.date, '%Y-%m-%d') AS  date,
     date_shift_name AS dateShiftName, dayofweek AS dayOfWeek, 
    date_shift_name AS dateShiftName, time_shift_name AS timeShiftName, start_time AS startTime, end_time AS endTime, status_name AS statusName FROM ((((
    (cover_application LEFT JOIN staff ON cover_application.staff_id = staff.staff_id)
    LEFT JOIN staff AS deputy ON cover_application.deputy = deputy.staff_id)
    INNER JOIN ltd_schedule ON ltd_schedule.ltd_schedule_id = cover_application.ltd_schedule_id)
    INNER JOIN calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
    INNER JOIN status  ON cover_application.status_id = status.status_id)
    WHERE approver_ltd_id = "${ltdID}" ORDER BY bunnyshift.ltd_schedule.date_id`;
    const db = await DB();
    try{
        const [rows, fields] = await db.query(sql);
        return res.json({
            Status: '200',
            rows
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}


//只看公司需要核准的請假資料
const checkLeaveInfoByCompany = async (req, res, err) =>{
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;

    const sql =   `SELECT leave_id AS leaveID, staff.staff_name AS staffName, submit_time AS submitTime, deputy.staff_name AS deputy, DATE_FORMAT(calendar_date.date, '%Y-%m-%d') AS  date,
     date_shift_name AS dateShiftName, dayofweek AS dayOfWeek, 
    date_shift_name AS dateShiftName, time_shift_name AS timeShiftName, start_time AS startTime, end_time AS endTime, status_name AS statusName FROM ((((
    (cover_application LEFT JOIN staff ON cover_application.staff_id = staff.staff_id)
    LEFT JOIN staff AS deputy ON cover_application.deputy = deputy.staff_id)
    INNER JOIN ltd_schedule ON ltd_schedule.ltd_schedule_id = cover_application.ltd_schedule_id)
    INNER JOIN calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
    INNER JOIN status  ON cover_application.status_id = status.status_id)
    WHERE approver_ltd_id = "${ltdID}" AND cover_application.status_id = 2 ORDER BY bunnyshift.ltd_schedule.date_id`;
    const db = await DB();
    try{
        const [rows, fields] = await db.query(sql);
        return res.json({
            Status: '200',
            rows
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}


//公司核准與否
//要更換班表
const companyReviewLeave = async (req, res, err) => {
    const {leaveID, reviewed} = req.body;
    let status_id;
    (reviewed === "true")?status_id = 3: status_id = 4;
    const search = `SELECT * FROM cover_application WHERE leave_id = "${leaveID}"`
    const sql = `UPDATE cover_application SET status_id = "${status_id}" WHERE leave_id = "${leaveID}";`
    const db = await DB();
    
    try{
        const [rows] = await db.query(sql);//寫假表狀態
        if(reviewed === "true"){
            const[info, fields] = await db.query(search);
            // console.log("true info",info);
            // console.log("true info row",info[0].leave_id);
            staffID = info[0].staff_id;
            ltdScheduleID = info[0].ltd_schedule_id;
            //上面用來查sisr這張表
            deputyStaff = info[0].deputy;

            const sisrUpdate = `UPDATE staff_ltd_schedule_relationship SET staff_id = "${deputyStaff}"
            WHERE staff_id = "${staffID}" AND ltd_schedule_id = "${ltdScheduleID}"`;
            const [data] = await db.query(sisrUpdate);//更換班表
            
            return res.json({
                Status: '200',
                message: 'Reviewed leave successful',
            })
         }
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

//員工查詢是否有人要找自己代班 status_id = 1 and deputy = self staff_id
const checkDeputyInfoByStaff = async (req, res, err) =>{
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const deputyID = decoded.id;

    const sql =   `SELECT leave_id AS leaveID, staff.staff_name AS staffName, submit_time AS submitTime, deputy.staff_name AS deputy,
     DATE_FORMAT(calendar_date.date, '%Y-%m-%d') AS  date, date_shift_name AS dateShiftName, dayofweek AS dayOfWeek, 
    date_shift_name AS dateShiftName, time_shift_name AS timeShiftName, start_time AS startTime, end_time AS endTime, status_name AS statusName FROM (((((
    cover_application LEFT JOIN staff ON cover_application.staff_id = staff.staff_id)
    INNER JOIN staff AS deputy ON cover_application.deputy = deputy.staff_id)
    INNER JOIN ltd_schedule ON ltd_schedule.ltd_schedule_id = cover_application.ltd_schedule_id)
    INNER JOIN calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
    INNER JOIN status  ON cover_application.status_id = status.status_id)
	WHERE cover_application.deputy = "${deputyID}" AND cover_application.status_id = 1 ORDER BY bunnyshift.ltd_schedule.date_id;`;
    const db = await DB();
    try{
        const [rows, fields] = await db.query(sql);
        return res.json({
            Status: '200',
            rows
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

//員工回復是否可以代班
const staffReviewDeputy = async (req, res, err) => {
    const {leaveID, reviewed} = req.body;
    let status_id;
    //reviewed 拿到的 ture 或false是字串
    (reviewed === "true")?status_id = 2: status_id = 4;
    const sql = `UPDATE cover_application SET status_id = "${status_id}" WHERE leave_id = "${leaveID}";`
    const db = await DB();
    try{
        const [rows, fields] = await db.query(sql);
        return res.json({
            Status: '200',
            message: 'Reviewed deputy successful',
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

//員工查詢跟自己有關的紀錄 status_id = 1 and deputy = self staff_id
const checkLeaveInfoByStaff = async (req, res, err) =>{
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ID = decoded.id;

    const sql =   `SELECT leave_id AS leaveID, staff.staff_name AS staffName, submit_time AS submitTime, deputy.staff_name AS deputy,
     DATE_FORMAT(calendar_date.date, '%Y-%m-%d') AS  date, date_shift_name AS dateShiftName, dayofweek AS dayOfWeek, 
    date_shift_name AS dateShiftName, time_shift_name AS timeShiftName, start_time AS startTime, end_time AS endTime, status_name AS statusName FROM ((((
    (cover_application LEFT JOIN staff ON cover_application.staff_id = staff.staff_id)
    LEFT JOIN staff AS deputy ON cover_application.deputy = deputy.staff_id)
    INNER JOIN ltd_schedule ON ltd_schedule.ltd_schedule_id = cover_application.ltd_schedule_id)
    INNER JOIN calendar_date ON ltd_schedule.date_id = calendar_date.date_id)
    INNER JOIN status  ON cover_application.status_id = status.status_id)
	WHERE deputy = "${ID}" OR cover_application.staff_id = "${ID}" ORDER BY bunnyshift.ltd_schedule.date_id`;
    const db = await DB();
    try{
        const [rows, fields] = await db.query(sql);
        return res.json({
            Status: '200',
            rows
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const fireStaff = async (req, res, next) => {  
    const{staffID} = req.body;
    const findName = `SELECT staff_name FROM staff WHERE staff_id = "${staffID}"`;
    const sql = `UPDATE staff SET in_use = "0" WHERE staff_id = "${staffID}"`;
    const db = await DB();
    try{
        const [name] = await db.query(findName);
        let staffName = name[0].staff_name;
        const [rows, fields] = await db.query(sql);
        return res.json({
            Status: '200',
            message: 'you fire ' + staffName
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
    leaveNeedDeputy,
    leaveWithoutDeputy,
    checkAllLeaveInfoByCompany,
    checkLeaveInfoByCompany,
    companyReviewLeave,
    checkDeputyInfoByStaff,
    staffReviewDeputy,
    checkLeaveInfoByStaff,
    fireStaff
}