const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const User = require('./../models/user');
const Blog = require('./../models/blog');
const Project = require('./../models/project');
const GitHub = require('./../models/github');
const AvatarList = require('./../models/avatarlist');
const Comment = require('./../models/comment');
const Tag = require('./../models/tag');
const app = require('../app');
const ObjectID = require('mongodb').ObjectID;
const axios = require('axios');
const jwt = require('jsonwebtoken');
const uuid = require('node-uuid');
const createToken = require('../token/createToken');
const checkToken = require('../token/checkToken');
const mongoose = require('mongoose');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.login = (req, res) => {
  let userName = req.body.userName;
  let userPwd = req.body.userPwd
  let param = {
    userName: userName,
    userPwd: userPwd
  }
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      if (doc) {
        if (doc.userName === userName && doc.userPwd === userPwd) {
          let token = createToken(userName);
          doc.token = token;
          doc.save((err) => {
            if (err) {
              console.log(`err ${err}`)
            } else {
              res.json({
                status: '0',
                msg: '',
                result: {
                  userId: doc._id,
                  userName: doc.userName,
                  token: token
                }
              });
            }
          })
        } else {
          res.json({
            status: '1',
            msg: '账号密码错误',
          });
        }

      }
    }
  })
}

/**
 * 上传图片api
 * @param {*请求参数} req
 * @param {*返回参数} res
 */
exports.uploadImg = (req, res) => {
  let form = new formidable.IncomingForm();
  //图片保存目录
  let PIC_PATH = '/blog/';
  form.uploadDir = 'public' + PIC_PATH;
  form.keepExtensions = true;
  function forInFiles(files) {
    let picList = [];
    let picDelObj = {};
    for (let i in files) {
      let path = 'http://www.zzhiren.xyz' + ((files[i].path.slice(6)).split('\\')).join('/');
      let deletPath = 'public/' + ((files[i].path.slice(7)).split('\\')).join('/');
      let array = [i, path];
      picList.push(array);
      picDelObj[i] = {};
      picDelObj[i].mdName = path;
      picDelObj[i].deletePath = deletPath;
    }
    let data = {}
    data.picList = picList;
    data.picDelObj = picDelObj;
    return data;
  };
  form.parse(req, (err, fields, files) => {
    let data = forInFiles(files);
    res.json({
      status: '0',
      msg: '上传成功',
      result: {
        picList: data.picList,
        picDelObj: data.picDelObj
      }
    });
  });
}

/**
 * 删除图片api
 * @param {*请求参数} req
 * @param {*返回参数} res
 */
exports.deleteImg = (req, res) => {
  // fs.unlinkSync(req.body.data)
  fs.unlinkSync(req.body.deletePath)
}

/**
 * 保存博客api
 * @param {*请求参数} req 
 * @param {*返回参数} res 
 */
exports.saveBlog = (req, res) => {

  if (req.body.type === 'edit') {
    let condition = {
      _id: ObjectID(req.body.id)
    }
    let params = {
      title: req.body.title,
      state: req.body.state,
      firstPic: req.body.firstPic,
      tag: req.body.tag,
      content: req.body.content,
      picDelList: req.body.picDelObj,
      preface: req.body.preface,
    }
    Blog.update(condition, params, (err, doc) => {
      if (err) {
        res.json({
          status: "1",
          msg: err.message
        });
      } else {
        res.json({
          status: "0",
          msg: "修改成功"
        });
      }
    })
  } else if (req.body.type === 'create') {
    let param = {
      title: req.body.title,
      state: req.body.state,
      creationTime: req.body.creationTime,
      firstPic: req.body.firstPic,
      tag: req.body.tag,
      content: req.body.content,
      picDelList: req.body.picDelObj,
      preface: req.body.preface,
      eyes: 0,
      love: 0,
      comment: 0
    }
    Blog.create(param, (err, doc) => {
      if (err) {
        res.json({
          status: "1",
          msg: err.message
        });
      } else {
        res.json({
          status: "0",
          msg: "保存成功"
        });
      }
    })
  }

}

// 获取所有blog
exports.getAllBlogs = function (req, res) {
  let skip = (req.query.page - 1) * 10;
  let total = 1
  Blog.find((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      total = doc.length;
      let blogs = Blog.find().skip(skip).limit(10);
      blogs.sort({ 'creationTime': -1 });
      blogs.exec((err, doc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          res.json({
            status: '全部',
            data: doc,
            total: total
          })
        }
      })
    }
  })

}

// 获取发布状态的blog
exports.getPostedBlogs = function (req, res) {
  let params = {
    state: '0'
  }
  let skip = (req.query.page - 1) * 10;
  let total = 1
  Blog.find(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      total = doc.length;
      let blogs = Blog.find(params).skip(skip).limit(11);
      blogs.sort({ 'creationTime': -1 });
      blogs.exec((err, doc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          res.json({
            status: '已发布',
            data: doc,
            total: total
          })
        }
      })
    }
  })
}
// 获取草稿状态的blog
exports.getDraftBlogs = function (req, res) {
  let params = {
    state: '1'
  }
  let skip = (req.query.page - 1) * 10;
  let total = 1
  Blog.find(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      total = doc.length;
      let blogs = Blog.find(params).skip(skip).limit(10);
      blogs.sort({ 'creationTime': -1 });
      blogs.exec((err, doc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          res.json({
            status: '已发布',
            data: doc,
            total: total
          })
        }
      })
    }
  })
}

