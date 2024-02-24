document.addEventListener("DOMContentLoaded", function () {
    // Hangman words array
    const words = ["JAVASCRIPT", "HTML", "CSS", "NODEJS", "PYTHON"];

    // Get elements
    const hangmanWordElement = document.getElementById("hangmanWord");
    const hangmanLifesElement = document.getElementById("hangman-lifes");
    const alphabetButtons = document.querySelectorAll(".alph-btns button");
    const gameMessageElement = document.getElementById("game-message");

    // Initialize game state
    let remainingLifes = 5;
    let guessedLetters = [];
    let selectedWord = ""; // Initialize with an empty string

    // Display initial word
    updateHangmanWord();

    // Function to update the displayed hangman word
    function updateHangmanWord() {
        // Select a random word if selectedWord is empty
        if (!selectedWord) {
            selectedWord = words[Math.floor(Math.random() * words.length)];
        }

        // Generate the display word by replacing unguessed letters with underscores
        const displayWord = selectedWord
            .split("")
            .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
            .join(" ");

        // Update hangman word element with the display word
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
            // If the letter is in the word, add it to the guessed letters
            guessedLetters.push(letter);
            updateHangmanWord();
        } else {
            // If the letter is not in the word, decrement remaining lifes
            remainingLifes--;
            updateLifes();

            // Check if the player has lost
            if (remainingLifes === 0) {
                displayMessage("Unfortunately lost! The word was: " + selectedWord, "danger");
                setTimeout(function () {
                    hideMessage();
                }, 2000);
                resetGame();
            }
        }
    }

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

        // Reset selectedWord to an empty string to force selection of a new word
        selectedWord = "";

        // Update hangman word and remaining lifes
        updateHangmanWord();
        updateLifes();
    }

    // Function to display game messages
    function displayMessage(message, type = "info") {
        gameMessageElement.innerHTML = message;

        // Clear previous classes
        gameMessageElement.classList.remove("alert-success", "alert-danger");

        // Add appropriate class based on the type of message
        if (type === "success") {
            gameMessageElement.classList.add("alert-success");
        } else if (type === "danger") {
            gameMessageElement.classList.add("alert-danger");
        }

        // Add class to remove background color after 2 seconds
        setTimeout(function () {
            gameMessageElement.classList.add("message-hidden");
        }, 2000);
    }

    // Function to hide game messages
    function hideMessage() {
        gameMessageElement.innerHTML = "";
        gameMessageElement.classList.remove("alert-success", "alert-danger");
        gameMessageElement.classList.remove("message-hidden");
    }

    // Add event listeners to alphabet buttons
    alphabetButtons.forEach(button => {
        button.addEventListener("click", function () {
            const letter = button.textContent;
            button.disabled = true;
            checkLetter(letter);
        });
    });

    // 1. Keyboard support for letter selection
    document.addEventListener("keydown", function(event) {
        const keyPressed = event.key.toUpperCase(); // Convert pressed key to uppercase
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Define the alphabet

        // Check if the pressed key is a letter and is not already guessed
        if (alphabet.includes(keyPressed) && !guessedLetters.includes(keyPressed)) {
            const correspondingButton = document.querySelector(`.alph-btns button[data-letter="${keyPressed}"]`);
            if (correspondingButton) {
                correspondingButton.click(); // Simulate click on the corresponding button
            }
        }
    });

    // 2. Display of the guessed letters
    function updateGuessedLetters() {
        const guessedLettersElement = document.getElementById("guessed-letters");
        guessedLettersElement.textContent = guessedLetters.join(", ");
    }
    updateGuessedLetters();

    // 3. Countdown display for the restart interval
    function updateRestartCountdown(seconds) {
        const restartCountdownElement = document.getElementById("restart-countdown");
        restartCountdownElement.textContent = `Restarting the game in ${seconds} seconds.`;
    }
    setTimeout(function() {
        updateRestartCountdown(3);
    }, 3000);
});
