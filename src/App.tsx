import { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { evaluate } from 'mathjs'

const buttons = [
  { text: '*', id: 'multiply' },
  { text: '/', id: 'divide' },
  { text: '+', id: 'add' },
  { text: '-', id: 'subtract' },
  { text: '=', id: 'equals' },
  { text: 'AC', id: 'clear' },
  { text: '.', id: 'decimal' },
  { text: '1', id: 'one' },
  { text: '2', id: 'two' },
  { text: '3', id: 'three' },
  { text: '4', id: 'four' },
  { text: '5', id: 'five' },
  { text: '6', id: 'six' },
  { text: '7', id: 'seven' },
  { text: '8', id: 'eight' },
  { text: '9', id: 'nine' },
  { text: '0', id: 'zero' },
];

function App() {
  const [input, setInput] = useState<string>('');
  const [formula, setFormula] = useState<string>('');
  const [hasResult, setHasResult] = useState<boolean>(false);

  const numbers = '0123456789';
  const operators = '*/+-';
  const lastInFormula = formula[formula.length - 1];
  const secondLastInFormula = formula[formula.length - 2];

  const handleButtonPress = (value: string) => {
    // sets numbers max length
    if (input.length > 17 || formula.length > 23) {
      setFormula('');
      setInput('');

      return;
    }

    // clear fields
    if (value === 'AC') {
      setFormula('');
      setInput('');
      setHasResult(false);

      return;
    }

    // handles '=' press
    if (value === '=') {
      // removes operators from the end
      if (operators.includes(lastInFormula)) {
        setInput(evaluate(formula.slice(0, -1)).toString());
        setHasResult(true);

        return;
      }

      setInput(evaluate(formula).toString());
      setHasResult(true);

      return;
    }

    // hadnle working with result on the number press
    if (numbers.includes(value) && hasResult) {
      setInput(value);
      setFormula(value);
      setHasResult(false);

      return;
    }

    // hadnle working with result on the operator press
    if (operators.includes(value) && hasResult) {
      setFormula(input);
      setHasResult(false);
    }

    // forbid multiple points
    if (value === '.' && input.includes('.')) {
      return;
    }

    // forbid '*', '+' and '/' operators when input is empty
    if ('+/*'.includes(value) && !input) {
      return;
    }

    // allows '-' as the second operator
    if ('+/*'.includes(lastInFormula) && '+/*'.includes(value)) {
      return;
    }

    // forbids double '-'
    if (value === '-' && lastInFormula === '-') {
      return;
    }

    // handle multiple operators
    if (operators.includes(value)
      && operators.includes(lastInFormula)
      && operators.includes(secondLastInFormula)) {
      setFormula(state => `${state.slice(0, state.length - 2)}${value}`);

      return;
    }

    // forbid multiple zeroes
    if (value === '0' && input === '') {
      return;
    }

    // ads zero before '.'
    if (!input && value === '.') {
      setInput('0.');

      return;
    }

    // jump to the upper field on the operator press
    if (operators.includes(value)) {
      setInput(value);
      setFormula(state => `${state}${value}`);

      return;
    }

    // set fields
    setInput(state => `${state}${value}`);
    setFormula(state => `${state}${value}`);
  };

  const makeValueToDisplay = () => {
    if (!input) {
      return 0;
    }

    if (input.length > 1 && '+/*'.includes(input[0])) {
      return input.slice(1);
    }

    return input;
  };

  return (
    <div className="App">
      <div className="calculator">
        <div className="calculator__field">
          <div className="calculator__formula">{formula}</div>
          <div
            className="calculator__input"
            id="display"
          >
            {makeValueToDisplay()}
          </div>
        </div>
        <div className="calculator__buttons">
          {buttons.map(button => (
            <button
              key={button.id}
              id={button.id}
              type="button"
              onClick={() => handleButtonPress(button.text)}
              className={classNames(
                'calculator__button', `calculator__button--${button.id}`,
              )}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>

      <div className="info">
        Designed and Coded by
        <br />
        <a href="https://github.com/artem-hirzhev">Artem Hirzhev</a>
      </div>
    </div>
  );
}

export default App;
