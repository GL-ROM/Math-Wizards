



// Global Use Variables
let questionArray = [];
let answerArray = [];
let difficultyNumber = 10;
let correctChoice = 0;

// Functions for the Game to run (mostly put inside of objects to call)
// Object containing my event handlers for DOM
const EventHandlers = {

}

// App logic and game events
const App = {
    // Provide a random numbder inclusive of the min and max value provided
    randoMinMax: (min,max) => {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    },
    // Provides a random number up to the max supplied
    randoNum: (num) => {
        return Math.floor(Math.random() * num);
    },
    // Check if the next question will be a crit question (harder but worth more)
    critCheck: (hero) => {
        if (Math.random() <= hero.critChance) {
            return true;
        }
        return false;
    },
    // Changes the level of difficulty using 1s 10s or 100s placed numbers
    difficultyLevel: () => {

    },
    // Contains an array of crit questions that will return once called instead of pulling from questionArray
    critQuestion: () => {

    },
    // Generate questions based on the operator of the boss also resets the question array to empty
    generateQuestion: (object) => {
        questionArray = [];
        for(let i = 0; i < 10; i++) {
            let num1 = App.randoNum(difficultyNumber); 
            let num2 = App.randoNum(difficultyNumber);
            if (object.operator === '/') {
                if ((num1 % num2) !== 0) {
                    num1 = (num1*num2);
                }
            }
            let addQuestion = `${num1} ${object.operator} ${num2}`;
            questionArray.push(addQuestion);
        }
    },
    // Generate random wrong answers for choices and place them in array
    generateRandoAns: () => {
        correctChoice = eval(questionArray[0]); // Sets global variable to the correct answer for this case
        answerArray.push(correctChoice);
        for (let i = 0; i < 5; i++) {
            let wrongAns = App.randoMinMax((correctChoice-5), (correctChoice+5));
            if (wrongAns === correctChoice) {
                wrongAns += App.randoNum(10);
            }
            answerArray.push(wrongAns);
        }
        App.checkDuplicates(answerArray);
    },
    // Checks for duplicates in the answer array and changes them to a random number out of 100
    checkDuplicates: (array) => {
        for (let i = 0; i < array.length-1; i++) {
            for (let j = i+1; j < array.length; j++) {
                if(array[i] === array[j]) {
                    array[j] = App.randoNum(100);
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
    // Pass the value of the given element to check if answer matches correct answer
    evaluteQuestion: (value) => {
        if(value === eval(questionArray[0])) {
            questionArray.shift();
            return true;
        }
            return false;
    },
    // Win condition check used on hero and boss
    manaCheck: (object) => {
        if (object.mana >= 100) {
            return true;
        }
            return false;
    },
    // Used to incriment the mana for hero or boss depending
    addMana: (object) => {
        object.mana += 10;
    },
    // Starts the game
    gameStart: () => {

    }
}

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

const pemdasBoss = {
    name: 'Brahmagupta',
    mana: 0,
    wittyRemarks: []
}



App.generateQuestion(divideBoss);

console.log(questionArray);

App.generateRandoAns();

console.log(answerArray);

App.shuffleArray(answerArray);

console.log(answerArray);

console.log(correctChoice);


// jQuery Onload
$(() => {
})