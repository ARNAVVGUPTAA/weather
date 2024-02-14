let loaded = 0;
window.loaded = loaded;

function getWeather() {

    while (window.myThreeJsScene.children.length) {
        window.myThreeJsScene.remove(window.myThreeJsScene.children[0]);
    }

    const apikey = '49a7458399968527b61694608957536f';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('please enter the city');
        return;
    } else {    
        const containerWeather = document.getElementById("weather-container");
        const image = document.getElementById("world");

        containerWeather.style.height = '10vh';
        image.style.display = 'none';
    }

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;

    fetch(currentWeatherURL)
        .then((response) => response.json())
        .then((data) => {
            displayWeather(data);
        })
        .catch((error) => {
            console.error('error fetching current weather data', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastURL)
        .then((response) => response.json())
        .then((data) => {
            displayHourlyForcast(data.list);
        })
        .catch((error) => {
            console.error('error fetching hourly forecast data: ', error);
            alert('Error fetch hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {

    loaded++;

    const tempDivInfo = document.getElementById('temp-div');
    const weatherDivInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyDivForecast = document.getElementById('hourly-forecast');

    weatherDivInfo.innerHTML = '';
    tempDivInfo.innerHTML = '';
    hourlyDivForecast.innerHTML = '';

    if (data.cod === '404') {
        weatherDivInfo.innerHTML = `<p>${data.message}</p>`;
    } else {
        console.log(data);
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.17);

        const localtime = data.dt;
        const sunsettime = data.sys.sunset;
        console.log(sunsettime);
        const sunrisetime = data.sys.sunrise;

        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconURL = `https://openweather.org/img/wn/${iconCode}@4x.png`;

        const isRaining = data.weather[0].main === 'Rain';
        if (isRaining) {
            window.myThreeJsScene.add(window.myRain);

            window.myThreeJsScene.add(window.cloud1);
            window.myThreeJsScene.add(window.cloud2);
        }

        const isCloudy = (data.weather[0].main === 'Clouds' || data.weather[0].main === 'Haze' || data.weather[0].main === 'Mist');
        if(isCloudy) {
            window.myThreeJsScene.add(window.cloud1);
            window.myThreeJsScene.add(window.cloud2);
        }

        const isClear = data.weather[0].main === 'Clear';
        if(isClear) {
            if(localtime > sunsettime || localtime < sunrisetime){
                window.myThreeJsScene.add(window.moon);
                window.myThreeJsScene.add(window.stars);
            } else {
                window.myThreeJsScene.add(window.sun);
            }
        }

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHTML = `<p>${cityName}</p> <p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherDivInfo.innerHTML = weatherHTML;
        weatherIcon.src = iconURL;
        weatherIcon.alt = description;

        ShowImage();
    }
}
function displayHourlyForcast(hourlyData) {

    loaded++;

    const hourlyDivForecast = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);
    hourlyDivForecast.innerHTML = '<h2>HOURLY FORECAST</h2>';

    next24Hours.forEach((item) => {
        const DateTime = new Date(item.dt * 1000);
        const hour = DateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHTML = `<div class="hourly-item"><span>${hour}:00</span> <img src="${iconURL}" alt="Hourly Weather Icon"><span>${temperature}°C</span></div>`;
        hourlyDivForecast.innerHTML += hourlyItemHTML;
    });
}

function ShowImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}