const express = require('express');
const pool = require('../event_db');
const router = express.Router();

router.get('/events/home', async (req, res) => {
  try 
  {
    const [events] = await pool.query(`
      SELECT 
        e.EventID, e.EventName, e.EventDate, 
        c.CategoryName, l.LocationName, e.ImageURL
      FROM Event e
      JOIN Category c ON e.CategoryID = c.CategoryID
      JOIN Location l ON e.LocationID = l.LocationID
      WHERE 
        e.status != 'suspended' 
        AND e.EventDate >= CURDATE()  
      ORDER BY e.EventDate ASC
    `);
    res.json(events);
  } 
  catch (err) 
  {
    console.error('Home API Error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/events/search', async (req, res) => {
  const { date, locationId, categoryId } = req.query; 
  let sql = `
    SELECT 
      e.EventID, e.EventName, e.EventDate, 
      c.CategoryName, l.LocationName, e.ImageURL
    FROM Event e
    JOIN Category c ON e.CategoryID = c.CategoryID
    JOIN Location l ON e.LocationID = l.LocationID
    WHERE e.status != 'suspended'
  `;
  const params = [];

  if (date) 
    {
    sql += ' AND DATE(e.EventDate) = ?';
    params.push(date);
  }
  if (locationId) 
    {
    sql += ' AND e.LocationID = ?';
    params.push(locationId);
  }
  if (categoryId) 
    {
    sql += ' AND e.CategoryID = ?';
    params.push(categoryId);
  }

  sql += ' ORDER BY e.EventDate ASC';

  try 
  {
    const [events] = await pool.query(sql, params);
    res.json({ data: events });
  } 
  catch (err) 
  {
    console.error('Search API Error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/events/detail', async (req, res) => {
  try {
    const { id } = req.query;
    const eventId = parseInt(id);
    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({ error: 'Invalid Event ID' });
    }

    const [eventData] = await pool.query(`
      SELECT e.*, c.CategoryName, l.LocationName, l.VenueDetails, 
             o.OrgName, o.PhoneNumber
      FROM Event e
      JOIN Category c ON e.CategoryID = c.CategoryID
      JOIN Location l ON e.LocationID = l.LocationID
      JOIN Organisation o ON e.OrgID = o.OrgID
      WHERE e.EventID = ? AND e.status != 'suspended'
    `, [eventId]);
    
    if (eventData.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(eventData[0]);

  } catch (err) {
    console.error('Detail API Error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch details', 
      details: err.message 
    });
  }
});
module.exports = router;
