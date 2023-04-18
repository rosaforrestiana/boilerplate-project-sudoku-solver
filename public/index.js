const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error");

const tests = [ '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
'5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
'..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
'.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
'82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
];

document.addEventListener("DOMContentLoaded", () => {
  const test = Math.floor(Math.random() * tests.length);
  textArea.value = tests[test];
    // "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  fillpuzzle(textArea.value);
});

textArea.addEventListener("input", () => {
  fillpuzzle(textArea.value);
});

function fillpuzzle(data) {
  let len = data.length < 81 ? data.length : 81;
  for (let i = 0; i < len; i++) {
    let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i / 9));
    let col = (i % 9) + 1; 
    if (!data[i] || data[i] === ".") {
      let cell = document.getElementsByClassName(rowLetter + col)[0];
      cell.innerText = " ";
      cell.classList.add('white');
      // document.getElementsByClassName(rowLetter + col)[0].innerText = ".";
      continue;
    }
    let cell = document.getElementsByClassName(rowLetter + col)[0];
    cell.innerText = data[i];
    if (cell.classList.contains("white")) {
      cell.classList.replace('white', 'black');
    }
  }
  return;
}

async function getSolved() {
  const stuff = {"puzzle": textArea.value}
  const data = await fetch("/api/solve", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
  const parsed = await data.json();
  if (parsed.error) {
    errorMsg.innerHTML = `<code class="text-red-600">${JSON.stringify(parsed, null, 2)}</code>`;
    return
  }
  fillpuzzle(parsed.solution);
  textArea.value = parsed.solution;
}

async function getChecked() {
  const stuff = {"puzzle": textArea.value, "coordinate": coordInput.value, "value": valInput.value}
    const data = await fetch("/api/check", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
  const parsed = await data.json();
  errorMsg.innerHTML = `<code>${JSON.stringify(parsed, null, 2)}</code>`;
} 

document.getElementById("solve-button").addEventListener("click", getSolved)
document.getElementById("check-button").addEventListener("click", getChecked)
