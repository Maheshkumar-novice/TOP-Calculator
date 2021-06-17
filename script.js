// Main-Operations
const add = (a, b) => parseInt(a) + parseInt(b);
const subtract = (a, b) => a - b;
const multiply = (a, b) => (a * b).toFixed(4);
const divide = (a, b) => Number((a / b).toFixed(4));
const remainder = (a, b) => a % b;
const negate = (element) => {
  let text = element.textContent;
  let opRegex = /[+\-\*\/%]/gi;
  if (
    !text.match(opRegex) ||
    (text.match(opRegex).length === 1 && text[0].match(/\-/gi))
  ) {
    element.textContent = -element.textContent;
  } else if (text.match(opRegex).length >= 1) {
    let op = text.match(opRegex)[text.match(opRegex).length - 1];
    element.textContent =
      text.slice(0, opIndex) + text[opIndex] + -1 * text.slice(opIndex + 1);
  }
};

// Sub-operations
const clear = (element) => {
  element.innerHTML = "";
};
const backspace = (element) => {
  element.textContent = element.textContent.slice(0, -1);
};
const addDot = (element) => {
  let text = element.textContent;
  let opRegex = /[+\-\*\/%]/gi;
  if (text.match(opRegex)) {
    textArray = text.split(`${text[opIndex]}`);
    textArray[1].includes(".") ? "" : (element.textContent += ".");
  } else {
    text.includes(".") ? "" : (element.textContent += ".");
  }
};

// Util-Operations
const toExp = (value) => Number(value).toExponential();

// Operator Map
const operatorMap = {
  "+": add,
  "-": subtract,
  "*": multiply,
  "/": divide,
  "%": remainder,
  "~": negate,
  AC: clear,
  "<": backspace,
  ".": addDot,
};

// Elements Selection for Event Listeners
const numButtons = [...document.querySelectorAll(".btn--num")];
const operators = [...document.querySelectorAll(".btn--op, .btn--sp-op")];

// Event Listeners
numButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    validateKey(e.target.textContent);
  })
);
operators.forEach((button) =>
  button.addEventListener("click", (e) => {
    console.log(e);
    if (e.target.textContent.trim() === "+/-") {
      validateKey("~");
      return;
    }
    validateKey(e.target.textContent.trim());
  })
);

window.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() === "backspace") {
    validateKey("<");
    return;
  }
  validateKey(e.key);
});

// Functions
function updateOperand(value) {
  current.textContent += value;
  let textop = current.textContent;
  console.log({ textop });
}
function updateOperator(value, trim) {
  let text = current.textContent;
  if (text.length === 0) {
    if (value == "-") {
      current.textContent += value;
    } else {
      current.textContent += "";
    }
  } else if (text[text.length - 1].match(/[+\-\*\/%]/gi)) {
    if (
      value === "-" &&
      ![text[text.length - 1], text[text.length - 2]]
        .join("")
        .match(/[+\-\*\/%][+\-\*\/%]/gi) &&
      text.length >= 2
    ) {
      current.textContent += value;
      return;
    } else if (
      text.length > 2 &&
      text[text.length - 1].match(/[+\-\*\/%]/gi) &&
      !text[text.length - 2].match(/[+\-\*\/%]/gi)
    ) {
      current.textContent = text.slice(0, -1);
      current.textContent += value;
      opIndex = current.textContent.length - 1;
    }
  } else {
    current.textContent += value;
    opIndex = current.textContent.length - 1;
  }
  console.log(current.textContent);
}

function validateKey(value) {
  current.classList.remove("result");
  if (value.match(/^[0-9]$/gi)) {
    updateOperand(value);
  } else if (value.match(/[\+\-\/\*%]/gi)) {
    let trim = false;
    if (
      current.textContent.length &&
      current.textContent[current.textContent.length - 1].match(/[+\-\*\/%]/gi)
    ) {
      trim = true;
    }
    updateOperator(value, trim);
  } else if (value.match(/(<)/gi)) {
    operatorMap[value](current);
  } else if (value.match(/(=)|(enter)/gi)) {
    evaluateExpression();
  } else if (value.match(/(\.)/gi)) {
    operatorMap[value](current);
  } else if (value.match(/(~)/gi)) {
    operatorMap[value](current);
  } else if (value.match(/(AC)/gi)) {
    operatorMap[value](current);
    operatorMap[value](operation);
  }
}

function evaluateExpression() {
  let text = current.textContent;
  console.log({ text, opIndex });
  if (
    !text ||
    !opIndex ||
    opIndex === text.length - 1 ||
    !text[opIndex].match(/[+\-\*\/%]/gi)
  ) {
    console.log("Nah!");
    return;
  }
  let a = text.slice(0, opIndex);
  let operatorEval = text[opIndex];
  let b = text.slice(opIndex + 1);
  operation.textContent = current.textContent;
  current.textContent = operatorMap[operatorEval](a, b);
  current.classList.add("result");
  opIndex = "";
}

// Value Holders for display
let operation = document.querySelector(".display__operation p");
let current = document.querySelector(".display__input p");
let opIndex = "";
