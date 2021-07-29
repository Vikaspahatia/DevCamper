const express = require('express');
const dotenv = require('dotenv');
//const logger = require('./middleware/logger');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect Database
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

//Body Parser
app.use(express.json());

//Dev logging middleware     used to use this code -> app.use(logger);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.cyan.bold)
);


// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //close server and exit process
    server.close(() => process.exit(1));
})

