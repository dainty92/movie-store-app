const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const moviesRouter = require('./src/route/movies');

// Middleware
app.use(express.json());

app.use('/movies', moviesRouter);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/movie-store', {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
