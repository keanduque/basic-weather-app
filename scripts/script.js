/**
 * Weather Module
 * Handles fetching and displaying weather data based on user input.
 * Uses OpenWeatherMap API for geocoding and weather data.
 * Author: Kean Duque
 * Date: 2024-06-15
 * Version: 1.0.0
 * License: MIT
 */
class Weather {
  searchInput = "";
  apiKey = "";
  weatherDataSection = null;
  countryCode = 0;

  constructor() {
    this.searchInput = document.getElementById("search");
    this.searchButton = document.getElementById("submit");
    this.weatherDataSection = document.getElementById("weather-data");
    this.apiKey = "6da0e88890b117a9a6fc650f177923e7";
    this.countryCode = 353; // Default to Ireland
  }
  handleInput() {
    this.searchInput.addEventListener("input", () => {
      this.fetchWeather();
    });
  }
  handleSearchBtn() {
    this.searchButton.addEventListener("click", async () => {
      const geocodeData = await this.getLonAndLat();
      console.log("geocodeData", geocodeData);
      this.getWeatherData(geocodeData.lon, geocodeData.lat);
      this.searchInput.value = "";
    });
  }
  async fetchWeather() {
    this.weatherDataSection.style.display = "block";

    if (this.searchInput.value === "") {
      this.weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
      return;
    }
  }
  async getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${this.searchInput.value.replace(
      " ",
      "%20"
    )},${this.countryCode}&limit=1&appid=${this.apiKey}`;

    const res = await fetch(geocodeURL);
    if (!res.ok) {
      console.log("Bad response!", res.status);
      return;
    }
    const data = await res.json();

    if (data.length === 0) {
      console.log("Something went wrong here.");
      this.weatherDataSection.innerHTML = `
        <div>
            <h2>Invalid Input: "${searchInput}"</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
      return;
    } else {
      return data[0];
    }
  }

  async getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;

    const res = await fetch(weatherURL);
    if (!res.ok) {
      console.log("Bad response!", res.status);
      return;
    }

    const data = await res.json();

    this.weatherDataSection.style.display = "flex";

    this.weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${
          data.weather[0].icon
        }.png" alt="${data.weather[0].description}" width="100" />
        <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(
          data.main.temp - 273.15
        )}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
    `;
  }
}

const weather = new Weather();
weather.handleInput();
weather.handleSearchBtn();
