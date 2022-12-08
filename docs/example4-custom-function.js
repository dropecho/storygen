addExample('custom function', () => {
  function run() {
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
