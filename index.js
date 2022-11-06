const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('ema john server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1mua1t2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const productCollection = client.db('emaJohnDb').collection('products')
        app.get('/products',async(req,res)=>{
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            console.log(page,size)
            const query = {};
            const cursor = productCollection.find(query)
            const products = await cursor.skip(page*size).limit(size).toArray()
            const count = await productCollection.estimatedDocumentCount();
            res.send({count,products});
        })

        app.post('/productsByIds',async(req,res)=>{
            const id = req.body;
            const objectIds = id.map(ids=>ObjectId(ids))
            const query={_id:{$in: objectIds}};
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
    }
    finally {
        
    }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log(`ema john running on: ${port}`)
})