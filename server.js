const express = require("express")
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require('knex')

const app = express()

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '1',
      database : 'smart-brain'
    }
});

app.use(express.json())
app.use(cors())

const database = {
    users : [
        {
            id: "123",
            name: "John",
            email: "1",
            password: "1",
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
    // login: [
    //     {
    //         id: "987",
    //         email: "john@gmail.com",
    //         hash : ""
    //     }
    // ]
}

app.get("/", (req,res) => {
    res.send(database.users)
})

app.post("/signin", (req,res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json(database.users[0])
    }
    else{
        res.status(400).json("Error Logging In")
    }
})

app.post("/register", (req,res) => {
    const {email, name, password} = req.body
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user => {
        res.json(user[0])
    })
    .catch(err => res.status(400).json("unable to register"))
})

app.get("/profile/:id", (req,res) => {
    const {id} = req.params;
    let found = false
    database.users.forEach(x => {
        if (user.id === id){
            found = true
            return res.json(user)
        }
    })
    if (!found) res.status(404).json("Not Found, Daaaaaaaamn!")
})

app.put("/image", (req,res) => {
    const {id} = req.body;
    let found = false
    database.users.forEach(user => {
        if (user.id === id){
            found = true
            user.entries++
            return res.json(user.entries)
        }
    })
    if (!found) res.status(400).json("Not Found")
})



app.listen(3000, ()=>{
    console.log("App is running on port 3000")
})

