package dropecho.storygen;

import seedyrng.Random;

typedef GeneratorConfig = {
	var grammars:Map<String, Array<String>>;
}

class Generator {
	public var config:GeneratorConfig;
	public var matcher:EReg;
	public var random:Random;
	public var memory:Map<String, String>;
	public var cache:Map<String, String>;
	public var key:String;

	public function new(config:GeneratorConfig) {
		this.config = config;
		this.matcher = ~/(#[^#]*#)/;
		this.random = new Random();
		this.memory = new Map<String, String>();
		this.cache = new Map<String, String>();
	}

	public static function configFromJson(json:String) {
		var parsed = haxe.Json.parse(json);
		var config = {
			grammars: [for (field in Reflect.fields(parsed)) field => Reflect.field(parsed, field)]
		};

		return config;
	}

	private function expand(token:Token):String {
		if (token.isMemorized || memory.exists(token.symbol)) {
			var sym = token.memSymbol != null ? token.memSymbol : token.symbol;
			if (memory.exists(sym)) {
				return memory.get(sym);
			}
		}

		var s = token.symbol;
		if (config.grammars[s] == null) {
			throw 'No symbol $s exists in your grammar.';
		}
		var pos = this.random.randomInt(0, config.grammars[s].length - 1);
		var expanded = config.grammars[s][pos];

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
				memory.set(token.memSymbol, expanded);
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
