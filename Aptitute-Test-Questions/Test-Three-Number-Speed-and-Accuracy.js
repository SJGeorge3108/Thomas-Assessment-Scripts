function runOrExit() {
    console.log("Type run() to run the script again");
}
function run() {
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
    if(buttons.length){
        buttons.forEach(button => {
            if(button.textContent.trim() === extremes[2].toString()) {
                button.click();
                console.log(`Clicked the button: '${extremes[2]}'`);
            }else{
                console.log('no buttons clicked');
                console.log("Farthest from middle:", extremes[2]);
            }
        });
    }else{
        console.log('no buttons clicked');
        console.log("Farthest from middle:", extremes[2]);
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
    runOrExit();
}
run();