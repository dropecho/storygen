package dropecho.storygen;

import haxe.ds.StringMap;

using Lambda;
using StringTools;

@:expose("Functions")
class Functions {
	static private var funcs:Map<String, Dynamic> = [
		//
		"random" => random,
		"repeat" => repeat,
		"repeatDelim" => repeatDelim,
		"switch" => switchFunc,
		"map" => mapFunc,
	];

	static function repeat(gen:Generator, args:Array<String>) {
		return repeatDelim(gen, args);
	}

	private static var delims = ["s" => " ", "n" => "\n", "nn" => "\n\n",];

	static function repeatDelim(gen:Generator, args:Array<String>) {
		var symbol = args[0];
		var min = Std.parseInt(args[1]);
		var max = Std.parseInt(args[2]);
		var int = gen.random.randomInt(min, max);

		var delim = args.length > 3 ? args[3] : "s";
		delim = delims.exists(delim) ? delims.get(delim) : delim;

		var buf = new StringBuf();
		for (i in 0...int) {
			if (i > 0) buf.add(delim);
			buf.add(gen.run('#${symbol}#'));
		}
		return buf.toString();
	}

	static function random(gen:Generator, args:Array<String>) {
		var min = Std.parseInt(args[0]);
		var max = Std.parseInt(args[1]);
		var int = gen.random.randomInt(min, max);
		return Std.string(int);
	}

	static function mapFunc(gen:Generator, args:Array<String>) {
		var symbol = gen.memory[args.shift()];
		if (symbol == null) symbol = "_";

		var map = new StringMap<String>();
		for (a in args) {
			var parts = a.split("=>");
			map.set(parts[0].trim(), parts[1].trim());
		}

		if (map.exists(symbol)) return map.get(symbol);
		if (map.exists("_")) return map.get("_");
		return "";
	}

	static function switchFunc(gen:Generator, args:Array<String>) {
		var symbol = args.shift();
		var parsed = gen.memory[symbol];

		if (parsed == null) {
			parsed = "_";
		}

		var map = new StringMap<String>();
		for (a in args) {
			var parts = a.split("=>");
			map.set(parts[0].trim(), parts[1].trim());
		}

		if (map.exists(parsed)) {
			var token = map.get(parsed);
			if (gen.grammars.exists(token)) {
				return '#${token}#';
			}
			return '${token}';
		}

		if (map.exists("_")) {
			var token = map.get("_");
			if (gen.grammars.exists(token)) {
				return '#${token}#';
			}
			return '${token}';
		}

		return "";
	}

	static public function set(name:String, func:(Generator, Array<String>) -> String) {
		funcs[name] = func;
	}

	static public function get(name:String):Dynamic {
		return funcs[name];
	}
}
