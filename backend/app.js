const express = require('express');
const mysql = require('mysql');
const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello from server!',
    actual: 'Fuckoff'
  });
})

app.listen(3000, (req,res) => {
    console.log('Listening on port 3000');
})