/**
 * Created by boy on 2018/7/31.
 */
var express = require('express');
var app = express();
var fs = require("fs");



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

app.post("/upload", function (req, res) {



    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/upload';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        console.log(files.uploadImage.path);
        if (err) {
            res.locals.error = err;
            res.render('index', { title: "图片上传失败" });
            return;
        }

        var extName = '';  //后缀名
        switch (files.uploadImage.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.locals.error = '只支持png和jpg格式图片';
            res.render('index', { title: TITLE });
            return;
        }



        //显示地址；
        var path = files.uploadImage.path;

        var index=  path.lastIndexOf('\\')+1;
        path=path.substring(index,path.length);

        console.log(path);




        res.json({
            "newPath":'http://localhost:8088/upload/'+path
        });
    });
});


var server = app.listen(8088);