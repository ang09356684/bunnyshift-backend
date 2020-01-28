const express = require('express');
const bodyParser = require('body-parser');
//const mongoose = require('mongoose');
const app = express();

const router = require('./routes');

app.use(bodyParser.json());//允許json格式
app.use(bodyParser.urlencoded({extended:false}));//允許x-www-form-urlencoded


//test
app.get('/', (req, res, next) => { 
    res.send('start test');
});

app.use('/api', router);

//開一個能夠接受get請求的接口 lamda(requset, response, next) 是給 {}裡面的內容的
//req就是收到的東西轉成json檔的物件
/*
app.get('/api',(req, res, next) => { //網址上輸入api會進入此區域
    res.send('test');
});

app.get('/api2',(req, res, next) => { //網址上輸入api會進入此區域
    res.send('testtest');
});




/////////other
//Create DB;
/*
app.get('/createdb', (req, res) =>{
    let sql = `CREATE DATABASE nodemysql`;
    db.query(sql, (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send('database created...');
    });
});

//Create table
app.get('/createpoststable', (req,res) =>{
    let sql = `CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))`;
    db.query(sql, (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send('Posts table created...')
    })
});

//Insert post
app.get('/addpost1', (req,res) =>{
    let post = {title: 'Post One', body:'This is post number one'};
    let sql = `INSERT INTO posts SET ?`;
    let query = db.query(sql, post, (err,result) =>{
        if(err) throw err;
        console.log(result);
        res.send('Post 1 added...');
    });
});

app.get('/addpost2', (req,res) =>{
    let post = {title: 'Post Two', body:'This is post number two'};
    let sql = `INSERT INTO posts SET ?`;
    let query = db.query(sql, post, (err,result) =>{
        if(err) throw err;
        console.log(result);
        res.send('Post 2 added...');
    });
});

//Select single post by id
app.get('/getpost/:id', (req, res) =>{
    let sql = `SELECT *  FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err,result) =>{
        if(err) throw err;
        console.log(result);//
        res.send('Post fetched...');
        });
    });

    //Update post
app.get('/updatepost/:id', (req, res) =>{
    let newTitle = 'Updated Title';
    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err,result) =>{
        if(err) throw err;
        console.log(result);
        res.send('Post update...');
        });
    });

*/

app.listen('3000', () =>{
    console.log("server started on port 3000");
});
