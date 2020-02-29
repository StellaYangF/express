const express = require('express');
const app = express();

console.log('111');


const Router = express.Router;
express.static = function (dirname) {
    return (req, res, next) => {
        let path = require('path');
        let fs = require('fs');
        let absPath = path.join(dirname, req.path);
        console.log(absPath)
        fs.stat(absPath, function (err, statObj) {
            if (err) {
                return next();
            }
            if (statObj.isFile()) {
                res.sendFile(absPath);
            }else{
            //   找index.html ...
            }
        })
    }
}

app.use(express.static("./public"));

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