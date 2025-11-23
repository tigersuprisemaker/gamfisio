const questions = [
    {
        title: "Entendendo a Artrite Psoriásica",
        text: "A artrite psoriásica é caracterizada principalmente por:",
        type: "choice",
        options: [
            "Inflamação articular associada à psoríase",
            "Desgaste ósseo sem relação com a pele"
        ],
        correct: 0
    },
    {
        title: "Psoríase e Autoestima",
        text: "Entre os impactos psicossociais da psoríase, destaca-se:",
        type: "choice",
        options: [
            "Melhora da interação social",
            "Diminuição automática da ansiedade",
            "Aumento inevitável da confiança",
            "Redução da autoestima"
        ],
        correct: 3
    },
    {
        title: "Papel da Fisioterapia Dermatofuncional",
        text: "Complete a palavra (dica: melhorar o movimento): M_B_L_D_D_",
        type: "text",
        correct: "MOBILIDADE"
    },
    {
        title: "Abordagens e Técnicas Utilizadas",
        text: "A crioterapia é frequentemente utilizada porque:",
        type: "choice",
        options: [
            "Aumenta a temperatura local",
            "Reduz dor e inflamação",
        ],
        correct: 1
    },
    {
        title: "Incidência e Epidemiologia",
        text: "A artrite psoriásica é mais comum em:",
        type: "choice",
        options: [
            "Pessoas com diagnóstico prévio de psoríase",
            "Pessoas sem histórico de psoríase"
        ],
        correct: 0
    }
];

let index = 0;
let lives = 3;
let score = 0;

// elementos
const startScreen = document.getElementById("startScreen");
const hud = document.getElementById("hud");
const endScreen = document.getElementById("endScreen");
const livesEl = document.getElementById("lives");
const qTitle = document.getElementById("qTitle");
const qText = document.getElementById("qText");
const optionsArea = document.getElementById("options");
const textMode = document.getElementById("textMode");
const txtAnswer = document.getElementById("txtAnswer");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const feedback = document.getElementById("feedback");
const endMessage = document.getElementById("endMessage");
const avatarFace = document.getElementById("avatarFace");
const avatarText = document.getElementById("avatarText");
const sndCorrect = document.getElementById("sndCorrect");
const sndWrong = document.getElementById("sndWrong");
const scoreText = document.getElementById("scoreText");
const levelText = document.getElementById("levelText");
const gameCard = document.getElementById("gameCard");

function ripple(event) {
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    btn.style.setProperty("--ripple-x", x + "px");
    btn.style.setProperty("--ripple-y", y + "px");
}

function setScreen(activeId) {
    [startScreen, hud, endScreen].forEach(el => {
        el.classList.remove("active");
    });
    document.getElementById(activeId).classList.add("active");
}

function startGame(e) {
    if (e) ripple(e);
    index = 0;
    lives = 3;
    score = 0;
    updateLives(true);
    updateScore();
    setAvatar("neutral");
    setScreen("hud");
    loadQuestion();
}

function loadQuestion() {
    const q = questions[index];
    qTitle.textContent = q.title;
    qText.textContent = q.text;

    updateProgress();

    optionsArea.innerHTML = "";
    textMode.style.display = "none";

    if (q.type === "choice") {
        q.options.forEach((opt, i) => {
            const btn = document.createElement("button");
            btn.textContent = opt;
            btn.className = "alt-btn";
            btn.onclick = (ev) => { ripple(ev); checkChoice(i, btn); };
            optionsArea.appendChild(btn);
        });
    } else {
        textMode.style.display = "block";
        txtAnswer.value = "";
        txtAnswer.focus();
    }
}

function updateProgress() {
    const total = questions.length;
    const current = index + 1;
    const percent = (current - 1) / total * 100;
    progressBar.style.width = percent + "%";
    progressLabel.textContent = `Pergunta ${current} de ${total}`;
    levelText.textContent = Math.max(1, current);
}

