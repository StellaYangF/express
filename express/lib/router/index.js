const url = require('url');
const path = require('path');
const methods = require('methods');
const Route = require('./route');
const Layer = require('./layer');

function Router() {
    this.stack = [];
}

Router.prototype.route = function(path) {
    const route = new Route();
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    return route;
}

Router.prototype.use = function(path, handler) {
    if (typeof path === 'function') {
        [handler, path] = [ path, '/' ];
    }
    const layer = new Layer(path, handler);
    layer.route = undefined;
    this.stack.push(layer);
}

methods.forEach(method => {
    Router.prototype[method] = function(path, handlers) {
        let route = this.route(path);
        route[method](handlers);
    }
})

Router.prototype.handle = function(req, res, out) {
    let { pathname } = url.parse(req.url);
    let index = 0;
    const dispatch = () => {
        if (index === this.stack.length) return out();
        let layer = this.stack[index++];
        
        if (layer.match(pathname)) {
           if (!layer.route) {
            layer.handle_request(ewq, res, dispatch);
           } else {
                if (layer.route.methods[req.method.toLowerCase()]) {
                    layer.handle_request(req, res, dispatch)
                } else {
                    dispatch();
                }
           }
        } else {
            dispatch();
        }
    }
    dispatch(0);
}

module.exports = Router;