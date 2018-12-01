const fs = require('fs');

var logging = (req, res, next) => {
    var now = new Date().toString();
    var log = `${now} : ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (e) => {
        if(e) {
            console.log(`Unable to append to log file: ${e}`);
        }
    });
    next();
};

module.exports = { logging };