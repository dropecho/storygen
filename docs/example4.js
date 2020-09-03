addExample('custom function', () => {
  // gen is always passed as first arg.
  Functions.set('subtract', (gen, args) => {
    var firstArg = args[0];
    var secondArg = args[1];

    // Function implementation goes here.
    return secondArg - firstArg;
  });

  var grammar = {
    origin: ['#subtract(5, 6)#'] // "firstArg" will be 5, secondArg will be 6, will be replaced with 1 (from function return above.)
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
  Functions.set('subtract', (gen, args) => {
    var firstArg = args[0];
    var secondArg = args[1];

    // Function implementation goes here.
    return secondArg - firstArg;
  });

  var grammar = {
    origin: ['#subtract(5, 6)#'] // "firstArg" will be 5, secondArg will be 6, will be replaced with 1 (from function return above.)
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
