function findDateTime() {
  let current = new Date();
  let hour = current.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let min = current.getMinutes();
  if (min < 10) {
    min = `0${min}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[current.getDay()];
  let timeDay = document.querySelector("h4");
  timeDay.innerHTML = `Last Updated: ${day} ${hour}:${min}`;
}

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  return days[day];
}

function showForecast(response) {
  let forecastData = response.data.daily;
  let forecast = document.querySelector("#forecast");

  let forecastHTML = "";
  minTemp = [];
  maxTemp = [];

  forecastData.forEach(function (forecastDay, index) {
    if (index < 5) {
      minTemp.push(forecastDay.temperature.minimum);
      maxTemp.push(forecastDay.temperature.maximum);
      forecastHTML =
        forecastHTML +
        `
      <div class="row align-items-center">
      <div class="col day">${formatDate(forecastDay.time)}</div>
        <div class="col">
        <img
        class="icon"
        src="${forecastDay.condition.icon_url}"
        alt="${forecastDay.condition.icon}"
        width="50px"
        />
        </div>
      <div class="col temp-range"> <span class="max-temp"> ${Math.round(
        forecastDay.temperature.maximum
      )}° </span>/ <span class="min-temp">${Math.round(
          forecastDay.temperature.minimum
        )}°</span></div>
          </div>
          `;
    }
  });

  forecast.innerHTML = forecastHTML;
}

function showWeather(response) {
  let city = response.data.city;
  let location = document.querySelector("h1");
  let currentTemp = document.querySelector("#current-temp");
  let tempFeel = document.querySelector("h3");
  let comment = document.querySelector("h5");
  let humidity = document.querySelector("h6");
  let icon = document.querySelector("img");
  let windSpeed = document.querySelector("h2");

  location.innerHTML = city;
  temperature = Math.round(response.data.temperature.current);
  feelsLike = Math.round(response.data.temperature.feels_like);
  currentTemp.innerHTML = `${temperature}`;
  tempFeel.innerHTML = `Feels like ${feelsLike}°C`;
  comment.innerHTML = capitalize(response.data.condition.description);
  humidity.innerHTML = `Humidity: ${response.data.temperature.humidity}%`;
  icon.setAttribute("src", response.data.condition.icon_url);
  icon.setAttribute("alt", response.data.condition.icon);
  windSpeed.innerHTML = `Wind speed: ${response.data.wind.speed}km/h`;
  findDateTime();
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function submitSearch(event) {
  event.preventDefault();
  let search = document.querySelector("#location");
  let city = search.value;
  citySearch(city);
}

function citySearch(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unit}`;
  let forecastURL = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showWeather);
  axios.get(forecastURL).then(showForecast);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let geoUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${unit}`;
  let forecastGeoUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${unit}`;

  axios.get(geoUrl).then(showWeather);
  axios.get(forecastGeoUrl).then(showForecast);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function convertToFarenheit(celcius) {
  return Math.round((celcius * 9) / 5 + 32);
}

function changeCelcius(event) {
  document.getElementById("convert-celcius").classList.remove("active");
  document.getElementById("convert-celcius").classList.add("inactive");
  document.getElementById("convert-farenheit").classList.remove("inactive");
  document.getElementById("convert-farenheit").classList.add("active");

  farenheitTemp = convertToFarenheit(temperature);
  farenheitFeel = convertToFarenheit(feelsLike);

  let currentTemp = document.querySelector("#current-temp");
  let tempFeel = document.querySelector("h3");

  currentTemp.innerHTML = `${farenheitTemp}`;
  tempFeel.innerHTML = `Feels like ${farenheitFeel}°F`;

  let forecastMin = document.querySelectorAll(".temp-range .min-temp");
  let forecastMax = document.querySelectorAll(".temp-range .max-temp");
  let farMin = [];
  let farMax = [];

  minTemp.forEach(function (day) {
    farMin.push(convertToFarenheit(day));
  });

  forecastMin.forEach(function (day, index) {
    day.innerHTML = `${farMin[index]}°`;
  });

  maxTemp.forEach(function (day) {
    farMax.push(convertToFarenheit(day));
  });

  forecastMax.forEach(function (day, index) {
    day.innerHTML = `${farMax[index]}°`;
  });
}

function changeFarenheit(event) {
  document.getElementById("convert-celcius").classList.add("active");
  document.getElementById("convert-celcius").classList.remove("inactive");
  document.getElementById("convert-farenheit").classList.add("inactive");
  document.getElementById("convert-farenheit").classList.remove("active");

  let currentTemp = document.querySelector("#current-temp");
  let tempFeel = document.querySelector("h3");

  currentTemp.innerHTML = `${temperature}`;
  tempFeel.innerHTML = `Feels like ${feelsLike}°C`;

  let forecastMin = document.querySelectorAll(".temp-range .min-temp");
  let forecastMax = document.querySelectorAll(".temp-range .max-temp");

  forecastMin.forEach(function (day, index) {
    day.innerHTML = `${Math.round(minTemp[index])}°`;
  });

  forecastMax.forEach(function (day, index) {
    day.innerHTML = `${Math.round(maxTemp[index])}°`;
  });
}

let unit = "metric";
let apiKey = "30cfadc4433fc0f8adtbo56e88e10e9a";
let temperature = "";
let feelsLike = "";
let minTemp = [];
let maxTemp = [];

let changeLocation = document.querySelector("#search-button");
changeLocation.addEventListener("click", submitSearch);
changeLocation.addEventListener("click", changeFarenheit);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentLocation);
currentLocation.addEventListener("click", changeFarenheit);

let convertCelcius = document.querySelector("#convert-celcius");
convertCelcius.addEventListener("click", changeCelcius);

let convertFarenheit = document.querySelector("#convert-farenheit");
convertFarenheit.addEventListener("click", changeFarenheit);

citySearch("London");
