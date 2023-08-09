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
  let tarefasArrayArmazenado = JSON.parse(localStorage.getItem("tarefas"));
  arrayTarefas = tarefasArrayArmazenado || [];

  arrayTarefas.forEach(function (valor) {
    adicionar(valor);
  });

  let alarmesArrayArmazenado = JSON.parse(localStorage.getItem("alarmes"));
  alarmes = alarmesArrayArmazenado || [];

}

// Função para extrair o valor de um elemento de entrada (input)
const extrairtxt = (input) => input.value;

// Função para extrair o elemento p pai de um item
const extrair_p_Pai = (item) => item.parentElement.querySelector("p");

// Função para verificar e adicionar uma nova tarefa
function verificar() {
  if (extrairtxt(txt).length > 0 && !arrayTarefas.includes(txt.value)) {
    adicionar(txt.value);
  } else if (arrayTarefas.includes(txt.value)) {
    const alerta = criarElemento("p", ["alerta"]);
    alerta.textContent = "Essa tarefa já existe";
    usePopup([alerta]);
  } else if (extrairtxt(txt).length == 0) {
    const alerta = criarElemento("p", ["alerta"]);
    alerta.textContent = "Insira uma tarefa!";
    usePopup([alerta]);
  }
  txt.value = "";
}

// Função para criar um elemento HTML
function criarElemento(tag, nomeClasse = [], func) {
  const elemento = document.createElement(tag);
  elemento.classList.add(...nomeClasse);
  if (tag == "button") elemento.onclick = func;
  return elemento;
}

// Função para adicionar uma nova tarefa a lista de tarefas e ao arrayTarefas
function adicionar(texto) {
  const CoisasTarefa = criarElemento("div", ["CoisasTarefa"]);
  const Tarefa = criarElemento("p", ["tarefa"]);
  Tarefa.textContent = texto;
  const alarme = criarElemento("button", ["alarme"], "configAlarme");
  const sublinhar = criarElemento("button", ["sublinhar"], "sublinhar");
  const excluir = criarElemento("button", ["excluir"], "excluir");

  adicionarElementos(CoisasTarefa, [Tarefa, alarme, sublinhar, excluir]);

  if (!arrayTarefas.includes(texto)) {
    arrayTarefas.push(texto);
    localStorage.setItem("tarefas", JSON.stringify(arrayTarefas));
  }

  res.appendChild(CoisasTarefa);
}

// Função para adicionar múltiplos elementos a um elemento pai
function adicionarElementos(lugar, elementos) {
  elementos.forEach((elemento) => {
    lugar.appendChild(elemento);
  });
}

// Função para lidar com a configuração do alarme
function configAlarme(e) {
  const item = e.target;
  const itemP = extrair_p_Pai(item).textContent
  if (item.classList[0] === "alarme") {
    const txtDate = criarElemento("input", ["txtDate"]);
    txtDate.type = "datetime-local";
    const usoDate = criarElemento("label");
    usoDate.for = "btn_date";
    usoDate.textContent = "Clique no símbolo da agenda para definir a data!";
    const btn_date = criarElemento("button", ["btn_date"]);
    btn_date.textContent = "Configurar";
    usePopup([usoDate, txtDate, btn_date],itemP);
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
  
  const comparar = () => dataCompletaUser >= dataSistema()[1].getTime();
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
  const item = e.target;
  const itemP = extrair_p_Pai(item);

  if (item.classList[0] === "sublinhar") {
    itemP.classList.toggle("sublinhado");
  }
}

// Função para deletar uma tarefa
function deletar(e) {
  const item = e.target;
  const textoItem = extrair_p_Pai(item).textContent;

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
      extrairDadosAlarme(txtDate.value, nomeTarefa, sair);
    });
  }

}

// Função para remover um popup
function desusePopup(popup) {
  popup.remove();
}


function notificacaoAlarme(){
  const dataSys = dataSistema()[0];
  console.log(alarmes)
   let repetir = setInterval(()=>{
      alarmes.forEach(element => {
        console.log(element.quando.dia)
        if (
          element.quando.dia == dataSys.dia &&
          element.quando.mes == dataSys.mes &&
          element.quando.ano == dataSys.ano &&
          element.quando.horas == dataSys.horas &&
          element.quando.minutos == dataSys.minutos
          ) {
          exibirNotificacao(element.corpo);
        }
      });
    },1000)
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
  function exibirNotificacao(mensagemNotificacao = 'Notificação genérica') {
    // Cria uma nova instância de notificação
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
  
// Função para verificar se a tecla Enter foi pressionada e chamar a função verificar()
function enter(e) {
    if (e.key == "Enter") {
      verificar();
    }
  }
// Adicionar evento de pressionar tecla Enter ao elemento de entrada de texto (txt)
txt.addEventListener("keydown", enter);

// Adicionar eventos de clique aos elementos dentro de res
res.addEventListener("click", configAlarme);
res.addEventListener("click", sublinhar);
res.addEventListener("click", deletar);

// Adicionar eventos de clique aos botões de limpar e adicionar
btn_limpar.addEventListener("click", limpar);
btn_adicionar.addEventListener("click", verificar);

// Executar a função tarefasCookies quando a janela carregar, se houver tarefas armazenadas
window.onload = () => {
  if (localStorage.length != 0) {
    tarefasCookies();
  }
};
