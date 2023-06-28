const btn_adicionar = document.querySelector("button#adicionar");
const btn_limpar = document.querySelector("#limpar");
const txt = document.querySelector("input#txt");
const res = document.querySelector("#res");
let arrayTarefas = [];

function tarefasCookies() {

  if (localStorage.length > 0) {
    let arrayArmazenado = JSON.parse(localStorage.getItem("Tarefas"));

    arrayTarefas = arrayArmazenado
    console.log(arrayTarefas)
    
    arrayTarefas.forEach(function (valor) {
      adicionar(valor);
    });
  }
}

function verificar() {
  if (txt.value.length > 0 && !arrayTarefas.includes(txt.value)) {
    adicionar(txt.value);
  } else {
    alert("Insira uma tarefa válida");
  }
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

  txt.value = "";
  if (!arrayTarefas.includes(texto)){
    arrayTarefas.push(texto);
    localStorage.setItem("Tarefas", JSON.stringify(arrayTarefas));
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
  console.log(item)
  if (item.classList[0] === "alarme") {
    const divConfigAlarme = criarElemento("div",["configAlarme"]);
    adicionarElementos(res,[divConfigAlarme]);
  }
    
}

function sublinhar(e){
    const item = e.target
    const itemP = item.parentElement.querySelector("p");
    
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
  const textoItem = item.parentElement.querySelector("p").textContent;

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
  
  function exibirNotificacao() {
    // Cria uma nova instância de notificação
    const notificacao = new Notification('Título da Notificação', {
      body: 'Conteúdo da notificação',
      icon: 'caminho/para/o/icone.png' // Opcional: caminho para um ícone da notificação
    });
  
    // Manipular eventos da notificação (opcional)
    notificacao.onclick = function () {
      // Lidar com o evento de clique na notificação
      // Por exemplo, redirecionar o usuário para uma página específica
      window.location.href = 'https://www.exemplo.com';
    };
  }
  




txt.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    verificar();
  }
});

res.addEventListener("click",configAlarme)
res.addEventListener("click", sublinhar);
res.addEventListener("click", deletar);
btn_limpar.addEventListener("click", limpar);
btn_adicionar.addEventListener("click", verificar);
window.onload = tarefasCookies;
