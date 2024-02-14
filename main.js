import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loadingAnimation = document.getElementById('loader');
window.loadingAnimation = loadingAnimation;

THREE.DefaultLoadingManager.onProgress = (url , item, total) => {
    if(window.loaded == 2){
        console.log(".");
        loadingAnimation.style.display = 'flex';
    }
}

window.onload = function () {

    const SCENE = new THREE.Scene();
    window.myThreeJsScene = SCENE;
    const CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    CAMERA.position.z = 30;

    const RENDERER = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });
    window.renderer = RENDERER;
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(window.innerWidth, window.innerHeight);

    const geometry1 = new THREE.IcosahedronGeometry(6, 0);
    const geometry2 = new THREE.IcosahedronGeometry(6, 4);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(5, 5, 5);
    SCENE.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    SCENE.add(ambientLight);

    //const cloudTexture = new THREE.TextureLoader().load('./cloud.png');
    const cloud1 = new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({ color: 0x655967 }));
    window.cloud1 = cloud1;

    const cloud2 = new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({ color: 0x655967 }));
    window.cloud2 = cloud2;

    const moon = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("./moon.png")} ));
    window.moon = moon;

    const sun = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("./sun.png")} ))
    window.sun = sun;

    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(15000 * 3), 3));

    rainGeo.setAttribute('velocity', new THREE.BufferAttribute(new Float32Array(15000 * 3), 3));

    const positions = rainGeo.attributes.position.array;
    console.log(positions);
    const velocities = rainGeo.attributes.velocity.array;
    var velocity;
    for (let i = 0; i < 15000; i++) {
        const rainDrop = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );

        positions[i * 3] = rainDrop.x;
        positions[i * 3 + 1] = rainDrop.y;
        positions[i * 3 + 2] = rainDrop.z;

        velocity = new THREE.Vector3(0, -0.08, 0);
        velocities[i * 3] = velocity.x;
        velocities[i * 3 + 1] = velocity.y;
        velocities[i * 3 + 2] = velocity.z;
    }

    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true,
    });

    const rain = new THREE.Points(rainGeo, rainMaterial);
    window.myRain = rain;

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(15000 * 3), 3))

    const positionStar = starGeo.attributes.position.array;
    var velocity;
    for (let i = 0; i < 15000; i++) {
        const star = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );

        positionStar[i * 3] = star.x;
        positionStar[i * 3 + 1] = star.y;
        positionStar[i * 3 + 2] = star.z;
    }

    const starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true,
    });

    const stars = new THREE.Points(starGeo, starMaterial);
    window.stars = stars;

    function animate() {
        requestAnimationFrame(animate);
        //console.log(".");
        RENDERER.render(SCENE, CAMERA);

        for (let i = 0; i < 15000; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            //console.log("hello");
            const acceleration = new THREE.Vector3(0, -0.004, 0);
            velocities[i * 3] += acceleration.x;
            velocities[i * 3 + 1] += acceleration.y;
            velocities[i * 3 + 2] += acceleration.z;

            if (positions[i * 3 + 1] < -250) {
                // check for when rain drop is off screen
                positions[i * 3] = Math.random() * 400 - 200; // reset x position
                positions[i * 3 + 2] = Math.random() * 400 - 200; // reset z position
                positions[i * 3 + 1] = 250; // set y position to the top of the viewport
                velocities[i * 3] = 0;
                velocities[i * 3 + 2] = 0;
                velocities[i * 3 + 1] = -0.1; // set velocity.y to previous value
            }
        }
        rainGeo.attributes.position.needsUpdate = true;

        cloud1.rotation.z -= 0.01;
        cloud2.rotation.x += 0.01;

        moon.rotation.y += 0.005;
        sun.rotation.y += 0.005;
    }
    animate();
};

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