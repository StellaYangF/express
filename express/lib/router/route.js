const methods = require('methods');
const Layer = require('./layer');

function Route() {
    this.stack = [];
    this.methods = Object.create({});
}

Route.prototype.dispatch = function(req, res, out) {
    let index = 0;
    let method = req.method.toLowerCase();
    const dispatch = () => {
        if (index === this.stack.length) return out();
        let layer = this.stack[index++];

        if (layer.method === method) {
            layer.handle_request(req, res, dispatch);
        } else dispatch();
    }
    dispatch(0);
}

methods.forEach(method => {
    Route.prototype[method] = function(handlers) {
        this.methods[method] = true;
        handlers.forEach(handler =>{
            let layer = new Layer('/', handler);
            layer.method = method;
            this.stack.push(layer);
        })
    }
})

module.exports = Route;