const questions = [
    { q: "Jaké je hlavní město ČR?", a: ["Brno", "Praha", "Ostrava"], correct: 1 },
    { q: "Kolik planet má sluneční soustava?", a: ["7", "8", "9"], correct: 1 },
    { q: "Kdo napsal R.U.R.?", a: ["Čapek", "Neruda", "Hašek"], correct: 0 },
    { q: "Hlavní město Japonska?", a: ["Soul", "Peking", "Tokio"], correct: 2 },
    { q: "Chemická značka zlata?", a: ["Ag", "Fe", "Au"], correct: 2 },
    { q: "Který rok začala 2. sv. válka?", a: ["1914", "1939", "1945"], correct: 1 },
    { q: "Nejvyšší hora světa?", a: ["K2", "Sněžka", "Everest"], correct: 2 },
    { q: "Kolik barev má trikolóra ČR?", a: ["2", "3", "4"], correct: 1 },
    { q: "Který orgán pumpuje krev?", a: ["Plíce", "Srdce", "Játra"], correct: 1 },
    { q: "Programovací jazyk pro web?", a: ["C++", "Java", "JavaScript"], correct: 2 }
];

document.addEventListener('DOMContentLoaded', (e) => {

    const wrapper = document.getElementById('quiz-wrapper');
    const card = document.getElementById('question-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    const navDiv = document.querySelector('.navigation');

    let currentIndex = 0;
    const userAnswers = JSON.parse(sessionStorage.getItem('quizAnswers')) || new Array(questions.length).fill(null);

    window.saveAnswer = (index) => {
        userAnswers[currentIndex] = index;
        sessionStorage.setItem('quizAnswers', JSON.stringify(userAnswers));
    };

    function renderCurrentQuestion() {

        card.innerHTML = "";

        const data = questions[currentIndex];
        let title = document.createElement('h2');
        title.textContent = `Otázka ${currentIndex + 1} z ${questions.length}`;
        let question = document.createElement('p');
        question.textContent = data.q;

        card.append(title);
        card.append(question);
        
        data.a.forEach((ans, i) => {
            const label = document.createElement('label');
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `q${currentIndex}`;
            radio.value = i;
            radio.checked = userAnswers[currentIndex] === i;
            
            radio.addEventListener('change', () => {
                saveAnswer(i);
            });

            label.appendChild(radio);
            label.appendChild(document.createTextNode(` ${ans}`));
            
            card.appendChild(label);
            card.appendChild(document.createElement('br'));
        });

        prevBtn.disabled = currentIndex === 0;
        nextBtn.style.display = currentIndex === questions.length - 1 ? 'none' : 'inline-block';
        finishBtn.style.display = currentIndex === questions.length - 1 ? 'inline-block' : 'none';
    }

    function showFinalResults() {
        
        navDiv.innerHTML = "";
        const finalHeader = document.createElement('h2');
        finalHeader.textContent = "Výsledky testu";

        wrapper.insertBefore(finalHeader, wrapper.firstChild);

        card.innerHTML = ""; 
        let score = 0;

        questions.forEach((data, qIdx) => {
            const userAnswer = userAnswers[qIdx];
            const isCorrect = userAnswer === data.correct;
            if (isCorrect) score++;

            const qDiv = document.createElement('div');
            qDiv.className = "question";
            
            const qText = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = `${qIdx + 1}. ${data.q}`;
            qText.appendChild(strong);
            qDiv.appendChild(qText);
            
            data.a.forEach((ans, aIdx) => {
                const label = document.createElement('label');
                
                if (aIdx === data.correct) {
                    label.classList.add('correct');
                } else if (userAnswer === aIdx && !isCorrect) {
                    label.classList.add('wrong');
                }

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.disabled = true;
                radio.checked = userAnswer === aIdx;

                label.appendChild(radio);
                label.appendChild(document.createTextNode(` ${ans}`));
                
                qDiv.appendChild(label);
                qDiv.appendChild(document.createElement('br'));
            });

            card.appendChild(qDiv);
        });

        const resultSummary = document.createElement('p');
        const scoreStrong = document.createElement('strong');
        scoreStrong.textContent = `Celkové skóre: ${score} z ${questions.length}`;
        resultSummary.appendChild(scoreStrong);
        card.prepend(resultSummary);
    }

    prevBtn.onclick = () => {
        currentIndex--;
        renderCurrentQuestion();
    };
    nextBtn.onclick = () => {
        currentIndex++;
        renderCurrentQuestion();
    };
    finishBtn.onclick = showFinalResults;

    renderCurrentQuestion();
});