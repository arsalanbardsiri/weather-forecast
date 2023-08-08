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
