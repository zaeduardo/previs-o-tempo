// TEMPO DE CRIAÇÃO DO PROJETO - 10 DIAS
// FEITO E DESENVOLVIDO POR - BRUNO EDUARDO DE OLIVEIRA DE SOUZA 

function obterClima() {
    const apiKey = '6559b279ad2240b4b46ff96188f9d9e8';
    const cidade = document.getElementById('city').value;

    if (!cidade) {
        alert('Por favor, insira uma cidade');
        return;
    }

    const urlClimaAtual = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}`;
    const urlPrevisao = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}`;

    Promise.all([
        fetch(urlClimaAtual).then(response => response.json()),
        fetch(urlPrevisao).then(response => response.json())
    ])
    .then(([dadosClimaAtual, dadosPrevisao]) => {
        exibirClima(dadosClimaAtual);
        exibirPrevisaoHoraria(dadosPrevisao.list);
    })
    .catch(error => {
        console.error('Erro ao obter dados:', error);
        alert('Erro ao obter dados meteorológicos. Tente novamente.');
    });
}

function exibirClima(dados) {
    const tempDivInfo = document.getElementById('temp-div');
    const infoClimaDiv = document.getElementById('weather-info');
    const climaIcone = document.getElementById('weather-icon');

    tempDivInfo.innerHTML = '';
    infoClimaDiv.innerHTML = '';

    if (dados.cod === '404') {
        infoClimaDiv.innerHTML = `<p>${dados.message}</p>`;
        return;
    }

    const nomeCidade = dados.name;
    const temperatura = Math.round(dados.main.temp - 273.15); 
    const descricao = traduzirDescricao(dados.weather[0].description);
    const iconeUrl = `https://openweathermap.org/img/wn/${dados.weather[0].icon}@4x.png`;

    tempDivInfo.innerHTML = `<p>${temperatura}°C</p>`;
    infoClimaDiv.innerHTML = `<p>${nomeCidade}</p><p>${descricao}</p>`;
    climaIcone.src = iconeUrl;
    climaIcone.alt = descricao;

    mostrarImagem();
}

function exibirPrevisaoHoraria(dadosHorarios) {
    const previsaoDiv = document.getElementById('hourly-forecast');
    previsaoDiv.innerHTML = '';

    const proximas24Horas = dadosHorarios.slice(0, 8);

    proximas24Horas.forEach(item => {
        const dataHora = new Date(item.dt * 1000); 
        const hora = dataHora.getHours();
        const temperatura = Math.round(item.main.temp - 273.15); 
        const iconeUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        previsaoDiv.innerHTML += `
            <div class="hourly-item">
                <span>${hora}:00</span>
                <img src="${iconeUrl}" alt="Ícone do Clima Horário">
                <span>${temperatura}°C</span>
            </div>
        `;
    });
}

function traduzirDescricao(descricao) {
    const traducoes = {
        "clear sky": "céu limpo",
        "few clouds": "poucas nuvens",
        "scattered clouds": "nuvens dispersas",
        "broken clouds": "nuvens quebradas",
        "shower rain": "chuva rápida",
        "rain": "chuva",
        "thunderstorm": "tempestade",
        "snow": "neve",
        "mist": "neblina"
    };
    return traducoes[descricao] || descricao; // Retorna a descrição original se não houver tradução
}

function mostrarImagem() {
    const climaIcone = document.getElementById('weather-icon');
    climaIcone.style.display = 'block'; 
}
