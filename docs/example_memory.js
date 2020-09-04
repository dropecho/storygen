addExample('Memory example', () => {
  function run() {
    var grammar = {
      origin: ['#n:full_name# #n# #n2:full_name# #n2# '],
      full_name: ["#first_name# #last_name#"],
      first_name: ['Fred', 'Sally', 'Barb', 'Lance', 'Francine'],
      last_name: ['Smith', 'Jones', 'Barker', 'White', 'Snodgrass']
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
