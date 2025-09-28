document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id'); 
  const errorEl = document.getElementById('error');

  if (!eventId) 
    {
    errorEl.textContent = 'Invalid activity ID';
    return;
  }
  try 
  {
    const res = await fetch(`http://localhost:3000/api/events/${eventId}`);
    if (!res.ok) throw new Error('Failed to obtain activity details');
    const event = await res.json();
    document.getElementById('event-title').textContent = event.event_name || 'Unknown Event';
    document.getElementById('event-date').textContent = new Date(event.event_date).toLocaleDateString() || 'N/A';
    document.getElementById('event-location').textContent = event.location || 'N/A';
    document.getElementById('ticket-price').textContent = (event.ticket_price || 0).toFixed(2);
    document.getElementById('org-name').textContent = event.org_name || 'N/A';
    document.getElementById('org-contact').textContent = event.contact || 'N/A';

    const progressPercent = event.goal_amount === 0 ? 0 : (event.progress_amount / event.goal_amount) * 100;
    const safePercent = Math.min(100, Math.max(0, progressPercent)); 
    document.getElementById('progress-fill').style.width = `${safePercent}%`;
    document.getElementById('progress-text').textContent = 
      `${safePercent.toFixed(1)}% Raised（¥${(event.progress_amount || 0).toFixed(2)} / ¥${(event.goal_amount || 0).toFixed(2)}）`;

    document.getElementById('register-btn').addEventListener('click', () => {
      alert('This feature is currently under construction.');
    });
  } 
  catch (err) 
  {
    errorEl.textContent = err.message;
  }
});