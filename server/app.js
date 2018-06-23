// 加载express模块
var express = require('express');
var swig = require('swig');
var app = express();
var bp = require('body-parser');
var cookies = require('cookies');
var path = require('path')
// 后台上传的模块
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.use(multipart({uploadDir:'../proImg' }));

app.use('/',require('./routers/getUser'))

// 开启端口
let server = app.listen(8082)
// 用户发送http请求 -》url =》 解析路由 =》 找到匹配的规则 =》 执行指定绑定函数，返回对应内容给用户
// /public -> 静态 =》 直接读取指定目录下的文件，返回给用户 =》 动态 =》 处理业务逻辑，计息模版 =》 返回数据给用户