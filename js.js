const btn_adicionar = document.querySelector("button#adicionar");
const btn_limpar = document.querySelector("#limpar");
const txt = document.querySelector("input#txt");
const res = document.querySelector("#res");
let arrayTarefas = []



function tarefasCookies(){
    console.log(localStorage.length);

    if (localStorage.length > 0){
        let arrayArmazenado = JSON.parse(localStorage.getItem("Tarefas"));
        arrayTarefas = arrayArmazenado
        console.log(arrayTarefas)
        
        Object.values(arrayTarefas).forEach(function(valor){
            adicionar(valor)
        }
        )
    }
}

function verificar(){
    txt.value.length > 0 ? adicionar(txt.value) : alert("Insira uma tarefa a ser adicionada!");
}

function adicionar(texto) {
    
    const CoisasTarefa = document.createElement('div');
    CoisasTarefa.classList.add('CoisasTarefa');

    const Tarefa = document.createElement('p');
    Tarefa.classList.add('tarefa');
    Tarefa.id = texto
    Tarefa.innerText = texto;
    CoisasTarefa.appendChild(Tarefa);


    const excluir = document.createElement("button");
    excluir.classList.add('excluir');
    CoisasTarefa.appendChild(excluir);

    res.appendChild(CoisasTarefa);
    txt.value = "";

    arrayTarefas.push(texto)
    localStorage.setItem("Tarefas",JSON.stringify(arrayTarefas));

}

function deletar(e){
    const item = e.target
    const textoItem = item.parentElement.querySelector("p").textContent
    console.log()
    if (item.classList[0] === 'excluir'){
        item.parentElement.remove()
        arrayTarefas.splice(textoItem,1)
        localStorage.setItem("Tarefas",JSON.stringify(arrayTarefas));

    }
   
}

function limpar(){
    res.innerHTML = ``
    localStorage.clear()
}

txt.addEventListener("keydown",function(e){
    if (e.key == "Enter"){
        adicionar(txt.value)
    }
});

res.addEventListener("click",deletar);
btn_limpar.addEventListener("click",limpar);
btn_adicionar.addEventListener("click",verificar);
window.onload = tarefasCookies







