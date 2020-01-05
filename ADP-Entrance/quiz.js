const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const scoreText = document.getElementById("score");
const quiz = document.getElementById("quiz");

let qNum = localStorage.getItem("quizChoice"); 
let score = 0;
let answerKey = 0; 
let questionCounter = 0;
let currentQ = {};
let questions = [];
let qRemaining = [];
let answerValue = [];
let acceptingAnswers = false;

function quizNum(elem) {
  qNum = elem.getAttribute("id");
  localStorage.setItem("quizChoice", qNum); 
  window.location.href="quiz.html";
}

fetch("quiz.json")
.then(response => {
  return response.json();
})
.then(data => {
  questions = data.quizzes[qNum].questions.map(questionData => {
    const eachQuestion = {
    question: questionData.question
    }; 
    const answerChoices = questionData.answers;
    answerChoices.forEach((choice, index) => {
      eachQuestion["choice" + (index + 1)] = choice;
    }); 
    return eachQuestion;
  });
  startQuiz();
})
.catch(error => {
  console.error('Error:', error);
});

startQuiz = () => {
  questionCounter = 0;
  score = 0;
  qRemaining = [...questions];
  getNewQuestion();
  quiz.classList.remove("hidden");
};

getNewQuestion = () => {
  if (qRemaining.length === 0 || questionCounter >= 3) {
    localStorage.setItem("currentScore", score);
    return window.location.assign("completion.html");
  }
  questionCounter++;
  answerValue = [];
  const questionIndex = Math.floor(Math.random() * qRemaining.length);
  currentQ = qRemaining[questionIndex];
  question.innerHTML = currentQ.question;
  choices.forEach(choice => {
    const number = choice.dataset["number"];
    const answerTitle = currentQ["choice" + number].content;
    choice.innerHTML = answerTitle;
    answerValue.push(currentQ["choice" + number].value);
  });

  for (let i = 0; i < answerValue.length; i++) {
    if (answerValue[i]) {
      answerKey = i+1;
      break;
    }
  }
  qRemaining.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const classToApply =
    selectedAnswer == answerKey ? "correct" : "incorrect"; 
    if (classToApply === "correct") {
      incrementScore(1);
    }
    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 2000);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score + "/3";
};