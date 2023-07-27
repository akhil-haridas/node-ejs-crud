const express = require("express");
const admin_route = express();

const session = require("express-session");
const config = require("../config/config");
admin_route.use(session({ secret: config.sessionSecret }));


const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const auth = require("../mware/adminAuth");
const admincntrl = require("../control/adminc");

admin_route.get('/',auth.isLogout,admincntrl.loadAdmin)
admin_route.post('/',admincntrl.adminlog)
admin_route.get('/home',auth.isLogin,admincntrl.loaddash)
admin_route.get('/logout',auth.isLogin,admincntrl.logoutAdmin)
admin_route.get('/dashboard',auth.isLogin,admincntrl.dashboard)
admin_route.get('/new-user', auth.isLogin, admincntrl.newUser)
admin_route.post('/new-user', admincntrl.addUser)
admin_route.get('/edit-user', auth.isLogin, admincntrl.edituser)
admin_route.post('/edit-user', admincntrl.updateuser)
admin_route.get('/delete-user',admincntrl.deleteUser)


admin_route.get('*', function (req,res) {
    res.redirect('/admin'); 
})

module.exports = admin_route