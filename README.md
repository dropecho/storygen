# A grammar based text expander in the vein of tracery.

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

### Transforms (symbol.transform)

- symbol.capitalize => turns first char to uppercase
- symbol.pluralize => simple pluralization 
- symbol.a => Adds a or an to beginning of expanded text. 


You can apply multiple transforms.

```
#animal.capitalize.pluralize#
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
