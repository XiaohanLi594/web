const express = require('express');
const cors = require('cors');
const path = require('path');

const appAPI = require('./controllerAPI/api-controller');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../client')));

app.use('/api', appAPI);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
