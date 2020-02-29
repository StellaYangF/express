const Application = require('./application');
const Router = require('./router');
const static = require('./static');


function createApplication() {
    return new Application();
}
createApplication.Router = Router;
createApplication.static = static;

module.exports = createApplication;
