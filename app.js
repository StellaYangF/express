const express = require('./express');
const app = express();

const Router = express.Router;

let user = new Router();
user.get("/add", (req, res, next) => {
    res.end('/user/add');
    next();
})

app.use('/user', user);

app.get('/', function(req, res) {
    console.log(req.method);
    res.end('OK');
});

app.listen(3000, () => console.log(`Server starts at 3000.`));