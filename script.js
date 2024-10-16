"use strict"

const elCardGrid = document.getElementById("card-grid");

let num = 4;
let max = ((num * num / 2) + 1);
let numArr = [];
let numSet = new Set();

const countOccurrences = (arr, val) =>
    arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  
  countOccurrences([1, 1, 2, 1, 2, 3], 1); // 3

let i = 0;
for (let col = 0; col < num; col++) {
    for (let row = 0; row < num; row++) {
        incrementArray(numArr);
        let card = document.createElement("div");
        let cardText = document.createTextNode(numArr[i]);
        card.setAttribute("class", "card");
        elCardGrid.appendChild(card);
        card.appendChild(cardText);
        i++;
    }
}

console.log(numArr);

function incrementArray(arr) {
    while(true) {
        let randomNum = Math.floor((Math.random() * (max - 1) + 1));
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