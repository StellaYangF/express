const url = require('url');
const path = require('path');
const methods = require('methods');
const Route = require('./route');
const Layer = require('./layer');

function Router() {
    const router = function(req, res, next) {
        router.handle(req, res, next);
    }
    router.stack = [];
    router.__proto__ = proto;
    return router;
}

const proto = Object.create({});

proto.route = function(path) {
    const route = new Route();
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    return route;
}

proto.use = function(path, handler) {
    if (typeof path === 'function') {
        [handler, path] = [ path, '/' ];
    }
    const layer = new Layer(path, handler);
    layer.route = undefined;
    this.stack.push(layer);
}

methods.forEach(method => {
    proto[method] = function(path, ...handlers) {
        let route = this.route(path);
        route[method](handlers);
    }
})

proto.handle = function(req, res, out) {
    let { pathname } = url.parse(req.url);
    let index = 0;
    let removed = "";
    const dispatch = () => {
        if (removed) {
            req.url = removed + req.url;
            removed = "";
        }
        if (index === this.stack.length) return out();
        let layer = this.stack[index++];
        
        if (layer.match(pathname)) {
           if (!layer.route && layer.handler.length !== 4) {
               if (layer.path !== "/") {
                   removed = layer.path;
                   req.url = req.url.slice(removed.length);
               }
                layer.handle_request(req, res, dispatch);
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