const express = require('express');
const pool = require('../event_db');
const router = express.Router(); 

router.get('/events/home', async (req, res) => {
  try {
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
  } catch (err) {
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

  if (date) {
    sql += ' AND DATE(e.EventDate) = ?';
    params.push(date);
  }
  if (locationId) {
    sql += ' AND e.LocationID = ?';
    params.push(locationId);
  }
  if (categoryId) {
    sql += ' AND e.CategoryID = ?';
    params.push(categoryId);
  }

  sql += ' ORDER BY e.EventDate ASC';

  try {
    const [events] = await pool.query(sql, params);
    res.json({ data: events });
  } catch (err) {
    console.error('Search API Error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/events/detail', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Event ID required' });

  try {
    const [eventBasic] = await pool.query(`
      SELECT 
        e.*, c.CategoryName, l.LocationName, l.VenueDetails,
        o.OrgName, o.ContactPhone
      FROM Event e
      JOIN Category c ON e.CategoryID = c.CategoryID
      JOIN Location l ON e.LocationID = l.LocationID
      JOIN Organisation o ON e.OrgID = o.OrgID
      WHERE e.EventID = ? AND e.status != 'suspended'
    `, [id]);

    if (eventBasic.length === 0) 
      return res.status(404).json({ error: 'Event not found' });

    const [tickets] = await pool.query(`
      SELECT TicketName, Price, Quantity FROM Ticket WHERE EventID = ?
    `, [id]);

    const goalVsProgress = `${eventBasic[0].CurrentAmount || 0}/${eventBasic[0].Goal} (funds raised)`;

    res.json({
      event: eventBasic[0],
      tickets: tickets,
      goalVsProgress: goalVsProgress
    });
  } catch (err) {
    console.error('Detail API Error:', err);
    res.status(500).json({ error: 'Detail fetch failed' });
  }
});

module.exports = router;