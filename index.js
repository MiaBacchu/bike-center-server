const express=require('express')
const { MongoClient } = require('mongodb');
const cors =require('cors')
require('dotenv').config()
const ObjectId=require('mongodb').ObjectId;
const { ObjectID } = require('bson');
const app=express()
const port=process.env.PORT || 5000;

// middleware\
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m0n59.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    async function run (){
        try{
            await client.connect();
            const database = client.db("bike-center");
            const bikeCollection = database.collection("bike");
            const orderCollection=database.collection("order")
            const reviewCollection=database.collection("review")
            const userCollection=database.collection("user")

            app.get('/bike', async (req,res)=>{
                const cursor = bikeCollection.find({});
                const bike= await cursor.toArray()
                res.json(bike)
            })

            app.get('/order/:email', async (req,res)=>{
                const email=req.params.email
                const query={userEmail:email}
                const cursor = orderCollection.find(query);
                const order= await cursor.toArray()
                res.json(order)
            })

            app.get('/order',async(req,res)=>{
                const cursor=orderCollection.find({})
                const order=await cursor.toArray()
                res.json(order)
            })

            app.get('/bike/:id',async (req,res)=>{
                const id=req.params.id
                const query={_id:ObjectId(id)}
                const result=await bikeCollection.findOne(query)
                res.json(result)
            })

            app.post('/order', async (req,res)=>{
                const newOrder=req.body;
                const result= await orderCollection.insertOne(newOrder)
                res.json(result)
            })

            app.post('/bike',async(req,res)=>{
                const newBike=req.body;
                const result=await bikeCollection.insertOne(newBike)
                res.json(result)
            })

            app.delete('/bike/:id',async(req,res)=>{
                const id=req.params.id;
                const query={_id:ObjectId(id)}
                const result=await bikeCollection.deleteOne(query)
                res.json(result)
            })

            app.post('/review', async (req,res)=>{
                const newReview=req.body
                const result= await reviewCollection.insertOne(newReview)
                res.json(result)
            })
            
            app.post('/user', async (req,res)=>{
                const newUser=req.body
                const result=await userCollection.insertOne(newUser)
                res.json(result)
            })

            app.get('/review', async (req,res)=>{
                const cursor = reviewCollection.find({});
                const result= await cursor.toArray()
                res.json(result)
            })

            app.delete('/order/:id', async (req,res)=>{
                const id=req.params.id
                const query={_id:ObjectId(id)}
                const result=await orderCollection.deleteOne(query)
                res.json(result)
            })

            app.put('/user', async(req,res)=>{
                const user=req.body;
                const filter={email:user.email}
                const options = { upsert: true }
                const updateDoc = {$set:user};
                const result= await userCollection.updateOne(filter,updateDoc,options)
                res.json(result)
            })

            app.put('/order/:id',async(req,res)=>{
                const id=req.params.id;
                const query={_id:ObjectID(id)}
                const updateDoc={$set:{status:'shipped'}}
                const result=await orderCollection.updateOne(query,updateDoc)
                res.json(result)
            })

            app.put('/user/admin', async(req,res)=>{
                const user=req.body;
                const filter={email:user.email}
                const updateDoc = {$set:{role:'admin'}};
                const result= await userCollection.updateOne(filter,updateDoc)
                res.json(result)
            })

            app.get('/user/:email', async (req,res)=>{
                const email=req.params.email
                const query={email:email}
                const result = await userCollection.findOne(query);
                let admin=false
                if (result.role==='admin') {
                    admin=true
                }
                res.json(admin)
            })

        }
        finally{
            // await client.close()
        }
    }
    run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('hello world')
})
app.listen(port,()=>{console.log('server is running on port',port)})