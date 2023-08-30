// Selecionar os elementos do DOM
const btn_adicionar = document.querySelector("button#adicionar");
const btn_limpar = document.querySelector("#limpar");
const txt = document.querySelector("input#txt");
const res = document.querySelector("#res");

// Array para armazenar as tarefas
let arrayTarefas = [];
// Array para armazenar os alarmes
let alarmes = [];

// Função para recuperar as tarefas do armazenamento local (cookies)
function tarefasCookies() {
  arrayTarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  arrayTarefas.forEach(adicionarTarefa);

  alarmes = JSON.parse(localStorage.getItem("alarmes")) || [];
}

// Função para extrair o valor de um elemento de entrada (input)
const extrairValorInput = (input) => input.value;

// Função para extrair o elemento p pai de um item
const extrairPaiDoItem = (item) => item.parentElement.querySelector("p");

// Função para verificar e adicionar uma nova tarefa
function verificarTarefa() {
  const valorInput = extrairValorInput(txt);

  if (valorInput.length > 0 && !arrayTarefas.includes(valorInput)) {

    adicionarTarefa(valorInput);

  } else if (arrayTarefas.includes(valorInput)) {

    exibirAlerta("Essa tarefa já existe");

  } else if (valorInput.length === 0) {

    exibirAlerta("Insira uma tarefa!");

  }

  txt.value = "";
}

// Função para exibir um alerta em um popup
function exibirAlerta(mensagem) {

  const alerta = criarElemento("p", ["alerta"]);

  alerta.textContent = mensagem;

  usePopup([alerta]);
}

// Função para criar um elemento HTML
function criarElemento(tag, classes = [], func) {

  const elemento = document.createElement(tag);

  elemento.classList.add(...classes);

  if (tag === "button") elemento.onclick = func;

  return elemento;
}

// Função para adicionar uma nova tarefa à lista de tarefas e ao arrayTarefas
function adicionarTarefa(texto) {

  const tarefaDiv = criarElemento("div", ["CoisasTarefa"]);

  const tarefaParagrafo = criarElemento("p", ["tarefa"]);

  tarefaParagrafo.textContent = texto;

  const alarmeBtn = criarElemento("button", ["alarme"], configAlarme);

  const sublinharBtn = criarElemento("button", ["sublinhar"], sublinhar);

  const excluirBtn = criarElemento("button", ["excluir"], deletar);

  adicionarElementos(tarefaDiv, [tarefaParagrafo, alarmeBtn, sublinharBtn, excluirBtn]);

  if (!arrayTarefas.includes(texto)) {

    arrayTarefas.push(texto);

    localStorage.setItem("tarefas", JSON.stringify(arrayTarefas));
  }

  res.appendChild(tarefaDiv);
}

// Função para adicionar múltiplos elementos a um elemento pai
function adicionarElementos(elementoPai, elementosFilhos) {

  elementosFilhos.forEach((elementoFilho) => {

    elementoPai.appendChild(elementoFilho);

  });
}

// Função para lidar com a configuração do alarme
function configAlarme(e) {
  
  const item = e.target;

  const textoItem = extrairPaiDoItem(item).textContent;

  if (item.classList[0] == "alarme") {

    const txtDate = criarElemento("input", ["txtDate"]);
    txtDate.type = "datetime-local";

    const usoDate = criarElemento("label");
    usoDate.htmlFor = "btn_date";
    usoDate.textContent = "Clique no símbolo da agenda para definir a data!";

    const btn_date = criarElemento("button", ["btn_date"]);
    btn_date.textContent = "Configurar";

     usePopup([usoDate, txtDate, btn_date], textoItem);
    
  }
}

// Função para obter a data do sistema
const dataSistema = () => {
  let dataCompletaSystem = new Date();
  let dataSystem = {
    dia: dataCompletaSystem.getDate(),
    mes: dataCompletaSystem.getMonth() + 1,
    ano: dataCompletaSystem.getFullYear(),
    horas: dataCompletaSystem.getHours(),
    minutos: dataCompletaSystem.getMinutes(),
  };
  return [dataSystem, dataCompletaSystem];
};

// Função para extrair os dados do alarme e inseri-lo
function extrairDadosAlarme(date, texto, fecharPopup) {

  let dataCompletaUser = new Date(date);
  let dataUser = {
    dia: dataCompletaUser.getDate(),
    mes: dataCompletaUser.getMonth() + 1,
    ano: dataCompletaUser.getFullYear(),
    horas: dataCompletaUser.getHours(),
    minutos: dataCompletaUser.getMinutes(),
  };
  
  const comparar = () => dataCompletaUser >= dataSistema()[1]
  console.log(dataCompletaUser)
  const alerta = criarElemento("p", ["alerta"]);
  alerta.textContent = "Insira uma data válida";

  if (comparar()) {
    inserirAlarme( dataUser , texto);
    fecharPopup(); // Fechar o popup após inserir o alarme
  } else {
    usePopup([alerta]);
  }
}

// Função para inserir um novo alarme no array de alarmes
function inserirAlarme(quando, mensagemNotificacao) {
  let newAlarme = {
    quando,
    corpo: mensagemNotificacao,
  };
  alarmes.push(newAlarme);
  localStorage.setItem("alarmes", JSON.stringify(alarmes));
}

