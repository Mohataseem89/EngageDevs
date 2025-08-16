const validator = require('validator');

const validatesignupdata = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName ) {
        throw new Error("First name or last name is invalid");
    }
    else if(!validator.isEmail(email)) {
        throw new Error("Email is invalid");
    }else if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }



}

module.exports = {
    validatesignupdata
};