addExample('random function', () => {
  function run() {
    var grammar = {
      numberOfPeople: ['#random(50,100)#'],
      origin: ['There are #numberOfPeople# people in the village.']
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
