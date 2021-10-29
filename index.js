const express = require("express");
const cors = require("cors")
const { MongoClient } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dki2q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db("travigoDB");
        const serviceCollection = database.collection("services");

        app.post("/services", async(req, res) => {
            const result = await serviceCollection.insertOne(req.body)
            res.send(result)
        })
    }
    finally { }
}
run().catch(console.dir)

app.get("/", async (req, res) => {
    res.send("Server site is okay")
})

app.listen(port, () => {
    console.log(port, "is Listening")
})