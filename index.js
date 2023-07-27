const mongoose = require("mongoose");
mongoose.set('strictQuery',false)
mongoose.connect('mongodb://127.0.0.1:27017/systemdb');

const express = require("express")
const app = express();

// cache control

app.use(function (req, res, next) {
    res.set('Cache-control', 'no-store')
    next()
})

//for user routes

const userRoute = require('./routes/userRoute');

app.use('/', userRoute);

//for admin routes

const adminRoute = require('./routes/adminRoute');

app.use('/admin', adminRoute);

app.listen(3000, function () {
    console.log("Server on...");
});