
var admin = require("firebase-admin");
var user = require('readline-sync')

var serviceAccount = require("./credenciais.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projeto-firebase-9635c.firebaseio.com"
});

var tabela = 'atividade-firebase'
var db = admin.database().ref(tabela)


function insereAtivdade(){
  var atividade = user.question('digite qual atividade: \n')
  var data = user.question('digite a data de hj: \n')
  var tipo = user.question('digite o tipo da atividade: \n')
  var titulo = user.question('digite o tipo da atividade: ')

  db.push({
    atividade: atividade,
    data: data,
    tipo: tipo,
    titulo: titulo
  })
  menu()
}

function mostrarAtividade(){
  db.on('value', snapshot => {
    console.log(snapshot.val())
  menu()
  })
}

function sair(){
  process.exit()
}

function menu(){
  console.log("Digite A para cadastrar")
  console.log("Digite B para mostrar")
  console.log("Digite C para sair")
  var choice = user.question("Escolha: ")
  if(choice.toUpperCase() === "A"){
    insereAtivdade()
  }else if(choice.toUpperCase() === "B"){
    mostrarAtividade()
  }else if(choice.toUpperCase() === "C"){
      sair()
  }else{
      console.log("dados errados")
  }
}
menu()