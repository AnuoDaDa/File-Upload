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
// 引入模块
var COS = require('cos-nodejs-sdk-v5');
var cos = new COS({
    // 必选参数
    SecretId: "AKID8A1hUmP2wfDc2HBDwTp0OejeOyNdHbJq",
    SecretKey: "LZbTBmCbrwqY8Xk6JJ9nMl7M3ZxACXns",
});

app.post("/upload",multer({dest: __dirname + '/public/upload/'}).array('file'), function (req, res) {

    var filepath = req.files[0].path;

    var fileKey = "nodejs"+new Date().getTime();
    // 调用方法
    cos.putObject({
        Bucket: "chengd-1253990303", /* 必须 */ // Bucket 格式：test-1250000000
        Region: "ap-chengdu",
        Key: fileKey, /* 必须 */
        TaskReady: function (tid) {
        },
        onProgress: function (progressData) {

        },
        // 格式1. 传入文件内容
        // Body: fs.readFileSync(filepath),
        // 格式2. 传入文件流，必须需要传文件大小
        Body: fs.createReadStream(filepath),
        ContentLength: fs.statSync(filepath).size
    }, function (err, data) {


        if(data.statusCode==200){
            var url = cos.getObjectUrl({
                Bucket: "chengd-1253990303", // Bucket 格式：test-1250000000
                Region: "ap-chengdu",
                Key: fileKey,
                Expires: 600000,
                Sign: true,
            }, function (err, data) {
            });
            var body = {
                key:fileKey,
                url:url
            }
            res.json(body);
        }
    });

});


var server = app.listen(8088);