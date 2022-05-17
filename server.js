const express = require('express');

const PORT = 5001;

const app = express();

app.use(express.static('public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});


app.listen(process.env.PORT || PORT, () => console.log(`Server is started and listening on port ${PORT}.`));