// 标签分类blog
exports.getBlogByTag = (req, res) => {
  let params = {
    state: '0'
  }
  let tag = req.query.tag;
  let skip = (req.query.page - 1) * 10;
  let total = 1
  Blog.find(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      total = doc.length;
      let blogs = Blog.find({ tag: { $all: [tag] } }).skip(skip).limit(11);
      blogs.sort({ 'creationTime': -1 });
      blogs.exec((err, doc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          res.json({
            status: '已发布',
            data: doc,
            total: total
          })
        }
      })
    }
  })

}
/**
 * 删除博客api
 * @param {*请求参数} req 
 * @param {*返回参数} res 
 */
exports.deleteBlog = function (req, res) {
  let condition = {
    _id: ObjectID(req.body.id)
  }
  Blog.findOne(condition, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      // 删除博客中存在服务器的图片
      if (doc.picDelList != null && doc.picDelList != []) {
        for (let i in doc.picDelList) {
          if (fs.existsSync(doc.picDelList[i]['deletePath'])) {
            fs.unlinkSync(doc.picDelList[i]['deletePath'])
          } else {
            break;
          }
        }
      }
      // 删除博客
      Blog.remove(condition, (err, doc) => {
        if (err) {
          res.json({
            status: "1",
            msg: err.message
          });
        } else {
          res.json({
            status: "0",
            msg: "删除成功！"
          });
        }
      })
    }
  });
}

/**
 * 获取博客详情api
 * @param {*请求参数} req 
 * @param {*返回参数} res 
 */
exports.getBlogDetils = function (req, res) {
  Blog.findById(req.body.id, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      res.json({
        status: "0",
        data: doc
      });
    }
  })
}

/**
 * 搜索npm api
 * @param {*} req 
 * @param {*} res 
 */
exports.searchNPM = function (req, res) {
  let text = req.query.text;
  let from = req.query.from;
  let url = 'https://www.npmjs.com/-/search?text=' + text + '&from=' + from + '&size=10&quality=0&popularity=3&maintenance=0'
  axios.get(url, {
    headers: {
      referer: 'https://www.npmjs.com/search',
      host: 'www.npmjs.com',
      authority: 'www.npmjs.com'
    }
  }).then(response => {
    res.json(response.data)
  }).catch(e => {
    console.log(e)
  })
}

// 获取用户信息接口
exports.getUserInformation = function (req, res) {
  let params = {
    userName: req.body.userName
  }
  User.find(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        data: doc
      })
    }
  })
}

// 配置用户信息接口
exports.setUserInformation = function (req, res) {
  let personalSet = req.body.personalSet
  let params = {
    userName: personalSet.userName,
    motto: personalSet.motto,
    headPortrait: personalSet.headPortrait,
    dsc: personalSet.dsc,
    music: personalSet.music,
    love: personalSet.love,
    email: personalSet.email,
    birthday: personalSet.birthday,
    location: personalSet.location,
  }
  User.update(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '修改成功！'
      })
    }
  })
}

// 更改博客发布状态：已发布 未发布
exports.changeBlogState = function (req, res) {
  let id = {
    _id: ObjectID(req.body.id)
  }
  let params = {
    state: req.body.state
  }
  Blog.update(id, params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '修改成功'
      })
    }
  })
}

// 添加github项目
exports.addGitHubProject = function (req, res) {
  let params = {
    projectName: req.body.projectName,
    projectIcon: req.body.projectIcon,
    star: 0,
    fork: 0,
    issue: 0,
  }
  Project.create(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      let date = new Date();
      let timer = date.getTime().toString();
      let url = 'https://api.github.com/repos/Zzhiren/' + req.body.projectName + '?_' + timer;
      let obj = {};
      axios.get(url).then(res => {
        obj.id = res.data.id;
        obj.name = res.data.name;
        obj.html_url = res.data.html_url;
        obj.description = res.data.description;
        obj.icon = req.body.projectIcon;
        obj.stargazers_count = res.data.stargazers_count;
        obj.forks_count = res.data.forks_count;
        obj.open_issues = res.data.open_issues;
        obj.language = res.data.language;
        createGitHubProject();
        
      })
      function createGitHubProject(){
        GitHub.create(obj, (err, doc) => {
          if (err) {
            res.json({
              status: '1',
              msg: err.message
            })
          } else {
            res.json({
              status: '0',
              msg: '新增成功'
            })
          }
        })
      }
    }
  })
}

