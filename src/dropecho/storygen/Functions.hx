package dropecho.storygen;

@:expose("Functions")
class Functions {
	static private var funcs:Map<String, Dynamic> = [
		"random" => (gen:Generator, args:Array<String>) -> {
			var min = Std.parseInt(args[0]);
			var max = Std.parseInt(args[1]);
			var int = gen.random.randomInt(min, max);
			return Std.string(int);
		},
		"pick" => (gen:Generator, args:Array<String>) -> {
			var pick = args[gen.random.randomInt(0, args.length - 1)];
			return "#" + pick + "#";
		},
		"switch" => (gen:Generator, args:Array<String>) -> {
			var symbol = args.shift();
			var parsed = gen.memory[symbol];
			if (parsed != null) {
				for (a in args) {
					var split = a.split("=>");
					if (split[0] == parsed) {
						return "#" + split[1] + "#";
					}
				}
			}
			return "";
		}
	];

	static public function set(name:String, func:(Generator, Array<String>) -> String) {
		funcs[name] = func;
	}

	static public function get(name:String):Dynamic {
		return funcs[name];
	}
}
