function SQLException(message) {
    this.message = message;
    this.name = 'SQLException';
 }

const insertMulti = async (db, tableName, cols, values) => {
    if(tableName === undefined
        || cols === undefined
        || values === undefined){
        throw new SQLException('BadRequest');
    }
    // 原本寫法const sql = `INSERT INTO date_shift(date_shift_name, ltd_id) VALUES ?`;
    //將欄位名稱拆開加入SQL 指令
    let sql = `INSERT INTO ${tableName}(`;
    sql += cols[0];
    for(let i=1;i<cols.length;i++){
        sql += ',' + cols[i];
    }
    sql += ') VALUES ?';
    const data = await db.query(sql, [values]);
    return data;
}


const searchLastRows = async(db, tableName, columnID, limitNum) => {
    if(tableName === undefined
        || columnID === undefined
        || limitNum === undefined){
        throw new SQLException('BadRequest');
    }
   let sql =  `SELECT * FROM (SELECT * FROM ${tableName} ORDER BY ${columnID} DESC LIMIT ${limitNum})tmp ORDER BY ${columnID}`;
   const data = await db.query(sql);
   return data;
}

module.exports = {
    insertMulti,
    searchLastRows
}