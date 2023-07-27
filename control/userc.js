  // const { render } = require('ejs');
const User = require('../models/userm');
const bcrypt = require('bcrypt');
// const randomstring = require("randomstring");

// const nodemailer = require("nodemailer");

const securePassword = async (password) => {
    
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

//for send mail...

// const sendVerifyMail = async (name, email, user_id) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false,
//             requireTLS: true,
//             auth: {
//                 user:'Akhilpopzz147@gamil.com',
//                 pass:'dwjrwnpmgawecgth'
//             }
//         });
//         const mailOptions = {
//             from: 'Akhilpopzz147@gamil.com',
//             to: email,
//             subject: 'For Verification Mail',
//             html:'<p>Hi '+name+',Please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'"> Verify </a>your mail.</p>'
//         }
//         transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log("Email has been sent:-",info.response)
//             }
//         })
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const loadSignup = async (req, res) => {
    try {
        res.render('signup')
    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async (req, res) => {

    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            password: spassword,
            is_admin:0
        });

        const userData = await user.save()

        if (userData) {
            // sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('signup',{message:"Signup Successfull"})
        } else {
            res.render('signup',{message:"SignUp Failed - Try Again"})
        }

    } catch (error) {
        console.log(error.message);
    }
    
}

// const verifyMail = async (req, res) => {
//     try {
//         const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });
//         console.log(updateInfo);
//         res.render("email-verified");
//     } catch (error) {
//         console.log(error.message)
//     }
// }

//login user mehtod started

const loginLoad = async (req, res) => {
    
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_admin === 1) {
                    res.render('login', { message: "Admin can't login here!" }) 
                } else {
                    req.session.user_id = userData._id
                    res.redirect('/home');
                }  
            } else {
               res.render('login', { message: "Email or Password incorrect" }) 
            }
        } else {
            res.render('login', { message: "Email or Password incorrect" })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('home',{user:userData})
    } catch (error) {
        console.log(error.message)
    }
}

const uLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log('error.message')
    }
}

//forget password

// const resetPass = async (req, res) => {
//     try {
//         const token = req.query.token;
//         const tokenData = await User.findOne({ token: token })
//         if (tokenData) {
//             res.render('forget',{user_id:tokenData._id})
//         } else {
//             res.render('404')
//         }
       
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const resetit = async (req, res) => {
//     try {
//         const password = req.body.password;
//         const user_id = req.body.user_id;

//         const secure_pass = await securePassword(password)
        
//         const updata = await User.findByIdAndDelete({ _id: user_id }, { $set: { password: secure_pass, toke: '' } })
        
//         res.redirect("/")
//     } catch (error) {
//         console.log(error.message)
//     }
// }


//user profile 

const editUser = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render('edit', { user: userData });
        } else {
            res.redirect('/home');
        }
    } catch (error) {
        console.log(error.message)
    }
}

//update

const updateUser = async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } })
        res.redirect('/home')
    } catch (error) {
        console.log(error.message)
    }
}
    

module.exports = {
    loadSignup,insertUser,loginLoad,verifyLogin,loadHome,uLogout,editUser,updateUser
}