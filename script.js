"use strict"

/* Game elements */
const elGameContainer = document.getElementById("game-container");
const elCardGrid = document.getElementById("card-grid");
const elStartButton = document.getElementById("start-button");
const elTimer = document.getElementById("timer");
const elDifficultySelector = document.getElementById("difficulty-selector");

/* Victory screen elements */
const elVictoryScreen = document.getElementById("victory-screen");
const elRoundResult = document.getElementById("round-result");
const elTime = document.getElementById("time");
const elBestTime = document.getElementById("best-time");
const elNumberOfMoves = document.getElementById("moves-number");
const elTotalWins = document.getElementById("total-wins");
const elTotalLosses = document.getElementById("total-losses");
const elPlayAgain = document.getElementById("play-again");

/* Variables for creating the card grid*/
let numberOfCards = 4;
let max = ((numberOfCards * numberOfCards / 2) + 1);
let numArr = [];
let numSet = new Set();
let imgArr = [
    "./img/airplane-fill.svg",
    "./img/alarm-fill.svg",
    "./img/backpack4-fill.svg",
    "./img/bag-heart-fill.svg",
    "./img/balloon-heart-fill.svg",
    "./img/basket2-fill.svg",
    "./img/bicycle.svg",
    "./img/bookmark-fill.svg",
];

// Creating the card grid
const countOccurrences = (arr, val) =>
    arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

window.addEventListener("load", createCards);
function createCards() {
    let counter = 0;
    for (let col = 0; col < numberOfCards; col++) {
        for (let row = 0; row < numberOfCards; row++) {
            incrementArray(numArr);
            let card = document.createElement("div");
            let cardImg = document.createElement("img");
            card.classList.add("card");
            cardImg.setAttribute("src", imgArr[numArr[counter]]);
            cardImg.classList.add("invisible");
            card.appendChild(cardImg);
            elCardGrid.appendChild(card);
            counter++;
        }
    }
}

function incrementArray(arr) {
    while(true) {
        let randomNum = Math.floor((Math.random() * (max - 1)));
        if (numSet.size === 8) {
            if (!numSet.has(randomNum)) {
                continue;
            }
        }
        if (countOccurrences(arr, randomNum) < 2) {
            numArr.push(randomNum);
            numSet.add(randomNum);
            break
        } else {
            continue;
        }
    }
}

// Game functionality
let game = {
    gameStart: false,
    card1: "",
    card2: "",
    difficulty: '', 
    points: 0,
    moves: 0,
    wins: 0,
    losses: 0,
    maxTime: 2,
    totalTime: 0,
    bestTime: 0,
    roundState: '',
    resetGame() {
        game.roundState = '';
        elGameContainer.classList.remove("invisible");
        elVictoryScreen.classList.add("invisible");
        for (let i = 0; i < elCardGrid.children.length; i++) {
            elCardGrid.children[i].children[0].classList.add("invisible");
       }
        game.points = 0;
        game.moves = 0;
        game.totalTime = 0;
        game.maxTime = 60;
        elTimer.textContent = "Time: ";
         game.difficulty = '';
        elDifficultySelector.value = 'Select Difficulty'; 
        console.log(game.roundState);
         console.log(game.difficulty); 
    },
     changeDifficulty(e) {
        if (e.target.value === 'Select Difficulty') {
            return;
        }
        game.difficulty = e.target.value;
        game.setTimeLimit();
    }, 
     setTimeLimit() {
        let time;
        if (game.difficulty === 'Easy') {
            time = 60;
        } else if (game.difficulty === 'Normal') {
            time = 45;
        } else {
            time = 2;
        }
        game.maxTime = time;
        elTimer.textContent = `Time: ${time}s`;
    }, 
    startGame() {
        console.log(game.difficulty);
        if (game.gameStart === true || game.difficulty === '') {
            console.log('got it');
            return;
        }
        console.log(game.difficulty);
        game.gameStart = true;
        console.log(elCardGrid.children);
        console.log("Game Started!");
        game.timeGame();
        game.eventHandlers();
    },    
    timeGame() {
        let timer = setInterval(() => {
            this.totalTime++;
            this.maxTime--;
            elTimer.textContent = `Time: ${this.maxTime}s`;
            if (this.maxTime === 0) {
                console.log("YOU LOSE!");
                this.roundState = "loss";
                this.gameEnd(); 
            }
            if (this.gameStart === false) {
                clearInterval(timer);
            }
        }, 1000)
        elTimer
    },
    eventHandlers() {
        let cardList = document.querySelectorAll(".card");
        cardList.forEach((el) => el.addEventListener("click", this.cardClicked));
    },
    cardClicked() {
        let img = this.children[0];
        if (game.card1 !== "" && game.card2 !== "") {
            return;
        }
        if (game.card1 === "") {
            game.card1 = this;
            img.classList.remove("invisible");
        } else {
            if (this !== game.card1) {
                game.card2 = this;
                img.classList.remove("invisible");
                game.checkPair(game.card1, game.card2);
            }
        }
    },
    checkPair(card1, card2) {
        this.moves++;
        if (card1.children[0].src === card2.children[0].src) {
            card1.removeEventListener("click", this.cardClicked);
            card2.removeEventListener("click", this.cardClicked);
            this.pointHandler();
        } else {
            setTimeout(() => {
                card1.children[0].classList.add("invisible");
                card2.children[0].classList.add("invisible"); 
            }, 300);
        }
        setTimeout(() => {
            this.card1 = "";
            this.card2 = "";
        }, 300);
        
    },
    pointHandler() {
        this.points++;
        if (this.points === ((numberOfCards ** 2) / 2)) {
            this.gameEnd();
        }
    },
    updateBestTime() {
        if (this.bestTime === 0 || this.bestTime > this.totalTime) {
            this.bestTime = this.totalTime;
        }
    },
    gameEnd() {
        this.gameStart = false;
        if (this.roundState === 'loss') {
            this.losses++;
            elTime.classList.add("invisible");
            elRoundResult.textContent = "You lose";
        } else {
            this.wins++;
            this.updateBestTime();
            elTime.textContent = `Latest Time: ${this.totalTime} seconds`;
            elNumberOfMoves.textContent = `Number of moves: ${this.moves}`;
            elTime.classList.remove("invisible");
            elRoundResult.textContent = "You win";
        }
        elGameContainer.classList.add("invisible");
        elVictoryScreen.classList.remove("invisible");
        elBestTime.textContent = `Best Time: ${this.bestTime} seconds`;
        elTotalWins.textContent = `Total wins: ${this.wins}`;
        elTotalLosses.textContent = `Total losses: ${this.losses}`;
        if (this.wins === 0) {
            elBestTime.classList.add("invisible");
        } else {
            elBestTime.classList.remove("invisible");
        }
    },
}

elStartButton.addEventListener("click", game.startGame);
elPlayAgain.addEventListener("click", game.resetGame);
elDifficultySelector.addEventListener("change", game.changeDifficulty);