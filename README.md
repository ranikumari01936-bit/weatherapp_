# Weather App

A modern, responsive weather application with backend API proxy for security.

## Setup

1. Get a free API key from [WeatherAPI](https://www.weatherapi.com/)
2. Set the API key as an environment variable: `WEATHER_API_KEY=your_key_here`
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Open `http://localhost:3000/jan9.html` in your browser

## Features

- **Search**: Enter city name to get weather
- **Location**: Use current location
- **Tracker**: Add cities to track their weather
- **Theme**: Toggle between light and dark mode
- **Units**: Switch between Celsius and Fahrenheit
- **Intervals**: Choose hourly forecast interval (1h, 2h, 3h)

## Backend

The app now includes a Node.js/Express backend that proxies API calls to WeatherAPI, keeping your API key secure on the server side.
