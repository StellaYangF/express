const url = require('url');
const methods = require('methods');
const Route = require('./route');
const Layer = require('./layer');

function Router() {
    const router = function (req, res, next) {
        router.handle(req, res, next);
    }
    router.stack = [];
    router.__proto__ = proto;
    router.paramsCallback = {}; // { key: [fn, fn] }
    return router;
}

const proto = {};

proto.param = function (key, handler) {
    if (this.paramsCallback[key]) {
        this.paramsCallback[key].push(handler);
    } else {
        this.paramsCallback[key] = [handler];
    }
}

proto.route = function (path) {
    const route = new Route();
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    return route;
}

proto.use = function (path, handler) {
    if (typeof path === 'function') {
       handler = path;
       path = "/";
    }
    const layer = new Layer(path, handler);
    layer.route = undefined;
    this.stack.push(layer);
}

methods.forEach(method => {
    proto[method] = function (path, ...handlers) {
        let route = this.route(path);
        route[method](handlers);
    }
})

proto.process_params = function (layer, req, res, done) {
    if (!layer.keys || layer.keys.length === 0) {
        return done();
    }
    // key [id, name]
    let keys = layer.keys.map(item => item.name);
    let params = this.paramsCallback;
    let idx = 0;
    function next () {
        if (keys.length === idx) return done();
        let key = keys[idx++];
        processCallback(key, next);
    }
    next();
    function processCallback(key, out) {
        let fns = params[key];
        if (!fns) {
            return out();
        }
        let idx = 0;
        let value = req.params[key];
        function next() {
            if (fns.length === idx) return out();
            let fn = fns[idx++];
            fn(req, res, next, value, key);
        }
        next();
    }
}

proto.handle = function (req, res, out) {
    let { pathname } = url.parse(req.url);
    let idx = 0;
    let removed = "";
    const dispatch = err => {
        if (idx === this.stack.length) return out();
        if (removed) {
            req.url = removed + req.url;
            removed = "";
        }
        let layer = this.stack[idx++];
        if (err) {
            if (!layer.route) {
                layer.handle_err(err, req, res, dispatch);
            } else {
                return dispatch(err);
            }
        } else {
            if (layer.match(pathname)) {
                if (!layer.rout) { // 如果是中间件 直接执行 对应的方法即可
                    // 在这里把中间件的路径 删除掉
                    // /user/add   /
                    if (layer.handler.length !== 4) {
                        if (layer.path !== '/') { // 如果中间件就是/
                            removed = layer.path;
                            req.url = req.url.slice(removed.length)
                        }
                        layer.handle_request(req, res, dispatch);
                    } else {
                        dispatch();
                    }
                } else {
                    // 路由
                    if (layer.route.methods[req.method.toLowerCase()]) {
                        req.params = layer.params;
                       this.process_params(layer, req, res, () => {
                          layer.handle_request(req, res, dispatch);
                       })
                    } else {
                        dispatch();
                    }
                }
            } else {
                dispatch();
            }
        }

    }
    dispatch();
}

module.exports = Router;