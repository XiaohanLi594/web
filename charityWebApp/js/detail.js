document.addEventListener('DOMContentLoaded', async () => {
  const detailContent = document.getElementById('detailContent');
  const detailError = document.getElementById('detailError');
  const registerBtn = document.getElementById('registerBtn');
  const registerModal = document.getElementById('registerModal');
  const modalClose = document.getElementById('modalClose');

  const eventId = new URLSearchParams(window.location.search).get('id');
  if (!eventId) {
    detailError.textContent = 'Event ID missing.';
    detailError.style.display = 'block';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/events/detail?id=${eventId}`);
    if (!response.ok) throw new Error('Detail fetch failed');
    const { event, tickets, goalVsProgress } = await response.json();

    const imageSrc = event.ImageURL ? `./images/${event.ImageURL}` : './images/placeholder/event_large.jpg';
    detailContent.innerHTML = `
      <img src="${imageSrc}" alt="${event.EventName}" class="detail-img">
      <div class="detail-info">
        <h1>${event.EventName}</h1>
        <div class="detail-meta">
          <span>Category: ${event.CategoryName}</span>
          <span>Location: ${event.LocationName}</span>
          <span>Venue: ${event.VenueDetails || 'Not specified'}</span>
          <span>Date: ${new Date(event.EventDate).toLocaleDateString()}</span>
          <span>Organizer: ${event.OrgName}</span>
          <span>Goal: ${goalVsProgress}</span>
        </div>
        <p class="detail-desc">${event.Description || 'No description.'}</p>
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
  } catch (error) {
    detailError.textContent = error.message;
    detailError.style.display = 'block';
  }

  registerBtn.addEventListener('click', () => { registerModal.style.display = 'flex'; });
  modalClose.addEventListener('click', () => { registerModal.style.display = 'none'; });
  window.addEventListener('click', e => {
    if (e.target === registerModal) registerModal.style.display = 'none';
  });
});