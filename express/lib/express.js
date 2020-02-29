const Application = require('./application');
const Router = require('./router');


function createApplication() {
    return new Application();
}
createApplication.Router = Router;

createApplication.static = function (dirname) {
    return (req, res, next) => {
        let path = require('path');
        let fs = require('fs');
        let absPath = path.join(dirname, req.path);
        fs.stat(absPath, function (err, statObj) {
            if (err) {
                return next();
            }
            if (!statObj.isFile()) {
                absPath = absPath + '/index.html';
            } 
            res.sendFile(absPath);
        })
    }
}

module.exports = createApplication;
