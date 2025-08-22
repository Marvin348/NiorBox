const questionBtn = document.querySelectorAll(".faq__question-btn");
const answer = document.querySelectorAll(".faq__answer");

function showAnswer() {
  questionBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const answerDiv = btn.nextElementSibling;
      answerDiv.classList.toggle("hidden");

      const icon = btn.querySelector("i");
      icon.classList.toggle("fa-plus");
      icon.classList.toggle("fa-minus");
    });
  });
}
showAnswer();
