package dropecho.storygen;

import haxe.DynamicAccess;
import haxe.Json;
import seedyrng.Random;

abstract AbsMap<T>(Map<String, T>) from Map<String, T> {
	public function new(s:Map<String, T>) {
		this = s;
	}

	@:from
	public static function fromDynamic(d:Dynamic) {
		var map = [for (f in Reflect.fields(d)) f => Reflect.field(d, f)];
		return new AbsMap(map);
	}

	@:to
	public function toMap() {
		return this;
	}

	public function isMap():Bool {
		var type = Type.getClass(this);
		return type != null && Type.getClassName(type) == "haxe.ds.StringMap";
	}
}

@:expose("Generator")
class Generator {
	public var matcher:EReg = ~/(#.*?#)/;
	public var random:Random = new Random();
	public var memory:Map<String, String> = new Map<String, String>();
	public var grammars:Map<String, Array<String>>;

	public function new(grammars:AbsMap<Array<String>>) {
		this.grammars = grammars.isMap() ? grammars : AbsMap.fromDynamic(grammars);
	}

	public function mergeGrammar(grammars:AbsMap<Array<String>>) {
		var g = grammars.isMap() ? grammars : AbsMap.fromDynamic(grammars);
		for (e in g.toMap().keyValueIterator()) {
			this.grammars.set(e.key, e.value);
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

		var s = token.symbol;

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
        Ensure the object/map contains an array for this.
        example: ``` var grammar = {$s: ["choice1", "choice2"]}; ```
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
		while (matcher.match(string)) {
			var match = matcher.matched(1);
			var token = new Token(match);
			var expanded = expand(token);

			if (!token.isValid) {
				continue;
			}

			if (token.isTransformed) {
				expanded = doTransforms(expanded, token);
			}

			// Store in memory here so transforms are preserved.
			if (token.isMemorized) {
				this.memory.set(token.memSymbol, expanded);
			}

			if (token.isSilent) {
				string = matcher.replace(string, "");
			} else {
				string = matcher.replace(string, expanded);
			}
		}
		return string;
	}

	public function run(from:String):String {
		var out;
		if (from.charAt(0) != "#") {
			out = parse("#" + from + "#");
		}
		out = parse(from);
		memory.clear();

		return out;
	}

	public function runAdvanced(from:String) {
		var output = parse(from);
		var memory = [for (k => v in this.memory.keyValueIterator()) k => v];
		this.memory.clear();

		return {
			output: output,
			#if js
			memory: (cast memory).h
			#else
			memory: memory
			#end
		}
	}
}
