const express = require('express')
const cors = require('cors')
require ('dotenv').config()
const port = process.env.PORT || 5070
const app = express ()

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Brand Shop CRUD Server is Running')
})


app.listen(port, () =>{
    console.log(`Brand Shop CRUD server running on the PORT: ${port}`);
})