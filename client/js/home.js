document.addEventListener('DOMContentLoaded', async () => {
  const eventsContainer = document.getElementById('homeEvents');
  const errorContainer = document.getElementById('homeError');

  try {
    const response = await fetch('http://localhost:3000/api/events/home');
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const events = await response.json();

    if (events.length === 0) {
      eventsContainer.innerHTML = '<p>No upcoming events found.</p>';
      return;
    }

    eventsContainer.innerHTML = events.map(event => `
      <div class="event-card">
        <img 
          src="${event.ImageURL ? `./images/${event.ImageURL}` : './images/placeholder/event_small.jpg'}" 
          alt="${event.EventName}" 
          class="event-img"
        >
        <div class="event-info">
          <h3>${event.EventName}</h3>
          <div class="event-meta">
            <span>Category: ${event.CategoryName}</span>
            <span>Location: ${event.LocationName}</span>
            <span>Date: ${new Date(event.EventDate).toLocaleDateString()}</span>
          </div>
          <a href="detail.html?id=${event.EventID}">View Details</a>
        </div>
      </div>
    `).join('');
  } catch (error) {
    errorContainer.textContent = error.message;
    errorContainer.style.display = 'block';
    eventsContainer.innerHTML = '';
  }
});