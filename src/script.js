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
  let h1 = document.querySelector("h1");
  h1.innerHTML = city;
  let temperature = Math.round(response.data.main.temp);
  let h2 = document.querySelector("h2");
  h2.innerHTML = `${temperature}°C`;
  let tempMin = Math.round(response.data.main.temp_min);
  let tempMax = Math.round(response.data.main.temp_max);
  let h3 = document.querySelector("h3");
  h3.innerHTML = `${tempMax}°C/${tempMin}°C`;
  let h5 = document.querySelector("h5");
  h5.innerHTML = response.data.weather[0].description;
  let h6 = document.querySelector("h6");
  h6.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let icon = document.querySelector("img");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  findDateTime();
}

function citySearch(event) {
  event.preventDefault();
  let search = document.querySelector("#location");
  let city = search.value;
  let unit = "metric";
  let apiKey = "ac209dae1f283fb332a5bb7f50b0f468";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showWeather);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let unit = "metric";
  let apiKey = "ac209dae1f283fb332a5bb7f50b0f468";
  let geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(geoUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let changeLocation = document.querySelector("#search-button");
changeLocation.addEventListener("click", citySearch);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentLocation);

findDateTime();
