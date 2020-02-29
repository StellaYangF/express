const methods = require('methods');
const Layer = require('./layer');

function Route() {
    this.stack = [];
    this.methods = {};
}

Route.prototype.dispatch = function (req, res, out) {
    let index = 0;
    let method = req.method.toLowerCase();
    const dispatch = err => {
        if (err) return out(err);
        if (index === this.stack.length) return out();
        let layer = this.stack[index++];
        if (layer.method === method) {
            layer.handle_request(req, res, dispatch);
        } else dispatch();
    }
    dispatch();
}

methods.forEach(method => {
    Route.prototype[method] = function (handlers) {
        handlers.forEach(handler => {
            let layer = new Layer('/', handler);
            layer.method = method; // 用户调用什么方法 存入method就是什么
            this.methods[method] = true; // 如果用户绑定方法 我就记录一下
            this.stack.push(layer);
        });
    }
});
module.exports = Route;