const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your WeatherAPI key
let isCelsius = true;

// ================= FETCH WEATHER =================
async function getWeather(query) {
  showLoader(true);
  document.getElementById("error").classList.add("hidden");

  try {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=7&aqi=yes&alerts=yes`);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    localStorage.setItem("lastCity", query);

    renderCurrent(data);
    renderDetails(data);
    renderHourly(data.forecast.forecastday[0].hour);
    renderDaily(data.forecast.forecastday);
    renderAlerts(data.alerts);

    document.getElementById("weather").classList.remove("hidden");
  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
}

// ================= RENDER FUNCTIONS =================
function renderCurrent(data) {
  document.getElementById("location").textContent = `${data.location.name}, ${data.location.country}`;
  document.getElementById("localTime").textContent = new Date(data.location.localtime).toLocaleString();
  updateTemperature(data);
  document.getElementById("condition").textContent = data.current.condition.text;
  document.getElementById("weatherIcon").src = `https:${data.current.condition.icon}`;
}

function renderDetails(data) {
  const c = data.current;
  document.getElementById("feelsLike").textContent = `${c.feelslike_c}°C / ${c.feelslike_f}°F`;
  document.getElementById("humidity").textContent = `${c.humidity}%`;
  document.getElementById("wind").textContent = `${c.wind_kph} km/h`;
  document.getElementById("pressure").textContent = `${c.pressure_mb} mb`;
  document.getElementById("visibility").textContent = `${c.vis_km} km`;
  document.getElementById("uv").textContent = c.uv;
  document.getElementById("aqi").textContent = data.current.air_quality ? data.current.air_quality["us-epa-index"] : "N/A";
  document.getElementById("sunrise").textContent = data.forecast.forecastday[0].astro.sunrise;
  document.getElementById("sunset").textContent = data.forecast.forecastday[0].astro.sunset;
}

function renderHourly(hourly) {
  const interval = parseInt(document.getElementById("intervalSelect").value);
  const filtered = hourly.filter((_, i) => i % interval === 0).slice(0, 24 / interval);
  const box = document.getElementById("hourly");
  box.innerHTML = filtered.map(h => `
    <div>
      <p>${h.time.split(" ")[1]}</p>
      <img src="https:${h.condition.icon}" alt="Weather icon">
      <p>${isCelsius ? `${h.temp_c}°` : `${h.temp_f}°`}</p>
    </div>`).join("");
}

function renderDaily(daily) {
  const box = document.getElementById("daily");
  box.innerHTML = daily.map(d => `
    <div>
      <strong>${d.date}</strong>
      <img src="https:${d.day.condition.icon}" alt="Weather icon">
      <p>${isCelsius ? `${d.day.maxtemp_c}° / ${d.day.mintemp_c}°` : `${d.day.maxtemp_f}° / ${d.day.mintemp_f}°`}</p>
    </div>`).join("");
}

function renderAlerts(alerts) {
  const box = document.getElementById("alerts");
  if (!alerts || !alerts.alert || !alerts.alert.length) {
    box.classList.add("hidden");
    return;
  }
  box.classList.remove("hidden");
  box.innerHTML = alerts.alert.map(a => `<p>⚠️ ${a.headline}</p>`).join("");
}

// ================= HELPERS =================
function updateTemperature(data) {
  document.getElementById("temperature").textContent = isCelsius ? `${data.current.temp_c}°C` : `${data.current.temp_f}°F`;
}

function showLoader(state) {
  document.getElementById("loader").classList.toggle("hidden", !state);
}

function showError(msg) {
  document.getElementById("error").textContent = msg;
  document.getElementById("error").classList.remove("hidden");
  document.getElementById("weather").classList.add("hidden");
}

// ================= EVENTS =================
document.getElementById("searchBtn").onclick = () => getWeather(document.getElementById("cityInput").value);

document.getElementById("locationBtn").onclick = () => navigator.geolocation.getCurrentPosition(pos => getWeather(`${pos.coords.latitude},${pos.coords.longitude}`));

document.getElementById("unitToggle").onclick = () => {
  isCelsius = !isCelsius;
  const last = localStorage.getItem("lastCity");
  if (last) getWeather(last);
};

document.getElementById("themeToggle").onclick = () => document.body.classList.toggle("dark");

document.getElementById("intervalSelect").onchange = () => {
  const last = localStorage.getItem("lastCity");
  if (last) getWeather(last);
};

// ================= LOAD LAST CITY =================
const lastCity = localStorage.getItem("lastCity");
if (lastCity) getWeather(lastCity);