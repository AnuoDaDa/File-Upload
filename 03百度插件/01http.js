/**
 * Created by boy on 2018/7/31.
 */
var express = require('express');
var app = express();
var fs = require("fs");

var multer = require('multer');

var bodyParser = require('body-parser');
//handle request entity too large
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
//设置静态文件
app.use(express.static('public'));
//指定模板引擎
app.set("views engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/views');
//接受表单的请求
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/index', function (req, res) {
    res.render('index',{});
})

var formidable = require('formidable');

app.post("/upload",multer({dest: __dirname + '/public/upload/'}).array('file'), function (req, res) {
    var responseJson = {
        code: '1'// 上传的文件信息
    };
    var src_path = req.files[0].path;
    var fileName=new Date().getTime()+".jpg";
    var des_path = req.files[0].destination + new Date().getTime()+".jpg";

    console.log(des_path);

    fs.rename(src_path, des_path, function (err) {
        if (err) {
            throw err;
        }
        fs.stat(des_path, function (err, stat) {
            if (err) {
                throw err;
            }
            responseJson['upload_file'] = "http://localhost:8088/upload/"+fileName;

            res.json(responseJson);
        });
    });
});


var server = app.listen(8088);