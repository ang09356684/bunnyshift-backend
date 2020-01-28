body = [{account: 'aaa', passowrd: 'aaa'}, {account: 'bbb', passowrd: 'bbb'}, {account: 'ccc', passowrd: 'ccc'}];

body.length();
let values = [];
for( var i = 0; i < body.length; i++){
	values.push(body[i].account, bod[i].passowrd);
}
sql, values

test(body);

con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    if(result && result.length>0) {
        var sql = "INSERT INTO customers (name, address) VALUES ?";
        var values = [];
        for (var i = 0; i < result.length; i++) {
            values.push([result[i].username, result[i].id]);
        }
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log(" Number of records inserted: " + result.affectedRows);
        });
    }
    else{
        console.log("No data found")
    }