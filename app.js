const express = require('./express');

const app = express();

app.get('/', function(req, res) {
    console.log(req.method);
    res.end('OK');
});

app.listen(3000, () => console.log(`Server starts at 3000.`));