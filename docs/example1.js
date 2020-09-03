addExample('example 1', () => {
  var grammar = {
    origin: ['#name.capitalize# loves #food.pluralize#'],
    name: ['bob', 'mary'],
    food: ['banana', 'apple']
  };

  var gen = new Generator(grammar);
  var output = gen.runAdvanced('#origin#');

  console.log(output);

  const rootEl = document.createElement('div');
  const textEl = document.createElement('pre');
  const codeEl = document.createElement('pre');
  const outputEl = document.createElement('div');

  textEl.classList.add('output-text');
  codeEl.classList.add('output-code');
  outputEl.classList.add('output-json');

  codeEl.innerText =`${'```js'}
    var grammar = {
      origin: ['#name.capitalize# loves #food.pluralize#'],
      name: ['bob', 'mary'],
      food: ['banana', 'apple']
    };

    var gen = new Generator(grammar);
    var output = gen.runAdvanced('#origin#');

    console.log(output);
  ${'```'}
  `;

  outputEl.innerHTML = `<pre>${JSON.stringify(output, null, 2)}</pre>`;
  textEl.innerText = output.output;

  rootEl.appendChild(textEl);
  rootEl.appendChild(codeEl);
  rootEl.appendChild(outputEl);

  return rootEl;
});
