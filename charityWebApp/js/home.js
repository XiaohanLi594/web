document.addEventListener('DOMContentLoaded', async () => {
  // Get references to DOM elements
  const eventsContainer = document.getElementById('homeEvents'); 
  const errorContainer = document.getElementById('homeError'); 
  try 
  {
    // Fetch event data from the API for the homepage
    const response = await fetch('/api/events/home');
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const { data: events } = await response.json();
    // If no events are found, display a message
    if (events.length === 0) 
      {
      eventsContainer.innerHTML = '<p>No upcoming events found.</p>';
      return;
    }
    eventsContainer.innerHTML = `
      <div class="event-container">
        ${events.map(event => `
          <div class="event-card">
            ${event.ImageURL ? `
              <img 
                src="./images/${event.ImageURL}" 
                alt="${event.EventName}" 
                class="event-img"
              >` : ''}
            <div class="event-info">
              <h3>${event.EventName}</h3>
              <div class="event-meta">
                <span>Category: ${event.CategoryName}</span>
                <span>Location: ${event.LocationName}</span>
                <span>Date: ${new Date(event.EventDate).toLocaleDateString()}</span>
              </div>
              <a href="html/detail.html?id=${event.EventID}" class="detail-btn">View Details</a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } 
  catch (error) 
  {
    // Display error message if something fails
    errorContainer.textContent = error.message;
    errorContainer.style.display = 'block';
    eventsContainer.innerHTML = ''; 
  }
});