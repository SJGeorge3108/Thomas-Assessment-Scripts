function runOrExit() {
    console.log("Type run() to run the script again, or type exit() to exit.");
}
function run() {
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
                content: `This is a reasoning question. Given the statement: "${globalThis.questionStatement}", please answer the following reasoning question: "${questionSecondStatements}". Your response should be one of the following options: ${answerOptions.join(' or ')}. Reply with a single word from the options ${answerOptions.join(' or ')}.`
            }]
        })
    })
        .then(response => response.json())
        .then(({choices}) => {
            if (choices && choices.length > 0 && choices[0].message) {
                answer = choices[0].message.content;
                const buttons = document.querySelectorAll(".answerButton");
                buttons.forEach(button => {
                    if(button.textContent.trim() === answer) {
                        button.click();
                        console.log(`Selected answer: '${answer}'`);
                    }
                });
            } else {
                console.error('Unexpected response:', choices);
            }
        })
        .catch(error => console.error('Error:', error));
    runOrExit();
}
function exit() {
    console.log('Exiting the script.');
}
run();