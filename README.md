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
`random(min:Int, max:Int)` returns a random value between `min` and `max`.

```
grammar = {
  numberOfPeople: ['#random(50,100)#'] => 69
}
```

User-defined functions can be added via static class Functions.

```
// gen is always passed as first arg.
Functions.set("myFunc", (gen, args) => {
  var firstArgument = args[0];
  // Function implementation goes here.
});


grammar = {
  origin: ['#myFunc(5)#'] // "firstArgument" will be 5.
}
```


### Transforms (symbol.transform)

- `symbol.capitalize` makes first character uppercase.
- `symbol.pluralize` provides simple pluralization.
- `symbol.a` prepends "a" or "an" to expanded text.


You can apply multiple transforms.

```
grammar = {
  origin: ['#animal.capitalize.pluralize#'],
  animal: ['horse', 'lion']
}
```

You can define custom transforms. They are always defined as function(string):string.

```
Transforms.set("myTran", str => "this is a test");

grammar = {
  origin: ['#sym.myTran#'] // This gets replaced by "this is a test" when run.
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



## JS

```js
var { Generator } = require('@dropecho/storygen');

var grammar = {
  origin: ['#name.capitalize# loves #food.pluralize#'],
  name: ['bob', 'mary'],
  food: ['banana', 'apple']
};

var gen = new Generator(grammar);
var output = gen.run('test', '#origin#');

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
    var output = gen.run("test", "#origin#");
    trace(output);

    // Outputs something like 'Mary loves bananas'.
  }
}

```
