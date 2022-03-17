if (window.localStorage.getItem(`Correct`) == null) {
    window.localStorage.setItem(`Correct`, 0);
    window.localStorage.setItem(`Total-Questions`, 0);
}
let missedQuestionsList = [];
let questionsAsked = [];

if (window.localStorage.getItem(`Missed-Questions`) == null) {
    window.localStorage.setItem(`Missed-Questions`, JSON.stringify(missedQuestionsList));
    window.localStorage.setItem(`Question-Asked`, JSON.stringify(questionsAsked));
}

const body = document.querySelector(`body`);
const options = document.getElementById(`button-group`);
const currentQuestion = document.getElementById(`question`);
const totalQuestions = document.getElementById(`question-total`);
const correctAnswers = document.getElementById(`correct`);
const accuracy = document.getElementById(`accuracy`);
const container = document.querySelector(`#container`)
const clear = document.getElementById(`clear`);
const $ul = document.querySelector(`ul`);
let selectedAnswer = document.querySelector(`.selected`);
let beginButton = document.querySelector(`[data-begin="start"]`);
let correctNumber = localStorage.getItem(`Correct`);
let totalQuestionsCount = localStorage.getItem(`Total-Questions`)
let correctChoice = ``;

correctAnswers.textContent = correctNumber;
totalQuestions.textContent = totalQuestionsCount;

clear.addEventListener(`click`, function () {
    window.localStorage.clear();
    document.location.reload();
});


// curl this url for a new session token https://opentdb.com/api_token.php?command=request

// apply parameters found on https://opentdb.com/api_config.php

function trivia() {
    const triviaSite = `https://opentdb.com/api.php?amount=1&type=multiple`
    options.innerHTML = ``;
    fetch(triviaSite)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let triviaObject = data.results[0];
            currentQuestion.innerHTML = triviaObject.question;
            let triviaQuestion = [triviaObject.correct_answer, triviaObject.incorrect_answers[0], triviaObject.incorrect_answers[1], triviaObject.incorrect_answers[2]];
            correctChoice = data.results[0].correct_answer;
            for (let i = 0; i < 4; i++) {
                let answerChoices = Math.floor(Math.random() * triviaQuestion.length); // math random rolls a .25 * 4 == [1] 
                let answers = document.createElement(`button`);
                answers.setAttribute(`class`, `options`)
                answers.innerHTML = triviaQuestion[answerChoices];
                options.appendChild(answers);
                triviaQuestion.splice(answerChoices, 1);
            }
            return correctChoice;
        });

    options.addEventListener('click', function (event) {
        let chosen = event.target;
        let options = document.getElementsByClassName(`options`)
        options[0].classList.remove(`selected`)
        options[1].classList.remove(`selected`)
        options[2].classList.remove(`selected`)
        options[3].classList.remove(`selected`)
        chosen.classList.add(`selected`);
        selectedAnswer = document.querySelector(`.selected`);
        return selectedAnswer;
    });
};

beginButton.addEventListener(`click`, function () {
    let submitButton = document.createElement(`button`)
    submitButton.setAttribute(`id`, `submit`);
    submitButton.textContent = `Lock in Choice`
    container.insertBefore(submitButton, container.children[3]);
    beginButton.remove();
    trivia();
    let submit = document.getElementById(`submit`);
    submit.addEventListener(`click`, checkAnswer);
});

function checkAnswer() {
    if (selectedAnswer.innerHTML === correctChoice) {
        correctNumber++;
        totalQuestionsCount++;
        window.localStorage.setItem(`Correct`, correctNumber);
        window.localStorage.setItem(`Total-Questions`, totalQuestionsCount);
        correctAnswers.textContent = correctNumber;
        totalQuestions.textContent = totalQuestionsCount;
        accuracy.textContent = Math.round(correctNumber / totalQuestionsCount * 100)
        trivia();
    } else {
        totalQuestionsCount++
        window.localStorage.setItem(`Total-Questions`, totalQuestionsCount);
        totalQuestions.textContent = totalQuestionsCount;
        accuracy.textContent = Math.round(correctNumber / totalQuestionsCount * 100);
        console.log(correctChoice);
        showIncorrectAnswers(totalQuestionsCount, currentQuestion.textContent, correctChoice);
        trivia();
    }
};

function showIncorrectAnswers(x, y, z) {
    let wrongInput = {
        num: x,
        ques: y,
        ans: z,
    }
    $ul.innerHTML = ``;

    let missedQuestionArray = JSON.parse(window.localStorage.getItem(`Missed-Questions`));
    missedQuestionArray.unshift(wrongInput);
    for (let i = 0; i < missedQuestionArray.length; i++) {
        let wrong = document.createElement(`li`);
        wrong.innerHTML = `Question#${missedQuestionArray[i].num} <span id="missedQ">${missedQuestionArray[i].ques}</span><span id="missedA">Correct Answer:${missedQuestionArray[i].ans}</span>`;
        $ul.appendChild(wrong);
    }
    window.localStorage.setItem(`Missed-Questions`, JSON.stringify(missedQuestionArray));
};

// adding this comment here so i can push again
