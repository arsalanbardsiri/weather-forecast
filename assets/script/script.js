/*
var apiKey = "b817a1849f5e68151e284fd9808e2999";
var testCity = "London";
var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${testCity}&APPID=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
*/

//Todo, Now that the access is approved, Data access based on input.

var apiKey = 'b817a1849f5e68151e284fd9808e2999'; //OpenWeatherMap API key

//Search box
var cityForm = document.getElementById('city-form');
var cityInput = document.getElementById('city-input');

//Todays Weather
var currentWeatherSection = document.getElementById('current-weather');

//Next 5 days
var forecastSection = document.getElementById('forecast');

//Fetch Todays
function fetchWeatherData(cityName) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      fetchForecastData(data.coord.lat, data.coord.lon);
      displayCurrentWeather(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

//Fetch Forecast
function fetchForecastData(lat, lon) {
  var forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(forecastApiUrl)
    .then(response => response.json())
    .then(data => {
      displayForecast(data.list);
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
    });
}

function displayCurrentWeather(weatherData) {
  currentWeatherSection.innerHTML = `
    <h2>${weatherData.name}</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Temperature: ${weatherData.main.temp}°F</p>
    <p>Humidity: ${weatherData.main.humidity}%</p>
    <p>Wind Speed: ${weatherData.wind.speed} mph</p>
    <img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather Icon">
  `;
}

function displayForecast(forecastList) {
  forecastSection.innerHTML = '';

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (var forecast of forecastList) {
    var forecastDate = new Date(forecast.dt * 1000);
    if (forecastDate.getDate() === tomorrow.getDate()) {
      var forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');

      forecastItem.innerHTML = `
        <h3>Date: ${forecastDate.toLocaleDateString()}</h3>
        <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather Icon">
        <p>Temp: ${forecast.main.temp}°F</p>
        <p>Wind: ${forecast.wind.speed} mph</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
      `;

      forecastSection.appendChild(forecastItem);
      tomorrow.setDate(tomorrow.getDate() + 1); // Move to the next day
    }
  }
}



cityForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var cityName = cityInput.value.trim();
  if (cityName !== '') {
    fetchWeatherData(cityName);
  }
});

displaySearchHistory();