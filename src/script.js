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

function showWeather(response) {
  let city = response.data.city;
  let location = document.querySelector("h1");
  let currentTemp = document.querySelector("h2");
  let tempFeel = document.querySelector("h3");
  let comment = document.querySelector("h5");
  let humidity = document.querySelector("h6");
  let icon = document.querySelector("img");
  let windSpeed = document.querySelector("h7");

  location.innerHTML = city;
  temperature = Math.round(response.data.temperature.current);
  feelsLike = Math.round(response.data.temperature.feels_like);
  currentTemp.innerHTML = `${temperature}°C`;
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
  axios.get(apiUrl).then(showWeather);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let geoUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${unit}`;
  axios.get(geoUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function changeCelcius(event) {
  document.getElementById("convert-celcius").classList.remove("active");
  document.getElementById("convert-celcius").classList.add("inactive");
  document.getElementById("convert-farenheit").classList.remove("inactive");
  document.getElementById("convert-farenheit").classList.add("active");

  farenheitTemp = Math.round((temperature * 9) / 5 + 32);
  farenheitFeel = Math.round((feelsLike * 9) / 5 + 32);

  let currentTemp = document.querySelector("h2");
  let tempFeel = document.querySelector("h3");

  currentTemp.innerHTML = `${farenheitTemp}°F`;
  tempFeel.innerHTML = `Feels like ${farenheitFeel}°F`;
}

function changeFarenheit(event) {
  document.getElementById("convert-celcius").classList.add("active");
  document.getElementById("convert-celcius").classList.remove("inactive");
  document.getElementById("convert-farenheit").classList.add("inactive");
  document.getElementById("convert-farenheit").classList.remove("active");

  let currentTemp = document.querySelector("h2");
  let tempFeel = document.querySelector("h3");

  currentTemp.innerHTML = `${temperature}°C`;
  tempFeel.innerHTML = `Feels like ${feelsLike}°C`;
}

let unit = "metric";
let apiKey = "30cfadc4433fc0f8adtbo56e88e10e9a";
let temperature = "";
let feelsLike = "";

let changeLocation = document.querySelector("#search-button");
changeLocation.addEventListener("click", submitSearch);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentLocation);

let convertCelcius = document.querySelector("#convert-celcius");
convertCelcius.addEventListener("click", changeCelcius);

let convertFarenheit = document.querySelector("#convert-farenheit");
convertFarenheit.addEventListener("click", changeFarenheit);

findDateTime();
citySearch("London");
