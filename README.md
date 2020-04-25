## Storygen
### Grammar-based text expander in the vein of [tracery](https://www.tracery.io).

Use Storygen by defining a Grammar and running the generator.

A Grammar is a string-to-string array map (or an object with string arrays in JavaScript).

Let's take a look at an example.
```

{
  origin: ["#test#"],
  test: ["hi", "hello", "hola"]
}

```

When run, this will randomly output one of "hi", "hello" or "hola".

There are other ways to define parts of a Grammar.

### Functions (#funcName(arg1, arg2, ...))
- random(min:Int, max:Int) => Returns random between min and max.
- switch(symbol, ['val=>symbol']) => Returns a symbol based on input val.

```
grammar = {
  numberOfPeople: ['#random(50,100)#'] // Outputs 69
}
```

```
grammar = [
  "origin" => ["#[char_race:race]##[char_name:name]##char#"],
  "char" => ["#char_name# the #char_race#"],
  "race" => ["elf", "dwarf"],
  "elfNames" => ["bob"],
  "dwarfNames" => ["sally"],
  "name" => ["#switch(char_race, elf=>elfNames, dwarf=>dwarfNames)#"]
];

// outputs either "bob the elf" or "sally the dwarf"

```

User-defined functions can be added via static class Functions.

```
// gen is always passed as first arg.
Functions.set("custom", (gen, args) => {
  var firstArgument = args[0];
  var secondArg = args[1];
  
  // Function implementation goes here.
  return secondArg - firstArg;
});


grammar = {
  origin: ['#custom(5, 6)#'] // "firstArg" will be 5, secondArg will be 6, will be replaced with 1 (from function return above.)
}
```


### Transforms

- `#symbol.capitalize#` makes first character uppercase.
- `#symbol.pluralize#` provides simple pluralization.
- `#symbol.a#` prepends "a" or "an" to expanded text.


You can apply multiple transforms.

```
grammar = {
  origin: ['#animal.capitalize.pluralize#'],
  animal: ['horse', 'lion']
}
```

You can define custom transforms. They are always defined as function(string):string.

```
Transforms.set("custom", str => "this is a test");

grammar = {
  origin: ['#sym.custom#'] // This gets replaced by "this is a test" when run.
}
```

### Memory

`#my_mem_sym:something#`

Will parse the "something", return the value, and store it into `my_mem_sym` for use later in the Grammar.

```
grammar = {
  name = ["bob", "sally"]
  origin = ["#char_name:name# went to the store. There #char_name# did some stuff. Later #char_name# saw #name# at the bowling alley."]
};

// => "sally went to the store. There sally did some stuff. Later sally saw bob at the bowling alley."
// OR
// => "bob went to the store. There bob did some stuff. Later bob saw sally at the bowling alley."

```

### Silent Symbols

If you want to prepare a Grammar in memory for later use, you can wrap
the token with [].

```
#[char_name:name]#
```

This will output nothing until referenced later. For example:

```
grammar = {
  name: ["bob", "sally"],
  race: ["elf", "goblin"],
  color: ["green", "blue"],
  char: ["#name# the #color# #race#"],
  origin: ["
    #[char_name:name]#

    #char_name# really loved eating bananas.
    #char_name# also was not a fan of cheese.
  "]
};

/**
 * Example output:
 * bob the blue elf really loved eating bananas.
 * bob the blue elf also was not a fan of cheese.
 */

```

### Running generator

There are two run methods on the generator.
  - run(startSymbol, ?seed) => string
  - runAdvanced(startSymbol, ?seed) => outputObject

When run is called, it expands all tokens and returns the output string.
If you want to repeat the run with the exact output, you can provide a string
seed.  The seed MUST be parseable to an INT.

If you want to get the current seed, the generator provids a getSeed method.

When runAdvanced is called, it does the same as run but returns an object like:
```
{
  seed: "23498093", 
  output: "bob the elf", 
  memory: {
    char_name: "bob",
    char_race: "elf"
  }, 
}
```


## JS

```js
var { Generator } = require('@dropecho/storygen');

var grammar = {
  origin: ['#name.capitalize# loves #food.pluralize#'],
  name: ['bob', 'mary'],
  food: ['banana', 'apple']
};

var gen = new Generator(grammar);
var output = gen.run('#origin#');

console.log(output);

// Outputs something like 'Bob loves apples'.

```


## Haxe

```haxe
import dropecho.storygen.Generator;

class Main {
  static public function main():Void {
    var grammar = [
      "origin" => ["#name.capitalize# loves #food.pluralize#"],
      "name" => ["bob", "mary"],
      "food" => ["banana", "apple"]
    ];

    var gen = new Generator(grammar);
    var output = gen.run("#origin#");
    trace(output);

    // Outputs something like 'Mary loves bananas'.
  }
}

```
