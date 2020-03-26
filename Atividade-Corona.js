//Importador
//Crie um programa chamado importador.js ele será usado para trazer os dados do endpoint para aplicação. 
//A api que vamos usar é essa.
//https://api.covid19api.com/summary

//o fluxo do programa é :

//Deletar todos os dados existente na tabela corona
//Consumir o endpoint utilizando o axios
//Iterar no resultado Countries
//Para cada iteração salvar as informações daquele country na tabela corona

//Desta forma toda vida que rodarmos o importador ele vai gerar uma base nova local com dados + atualizados, então para atualizar nossa aplicação só vamos executar
//node .\importador.js

//Tente fazer usando os exemplos de outras atividades para chegar na solução
//Se mesmo assim estiver difícil aqui fica uma colinha : 
//https://docs.google.com/document/d/1V--XdNtdilnXbGcfHEt_GdLGlWy8xoG-vLYL1Vxxb-M/edit?usp=sharing


var axios = require('axios')
var sqlite = require('sqlite3')

var db = new sqlite.Database ('./dadosCorona.db', (erro) => {
    if(erro){
        console.log("erro ao conectar com o servidor")
    }
})

axios.get('https://api.covid19api.com/summary')
.then(resultado => { 
    
    var paises = resultado.data.Countries

    db.run('DELETE FROM dadosCorona', errDel => {
        if(errDel){
            console.log('Erro ao deletar colunas: ',errDel)
        }
        paises.forEach(pais => { 
        db.run('INSERT INTO dadosCorona (Country, TotalConfirmed, NewConfirmed, NewDeaths, TotalDeaths, NewRecovered, TotalRecovered) VALUES (?, ?, ?, ?, ?, ?, ?)', [pais.Country, pais.TotalConfirmed, pais.NewConfirmed, pais.NewDeaths, pais.TotalDeaths, pais.NewRecovered, pais.TotalRecovered], (erro) => {
            if(erro){
                console.log('Erro ao inserir dados: ', erro)
            }
        })
            
        })
    })

}) 

var user = require('readline-sync')

function percentualRecuperacao(){
    db.all('SELECT (TotalRecovered/TotalConfirmed)*100 as percentual FROM dadosCorona ORDER by (TotalRecovered/TotalConfirmed)*100 DESC limit 10'), (erro,resultado) =>{
        if(erro){
            console.log(erro)
        }
        console.log(resultado)
    }  
}

function percentualDeMortos(){
    db.all('SELECT (TotalDeaths/TotalConfirmed)*100 as percentual FROM dadosCorona ORDER by (TotalDeaths/TotalConfirmed)*100 DESC limit 10'), (erro, resultado) => {
        if(erro){
            console.log(erro)
        }
        console.log(resultado)
    }
}

function maisInfectados() {
    db.all('SELECT (Country),(NewConfirmed) FROM dadosCorona ORDER BY NewConfirmed DESC LIMIT 10',(erro,resultado) => {
        if(erro){
            console.log(erro)
        }
        console.log(resultado)
    })
}
function novosInfectados(){
    db.all('SELECT (Country),(TotalConfirmed) FROM dadosCorona ORDER BY TotalConfirmed DESC LIMIT 20',(erro,resultado) => {
        if(erro){
            console.log(erro)
        }
        console.log(resultado)
    })
}
function maiorMortalidade(){
db.all('SELECT (Country),(TotalDeaths) FROM dadosCorona ORDER BY TotalDeaths DESC LIMIT 10',(erro,resultado) => {
    if(erro){
        console.log(erro)
    }
    console.log(resultado)
})
}
function maiorRecuperacao(){ 
db.all('SELECT Country, TotalRecovered FROM dadosCorona ORDER BY TotalRecovered DESC LIMIT 10',(erro,resultado) => {
    if(erro){
        console.log(erro)
    }
    console.log(resultado)
})
}

function paisUnico(nome){
    
    db.all('SELECT * FROM dadosCorona WHERE Country=?', nome ,(erro,resultado)=>{
        if(erro){
            console.log("Erro ao selecionar")
        }
        console.log(resultado)
    })
}


var pergunta = user.questionInt('Digite:\n 1 para mais infectados, \n 2 para novos infectados,\n 3 para maior mortalidade,\n 4 para maior taxa de recuperacao,\n 5 para escolher um pais,\n 6 para percentual de mortalidade dos mais afetados,\n 7 para percentual de recuperacao dos mais afetados: ')


if(pergunta === 1){
    maisInfectados()
}
if(pergunta === 2){
    novosInfectados()
}
if(pergunta === 3){
    maiorMortalidade()
}
if(pergunta === 4){
    maiorRecuperacao()
}
if(pergunta === 5){
    var nome = user.question('digite o nome (em ingles e com a primeira letra maiuscula) do pais q vc deseja pesquisar: ')
    paisUnico(`${nome}`)
}
if(pergunta === 6){
  percentualDeMortos()
}