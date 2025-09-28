document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('search-form');
  const results = document.getElementById('search-results');
  const errorEl = document.getElementById('error');
  const clearBtn = document.getElementById('clear-btn');

  clearBtn.addEventListener('click', () => {
    form.reset();
    results.innerHTML = '';
    errorEl.textContent = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const location = formData.get('location'); 
    const searchUrl = `http://localhost:3000/api/events/search?location=${encodeURIComponent(location || '')}`;

    try 
    {
      const res = await fetch(searchUrl);
      if (!res.ok) throw new Error('Search failed');
      const events = await res.json();

      results.innerHTML = '';
      if (events.length === 0) 
        {
        results.innerHTML = '<div class="empty-result">No activity found that meets the criteria</div>';
        return;
      }

      events.forEach(event => 
        {
        results.innerHTML += `
          <div class="event-card" onclick="location.href='event.html?id=${event.event_id || ''}'">
            <h3>${event.event_name || 'Unknown Event'}</h3>
            <p><strong>Category:</strong> ${event.category_name || 'N/A'}</p>
            <p><strong>Location:</strong> ${event.location || 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString() || 'N/A'}</p>
          </div>
        `;
      });
    } 
    catch (err) 
    {
      errorEl.textContent = err.message;
    }
  });
});