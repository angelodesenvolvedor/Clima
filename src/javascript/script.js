document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showAlert('Você precisa digitar uma cidade...');
        return;
    }

    const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const results = await fetch(apiUrl);
        const json = await results.json();

        if (json.cod === 200) {
            const cityDetails = await getCityDetails(cityName, json.sys.country);

            showInfo({
                city: json.name,
                state: cityDetails.state,
                country: json.sys.country,
                temp: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                description: json.weather[0].description,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                humidity: json.main.humidity,
            });
        } else {
            document.querySelector("#weather").classList.remove('show');
            showAlert(`
                Não foi possível localizar...

                <img src="src/images/404.svg"/>
            `);
        }
    } catch (error) {
        console.error('Erro ao chamar a API de previsão do tempo:', error);
        showAlert('Erro ao buscar informações meteorológicas.');
    }
});

async function showInfo(json) {
    document.querySelector("#weather").classList.add('show');

    const cityName = json.city || '';
    const state = json.state || '';
    const country = json.country || '';

    const cityStateCountry = `${cityName}, ${state}, ${country}`;
    document.querySelector('#title').innerHTML = cityStateCountry;

    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);

    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)}km/h`;
}

async function getCityDetails(cityName, countryCode) {
    const openCageApiKey = '0355149b1d34475797b45fa0798d9076';
    const openCageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(cityName)}&countrycode=${countryCode}&key=${openCageApiKey}`;

    try {
        const response = await fetch(openCageUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const cityDetails = data.results[0].components;

            const state = cityDetails.state || '';
            const city = cityDetails.city || cityDetails.town || cityDetails.village || '';

            return {
                state: state,
                city: city,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao chamar a API OpenCage Geocoding:', error);
        return null;
    }
}


function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg;
}