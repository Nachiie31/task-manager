require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const tasksRouter = require('./routes/tasks');
const paymentsRouter = require('./routes/payments');

app.use('/api/tasks', tasksRouter);
app.use('/api', paymentsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task Manager API is running' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});