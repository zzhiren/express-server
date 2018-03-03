var User = require('./../models/user');
// 监测 token 是否过期
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  // console.log('authorr', req.headers.authorization)
  if (req.headers.authorization) {
    let token = req.headers.authorization;

    // 解构 token，生成一个对象 { name: xx, iat: xx, exp: xx }
    // console.log(`token ${token}`)
    let decoded = jwt.decode(token)
    // console.log(11111)
    // console.log(`decoded ${decoded}`)
    // console.log(decoded)
    // 监测 token 是否过期
    if (token && decoded.exp <= Date.now() / 1000) {
      return res.json({
        code: 401,
        token: false,
        msg: 'token过期，请重新登录'
      })
    } else {
      // return res.json({
      //   token: true
      // })
      next();

    }
  }

  // next();
}