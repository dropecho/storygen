addExample('Complicated Example', () => {
  function run() {
    var grammar = {
      'origin': [
        ['#guild#',
          ' ',
          'The #cur_guild_name# is a guild.',
          'They have #number# members.',
          'It is run by #guild_leader#.',
          'It is run by #guild_leader#.',
          'It is run by #guild_leader#.',
          'It is run by #guild_leader#.',
          'It is run by #guild_leader#.'].join('\n')
      ],
      'guild': ['#[cur_guild_name:guild_name]##[guild_leader:char_origin]##cur_guild_name#'],
      'guild_name': ['#color# #tool#'],
      'tool': ['hammer', 'anvil', 'pot', 'clay'],
      'color': ['white', 'grey', 'blue', 'green'],
      'number': ['#random(10, 100)#'],
      'char_origin': ['#[cur_char_heritage:char_heritage]##[cur_char_name:char_name]##char#'],
      'char': ['#cur_char_name# the #cur_char_heritage#'],
      'char_heritage': ['elf', 'dwarf'],
      'elfNames': ['legolas', 'eldrin', 'lilli'],
      'dwarfNames': ['gak', 'bar', 'norn'],
      'char_name': ['#switch(cur_char_heritage, elf=>elfNames, dwarf=>dwarfNames)#']
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
