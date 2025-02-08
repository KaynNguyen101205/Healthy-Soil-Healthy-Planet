function checkAnswers() {
    // Correct Answers
    const correctAnswers = {
        q1: "B",
        q2: "B",
        q3: "B",
        q4: "B",
        q5: "C",
        q6: "B",
        q7: "A",
        q8: "B"
    };

    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;

    for (let key in correctAnswers) {
        let selectedAnswer = document.querySelector(`input[name="${key}"]:checked`);
        if (selectedAnswer) {
            if (selectedAnswer.value === correctAnswers[key]) {
                score++;
            }
        }
    }

    let resultText = `You got ${score} out of ${totalQuestions} correct.`;
    document.getElementById("result").innerHTML = resultText;
}
