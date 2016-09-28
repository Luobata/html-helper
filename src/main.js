// 基本规则坚持
var commanRule = function () {
    var html = '';
    var cssName = '';
    (function () {
        fs.readdirSync(cwd).forEach(function (item) {
            if (item.match(/\.html$/)) htmlName = cwd + '/' + item;
        });
    }());
    if (!htmlName) {
        console.log('当前目录下没有对应的html文件!');
        return;
    }
};

var helper = function (params) {
    var html = require('./html-helper');
    html.init();
};

var jade = function (params) {
};


module.exports = {
    init: helper,
    jade: jade
};
