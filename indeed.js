const API_KEY = 'f4c17308fffe452f9d094910262006';
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherOutput = document.getElementById('weatherOutput');

searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter')
    fetchWeather();
});

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    weatherOutput.innerHTML = '<div class="error">Please enter a name of a city!</div>';
    return;
  }

  weatherOutput.innerHTML = '<div class="Loading">Loading your weathercast please wait...</div>';

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=2&aqi=no&alerts=no`;
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('City not found');
    }
    
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherOutput.innerHTML = `<div class="error">No internet connection: ${error.message}</div>`;
    console.error('ERROR', error);
  }
}

function displayWeather(data) {
  const current = data.current;
  const location = data.location;
  const forecast = data.forecast.forecastday;

  const html = `
    <div class="weather-info">
      <div class="location">${location.country}, ${location.name}</div>
      <div class="current-temp">${Math.round(current.temp_c)}°C</div>
      <div class="weather-desc">${current.condition.text}</div>
      
      <div class="weather-details">
        <div class="detail-item">
          <div class="detail-label">Humidity</div>
          <div class="detail-value">${current.humidity}%</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Wind Speed</div>
          <div class="detail-value">${Math.round(current.wind_kph)} km/h</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Feels Like:</div>
          <div class="detail-value">${Math.round(current.feelslike_c)}°C</div>
        </div>
      </div>
    </div>
    
    <div class="forecast">
      <div class="forecast-title">2-Day Forecast</div>
      <div class="forecast-cards">
        ${forecast.map(day => `
          <div class="forecast-card">
            <div class="forecast-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="forecast-temp">${Math.round(day.day.maxtemp_c)}° / ${Math.round(day.day.mintemp_c)}°</div>
            <div class="forecast-desc">${day.day.condition.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  weatherOutput.innerHTML = html;
}

// Load on page open
window.addEventListener('load', fetchWeather);