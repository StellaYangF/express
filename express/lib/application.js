const http = require('http');
const Router = require('./router');
const methods = require('methods');

function Application(){ 
    this.config = {}
}

Application.prototype.set = function (key, value) {
    if (arguments.length === 2) {
        this.config[key] = value;
    } else {
        return this.config[key];
    }
}

Application.prototype.lazy_route = function() {
    if (!this._router) return this._router = new Router();
}

Application.prototype.param = function (key, handler) {
    this.lazy_route();
    this._router.param(key, handler);
}

Application.prototype.use = function(path, handler) {
    this.lazy_route();
    this._router.use(path, handler);
}

methods.forEach(method => {
    Application.prototype[method] = function(path, ...handlers) {
        if (method === 'get' && arguments.length === 1) {
            return this.set(path);
        }
        this.lazy_route();
        this._router[method](path, ...handlers);
    }
})
 
Application.prototype.listen = function() {
    let server = new http.createServer((req, res) => {
        function done() {
            res.end(`Cannot ${req.method} ${req.url}`);
        }
        this.lazy_route();
        res.send = res.end;
        this._router.handle(req, res, done);
    });
    server.listen(...arguments);
}

module.exports = Application;