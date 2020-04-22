package dropecho.storygen;

import haxe.Constraints.Function;
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
	public var grammars:Map<String, Array<String>>;
	public var matcher:EReg;
	public var random:Random;
	public var memory:Map<String, String>;
	public var cache:Map<String, String>;
	public var key:String;

	public function new(grammars:AbsMap<Array<String>>) {
		this.grammars = grammars.isMap() ? grammars : AbsMap.fromDynamic(grammars);
		this.matcher = ~/(#[^#]*#)/;
		this.random = new Random();
		this.memory = new Map<String, String>();
		this.cache = new Map<String, String>();
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
			var field = null;
			if ((field = Reflect.field(Functions, token.symbol)) != null) {
				var args:Array<Dynamic> = new Array<Dynamic>();
				args.push(this);
				args = args.concat(token.functionArgs);
				return Reflect.callMethod(Functions, field, args);
			} else {
        throw 'No function $s exists on the function object.';
      }
		}

		var grammar = grammars[s];
		if (grammar == null) {
			throw 'No symbol $s exists in your grammar.';
		}
		var pos = this.random.randomInt(0, grammar.length - 1);
		var expanded = grammar[pos];

		return expanded;
	}

	private function parse(string:String):String {
		while (matcher.match(string)) {
			var token = new Token(matcher.matched(1));
			if (!token.isValid) {
				string = matcher.replace(string, "");
			}

			var expanded = expand(token);

			if (token.isTransformed) {
				for (transform in token.transforms) {
					expanded = Reflect.field(Transforms, transform)(expanded);
				}
			}

			// Store in memory here so transforms are preserved.
			if (token.isMemorized) {
				this.memory.set(token.memSymbol, expanded);
			}

			string = matcher.replace(string, expanded);
		}
		return string;
	}

	public function run(key:String, from:String):String {
		this.key = key;

		if (!cache.exists(key)) {
			cache.set(key, parse(from));
		}

		this.key = null;
		return cache.get(key);
	}
}
