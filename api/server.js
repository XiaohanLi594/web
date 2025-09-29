require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./connection.js'); 
const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors()); 
app.use(express.json()); 

app.get('/api/events', async (req, res) => {
  try 
  {
    const db = await connectDB();
    const today = new Date().toISOString().split('T')[0]; 
    const [rows] = await db.query(`
      SELECT e.event_id, e.event_name, e.event_date, e.location, 
             e.current_amount, e.goal_amount, c.category_name 
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organizations o ON e.org_id = o.org_id
      WHERE e.event_date >= ?; 
    `, [today]);
    db.release(); 
    res.json(rows); 
  } 
  catch (err)
  {
    res.status(500).json({ error: 'Failed to get events: ' + err.message });
  }
});

app.get('/api/events/search', async (req, res) => {
  try 
  {
    const db = await connectDB();
    const { location, date, category } = req.query; 
    let sql = `
      SELECT e.event_id, e.event_name, e.event_date, e.location, 
             e.current_amount, e.goal_amount, c.category_name  
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organizations o ON e.org_id = o.org_id
      WHERE 1=1 
    `;
    const params = [];

    if (location) 
      {
      sql += ' AND e.location LIKE ?';
      params.push(`%${location}%`); 
    }
    if (date) 
      {
      sql += ' AND e.event_date = ?';
      params.push(date); 
    }
    if (category) 
      {
      sql += ' AND e.category_id = ?';
      params.push(category); 
    }

    const [rows] = await db.query(sql, params);
    db.release();
    res.json(rows); 
  } 
  catch (err)
  {
    res.status(500).json({ error: 'Search failed: ' + err.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try 
  {
    const db = await connectDB();
    const { id } = req.params; 
    const [rows] = await db.query(`
      SELECT e.*, c.category_name, o.org_name, o.mission, o.contact,
             e.current_amount AS progress_amount  
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organizations o ON e.org_id = o.org_id
      WHERE e.event_id = ?;  
    `, [id]);
    db.release();
    res.json(rows[0] || {}); 
  } 
  catch (err) 
  {
    res.status(500).json({ error: 'Failed to get event detail: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
