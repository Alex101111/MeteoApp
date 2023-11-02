import React, { useState } from "react";
import axios from "axios";
import './FiveDayWeather.css'
import Card from '@mui/material/Card';
import Button from "@mui/material/Button";
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';

const FiveDayWeather = () => {
  const apiKey = "3a797131b6712014f8ac8d68738e22b2";
  const [forecastData, setForecastData] = useState({});
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");

  const calculateTime = (baseTime, hoursToAdd) => {
    const currentTime = new Date(baseTime);
    currentTime.setHours(currentTime.getHours() + hoursToAdd);
    return currentTime.toLocaleTimeString();
  };

  const handleCardSwitch = (index) => {
    setSelectedCardIndex(index);
  };

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      );

      if (response.status === 200) {
        setForecastData(response.data);
        console.log(forecastData.list)
        setError("");
      } else {
        setError("Failed to retrieve weather data for the specified city.");
      }
    } catch (error) {
      setError("An error occurred while fetching weather data.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
      />
      <button onClick={fetchWeatherData}>Get Weather</button>
      {forecastData.list ? (
        <div>
          {error && <p>{error}</p>}
          <div className="card-container">
            {forecastData.list.map((forecast, index) => (
              <Card
                sx={{ maxWidth: 345 }}
                key={forecast.dt}
                className={`card ${index === selectedCardIndex ? "selected-card" : "default-card"}`}
              >
                <CardMedia
                  component="img"
                  alt="Weather Icon"
                  height="140"
                  image={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                />
                <CardContent>
                  <h3>
                    Time: {calculateTime(new Date(), index * 3)} (every 3 hours)
                  </h3>
                  <p>Temperature: {forecast.main.temp}°C</p>
                  <p>Weather Description: {forecast.weather[0].description}</p>
                </CardContent>
                <CardActions>
                  <Button variant="contained" onClick={() => handleCardSwitch(index)}>
                    Check This Forecast
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading weather forecast data...</p>
      )}
    </div>
  );
};

export default FiveDayWeather;
