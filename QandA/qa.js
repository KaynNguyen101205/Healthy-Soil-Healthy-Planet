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
        const questionList = document.getElementById("question-list");
        questionList.innerHTML = "";

        data.forEach(question => {
            const listItem = document.createElement("div");
            listItem.classList.add("question-item");

            listItem.innerHTML = `
                <div class="question-container">
                    <div class="question-box">
                        <p><strong>${question.username} asks:</strong></p>
                        <p>${question.question_text}</p>
                        <button onclick="toggleAnswerBox(${question.id})">💬 Answer</button>
                    </div>

                    <div id="answer-box-${question.id}" class="answer-input-box" style="display:none;">
                        <input type="text" id="answer-input-${question.id}" placeholder="Your answer...">
                        <button onclick="submitAnswer(${question.id})">Submit Answer</button>
                    </div>

                    <div class="answer-box">
                        <p><strong>Answer:</strong></p>
                        <p>${question.answer_text ? question.answer_text : "<i>No answer yet.</i>"}</p>
                        <button id="upvote-${question.id}" class="upvote-button" onclick="upvoteAnswer(${question.id})">👍 Upvote (${question.upvotes})</button>
                    </div>
                </div>
            `;

            questionList.appendChild(listItem);
        });
    })
    .catch(error => console.error("Error fetching questions:", error));
}


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
function upvoteAnswer(questionId) {
    fetch(`http://localhost:8002/questions/${questionId}/upvote/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Upvote successful:", data);
        refreshUpvoteCount(questionId, data.upvotes); // ✅ Update count without full reload
    })
    .catch(error => console.error("Error upvoting answer:", error));
}   
function upvoteQuestion(questionId) {
    fetch(`http://localhost:8002/questions/${questionId}/upvote/`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            console.log("Upvote successful:", data);
            refreshUpvoteCount(questionId, data.upvotes); // Update UI without full reload
        })
        .catch(error => console.error("Error upvoting:", error));
}

// Function to update upvote count without reloading all questions
function refreshUpvoteCount(questionId, newUpvoteCount) {
    const upvoteElement = document.querySelector(`#upvote-${questionId}`);
    if (upvoteElement) {
        upvoteElement.innerText = `👍 Upvotes: ${newUpvoteCount}`;
    }
}
document.addEventListener("DOMContentLoaded", loadQuestions);
function searchQuestions() {
    let searchQuery = document.getElementById("search-input").value.trim();

    if (searchQuery.length === 0) {
        loadQuestions(); // ✅ Reload all questions if search is empty
        return;
    }

    fetch(`http://localhost:8002/search/?query=${encodeURIComponent(searchQuery)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("No results found");
            }
            return response.json();
        })
        .then(data => {
            console.log("Search results:", data);
            displayQuestions(data); // ✅ Make sure this function exists
        })
        .catch(error => {
            console.error("Error searching questions:", error);
            document.getElementById("question-list").innerHTML = `<p>No questions found.</p>`;
        });
}

// ✅ Attach event listener for live search
document.getElementById("search-input").addEventListener("input", searchQuestions);

function displayQuestions(questions) {
    const questionList = document.getElementById("question-list");
    questionList.innerHTML = ""; // ✅ Clear previous results

    if (questions.length === 0) {
        questionList.innerHTML = "<p>No questions found.</p>";
        return;
    }

    questions.forEach(question => {
        const listItem = document.createElement("div");
        listItem.classList.add("question-item");

        listItem.innerHTML = `
            <div class="question-container">
                <div class="question-box">
                    <p><strong>${question.username} asks:</strong></p>
                    <p>${question.question_text}</p>
                    <button onclick="toggleAnswerBox(${question.id})">💬 Answer</button>
                </div>

                <div id="answer-box-${question.id}" class="answer-input-box" style="display:none;">
                    <input type="text" id="answer-input-${question.id}" placeholder="Your answer...">
                    <button onclick="submitAnswer(${question.id})">Submit Answer</button>
                </div>

                <div class="answer-box">
                    <p><strong>Answer:</strong></p>
                    <p>${question.answer_text ? question.answer_text : "<i>No answer yet.</i>"}</p>
                    <button id="upvote-${question.id}" class="upvote-button" onclick="upvoteAnswer(${question.id})">👍 Upvote (${question.upvotes})</button>
                </div>
            </div>
        `;

        questionList.appendChild(listItem);
    });
}
