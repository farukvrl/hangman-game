document.addEventListener("DOMContentLoaded", function () {
   
    // Hangman words array
    const words = ["JAVASCRIPT", "HTML", "CSS", "NODEJS", "PYTHON"];

    // Select a random word from the array
    let selectedWord = words[Math.floor(Math.random() * words.length)];

    // Get elements
    const hangmanWordElement = document.getElementById("hangmanWord");
    const hangmanLifesElement = document.getElementById("hangman-lifes");
    const alphabetButtons = document.querySelectorAll(".alph-btns button");

    // Initialize game state
    let remainingLifes = 5;
    let guessedLetters = [];

    // Display initial word
    updateHangmanWord();

    // Function to update the displayed hangman word
    function updateHangmanWord() {
        const displayWord = selectedWord
            .split("")
            .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
            .join(" ");

        hangmanWordElement.innerHTML = displayWord;

        // Check if the player has won
        if (!displayWord.includes("_")) {
            // Display the correct word for 3 seconds after winning
            hangmanWordElement.innerHTML = selectedWord;

            setTimeout(function () {
                resetGame();
            }, 3000);
        }
    }

    // Function to check if the guessed letter is correct
    function checkLetter(letter) {
        if (selectedWord.includes(letter)) {
            guessedLetters.push(letter);
            updateHangmanWord();
        } else {
            remainingLifes--;
            updateLifes();

            // Check if the player has lost
            if (remainingLifes === 0) {
                displayMessage("Leider verloren! Das Wort war: " + selectedWord, "danger");
                resetGame();
            }
        }
    }

        // Get the hint button
        const hintButton = document.querySelector('[data-bs-content="Bottom popover"]');

        // Add event listener to the hint button
        hintButton.addEventListener("click", function () {
            // Check if there is at least one hidden letter
            const hiddenLetters = selectedWord.split("").filter(letter => !guessedLetters.includes(letter));
    
            if (hiddenLetters.length > 0) {
                // Reveal the first hidden letter and update the display
                const letterToReveal = hiddenLetters[0];
                guessedLetters.push(letterToReveal);
                updateHangmanWord();
            } else {
                // If no hidden letters are left, the player loses a life
                remainingLifes--;
                updateLifes();
    
                // Check if the player has lost
                if (remainingLifes === 0) {
                    displayMessage("Game over! The word was: " + selectedWord, "danger");
                    resetGame();
                }
            }
        });

    // Function to update remaining lifes
    function updateLifes() {
        hangmanLifesElement.textContent = "♥ ".repeat(remainingLifes);
    }

    // Function to reset the game
    function resetGame() {
        // Reset guessed letters and remaining lifes
        guessedLetters = [];
        remainingLifes = 5;

        // Re-enable alphabet buttons
        alphabetButtons.forEach(button => {
            button.disabled = false;
        });

        // Select a new random word
        selectedWord = words[Math.floor(Math.random() * words.length)];

        // Update hangman word and remaining lifes
        updateHangmanWord();
        updateLifes();
    }

    // Function to display game messages
    function displayMessage(message, type = "info") {
        const gameMessageElement = document.getElementById("game-message");
        gameMessageElement.innerHTML = message;

        // Clear previous classes
        gameMessageElement.classList.remove("alert-success", "alert-danger");

        // Add appropriate class based on the type of message
        if (type === "success") {
            gameMessageElement.classList.add("alert-success");
        } else if (type === "danger") {
            gameMessageElement.classList.add("alert-danger");
        }
    }

    // Add event listeners to alphabet buttons
    alphabetButtons.forEach(button => {
        button.addEventListener("click", function () {
            const letter = button.textContent;
            button.disabled = true;
            checkLetter(letter);
        });
    });
});
