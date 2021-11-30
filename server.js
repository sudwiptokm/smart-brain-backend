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
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password)
    return db('users')
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
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        if (user.length > 0) res.json(user[0])
        else res.status(400).json("not found")
    })
    .catch(err=> res.status(400).json("error getting user"))
})

app.put("/image", (req,res) => {
    const {id} = req.body;
    db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json("unable to get image count"))
})



app.listen(3000, ()=>{
    console.log("App is running on port 3000")
})

