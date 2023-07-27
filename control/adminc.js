const User = require("../models/userm");
const bcrypt = require('bcrypt');
const admin_route = require("../routes/adminRoute");
const randomstring = require('randomstring')


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash
    } catch (error) {
        console.log(error.message)
    }
}


const loadAdmin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}

const adminlog = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_admin=== 0 ) {
                    res.render('login',{message:"Sorry , this isn't Admin"})
                } else {
                    req.session.admin_id = userData._id;
                    res.redirect("/admin/home");
                }
            } else {
                res.render('login',{message:"Email or Password is Incorrect."})
            }
        } else {
            res.render('login',{message:"Email or Password is Incorrect."})
        }

    } catch (error) {
        console.log(error.message)
    }
}

const loaddash = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.admin_id });
        res.render('home',{admin:userData})
    } catch (error) {
        console.log(error.message)
    }
}

const logoutAdmin = async (req,res) => {
    try {
        req.session.destroy();
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
}

const dashboard = async (req,res) => {
    try {
        var search = ''
        if (req.query.search) {
            search = req.query.search
        }
        const usersData = await User.find({
            is_admin: 0,
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                { mobile: { $regex: '.*' + search + '.*', $options: 'i' } }
        ] });
        res.render('dashboard', { users: usersData });
    } catch (error) {
        console.log(error.message)
    }
}

// Add new user

const newUser = async (req, res) => {
    try {
        res.render('newUser')
    } catch (error) {
        console.log(error.message)
    }
}

const addUser = async (req, res) => {
    try {
        const name = req.body.name;
        const mobile = req.body.mobile;
        const email = req.body.email;
        const password = randomstring.generate(8);

        const spassword = await securePassword(password);

        const user = new User({
            name: name,
            mobile: mobile,
            email: email,
            password: spassword,
            is_admin:0
        })

        const userData = await user.save()
        if (userData) {
            res.redirect('/admin/dashboard')
        } else {
            res.render('newUser',{message:'Something went wrong'})
        }
    } catch (error) {
        console.log(error.message)
    }
}

//edit User

const edituser = async (req, res) => {
    try {
        const id = req.query.id
        const userData = await User.findById({ _id: id })
        if (userData) {
            res.render('editUser',{user:userData})
        } else {
            res.redirect('/admin/dashboard')
        }
    
    } catch (error) {
        console.log(error.message)
    }
}

//update User

const updateuser = async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, mobile: req.body.mobile, email: req.body.email } })
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message)
    }
}

//delete users

const deleteUser = async (req, res) => {
    try {
        const id = req.query.id
        await User.deleteOne({ _id: id })
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = { loadAdmin,adminlog,loaddash,logoutAdmin,dashboard,newUser,addUser,edituser,updateuser,deleteUser };