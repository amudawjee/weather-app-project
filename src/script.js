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
  timeDay.innerHTML = `${day} ${hour}:${min}`;
}

function showWeather(response) {
  let city = response.data.name;
  let location = document.querySelector("h1");
  let currentTemp = document.querySelector("h2");
  let tempRange = document.querySelector("h3");
  let comment = document.querySelector("h5");
  let humidity = document.querySelector("h6");
  let icon = document.querySelector("img");

  location.innerHTML = city;
  temperature = Math.round(response.data.main.temp);
  currentTemp.innerHTML = `${temperature}°C`;
  tempMin = Math.round(response.data.main.temp_min);
  tempMax = Math.round(response.data.main.temp_max);
  tempRange.innerHTML = `${tempMax}°C/${tempMin}°C`;
  comment.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  findDateTime();
}

function submitSearch(event) {
  event.preventDefault();
  let search = document.querySelector("#location");
  let city = search.value;
  citySearch(city);
}

function citySearch(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showWeather);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
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
  farenheitMax = Math.round((tempMax * 9) / 5 + 32);
  farenheitMin = Math.round((tempMin * 9) / 5 + 32);

  let currentTemp = document.querySelector("h2");
  let tempRange = document.querySelector("h3");

  currentTemp.innerHTML = `${farenheitTemp}°F`;
  tempRange.innerHTML = `${farenheitMax}°F/${farenheitMin}°F`;
}

function changeFarenheit(event) {
  document.getElementById("convert-celcius").classList.add("active");
  document.getElementById("convert-celcius").classList.remove("inactive");
  document.getElementById("convert-farenheit").classList.add("inactive");
  document.getElementById("convert-farenheit").classList.remove("active");

  let currentTemp = document.querySelector("h2");
  let tempRange = document.querySelector("h3");

  currentTemp.innerHTML = `${temperature}°C`;
  tempRange.innerHTML = `${tempMax}°C/${tempMin}°C`;
}

let unit = "metric";
let apiKey = "ac209dae1f283fb332a5bb7f50b0f468";
let temperature = "";
let tempMin = "";
let tempMax = "";

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
