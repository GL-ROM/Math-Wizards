//// Project 1
///////////////////////

// Objects
const hero = {
    name: 'Test',
    mana: 0,
    critChance: .1,
    wittyRemarks: []
    }

const additionBoss = {
    name: 'Pythagoras',
    mana: 0,
    operator: '+',
    wittyRemarks: []
}

const subtractionBoss = {
    name: 'Euclid',
    mana: 0,
    operator: '-',
    wittyRemarks: []
}

const multiplyBoss = {
    name: 'Archimedes',
    mana: 0,
    operator: '*',
    wittyRemarks: []
}

const divideBoss = {
    name: 'Ulugh Beg',
    mana: 0,
    operator: '/',
    wittyRemarks: []
}
// Possible final boss but will come back to it
const pemdasBoss = {
    name: 'Brahmagupta',
    mana: 0,
    wittyRemarks: []
}

// Global Use Variables
let questionArray = [];
let answerArray = [];
let bossArray = [additionBoss, subtractionBoss, multiplyBoss, divideBoss];
let difficultyNumber = 10;
let correctChoice = 0;

// Functions for the Game to run (mostly put inside of objects to call)
// Object containing my event handlers for DOM
const EventHandlers = {
    //The event used to check if the answer is correct or not by comparing the global variable to the choice
    onClickCheckAnswer: (event) => {
        // console.log(correctChoice);
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
    // Sets the listener on the children of my answercontainer everytime they get intiated (delegation)
    setAnsEvent: () => {
        $('.answercontainer').on('click', '.answers', EventHandlers.onClickCheckAnswer);
    }
}

// App logic and game events
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
            let addQuestion = `${num1} ${object.operator} ${num2}`;
            questionArray.push(addQuestion);
            UI.addQuestionDiv();
            App.generateRandoAns();
        }
    },
    //
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
            console.log('You Defeated ' + bossArray[0].name); // Placeholder for Modal
            App.bossShift();
        } else if (App.manaCheck(bossArray[0]) === true) {
            console.log('You were defeated!'); // Placeholder for modal
            App.resetGame();
            App.gameStart();
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
    },
    // Reset the amound of mana
    manaReset: () => {
        hero.mana = 0;
        bossArray[0].mana = 0;
    },
    // Shift to the next boss and check if they are all defeated
    bossShift: () => {
        if (bossArray.length < 2 || bossArray[0] == undefined){
            console.log('You Beat the Math Wizards!');
        } else {
            bossArray.shift();
            App.manaReset();
            App.generateQuestion(bossArray[0]);
        }
    },
    // Reset Game State to beginning
    resetGame: () => {
        questionArray = [];
        answerArray = [];
        bossArray = [additionBoss, subtractionBoss, multiplyBoss, divideBoss];
        difficultyNumber = 10;
        correctChoice = 0;
        App.manaReset();
    },
    // Starts the game
    gameStart: () => {
        App.generateQuestion(bossArray[0]);
        EventHandlers.setAnsEvent();  
    }
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
    }
}

// jQuery Onload
$(() => {
    App.gameStart();
})