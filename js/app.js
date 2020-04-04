//// Project 1
///////////////////////

///////////////////////
// Objects
///////////////////////

const hero = {
    name: 'Hero',
    mana: 0,
    critChance: .1,
    wittyRemarks: []
    }

const additionBoss = {
    name: 'Pythagoras',
    mana: 0,
    operator: '+',
    wittyRemarks: [],
    boss: true
}

const subtractionBoss = {
    name: 'Euclid',
    mana: 0,
    operator: '-',
    wittyRemarks: [],
    boss: true
}

const multiplyBoss = {
    name: 'Archimedes',
    mana: 0,
    operator: '*',
    wittyRemarks: [],
    boss: true
}

const divideBoss = {
    name: 'Sir Isaac Newton',
    mana: 0,
    operator: '/',
    wittyRemarks: [],
    boss: true
}
// Possible final boss but will come back to it
const pemdasBoss = {
    name: 'Brahmagupta',
    mana: 0,
    wittyRemarks: [],
    boss: true
}

///////////////////////
// Global Use Variables
///////////////////////

let questionArray = [];
let answerArray = [];
let bossArray = [additionBoss, subtractionBoss, multiplyBoss, divideBoss];
let bossImgArray = ['images/pythagoras.png', 'images/Euclid.png','images/Archimedes.png', 'images/Newton.png'];
let difficultyNumber = 10;
let correctChoice = 0;
let $bossImage = $('#bossimg');

////////////////////////////
// Functions for the Game to run (mostly put inside of objects to call)
// Object containing my event handlers for DOM
////////////////////////////

const EventHandlers = {
    //The event used to check if the answer is correct or not by comparing the global variable to the choice
    onClickCheckAnswer: (event) => {
        // console.log(correctChoice);
        event.preventDefault();
        let $value = parseInt($(event.currentTarget).attr('value'));
        if($value === correctChoice) {
            $(event.currentTarget).css('background-color', 'green');
            App.addMana(hero);
        } else {
            $(event.currentTarget).css('background-color', 'crimson');
            App.addMana(bossArray[0]);
        }
        $('.answers').css('pointer-events', 'none');
        setTimeout(App.nextQuestion, 1500);
    },
    // Resets the game stats and sets the difficulty
    changeDifficulty: (event) => {
        event.preventDefault();
        let choice = $(event.currentTarget).attr('value');
        if (choice === 'EASY') {
            App.resetGame();
            difficultyNumber = 10;
            App.gameStart();
            $('#startgame').hide();
            UI.showGameBoard();
        } else if (choice === 'NORMAL') {
            App.resetGame();
            difficultyNumber = 50;
            App.gameStart();
            $('#startgame').hide();
            UI.showGameBoard();
        } else if (choice === 'HARD') {
            App.resetGame();
            difficultyNumber = 100;
            App.gameStart();
            $('#startgame').hide();
            UI.showGameBoard();
        }
    },
    // Sets the listener on the children of my answercontainer everytime they get intiated (delegation)
    setAnsEvent: () => {
        $('.answercontainer').on('click', '.answers', EventHandlers.onClickCheckAnswer);
    },
    // Activates listeners for difficulty buttons
    startDifficulty: () => {
        $('.modalstartcontent').on('click', '.difficultyBTN', EventHandlers.changeDifficulty);
    },
    // Moves onto the next boss after continue
    confirmDefeat: () => {
        $('#confirm').on('click', App.nextBoss);
    },
    // Restart button
    restartGame: () => {
        $('#restart').on('click', UI.gameStartModal);
    }
}

////////////////////////////
// App logic and game events
////////////////////////////

