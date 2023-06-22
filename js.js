const btn_adicionar = document.querySelector("button#adicionar")
const btn_limpar = document.querySelector("#limpar")
const txt = document.querySelector("input#txt")
const res = document.querySelector("#res")





function verificar(){
    txt.value.length > 0 ? adicionar() : alert("Insira uma tarefa a ser adicionada!")
}

function adicionar(){
    const CoisasTarefa = document.createElement('div')
    CoisasTarefa.classList.add('CoisasTarefa')

    const Tarefa = document.createElement('p')
    Tarefa.classList.add('tarefa')
    Tarefa.innerText = txt.value
    CoisasTarefa.appendChild(Tarefa)


    const excluir = document.createElement("button")
    excluir.classList.add('excluir')
    CoisasTarefa.appendChild(excluir)

    res.appendChild(CoisasTarefa)
    txt.value = ""

    let listaTarefas = document.querySelectorAll(".tarefa")
    console.log(listaTarefas)
}

function deletar(e){
    const item = e.target

    if (item.classList[0] === 'excluir'){
        item.parentElement.remove()
        console.log('hey')
    }
   
}

function limpar(){
    res.innerHTML = ``
}

txt.addEventListener("keydown",function(e){
    if (e.key == "Enter"){
        adicionar()
    }
})

res.addEventListener("click",deletar)
btn_limpar.addEventListener("click",limpar)
btn_adicionar.addEventListener("click",verificar)

// armazenar o objeto
var pessoa = {
    nome: "André",
    idade: "17",
};
localStorage.setItem("pessoa",JSON.stringify(pessoa));

// recuperar o objeto
var objetoArmazenado = localStorage.getItem("pessoa")
objetoArmazenado = objetoArmazenado.JSON.parse(objetoArmazenado)
console.log(objetoArmazenado)



