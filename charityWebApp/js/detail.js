document.addEventListener('DOMContentLoaded', async () => {
  // Get references to DOM elements
  const detailContent = document.getElementById('detailContent'); 
  const detailError = document.getElementById('detailError');     
  const registerBtn = document.getElementById('registerBtn');     
  const registerModal = document.getElementById('registerModal'); 
  const modalClose = document.getElementById('modalClose');       
  // Get event ID from URL parameters 
  const eventId = new URLSearchParams(window.location.search).get('id');
  // If no event ID in URL, show error and exit
  if (!eventId) 
    {
    detailError.textContent = 'Event ID missing.';
    detailError.style.display = 'block';
    return;
  }
  try 
  {
    // Fetch event details from API using the event ID
    const response = await fetch(`/api/events/detail?id=${eventId}`);
    // Check if API request was successful
    if (!response.ok) 
      {
      const errData = await response.json().catch(() => ({})); 
      throw new Error(errData.error || `API error: ${response.status}`);
    }
    // Extract event data and tickets from response
    const { event, tickets = [] } = await response.json();
    const goalVsProgress = "The current fundraising progress is at 77%"; 
    const imageSrc = event.ImageURL ? `../images/${event.ImageURL}` : ''; 
    // Render event details into the page
    detailContent.innerHTML = `
      ${imageSrc ? `<img src="${imageSrc}" alt="${event.EventName}" class="detail-img">` : ''}
      <div class="detail-info">
        <h1>${event.EventName}</h1>
        <div class="detail-meta">
          <span>Category: ${event.CategoryName}</span>
          <span>Location: ${event.LocationName}</span>
          <span>Venue: ${event.VenueDetails || 'Not specified'}</span>
          <span>Date: ${new Date(event.EventDate).toLocaleDateString()}</span>
          <span>Organizer: ${event.OrgName || 'Unknown Organization'}</span>
          <span>${goalVsProgress}</span>
        </div>
        <p class="detail-desc">${event.Description || 'No description available.'}</p>
        ${tickets.length > 0 ? `
          <div class="detail-tickets">
            <h3>Tickets</h3>
            <ul>
              ${tickets.map(t => `<li>${t.TicketName}: $${t.Price} (${t.Quantity} left)</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
    registerBtn.style.display = 'block';
  } 
  catch (error) 
  {
    detailError.textContent = `Error: ${error.message}`;
    detailError.style.display = 'block';
  }

  // Open registration modal when button is clicked
  registerBtn.addEventListener('click', () => { registerModal.style.display = 'flex'; });
  // Close modal when X button is clicked
  modalClose.addEventListener('click', () => { registerModal.style.display = 'none'; });
  // Close modal when clicking outside of it
  window.addEventListener('click', e => {
    if (e.target === registerModal) registerModal.style.display = 'none';
  });
});