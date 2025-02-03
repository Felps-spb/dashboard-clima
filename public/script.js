if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(`/weather?lat=${latitude}&lon=${longitude}`)
                .then(response => response.json())
                .then(data => {
                    document.querySelector('.temperature').textContent = `${data.temperature}°C`;
                    document.querySelector('.details .windSpeed').textContent = `Vento: ${data.windSpeed} km/h`;
                    document.querySelector('.details .humidity').textContent = `Umidade: ${data.humidity}%`;
                    document.querySelector('.details .rainVolume').textContent = `Chuva: ${data.rainVolume} mm`;
                    document.querySelector('.location').textContent = data.locationName;

                    switch (data.airQuality) {
                        case 1:
                            document.querySelector('.airQuality').textContent = "boa";
                            break;
                        case 2:
                            document.querySelector('.airQuality').textContent = "moderada";
                            break;
                        case 3:
                            document.querySelector('.airQuality').textContent = "ruim";
                            break;
                        case 4:
                            document.querySelector('.airQuality').textContent = "muito ruim";
                            break;
                        case 5:
                            document.querySelector('.airQuality').textContent = "perigosa";
                            break;
                        default:
                            document.querySelector('.airQuality').textContent = "desconhecida";
                            break;
                    }

                    document.querySelector('.sunsetTime').textContent = data.sunsetTime;

                    // Exibir previsões
                    const forecastContainer = document.querySelector('.forecast');
                    forecastContainer.innerHTML = ''; // Limpa previsões anteriores
                    data.forecast.forEach(day => {
                        const forecastElement = document.createElement('div');
                        forecastElement.classList.add('forecast-day');
                        forecastElement.textContent = `${day.date}: ${day.temperature}°C, ${day.weather}`;
                        forecastContainer.appendChild(forecastElement);
                    });

                })
                .catch(error => console.error('Erro ao buscar dados do clima:', error));
        },
        (error) => {
            console.error("Erro ao obter localização:", error);
        }
    );
} else {
    console.log("Geolocalização não suportada");
}

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 18 || hours < 6) {
        document.body.classList.add('dark-gradient');
    } else {
        document.body.classList.add('light-gradient');
    }
});