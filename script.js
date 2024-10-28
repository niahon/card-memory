"use strict"

/* Game elements */
const elGameContainer = document.getElementById("game-container");
const elCardGrid = document.getElementById("card-grid");
const elStartButton = document.getElementById("start-button");
const elTimer = document.getElementById("timer");

/* Victory screen elements */
const elVictoryScreen = document.getElementById("victory-screen");
const elTime = document.getElementById("time");
const elBestTime = document.getElementById("best-time");
const elNumberOfMoves = document.getElementById("moves-number");
const elTotalWins = document.getElementById("total-wins");
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

// Handles all game functionality
let game = {
    gameStart: false,
    card1: "",
    card2: "",
    points: 0,
    moves: 0,
    seconds: 0,
    wins: 0,
    bestTime: 0,
    setupGame() {
        console.log(this);
        elGameContainer.classList.remove("invisible");
        elVictoryScreen.classList.add("invisible");
        for (let i = 0; i < elCardGrid.children.length; i++) {
            elCardGrid.children[i].children[0].classList.add("invisible");
       }
        game.points = 0;
        game.moves = 0;
        game.seconds = 0;
        elTimer.textContent = "0s";
    },
    startGame() {
        if (game.gameStart === true) {
            return;
        }
        game.gameStart = true;
        console.log(elCardGrid.children);
        console.log("Game Started!");
        game.timeGame();
        game.eventHandlers();
    },    
    timeGame() {
        let timer = setInterval(() => {
            this.seconds++;
            elTimer.textContent = `${this.seconds}s`;
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
        console.log("test");
        if (this.bestTime === 0 || this.bestTime > this.seconds) {
            this.bestTime = this.seconds;
        }
    },
    gameEnd() {
        this.gameStart = false;
        this.updateBestTime();
        this.wins++;
        elGameContainer.classList.add("invisible");
        elVictoryScreen.classList.remove("invisible");
        elTime.textContent = `Latest Time: ${this.seconds} seconds`;
        elBestTime.textContent = `Best Time: ${this.bestTime} seconds`;
        elNumberOfMoves.textContent = `Number of moves: ${this.moves}`;
        elTotalWins.textContent = `Total wins: ${this.wins}`;
    },
}

elStartButton.addEventListener("click", game.startGame);
elPlayAgain.addEventListener("click", game.setupGame);