document.addEventListener('DOMContentLoaded', async () => {
  // Get references to DOM elements
  const searchForm = document.getElementById('searchForm'); 
  const resultsContainer = document.getElementById('searchResults'); 
  const errorContainer = document.getElementById('searchError'); 
  const clearBtn = document.getElementById('clearFilters'); 
  const locationSelect = document.getElementById('location'); 
  const categorySelect = document.getElementById('category'); 
  // Load and populate location options
  try 
  {
    const locRes = await fetch('/api/locations'); 
    if (!locRes.ok) throw new Error('Failed to load locations');
    const { data: locations } = await locRes.json(); 
    // Add default "All Locations" option
    locationSelect.innerHTML = `<option value="all">All Locations</option>`;
    // Add each location as a dropdown option
    locations.forEach(loc => {
      locationSelect.innerHTML += `<option value="${loc.LocationID}">${loc.LocationName}</option>`;
    });
  } 
  catch (err) 
  {
    console.error('Location load error:', err);
    locationSelect.innerHTML = `<option value="all">All Locations (load failed)</option>`;
  }
  // Load and populate category options
  try 
  {
    const catRes = await fetch('/api/categories'); 
    if (!catRes.ok) throw new Error('Failed to load categories');
    const { data: categories } = await catRes.json(); 
    // Add default "All Categories" option
    categorySelect.innerHTML = `<option value="all">All Categories</option>`;
    // Add each category as a dropdown option
    categories.forEach(cat => {
      categorySelect.innerHTML += `<option value="${cat.CategoryID}">${cat.CategoryName}</option>`;
    });
  } 
  catch (err) 
  {
    console.error('Category load error:', err);
    categorySelect.innerHTML = `<option value="all">All Categories (load failed)</option>`;
  }

  // Handle "Clear Filters" button click
  clearBtn.addEventListener('click', () => {
    searchForm.reset(); 
    resultsContainer.innerHTML = 'Select filters and search';
    errorContainer.textContent = ''; 
    errorContainer.style.display = 'none'; 
  });
  // Handle search form submission
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    errorContainer.style.display = 'none'; 
    resultsContainer.innerHTML = 'Searching...';
    // Collect and process form data
    const formData = new FormData(searchForm);
    const searchParams = new URLSearchParams();
    // Add only non-empty and non-"all" values to search parameters
    formData.forEach((value, key) => {
      if (value && value !== 'all') 
        {
        searchParams.append(key, value);
      }
    });
    try 
    {
      const response = await fetch(`/api/events/search?${searchParams.toString()}`);
      if (!response.ok) throw new Error(`Search failed (Status: ${response.status})`);
      const { data: events } = await response.json(); 
      // Show message if no events match filters
      if (events.length === 0) 
        {
        resultsContainer.innerHTML = '<p>No matching events found.</p>';
        return;
      }
      // Display search results as event cards
      resultsContainer.innerHTML = `
        <div class="event-container">
          ${events.map(event => `
            <div class="event-card">
              ${event.ImageURL ? `
                <img 
                  src="../images/${event.ImageURL}" 
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
                <a href="detail.html?id=${event.EventID}" class="detail-btn">View Details</a>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } 
    catch (error) 
    {
      errorContainer.textContent = `Error: ${error.message}`;
      errorContainer.style.display = 'block';
      resultsContainer.innerHTML = ''; 
    }
  });
});