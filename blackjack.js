let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

let canHit = true; //ทำให้ player จั่วได้ตอนที่ผลรวม <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

//ฟังชั่นสุ่มไพ่จาก array deck
function shuffleDeck() { 
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    while (dealerSum < 17) { // ถ้าผลรวมของ dealer น้อยกว่า 17 ให้จั่วไพ่เพิ่มไปเรื่อย ๆ
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);// แสดงไพ่บนหน้าเว็บ
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) { // แจกไพ่ให้ผู้เล่น 2 ใบ
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);// แสดงไพ่บนหน้าเว็บ
    }

    console.log(yourSum);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("how-to-play").addEventListener("click", howtoplay);
    document.getElementById("restart").addEventListener("click", function() {
        location.reload(); // รีเฟรชหน้าเพจ
    });

}

function hit() { //เช็คว่าจั่วได้มั้ยถ้าจั่วได้ก็จั่วไพ่ขึ้นมา 1 ใบ
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You win!";
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        
    }

    document.getElementById("hit").style.display = "none";
    document.getElementById("stay").style.display = "none";
    document.getElementById("restart").style.display = "inline";
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function howtoplay() {
    // สร้าง overlay
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    
    // สร้าง popup element
    const popup = document.createElement("div");
    popup.id = "how-to-play-popup";

    // เพิ่มข้อความวิธีเล่น
    const instructions = document.createElement("p");
    instructions.innerText = "วิธีเล่น Black Jack:\n1. จั่วไพ่โดยคลิกปุ่ม 'จั่ว'\n2. คลิกปุ่ม 'พอ' เมื่อคุณต้องการเลิกจั่ว\n3. จำนวนแต้มตามเลขไพ่ และ J Q K เท่ากับ 10\n4. ไพ่ A มีค่าเท่ากับ 1 หรือ 11\n5. โดยทีใครได้แต้มไกล้เคียง 21 ที่สุดเป็นผู้ชนะ";
    popup.appendChild(instructions);

    // เพิ่มปุ่มปิด popup
    const closeButton = document.createElement("button");
    closeButton.innerText = "ปิด";
    closeButton.addEventListener("click", function() {
        overlay.remove();
        popup.remove();
    });
    popup.appendChild(closeButton);

    // แสดง popup ในหน้าเว็บ
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}