// 遍历数据库中的github项目，更新star,fork,issue
exports.updateGitHubProject = () => {
  let axiosAll = [];
  let icon = [];
  Project.find((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      let urls = [];
      for (let i in doc) {
        let date = new Date();
        let timer = date.getTime().toString();
        let url = 'https://api.github.com/repos/Zzhiren/' + doc[i].projectName + '?_' + timer;
        icon.push(doc[i].projectIcon);
        urls.push(url)
      }
      axiosAll = urls.map(makeAxios)
      function makeAxios(url) {
        return axios.get(url)
      }
      axios.all(axiosAll).then(axios.spread((...map) => {
        let docs = []
        for (let i in map) {
          let obj = {};
          obj.id = map[i].data.id;
          obj.name = map[i].data.name;
          obj.html_url = map[i].data.html_url;
          obj.description = map[i].data.description;
          obj.icon = icon[i];
          obj.stargazers_count = map[i].data.stargazers_count;
          obj.forks_count = map[i].data.forks_count;
          obj.open_issues = map[i].data.open_issues;
          obj.language = map[i].data.language;
          docs.push(obj)
        }
        GitHub.remove({}, (err) => {
          if (err) {
            console.log(err)
          } else {
            GitHub.create(docs, (err, doc) => {
              if (err) {
                console.log(err.message)
              } else {
                console.log('projects信息更新成功！')
              }
            })
          }
        })
      })).catch(err => {
        console.log(err)
      })
    }
  })
}

// 获取GitHub项目数据
exports.getGitHubProject = (req, res) => {
  GitHub.find((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        data: doc
      })
    }
  })
}

// 删除GitHub项目数据
exports.deleteGitHubProject = (req, res) => {
  let condition = {
    name: req.query.name
  }
  GitHub.remove(condition, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      Project.remove(condition, (err, doc) => {
        if (err) {
          res.json({
            status: '2',
            msg: err.message,

          })
        } else {
          res.json({
            status: '0',
            msg: "删除成功",
          })
        }
      })
    }
  })
}

// 获取头像图片路径
exports.getAvatarList = (req, res) => {
  AvatarList.find((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        data: doc
      })
    }
  })
}

// 新增评论
exports.addComment = (req, res) => {
  let data = req.body;
  let condition = {
    _id: data.id
  }
  let params = {
    id: data.id,
    avatarImg: data.avatarImg,
    userName: data.userName,
    userEmail: data.userEmail,
    userSite: data.userSite,
    theComment: data.theComment,
    creationTime: data.creationTime,
    OS: data.OS,
    browser: data.browser
  }
  Comment.create(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      Blog.find(condition, (err, find_blog) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          let count = find_blog[0].comment + 1;
          let param = {
            comment: count
          }
          Blog.update(condition, param, (err, update_blog) => {
            if (err) {
              res.json({
                status: '1',
                msg: err.message
              })
            } else {
              res.json({
                status: '0',
                msg: '发布成功！'
              })
            }
          })
        }
      })
    }
  })

}

// 获取博客评论接口
exports.getComments = (req, res) => {
  let data = req.query;
  let condition = {
    id: data.id
  }
  Comment.find(condition, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        data: doc
      })
    }
  })
}

// 浏览者给博客添加喜欢标签
exports.addLove = (req, res) => {
  let data = req.query;
  let condition = {
    _id: ObjectID(data._id)
  }
  Blog.find(condition, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      let count = doc[0].love + 1;
      let params = {
        love: count
      }
      Blog.update(condition, params, (err, blog_doc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          res.json({
            status: '0',
            msg: "love success!"
          })
        }
      })
    }
  })
}

// 获取标签信息
exports.getTag = (req, res) => {

  let name = req.query.name
  if (name == 'all') {
    Tag.find((err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        res.json({
          status: '0',
          data: doc
        })
      }
    })
  } else if (name != 'all') {
    let condition = {
      aliasName: name
    }
    Tag.find(condition, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        res.json({
          status: '0',
          data: doc
        })
      }
    })
  }
}

// 保存标签
exports.saveTag = (req, res) => {
  let id = req.body.id;
  let request = req.body;
  let params = {
    name: request.name,
    aliasName: request.aliasName,
    dsc: request.dsc,
    icon: request.icon,
    svg: request.svg
  }
  if (id === '') {
    Tag.create(params, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: '保存失败'
        })
      } else {
        res.json({
          status: '0',
          msg: '保存成功'
        })
      }
    })
  } else if (id !== '') {
    let condition = {
      _id: ObjectID(request.id)
    }
    Tag.update(condition, params, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: '保存失败'
        })
      } else {
        res.json({
          status: '0',
          msg: '保存成功'
        })
      }
    })
  }
}

// 删除标签
exports.deleteTag = (req, res) => {
  let request = req.query;
  let condition = {
    _id: ObjectID(request.id)
  }
  Tag.remove(condition, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: '删除失败'
      })
    } else {
      res.json({
        status: '0',
        msg: '删除成功'
      })
    }
  })
}