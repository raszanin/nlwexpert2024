const perguntas = [
  {
    pergunta: "Qual é a forma correta de declarar uma variável em JavaScript?",
    respostas: [
      "var myVar;",
      "let myVar;",
      "myVar = 10;",
    ],
    correta: 1,
  },
  {
    pergunta: "Qual dos seguintes é um tipo de dado primitivo em JavaScript?",
    respostas: [
      "Array",
      "Object",
      "String",
    ],
    correta: 2,
  },
  {
    pergunta: "Como você chama uma função chamada 'myFunction' em JavaScript?",
    respostas: [
      "invoke myFunction();",
      "call myFunction();",
      "myFunction();",
    ],
    correta: 2,
  },
  {
    pergunta: "Qual é a maneira correta de verificar se uma variável 'x' é igual a 5 em JavaScript?",
    respostas: [
      "if (x = 5)",
      "if (x == 5)",
      "if (x === 5)",
    ],
    correta: 2,
  },
  {
    pergunta: "Qual método é usado para adicionar um novo elemento ao final de um array em JavaScript?",
    respostas: [
      "push()",
      "append()",
      "addToEnd()",
    ],
    correta: 0,
  },
  {
    pergunta: "Como você acessa o terceiro elemento em uma matriz chamada 'myArray'?",
    respostas: [
      "myArray[2]",
      "myArray[3]",
      "myArray[1]",
    ],
    correta: 0,
  },
  {
    pergunta: "Qual é a função de 'console.log()' em JavaScript?",
    respostas: [
      "Imprimir uma mensagem na tela do usuário",
      "Registrar mensagens de erro",
      "Imprimir uma mensagem no console do navegador",
    ],
    correta: 2,
  },
  {
    pergunta: "Qual dos seguintes métodos é usado para remover o último elemento de um array em JavaScript?",
    respostas: [
      "removeLast()",
      "pop()",
      "deleteLast()",
    ],
    correta: 1,
  },
  {
    pergunta: "Qual é a função do operador '===' em JavaScript?",
    respostas: [
      "Atribuição",
      "Comparação de valor e tipo",
      "Comparação de valor",
    ],
    correta: 1,
  },
  {
    pergunta: "Qual é a forma correta de comentar uma linha em JavaScript?",
    respostas: [
      "// Comentário aqui",
      "/* Comentário aqui */",
      "<!-- Comentário aqui -->",
    ],
    correta: 0,
  },
];

const template = document.querySelector('template');
const quiz = document.querySelector('#quiz');

const corretas = new Set();

const totalPerguntas = perguntas.length;

const mostrarTotal = document.querySelector('#acertos span');
mostrarTotal.textContent = corretas.size + ' de ' + totalPerguntas;


for(const item of perguntas) {
  const quizItem = template.content.cloneNode(true);
  quizItem.querySelector('h3').textContent = item.pergunta;
  
  for(let resposta of item.respostas) {
    const dt = quizItem.querySelector('dl dt').cloneNode(true);
    dt.querySelector('span').textContent = resposta;
    dt.querySelector('input').setAttribute('name', 'pergunta-' + perguntas.indexOf(item));
    dt.querySelector('input').value = item.respostas.indexOf(resposta);

    dt.querySelector('input').onchange = (event) => {
      const isCorrect = event.target.value == item.correta;
      
      corretas.delete(item);
      if(isCorrect) {
        corretas.add(item)
        
      }   
      mostrarTotal.textContent = corretas.size + ' de ' + totalPerguntas;    
    };

    quizItem.querySelector('dl').appendChild(dt);
  }

  quizItem.querySelector('dl dt').remove();
  
  quiz.appendChild(quizItem);  
}