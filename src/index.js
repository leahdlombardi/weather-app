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
  celsiusTemperature = response.data.main.temp;
  let descriptionElement = document.querySelector("#description")
  let temperatureElement = document.querySelector("#current-temperature");
  let displayedCity = document.querySelector("#current-location");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");
  let dateElement = document.querySelector("#current-time");
  let changeColour = document.querySelector("#colour-box");
  if (celsiusTemperature >= 16) {
    changeColour.classList.add("hot");
    changeColour.classList.remove("neutral");
    changeColour.classList.remove("cold");
    
    }
      else if (celsiusTemperature >= 10 && celsiusTemperature <= 15) {
    changeColour.classList.add("neutral");
    changeColour.classList.remove("hot");
    changeColour.classList.remove("cold");
    
  }
  else if (celsiusTemperature <= 9) {
    changeColour.classList.add("cold");
    changeColour.classList.remove("neutral");
    changeColour.classList.remove("hot");
  }
  


  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  dateElement.innerHTML = formatDate(new Date(), response.data.timezone);
  displayedCity.innerHTML = response.data.name;
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


function searchCity(event) {
  
  let apiKey = "c65377b33dbe28a83d43ee9cd1615d94";
  let units = "metric";
  let apiEndingPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndingPoint}q=${event}&appid=${apiKey}&units=${units}`;
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

  let temperatureElement = document.querySelector("#current-temperature");
  let temperature = temperatureElement.innerHTML;
  temperature = Number(temperature);
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32) + "°F";

}

function convertToCelsius(event) {
  event.preventDefault();
  
  let temperatureElement = document.querySelector("#current-temperature");
  let temperature = temperatureElement.innerHTML;
  temperature = Number(temperature);
  

  temperatureElement.innerHTML = Math.round(celsiusTemperature) + "°C";
}



let fahreinheitLink = document.querySelector("#fahrenheit-change");
fahreinheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-change");
celsiusLink.addEventListener("click", convertToCelsius);


searchCity("Manchester");

