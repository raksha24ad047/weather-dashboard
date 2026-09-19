// ========================================
// WEATHER DASHBOARD
// ========================================


// ========================================
// 1. GET HTML ELEMENTS
// ========================================

const weatherForm =
    document.getElementById("weather-form");

const cityInput =
    document.getElementById("city-input");

const loadingMessage =
    document.getElementById("loading-message");

const errorMessage =
    document.getElementById("error-message");

const weatherDashboard =
    document.getElementById("weather-dashboard");

const locationName =
    document.getElementById("location-name");

const locationCountry =
    document.getElementById("location-country");

const temperature =
    document.getElementById("temperature");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("wind-speed");


// ========================================
// 2. API URLs
// ========================================

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


// ========================================
// 3. SEARCH FORM
// ========================================

weatherForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const city =
            cityInput.value.trim();

        if (city === "") {

            showError(
                "Please enter a city name."
            );

            return;
        }

        getWeather(city);

    }
);


// ========================================
// 4. GET WEATHER
// ========================================

async function getWeather(city) {

    showLoading();

    hideError();

    weatherDashboard.hidden = true;


    try {

        // --------------------------------
        // STEP 1: Find city coordinates
        // --------------------------------

        const geocodingUrl =
            GEOCODING_API +
            "?name=" +
            encodeURIComponent(city) +
            "&count=1&language=en&format=json";


        const locationResponse =
            await fetch(geocodingUrl);


        if (!locationResponse.ok) {

            throw new Error(
                "Unable to connect to the location service."
            );

        }


        const locationData =
            await locationResponse.json();


        // Check whether city exists

        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please check the city name."
            );

        }


        // Get first matching city

        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // --------------------------------
        // STEP 2: Get weather data
        // --------------------------------

        const weatherUrl =
            WEATHER_API +
            "?latitude=" +
            latitude +
            "&longitude=" +
            longitude +
            "&current=temperature_2m,relative_humidity_2m,wind_speed_10m";


        const weatherResponse =
            await fetch(weatherUrl);


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to retrieve weather data."
            );

        }


        const weatherData =
            await weatherResponse.json();


        // --------------------------------
        // STEP 3: Display data
        // --------------------------------

        displayWeather(
            location,
            weatherData
        );

    }


    catch (error) {

        console.error(
            "Weather error:",
            error
        );

        showError(
            error.message ||
            "Something went wrong. Please try again."
        );

    }


    finally {

        hideLoading();

    }

}


// ========================================
// 5. DISPLAY WEATHER
// ========================================

function displayWeather(
    location,
    weatherData
) {

    locationName.textContent =
        location.name;


    locationCountry.textContent =
        location.country;


    temperature.textContent =
        weatherData.current.temperature_2m +
        " °C";


    humidity.textContent =
        weatherData.current.relative_humidity_2m +
        " %";


    windSpeed.textContent =
        weatherData.current.wind_speed_10m +
        " km/h";


    weatherDashboard.hidden = false;

}


// ========================================
// 6. LOADING
// ========================================

function showLoading() {

    loadingMessage.hidden = false;

}


function hideLoading() {

    loadingMessage.hidden = true;

}


// ========================================
// 7. ERROR HANDLING
// ========================================

function showError(message) {

    errorMessage.textContent =
        "❌ " + message;

    errorMessage.hidden = false;

}


function hideError() {

    errorMessage.hidden = true;

}
