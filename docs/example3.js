addExample('switch function', () => {
  function run() {
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
    return output;
  }

  const output = run();
  const code = funcToString(run);

  return {
    text: output.output,
    output,
    code
  };

});
