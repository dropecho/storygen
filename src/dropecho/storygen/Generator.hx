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

	public function new(config:GeneratorConfig) {
		this.config = config;
		this.matcher = new EReg('(#[^\\s]*#)', "");
		this.random = new Random();
		this.memory = new Map<String, String>();
	}

	public static function configFromJson(json:String) {
		var parsed = haxe.Json.parse(json);
		var config = {
			grammars: [for (field in Reflect.fields(parsed)) field => Reflect.field(parsed, field)]
		};

    return config;
	}

	private function getRandom(s:String) {
		if (config.grammars[s] == null) {
			throw 'No symbol $s exists in your grammar.';
		}
		var pos = this.random.randomInt(0, config.grammars[s].length - 1);
		return config.grammars[s][pos];
	}

	public function run(start:String) {
		var string = getRandom(start);

		while (matcher.match(string)) {
			var key = matcher.matched(0).split("#")[1];
			var split = key.split(":");
			if (split.length > 1) {
				var memKey = split[0];
				var r = memory.exists(memKey) ? memory.get(memKey) : getRandom(split[1]);
				memory.set(memKey, r);
				string = matcher.replace(string, r);
			} else {
				string = matcher.replace(string, getRandom(key));
			}
		}

		return string;
	}
}
