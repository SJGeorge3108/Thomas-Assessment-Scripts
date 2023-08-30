function runOrExit() {
  console.log("Type run() to run the script again");
}
function run() {
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
        button.click();
        console.log(`Clicked the button with text '${counter}'`);
      }
    });
  runOrExit();
}
run();