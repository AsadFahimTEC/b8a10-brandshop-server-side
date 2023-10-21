const express = require("express");
const cors = require("cors");
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5070;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgpgxo2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const brandCollection = client.db("productsDB").collection("brands");
    const productCollection = client.db("productsDB").collection("products");

    // brandRoutes

    app.get("/brands/:brandId", async (req, res) => {
      const {brandId} = req.params;

      const cursor = await productCollection.find({
        type: brandId,
      });

      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/brands", async (req, res) => {
      const brand = req.body;
      const result = await brandCollection.insertOne(brand);
      res.send(result);
    });

    app.get("/brands", async (req, res) => {
      const cursor = await brandCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // products routes
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedProduct = req.body;
      console.log(updatedProduct)
      const product = {
        $set: {
          name: updatedProduct.name,
          photo: updatedProduct.photo,
          type: updatedProduct.type,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      // console.log(query);
      const result = await productCollection.findOne(query);
      // const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = await productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //my cart
    app.patch("/my-cart/:id", async (req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const cursor = await productCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/my-cart/:email", async (req, res) => {
      const email = req.params.email;
      const query = {userEmail: email};
      const cursor = await productCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ping: 1});
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Brand Shop CRUD Server is Running");
});

app.listen(port, () => {
  console.log(`Brand Shop CRUD server running on the PORT: ${port}`);
});