function updateLives(resetAnimation = false) {
    livesEl.textContent = "❤️".repeat(lives);
    if (resetAnimation) {
        livesEl.classList.add("lives-beat");
    }
    livesEl.classList.remove("lives-hit");
    void livesEl.offsetWidth;
    livesEl.classList.add("lives-hit");
}

function updateScore() {
    scoreText.textContent = score;
}

function showFeedback(msg, isError = false) {
    feedback.textContent = msg;
    feedback.classList.toggle("error", isError);
    feedback.classList.add("show");
    setTimeout(() => feedback.classList.remove("show"), 1200);
}

function setAvatar(state) {
    avatarFace.classList.add("avatar-animate");
    setTimeout(() => avatarFace.classList.remove("avatar-animate"), 350);

    if (state === "happy") {
        avatarFace.textContent = "😎";
        avatarText.textContent = "Excelente! Continue assim.";
    } else if (state === "sad") {
        avatarFace.textContent = "😢";
        avatarText.textContent = "Tudo bem, tente novamente!";
    } else { // neutral
        avatarFace.textContent = "🙂";
        avatarText.textContent = "Pronto para a próxima pergunta?";
    }
}

function playSound(sound) {
    if (!sound) return;
    try {
        sound.currentTime = 0;
        sound.play();
    } catch (e) {
        // navegador pode bloquear autoplay; tudo bem
    }
}

function checkChoice(i, btn) {
    const q = questions[index];

    const allButtons = document.querySelectorAll(".alt-btn");
    allButtons.forEach(b => b.disabled = true);

    if (i === q.correct) {
        btn.classList.add("correct");
        setAvatar("happy");
        showFeedback("✅ Acertou! +10 pontos", false);
        playSound(sndCorrect);
        score += 10;
        updateScore();

        // flash verde na HUD
        gameCard.classList.add("flash-correct");
        setTimeout(() => gameCard.classList.remove("flash-correct"), 800);

        setTimeout(nextQuestion, 3000);
    } else {
        btn.classList.add("wrong");
        setAvatar("sad");
        showFeedback("❌ Errou! -1 vida", true);
        playSound(sndWrong);
        gameCard.classList.add("shake");
        setTimeout(() => gameCard.classList.remove("shake"), 350);
        loseLife();
        setTimeout(nextQuestion, 3000);

        /* if(lives > 0){
            setTimeout(() => allButtons.forEach(b => {
                if(!b.classList.contains("wrong")){
                    b.disabled = false;
                }
            }), 400);
        } */
    }
}

function checkText(e) {
    if (e) ripple(e);
    const answer = txtAnswer.value.toUpperCase().trim();
    const correct = questions[index].correct;

    if (answer === correct) {
        setAvatar("happy");
        showFeedback("✔ Correto! +10 pontos", false);
        playSound(sndCorrect);
        score += 10;
        updateScore();
        gameCard.classList.add("flash-correct");
        setTimeout(() => gameCard.classList.remove("flash-correct"), 400);
        setTimeout(nextQuestion, 900);
    } else {
        setAvatar("sad");
        showFeedback("✘ Não foi dessa vez! -1 vida", true);
        playSound(sndWrong);
        gameCard.classList.add("shake");
        setTimeout(() => gameCard.classList.remove("shake"), 350);
        loseLife();
    }
}

function loseLife() {
    lives--;
    if (lives < 0) lives = 0;
    updateLives();
    if (lives <= 0) {
        endGame(false);
    }
}

function nextQuestion() {
    index++;
    if (index >= questions.length) {
        endGame(true);
    } else {
        setAvatar("neutral");
        loadQuestion();
    }
}

function endGame(win) {
    setScreen("endScreen");
    if (win) {
        endMessage.innerHTML = `🎉 <strong>Missão concluída!</strong><br>Você fez <strong>${score} pontos</strong> e completou todas as perguntas.`;
    } else {
        endMessage.innerHTML = `💔 <strong>Missão falhou!</strong><br>Suas vidas acabaram. Pontuação final: <strong>${score}</strong>.`;
    }
}

function restart(e) {
    if (e) ripple(e);
    setScreen("startScreen");
}