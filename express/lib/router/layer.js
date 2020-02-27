function Layer(path, handler) {
    this.path = path;
    this.handler = handler;
}

Layer.prototype.match = function(pathname) {
    if (this.path === pathname) return true;
    if (!this.route) {
         if(this.path === '/'){
            return true;
        }
        return pathname.startsWith(this.path+'/')
    }
}

Layer.prototype.handle_request = function(req, res, next) {
    this.handler(req, res, next);
}

module.exports = Layer;