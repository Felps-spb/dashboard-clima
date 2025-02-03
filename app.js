const express = require('express');
const axios = require('axios');
const app = express();
const port = 8000;

const API_KEY = '915ad69ecee716bbf767bc8d46caab40';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('index', { title: 'Meu Dashboard', data: {} });
});

app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);

    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const airQualityUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        const airQualityResponse = await axios.get(airQualityUrl);
        const airQualityData = airQualityResponse.data;


        const sunsetTimestamp = weatherData.sys.sunset;
        const sunsetDate = new Date(sunsetTimestamp * 1000);
        const sunsetTime = `${sunsetDate.getHours().toString().padStart(2, '0')}:${sunsetDate.getMinutes().toString().padStart(2, '0')}`;

        const rainVolume = weatherData.rain ? weatherData.rain['1h'] || 0 : 0;
        const airQuality = airQualityData.list && airQualityData.list[0] ? airQualityData.list[0].main.aqi : 'N/A';

        res.json({
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            rainVolume: rainVolume,
            locationName: weatherData.name,
            airQuality: airQuality,
            sunsetTime: sunsetTime
        });
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do clima' });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));