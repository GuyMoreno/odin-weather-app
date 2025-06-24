const API_KEY = "A368X452T2KS8GFFTEWQGQEQK";

async function fetchWeatherData(cityName) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
    cityName
  )}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Raw API Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
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

// function that takes the raw data and returns a simplified object
// with only the necessary information for display
// location, temp, description, icon
// Example: { location: "New York", temp: 22, description: "Sunny", icon: "sunny" }
function processWeatherData(data) {
  return {
    cityName: data.resolvedAddress,
    temp: data.currentConditions.temp,
    description: data.currentConditions.conditions,
    icon: data.currentConditions.icon,
  };
}

document
  .getElementById("weather-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the input value
    let cityName = document.getElementById("cityName-input").value;

    // Clean it, and capitalize it

    cityName = cleanInput(cityName);
    // If the input is empty, alert the user
    if (!cityName) {
      alert("Please enter a valid city name");

      // and return early
      return;
    }

    // Capitalize the first letter of each word
    // e.g. "new york" -> "New York"
    cityName = capitalizeWords(cityName);

    // Fetch the weather data
    console.log("Fetching weather for:", cityName);

    // Call the fetchWeatherData function with the cleaned location
    const rawData = await fetchWeatherData(cityName);

    // If the data is not found or there is an error, alert the user
    if (!rawData || rawData.error) {
      alert("City not found, please try again.");
      return;
    }

    // Process the raw data
    const processed = processWeatherData(rawData);
    displayWeather(processed);
  });

function displayWeather(data) {
  const container = document.getElementById("weather-output");
  container.style.display = "block"; // show when there's data

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
