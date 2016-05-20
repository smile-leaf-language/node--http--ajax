/**
 * Created by yujuan on 2016/4/18.
 */

var fs = require("fs");
var path = require("path");
var url = require("url");
var http = require("http");
var mime = require("mime");
var server = http.createServer();

server.on("request", function (req, res) {
    var urlObj = url.parse(req.url);
    var pathname = decodeURI(urlObj.pathname);

    if (pathname == "/favicon.ico") {
        res.end("404");
    }
    if (pathname == "/") {
        res.setHeader("content-Type", mime.lookup("de-wireless.html"));
        fs.createReadStream("../dep-wireless.html").pipe(res);
    } else if (pathname == "/users") {
        var method = req.method.toLowerCase();
        switch (method) {
            case 'post':
                post();
                break;
            case 'get':
                get();
                break;
        }
    } else {
        fs.exists(".." + pathname, function (exists) {
            if (exists) {
                res.setHeader("content-Type", mime.lookup(pathname));
                fs.readFile('..' + pathname, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    res.end(data);
                });
            } else {
                res.end('Dear not found');
            }
        });
    }
    ;
    //get 请求
    function get() {
        fs.readFile("./data.json", function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var result = data.toString() == '' ? '[]' : data.toString();
                res.end('{"status":"success", "value":' + result + '}');
            }
        });
    };
});


server.listen(8000, "localhost", function () {
    console.log("It is running");
});
