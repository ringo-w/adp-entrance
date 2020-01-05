const finalScore = document.getElementById("finalScore");
const currentScore = localStorage.getItem("currentScore");

document.getElementById("passOrFail").innerHTML = currentScore >= 2 ? "You Passed!" : "You Failed!";
document.getElementById("passOrFail").style.color = currentScore >= 2 ? "green" : "red";
finalScore.innerText = "Score: " + currentScore + "/3";