var fs = require('fs');
var path = require('path');
var HTML = require('html-parse-stringify');


var helper = (function () {
    // 处理ast数组 寻找里面有class的部分
    var formateClassName = function (arr) {
        var cla = [];
        var walk = function (arr, preClassName) {
            arr.forEach(function (item) {
                var className = '';
                if (item.type !== 'text' && item.attrs.class) {
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

    helpFun.prototype.init = function (fileName) {
        var filePath = process.cwd() + '/' + fileName;
        var file = path.basename(fileName, '.html');
        var cssName = file + '.css';
        var html = fs.readFileSync(filePath,'utf-8');
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

    return helpFun;
}());

var a = new helper;
a.init('pagelet.html');

module.exports = new helper;
