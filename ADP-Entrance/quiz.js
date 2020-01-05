const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const scoreText = document.getElementById("score");
const quiz = document.getElementById("quiz");

// retrieve quiz number 
let qNum = localStorage.getItem("quizChoice"); 
let score = 0;
let answerKey = 0; 
let questionCounter = 0;
let currentQ = {};
let questions = [];
let qRemaining = [];
let answerValue = [];
let acceptingAnswers = false;

// set quiz and launch quiz
function quizNum(elem) {
  qNum = elem.getAttribute("id");
  localStorage.setItem("quizChoice", qNum); 
  window.location.href="quiz.html";
}
// get data from json file
fetch("quiz.json")
.then(response => {
  return response.json();
})
.then(data => {
  // put all question data together
  questions = data.quizzes[qNum].questions.map(questionData => {
    const eachQuestion = {
    question: questionData.question
    }; 
    console.log(eachQuestion);
    
    // put all answer choices together
    const answerChoices = questionData.answers;
    answerChoices.forEach((choice, index) => {
      eachQuestion["choice" + (index + 1)] = choice;
    }); 
    console.log(answerChoices);
    
    return eachQuestion;
  });
  startQuiz();
})
.catch(error => {
  console.error('Error:', error);
});
// function to start quiz - will reset counters, load questions, get new questions
startQuiz = () => {
  questionCounter = 0;
  score = 0;
  qRemaining = [...questions];
  getNewQuestion();
  quiz.classList.remove("hidden");
};

getNewQuestion = () => {
  // check if questions are done, if so, go to completion page
  if (qRemaining.length === 0 || questionCounter >= 3) {
    localStorage.setItem("currentScore", score);
    return window.location.assign("completion.html");
  }

  questionCounter++;
  answerValue = [];
  // set random question order
  const questionIndex = Math.floor(Math.random() * qRemaining.length);
  currentQ = qRemaining[questionIndex];
  question.innerHTML = currentQ.question;
  choices.forEach(choice => {
    const number = choice.dataset["number"];
    const answerTitle = currentQ["choice" + number].content;
    console.log(answerTitle);
    
    choice.innerHTML = answerTitle;
    // array of boolean values 
    answerValue.push(currentQ["choice" + number].value);
  });
  // find which index contains the 'true' boolean
  for (let i = 0; i < answerValue.length; i++) {
    if (answerValue[i]) {
      answerKey = i+1;
      break;
    }
  }
  // remove previous question
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
    // check if answer key value matches index of value: true
    selectedAnswer == answerKey ? "correct" : "incorrect"; 
    console.log(answerKey);
    
    if (classToApply === "correct") {
      incrementScore(1);
    }
    // set 2 second delay to move onto next question
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