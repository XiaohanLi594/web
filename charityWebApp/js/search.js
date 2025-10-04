document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const resultsContainer = document.getElementById('searchResults');
  const errorContainer = document.getElementById('searchError');
  const clearBtn = document.getElementById('clearFilters');

  clearBtn.addEventListener('click', () => {
    searchForm.reset();
    resultsContainer.innerHTML = 'Select filters and search';
    errorContainer.textContent = '';
    errorContainer.style.display = 'none'; 
  });

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorContainer.style.display = 'none'; 
    resultsContainer.innerHTML = 'Searching...'; 

    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams();

    formData.forEach((value, key) => {
      if (value && value !== 'all') { 
        searchParams.append(key, value);
      }
    });

    try {
      const response = await fetch(`/api/events/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Search failed (Status: ${response.status})`);
      }

      const { data: events } = await response.json();

      if (events.length === 0) {
        resultsContainer.innerHTML = '<p>No matching events found.</p>';
        return;
      }

      resultsContainer.innerHTML = events.map(event => `
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
      resultsContainer.innerHTML = '';
    }
  });
});

function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
}
    