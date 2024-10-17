"use strict"

const elCardGrid = document.getElementById("card-grid");
const elStartButton = document.getElementById("start-button");
const elTimer = document.getElementById("timer");

let num = 4;
let max = ((num * num / 2) + 1);
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

const countOccurrences = (arr, val) =>
    arr.reduce((a, v) => (v === val ? a + 1 : a), 0);


window.addEventListener("load", createCards);
function createCards() {
    let counter = 0;
    for (let col = 0; col < num; col++) {
        for (let row = 0; row < num; row++) {
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

let game = {
    timeStart: false,
    card1: "",
    card2: "",
    startGame() {
        console.log("Game Started!");
        this.timeStart = true;
        console.time();
        game.eventHandlers();
    },    
    eventHandlers() {
        let cardList = document.querySelectorAll(".card");
        cardList.forEach((el) => el.addEventListener("click", cardClicked));
        console.log(cardList);
    },
    cardClicked() {

    },
    endGame() {
        console.log("Game ended");
        this.timeStart = false;
        console.timeEnd();
    },
}

elStartButton.addEventListener("click", game.startGame);


let clickedCounter = 0;
let firstCard = "";

function cardClick(e) {
    clickedCounter++
    if (clickedCounter == 2) {
        if (checkPair(firstCard, e.currentTarget)) {

        } else {
            clickedCounter = 0;
        }
        
    }
    firstCard = e.currentTarget;
    e.currentTarget.children[0].classList.remove("invisible");
    console.log(e.currentTarget);
}

function checkPair(firstCard, secondCard) {
    if (firstCard.children[0].src === secondCard.children[0].src) {
        return true;
    }
    else {
        return false;
    }
}