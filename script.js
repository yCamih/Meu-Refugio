const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

const emotionButtons = document.querySelectorAll(".emotion-btn");
const emocaoSelecionada = document.getElementById("emocaoSelecionada");
const textoDiario = document.getElementById("textoDiario");
const diarioForm = document.getElementById("diarioForm");

const totalRegistros = document.getElementById("totalRegistros");
const humorFrequente = document.getElementById("humorFrequente");
const listaHistorico = document.getElementById("listaHistorico");
const graficoSemanal = document.getElementById("graficoSemanal");
const fraseDia = document.getElementById("fraseDia");
const heroEmotion = document.getElementById("heroEmotion");

let registros = JSON.parse(localStorage.getItem("meuRefugioRegistros")) || [];

const frases = [
  "Sentir também faz parte do crescimento.",
  "Você não precisa dar conta de tudo hoje.",
  "Respire. Um passo de cada vez também é avanço.",
  "Seu tempo de cura merece respeito.",
  "Tudo bem pausar antes de continuar.",
  "Cuidar de si também é uma forma de coragem.",
  "Você merece acolhimento, inclusive vindo de você.",
  "Nem todo dia precisa ser produtivo para ter valor."
];

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("show");
});

function mostrarFraseDoDia() {
  const indice = Math.floor(Math.random() * frases.length);
  fraseDia.textContent = `"${frases[indice]}"`;
}

emotionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    emotionButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    const emotion = button.getAttribute("data-emotion");

    emocaoSelecionada.value = emotion;
    heroEmotion.textContent = emotion;
  });
});

diarioForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const emocao = emocaoSelecionada.value;
  const texto = textoDiario.value.trim();

  if (!emocao) {
    alert("Escolha uma emoção antes de salvar.");
    return;
  }

  if (!texto) {
    alert("Escreva algo no seu diário antes de salvar.");
    return;
  }

  const novoRegistro = {
    id: Date.now(),
    emocao: emocao,
    texto: texto,
    data: new Date().toLocaleDateString("pt-BR"),
    diaSemana: new Date().getDay()
  };

  registros.unshift(novoRegistro);

  salvarRegistros();

  diarioForm.reset();
  heroEmotion.textContent = "Registro salvo 💜";

  emotionButtons.forEach((btn) => btn.classList.remove("active"));

  atualizarTela();
});

function salvarRegistros() {
  localStorage.setItem("meuRefugioRegistros", JSON.stringify(registros));
}

function atualizarTela() {
  atualizarTotal();
  atualizarHumorFrequente();
  atualizarHistorico();
  atualizarGraficoSemanal();
}

function atualizarTotal() {
  totalRegistros.textContent = registros.length;
}

function atualizarHumorFrequente() {
  if (registros.length === 0) {
    humorFrequente.textContent = "Nenhum";
    return;
  }

  const contagem = {};

  registros.forEach((registro) => {
    contagem[registro.emocao] = (contagem[registro.emocao] || 0) + 1;
  });

  let humorMaisFrequente = "";
  let maiorQuantidade = 0;

  for (let emocao in contagem) {
    if (contagem[emocao] > maiorQuantidade) {
      maiorQuantidade = contagem[emocao];
      humorMaisFrequente = emocao;
    }
  }

  humorFrequente.textContent = humorMaisFrequente;
}

function atualizarHistorico() {
  listaHistorico.innerHTML = "";

  if (registros.length === 0) {
    listaHistorico.innerHTML = "<p>Nenhum registro ainda.</p>";
    return;
  }

  registros.forEach((registro) => {
    const div = document.createElement("div");
    div.classList.add("registro");

    div.innerHTML = `
      <strong>${registro.emocao}</strong>
      <small>${registro.data}</small>
      <p>${registro.texto}</p>
      <button onclick="excluirRegistro(${registro.id})">Excluir</button>
    `;

    listaHistorico.appendChild(div);
  });
}

function excluirRegistro(id) {
  registros = registros.filter((registro) => registro.id !== id);
  salvarRegistros();
  atualizarTela();
}

function atualizarGraficoSemanal() {
  graficoSemanal.innerHTML = "";

  const dias = [
    "Dom",
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sáb"
  ];

  const contagemDias = [0, 0, 0, 0, 0, 0, 0];

  registros.forEach((registro) => {
    contagemDias[registro.diaSemana]++;
  });

  const maiorValor = Math.max(...contagemDias, 1);

  contagemDias.forEach((quantidade, index) => {
    const altura = (quantidade / maiorValor) * 170;

    const container = document.createElement("div");
    container.classList.add("barra-container");

    container.innerHTML = `
      <div class="barra" style="height: ${altura}px;"></div>
      <div class="barra-label">${dias[index]}</div>
    `;

    graficoSemanal.appendChild(container);
  });
}

mostrarFraseDoDia();
atualizarTela();
