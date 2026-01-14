const questions = [
    {
        q: "Why do humans yawn?",
        options: ["Oxygen", "Boredom", "Empathy", "Sleepiness"],
        answer: 2
    },
    {
        q: "Which body part keeps growing?",
        options: ["Eyes", "Ears", "Brain", "Fingers"],
        answer: 1
    },
    {
        q: "Why are embarrassing moments remembered?",
        options: ["Often", "Danger signal", "Longer", "Reminder"],
        answer: 1
    },
    {
        q: "Phone battery in cold weather?",
        options: ["Faster", "Normal", "Drains", "Stops"],
        answer: 2
    },
    {
        q: "Why do humans laugh?",
        options: ["Happiness", "Stress relief", "Bonding", "All"],
        answer: 3
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 10;
let timer;
let userAnswers = [];

const instruction = document.getElementById("instruction");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const questionEl = document.getElementById("question");
const options = document.querySelectorAll(".option");
const nextBtn = document.getElementById("next");
const scoreEl = document.getElementById("score");
const summaryEl = document.getElementById("summary");
const factEl = document.getElementById("fact");

document.getElementById("startQuiz").onclick = () => {
    instruction.classList.add("hidden");
    quiz.classList.remove("hidden");
    loadQuestion();
};

function startTimer() {
    clearInterval(timer);
    timeLeft = 10;
    document.getElementById("timer").textContent = "Time left: 10";

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = "Time left: " + timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            disableOptions();
            nextBtn.click();
        }
    }, 1000);
}

function loadQuestion() {
    const q = questions[currentQuestion];
    questionEl.textContent = q.q;

    options.forEach((btn, i) => {
        btn.textContent = q.options[i];
        btn.disabled = false;
        btn.className = "option";
        btn.onclick = () => checkAnswer(i);
    });

    startTimer();
}

function disableOptions() {
    options.forEach(btn => btn.disabled = true);
}

function checkAnswer(selected) {
    clearInterval(timer);
    disableOptions();

    userAnswers[currentQuestion] = selected;
    options[questions[currentQuestion].answer].classList.add("correct");

    if (selected === questions[currentQuestion].answer) {
        score++;
    } else {
        options[selected].classList.add("incorrect");
    }
}

nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        quiz.classList.add("hidden");
        result.classList.remove("hidden");
        scoreEl.textContent = `You scored ${score} / ${questions.length}`;
        showSummary();
        fetchFact();
    }
};

function showSummary() {
    summaryEl.textContent = "";

    questions.forEach((q, i) => {
        const p1 = document.createElement("p");
        p1.textContent = `Q${i + 1}: ${q.q}`;

        const p2 = document.createElement("p");
        p2.textContent =
            "Your answer: " +
            (userAnswers[i] !== undefined
                ? q.options[userAnswers[i]]
                : "Not answered");

        const p3 = document.createElement("p");
        p3.textContent = "Correct answer: " + q.options[q.answer];

        summaryEl.appendChild(p1);
        summaryEl.appendChild(p2);
        summaryEl.appendChild(p3);
        summaryEl.appendChild(document.createElement("hr"));
    });
}

function fetchFact() {
    fetch("https://official-joke-api.appspot.com/random_joke")
        .then(res => res.json())
        .then(data => {
            factEl.textContent = "Did you know? " + data.text;
        });
}

document.getElementById("retake").onclick = () => {
    clearInterval(timer);
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    quiz.classList.add("hidden");
    result.classList.add("hidden");
    instruction.classList.remove("hidden");
};
