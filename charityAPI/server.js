const express = require('express');
const app = express();
const apiRouter = require('./controllerAPI/api-controller.js');

app.use(express.static('../charityWebApp'));
app.use('/api', apiRouter);
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});