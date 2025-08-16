const adminauth = (req, res ,next)=>{
    console.log("admin auth is getting checked")
    const token = "vfcdes"
    const isAdminAuthorized = token ==="xyz"
    if (!isAdminAuthorized){
        res.status(401).send("unauthorized request")
    }
    else{
        next()
    }
}
const userauth = (req, res ,next)=>{
    console.log("admin auth is getting checked")
    const token = "vfcdes"
    const isAdminAuthorized = token ==="xyz"
    if (!isAdminAuthorized){
        res.status(401).send("unauthorized request")
    }
    else{
        next()
    }
}


module.exports ={
    adminauth,
    userauth
};