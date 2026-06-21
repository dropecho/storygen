# Token DSL Reference

Tokens are delimited by `#`. Everything between the hashes is parsed according to the pipeline below.

## Forms (from simplest to fullest)

```
#symbol#                               Expand grammar symbol
#symbol.transform#                     Expand, then apply transform
#symbol.t1.t2#                         Expand, then apply transform chain left-to-right
#memKey:symbol#                        Expand and store result in memory as memKey
#memKey:symbol.transform#              Expand, transform, store
#[memKey:symbol]#                      Silent: store in memory but output nothing
#[symbol]#                             Silent expand (no output, no memory)
#funcName(arg1, arg2)#                 Call a function
#memKey:funcName(arg).transform#       Function + store + transform
#[memKey:funcName(arg).transform]#     Full form: silent + memory + function + transform
```

## Parsing Rules

1. **Silent** — wrapping the inner content in `[...]` sets `isSilent = true`; output is suppressed.
2. **Memory** — a `:` splits `memKey:rest`; the result is stored under `memKey` in generator memory.
3. **Transform chain** — `.` separates transforms; all text after the first `.` is split by `.` to build the chain. Applied in order after expansion.
4. **Function** — `name(args)` syntax; args are comma-separated and trimmed. `functionArgs` will be an empty array for `name()`.

The parse order in `Token.new()` is: expandable → silent → memory → transform → function. Each step consumes its piece of `inner`; the remainder becomes `symbol`.

## Memory Key Scoping

- Normal keys persist across multiple `run()` calls on the same Generator instance.
- Keys prefixed with `_` (e.g. `_tmpName`) are **scoped to the current `parse()` call** and are removed before it returns.

## Built-in Functions

| Syntax | Description |
|---|---|
| `#random(min, max)#` | Random integer between min and max (inclusive) as a string |
| `#repeat(symbol, min, max)#` | Expand symbol N times (space-separated), N is random in [min, max] |
| `#repeat(symbol, min, max, delim)#` | Same with custom delimiter; `"n"` = newline, `"nn"` = double newline, `"s"` = space |
| `#switch(memKey, val=>choice, ...)#` | Branch on memory value; `_` is default; choice may be a grammar symbol |
| `#map(memKey, val=>choice, ...)#` | Like switch but always returns a literal string, never a grammar reference |

## Built-in Transforms

| Name | Effect |
|---|---|
| `capitalize` | Uppercases the first character |
| `titlize` | Capitalizes every word |
| `toUpperCase` | Full uppercase |
| `toLowerCase` | Full lowercase |
| `pluralize` | English pluralization (handles `-y`, `-th`, `-ey`, `-x`, `-h` endings) |
| `a` | Prepends "a" or "an" based on vowel detection |
| `trim` | Strips leading/trailing whitespace |

## Adding Custom Functions and Transforms

```haxe
// Function: receives generator + args, returns string
Functions.set("myFunc", (gen:Generator, args:Array<String>) -> {
    return "result";
});

// Transform: String -> String
Transforms.set("myTransform", (s:String) -> s.split("").join("-"));
```
