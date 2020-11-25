[![NPM Version](https://img.shields.io/npm/v/@dropecho/storygen)](https://www.npmjs.com/package/@dropecho/storygen) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dropecho/storygen/CI) ![npm bundle size](https://img.shields.io/bundlephobia/min/@dropecho/storygen) ![NPM License](https://img.shields.io/npm/l/@dropecho/storygen) 
## Storygen
### Grammar-based text expander in the vein of [tracery](https://www.tracery.io).

Use Storygen by defining a Grammar and running the generator.

A Grammar is a string-to-string array map (or an object with string arrays in JavaScript).

For more resources look at [Resources](#Resources)

Let's take a look at an example.
```js
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

```js
grammar = {
  numberOfPeople: ['#random(50,100)#'] // Outputs 69
}
```

```haxe
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

```js
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

```js
grammar = {
  origin: ['#animal.capitalize.pluralize#'],
  animal: ['horse', 'lion']
}
```

You can define custom transforms. They are always defined as function(string):string.

```js
Transforms.set("custom", str => "this is a test");

grammar = {
  origin: ['#sym.custom#'] // This gets replaced by "this is a test" when run.
}
```

### Memory

`#my_mem_sym:something#`

Will parse the "something", return the value, and store it into `my_mem_sym` for use later in the Grammar.


```js
grammar = {
  name = ["bob", "sally"]
  origin = ["#char_name:name# went to the store. There #char_name# did some stuff. Later #char_name# saw #name# at the bowling alley."]
};

// => "sally went to the store. There sally did some stuff. Later sally saw bob at the bowling alley."
// OR
// => "bob went to the store. There bob did some stuff. Later bob saw sally at the bowling alley."

```

Any memory value that starts with an underscore is temporary for that "chain" of parsing.

In each of the follow "char" chains, the "_h" is stored and used for the 
switch function in the char_name, but is discarded after the token is fully resolved.

```js
var grammer = {
  'char': ['#[_h:char_heritage]##char_name.capitalize# the #_h#'],
  'char_heritage': ['elf', 'dwarf'],
  'elfNames': ['legolas', 'eldrin', 'lilli', 'folmon', 'untir', 'cesrith'],
  'dwarfNames': ['gak', 'bar', 'norn', 'brun', 'esrith', 'gand', 'gil'],
  'char_name': ['#switch(_h, elf=>elfNames, dwarf=>dwarfNames)#'],

  'origin': [
    [
    'the leader is #char#.',
    '#char# has been working with #leader#.',
    '#char# is the quarter master.',
    '#char# is the liason.'
    ].join('\n')
  ]
};
```

### Silent Symbols

If you want to prepare a Grammar in memory for later use, you can wrap
the token with [].

```js
#[char_name:name]#
```

This will output nothing until referenced later. For example:

```js
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
```js
{
  seed: "23498093", 
  output: "bob the elf", 
  memory: {
    char_name: "bob",
    char_race: "elf"
  }, 
}
```

### multiple grammar definitions
You can merge multiple grammars to simplify definitions.


```haxe
grammar = [
  "origin" => ["#[char_race:race]##[char_name:name]##char#"],
  "char" => ["#char_name# the #char_race#"],
  "race" => ["elf", "dwarf"],
  "name" => ["#switch(char_race, elf=>elfNames, dwarf=>dwarfNames)#"]
];

elf_names =  {
  "elfNames" => ["bob"],
}

dwarf_names = {
  "dwarfNames" => ["sally"],
}

gen = new generator(grammar);
gen.mergeGrammar(elf_names);
gen.mergeGrammar(dwarf_names);

gen.run("#origin#");
// outputs either "bob the elf" or "sally the dwarf"
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

## Resources

[Tracery](https://www.tracery.io)

