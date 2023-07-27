const { promiseImpl } = require("ejs");

const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
        console.log("hi1");
        next();
        } else{
            res.redirect('/'); 
            console.log("hi2");
        } 
        
         

    } catch (error) {
        console.log(error.message)
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/home');
        } else {
         next();   
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    isLogin,isLogout
}
