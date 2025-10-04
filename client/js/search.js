document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const resultsContainer = document.getElementById('searchResults');
  const errorContainer = document.getElementById('searchError');
  const clearBtn = document.getElementById('clearFilters');

  clearBtn.addEventListener('click', () => {
    searchForm.reset();
    resultsContainer.innerHTML = 'Select filters and search';
    errorContainer.textContent = '';
  });

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams();

    formData.forEach((value, key) => {
      if (value) searchParams.append(key, value);
    });

    try {
      const response = await fetch(`http://localhost:3000/api/events/search?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Search failed');
      const { data: events } = await response.json();

      if (events.length === 0) {
        resultsContainer.innerHTML = '<p>No matching events.</p>';
        return;
      }

      resultsContainer.innerHTML = events.map(event => `
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
      resultsContainer.innerHTML = '';
    }
  });
});