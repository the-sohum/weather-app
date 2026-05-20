const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const REVGEO_API = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const MAX_HISTORY = 6;

const WMO = {
  0: { label: "Clear sky", icon: "01d", main: "Clear" },
  1: { label: "Mainly clear", icon: "02d", main: "Clear" },
  2: { label: "Partly cloudy", icon: "03d", main: "Clouds" },
  3: { label: "Overcast", icon: "04d", main: "Clouds" },
  45: { label: "Fog", icon: "50d", main: "Fog" },
  48: { label: "Icy fog", icon: "50d", main: "Fog" },
  51: { label: "Light drizzle", icon: "09d", main: "Drizzle" },
  53: { label: "Moderate drizzle", icon: "09d", main: "Drizzle" },
  55: { label: "Dense drizzle", icon: "09d", main: "Drizzle" },
  61: { label: "Slight rain", icon: "10d", main: "Rain" },
  63: { label: "Moderate rain", icon: "10d", main: "Rain" },
  65: { label: "Heavy rain", icon: "10d", main: "Rain" },
  71: { label: "Slight snow", icon: "13d", main: "Snow" },
  73: { label: "Moderate snow", icon: "13d", main: "Snow" },
  75: { label: "Heavy snow", icon: "13d", main: "Snow" },
  77: { label: "Snow grains", icon: "13d", main: "Snow" },
  80: { label: "Slight showers", icon: "09d", main: "Rain" },
  81: { label: "Moderate showers", icon: "09d", main: "Rain" },
  82: { label: "Violent showers", icon: "09d", main: "Rain" },
  85: { label: "Snow showers", icon: "13d", main: "Snow" },
  86: { label: "Heavy snow showers", icon: "13d", main: "Snow" },
  95: { label: "Thunderstorm", icon: "11d", main: "Thunderstorm" },
  96: { label: "Thunderstorm + hail", icon: "11d", main: "Thunderstorm" },
  99: { label: "Thunderstorm + hail", icon: "11d", main: "Thunderstorm" }
};

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const themeToggle = document.getElementById("themeToggle");
const loader = document.getElementById("loader");
const errorCard = document.getElementById("errorCard");
const errorMsg = document.getElementById("errorMsg");
const weatherMain = document.getElementById("weatherMain");
const recentWrap = document.getElementById("recentWrap");
const recentChips = document.getElementById("recentChips");
const clearHistory = document.getElementById("clearHistory");
const bgLayer = document.getElementById("bgLayer");
const particles = document.getElementById("particles");

function getTheme() { 
  return localStorage.getItem("nimbus_theme") || "dark"; 
}

function applyTheme(t) { 
  document.documentElement.setAttribute("data-theme", t); 
  localStorage.setItem("nimbus_theme", t); 
}

themeToggle.addEventListener("click", () => applyTheme(getTheme() === "dark" ? "light" : "dark"));
applyTheme(getTheme());

function getHistory() {
  try { return JSON.parse(localStorage.getItem("nimbus_history")) || []; }
  catch { return []; }
}

function saveToHistory(city) {
  let h = getHistory().filter(c => c.toLowerCase() !== city.toLowerCase());
  h.unshift(city);
  if (h.length > MAX_HISTORY) h = h.slice(0, MAX_HISTORY);
  localStorage.setItem("nimbus_history", JSON.stringify(h));
  renderHistory();
}

function renderHistory() {
  const h = getHistory();
  if (!h.length) { recentWrap.classList.remove("visible"); return; }
  recentWrap.classList.add("visible");
  recentChips.innerHTML = "";
  h.forEach(city => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = city;
    chip.addEventListener("click", () => fetchByCity(city));
    recentChips.appendChild(chip);
  });
}

clearHistory.addEventListener("click", () => { localStorage.removeItem("nimbus_history"); renderHistory(); });
renderHistory();

const showLoader = () => loader.classList.add("visible");
const hideLoader = () => loader.classList.remove("visible");
const showError = msg => { errorCard.classList.add("visible"); errorMsg.textContent = msg; };
const hideError = () => errorCard.classList.remove("visible");
const showWeather = () => weatherMain.classList.add("visible");
const hideWeather = () => weatherMain.classList.remove("visible");
const resetUI = () => { hideError(); hideWeather(); hideLoader(); };

