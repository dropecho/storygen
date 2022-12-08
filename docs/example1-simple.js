addExample('simple example', () => {
  function run() {
    var grammar = {
      origin: ['#name.capitalize# loves #food.pluralize#'],
      name: ['bob', 'mary'],
      food: ['banana', 'apple', 'fish']
    };

    var gen = new Generator(grammar);
    const output = gen.runAdvanced('#origin#');
    console.log(output);

    return output;
  }

  const output = run();
  const code = funcToString(run);

  return {
    description: `A simple example showing the basics of use.`,
    text: output.output,
    output,
    code
  };
});
