const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const moviesRouter = require('./src/route/movies');
const errorHandler = require('./src/middlewares/errorHandler');
const dbUrl = process.env.DB_URL;

// Middleware
app.use(errorHandler);
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

app.use('/movies', moviesRouter);

// MongoDB connection
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => {
  console.error(`Error connecting to MongoDB: ${err}`);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// - Error handling middleware to gracefully handle various types of errors.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
