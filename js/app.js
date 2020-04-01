

// jQuery Onload
$(() => {

    // Global Use Variables
    const questionArray = [];

    // Functions for the Game to run (mostly put inside of objects to call)
    // Object containing my event handlers for DOM
    const EventHandlers = {

    }

    // App logic and game events
    const App = {
        randoMinMax: (min,max) => {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        },

        randoNum: (num) => {
            return Math.floor(Math.random() * num);
        },

        critCheck: (hero) => {
            if (Math.random() <= hero.critChance) {
                return true;
            }
            return false;
        },

        critQuestion: () => {

        },

        generateAddQuestion: () => {
            for(let i = 0; i < 10; i++) {
                let num1 = App.randoNum(100); 
                let num2 = App.randoNum(100);
                let addQuestion = `${num1} + ${num2}`;
                questionArray.push(addQuestion);
            }
        },

        evaluteQuestion: (event) => {
            if(event === eval(questionArray[0])) {
                questionArray.shift();
                return true;
            }
                return false;
        },

        manaCheck: (object) => {
            if (object.mana >= 100) {
                return true;
            }
                return false;
        },

        addMana: (object) => {
            object.mana += 10;
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
        wittyRemarks: []
    }

    const subtractionBoss = {
        name: 'Euclid',
        mana: 0,
        wittyRemarks: []
    }

    const multiplicationBoss = {
        name: 'Archimedes',
        mana: 0,
        wittyRemarks: []
    }

    const divisionBoss = {
        name: 'Ulugh Beg',
        mana: 0,
        wittyRemarks: []
    }

    const pemdasBoss = {
        name: 'Brahmagupta',
        mana: 0,
        wittyRemarks: []
    }

    console.log(questionArray);

    App.generateAddQuestion();

    console.log(questionArray);

    console.log(eval(questionArray[0]));

})