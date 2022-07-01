const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bobdf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const taskCollection =client.db('end_game').collection('task');
        const finishedCollection =client.db('end_game').collection('finished');

      // user add task 
      app.post("/task", async (req, res) => {
        const task = req.body;
        const result = await taskCollection.insertOne(task)
        res.send(result);
      });
      
      // user get all task
      app.get('/allTask',async(req,res)=>{
        const query={}
        const cursor = taskCollection.find(query);
        const result = await cursor.toArray();
        res.send(result)
      });

      // user update task
      app.put('/task/:id', async (req, res) => {
        const id = req.params.id;
        const updateTask = req.body;
        const filter = { _id: ObjectId(id) }
        const options = {upsert:true}
        const updateDoc = {
            $set: {
                task:updateTask.task
            }
        }
        const result = await taskCollection.updateOne(filter, updateDoc,options)
        res.send(result)
    });

    // user post completed route
    app.post("/finished", async (req, res) => {
      const task = req.body;
      const result = await finishedCollection.insertOne(task)
      res.send(result);
    });

    // user get all task
    app.get('/allTask/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id)
      const query={_id:ObjectId(id)} 
      const cursor = await taskCollection.findOne(query);
      // const result = await cursor.toArray();
      res.send(cursor)
    });

    // user task delete
    app.delete('/task/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)}
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })

    // get all completed task
    app.get('/allfinished',async(req,res)=>{
      const query={}
      const cursor = finishedCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    });

    }
    finally{
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From Alif exclusive')
})

app.listen(port, () => {
  console.log(`Alif Exclusive listening on port ${port}`)
})