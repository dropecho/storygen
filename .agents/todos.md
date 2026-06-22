# Project Todos

## Bugs

### B1 — `run()` parses input twice when it starts with `#`
**File:** `src/dropecho/storygen/Generator.hx:190-196`
`run()` calls `parse("#" + from + "#")` and then unconditionally calls `parse(from)` again, overwriting `out`. If `from` starts with `#`, the wrapped parse result is discarded; if it doesn't, `from` is parsed unwrapped the second time and the correct result is also discarded. The second `parse(from)` call always wins, making the first branch dead code.
```haxe
// Current (broken):
if (from.charAt(0) != "#") {
    out = parse("#" + from + "#");  // assigned but overwritten
}
out = parse(from);  // always runs
```
Fix: use `else` so only one path executes, or wrap unconditionally and drop the branch.

### B2 — `mapFunc` crashes when no matching key is found
**File:** `src/dropecho/storygen/Functions.hx:52-55`
`args.find(...)` returns `null` when there's no match, and `.split('=>')[1]` is then called on `null`, throwing a runtime error. There's no default/fallback like `switchFunc` has.

### B3 — `repeatDelim` ignores the custom delimiter if it's not in the `delims` map
**File:** `src/dropecho/storygen/Functions.hx:33`
```haxe
delim = delims.exists(delim) ? delims.get(delim) : " ";
```
If the user passes a literal delimiter string (e.g. `", "`) it's silently replaced with a space. The intent is probably: use `delims` as shorthand aliases, fall back to the raw value otherwise.

---

## Tests

### T1 — Uncomment and fix the commented-out Generator tests
**File:** `test/storygen/Generator_Tests.hx:136-420`
A large block of tests covering transforms, memory+transforms, functions, seeded runs, and exception handling are commented out. Many likely work as-is; others may have been blocked by bugs (B1, B2). Re-enable them after fixing the underlying issues.

### T2 — Add tests for `run()` called with a bare symbol name (no `#`)
There is no active test that calls `generator.run("test")` (without hashes). Given bug B1, the behavior is currently broken for this case. Add explicit tests for both calling styles.

### T3 — Add tests for `mapFunc`
**File:** `test/storygen/Functions_Tests.hx`
No test exists for the `map` function. Add coverage for: match found, no match (currently crashes), and the alias `map` vs `switch`.

### T4 — Add edge-case tests for `pluralize`
**File:** `test/storygen/Transforms_Tests.hx`
Missing coverage for words ending in `th` ("bath" → "baths"), `ey` ("monkey" → "monkeys"), `s` ("glass" — currently produces "glasss"), `ch` ("church" — covered via `batch`), and empty string.

### T5 — Add tests for `repeatDelim` with custom delimiter
Verify that literal delimiters (e.g. `", "`) are passed through, and that `"s"`, `"n"`, `"nn"` aliases resolve correctly. Currently no test exercises the delimiter argument at all.

### T6 — Add a test for seeded determinism (`runAdvanced` with seed)
**File:** `test/storygen/Generator_Tests.hx:305-321`
This test is commented out. Seeded reproducibility is a core feature with no active test coverage.

---

## Refactoring

### R1 — `Token` parses with five separate `EReg.match()` calls, each scanning from scratch
**File:** `src/dropecho/storygen/Token.hx`
Each `check*` method runs its own regex match and stores state in instance vars. The parsing order is correct, but the approach is fragile (regex state depends on match order) and harder to follow than a single structured parse. Consider a single-pass parse or at minimum grouping the calls to make the dependency chain explicit.

### R2 — `switchFunc` and `mapFunc` share logic but diverge in implementation
**File:** `src/dropecho/storygen/Functions.hx:51-88`
`mapFunc` uses `args.find(...).split(...)` (no default, crashes on miss); `switchFunc` builds a `StringMap` manually with default support. They should share a single lookup helper, with `map` being an alias that calls through.

### R3 — `GeneratorOutput` uses a bare `new()` with no field initialization
**File:** `src/dropecho/storygen/Generator.hx:23-31`
The struct is populated by mutating fields after construction. A constructor taking all three fields would prevent partially-initialized instances from escaping.

### R4 — Commented-out `memory.clear()` calls suggest unresolved design question
**File:** `src/dropecho/storygen/Generator.hx:194`, `209`
Both `run()` and `runAdvanced()` have `memory.clear()` commented out. It's unclear whether memory should persist across calls or be scoped to a single run. The current behavior (memory persists) can cause subtle cross-run contamination. Decide and document, or add a `clearMemory()` public API.

### R5 — `Transforms.get` throws instead of returning null, inconsistent with `Functions.get`
**File:** `src/dropecho/storygen/Transforms.hx:69-74` vs `Functions.hx:95-97`
`Functions.get` returns `null` and lets the caller throw; `Transforms.get` throws directly. The `doTransforms` call site in `Generator` already checks for null from `Transforms.get` — but it'll never receive null because `Transforms.get` throws first. Pick one pattern and apply it consistently.

---

## Optimizations

### O1 — `tokenRegex` is re-matched per iteration inside `parse()` with no position tracking
**File:** `src/dropecho/storygen/Generator.hx:143`
The `while (tokenRegex.match(string))` loop rebuilds the token and rescans from position 0 after each replacement. For strings with many tokens this is O(n²) in token count. Haxe's `EReg` supports `matchSub` with a position argument — matching from after the last replacement would make this O(n).

### O2 — `capitalize` splits the entire string into a char array to change one character
**File:** `src/dropecho/storygen/Transforms.hx:22-29`
```haxe
var chars = s.split("");
chars[0] = chars[0].toUpperCase();
return chars.join("");
```
This allocates an array of length N just to uppercase the first character. Use `s.charAt(0).toUpperCase() + s.substr(1)` instead.

### O3 — `repeatDelim` concatenates strings in a loop
**File:** `src/dropecho/storygen/Functions.hx:36-39`
`str += gen.run(...) + delim` inside a loop creates intermediate string allocations on each iteration. Use `StringBuf` and a single `toString()` at the end.

### O4 — `isVowel` constructs a new string literal on every call to check membership
**File:** `src/dropecho/storygen/Transforms.hx:17-19`
`var vowels = 'aeiouAEIOU'` is allocated each call. Either make it a `static final` or use a `switch` expression on the character directly.
