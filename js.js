const btn_adicionar = document.querySelector("button#adicionar");
const btn_limpar = document.querySelector("#limpar");
const txt = document.querySelector("input#txt");
const res = document.querySelector("#res");
let arrayTarefas = [];

function tarefasCookies() {

  if (localStorage.length > 0) {
    let arrayArmazenado = JSON.parse(localStorage.getItem("Tarefas"));

    arrayTarefas = arrayArmazenado.filter(function (a) {
      return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
    }, Object.create(null))
    

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

function adicionar(texto) {
  const CoisasTarefa = document.createElement("div");
  CoisasTarefa.classList.add("CoisasTarefa");

  const Tarefa = document.createElement("p");
  Tarefa.classList.add("tarefa");
  Tarefa.innerText = texto;
  CoisasTarefa.appendChild(Tarefa);

  const sublinhar = document.createElement("button");
  sublinhar.classList.add("sublinhar");
  CoisasTarefa.appendChild(sublinhar)

  const excluir = document.createElement("button");
  excluir.classList.add("excluir");
  CoisasTarefa.appendChild(excluir);

  txt.value = "";
  if (!arrayTarefas.includes(texto)){
    arrayTarefas.push(texto);
    localStorage.setItem("Tarefas", JSON.stringify(arrayTarefas));
  }

  res.appendChild(CoisasTarefa);
}

function sublinhar(e){
    const item = e.target;
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

res.addEventListener("click", sublinhar);
res.addEventListener("click", deletar);
btn_limpar.addEventListener("click", limpar);
btn_adicionar.addEventListener("click", verificar);
window.onload = tarefasCookies;
