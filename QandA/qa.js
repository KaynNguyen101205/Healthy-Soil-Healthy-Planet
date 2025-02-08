function submitQuestion() {
    let username = document.getElementById("username-input").value.trim();
    let questionText = document.getElementById("question-input").value.trim();

    if (!username || !questionText) {
        alert("Please enter your name and a question!");
        return;
    }

    fetch("http://localhost:8002/questions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,  // ✅ Ensure key name matches backend model
            question_text: questionText
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Question submitted:", data);
        loadQuestions(); // ✅ Reload questions
        document.getElementById("username-input").value = "";
        document.getElementById("question-input").value = "";
    })
    .catch(error => console.error("Error submitting question:", error));
}
function loadQuestions() {
    fetch("http://localhost:8002/questions/")
    .then(response => response.json())
    .then(data => {
        let questionList = document.getElementById("question-list");
        questionList.innerHTML = "";

        data.forEach(question => {
            let listItem = document.createElement("li");

            // ✅ Display username and question
            listItem.innerHTML = `
                <b>${question.username} asks:</b> ${question.question_text}
                <button onclick="toggleAnswerBox(${question.id})">💬 Answer</button>
                <div id="answer-box-${question.id}" class="answer-box" style="display:none;">
                    <input type="text" id="answer-input-${question.id}" placeholder="Your answer...">
                    <button onclick="submitAnswer(${question.id})">Submit Answer</button>
                </div>
                <p><strong>Answer:</strong> ${question.answer_text ? question.answer_text : "No answer yet"}</p>
            `;

            questionList.appendChild(listItem);
        });
    })
    .catch(error => console.error("Error fetching questions:", error));
}
function toggleAnswerBox(questionId) {
    let answerBox = document.getElementById(`answer-box-${questionId}`);
    if (answerBox.style.display === "none") {
        answerBox.style.display = "block";
    } else {
        answerBox.style.display = "none";
    }
}
function submitAnswer(questionId) {
    let answerText = document.getElementById(`answer-input-${questionId}`).value.trim();

    if (!answerText) {
        alert("Please enter an answer before submitting!");
        return;
    }

    fetch(`http://localhost:8002/answers/${questionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer_text: answerText })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Answer submitted:", data);
        loadQuestions(); // Refresh the question list
    })
    .catch(error => console.error("Error submitting answer:", error));
}
// ✅ Load questions when page loads
document.addEventListener("DOMContentLoaded", loadQuestions);

