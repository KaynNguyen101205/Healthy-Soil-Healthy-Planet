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
            listItem.classList.add("question-item");

            // ✅ Wrapping each question and answer separately
            listItem.innerHTML = `
                <div class="question-container">
                    <!-- 🎤 Question Box -->
                    <div class="question-box">
                        <p><strong>${question.username} asks:</strong></p>
                        <p>${question.question_text}</p>
                        <button onclick="toggleAnswerBox(${question.id})">💬 Answer</button>
                    </div>

                    <!-- ✏️ Answer Input (Hidden Initially) -->
                    <div id="answer-box-${question.id}" class="answer-input-box" style="display:none;">
                        <input type="text" id="answer-input-${question.id}" placeholder="Your answer...">
                        <button onclick="submitAnswer(${question.id})">Submit Answer</button>
                    </div>

                    <!-- ✅ Answer Box (Below Question) -->
                    <div class="answer-box">
                        <p><strong>Answer:</strong></p>
                        <p>${question.answer_text ? question.answer_text : "<i>No answer yet.</i>"}</p>
                    </div>
                </div>
            `;

            questionList.appendChild(listItem);
        });
    })
    .catch(error => console.error("Error fetching questions:", error));
}

// ✅ Toggle Answer Input Below the Question
function toggleAnswerBox(questionId) {
    let answerBox = document.getElementById(`answer-box-${questionId}`);
    answerBox.style.display = (answerBox.style.display === "none") ? "block" : "none";
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

