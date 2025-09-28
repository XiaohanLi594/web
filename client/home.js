document.addEventListener('DOMContentLoaded', async () => {
  const eventList = document.getElementById('event-list');
  const errorEl = document.getElementById('error');

  try 
  {
    const res = await fetch('http://localhost:3000/api/events');
    if (!res.ok) throw new Error('Failed to get events');
    const events = await res.json();

    events.forEach(event => {
      eventList.innerHTML += `
        <div class="event-card" onclick="location.href='event.html?id=${event.event_id || ''}'">
          <h3>${event.event_name || 'Unknown Event'}</h3>
          <p><strong>Category:</strong> ${event.category_name || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString() || 'N/A'}</p>
          <p><strong>Location:</strong> ${event.location || 'N/A'}</p>
        </div>
      `;
    });
  } 
  catch (err) 
  {
    errorEl.textContent = err.message;
  }
});