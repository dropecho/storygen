addExample('Procedual language based names', () => {
  function run() {
    let languages = {
      first: new Language(null, 200),
      second: new Language(null),
    }

    Functions.set('lang_gen', (gen, args) => {
      const lang = languages[args[0]];
      return lang.createWord();
    });

    var grammar = {
      origin: [`
Elvish Names:
        #lang_gen(first).capitalize#
        #lang_gen(first).capitalize#
        #lang_gen(first).capitalize#

#lang_gen(second).capitalize# Names:
        #lang_gen(second).capitalize#
        #lang_gen(second).capitalize#
        #lang_gen(second).capitalize#
        `],
    };

    var gen = new Generator(grammar);

    var output = gen.runAdvanced('#origin#');

    console.log(output);
    console.log(gen.memory);

    return output;
  }

  const output = run();
  const code = funcToString(run);

  return {
    text: output.output.trim(),
    output,
    code
  };
});
