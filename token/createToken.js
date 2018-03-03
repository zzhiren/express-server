// 创建 token
var jwt = require('jsonwebtoken')

module.exports = (name) =>{
    const token = jwt.sign({
            name: name
        },
        'secret', {
            expiresIn: 60*60*24+'s' // 测试时长
        });

    return token;
}