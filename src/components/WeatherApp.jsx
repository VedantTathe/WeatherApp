import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";


const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchWeather = async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const weatherResponse = await axios.get(`${BASE_URL}/current.json?key=${API_KEY}&q=${loc}`);
      const forecastResponse = await axios.get(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${loc}&days=7`);

      
      localStorage.setItem("weatherData", JSON.stringify(weatherResponse.data));
      localStorage.setItem("forecastData", JSON.stringify(forecastResponse.data.forecast));
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        
      );
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white p-4">
      <h1 className="text-4xl font-bold text-purple-300 mb-4">Weather App</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter location"
          className="p-2 border border-purple-300 bg-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={() => fetchWeather(location)}
          className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-800 transition"
        >
          Search
        </button>
      </div>
      {loading && <p className="text-gray-300">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {weatherData && (
        <div className="bg-purple-800 p-4 rounded-lg shadow-lg w-80 text-center">
          <h2 className="text-xl font-semibold text-purple-300">{weatherData.location.name}</h2>
          <p className="text-gray-200">Temperature: {weatherData.current.temp_c}°C</p>
          <p className="text-gray-200">Condition: {weatherData.current.condition.text}</p>
        </div>
      )}
      {forecastData && (
        <div className="mt-6 w-full max-w-xl">
          <h3 className="text-lg font-semibold text-purple-300">{view === "hourly" ? "Hourly" : "Weekly"} Forecast</h3>
          <button
            className="mt-2 mb-4 bg-purple-700 text-white p-2 rounded-lg hover:bg-purple-900 transition"
            onClick={() => setView(view === "hourly" ? "weekly" : "hourly")}
          >
            Switch to {view === "hourly" ? "Weekly" : "Hourly"} View
          </button>
          <LineChart
            width={600}
            height={300}
            data={
              view === "hourly"
                ? forecastData.forecastday[0].hour.map((entry) => ({ time: entry.time, temp: entry.temp_c }))
                : forecastData.forecastday.map((entry) => ({ time: entry.date, temp: entry.day.avgtemp_c }))
            }
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.3)" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: "#6b46c1", color: "#fff" }} />
            <Line type="monotone" dataKey="temp" stroke="#a78bfa" strokeWidth={2} />
          </LineChart>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;