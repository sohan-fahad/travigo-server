const express = require("express");
const cors = require("cors")
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dki2q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db("travigoDB");
        const serviceCollection = database.collection("services");
        const bookingCollection = database.collection("bookingInfo");

        // POST SERVICE API
        app.post("/services", async (req, res) => {
            const result = await serviceCollection.insertOne(req.body)
            res.send(result)
        })

        // GET SERVICES API
        app.get("/services", async (req, res) => {
            const query = await serviceCollection.find({});
            const result = await query.toArray()
            res.send(result)
        })
        // Load Single API
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.send(result)
        })
        app.post("/booking", async (req, res) => {
            const result = await bookingCollection.insertOne(req.body)
            res.send(result)
            console.log(result)
        })
        // BOOKING API
        app.get("/booking", async (req, res) => {
            const query = await bookingCollection.find({})
            const result = await query.toArray()
            res.send(result)
        })

        //UPDATE API
        app.put("/booking/:id", async (req, res) => {
            const id = req.params.id
            const updatedInfo = req.body
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    status: updatedInfo.status
                },
            }
            const result = await bookingCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })


        // EMAIL FILTER
        app.get("/booking/:email", async(req, res)=> {
            const email = req.params.email
            const query = await bookingCollection.find({email})
            // console.log("query",query)
            const result = await query.toArray()
            res.send(result)
        })

        // DELETE API
        app.delete("/booking/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
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