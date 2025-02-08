function checkAnswers() {
    const answers = {
        q1: "B",
        q2: "C",
        q3: "A",
        q4: "B",
        q5: "B",
        q6: "B",
        q7: "C"
    };

    let score = 0;
    const totalQuestions = Object.keys(answers).length;

    for (let i = 1; i <= totalQuestions; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === answers[`q${i}`]) {
            score++;
        }
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `You scored ${score} out of ${totalQuestions}!`;
    resultDiv.style.color = score === totalQuestions ? "#367c2b" : "#E74C3C"; /* Green for success, red for failure */
}