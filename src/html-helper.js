var fs = require('fs');
var path = require('path');
var HTML = require('html-parse-stringify');
var promt = require('./lib/promt.js');



var helper = (function () {
    // 处理ast数组 寻找里面有class的部分
    var formateClassName = function (arr) {
        var cla = [];
        var walk = function (arr, preClassName) {
            arr.forEach(function (item) {
                var className = preClassName;
                if (item.type !== 'text' && item.attrs.class) {
                    // 对于多个class只去第一个 不然数量太多
                    item.attrs.class = item.attrs.class.split(' ')[0];
                    className = preClassName + '.' + item.attrs.class + ' ';
                    cla.push(className);
                }
                if (item.children && item.children.length) {
                    walk(item.children, className);
                }
            });
        };

        walk(arr, '');
        return cla;
    };

    var generateCss = function (arr, cssName) {
        var str = '';
        if (fs.existsSync(cssName)) {
            str = fs.readFileSync(cssName, 'utf-8');
        }
        arr.forEach(function (item) {
            if (str.indexOf(item) === -1) {
                str += item +
                    '{\n' +
                    '}\n';
            }
        });

        return str;
    };

    var helpFun = function () {
    };

    helpFun.prototype.init = function (h, c) {
        var cwd = process.cwd();
        var callback = function (htmlName, cssName) {
            //var filePath = process.cwd() + '/' + fileName;
            var file = path.basename(htmlName, '.html');
            //var cssName = file + '.css';
            var html = fs.readFileSync(htmlName,'utf-8');
            // 除去换行与注释
            html = html
                .replace(/\r\n+/g, '')
                .replace(/\n+/g, '')
                .replace(/<!--[\w\W]*?-->/g, '');
            var ast = HTML.parse(html);
            var cla = formateClassName(ast);
            var str = generateCss(cla, cssName);
            fs.writeFileSync(cssName, str, 'utf-8');
        };
        // 遍历文件夹 如果只有一个html 就用当前html
        var htmlName = h || '';
        var cssName = c || '';
        (function () {
            fs.readdirSync(cwd).forEach(function (item) {
                if (item.match(/\.html$/)) htmlName = cwd + '/' + item;
            });
        }());
        if (!htmlName) {
            console.log('当前目录下没有对应的html文件!');
            return;
        }
        var str = {
            html: '请输入html文件名字(' + path.basename(htmlName) + '):'
        };
        promt.startStepByStep({
            step1: function () {
                promt.readLine(str.html, function (input) {
                    if (!input) return true;
                    if (!input.match(/\.html$/)) input += '.html';
                    if (!fs.existsSync(cwd + '/' + input)) {
                        console.log('html不存在');
                        return false;
                    }
                    htmlName = cwd + '/' + input;
                    return true;
                });
            },
            step2: function () {
                cssName = htmlName.replace(/\.html$/, '.css');
                str.css =  '请输入生成的css文件名字(' + path.basename(cssName) + '):'
                promt.readLine(str.css, function (input) {
                    if (input) {
                        if (!input.match(/\.css$/)) input += '.css';
                        cssName = cwd + '/' + input;
                    }
                    callback(htmlName, cssName);
                    return true;
                });
            }
        }, 0);
    };

    return helpFun;
}());


module.exports = new helper;
