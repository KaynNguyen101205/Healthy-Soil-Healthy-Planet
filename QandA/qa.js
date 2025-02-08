function submitQuestion() {
    let questionInput = document.getElementById("question-input");
    let questionText = questionInput.value.trim();

    if (questionText === "") {
        alert("Please enter a question!");
        return;
    }

    fetch("http://localhost:8002/questions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_text: questionText })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err });
        }
        return response.json();
    })
    .then(data => {
        console.log("Question submitted:", data);
        loadQuestions();  // ✅ Reload the questions
        questionInput.value = "";  // ✅ Clear the input field
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
        questionList.innerHTML = ""; // Clear the existing list

        data.forEach(question => {
            let questionItem = document.createElement("li");
            questionItem.innerHTML = `<b>Q:</b> ${question.question_text}`;
            questionList.appendChild(questionItem);
        });
    })
    .catch(error => console.error("Error fetching questions:", error));
}

// ✅ Load questions when page loads
document.addEventListener("DOMContentLoaded", loadQuestions);

