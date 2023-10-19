const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percantage = (value / time) * 100;
    progressBar.style.width = `${percantage}%`;
    progressText.innerHTML = `${value}`;
}

let questions = [],
    time = 30,
    score = 0,
    currentQuestion,
    timer;

const startBtn = document.querySelector(".start"),
    numQuestions = document.getElementById("num-questions"),
    categorySelect = document.querySelector("#category"),
    difficulty = document.querySelector("#difficulty"),
    timePerQuestion = document.querySelector("#time"),
    quiz = document.querySelector(".quiz"),
    startscreen = document.querySelector(".start-screen");

populateCategories = () => {
    const categorySelect = document.querySelector("#category"); // Definisanje categorySelect unutar funkcije
    fetch("https://opentdb.com/api_category.php")
      .then(response => response.json())
      .then(data => {
        if (data.trivia_categories) {
          const categories = data.trivia_categories;
          categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id; 
            option.textContent = category.name;
            categorySelect.appendChild(option);
          });
        }
      })
      .catch(error => console.error("Error:", error));
  }
  
populateCategories();
      
const startQuiz = () => {
    const num = numQuestions.value,
        cat = categorySelect.value,
        diff = difficulty.value;
    // API URL
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`; 

    fetch(url)
    .then(response => response.json())
    .then(data => {
        questions = data.results;
        startscreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[0]);
    })
    .catch(error => console.error("Error:", error));
};

startBtn.addEventListener("click", startQuiz);
const submitBtn = document.querySelector(".submit"),
    nextBtn = document.querySelector(".next");

const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
        answersWrapper = document.querySelector(".answer-wrapper"),
        questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question;

    const answers = [
        ...question.incorrect_answers,
        question.correct_answer.toString(),
      ];
      answersWrapper.innerHTML = "";
      answers.sort(() => Math.random() - 0.5);
      answers.forEach((answer) => {
        answersWrapper.innerHTML += `
            <div class="answer">
                <span class="text">${answer}</span>
                <span class="checkbox">
                    <span class="icon">✓</span>
                </span>
            </div>`;
    });

    questionNumber.innerHTML = `
    Question <span class="current">${questions.indexOf(question) + 1}
    </span><span class="total">/${questions.length}</span>
    `;

    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach(answer => {
        answer.addEventListener("click", () => {
            // if answer not already submitted
            if(!answer.classList.contains("checked"))
            {
                // remove selected from other answer
                answerDiv.forEach(answer => {
                    answer.classList.remove("selected");
                });
                // add selected on currently clicked
                answer.classList.add("selected");
                submitBtn.disabled = false;
            }
        });
    });

    // aftser updating question start timer
    time  = timePerQuestion.value;
    startTimer(time);
};

const startTimer = (time) =>{
    timer = setInterval(() =>{
        if(time >= 0)
        {
            // if timer more than - means time ramaining
            // move progress
            progress(time);
            time--;
        }
        else
        {
            // if time finishes means less than 0
            checkAnswer();
        }
    }, 1000);
};

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

const checkAnswer = () => {

  clearInterval(timer);

  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) 
  {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    console.log(currentQuestion);
    if (answer === questions[currentQuestion - 1].correct_answer) 
    {
      score++;
      selectedAnswer.classList.add("correct");
    } 
    else 
    {
      selectedAnswer.classList.add("wrong");
      const correctAnswer = document
        .querySelectorAll(".answer")
        .forEach((answer) => {
            if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) 
                answer.classList.add("correct");
            else 
            {
                const correctAnswer = document.querySelectorAll(".answer")
                .forEach((answer) => {
                    if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) 
                        answer.classList.add("correct");
                });
            }
        });
    }
  }
  
  // if nothing is selected
  else
  {
    const correctAnswer = document
    .querySelectorAll(".answer")
    .forEach(answer => {
        if(answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer)
            answer.classList.add("correct");
    })
  }

  // block user to select further answers
  const answerDiv = document.querySelectorAll(".answer");
  answerDiv.forEach(answer => {
    answer.classList.add("checked");
  })

  // after submit show next btn to go to next question
  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

// on Next Btn click, show next question
nextBtn.addEventListener("click", () => {
    nextQuestion();
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
});


const nextQuestion = () => {
    // if there is remaining question
    if(currentQuestion < questions.length)
    {
        currentQuestion++;
        showQuestion(questions[currentQuestion - 1]);
    }
    else
        // if is no more questions
        showScore();
}

const endScreen = document.querySelector(".end-screen"),
    finalScore = document.querySelector(".final-score"),
    totalScore = document.querySelector(".total-score");

const showScore = () =>{
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/${questions.length}`;
}

const restartbtn = document.querySelector(".restart");
restartbtn.addEventListener("click", () =>{
    window.location.reload();
})