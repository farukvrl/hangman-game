document.addEventListener("DOMContentLoaded", function () {
    const wordsKey = "hangmanWords";
    const defaultWords = ["JAVASCRIPT", "HTML", "CSS", "NODEJS", "PYTHON"];
    const hangmanWordElement = document.getElementById("hangmanWord");
    const hangmanLifesElement = document.getElementById("hangman-lifes");
    const alphabetButtonsContainer = document.querySelector(".alph-btns");
    const gameMessageElement = document.getElementById("game-message");
  
    let remainingLifes = 5;
    let guessedLetters = [];
    let selectedWord = "";
  
    function loadWords() {
      const storedWords = JSON.parse(localStorage.getItem(wordsKey));
      return storedWords || defaultWords;
    }
  
    function saveWords(words) {
      localStorage.setItem(wordsKey, JSON.stringify(words));
    }
  
    function initializeAlphabetButtons() {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ";
      alphabetButtonsContainer.innerHTML = "";
      alphabet.split("").forEach((letter) => {
        const button = document.createElement("button");
        button.className = "btn btn-outline-dark";
        button.textContent = letter;
        button.addEventListener("click", () => handleLetterGuess(letter, button));
        alphabetButtonsContainer.appendChild(button);
      });
    }
  
    function updateHangmanWord() {
      if (!selectedWord) {
        selectedWord = loadWords()[Math.floor(Math.random() * loadWords().length)];
      }
      const displayWord = selectedWord
        .split("")
        .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
        .join(" ");
      hangmanWordElement.textContent = displayWord;
  
      if (!displayWord.includes("_")) {
        displayMessage("You won!", "success");
        setTimeout(resetGame, 3000);
      }
    }
  
    function handleLetterGuess(letter, button) {
      button.disabled = true;
      if (selectedWord.includes(letter)) {
        guessedLetters.push(letter);
        updateHangmanWord();
      } else {
        remainingLifes--;
        updateLifes();
        if (remainingLifes === 0) {
          displayMessage(`You lost! The word was: ${selectedWord}`, "danger");
          setTimeout(resetGame, 3000);
        }
      }
    }
  
    function updateLifes() {
      hangmanLifesElement.textContent = "♥ ".repeat(remainingLifes);
    }
  
    function resetGame() {
      guessedLetters = [];
      remainingLifes = 5;
      selectedWord = "";
      initializeAlphabetButtons();
      updateHangmanWord();
      updateLifes();
    }
  
    function displayMessage(message, type) {
      if (!message) return;
      gameMessageElement.textContent = message;
      gameMessageElement.className = `alert alert-${type}`;
      setTimeout(() => {
        gameMessageElement.textContent = "";
        gameMessageElement.className = "alert message-hidden";
      }, 3000);
    }
  
    document.getElementById("addWordForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const newWord = document.getElementById("newWord").value.toUpperCase();
      if (newWord && /^[A-ZÄÖÜ]+$/.test(newWord)) {
        const words = loadWords();
        words.push(newWord);
        saveWords(words);
        displayMessage("Word added successfully!", "success");
        document.getElementById("addWordForm").reset();
      } else {
        displayMessage("Invalid word!", "danger");
      }
    });
  
    initializeAlphabetButtons();
    resetGame();
  });
  