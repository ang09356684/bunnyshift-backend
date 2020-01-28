const jwt = require('jsonwebtoken');

const getToken = (data, res) =>{
    return new Promise((resolve, reject) => {
        //  console.log("auth",data);
        //  console.log(data[0]);
        //  console.log(data[1]);

        jwt.sign({id: data[0], account:data[1], ltdID: data[2]}, 'bunnyshiftkey', { expiresIn: '7d' }, (err, token) => {
            if(err){
                return reject(err);//失敗並結束Promise回傳
            }
             console.log('getToken',token);
            resolve(token);//完成 並把token打包已promise型態回傳
            //return resolve(token);
        });
    })
}

function verifyToken (req, res, next) {

     const token = req.headers['authorization'];

    if(typeof token !== 'undefined') {
        try{
            var decoded = jwt.verify(token, 'bunnyshiftkey');
            //console.log('in try',decoded);//有印出 payload內容 { account: 'aaa', iat: 1579187068, exp: 1579230268 }
            //console.log(decoded.account);
            next();
        }catch(err){
            console.log(err);
            return res.json({
                Status: '403',
                message: 'token verify failure...'
            })
        }
    } else {
      // Forbidden
        return res.json({
            Status: '403',
            message: 'token not exist...',
        });
    }
}

module.exports = {
    getToken,
    verifyToken
}