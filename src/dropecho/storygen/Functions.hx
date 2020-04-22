package dropecho.storygen;

class Functions {
	static public function random(gen:Generator, min:String, max:String):String {
		var int = gen.random.randomInt(Std.parseInt(min), Std.parseInt(max));
		return Std.string(int);
	}

	static public function test(gen:Generator):String {
		return "test";
	}
}
