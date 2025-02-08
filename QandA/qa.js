function submitQuestion() {
    let usernameInput = document.getElementById("username-input");
    let questionInput = document.getElementById("question-input");

    let username = usernameInput.value.trim();
    let questionText = questionInput.value.trim();

    if (username === "" || questionText === "") {
        alert("Please enter both your name and question!");
        return;
    }

    fetch("http://localhost:8002/questions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, question_text: questionText })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err });
        }
        return response.json();
    })
    .then(data => {
        console.log("Question submitted:", data);
        loadQuestions(); // Reload questions list after submission
        usernameInput.value = "";
        questionInput.value = "";
    })
    .catch(error => {
        console.error("Error submitting question:", error);
        alert("Failed to submit question. Please check the console for details.");
    });
}

function loadQuestions() {
    fetch("http://localhost:8002/questions/")
    .then(response => response.json())
    .then(data => {
        let questionList = document.getElementById("question-list");
        questionList.innerHTML = ""; // Clear previous questions

        data.forEach(question => {
            let questionItem = document.createElement("li");

            // ✅ Display the farmer's name correctly instead of "Q"
            questionItem.innerHTML = `<b>${question.username}:</b> ${question.question_text}`;
            questionList.appendChild(questionItem);
        });
    })
    .catch(error => console.error("Error fetching questions:", error));
}

// ✅ Load questions when the page loads
document.addEventListener("DOMContentLoaded", loadQuestions);
