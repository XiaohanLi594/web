document.addEventListener('DOMContentLoaded', async () => {
  const eventsContainer = document.getElementById('homeEvents');
  const errorContainer = document.getElementById('homeError');

  eventsContainer.innerHTML = 'Loading upcoming events...';
  errorContainer.style.display = 'none';

  try {
    const response = await fetch('/api/events/home');
    
    if (!response.ok) {
      throw new Error(`Failed to load events (Status: ${response.status})`);
    }

    const events = await response.json();

    if (events.length === 0) {
      eventsContainer.innerHTML = '<p>No upcoming events found.</p>';
      return;
    }

    eventsContainer.innerHTML = events.map(event => `
      <div class="event-card">
        ${event.ImageURL ? `
          <img 
            src="./images/${event.ImageURL}"  
            alt="Image for ${event.EventName}" 
            class="event-img"
          >` : ''}
        <div class="event-info">
          <h3>${event.EventName}</h3>
          <div class="event-meta">
            <span>Category: ${event.CategoryName}</span>
            <span>Location: ${event.LocationName}</span>
            <span>Date: ${formatDate(event.EventDate)}</span> 
          </div>
          <a href="detail.html?id=${event.EventID}">View Details</a>
        </div>
      </div>
    `).join('');

  } catch (error) {
    errorContainer.textContent = `Error: ${error.message}`;
    errorContainer.style.display = 'block';
    eventsContainer.innerHTML = '';
  }
});

function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
}
    