const App = {

    // Provide a random numbder inclusive of the min and max value provided
    randoMinMax: (min,max) => {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    },
    // Provides a random number up to the max supplied
    randoNum: (num) => {
        return Math.floor(Math.random() * num + 1);
    },
    // // Check if the next question will be a crit question (harder but worth more)
    // critCheck: () => {
    //     if (Math.random() <= hero.critChance) {
    //         return true;
    //     }
    //     return false;
    // },
    // Changes the level of difficulty using 1s 10s or 100s placed numbers
    // difficultyLevel: () => {

    // },
    // Contains an array of crit questions that will return once called instead of pulling from questionArray
    // // Optional function will try to fit in
    // critQuestion: () => {

    // },
    // Generate questions based on the operator of the boss also resets the question array to empty
    generateQuestion: (object) => {
        questionArray = [];
        for(let i = 0; i < 20; i++) {
            let num1 = App.randoNum(difficultyNumber); 
            let num2 = App.randoNum(difficultyNumber);
            if (object.operator === '/') { // If division boss ensure number can be divided evenly
                if ((num1 % num2) !== 0) {
                    num1 = (num1*num2);
                }
            }
            let addQuestion = `${num1} ${object.operator} ${num2} `;
            questionArray.push(addQuestion);
            UI.addQuestionDiv();
            App.generateRandoAns();
        }
    },
    //Shifts to the next question by chaining functions
    nextQuestion: () => {
        App.manaFilled();
        questionArray.shift();
        App.generateRandoAns();
        UI.addQuestionDiv();
    },
    // Generate random wrong answers for choices and place them in array
    generateRandoAns: () => {
        correctChoice = eval(questionArray[0]); // Sets global variable to the correct answer for this case
        answerArray = [];
        answerArray.push(correctChoice);
        for (let i = 0; i < 5; i++) {
            let wrongAns = App.randoMinMax((correctChoice-5), (correctChoice+5));
            if (wrongAns === correctChoice) {
                wrongAns += App.randoNum(10);
            }
            answerArray.push(wrongAns);
        }
        App.checkDuplicates(answerArray);
        App.shuffleArray(answerArray);
    },
    // Checks for duplicates in the answer array and changes them to a random number out of 100
    checkDuplicates: (array) => {
        for (let i = 0; i < array.length-1; i++) {
            for (let j = i+1; j < array.length; j++) {
                if(array[i] === array[j]) {
                    array[j] = App.randoNum(20);
                    App.checkDuplicates(array);
                }
            }
        }
    },
    // To shuffle index within the array (used from the deck shuffle lab!)
    shuffleArray: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },    
    // Check to see who wins
    manaFilled: () => {
        if (App.manaCheck(hero) === true) {
            App.bossShift();
        } else if (App.manaCheck(bossArray[0]) === true) {
            App.resetGame();
            UI.gameOverModal();
            // UI.gameStartModal();
        }
    },
    // Win condition check used on hero and boss
    manaCheck: (object) => {
        if (object.mana >= 20) {
            return true;
        }
            return false;
    },
    // Used to incriment the mana for hero or boss depending
    addMana: (object) => {
        object.mana += 10;
        UI.manaBarIncrease(object);
    },
    // Reset the amound of mana
    manaReset: () => {
        hero.mana = 0;
        bossArray[0].mana = 0;
        UI.manaBarReset();
    },
    // Shift to the next boss and check if they are all defeated
    bossShift: () => {
        if (bossArray.length < 2 || bossArray[0] == undefined){
            UI.gameOverModal();
            $('.modalgameover p:first-child').text('Congratulations!');
        } else {
            UI.bossDefeatedModal();
        }
    },
    // Combined functions to setup next boss, called on event handler
    nextBoss: () => {
        UI.bossRotate();
        App.manaReset();
        App.generateQuestion(bossArray[0]);
        UI.bossDefeatedModal();
    },
    // Reset Game State to beginning
    resetGame: () => {
        questionArray = [];
        answerArray = [];
        bossArray = [additionBoss, subtractionBoss, multiplyBoss, divideBoss];
        bossImgArray = ['images/pythagoras.png', 'images/Euclid.png','images/Archimedes.png', 'images/Newton.png'];
        difficultyNumber = 10;
        correctChoice = 0;
        App.manaReset();
    },
    // Starts the game logic
    gameStart: () => {
        App.generateQuestion(bossArray[0]);
        $('#boss img').attr('src', bossImgArray[0]);
        $('.bossName').text(bossArray[0].name);  
    },
    // Restart the game
    // gameRestart: () => {
    //     App.gameStart();
    //     UI.gameStartModal();
    // }
}

const UI = {
    // Adds the next question to the div
    addQuestionDiv: () => {
        $('#question').empty();
        $('#question').append(`<div id='equation'> ${questionArray[0]} </div>`);
        UI.addAnswerDiv();
    },
    // When called adds the array indices to buttons under the question
    addAnswerDiv: () => {
        $('.answercontainer').empty();
        for (let i = 0; i < answerArray.length; i++) {
            $('.answercontainer').append(`<button class='answers' value='${answerArray[i]}'> ${answerArray[i]} </button>`);
        }
    },
    // Mana bar increase for foe or hero
    manaBarIncrease: (object) => {
        let mana = object.mana * (100 / 20);
        if (object.name === 'Hero') {
            $('#heroMana').animate({ 'width': mana + '%'}, 700);
        } else if (object.boss = true) {
            $('#bossMana').animate({'width': mana + "%"}, 700);
        }       
    },
    // Mana bar reset to 0 visually
    manaBarReset: () => {
        $('#heroMana').css('width', '0%');
        $('#bossMana').css('width', '0%');
    },
    // Boss Rotation for image and name and stats
    bossRotate: () => {
        bossArray.shift();
        bossImgArray.shift();
        $('#boss img').attr('src', bossImgArray[0]);
        $('.bossName').text(bossArray[0].name);
    },
    // Game Start Modal
    gameStartModal: () => {
        $('#gameover').hide();
        $('.playarea').hide();    
        $('#startgame').show();
        $('#question').hide();
        $('.answercontainer').hide();
    },
    // Boss Defeat Modal
    bossDefeatedModal: () => {
        $('.playarea').toggle();
        $('.defeatcontent').html(`<p> Congratulations! You defeated ${bossArray[0].name}. </p>
                                  <button class='difficultyBTN' id='confirm'>Continue...</button>
                                `);
        $('#bossDefeat').toggle();
        EventHandlers.confirmDefeat();
    },
    // Game over Modal
    gameOverModal: () => {
        // $('.answercontainer').empty();
        $('#gameover').toggle();
        $('#question').hide();
        $('.answercontainer').hide();
        App.resetGame();
    },
    //
    showGameBoard: () => {
        $('.playarea').show();
        $('#question').show();
        $('.answercontainer').show();
    }
}

// jQuery Onload
$(() => {
    EventHandlers.setAnsEvent();
    EventHandlers.startDifficulty();
    EventHandlers.restartGame();
    EventHandlers.confirmDefeat();
    UI.gameStartModal();
})