const conditionMap = {
  Clear: "sunny", Clouds: "cloudy", Rain: "rainy", Drizzle: "rainy",
  Thunderstorm: "thunder", Snow: "snow", Fog: "cloudy"
};

function setBackground(mainCondition, isNight) {
  bgLayer.className = "bg-layer";
  const key = isNight ? "night" : (conditionMap[mainCondition] || "cloudy");
  bgLayer.classList.add("weather-" + key);
  spawnParticles(key);
}

function spawnParticles(type) {
  particles.innerHTML = "";
  const count = type === "rainy" ? 30 : type === "snow" ? 20 : 8;
  const isRain = type === "rainy";
  const isSnow = type === "snow";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = isRain ? 1 + Math.random() * 2 : isSnow ? 4 + Math.random() * 6 : 2 + Math.random() * 4;
    const dur = isRain ? 1.5 + Math.random() * 1.5 : 6 + Math.random() * 8;
    p.style.cssText = `
      width:${size}px; height:${isRain ? size * 6 : size}px;
      left:${Math.random() * 100}%; bottom:-10px;
      animation-duration:${dur}s; animation-delay:${Math.random() * 8}s;
      border-radius:${isRain ? "2px" : "50%"}; opacity:0;
    `;
    particles.appendChild(p);
  }
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateTime(isoString) {
  const d = new Date(isoString);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()} · ${hh}:${mm}`;
}

function renderCurrent(data, cityName, country) {
  const code = data.current_weather.weathercode;
  const info = WMO[code] || { label: "Unknown", icon: "01d", main: "Clear" };
  const temp = Math.round(data.current_weather.temperature);
  const wind = Math.round(data.current_weather.windspeed);
  const night = data.current_weather.is_day === 0;

  const hour = new Date(data.current_weather.time).getHours();
  const humidity = data.hourly.relativehumidity_2m[hour] ?? "—";
  const apparent = Math.round(data.hourly.apparent_temperature[hour] ?? temp);

  document.getElementById("cityName").textContent = `${cityName}, ${country}`;
  document.getElementById("dateTime").textContent = formatDateTime(data.current_weather.time);
  document.getElementById("tempBig").textContent = temp;
  document.getElementById("conditionLabel").textContent = info.label;
  document.getElementById("feelsLike").textContent = apparent + "°";
  document.getElementById("humidity").textContent = humidity + "%";
  document.getElementById("windSpeed").textContent = wind + " km/h";

  const iconCode = night ? info.icon.replace("d", "n") : info.icon;
  const iconEl = document.getElementById("weatherIcon");
  iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  iconEl.alt = info.label;

  setBackground(info.main, night);
}



async function fetchWeatherData(lat, lon, name, country) {
  const params = new URLSearchParams({
    latitude:        lat,
    longitude:       lon,
    current_weather: "true",
    hourly:          "relativehumidity_2m,apparent_temperature",
    timezone:        "auto",
  });

  const res = await fetch(`${WEATHER_API}?${params}`);
  if (!res.ok) throw new Error("WEATHER_FAIL");
  const data = await res.json();

  hideLoader();
  renderCurrent(data, name, country);
  showWeather();
  cityInput.value = "";
}

async function fetchByCity(city) {
  resetUI();
  showLoader();
  try {
    const geoRes = await fetch(`${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) throw new Error("NOT_FOUND");

    const { latitude, longitude, name, country } = geoData.results[0];
    await fetchWeatherData(latitude, longitude, name, country);
    saveToHistory(name);

  } catch (err) {
    hideLoader();
    showError(
      err.message === "NOT_FOUND"
        ? `"${city}" wasn't found. Check the spelling and try again.`
        : "Something went wrong. Check your internet connection."
    );
  }
}

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) { showError("Geolocation not supported by your browser."); return; }

  navigator.geolocation.getCurrentPosition(
    async ({ coords: { latitude: lat, longitude: lon } }) => {
      resetUI();
      showLoader();
      try {
        const rgRes = await fetch(`${REVGEO_API}?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const rgData = await rgRes.json();
        const name = rgData.city || rgData.locality || "Your Location";
        const country = rgData.countryCode || "";

        await fetchWeatherData(lat, lon, name, country);
        saveToHistory(name);
      } catch {
        hideLoader();
        showError("Could not fetch weather for your location.");
      }
    },
    () => showError("Location access denied. Enable permissions and try again.")
  );
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchByCity(city);
});

cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) fetchByCity(city);
  }
});
