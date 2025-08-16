after ep 6.5



// app.js
const express = require("express");

const app = express();

const {adminauth, userauth} = require("../middlewares/auth")
// const {userauth} = require("./middlewares")

// app.get("/user/:userid", (req, res)=>{
//     console.log(req.params);
//     res.send({
//         // userId: req.params.userid,
//         name: "akshay",
//         password: "kapoor",
//     });
// })







//this will only handle GET requests to /user
// app.get("/user",(req,res)=>{
//     // res.send("Hello, user!");
//     res.send({
//         name: "John Doe", passion: "Coding"});
// })

// app.get("/ab?cd", (req, res) => {
//   res.send("Matched /abcd or /acd");
// });

// app.get('/ab(cd)?e', (req, res) => {
//   res.send('Matched /abe or /abcde');
// });

// app.get('/ab+cd', (req, res) => {
//   res.send('Matched /abcd, /abbcd, /abbbcd');
// });


// app.get('/ab*cd', (req, res) => {
//   res.send('Matched /abcd, /ab123cd, /abxyzcd');
// });


// app.get(/.*fly$/, (req, res) => {
//   res.send('Matched something ending with fly');
// });


// app.post("/user",(req,res)=>{
//     res.send("data saved in DB");
// })
// app.delete("/user",(req,res)=>{
//     res.send("user deleted from DB");
// })
// app.use("/user",(req,res)=>{
//     res.send("Hello, user from app.use!");
// })


// this will match all the HTTP method API calls to /test
// app.use("/test",(req,res)=>{
//     res.send("Hello, test!");
// })

// app.use("/hello/2",(req,res)=>{
//     res.send("Hello2, hello2!");
// })
// app.use("/hello",(req,res)=>{
//     res.send("Hello, hello!");
// })
// app.use("/",(req,res)=>{
//     res.send("Hello, home!");
// })


//e5
// app.use("/user", (req, res, next)=>{
//     console.log("console of user")
//     res.send("hello user")
//     next()
//     // res.send("hello user")
// },
// (req, res, next)=>{
//     console.log("handling the route user2")
//     res.send("2 user")
//     next()
// },
// (req, res, next)=>{
//     console.log("3 handling the route user2")
//     res.send("3 user")
//     next()
// },
// (req, res, next)=>{
//     console.log(" 4handling the route user2")
//     res.send("4 user")
//     // next()
// },
// )

// app.use("/", (req, res, next)=>{
//     console.log("handling route")
//     next()
// })
// app.get("/user", (req, res, next)=>{
//     console.log("handling route")
//     res.send("1 route")
//     // next()
// })
// app.get("/user", (req, res, next)=>{
//     console.log("handling route")
//     res.send("1 route")
//     // nest()
// })



// app.get("/admin/getAllData", (req, res)=>{
//     //some logic for checking if the request is authorized

//     const token = "ghjikopds";
//     const isAdminAuthorized = token === "xyz"
//     if (isAdminAuthorized){
//         res.send("All Data Sent")
//     } else{
//         res.status(401).send("unauthorized request")
//     }
// })

// app.get("/admin/deleteUser", (req, res)=>{
//     res.send("deleted a user")
// })










// app.use("/admin", (req, res ,next)=>{
//     console.log("admin auth is getting checked")
//     const token = "vfcdes"
//     const isAdminAuthorized = token ==="xyz"
//     if (!isAdminAuthorized){
//         res.status(401).send("unauthorized request")
//     }
//     else{
//         next()
//     }
// })

// app.use("/admin", adminauth)
// app.use("/user", userauth)
// app.post("/user/login", (req, res)=>{
//     res.send("user logged in successfully")
// })


// app.get('/user', (req, res)=>{
//     res.send("all user data sent")
// })
// app.get('/admin/getAllData', (req, res)=>{
//     res.send("all data sent")
// })

// app.get("/admin/deleteUser", (req, res)=>{
//     res.send("deleted user")
// })





//error handling
app.get("/getuser",(req, res)=>{
    try{
 throw new Error("ghjk")
    res.send("user data sent")
    }
    catch (err)
    {
        res.status(500).send("something bad happened")

    }
   
})

app.use("/", (err, req, res, next)=>{
    if (err){
        res.status(500).send("something bad happened")
    }
})



app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
})