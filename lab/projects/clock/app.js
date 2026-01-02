// Clock App - Updates time every second
function updateClock() {
  const now = new Date();
  
  // Format time as HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  
  // Format date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString(undefined, options);
  
  // Update DOM
  document.getElementById('clock').textContent = timeString;
  document.getElementById('date').textContent = dateString;
}

// Initial call and interval
updateClock();
setInterval(updateClock, 1000);
