let path = require('path');
let fs = require('fs');
const url = require('url');

module.exports = function (dirname) {
    return (req, res, next) => {
        const { pathname, query } = url.parse(req.url);
        if (query) return next();
        let absPath = path.join(dirname, pathname);
        fs.stat(absPath, function (err, statObj) {
            if (err) {
                return next();
            }
            if (!statObj.isFile()) {
                absPath = absPath + '/index.html';
            }
            fs.createReadStream(absPath).pipe(res);
        })
    }
}
