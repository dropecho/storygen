package dropecho.storygen;

import dropecho.interop.AbstractArray;
import haxe.Int64Helper;
import haxe.DynamicAccess;
import haxe.Json;
import seedyrng.Random;
import dropecho.interop.AbstractMap;

typedef AAS = AbstractArray<String>;
typedef GrammarType = AbstractMap<String, AAS>;

@:struct
@:nativeGen
class GeneratorOutput {
	public var seed:String;
	public var output:String;
	public var memory:AbstractMap<String, String>;

	public function new() {}
}

@:expose("Generator")
class Generator {
	public var matcher:EReg = ~/(#.*?#)/;
	public var random:Random = new Random();
	public var memory:AbstractMap<String, String> = new Map<String, String>();
	public var grammars:GrammarType;

	public function new(grammars:GrammarType) {
		this.grammars = grammars;
	}

	public function getSeed() {
		return Std.string(random.seed);
	}

	public function mergeGrammar(grammars:GrammarType) {
		for (key => value in grammars) {
			this.grammars.set(key, cast(value));
		}
	}

	public static function configFromJson(json:String) {
		var json:DynamicAccess<Array<String>> = Json.parse(json);
		return [for (f in Reflect.fields(json)) f => Reflect.field(json, f)];
	}

	private inline function inMemory(symbol) {
		return this.memory.exists(symbol);
	}

	private function expand(token:Token):String {
		if (token.isMemorized || inMemory(token.symbol)) {
			var sym = token.memSymbol != null ? token.memSymbol : token.symbol;
			if (inMemory(sym)) {
				return this.memory.get(sym);
			}
		}

		var s:String = token.symbol;

		if (token.isFunction) {
			var func = Functions.get(token.symbol);
			if (func != null) {
				return func(this, token.functionArgs);
			} else {
				throw '
					No function "$s" exists on the function object.
					Double check spelling (#random(5,10)#) or add function to Functions.
					example:
					``` storygen.Functions.set("myFunc", (s:String) => return "hi");```
				';
			}
		}

		var grammar = grammars[s];

		if (grammar == null) {
			throw '
				No symbol "$s" exists in your grammar.
				Ensure the object/map contains an array for this or
				that you have stored this in memory.
				example: ``` var grammar = {$s: ["choice1", "choice2"]}; ```
				example: ``` var grammar = {"example": ["#$s:some_other#"]}; ```
			';
		}

		if (grammar.length <= 0) {
			throw '
				No choices in grammar for symbol "$s", has 0 elements.
				Try adding some.
				example: ``` var grammar = {$s: ["choice1", "choice2"]}; ```
			';
		}

		var pos = this.random.randomInt(0, grammar.length - 1);
		var expanded = grammar[pos];
		return expanded;
	}

	private function doTransforms(s:String, token:Token):String {
		for (transform in token.transforms) {
			var t = Transforms.get(transform);
			if (t == null) {
				throw '
              No transform "$transform" exists on the transforms object.
              Double check spelling (#sym.capitalize#) or add transform to Transforms.
              example: 
              ``` storygen.Transforms.set("myTransform", (s:String) => return "hi");```
            ';
			} else {
				s = t(s);
			}
		}

		return s;
	}

	private function parse(string:String):String {
		var tempMemory = [];

		while (matcher.match(string)) {
			var match = matcher.matched(1);
			var token = new Token(match);
			var expanded = expand(token);

			if (!token.isValid) {
				continue;
			}

			// Recurse through expansions.
			expanded = parse(expanded);

			if (token.isTransformed) {
				expanded = doTransforms(expanded, token);
			}

			// Store in memory here so transforms are preserved.
			if (token.isMemorized) {
				this.memory.set(token.memSymbol, expanded);
				if (token.memSymbol.charAt(0) == '_') {
					tempMemory.push(token.memSymbol);
				}
			}

			if (token.isSilent) {
				string = matcher.replace(string, "");
			} else {
				string = matcher.replace(string, expanded);
			}
		}

		for (t in tempMemory) {
			memory.remove(t);
		}
		return string;
	}

	public function run(from:String, ?seed:String = ""):String {
		if (seed != null && seed != "") {
			// Convert to string and remove decimal for dynamic langs.
			seed = Std.string(seed).split('.')[0];
			random.seed = Int64Helper.parseString(seed);
		}
		var out;
		if (from.charAt(0) != "#") {
			out = parse("#" + from + "#");
		}
		out = parse(from);
		memory.clear();

		return out;
	}

	public function runAdvanced(from:String, seed:String = ""):GeneratorOutput {
		if (seed != null && seed != "") {
			// Convert to string and remove decimal for dynamic langs.
			seed = Std.string(seed).split('.')[0];
			random.seed = Int64Helper.parseString(seed);
		}
		var output = parse(from);
		var memory = [for (k => v in this.memory.keyValueIterator()) k => v];
		this.memory.clear();

		var genOutput = new GeneratorOutput();

		genOutput.seed = getSeed();
		genOutput.output = output;
		genOutput.memory = memory;

		return genOutput;
	}
}
