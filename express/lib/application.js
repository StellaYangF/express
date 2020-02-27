const http = require('http');
const url = require('url');
const path = require('path');
const Router = require('./router');
const methods = require('methods');

function Application(){ }

Application.prototype.lazy_route = function() {
    if (!this._router) return this._router = new Router;
}

Application.prototype.use = function(path, handler) {
    this.lazy_route();
    this._router.use(path, handler);
}



 
Application.prototype.listen = function() {
    let server = new http.createServer((req, res) => {
        function done() {
            res.end(`Cannot ${req.method} ${req.url}`);
        }
        this._router.handle(req, res, done);
    });
    server.listen(...arguments);
}

module.exports = Application;