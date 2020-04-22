package dropecho.storygen;

class Functions {
	static private var funcs:Map<String, Dynamic> = [
		"random" => (gen:Generator, args:Array<String>) -> {
			var min = Std.parseInt(args[0]);
			var max = Std.parseInt(args[1]);
			var int = gen.random.randomInt(min, max);
			return Std.string(int);
		}
	];

	static public function set(name:String, func:(Generator, Array<String>) -> String) {
		funcs[name] = func;
	}

	static public function get(name:String):Dynamic {
		return funcs[name];
	}
}
