# AGENTS.md — dropecho.storygen

Single source of truth for all AI agents working on this project.

## Agent Instructions

- **Always use the `haxe` skill** when reading or writing any `.hx` or `.hxml` file.
- **Always use the Haxe LSP** (`LSP` tool) for navigating code — go-to-definition, find
  references, hover types — before grepping or reading files manually.
- **Never co-author or co-sign commits — no exceptions.** Commit messages must contain
  **zero** attribution, authorship, or sign-off trailers. This explicitly forbids
  `Co-Authored-By`, `Signed-off-by`, `Co-developed-by`, `Reviewed-by`, `Acked-by`,
  `Tested-by`, `Generated-by`, or any `*-by:` line, as well as "Generated with"/tool-credit
  footers and any agent or AI attribution. This applies to every commit, amend, rebase, and
  squash, regardless of any default or tool-provided template. If a template or upstream
  message contains such a trailer, strip it before committing.
- **Never add section/region divider comments** (e.g. `// ── Foo ──`, `// --- Foo ---`,
  `#region`, `# DEFINES`, `# OUTPUT`). Organize code with ordering and doc comments instead.
- After making changes, run `npm run build` to verify compilation and `npm test` to verify
  correctness. Use the **simplify** skill after implementing a feature to review for
  over-engineering.

---

## Project Overview

