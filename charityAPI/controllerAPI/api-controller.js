const express = require('express');
const router = express.Router();
const pool = require('../event_db.js');
// Get the homepage activity
router.get('/events/home', async (req, res) => {
  try 
  {
// Association activity, classification, location table; Select effective activities; Sort by date
    const [events] = await pool.query(`
      SELECT e.EventID, e.EventName, e.EventDate, 
             c.CategoryName, l.LocationName, e.ImageURL
      FROM Event e
      JOIN Category c ON e.CategoryID = c.CategoryID
      JOIN Location l ON e.LocationID = l.LocationID
      WHERE e.status != 'suspended' AND e.EventDate >= CURDATE()
      ORDER BY e.EventDate ASC
    `);
    res.json({ data: events });//Return activity data
  } 
  catch (err)
  {
    console.error('Home API Error:', err);
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
});
//Get activity details
router.get('/events/detail', async (req, res) => {
  try 
  {
    const { id } = req.query;
    const eventId = parseInt(id);
    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({ error: 'Invalid Event ID' });
    }
//Associate multiple tables to obtain complete activity information
    const [eventData] = await pool.query(`
      SELECT e.*, c.CategoryName, l.LocationName, l.VenueDetails, 
             o.OrgName, o.PhoneNumber AS OrgPhone
      FROM Event e
      JOIN Category c ON e.CategoryID = c.CategoryID
      JOIN Location l ON e.LocationID = l.LocationID
      JOIN Organisation o ON e.OrgID = o.OrgID  -- 匹配Event和Organisation的OrgID
      WHERE e.EventID = ? AND e.status != 'suspended'
    `, [eventId]);
    if (eventData.length === 0) 
      {
      return res.status(404).json({ error: 'Event not found or suspended' });
    }
//Get event tickets
    const [tickets] = await pool.query('SELECT TicketName, Price, Quantity FROM Ticket WHERE EventID = ?', [eventId]);
//Deal with fundraising goals
    const goalVsProgress = eventData[0].Goal 
      ? `Fundraising Goal: ${eventData[0].Goal}` 
      : 'Goal not specified';

    res.json({ 
      event: eventData[0], 
      tickets, 
      goalVsProgress 
    });
  } 
  catch (err) 
  {
    console.error('Detail API Error:', err); 
    res.status(500).json({ 
      error: 'Failed to fetch event details', 
      details: err.message 
    });
  }
});
//Search Activity
router.get('/events/search', async (req, res) => {
  const { date, locationId, categoryId } = req.query;
  let sql = `
    SELECT e.EventID, e.EventName, e.EventDate, 
           c.CategoryName, l.LocationName, e.ImageURL
    FROM Event e
    JOIN Category c ON e.CategoryID = c.CategoryID
    JOIN Location l ON e.LocationID = l.LocationID
    WHERE e.status != 'suspended'
  `;
  const params = [];
//Add filtering criteria
  if (date) { sql += ' AND DATE(e.EventDate) = ?'; params.push(date); }
  if (locationId) { sql += ' AND e.LocationID = ?'; params.push(locationId); }
  if (categoryId) { sql += ' AND e.CategoryID = ?'; params.push(categoryId); }
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
//Get all locations and categories
router.get('/locations', async (req, res) => {
  try 
  {
    const [locations] = await pool.query('SELECT LocationID, LocationName FROM Location');
    res.json({ data: locations });
  } 
  catch (err) 
  {
    console.error('Locations API Error:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});
router.get('/categories', async (req, res) => {
  try 
  {
    const [categories] = await pool.query('SELECT CategoryID, CategoryName FROM Category');
    res.json({ data: categories });
  } 
  catch (err) 
  {
    console.error('Categories API Error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;