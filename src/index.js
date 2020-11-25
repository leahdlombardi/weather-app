function formatDate(date, timezone) {
  let localOffsetInMs = date.getTimezoneOffset() * 60 * 1000;
  let targetOffsetInMs = timezone * 1000;
  let targetTimestamp = date.getTime() + localOffsetInMs + targetOffsetInMs;
  let localDate = new Date(targetTimestamp);

  let hours = localDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = localDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = localDate.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[dayIndex];
  return `${day}, ${hours}:${minutes}`;
}



function getCityTemperature(event) {
  event.preventDefault();
  let city = document.querySelector("#new-location").value;
  searchCity(city);
}


function displayTemperature(response) {
  let descriptionElement = document.querySelector("#description")
  let currentTemperature = Math.round(response.data.main.temp);
  let currentCity = response.data.name;
  let displayedTemperature = document.querySelector("#current-temperature");
  let displayedCity = document.querySelector("#current-location");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");
  let dateElement = document.querySelector("#current-time");
  dateElement.innerHTML = formatDate(new Date(), response.data.timezone);
  displayedTemperature.innerHTML = currentTemperature;
  displayedCity.innerHTML = currentCity; 
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
      "src",
      `src/img/${response.data.weather[0].icon}.png`
    );
  }


function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(findLocation);
}



function findLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "c65377b33dbe28a83d43ee9cd1615d94";
  let units = "metric";
  let apiEndingPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndingPoint}&lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);
}

function displayForecast (response){
  let forecastElement= document.querySelector("#forecast");
  let forecast = response.data.list[0];

for (let index = 0; index < 5; index++) {
   forecast= response.data.list[index];
  tempMax=forecast.main.temp_max;
   tempMin=forecast.main.temp_min;

  forecastElement.innerHTML += 
    ` <div class="col">
      <h3>
       <div class="hourly-forecast">
       ${formatHours(forecast.dt * 1000)}
       </div>
       </h3>
      <div class="forecast-icons">
      <img 
      src= "src/img/${forecast.weather[0].icon}.png" />
       </div>
      <div class="highs-lows">
     <strong> <span id="temp-max">${Math.round(forecast.main.temp_max)}</span>°
     </strong> 
     <span id="temp-min">${Math.round(forecast.main.temp_min)}</span>°
     </div>
      </div>`;
  }
  }



function searchCity(city) {
  let apiKey = "c65377b33dbe28a83d43ee9cd1615d94";
  let units = "metric";
  let apiEndingPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndingPoint}q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

let citySearchEngine = document.querySelector("#city-search");
citySearchEngine.addEventListener("submit", getCityTemperature);

let currentLocationButton = document.querySelector("#my-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("h3");
  let temperature = temperatureElement.innerHTML;
  temperature = Number(temperature);
  temperatureElement.innerHTML = Math.round((temperature * 9) / 5 + 32);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("h3");
  let temperature = temperatureElement.innerHTML;
  temperature = Number(temperature);

  temperatureElement.innerHTML = Math.round(((temperature - 32) * 5) / 9);
}

let fahreinheitLink = document.querySelector("#fahrenheit-change");
fahreinheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-change");
celsiusLink.addEventListener("click", convertToCelsius);

searchCity("Manchester");


