// 程式碼寫在這裡!

let yourDeck = [];
let dealerDeck = [];
let yourPoint = 0;
let dealerPoint = 0;
let inGame = false;
let winner = 0; // 0 未定，1 玩家贏，2 莊家贏，3 平手

$(document).ready(function () {
   initCards();
   initButtons();
});

function Newgame() {
    //初始化呼叫函數
    resetGame();
    //洗牌呼叫
    deck = shuffle(buildDeck());
    //發排順序
    yourDeck.push(deal());
    dealerDeck.push(deal());
    yourDeck.push(deal());
    //開始
    inGame = true;
    //消除勝利效果
    $('.your-cards').removeClass('win');
    $('.dealer-cards').removeClass('win');
    $('.your-cards').removeClass('tie');
    $('.dealer-cards').removeClass('tie');

    renderGameTable();
    console.log('New Game!');
}
//發牌
function deal() {
    return deck.shift();
}
//初始化按鈕
function initButtons() {
    // document.querySelector('#action-new-game').addEventListener('click', evt => {console.log('hi')})
    // JQuery寫法:
    $('#action-new-game').click( evt => Newgame());

    $('#action-hit').click( evt => {
        evt.preventDefault();
        yourDeck.push(deal());
        renderGameTable();
    });
    $('#action-stand').click( evt => {
        evt.preventDefault();
        dealerDeck.push(deal());
        dealerRound();
    });
}
// 初始化卡牌
function initCards() {
    //ES6寫法:
    // let allCards = document.querySelectorAll('.card div');
    // allCards.forEach( ccc => {
    //     ccc.innerHTML = '㊎';
    // });
    //JQuery寫法:
    $('.card div').html('㊎');
}
//建立牌組
function buildDeck() {
    let deck = [];

    for(let suit = 1; suit <= 4; suit++) {
        for(let number = 1; number <= 13; number++) {
            let c = new Card(suit, number);
            deck.push(c);
        }
    }

    return deck;
}
//洗牌 
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

//桌面顯示控制
function renderGameTable() {
    //玩家牌面顯示設定
    yourDeck.forEach((card, i) => {
         let thecard = $(`#yourCard${i + 1}`);
         thecard.html(card.cardNumber());
         thecard.prev().html(card.cardSuit());  //.prev()代表同一層上一個元素
    });

    //莊家牌面顯示設定
    dealerDeck.forEach((card, i) => {
        let thecard = $(`#dealerCard${i + 1}`);
        thecard.html(card.cardNumber());
        thecard.prev().html(card.cardSuit());
    });

    //算點數
    yourPoint = calcPoint(yourDeck);
    dealerPoint = calcPoint(dealerDeck);
    $('.your-cards h1').html(`你 (${yourPoint}點)`);
    $('.dealer-cards h1').html(`莊家 (${dealerPoint}點)`);

    //判斷是否遊戲結束
    if (yourPoint >= 21 || dealerPoint >= 21) {
        inGame = false;
    }

    //論勝負
    CheckWinner();
    ShowWinStamp();

    //按鈕
    // if (inGame) {
    //     $('#action-hit').attr('disabled', false);       //.attr() 設定屬性
    //     $('#action-stand').attr('disabled', false);     //disabled 按鈕無效不能按
    // }   else {                                          
    //     $('#action-hit').attr('disabled', true);       
    //     $('#action-stand').attr('disabled', true);
    // }
    $('#action-hit').attr('disabled', !inGame);            //!代表相反的意思
    $('#action-stand').attr('disabled', !inGame);          // !true 會得到 false
  }

function CheckWinner() {
    switch(true) {
        // 比點數
        case yourPoint == 21:
            winner = 1;
            break;
        case dealerPoint > 21:
            winner = 1;
            break;
        case yourPoint > 21:
            winner = 2;
            break;
        case dealerPoint == yourPoint:
            winner = 3;
            break;
        case dealerPoint > yourPoint:
            winner = 2;
            break;
        default:
            winner = 0;
            break;
    }
}

function ShowWinStamp() {
    switch(winner) {
        case winner = 1:
            $('.your-cards').addClass('win');
            break;
        case winner = 2:
            $('.dealer-cards').addClass('win');
            break;
        case winner = 3:
            $('.your-cards').addClass('tie');
            $('.dealer-cards').addClass('tie');
            break;
        default:
            winner = 0;
            break;
    }
}

//reset
function resetGame() {
    deck = [];
    yourDeck = [];
    dealerDeck = [];
    yourPoint = 0;
    dealerPoint = 0;
    initCards();
    winner = 0;
}

//計算點數
function calcPoint(deck) {
    let point = 0;

    deck.forEach(card => {
        point += card.cardPoint();
    })

    if (point > 21) {
        deck.forEach(card => {
            if (card.cardNumber() === 'A') {
                point -= 10;        //A 從11點變成1點
            }
        })
    }

    return point;
  }
// 莊家回合
function dealerRound() {
    // 1. 發牌
    // 2. 如果點數 >= 玩家，莊家贏，遊戲結束
    // 3. 如果點數 < 玩家，重複1.
    // 4. > 21 爆了，玩家贏

    while(true) {
        dealerPoint = calcPoint(dealerDeck);
        if (dealerPoint < yourPoint) {
            dealerDeck.push(deal());
        } else {
            break;
        }
    };

    inGame = false;
    renderGameTable();
}

//物件導向 烤盤
class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }
    //牌面
    cardNumber() {
        switch(this.number) {
            case 1:
                return 'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default:
                return this.number
        }

    }
    //定義規則 設定牌的值
    cardPoint() {
        switch(this.number) {
            case 1:
                return 11;
            case 11:
            case 12:
            case 13:
                return 10;
            default:
                return this.number;
        }
    }
    //設定花色
    cardSuit() {
        switch(this.suit) {
            case 1:
                return '♠';
            case 2:
                return '♥';
            case 3:
                return '♣';
            case 4:
                return '♦';
        }
    }
}