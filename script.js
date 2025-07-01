const relogio = document.getElementById("relogio");

function atualizarDisplay(dataUTC) {
  const data = new Date(dataUTC);
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');
  relogio.textContent = `${horas}:${minutos}:${segundos}`;
}

async function obterHora() {
  const cache = localStorage.getItem("horaInternet");
  let dataInicial;

  if (cache) {
    const dados = JSON.parse(cache);
    dataInicial = new Date(dados.hora);
  } else {
    const resposta = await fetch("https://worldtimeapi.org/api/timezone/America/Sao_Paulo");
    const json = await resposta.json();
    dataInicial = new Date(json.utc_datetime);
    localStorage.setItem("horaInternet", JSON.stringify({ hora: dataInicial.toISOString() }));
  }

  let tempoAtual = new Date(dataInicial);

  setInterval(() => {
    tempoAtual.setSeconds(tempoAtual.getSeconds() + 1);
    atualizarDisplay(tempoAtual);
  }, 1000);
}

obterHora();
