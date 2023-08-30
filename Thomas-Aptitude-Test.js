globalThis.shouldExit = false;
function promptForApiKey() {
    if (!globalThis.apiKey){
        globalThis.apiKey = prompt("Please enter your OpenAI API key:");
    }
}
function commonRunOrExit() {
    console.log("Script will answer the next question automatically. Type exit() to exit the script.");
}
function exit() {
    console.log('Stopping the script.' + "\n" + "To start the script again select a question"
        + "\n" + "type 'question1()' for Question 1 - Reasoning"
        + "\n" + "type 'question2()' for Question 2 - Perceptual Speed"
        + "\n" + "type 'question3()' for Question 3 - Number Speed and Accuracy"
        + "\n" + "type 'question4()' for Question 4 - Word Meaning"
        + "\n" + "type 'question5()' for Question 5 - Spacial Visualisation");
    globalThis.shouldExit = true;
}
function runWhenChanges(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'subtree') {
            observer.disconnect();
            run();
            return;
        }
    }
}
function question1() {
    globalThis.shouldExit = false;
    console.log("Question 1 (Reasoning) selected. " + "\n" +
        "When you're ready type run() to run the script, or type exit() to exit.");
    let nextQuestionObserver = new MutationObserver(runWhenChanges);
    if (!globalThis.apiKey) {
        promptForApiKey();
    }
    function run() {
        if (globalThis.shouldExit) {
            return;
        }
        globalThis.questionStatement = document.getElementById("vrStatement").textContent;
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const vrQuestionElement = document.getElementById("vrQuestion");
                    if (vrQuestionElement) {
                        observer.disconnect()
                        question();
                    }
                }
            }
        });
        const config = { attributes: false, childList: true, subtree: true };
        observer.observe(document.body, config);
        document.body.click()
    }
    function runWhenChanges(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const vrStatementElement = document.getElementById("vrStatement");
                if (vrStatementElement) {
                    observer.disconnect()
                    run();
                    return
                }
            }
        }
    }
    function question() {
        const questionSecondStatements = document.getElementById("vrQuestion").textContent;
        const answerButtons = document.querySelectorAll("button.answerButton");
        let answerOptions = [];
        answerButtons.forEach(button => {
            answerOptions.push(button.textContent.trim());
        });
        console.log(globalThis.questionStatement);
        console.log(questionSecondStatements);
        console.log(answerOptions.join(' or '));
        if (answerOptions.length){

        }
        let answer;
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${globalThis.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: `This is a reasoning question. Given the statement: "${globalThis.questionStatement}", please answer the following reasoning question: "${questionSecondStatements}". Your response should be a single word response.`
                }]
            })
        })
            .then(response => response.json())
            .then(({choices}) => {
                if (choices && choices.length > 0 && choices[0].message) {
                    console.log(choices[0].message.content);
                    answer = choices[0].message.content;
                    const buttons = document.querySelectorAll(".answerButton");
                    buttons.forEach(button => {
                        if(answer.includes(button.textContent.trim())) {
                            button.click();
                            console.log(`Selected answer: '${answer}'`);
                            const config = { attributes: false, childList: true, subtree: true };
                            nextQuestionObserver.observe(document.body, config);
                        }
                    });
                } else {
                    console.error('Unexpected response:', choices);
                }
            })
            .catch(error => console.error('Error:', error));
        commonRunOrExit();
    }
    globalThis.run = run;
}
function question2() {
    globalThis.shouldExit = false;
    console.log("Question 2 (Perceptual Speed) selected." + "\n" + "When you're ready type run() to run the script, or type exit() to exit.");
    let nextQuestionObserver = new MutationObserver(globalThis.runWhenChanges);
    function runWhenChanges(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'subtree') {
                run();
            }
        }
    }
    function run() {
        if (globalThis.shouldExit) {
            return;
        }
        nextQuestionObserver.disconnect();
        let row1 = [];
        let row2 = [];
        let counter= 0;
        const row1psLabelElements = document.querySelectorAll("#psLettersFirstRow .psLabel");
        const row2psLabelElements = document.querySelectorAll("#psLettersSecondRow .psLabel");
        row1psLabelElements.forEach(element => {
            row1.push(element.textContent);
        });
        row2psLabelElements.forEach(element => {
            row2.push(element.textContent);
        });
        for(let i = 0; i < row1.length; i++) {
            if(row1[i].toLowerCase() === row2[i].toLowerCase()) {
                counter++;
            }
        }
        console.log("Number of matching letters: " + counter);
        const buttons = document.querySelectorAll(".answerButton");
        buttons.forEach(button => {
            if(button.textContent.trim() === counter.toString()) {
                const config = { attributes: false, childList: true, subtree: true };
                nextQuestionObserver.observe(document.body, config);
                button.click();
                console.log(`Clicked the button with text '${counter}'`);
            }
        });
        commonRunOrExit();
    }
    globalThis.run = run;
}
function question3() {
    globalThis.shouldExit = false;
    console.log("Question 3 (Number Speed and Accuracy) selected."
        + "\n" + "When you're ready type run() to run the script."
        + "\n" + "This script will answer each question automatically, type exit() to exit the script.");
    let nextQuestionObserver = new MutationObserver(runWhenButtonChanges);
    function runWhenButtonChanges(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'subtree') {
                let numbersArray = [];
                const answerButtons = document.querySelectorAll(".answerButton");
                answerButtons.forEach(button => {
                    const number = parseInt(button.textContent.trim(), 10);
                    if (!isNaN(number)) {
                        numbersArray.push(number);
                    }
                });
                if (numbersArray.length === 3){
                    nextQuestionObserver.disconnect();
                    run();
                    return;
                }
            }
        }
    }
    function run() {
        if (globalThis.shouldExit) {
            return;
        }
        nextQuestionObserver.disconnect();
        let numbersArray = [];
        const answerButtons = document.querySelectorAll(".answerButton");
        answerButtons.forEach(button => {
            const number = parseInt(button.textContent.trim(), 10);
            if (!isNaN(number)) {
                numbersArray.push(number);
            }
        });
        const extremes = findExtremes(numbersArray[0], numbersArray[1], numbersArray[2]);
        console.log("Farthest from middle:", extremes[2]);
        const buttons = document.querySelectorAll(".answerButton");
        buttons.forEach(button => {
            if (button.textContent.trim() === extremes[2].toString()) {
                button.click();
                console.log(`Clicked the button: '${extremes[2]}'`);
            }
        });
        answerButtons.forEach(button => {
            nextQuestionObserver.observe(button, { childList: true, characterData: true, subtree: true });
        });
    }
    function findExtremes(num1, num2, num3) {
        const largest = Math.max(num1, Math.max(num2, num3));
        const smallest = Math.min(num1, Math.min(num2, num3));
        const middle = num1 + num2 + num3 - largest - smallest;
        const distanceFromMiddle1 = Math.abs(largest - middle);
        const distanceFromMiddle2 = Math.abs(smallest - middle);
        const farthestFromMiddle = distanceFromMiddle1 > distanceFromMiddle2 ? largest : smallest;
        return [largest, smallest, farthestFromMiddle];
    }
    globalThis.run = run;
    commonRunOrExit();
}
function question4() {
    globalThis.shouldExit = false;
    console.log("Question 4 selected." + "\n" + "When you're ready type run() to run the script."
        + "\n" + "This script will answer each question automatically, type exit() to exit the script.");
    if (!globalThis.apiKey) {
        promptForApiKey();
    }
    let nextQuestionObserver = new MutationObserver(runWhenButtonChanges);
    function runWhenButtonChanges(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const buttonTexts = Array.from(document.querySelectorAll('button.answerButton'))
                    .map(element => element.textContent || element.innerText)
                    .filter(text => text && text.trim() !== '' && text !== '...');
                if (buttonTexts.length === 3) {
                    observer.disconnect();
                    run();
                    return;
                }
            }
        }
    }
    function run() {
        if (globalThis.shouldExit) {
            return;
        }
        nextQuestionObserver.disconnect();
        var texts = Array.from(document.querySelectorAll('button.answerButton'))
            .filter(element => window.getComputedStyle(element).getPropertyValue('opacity') === '1')
            .map(element => element.textContent || element.innerText);

        var textToSend = texts.join(',');
        var options = texts.join(' or ');
        let answer;
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${globalThis.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: `Given a set of three words, two words will have the same meaning or opposite meanings. Identify the word that doesn't fit the pattern. For the words "${textToSend}", which is the odd one out? Options: ${options}. Reply with a single word from the options.`
                }]
            })
        })
            .then(response => response.json())
            .then(({choices}) => {
                if (choices && choices.length > 0 && choices[0].message) {
                    console.log(choices[0].message.content);
                    answer = choices[0].message.content;
                    const buttons = document.querySelectorAll(".answerButton");
                    buttons.forEach(button => {
                        if(button.textContent.trim() === answer) {
                            button.click();
                            console.log(`Selected answer: '${answer}'`);
                            const answerButtons = document.querySelectorAll(".answerButton");
                            if (answerButtons.length > 0) {
                                nextQuestionObserver.observe(answerButtons[0], { childList: true, characterData: true, subtree: true });
                            }
                        }
                    });
                } else {
                    console.error('Unexpected response:', choices);
                }
            })
            .catch(error => console.error('Error:', error));
        commonRunOrExit();
    }
    globalThis.run = run;
}
function question5() {
    globalThis.shouldExit = false;
    console.log("Question 5 (Spatial Visualisation) selected." + "\n" + "When you're ready type run() to run the script."
        + "\n" + "This script will answer each question automatically, type exit() to exit the script.");
    let nextQuestionObserver = new MutationObserver(runWhenStyleChanges);
    function runWhenStyleChanges(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'attributes') {
                const pairBoxTexts = Array.from(document.querySelectorAll('.pairBox'))
                    .map(element => element.textContent || element.innerText)
                    .filter(text => text && text.trim() !== '' && text !== '...');
                if (pairBoxTexts.length === 2) {
                    observer.disconnect();
                    run();
                    return;
                }
            }
        }
    }
    function rotate90(matrix) {
        const [a, c, b, d] = matrix;
        return [-c, a, -d, b];
    }
    function isRotationEquivalent(matrix1, matrix2) {
        for (let i = 0; i < 4; ++i) {
            if (matricesEqual(matrix1.slice(0, 4), matrix2.slice(0, 4))) {
                return true;
            }
            matrix1 = rotate90(matrix1);
        }
        return false;
    }
    function matricesEqual(m1, m2) {
        return m1.every((value, index) => Math.abs(value - m2[index]) < 1e-9);
    }
    function run() {
        if (globalThis.shouldExit) {
            return;
        }
        nextQuestionObserver.disconnect();
        function convertScaleToMatrix(transform) {
            if (!transform) return [1, 0, 0, 1, 0, 0];
            return Array.from(transform.match(/-?\d+\.?\d*/g), Number);
        }
        let counter = 0;
        const ids = ['svLeftPairTop', 'svLeftPairBottom', 'svRightPairTop', 'svRightPairBottom'];
        const matrices = ids.map(id => {
            const transform = window.getComputedStyle(document.querySelector(`div#${id}`)).getPropertyValue('transform');
            return convertScaleToMatrix(transform);
        });
        for (let i = 0; i < matrices.length; i += 2) {
            if (isRotationEquivalent(matrices[i], matrices[i + 1])) {
                counter++;
            }
        }
        console.log('Number of matching pairs:', counter);
        const buttons = document.querySelectorAll(".answerButton");
        buttons.forEach(button => {
            if (button.textContent.trim() === counter.toString()) {
                button.click();
                console.log(`Selected answer: '${counter}'`);
                const pairBoxes = document.querySelectorAll(".pairBox")
                pairBoxes.forEach(pairBox => {
                    nextQuestionObserver.observe(pairBox, { childList: true, characterData: true, subtree: true });
                });
            }
        });
        commonRunOrExit();
    }
    globalThis.run = run;
}
promptForApiKey();
console.log(
    "Type the question number to select or change question"
    + "\n" + "type 'question1()' for Question 1 - Reasoning"
    + "\n" + "type 'question2()' for Question 2 - Perceptual Speed"
    + "\n" + "type 'question3()' for Question 3 - Number Speed and Accuracy"
    + "\n" + "type 'question4()' for Question 4 - Word Meaning"
    + "\n" + "type 'question5()' for Question 5 - Spacial Visualisation"
);
