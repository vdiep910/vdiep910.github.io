const newQuoteBtn = document.querySelector("#js-new-quote");

const endpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";

newQuoteBtn.addEventListener("click", getQuote);

function getQuote() {
    console.log("Button clicked!");

    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch trivia");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayQuote(data);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong while fetching trivia!");
        });
}

function displayQuote(data) {
    const quoteText = document.querySelector("#js-quote-text");
    const answerText = document.querySelector("#js-answer-text");

    quoteText.textContent = data.question;
    answerText.textContent = ""; 
}

getQuote();