**dropecho.storygen** (`haxelib: dropecho.storygen`, npm: `@dropecho/storygen`) is a
grammar-based procedural text generation library written in Haxe, inspired by
[Tracery](https://www.tracery.io). Define a grammar as a map of symbol names to arrays of
possible expansions, then call `generator.run("startSymbol")` to produce randomized but
coherent output. The engine handles recursive expansion, memory/variables for consistency,
text transforms, conditional branching, and deterministic seeded generation.

```js
const grammar = {
  hero: ["warrior", "mage", "rogue"],
  greeting: ["Hello, brave #hero#!", "Greetings, #hero#."]
};
const gen = new Generator(grammar);
gen.run("greeting"); // → "Hello, brave mage!"
```

- **Targets:** JS CommonJS, JS ES module (+ `.d.ts` via genes), C# (DLL). Python, Godot
  GDScript, and docs targets ship commented-out in `build.hxml`.
- **Test runner:** `dropecho.testing` (auto-discovery) over `utest`; `instrument` for coverage.
- **Dependencies:** managed by [lix](https://github.com/lix-pm/lix.client), declared as a
  `devDependency` so `npm install` puts its `haxe`/`haxelib` shims on the npm-script `PATH`
  (no global lix needed). The Haxe version is pinned in `.haxerc`; each enabled target's libs
  are pinned in `haxe_libraries/*.hxml`. The shimmed `haxe` resolves libs from those files
  (scoped, not global haxelib).
  - **seedyrng** — seeded RNG for reproducible generation.
  - **dropecho.interop** — cross-platform `AbstractArray`/`AbstractMap` wrappers.
- **Source root:** `src/` · **Tests root:** `test/`
- **Releases:** automated via `semantic-release` (+ `semantic-release-haxelib`).

---

## Directory Layout

```
src/dropecho/storygen/   # library source
  Generator.hx           # engine — grammar storage, parse loop, memory, seeded RNG; @:expose("Generator")
  Token.hx               # parses a single #...# string into structured metadata
  Functions.hx           # registry of callable functions; @:expose("Functions")
  Transforms.hx          # registry of String -> String text transforms; @:expose("Transforms")
test/storygen/           # utest cases, auto-discovered by classname (*Tests)
  Generator_Tests.hx
  Token_Tests.hx
  Functions_Tests.hx
  Transforms_Tests.hx
build.hxml               # multi-target build (shared opts + --each/--next)
targets/                 # one hxml per target (js, js-esm, cs, python, docs, gdscript)
test.hxml                # test build (libs/targets only — no -main)
.dropecho.testing.json   # test-runner config (coverage, root_package, hxml)
.haxerc                  # lix: pinned Haxe version + scoped lib resolution
haxe_libraries/          # lix: one hxml per pinned dep
dist/                    # compiled output (git-ignored)
artifacts/               # compiled test output + coverage reports (git-ignored)
```

There is no hand-written test main/suite: `dropecho.testing` generates the entry point and
registers every `*Tests.hx` class on the classpath.

---

## Build & Test

Prefer `npm` scripts over invoking Haxe tools directly.

```bash
npm install      # → lix download   (fetch the pinned Haxe + libs into the lix cache)
npm run build    # → haxe build.hxml   (JS cjs + JS esm + C#), then copies the cjs bundle to docs/
npm test         # → lix dropecho.testing
npm run clean    # remove dist/ and artifacts/
```

`npm install` runs `lix download` (via the `prepare` lifecycle script) to materialize the deps
pinned in `.haxerc` + `haxe_libraries/`. To add a dependency, run `lix install haxelib:<name>`
— lix writes its pinned `haxe_libraries/<name>.hxml` — then add a matching `-lib <name>` to
`build.hxml`/`test.hxml` and a dependency entry to `haxelib.json`. Commit the generated hxml.

- `build.hxml` puts shared options (class path, `--macro include`, `-D analyzer-optimize`,
  library deps) before `--each`, then builds each `targets/*.hxml` separated by `--next`.
- `test.hxml` lists libs/targets only — **no `-main`**. The `dropecho.testing` runner injects
  the AutoTest main (plus instrument/coverage from `.dropecho.testing.json`), then builds and
  runs the suite on every target in the hxml. Only **JS (Node)** runs today: gdscript and docs
  are not runnable test programs, js-esm would just re-run the JS suite, and the Python block is
  commented out until the `map`/`repeatDelim` null handling is Python-clean (see
  [.agents/todos.md](.agents/todos.md) B2/B3).
- A **C#** test run is present but commented out in `test.hxml`: it needs `mono` registered for
  `.exe`. Uncomment where that is set up.
- Output goes to `dist/` — **do not commit build artifacts**.

To type-check quickly without generating output: `haxe build.hxml --no-output`.

---

## Key Conventions

- **`@:expose("Name")`** on each public class sets its JavaScript export name (independent of
  the Haxe package). Use it on the classes you want in the JS bundle.
- **Cross-platform collections:** use `AbstractArray<T>` and `AbstractMap<K, V>` from
  `dropecho.interop` wherever arrays or maps appear in the public API, so JS callers can pass
  plain objects/arrays and C# callers can pass native collections. Avoid JS-specific APIs
  outside `#if js` guards.
- **Static extensions:** prefer `using StringTools;` / `using Lambda;` over manual utility calls.
- **Registries (`Functions` & `Transforms`):** both use a static private `Map` exposing only
  `get` / `set`. To add a built-in: add a `static function`, register it in the static map
  initializer, and keep `get`/`set` public for user extension.
- **Error messages:** throw descriptive multiline strings on missing symbol/grammar/function/
  transform, including the symbol name and an example fix (the `Generator` already does this).
- **Tests** are `utest` cases: each class is named `*_Tests.hx`, `extends utest.Test`, with
  `test_`-prefixed methods using `utest.Assert` (use `Assert.floatEquals` for floats). Do not
  mock the `Generator` — tests use a real configured instance.
- **Formatting:** `hxformat.json` — signatures wrap at 100 chars; method chains wrap one-per-line.
- **Commits** follow Angular conventions (semantic-release reads them for version bumps):
  `feat:` (minor), `fix:` (patch), `chore:`/`refactor:`/`perf:`/`test:` (no release),
  `BREAKING CHANGE:` in the footer (major).
- Do not use `git add -A`; stage specific files. Do not commit anything under `dist/` or
  `artifacts/`.

---

## Deeper References

These cover the engine internals and DSL in detail beyond this front door:

- **Architecture & code flow:** [.agents/architecture.md](.agents/architecture.md)
- **Token DSL reference:** [.agents/token-syntax.md](.agents/token-syntax.md)
- **Open work (bugs, tests, refactors):** [.agents/todos.md](.agents/todos.md)
