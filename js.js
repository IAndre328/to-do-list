const btn_adicionar = document.querySelector("button#adicionar");
const btn_limpar = document.querySelector("#limpar");
const txt = document.querySelector("input#txt");
const res = document.querySelector("#res");

let arrayTarefas = [];
let alarmes = [];

function tarefasCookies() {

    let tarefasArrayArmazenado = JSON.parse(localStorage.getItem("tarefas"));
    arrayTarefas = tarefasArrayArmazenado;
    console.log(arrayTarefas);
    
    arrayTarefas.forEach(function (valor) {
      adicionar(valor);
    });

    let alarmesArrayArmazenado = JSON.parse(localStorage.getItem("alarmes"));
    console.log(alarmesArrayArmazenado)
  

}

const extrairtxt = (input)=>input.value;
const extrair_p_Pai = (item)=>  item.parentElement.querySelector("p");

function verificar() {
  if (extrairtxt(txt).length > 0 && !arrayTarefas.includes(txt.value)) {
    adicionar(txt.value);
  } else if (arrayTarefas.includes(txt.value)){
    const alerta = criarElemento("p",["alerta"]);
    alerta.textContent = "Essa tarefa já existe";
    usePopup([alerta]);
    
  } else if(extrairtxt(txt).length == 0) {
    const alerta = criarElemento("p",["alerta"]);
    alerta.textContent = "Insira uma tarefa!";
    usePopup([alerta]);
  }
  txt.value = "";
}

function criarElemento(tag,nomeClasse = [],func){
  const elemento = document.createElement(tag);
  elemento.classList.add(...nomeClasse);
  if (tag == "button") elemento.onclick = func;
  return elemento;
}

function adicionar(texto) {
  const CoisasTarefa = criarElemento("div",["CoisasTarefa"]);
  const Tarefa = criarElemento("p",["tarefa"]);
  Tarefa.textContent = texto;
  const alarme = criarElemento("button",["alarme"],"configAlarme");
  const sublinhar = criarElemento("button",["sublinhar"],"sublinhar");
  const excluir = criarElemento("button",["excluir"],"excluir");

  adicionarElementos(CoisasTarefa,[Tarefa,alarme,sublinhar,excluir])

  
  if (!arrayTarefas.includes(texto)){
    arrayTarefas.push(texto);
    localStorage.setItem("tarefas", JSON.stringify(arrayTarefas));
  }

  res.appendChild(CoisasTarefa);
}

function adicionarElementos(lugar,elementos){
  elementos.forEach(elemento => {
    lugar.appendChild(elemento);
  });
}

function configAlarme(e){
  const item = e.target;
  let itemP = extrair_p_Pai(item).textContent;
  if (item.classList[0] === "alarme") {
    const txtDate = criarElemento("input",["txtDate"]);
    txtDate.type = "datetime-local";
    const usoDate = criarElemento("label");
    usoDate.for = "btn_date";
    usoDate.textContent = "Clique no símbolo da agenda para definir a data!"
    const btn_date = criarElemento("button",["btn_date"],()=>{extrairDadosAlarme(txtDate.value,itemP)});
    btn_date.textContent = "Configurar";
    usePopup([usoDate,txtDate,btn_date]);
  }
    
}

const dataSistema = () => {
  let dataCompletaSystem = new Date();
  let dataSystem = {
      dia: dataCompletaSystem.getDate(),
      mes: dataCompletaSystem.getMonth() +1,
      ano: dataCompletaSystem.getFullYear()
    }
    return [dataSystem,dataCompletaSystem];

}

function extrairDadosAlarme(date,texto){

    let dataCompletaUser = new Date(date);

    let dataUser = {
      dia:dataCompletaUser.getDate(),
      mes:dataCompletaUser.getMonth() +1,
      ano:dataCompletaUser.getFullYear()
    }

    const comparar = ()=> dataCompletaUser > dataSistema()[1];

    const alerta = criarElemento("p",["alerta"]);
    alerta.textContent = "Insira uma data válida";
    
    if (comparar("ano") && comparar("mes") && comparar("dia")) {
      inserirAlarme({dataUser},texto)
    } else {
      usePopup([alerta]);
    }

}

function inserirAlarme(quando = {dia,mes,ano},mensagemNotificacao){
 
  let newAlarme = {
    tempo: quando,
    corpo: mensagemNotificacao,
  };
  console.log(newAlarme)
  alarmes.push(newAlarme);
  console.log(alarmes);
  localStorage.setItem("alarme",JSON.stringify(alarmes));
}

function sublinhar(e){
    const item = e.target
    const itemP = extrair_p_Pai(item);
    
    if (item.classList[0] === "sublinhar") {
        if (itemP.classList.contains("sublinhado")){
           itemP.classList.remove("sublinhado");
        } else {
            itemP.classList.add("sublinhado");
        }
    }

}

function deletar(e) {
  const item = e.target;
  const textoItem = extrair_p_Pai(item).textContent;

  if (item.classList[0] === "excluir") {
    item.parentElement.remove();
    arrayTarefas = arrayTarefas.filter(valor => valor !== textoItem);
    localStorage.setItem("Tarefas", JSON.stringify(arrayTarefas));
  }
}

function limpar() {
  res.innerHTML = "";
  localStorage.clear();
  window.location.reload();
}

function usePopup(item = []) {
  const divConfigAlarme = criarElemento("div", ["configAlarme"]);
  const popup = criarElemento("div", ["blur"]);

  
  const sair = () => {
    desusePopup(popup);
    window.removeEventListener("keydown", esc);
    txt.addEventListener("keydown", enter);
  };

  const esc = (e) => {
    if (e.key === "Escape") {
      sair();
      e.preventDefault();
    }
  };

  window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      sair();
    }
  });

  window.addEventListener("keydown", esc);

  const btn_fechar = criarElemento("button", ["btn_fechar"], () => {
    sair();
  });


  adicionarElementos(document.querySelector("body"), [popup]);
  adicionarElementos(popup, [divConfigAlarme]);
  adicionarElementos(divConfigAlarme, [btn_fechar]);
  adicionarElementos(divConfigAlarme, [...item]);
}

function desusePopup(popup) {
  popup.remove();
}

// Verificar se o navegador suporta a API de Notificações
if ('Notification' in window) {
    // Verificar se as permissões de notificação foram concedidas pelo usuário
    if (Notification.permission === 'granted') {
      
      // Criar e exibir a notificação
      exibirNotificacao();
    } else if (Notification.permission !== 'denied') {
     
      // Solicitar permissão ao usuário para exibir notificações
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          // Permissão concedida, criar e exibir a notificação
          exibirNotificacao();
        }
      });
    }
    
  }
  
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
  

function enter(e) {
    if (e.key == "Enter") {
      verificar();
    }
  }
txt.addEventListener("keydown", enter);

res.addEventListener("click",configAlarme)
res.addEventListener("click", sublinhar);
res.addEventListener("click", deletar);
btn_limpar.addEventListener("click", limpar);
btn_adicionar.addEventListener("click", verificar);
window.onload = ()=>{if(localStorage.length > 0)tarefasCookies()};
