addExample('switch function', () => {
  var grammar = {
    'origin': ['#[char_heritage:heritage]##[char_name:name]##char#'],
    'char': ['#char_name# the #char_heritage#'],
    'heritage': ['elf', 'dwarf'],
    'elfNames': ['legolas', 'eldrin', 'lilli'],
    'dwarfNames': ['gak', 'bar', 'norn'],
    'name': ['#switch(char_heritage, elf=>elfNames, dwarf=>dwarfNames)#']
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
      'origin': ['#[char_heritage:heritage]##[char_name:name]##char#'],
      'char': ['#char_name# the #char_heritage#'],
      'heritage': ['elf', 'dwarf'],
      'elfNames': ['legolas', 'eldrin', 'lilli'],
      'dwarfNames': ['gak', 'bar', 'norn'],
      'name': ['#switch(char_heritage, elf=>elfNames, dwarf=>dwarfNames)#']
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
