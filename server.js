require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const tasksRouter = require('./routes/tasks');
const paymentsRouter = require('./routes/payments');

app.use('/api/tasks', tasksRouter);
app.use('/api', paymentsRouter);

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;