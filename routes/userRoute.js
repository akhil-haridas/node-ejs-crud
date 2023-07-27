const express = require("express");
const user_route = express();
const userCntrl = require("../control/userc");
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require("../config/config");
const auth = require("../mware/auth");


user_route.use(session({secret:config.sessionSecret}))
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }))

user_route.set('view engine', 'ejs')
user_route.set('views', './views/users')

// const { urlencoded } = require("body-parser");

user_route.get('/signup',auth.isLogout, userCntrl.loadSignup);
user_route.post('/signup', userCntrl.insertUser);
// user_route.get('/verify', userCntrl.verifyMail);
user_route.get('/',auth.isLogout, userCntrl.loginLoad);
user_route.get('/login',auth.isLogout, userCntrl.loginLoad);
user_route.post('/login', userCntrl.verifyLogin);
user_route.get('/home', auth.isLogin, userCntrl.loadHome);
user_route.get('/logout', auth.isLogin, userCntrl.uLogout)
// user_route.get('/forget',auth.isLogout,userCntrl.resetPass)
// user_route.post('/forget', userCntrl.resetit)
user_route.get('/edit', auth.isLogin, userCntrl.editUser)
user_route.post('/edit',userCntrl.updateUser)



module.exports = user_route;