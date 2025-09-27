document.addEventListener('DOMContentLoaded', async () => {
  const searchForm = document.getElementById('search-form');
  const searchResults = document.getElementById('search-results');
  const errorEl = document.getElementById('error');
  const clearBtn = document.getElementById('clear-btn');
  const categorySelect = document.getElementById('category');

  async function loadCategories() 
  {
    try 
    {
      const response = await fetch('http://localhost:3000/api/categories');
      if (!response.ok) throw new Error('Failed to retrieve category');
      const categories = await response.json();
      categories.forEach(cat => {
        categorySelect.innerHTML += `<option value="${cat.category_id}">${cat.category_name}</option>`;
      });
    } 
    catch (err) 
    {
      errorEl.textContent = err.message;
    }
  }

  loadCategories();

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams(formData);
    const searchUrl = `http://localhost:3000/api/events/search?${searchParams.toString()}`;

    try 
    {
      const response = await fetch(searchUrl);
      if (!response.ok) throw new Error('Search activity failed');
      const events = await response.json();

      searchResults.innerHTML = '';
      if (events.length === 0) 
        {
        searchResults.innerHTML = '<p>No activity found that meets the criteria</p>';
        return;
      }

      events.forEach(event => {
        const progressPercent = (event.progress_amount / event.goal_amount) * 100;
        searchResults.innerHTML += `
          <div class="event-card" onclick="location.href='event.html?id=${event.event_id}'">
            <h3>${event.event_name}</h3>
            <p><strong>Category：</strong>${event.category_name}</p>
            <p><strong>Date：</strong>${new Date(event.event_date).toLocaleDateString()}</p>
            <p><strong>Iocation：</strong>${event.location}</p>
            <div class="progress-bar">
              <div class="progress" style="width: ${progressPercent}%"></div>
            </div>
          </div>
        `;
      });
    } 
    catch (err) 
    {
      errorEl.textContent = err.message;
    }
  });

  clearBtn.addEventListener('click', () => {
    searchForm.reset();
    searchResults.innerHTML = '';
  });
});