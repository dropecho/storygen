addExample('random function', () => {
  var grammar = {
    numberOfPeople: ['#random(50,100)#'],
    origin: ['There are #numberOfPeople# people in the village.']
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
      numberOfPeople: ['#random(50,100)#'],
      origin: ['There are #numberOfPeople# people in the village.']
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
