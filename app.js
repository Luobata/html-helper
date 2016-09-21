module.exports = (function () {
    var json = require('./package.json');
    var menu = require('./menu.json');


    var showVersion = function () {
        var content = [
            '',
            '  Version: ' + json.version,
            '',
            '    By ' + json.author+ ' ' + json.license + '.',
            '    The more commands see \'' + json.name + ' --help\'.'
        ];

        console.log(content.join('\n'));
    };


    var showHelp = function (name, data) {
        var content = [];

        if (name !== '') {
            content = content.concat([
                '',
                '  Usage: ' + name,
                ''
            ]);
        }

        if (data.commands) {
            content = content.concat([
                '  Commands:',
                ''
            ]);
            (function () {
                var s, k, v, i;
                for (var k in data.commands) {
                    v = data.commands[k];
                    s = '';
                    for (i = 0; i < 8 + 6 - k.length; i++) {
                        s += ' ';
                    }
                    content.push('    ' + k + s + v.describe);
                }
            }());
            content.push('');
        }

        if (data.options) {
            content = content.concat([
                '  Options:',
                ''
            ]);
            (function () {
                var s, k, v, i;
                for (var k in data.options) {
                    v = data.options[k];
                    s = '';
                    for (i = 0; i < 8 - k.length; i++) {
                        s += ' ';
                    }

                    if (v.alias) {
                        content.push('    -' + v.alias + ', --' + k + s + v.describe);
                    } else {
                        content.push('    --' + k + s + v.describe);
                    }
                }
            }());
        }

        console.log(content.join('\n'));
    };

    var showError = function (name) {
        var content = [
            '',
            '  Error:',
            '',
            '    The \'' + name + '\' is not a command.',
            '    See \'' + json.name + ' --help\'.'
        ];

        console.log(content.join('\n'));
    };


    // version
    if (process.argv[2] === '-v' || process.argv[2] === '--version') {
        showVersion();
        return;
    }

    // help
    if (process.argv.length <= 2 || process.argv[2] === '-h' || process.argv[2] === '--help') {
        showHelp(json.name, menu);
        return;
    }

    var command = process.argv[2];
    if (!menu.commands[command]) {
        showError(command);
        return;
    } else {
        if (process.argv[3] === '-h' || process.argv[3] === '--help') {
            showHelp(command, menu.commands[command]);
            return;
        }

        (function () {
            var args = process.argv.slice(3);
            var paramsMap = {};
            while (args.length) {
                var key = args.shift();
                if (!key || !key.match(/^-|--/)) {
                    continue;
                }

                var val = args[0];
                key = key.match(/^-+(.*)/)[1];
                if (val && !val.match(/^-|--/)) {
                    paramsMap[key] = val;
                } else {
                    paramsMap[key] = '';
                }
            }

            require('./src/main.js')[command].call(null, paramsMap);
        }());
    }
})();
