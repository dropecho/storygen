package dropecho.storygen;

import dropecho.interop.AbstractArray;
import haxe.DynamicAccess;
import haxe.Json;
import seedyrng.Random;
import dropecho.interop.AbstractMap;

/** 
 * An array of strings, representing words or tokens as part of a grammer. 
 */
typedef WordList = AbstractArray<String>;

/** 
 * A map of strings to array of strings (WordList). 
 * This represents "types" of words/tokens in a grammar.
 */
typedef Grammar = AbstractMap<String, WordList>;

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
	public var tokenRegex:EReg = ~/(#.*?#)/;
	public var random:Random = new Random();
	public var memory:AbstractMap<String, String> = new Map<String, String>();
	public var grammars:Grammar;

	/**
	 * @param grammars The String to Array<string> map representing the available tokens in a grammar. 
	 */
	public function new(grammars:Grammar) {
		this.grammars = grammars;
	}

	public function getSeed() {
		return Std.string(random.seed);
	}

	public function mergeGrammar(grammars:Grammar) {
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

		if (token.isFunction) {
			return callFunction(token);
		}

		var grammar = grammars[token.symbol];

		if (grammar == null) {
			throw '
				No symbol "${token.symbol}" exists in your grammar.
				Ensure the object/map contains an array for this or
				that you have stored this in memory.
				example: ``` var grammar = {${token.symbol}: ["choice1", "choice2"]}; ```
				example: ``` var grammar = {"example": ["#${token.symbol}:some_other#"]}; ```
			';
		}

		if (grammar.length <= 0) {
			throw '
				No choices in grammar for symbol "${token.symbol}", has 0 elements.
				Try adding some.
				example: ``` var grammar = {${token.symbol}: ["choice1", "choice2"]}; ```
			';
		}

		var pos = this.random.randomInt(0, grammar.length - 1);
		return grammar[pos];
	}

	private function callFunction(token:Token) {
		var func = Functions.get(token.symbol);
		if (func != null) {
			return func(this, token.functionArgs);
		} else {
			throw '
					No function "${token.symbol}" exists on the function object.
					Double check spelling (#random(5,10)#) or add function to Functions.
					example:
					``` storygen.Functions.set("${token.symbol}", (s:String) => return "hi");```
				';
		}
	}

	private function doTransforms(text:String, token:Token):String {
		for (transformName in token.transforms) {
			var transform = Transforms.get(transformName);
			if (transform == null) {
				throw '
              No transform "$transformName" exists on the transforms object.
              Double check spelling (#sym.capitalize#) or add transform to Transforms.
              example: 
              ``` storygen.Transforms.set("$transformName", (s:String) => return "hi");```
            ';
			} else {
				text = transform(text);
			}
		}

		return text;
	}

	private function parse(string:String):String {
		var tempMemory = [];

		while (tokenRegex.match(string)) {
			var token = new Token(tokenRegex.matched(1));

			if (!token.isExpandable) {
				continue;
			}

			var expanded = expand(token);

			// Recurse through expansions.
			expanded = parse(expanded);

			// Do transforms after expansion.
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
				string = tokenRegex.replace(string, "");
			} else {
				string = tokenRegex.replace(string, expanded);
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
			seed = Std
				.string(seed)
				.split('.')[0];
			random.setStringSeed(seed);
		}
		var out;
		if (from.charAt(0) != "#") {
			out = parse("#" + from + "#");
		}
		out = parse(from);
		//     memory.clear();

		return out;
	}

	public function runAdvanced(from:String, seed:String = ""):GeneratorOutput {
		if (seed != null && seed != "") {
			// Convert to string and remove decimal for dynamic langs.
			seed = Std
				.string(seed)
				.split('.')[0];
			random.setStringSeed(seed);
		}
		var output = parse(from);
		var memory = [for (k => v in this.memory.keyValueIterator()) k => v];
		//     this.memory.clear();

		var genOutput = new GeneratorOutput();

		genOutput.seed = getSeed();
		genOutput.output = output;
		genOutput.memory = memory;

		return genOutput;
	}
}
