require('dotenv');
const express = require('express');
const cors = require('cors');
const easyMarketing = require('./library/easy-marketing');

const app = express();

// setting
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

app.use('/easy-marketing', easyMarketing);

// Run
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('running app.');
});