// Função para sublinhar uma tarefa
function sublinhar(e) {
  console.log("teste")
  const item = e.target;
  const itemP = extrairPaiDoItem(item);

  if (item.classList[0] === "sublinhar") {
    itemP.classList.toggle("sublinhado");
  }
}

// Função para deletar uma tarefa
function deletar(e) {
  const item = e.target;
  const textoItem = extrairPaiDoItem(item).textContent;

  if (item.classList[0] === "excluir") {
    item.parentElement.remove();
    arrayTarefas = arrayTarefas.filter((valor) => valor !== textoItem);
    localStorage.setItem("tarefas", JSON.stringify(arrayTarefas));
    alarmes = alarmes.filter(objeto => objeto.corpo !== textoItem);
    localStorage.setItem("alarmes", JSON.stringify(alarmes));
  }
}

// Função para limpar o conteúdo e redefinir o armazenamento local
function limpar() {
  res.innerHTML = "";
  localStorage.clear();
  window.location.reload();
}

// Função para exibir um popup com conteúdo personalizado
function usePopup(item = [],nomeTarefa) {
  const divConfigAlarme = criarElemento("div", ["configAlarme"]);
  const popup = criarElemento("div", ["blur"]);

  const sair = () => {
    desusePopup(popup);
  };

  const esc = (e) => {
    if (e.key === "Escape") {
      sair();
    }
  };

  window.addEventListener("keydown", esc);

  const btn_fechar = criarElemento("button", ["btn_fechar"], () => {
    sair();
  });

  adicionarElementos(document.querySelector("body"), [popup]);
  adicionarElementos(popup, [divConfigAlarme]);
  adicionarElementos(divConfigAlarme, [btn_fechar]);
  adicionarElementos(divConfigAlarme, [...item]);

  
  
    const btn_date = item.find((element) => element.classList.contains("btn_date"));
    
    if (btn_date) {
      btn_date.addEventListener("click", () => {
        const txtDate = document.querySelector(".txtDate");
        console.log(txtDate)
        extrairDadosAlarme(txtDate.value, nomeTarefa, sair);
      });
    }
  
  }



// Função para remover um popup
function desusePopup(popup) {
  popup.remove();
}


// Função para verificar alarmes e exibir notificações
function notificacaoAlarme() {
 

  let repetir = setInterval(() => {
    const dataAtual = dataSistema()[0];

    alarmes.forEach(element => {
      const alarmeData = element.quando;

      if (
        dataAtual.ano >= alarmeData.ano &&
        dataAtual.mes >= alarmeData.mes &&
        dataAtual.dia >= alarmeData.dia &&
        dataAtual.horas >= alarmeData.horas &&
        dataAtual.minutos >= alarmeData.minutos
      ) {
        exibirNotificacao(element.corpo);
      }
    });
  }, 60000); // Verificar a cada minuto (60000 milissegundos)
}


// Verificar se o navegador suporta a API de Notificações
if ('Notification' in window) {
    // Verificar se as permissões de notificação foram concedidas pelo usuário
    if (Notification.permission === 'granted') {
      
      if (alarmes.length > 0) {
        console.log(alarmes);
        notificacaoAlarme();
      }

    } else if (Notification.permission !== 'denied') {
     
      // Solicitar permissão ao usuário para exibir notificações
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {

          // Permissão concedida, criar e exibir a notificação
          const alerta = criarElemento("p", ["alerta"]);

          alerta.textContent = "Agora o notificaremos sobre o alarme =)";

          usePopup([alerta]);
          
          
          if (alarmes.length > 0) {

            console.log(alarmes);

            notificacaoAlarme();

          }

        }
      });
    }
    
  }
  
  // Função para exibir uma notificação
 // Função para exibir uma notificação
function exibirNotificacao(mensagemNotificacao = 'Seus alarmes serão mostrados aqui!') {
  const notificacao = new Notification('Lixeirinha bonitinha', {
    body: mensagemNotificacao,
    icon: '../imagem/lixeira.png' // Opcional: caminho para um ícone da notificação
  });

  // Manipular eventos da notificação (opcional)
  notificacao.onclick = function () {
    // Lidar com o evento de clique na notificação
    // Por exemplo, redirecionar o usuário para uma página específica
    window.location.href = 'https://github.com/IAndre328';
  };
}

// Função para verificar se a tecla Enter foi pressionada e chamar a função verificarTarefa()
function aoPressionarEnter(evento) {
  if (evento.key === "Enter") {
    verificarTarefa();
  }
}

// Adicionar eventos de pressionar tecla Enter ao elemento de entrada de texto (txt)
txt.addEventListener("keydown", aoPressionarEnter);



// Adicionar eventos de clique aos botões de limpar e adicionar
btn_limpar.addEventListener("click", limpar);
btn_adicionar.addEventListener("click", verificarTarefa);

// Executar a função tarefasCookies quando a janela carregar, se houver tarefas armazenadas
window.onload = () => {
  if (localStorage.length !== 0) {
    tarefasCookies();
  }
};
