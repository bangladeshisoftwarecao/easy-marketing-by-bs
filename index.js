require('dotenv');
const express = require('express');
const cors = require('cors');
const easyMarketing = require('./library/easy-marketing');
const path = require('path');
const app = express();

// setting
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

// declare dependencies
app.use('/easy-marketing', easyMarketing);
app.use(
  '/easy_marketing_uploads',
  express.static(path.join(process.cwd(), 'easy_marketing_uploads')),
);

// Run
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('running app.');
});
