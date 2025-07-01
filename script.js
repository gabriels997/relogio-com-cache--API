const relogio = document.getElementById("relogio");

function atualizarDisplay(dataUTC) {
  const data = new Date(dataUTC);
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');
  relogio.textContent = `${horas}:${minutos}:${segundos}`;
}

async function buscarHoraInternet() {
  try {
    const resposta = await fetch("https://worldtimeapi.org/api/timezone/America/Sao_Paulo");
    if (!resposta.ok) throw new Error("Resposta da API não OK");
    const json = await resposta.json();
    return new Date(json.utc_datetime);
  } catch (erro) {
    console.error("Erro ao buscar hora da internet:", erro);
    return new Date(); // fallback para hora local do sistema
  }
}

async function obterHora() {
  const cache = localStorage.getItem("horaInternet");
  const agora = Date.now();
  let dataInicial;

  if (cache) {
    const dados = JSON.parse(cache);
    if (agora - dados.timestamp < 600000) {
      dataInicial = new Date(dados.hora);
    } else {
      dataInicial = await buscarHoraInternet();
      localStorage.setItem("horaInternet", JSON.stringify({ hora: dataInicial.toISOString(), timestamp: agora }));
    }
  } else {
    dataInicial = await buscarHoraInternet();
    localStorage.setItem("horaInternet", JSON.stringify({ hora: dataInicial.toISOString(), timestamp: agora }));
  }

  let tempoAtual = new Date(dataInicial);
  atualizarDisplay(tempoAtual);

  setInterval(() => {
    tempoAtual.setSeconds(tempoAtual.getSeconds() + 1);
    atualizarDisplay(tempoAtual);
  }, 1000);

  setInterval(async () => {
    tempoAtual = await buscarHoraInternet();
    localStorage.setItem("horaInternet", JSON.stringify({ hora: tempoAtual.toISOString(), timestamp: Date.now() }));
  }, 600000);
}

obterHora();
