const express = require('./express');
const app = express();

// const Router = express.Router;
// express.static = function(req, res, next) {
    
// }

// let user = new Router();
// user.get('/remove', (req, res, next) => {
//     next('/user/remove wrong');
// })
// user.get("/add", (req, res, next) => {
//     res.end('/user/add');
//     next();
// })

// app.use('/user', user);

app.get('/', function(req, res, next) {
    console.log(req.method);
    next('/user/remove wrong');
    // res.end('OK');
});

app.use(function(err, res, req, next) {
    if (err) res.send(err);
})

app.listen(3000, () => console.log(`Server starts at 3000.`));