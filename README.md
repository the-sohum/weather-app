# weather-app
Real-time weather app built using HTML, CSS, JavaScript and Weather APIs.
# 🌤 Nimbus — Weather App

A fully responsive, modern weather app built with pure **HTML, CSS, and Vanilla JavaScript**. No frameworks, no API key, no backend — just open and run.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![No API Key](https://img.shields.io/badge/API%20Key-Not%20Required-brightgreen?style=flat)

---

## ✨ Features

- 🔍 **Search any city** by name with instant results
- 📍 **Current location weather** using the browser Geolocation API
- 🌡 **Current temperature**, feels-like, humidity, and wind speed
- 🌦 **Dynamic backgrounds** that change with weather conditions (sunny, rainy, cloudy, snow, thunder, night)
- 📅 **5-day forecast** with daily high/low temperatures
- 🕐 **Recent search history** saved across sessions (up to 6 cities)
- 🌙 **Dark / Light theme toggle** with saved preference
- ✨ **Animated particles** — rain drops, snowflakes, or floating dots depending on weather
- 📱 **Fully mobile responsive**

---

## 🚀 Getting Started

### 1. Clone or Download

```bash
git clone https://github.com/your-username/nimbus-weather.git
cd nimbus-weather
```

Or click **Code → Download ZIP** on GitHub and unzip it.

### 2. Run It

No server or install needed. Just open `index.html` in your browser:

- **Windows:** Double-click `index.html`, or right-click → Open with → Chrome / Firefox
- **Mac:** Double-click `index.html`, or drag it into your browser
- **VS Code:** Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, then click **Go Live** at the bottom right

> ✅ An internet connection is required — the app fetches live weather data from Open-Meteo.

---

## 📁 Project Structure

```
nimbus-weather/
├── index.html      # App markup and layout
├── style.css       # All styling, themes, animations
└── script.js       # All logic — fetch, render, geolocation, history
```

---

## 🌐 APIs Used

All APIs are **completely free** and require **no account or API key**.

| API | Purpose | Docs |
|---|---|---|
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City name → latitude/longitude | open-meteo.com |
| [Open-Meteo Forecast](https://open-meteo.com/en/docs) | Coordinates → weather data | open-meteo.com |
| [BigDataCloud Reverse Geocode](https://www.bigdatacloud.com/geocoding-api) | Coordinates → city name (used for location button) | bigdatacloud.com |

Weather icons are served from OpenWeatherMap's public CDN — no account needed.

---

## 🖥 Preview

### Dark Mode — Rainy
> Deep blue gradient background, animated rain particles, glassmorphism cards

### Light Mode — Sunny
> Warm amber gradient, floating particle dots, frosted glass forecast cards

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|---|---|
| Desktop (> 780px) | Full layout, 5-column forecast |
| Tablet (≤ 580px) | Condensed padding, 3-column forecast |
| Mobile (≤ 380px) | Single column, compact stats |

---

## 🔧 How It Works

### Search Flow
1. User types a city name and presses Enter or clicks **Go**
2. The city name is sent to **Open-Meteo Geocoding** → returns `latitude` and `longitude`
3. Coordinates go to **Open-Meteo Forecast** → returns current weather + 5-day forecast
4. Data is rendered into the UI, background updates, particles spawn

### Geolocation Flow
1. User clicks the 📍 button
2. Browser asks for location permission
3. If granted, coordinates go to **BigDataCloud** for a city name, then to Open-Meteo for weather

### Weather Codes
Open-Meteo uses **WMO standard codes** (e.g. `61` = slight rain, `95` = thunderstorm). The app maps all codes to labels, icon codes, and background conditions via a lookup object in `script.js`.

### localStorage Keys
| Key | Stores |
|---|---|
| `nimbus_theme` | `"dark"` or `"light"` |
| `nimbus_history` | JSON array of up to 6 recent city names |

---

## 🛠 Potential Extensions

- **Hourly forecast** — Open-Meteo already returns hourly data, just render more rows
- **UV index & sunrise/sunset** — available in Open-Meteo's `daily` parameters
- **Unit toggle (°C / °F)** — multiply temperature by `9/5 + 32` and swap the label
- **Saved favorite cities** — store an array in localStorage and show quick-access buttons
- **PWA support** — add a `manifest.json` and service worker to make it installable

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 🙌 Credits

- Weather data: [Open-Meteo](https://open-meteo.com) (open source, WMO-compliant)
- Reverse geocoding: [BigDataCloud](https://www.bigdatacloud.com)
- Weather icons: [OpenWeatherMap](https://openweathermap.org/weather-conditions) icon CDN
- Fonts: [Syne](https://fonts.google.com/specimen/Syne) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) via Google Fonts
