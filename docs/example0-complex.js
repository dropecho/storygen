addExample('Complicated Example', () => {
  function run() {
    var grammar = {
      'origin': [
        `#[guild:guild_name]##[leader:char]##[second:char]##guild_description#`
      ],
      'guild_description': [
        [
          'The #guild# is a #job# guild.',
          'They have #number# members.',
          'It is run by #leader#.',
          '#leader# has been running it for #number# years.',
          '',
          '#second# has been working with #leader# for #number# years',
          '#char# is the quarter master.',
          '#char# is the liason.'
        ].join('\n')
      ],
      'guild_name': ['#color# #tool#'],
      'job': ['merchant', 'porter', 'blacksmith', 'baker'],
      'tool': ['hammer', 'anvil', 'pot', 'clay', 'sickle', 'wheel', 'wagon'],
      'color': ['white', 'grey', 'blue', 'green', 'yellow', 'orange', 'black'],
      'number': ['#random(10, 100)#'],
      'char': ['#[_h:char_heritage]##char_name.capitalize# the #_h#'],
      'char_heritage': ['elf', 'dwarf'],
      'elfNames': ['legolas', 'eldrin', 'lilli', 'folmon', 'untir', 'cesrith'],
      'dwarfNames': ['gak', 'bar', 'norn', 'brun', 'esrith', 'gand', 'gil'],
      'char_name': ['#switch(_h, elf=>elfNames, dwarf=>dwarfNames)#']
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
