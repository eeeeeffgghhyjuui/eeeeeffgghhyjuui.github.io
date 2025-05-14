let quizData, correctAnswer, isAnswering = false;

async function Main() {
    if (!quizData) {
        const response = await fetch('data.json');
        quizData = await response.json();
    }
    if (localStorage.getItem("score") === null) {
        localStorage.setItem("score", "0");
    }
    document.getElementById("score").textContent = "Score: " + localStorage.getItem("score")

    isAnswering = false;

    const randomIndex = Math.floor(Math.random() * Object.keys(quizData).length);
    const current = quizData[randomIndex];
    correctAnswer = current.correct;

    document.getElementById("quiz-img").src = current.img;

    const wrongAnswers = Object.keys(quizData)
        .filter(key => key != randomIndex)
        .map(key => quizData[key].correct);

    shuffleArray(wrongAnswers);
    const choices = [correctAnswer, ...wrongAnswers.slice(0, 3)];
    shuffleArray(choices);

    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`btn-${i + 1}`);
        btn.innerText = choices[i];
    }

    localStorage.setItem("correctAnswer", correctAnswer);
}

function handleAnswerClick(btn) {
    if (isAnswering) return;
    isAnswering = true;

    const buttons = document.querySelectorAll('button');

    if (btn.textContent == localStorage.getItem("correctAnswer")) {
        localStorage.setItem("score", parseInt(localStorage.getItem("score")) + 1);
    } else {
        localStorage.setItem("score", parseInt(localStorage.getItem("score")) - 1);
    }
    document.getElementById("score").textContent = "Score: " + localStorage.getItem("score");

    buttons.forEach(b => {
        if (b.innerText === correctAnswer) {
            b.style.backgroundColor = '#28a745';
            b.style.borderBottom = '4px solid #1c7c31';
        } else {
            b.style.backgroundColor = '#dc3545';
            b.style.borderBottom = '4px solid #b02a37';
        }
    });

    setTimeout(() => {
        resetButtonColors();
        Main();
    }, 3000);
}

function resetButtonColors() {
    const btnStyles = {
        "btn-1": ["#007bff", "#0056b3"],
        "btn-2": ["#28a745", "#1c7c31"],
        "btn-3": ["#ffc107", "#e0a800"],
        "btn-4": ["#dc3545", "#b02a37"]
    };

    Object.keys(btnStyles).forEach(id => {
        const [bg, border] = btnStyles[id];
        const btn = document.getElementById(id);
        btn.style.backgroundColor = bg;
        btn.style.borderBottom = `4px solid ${border}`;
    });
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

window.onload = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`btn-${i}`).addEventListener('click', function () {
            handleAnswerClick(this);
        });
    }
    Main();
};
