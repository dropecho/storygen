## A grammar based text expander in the vein of tracery.

It works by defining a Grammar and running the generator.

A grammer is a string to string array map (or an obj with string arrays in js).

example grammer is
```

{
origin: ["#test#"],
test: ["hi", "hello", "hola"]
}

```

when run will output randomly "hi", "hello" or "hola".

There are other ways to define parts of grammer.

### Functions (#funcName(arg1, arg2, ...))
- random(min:Int, max:Int) => Returns random between min and max.

```
#random(50,100)#
```

User defined functions can be added via static class Functions.

```
// gen is always passed as first arg.
Functions.set("myFunc", (gen, args) => {
  var thing = args[0]; // this is 5.
  // do stuff.
});


#myFunc(5);
```


### Transforms (symbol.transform)

- symbol.capitalize => turns first char to uppercase
- symbol.pluralize => simple pluralization 
- symbol.a => Adds a or an to beginning of expanded text. 


You can apply multiple transforms.

```
#animal.capitalize.pluralize#
```

You can define custom transforms, they are always function(string):string.

```
Transforms.set("myTran", str => "this is a test");

#sym.myTran# // this gets replaced by "this is a test".
```

## Memory

doing 
```
#my_mem_sym:something#
```

Will parse the something, return the value and store it into my_mem_sym for use later in the grammar.

```
grammar = {
  name = ["bob", "sally"]
  origin = ["#char_name:name# went to the store. There #char_name# did some stuff. Later #char_name# saw #name# at the bowling alley."]
};

should output somethign like:
sally went to the store. There sally did some stuff. Later sally saw bob at the bowling alley. 

```

## Silent Symbols

If you want to just "setup" something in memory to use later, you can wrap
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


should output something like 

bob the blue elf really loved eating bananas.
bob the blue elf also was not a fan of cheese.

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

// outputs something like 'Bob loves apples'

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
    
    // outputs something like 'Bob loves apples'
  }
}

```
