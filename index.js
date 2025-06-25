const API_KEY = "A368X452T2KS8GFFTEWQGQEQK";

async function fetchWeatherData(cityName) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
    cityName
  )}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.currentConditions) {
    throw new Error("No weather data found for this location.");
  }

  return data;
}

function cleanInput(input) {
  return input.trim();
}

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function processWeatherData(data) {
  return {
    cityName: data.resolvedAddress,
    temp: data.currentConditions.temp,
    description: data.currentConditions.conditions,
    icon: data.currentConditions.icon,
  };
}

function displayWeather(data) {
  const container = document.getElementById("weather-output");
  container.classList.remove("hidden");
  container.innerHTML = `
    <h2>${data.cityName}</h2>
    <p>${data.description}</p>
    <p>${data.temp}°C</p>
    <img 
      src="https://raw.githubusercontent.com/VisualCrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${data.icon}.png"
      alt="${data.description}"
      width="80"
    />
  `;
}

function showLoader(show) {
  document.getElementById("loader").classList.toggle("hidden", !show);
}

document
  .getElementById("weather-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputField = document.getElementById("cityName-input");
    let cityName = cleanInput(inputField.value);

    if (!cityName) {
      alert("Please enter a valid city name");
      return;
    }

    cityName = capitalizeWords(cityName);
    showLoader(true);
    document.getElementById("weather-output").classList.add("hidden");

    try {
      const rawData = await fetchWeatherData(cityName);
      const processed = processWeatherData(rawData);
      displayWeather(processed);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      showLoader(false);
    }
  });
