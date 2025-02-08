document.addEventListener("DOMContentLoaded", function () {
    loadQuestions();
});

// Function to submit a question
function submitQuestion() {
    let questionInput = document.getElementById("question-input");
    let questionText = questionInput.value.trim();

    if (questionText === "") {
        alert("Please enter a question before submitting!");
        return;
    }

    let questionList = document.getElementById("question-list");

    // Create a new list item
    let listItem = document.createElement("li");
    listItem.innerHTML = `<strong>Q:</strong> ${questionText}`;

    // Append to the list
    questionList.appendChild(listItem);

    // Save question to local storage
    saveQuestion(questionText);

    // Clear the input field
    questionInput.value = "";
}

// Function to save questions to local storage
function saveQuestion(question) {
    let questions = JSON.parse(localStorage.getItem("questions")) || [];
    questions.push(question);
    localStorage.setItem("questions", JSON.stringify(questions));
}

// Function to load questions from local storage
function loadQuestions() {
    let questions = JSON.parse(localStorage.getItem("questions")) || [];
    let questionList = document.getElementById("question-list");

    questions.forEach(question => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<strong>Q:</strong> ${question}`;
        questionList.appendChild(listItem);
    });
}
