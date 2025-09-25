const express = require('express');
const router = express.Router();
const pool = require('../db/connection'); 

router.get('/', async (req, res) => {
  try 
  {
    const [rows] = await pool.query(`
      SELECT e.*, c.category_name, o.org_name
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organizations o ON e.org_id = o.org_id
      WHERE e.is_upcoming = 1 AND e.is_suspended = 0
      ORDER BY e.event_date ASC
    `);
    res.json(rows);
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  const { date, location, category } = req.query;
  let query = `
    SELECT e.*, c.category_name, o.org_name
    FROM events e
    JOIN categories c ON e.category_id = c.category_id
    JOIN organizations o ON e.org_id = o.org_id
    WHERE e.is_upcoming = 1 AND e.is_suspended = 0
  `;
  const params = [];

  if (date) 
    {
    query += ' AND DATE(e.event_date) = ?';
    params.push(date);
  }
  if (location) 
    {
    query += ' AND e.location LIKE ?';
    params.push(`%${location}%`);
  }
  if (category) 
    {
    query += ' AND e.category_id = ?';
    params.push(category);
  }

  try 
  {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const eventId = req.params.id;
  try 
  {
    const [rows] = await pool.query(`
      SELECT e.*, c.category_name, o.org_name, o.mission, o.contact
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organizations o ON e.org_id = o.org_id
      WHERE e.event_id = ?
    `, [eventId]);

    if (rows.length === 0) 
    {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(rows[0]);
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;