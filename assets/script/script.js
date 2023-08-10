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

//Handling the local Storage
var searchHistoryContainer = document.getElementById('search-history');
//To keep the display clean
var MAX_SEARCH_HISTORY = 5;

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

//Display Today's Weather 
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

//Display The forecast
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

//Set item firstly
function saveSearchHistory() {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

//Get item
function loadSearchHistory() {
  var storedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  return storedSearchHistory.slice(0, MAX_SEARCH_HISTORY);
}

//Display Search history
function displaySearchHistory() {
  searchHistoryContainer.innerHTML = '';

  searchHistory.forEach(city => {
    var historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => {
      fetchWeatherData(city);
    });
    searchHistoryContainer.appendChild(historyItem);
  });
}

// Using a Queue concept, Push and Pop, Keep last 5 recent
function addToSearchHistory(city) {
  var index = searchHistory.indexOf(city);
  if (index !== -1) {
    searchHistory.splice(index, 1);
  }

  searchHistory.unshift(city);
  if (searchHistory.length > MAX_SEARCH_HISTORY) {
    searchHistory.pop();
  }

  saveSearchHistory();
  displaySearchHistory();
}

//Search Form
cityForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var cityName = cityInput.value.trim();
  if (cityName !== '') {
    fetchWeatherData(cityName);
    addToSearchHistory(cityName);
  }
});

var searchHistory = loadSearchHistory()
displaySearchHistory();