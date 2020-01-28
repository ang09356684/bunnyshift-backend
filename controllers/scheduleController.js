const DB = require('../utils/linkDB');
const sqlSolver = require('../utils/sqlSolver');
const jwt = require('jsonwebtoken');
const test = (req, res, next) =>{
    res.send('into scheduleController');
};

// time_shift_name varchar(20) 
// start_time varchar(10) 
// end_time varchar(10) 
// number int(11) 
// ltd_id int(11)

//需要增加批次寫入
//time form 12:32
const setTimeShift = async (req, res, next) =>{

    let body = req.body.data;
    let dateShiftID = req.body.dateShiftID; 
//    let dateShiftID;// use to add shift relationship table
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    let affectedRows;
    let values = [];
    let values2 = [];
    // for(var i = 0; i < body.length; i++){
    //     values.push([body[i].timeShiftName, body[i].startTime
    //         , body[i].endTime, body[i].staffNumber, ltdID]);
    // }

    const checkCompany = `SELECT ltd_id FROM company WHERE ltd_id = "${ltdID}"`;
    const checkdateShiftName = `SELECT date_shift_id, date_shift_name 
    FROM date_shift WHERE date_shift_id = "${dateShiftID}" AND ltd_id = "${ltdID}"`;


    const db = await DB();
    let companyExist = true;
    let dateShiftNameExist = true;


    // check company name
    try {
        const [rows, fields] = await db.query(checkCompany);        
        //console.log('check company exist',rows);//[ TextRow { ltd_id: 1 } ]
        companyExist = !rows.length;//有值是1 加!變boolean false
    }catch(err){
        res.json({
            Status : '400',
            message: 'check company error'
        })
    };

    try {
        // const[rows, fields] = await db.query(checkdateShiftName);
        // console.log('check date shift exist', rows);
        // dateShiftNameExist = !rows.length;
        // dateShiftID = rows[0].date_shift_id;//setting value
        // //拿到班別ID

        if (!companyExist) { //company exist && dateshift exist
            //console.log(body[0]); body exist data why values not???
            for(var i = 0; i < body.length; i++){
                values.push([body[i].timeShiftName, body[i].startTime
                    , body[i].endTime, body[i].staffNumber, ltdID, 1]);
            }

            const [rows3] = await sqlSolver.insertMulti(
                db,
                'time_shift',
                ['time_shift_name', 'start_time','end_time','number','ltd_id', 'in_use'],
                values);
                            
            //const [rows, fields] = await db.query(sql, post);
            //console.log('insert to timeshift',rows3);

            //找出更動欄位數
            affectedRows = rows3.affectedRows;
        } else{
            return res.json({
                Status: '400',
                message: 'Company not exist',
            });
        }
    }catch(err){
        console.log(err);
        return res.json({
            Status : '400',
            message: 'insert timeshift error'
        });
    }

    try{
        //取出加入之後這幾筆資料的ID
        const [rows4] = await sqlSolver.searchLastRows(
            db,
            'time_shift',
            'time_shift_id',
            affectedRows);
        
        //rows 裡面 time_shift_id 拿出並放入values
        //console.log('search last rows', rows4);
        
        for(var i = 0; i < rows4.length; i++){
            values2.push([dateShiftID, rows4[i].time_shift_id]);
        }          
        //console.log(values2);  
    }catch(err){
        return res.json({
            Status : '400',
            message: 'search last rows error'
        });
    }
    
    try{
        // setting shift relationship table
        //timeshifID && dateshiftID
        const [rows5] = await sqlSolver.insertMulti(
            db,
            'shift_relationship',
            ['date_shift_id', 'time_shift_id'],
            values2);
        //console.log('insert to shift_relationship',rows5);

        return res.json({
            Status: '200',
            message: 'Set time shift successful',
        });
        
        
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}


// monday varchar(5) 
// tuesday varchar(5) 
// wednesday varchar(5) 
// thursday varchar(5) 
// friday varchar(5) 
// saturday varchar(5) 
// sunday varchar(5) 
// ltd_id int(11)

//要先方法回傳給前端所有dateName 顯示在螢幕上
//才能進來

//單筆
const setWeekShift = async (req, res, next) => {
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday} = req.body
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    console.log("ltdID", ltdID)
    const post = {monday, tuesday, wednesday, thursday, friday, saturday, sunday,ltd_id: ltdID};
    const checkCompany = `SELECT ltd_id FROM company WHERE ltd_id = "${ltdID}"`;
    const sql = `INSERT INTO default_week_shift SET ?`;

    const db = await DB();
    let isValid = true;
    // check company exist
    try {
        const [rows, fields] = await db.query(checkCompany);
        console.log("in try", rows);
        isValid = !rows.length//有值是1 加!變boolean false
        if (!isValid) { //company exist
            const [rows, fields] = await db.query(sql, post);
            console.log(rows);
            return res.json({
                Status: '200',
                message: 'Set default week shift successful',
            });
        } else{
            return res.json({
                Status: '400',
                message: 'Company not seixt',
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

const setDateShift = async (req, res, next) => {
    //console.log(req.body);
    let body = req.body.data;
    //console.log(body);
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    //如果格式有問題 應該要回傳

    let values = [];
    //將資料取出轉成array
    for(var i = 0; i < body.length; i++){
        values.push([body[i].dateShiftName, ltdID, 1]);
    }
    const checkCompany = `SELECT ltd_id FROM company WHERE ltd_id = "${ltdID}"`;
   // const sql = `INSERT INTO date_shift(date_shift_name, ltd_id) VALUES ?`;

    const db = await DB();
    let isValid = true;
    // check company exist
    try {
        const [rows1, fields] = await db.query(checkCompany, values);
        isValid = !rows1.length//有值是1 加!變boolean false
        if (!isValid) { //company exist
            //傳入(db, table name, 欄位名稱[col1,col2,... ], dataarray)
            const [rows1, fields] = await sqlSolver.insertMulti(
                db,
                'date_shift',
                ['date_shift_name', 'ltd_id','in_use'],
                values);
            // const [rows, fields] = await db.query(sql, [values]);
            //console.log(rows);
            let affectedRows = rows1.affectedRows;
            const [rows2] = await sqlSolver.searchLastRows(
                db,
                'date_shift',
                'date_shift_id',
                affectedRows);
                rows = [];
                for(var i = 0; i < rows2.length; i++){
                    rows.push({"dateShiftID" : rows2[i].date_shift_id, "dateShiftName": rows2[i].date_shift_name,
                "ltdID": rows2[i].ltd_id});
                }
                
            return res.json({
                Status: '200',
                message: 'Set date shift successful',
                rows
            });
        } else{
            return res.json({
                Status: '400',
                message: 'Company not seixt',
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

///要修改處 拿掉輸入token
const setSchedule = async (req, res, err) => {
    console.log(req.body);
    let body = req.body.data;
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, 'bunnyshiftkey');
    const ltdID = decoded.id;
    let values = [];
//////先用SRID去搜尋資料


    for(var i = 0; i < body.length; i++){
        values.push([body[i].dateID, body[i].dateShiftName,body[i].timeShiftName,
            body[i].startTime, body[i].endTime, body[i].staffNumber, ltdID]);        
    }
    const checkCompany = `SELECT ltd_id FROM company WHERE ltd_id = "${ltdID}"`;

    const db = await DB();
    let isValid = true;
    // check company exist
    try {
        const [rows, fields] = await db.query(checkCompany, values);
        isValid = !rows.length//有值是1 加!變boolean false
        console.log(rows);
        if (!isValid) { //company exist
            //傳入(db, table name, 欄位名稱[col1,col2,... ], dataarray)
            const [rows, fields] = await sqlSolver.insertMulti(
                db,
                'ltd_schedule',
                ['date_id', 'date_shift_name','time_shift_name','start_time','end_time','number', 'ltd_id'],
                values);
            // const [rows, fields] = await db.query(sql, [values]);
            console.log(rows);
            return res.json({
                Status: '200',
                message: 'Set schedule successful',
            });
        } else{            
            return res.json({
                Status: '400',
                message: 'Company not seixt',
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

const setWorker = async (req, res, err) => {
    let body = req.body.data;
    let values = [];
    for(var i = 0; i < body.length; i++){
        values.push([body[i].scheduleID, body[i].staffID]);        
    }
    const db = await DB();
    try {
        const [rows, fields] = await sqlSolver.insertMulti(
            db,
            'staff_ltd_schedule_relationship',
            ['ltd_schedule_id', 'staff_id'],
            values);
        // const [rows, fields] = await db.query(sql, [values]);
        console.log(rows);
        return res.json({
            Status: '200',
            message: 'Set woker successful',
        });
    } catch (err) {
        return res.json({
            Status: '400',
            message: 'Set worker failure',
        }); 
    }
}

const setLeave = async (req, res, err) => {
    const{ltdScheduleID, staffID} = req.body;
    const post = {ltd_schedule_id: ltdScheduleID, staff_id: staffID};
    const sql = `INSERT INTO leave_application SET ?`;
    const db = await DB();
    try {
        const [rows, fields] = await db.query(sql, post);
        return res.json({
            Status: '200',
            message: 'Staff set leave successful',
        });
    } catch (err) {
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Staff set leave  failure',
        }); 
    }
}

const deleteDateShift = async (req, res, err) => {
    const{dateShiftID} = req.body;
    const deleteShiftRelationship = `DELETE FROM shift_relationship WHERE date_shift_id = "${dateShiftID}"`;
    const sql = `UPDATE date_shift SET in_use = "0" WHERE date_shift_id = "${dateShiftID}"`;
    const db = await DB();

    try{
        const [rows, fields] = await db.query(sql);
        const [rows2] = await db.query(deleteShiftRelationship);
        return res.json({
            Status: '200',
            message: 'you delete a date shift'
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const deleteTimeShift = async (req, res, err) => {
    const{timeShiftID} = req.body;
    const deleteShiftRelationship = `DELETE FROM shift_relationship WHERE time_shift_id = "${timeShiftID}"`;
    const sql = `UPDATE time_shift SET in_use = "0" WHERE time_shift_id = "${timeShiftID}"`;
    const db = await DB();

    try{
        const [rows, fields] = await db.query(sql);
        const [rows2] = await db.query(deleteShiftRelationship);
        return res.json({
            Status: '200',
            message: 'you delete a time shift'
        })
    }catch(err){
        console.log(err);
        return res.json({
            Status: '400',
            message: 'Something Wrong...',
        });
    }
}

const removeWorkerinSchedule = async (req,res,err) =>{
    const {ltdScheduleID, staffID } = req.body;
    const deleteShiftRelationship = `DELETE FROM staff_ltd_schedule_relationship 
    WHERE ltd_schedule_id = "${ltdScheduleID}" AND staff_id = ${staffID}`;
    const db = await DB();
    try{
        const [rows] = await db.query(deleteShiftRelationship);
        return res.json({
            Status: '200',
            message: 'remove successful'
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
    setDateShift,
    setTimeShift,
    setWeekShift,
    setSchedule,
    setWorker,
    setLeave,
    deleteDateShift,
    deleteTimeShift,
    removeWorkerinSchedule
}
