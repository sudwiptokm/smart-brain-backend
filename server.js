const express = require("express")
const bcrypt = require("bcrypt-nodejs")

const app = express()
app.use(express.json())

const database = {
    users : [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: "bananas",
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: "987",
            email: "john@gmail.com",
            hash : ""
        }
    ]
}

app.get("/", (req,res) => {
    res.send(database.users)
})

app.post("/signin", (req,res) => {
    // Load hash from your password DB.
    bcrypt.compare("apples", "$2a$10$/.0cer/WAEGzLNV/gVLHluFeo1B4aJ2zX8Pr4Xjp/R81/KDEOfLjK", function(err, res) {
        console.log("1st guess", res)
    });
    bcrypt.compare("veggies", "$2a$10$/.0cer/WAEGzLNV/gVLHluFeo1B4aJ2zX8Pr4Xjp/R81/KDEOfLjK", function(err, res) {
        console.log("2nd guess", res)
    });
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json("Successful")
    }
    else{
        res.status(400).json("Error Logging In")
    }
})

app.post("/register", (req,res) => {
    const {email, name, password} = req.body
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash)
    });

    database.users.push(
        {
            id: "125",
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        }
    )
    res.json(database.users[database.users.length-1])
})

app.get("/profile/:id", (req,res) => {
    const {id} = req.params;
    let found = false
    database.users.forEach(x => {
        if (x.id === id){
            found = true
            return res.json(x)
        }
    })
    if (!found) res.status(404).json("Not Found, Daaaaaaaamn!")
})

app.put("/image", (req,res) => {
    const {id} = req.body;
    let found = false
    database.users.forEach(x => {
        if (x.id === id){
            found = true
            x.entries++
            return res.json(x.entries)
        }
    })
    if (!found) res.status(404).json("Not Found, Daaaaaaaamn!")
})



app.listen(3000, ()=>{
    console.log("App is running on port 3000")
})

