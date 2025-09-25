const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events'); 
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/events', eventsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});