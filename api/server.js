const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000;

// Database configuration (replace with your cPanel info)
const dbConfig = {
  host: '27.50.66.115',        
  user: 'xli80_xli80',         
  password: '594594LXHlxh@', 
  database: 'xli80_charityevents_db', 
  port: 3306, 
  connectTimeout: 30000,                
  connectionLimit: 10,         
};

// Create global database connection pool (reused by all routes)
const pool = mysql.createPool(dbConfig);

// Check database connection on server startup
pool.getConnection()
  .then(conn => {
    console.log('Database connected successfully!');
    conn.release(); // Return connection to pool
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if connection fails
  });

// API: Get upcoming charity events (status=active & date ≥ today)
app.get('/api/events/upcoming', async (req, res) => {
  try 
  {
    const [rows] = await pool.query(`
      SELECT e.*, c.category_name, o.org_name
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organizations o ON e.org_id = o.org_id
      WHERE e.status = 'active' AND e.event_date >= CURDATE()
      ORDER BY e.event_date ASC
    `);
    res.json(rows);
  } 
  catch (err) 
  {
    console.error('Error in /upcoming:', err);
    res.status(500).json({ message: 'Database error', detail: err.message });
  }
});

// API: Search events by location (requires ?location= parameter)
app.get('/api/events/search', async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).send('Location parameter is required');
  }

  try 
  {
    const [rows] = await pool.query(`
      SELECT e.*, c.category_name, o.org_name
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organizations o ON e.org_id = o.org_id
      WHERE e.status = 'active' AND e.location LIKE ?
    `, [`%${location}%`]);
    res.json(rows);
  } 
  catch (err) 
  {
    console.error('Error in /search:', err);
    res.status(500).json({ message: 'Database error', detail: err.message });
  }
});

// API: Get event details by ID (ID must be a number)
app.get('/api/events/:id', async (req, res) => {
  const eventId = req.params.id;

  if (isNaN(Number(eventId))) {
    return res.status(400).send('Event ID must be a number');
  }

  try 
  {
    const [rows] = await pool.query(`
      SELECT e.*, c.category_name, o.org_name, o.mission
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organizations o ON e.org_id = o.org_id
      WHERE e.event_id = ?
    `, [eventId]);

    if (rows.length === 0) 
        {
      return res.status(404).send('Event not found');
    }
    res.json(rows[0]);
  } 
  catch (err) 
  {
    console.error('Error in /events/:id:', err);
    res.status(500).json({ message: 'Database error', detail: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});