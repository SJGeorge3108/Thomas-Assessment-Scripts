function runOrExit() {
  console.log("Type run() to run the script again, or type exit() to exit.");
}
function run() {
  var apiKey = 'YOUR API KEY GOES HERE';
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
      'Authorization': `Bearer ${apiKey}`
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
              }
            });
        }
      })
      .catch(error => console.error('Error:', error));
  runOrExit();
}
function exit() {
  console.log('Exiting the script.');
}
run();