const wordList = [
    "abide", "actor", "adopt", "adore", "alert", "anger", "apple", "agree", "beach", "blame", "brave", 
    "bride", "camel", "charm", "child", "clerk", "cloud", "creek", "dance", "drain", "elite", "fancy", 
    "flame", "globe", "grape", "green", "honey", "hover", "index", "judge", "kneel", "lodge", "loyal", 
    "mango", "marry", "merit", "moose", "noble", "ocean", "onion", "paint", "plant", "pride", "punch", 
    "quilt", "rapid", "right", "robot", "scene", "sharp", "shine", "slope", "smile", "space", "spine", 
    "stack", "straw", "taste", "thick", "tower", "track", "train", "trend", "vivid", "whale", "whisk", 
    "world", "wrist", "young", "zebra", "vocal", "token", "shift", "swamp", "unity", "drama", "rumor", 
    "voice", "giant", "glory", "human", "logic", "music", "ninja", "sword", "tiger", "voter", "crane", 
    "cheer", "blend", "crowd", "flock", "storm", "earth", "lemon", "knife", "donut", "event", "feast", 
    "forge", "spoon", "nerve", "model", "money", "organ", "robot", "flair", "track", "valid", "write", 
    "witty", "angry", "lunar", "forum", "alert", "marsh", "chief", "beast", "moody", "grain", "zesty", 
    "frost", "crime", "proud", "zonal", "wedge", "vital", "thumb", "urban", "plush", "onset", "nifty", 
    "pouch", "petty", "otter", "pearl", "quill", "spicy", "tasty", "suite", "trend", "vague", "widow"
    // Add as many 5-letter words as you want, up to 5000 words
    // ...
];

const maxGuesses = 6;
let wordToGuess = '';
let guessCount = 0;

const grid = document.getElementById('grid');
const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-guess');
const message = document.getElementById('message');
const shareButton = document.getElementById('share-result');
let gameResult = '';

function chooseRandomWord() {
    wordToGuess = wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();
}

chooseRandomWord();

function checkGuess() {
    const guess = guessInput.value.toLowerCase();
    if (guess.length !== 5) {
        message.textContent = 'Please enter a 5-letter word!';
        return;
    }
    if (guessCount >= maxGuesses) {
        message.textContent = 'You have reached the maximum number of guesses!';
        return;
    }

    const guessRow = document.createElement('div');
    for (let i = 0; i < guess.length; i++) {
        const letterBox = document.createElement('div');
        letterBox.textContent = guess[i].toUpperCase();
        if (guess[i] === wordToGuess[i]) {
            letterBox.classList.add('green');
        } else if (wordToGuess.includes(guess[i])) {
            letterBox.classList.add('yellow');
        } else {
            letterBox.classList.add('gray');
        }
        guessRow.appendChild(letterBox);
    }
    grid.appendChild(guessRow);
    guessCount++;

    gameResult += `Guess ${guessCount}: ${guess.toUpperCase()} `;
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === wordToGuess[i]) {
            gameResult += "🟩";
        } else if (wordToGuess.includes(guess[i])) {
            gameResult += "🟨";
        } else {
            gameResult += "⬜";
        }
    }
    gameResult += '\n';

    if (guess === wordToGuess) {
        message.textContent = `Congratulations! You guessed the word in ${guessCount} tries!`;
        submitButton.disabled = true;
        shareButton.style.display = 'inline';
    } else if (guessCount === maxGuesses) {
        message.textContent = `Game over! The word was ${wordToGuess}.`;
        shareButton.style.display = 'inline';
    }

    guessInput.value = '';
}

submitButton.addEventListener('click', checkGuess);

shareButton.addEventListener('click', () => {
    const finalMessage = `I played Worldle Clone By SkibKid420!\n${gameResult}`;
    navigator.clipboard.writeText(finalMessage).then(() => {
        message.textContent = 'Result copied to clipboard!';
    }).catch(err => {
        message.textContent = 'Failed to copy result!';
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});
