const express = require('express');
const app = express();
const path = require('path');
const Router = express.Router;

app.use(express.static(path.resolve(__dirname, 'public')));

let user = new Router();
user.get('/remove', (req, res, next) => {
    console.log('sb');
    res.send(`/user/remove`)
    next();
})
user.get("/add", (req, res, next) => {
    res.end('/user/add');
    next();
})

app.use('/user', user);

app.use(function(err, req, res, next) {
    if (err) res.send(err);
})
app.listen(3000, () => console.log(`Server starts at 3000.`) );