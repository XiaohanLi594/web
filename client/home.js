document.addEventListener('DOMContentLoaded', async () => {
  const eventList = document.getElementById('event-list');
  const errorEl = document.getElementById('error');

  try 
  {
    const response = await fetch('http://localhost:3000/api/events');
    if (!response.ok) throw new Error('Failed to retrieve the activity');
    const events = await response.json();

    events.forEach(event => {
      const progressPercent = (event.progress_amount / event.goal_amount) * 100;
      eventList.innerHTML += `
        <div class="event-card" onclick="location.href='event.html?id=${event.event_id}'">
          <h3>${event.event_name}</h3>
          <p><strong>Category：</strong>${event.category_name}</p>
          <p><strong>Date：</strong>${new Date(event.event_date).toLocaleDateString()}</p>
          <p><strong>Iocation：</strong>${event.location}</p>
          <div class="progress-bar">
            <div class="progress" style="width: ${progressPercent}%"></div>
          </div>
          <p>Fundraising Progress：${progressPercent.toFixed(1)}%（¥${event.progress_amount} / ¥${event.goal_amount}）</p>
        </div>
      `;
    });
  } 
  catch (err) 
  {
    errorEl.textContent = err.message;
  }
});