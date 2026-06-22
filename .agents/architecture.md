# Architecture — Code Flow

## Module Responsibilities

| File | Role |
|---|---|
| `Generator.hx` | Entry point, parse loop, memory, RNG, expand dispatch |
| `Token.hx` | Parses a single `#...#` string into structured metadata |
| `Functions.hx` | Static registry of callable functions; each takes `(Generator, Array<String>)` |
| `Transforms.hx` | Static registry of `String -> String` text transforms |

## Parse Loop

`Generator.parse(string)` is the core engine.

1. `EReg.map` scans the string for `#...#` tokens in one pass.
2. Each match is handed to `new Token(matched)` to decode its metadata.
3. If `token.isExpandable` is false (no `#..#` delimiters), the raw text is returned unchanged.
4. `expand(token)` resolves the symbol to a raw string (from grammar or function).
5. `parse(expanded)` recurses — expansions can themselves contain tokens.
6. `doTransforms(expanded, token)` applies the transform chain in order.
7. If `token.isMemorized`, the result is stored in `this.memory` under `token.memSymbol`.
8. If `token.isSilent`, an empty string is returned instead of the expanded value.

## Token Parsing Order

`Token.new(text)` parses in a fixed pipeline. Each step consumes part of `inner`:

```
expandable check → silent unwrap ([...]) → memory split (k:v) → transform split (.x.y) → function split (name(args))
```

The final `inner` value after all steps becomes `token.symbol`.

## Memory Lifecycle

- Memory (`this.memory`) is a persistent `AbstractMap<String, String>` on the Generator instance.
- It persists across `run()` and `runAdvanced()` calls unless `clearMemory()` is called explicitly.
- Keys starting with `_` are **temporary**: they are collected into `tempMemory` during a `parse()` call and removed before `parse()` returns.
- `runAdvanced()` returns a snapshot of memory at the end of the run (does not include temp keys that were cleaned up).

## `run()` vs `runAdvanced()`

| | `run()` | `runAdvanced()` |
|---|---|---|
| Returns | `String` | `GeneratorOutput { seed, output, memory }` |
| Seed capture | none | captures seed *before* parse so the same seed reproduces output |
| Bare symbol | wraps `from` in `#...#` if it doesn't start with `#` | caller must pass full token string |

## Expand Dispatch

`expand(token)` priority:

1. If `token.isMemorized` or the symbol is already in memory → return the stored value.
2. If `token.isFunction` → delegate to `callFunction(token)` → `Functions.get(symbol)(gen, args)`.
3. Otherwise → look up `grammars[token.symbol]`, pick a random index, return the raw string.

Functions receive the whole `Generator` instance so they can call `gen.run()` for recursive expansion (see `repeatDelim`).

## `switchFunc` vs `mapFunc`

Both do key→value lookup against `this.memory`.

- `switchFunc`: reads the key name directly from `args[0]` as a string; checks if the resolved value is a grammar symbol and wraps it in `#...#` if so.
- `mapFunc`: resolves the key through `gen.memory[args.shift()]`; returns the literal mapped value. Does **not** check grammar — always returns a plain string.

Both fall back to `_` as a default key. If neither the match nor `_` exists, they return `""`.
