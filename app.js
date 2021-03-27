const forecastEL = document.querySelector('.forecast');
const currentConditions = document.querySelector('.current-conditions');
const API_KEY = '152bc9f1863e762904c3c8c67fa53755';
const today = new Date();
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let daysArray = [];

let options = {
  enableHighAccuracy: true,
  timeout: 7000,
  maximumAge: 0
};

function success(pos) {
  forecastAndWeatherForLocation(pos.coords.latitude, pos.coords.longitude);
}

function error() {
  forecastAndWeatherForLocation(49.8150709481681, -97.19370127982809);
}

navigator.geolocation.getCurrentPosition(success, error, options);

async function forecastAndWeatherForLocation(lat, lng) {
  const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`);
  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`);
  const forecastJSON = await forecastResponse.json();
  const weatherJSON = await weatherResponse.json();

  drawCurrentConditions(weatherJSON.weather[0].icon, Math.round(weatherJSON.main.temp), weatherJSON.weather[0].description);

  forecastJSON.list.forEach(element => {
    if (!daysArray.includes(new Date(element.dt_txt).getDay())) {
      daysArray.push(new Date(element.dt_txt).getDay());
    }
  });

  const filteredWeekDays = daysArray.filter(item => item !== today.getDay());

  filteredWeekDays.forEach(daysOfTheWeek => {
    let temporayObject = forecastJSON.list.filter(item => new Date(item.dt_txt).getDay() === daysOfTheWeek);
    let highestTemp = temporayObject.reduce((prev, current) => (prev.main.temp_max > current.main.temp_max) ? prev : current);
    let lowestTemp = temporayObject.reduce((prev, current) => (prev.main.temp_min < current.main.temp_min) ? prev : current);

    drawDaysOfTheWeek(weekDays[daysOfTheWeek], lowestTemp.weather[0].icon, lowestTemp.weather[0].description, Math.round(highestTemp.main.temp_max), Math.round(lowestTemp.main.temp_min));
  });
}

function drawCurrentConditions(icon, temp, description) {
  currentConditions.insertAdjacentHTML('beforeend', `
  <h2>Current Conditions</h2>
  <img src="http://openweathermap.org/img/wn/${icon}@2x.png"/>
  <div class="current">
    <div class="temp">${temp}℃</div>
    <div class="condition">${description}</div>
  </div>`);
}

function drawDaysOfTheWeek(day, icon, description, high, low) {
  forecastEL.insertAdjacentHTML('beforeend', `
  <div class="day">
    <h3>${day}</h3>
    <img src="http://openweathermap.org/img/wn/${icon}@2x.png"/>
    <div class="description">${description}</div>
    <div class="temp">
      <span class="high">${high}℃</span>/<span class="low">${low}℃</span>
    </div>
  </div>`);
}