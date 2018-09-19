/**
 * Created by boy on 2017/7/10.
 */
var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');

// 引入模块
var COS = require('cos-nodejs-sdk-v5');
var cos = new COS({
    // 必选参数
    SecretId: "AKIDmQvELKHi7KfqfMJ7jFcopeHn9NQIgTms",
    SecretKey: "8ATedQ3VlpiQ6jIk4GKI8rtV4Sfg7OVQ",
});

//1,接受表单的请求
app.use(bodyParser.urlencoded({ extended: false }));
//2,设置下载的地址
app.use(multer({ dest: '/public/'}).array('image'));

app.get('/index', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/upload', function (req, res) {
    var filepath = req.files[0].path;
    // 调用方法
    cos.putObject({
        Bucket: "chengd-1253990303", /* 必须 */ // Bucket 格式：test-1250000000
        Region: "ap-chengdu",
        Key: "filename", /* 必须 */
        TaskReady: function (tid) {
        },
        onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
        },
        // 格式1. 传入文件内容
        // Body: fs.readFileSync(filepath),
        // 格式2. 传入文件流，必须需要传文件大小
        Body: fs.createReadStream(filepath),
        ContentLength: fs.statSync(filepath).size
    }, function (err, data) {

    });
})

app.get('/img', function (req, res) {
    var url = cos.getObjectUrl({
        Bucket: "chengd-1253990303", // Bucket 格式：test-1250000000
        Region: "ap-chengdu",
        Key: 'filename',
        Expires: 600000,
        Sign: true,
    }, function (err, data) {

    });
    console.log(url);
})

var server = app.listen(8088);