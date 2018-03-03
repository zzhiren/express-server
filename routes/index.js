var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var multipartMiddleware = multipart();
var common = require('./common');
const checkToken = require('../token/checkToken');

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Hello' });
  res.sendfile("./public/zzhiren/index.html");
});
router.get('/admin', function (req, res, next) {
  // res.render('index', { title: 'Hello' });
  res.sendfile("./public/admin/index.html");
});

// 登陆api
router.post('/login', common.login);

// 上传图片api
router.post('/uplodimg', checkToken, common.uploadImg);

// 删除图片api
router.post('/deleteimg', checkToken, common.deleteImg);

// 保存博客api
router.post('/saveblog', checkToken, common.saveBlog);

// 获取博客详情
router.post('/getblogdetils', common.getBlogDetils);

// 删除博客数据
router.post('/deleteblog', common.deleteBlog);

// 获取博客列表数据
router.get('/getallblogs', checkToken, common.getAllBlogs);

router.get('/getpostedblogs', common.getPostedBlogs);

router.get('/getdraftblogs', checkToken, common.getDraftBlogs);
router.get('/getpostedblogsbytag', common.getBlogByTag);

// 搜索NPM
router.get('/searchnpm', common.searchNPM);

// 获取用户信息
router.post('/getuserinformation', checkToken, common.getUserInformation);

// 配置用户信息
router.post('/setuserinformation', checkToken, common.setUserInformation);

// 更改博客状态：已发布 未发布
router.post('/changeblogstate', checkToken, common.changeBlogState);

// 添加github项目
router.post('/addgithubproject', checkToken, common.addGitHubProject);

// 删除GitHub项目
router.get('/deletegithubproject', checkToken, common.deleteGitHubProject);

// 前端获取github项目数据
router.get('/getgithubproject', common.getGitHubProject);

// 前端获取头像列表
router.get('/getavatarlist', common.getAvatarList);

// 添加评论
router.post('/addcomment', common.addComment);

// 获取评论
router.get('/getcomments', common.getComments);

// 浏览者给博客添加喜欢标签
router.get('/addlove', common.addLove);

// 获取标签
router.get('/gettag', common.getTag);

// 保存标签
router.post('/savetag', checkToken, common.saveTag);

// 删除标签
router.get('/deletetag', checkToken, common.deleteTag)

module.exports = router;
