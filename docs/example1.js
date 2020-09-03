addExample('example 1', () => {
  function run() {
    var grammar = {
      origin: ['#name.capitalize# loves #food.pluralize#'],
      name: ['bob', 'mary'],
      food: ['banana', 'apple']
    };

    var gen = new Generator(grammar);
    const output = gen.runAdvanced('#origin#');
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
