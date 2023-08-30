function runOrExit() {
  console.log("Type run() to run the script again");
}
function run() {
  function convertScaleToMatrix(transform) {
    console.log(transform);
    if (!transform) return [1, 0, 0, 1, 0, 0];
    return Array.from(transform.match(/-?\d+\.?\d*/g), Number);
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
  function rotate90(matrix) {
    const [a, c, b, d] = matrix;
    return [-c, a, -d, b];
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
    if(button.textContent.trim() === counter.toString()) {
      button.click();
      console.log(`Selected answer: '${counter}'`);
    }
  });
  runOrExit();
}
run();
