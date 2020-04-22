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
