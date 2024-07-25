require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const { logger, logEvents } = require('./middleware/logger');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');


const PORT = process.env.PORT || 3500;

if (!process.env.NODE_ENV) {
    console.error('NODE_ENV is not defined!');
}

connectDB();

app.use(logger);

app.use(cors(corsOptions)); // Use only the one with corsOptions if you have specific settings
app.use(cookieParser());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use('/', require('./routes/root'));

app.use('/users', require('./routes/userRoutes'));
app.use('/notes', require('./routes/notesRoutes'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts('json')) {
        res.json({ message: "Page not found" });
    } else {
        res.type('txt').send('Page not found');
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    console.log('MongoDB Connected...');
});

mongoose.connection.on('error', err => {
    console.error(`MongoDB connection error: ${err.message}`);
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
