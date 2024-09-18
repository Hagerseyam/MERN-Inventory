const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(PORT , ()=>{
                console.log(`listening on port ${PORT}`);
        });
    })

    .catch(error => console.error('Error connecting to MongoDB:', error));