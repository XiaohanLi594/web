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
    const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
    if (!response.ok) throw new Error('Failed to obtain activity details');
    const event = await response.json();

    document.getElementById('event-title').textContent = event.event_name;
    document.getElementById('event-date').textContent = new Date(event.event_date).toLocaleDateString();
    document.getElementById('event-location').textContent = event.location;
    document.getElementById('ticket-price').textContent = event.ticket_price.toFixed(2);
    document.getElementById('org-name').textContent = event.org_name;
    document.getElementById('org-mission').textContent = event.mission;
    document.getElementById('org-contact').textContent = event.contact;

    const progressPercent = (event.progress_amount / event.goal_amount) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('progress-text').textContent = 
      `${progressPercent.toFixed(1)}% Raised（¥${event.progress_amount.toFixed(2)} / ¥${event.goal_amount.toFixed(2)}）`;

    document.getElementById('register-btn').addEventListener('click', () => {
      alert('The registration function is about to be launched, please stay tuned!');
    });
  } 
  catch (err) 
  {
    errorEl.textContent = err.message;
  }
});