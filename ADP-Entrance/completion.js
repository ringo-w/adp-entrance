const finalScore = document.getElementById("finalScore");
const currentScore = localStorage.getItem("currentScore");

// change pass/fail message based on current score (e.g. pass if 2 or more answers are correct)
document.getElementById("passOrFail").innerHTML = currentScore >= 2 ? "You Passed!" : "You Failed!";
// change the pass/fail message to red or green depending on incorrect or correct answer respectively
document.getElementById("passOrFail").style.color = currentScore >= 2 ? "green" : "red";
// show current score
finalScore.innerText = "Score: " + currentScore + "/3";