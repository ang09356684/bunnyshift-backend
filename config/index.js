//require('dotenv').config({ path: './.env.dev' }) //測試用
require('dotenv').config(); //發布用
const mysql = require('mysql2/promise');

const dbConfig = async () => {
    try{
    const db = await mysql.createConnection({
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
    return db;
    } catch(err){
        console.log(err)
    }
}


module.exports = {
    dbConfig,
}
