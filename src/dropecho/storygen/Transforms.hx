package dropecho.storygen;

@:expose("Transforms")
class Transforms {
	static private var userTransforms:Map<String, (String -> String)> = [];

	static public function isVowel(s:String):Bool {
		var vowels = 'aeiou';
		return vowels.indexOf(s.charAt(0)) != -1;
	}

	static public function capitalize(s:String):String {
		var chars = s.split("");
		var f = chars.shift();

		return f.toUpperCase() + chars.join("");
	}

	static public function a(s:String):String {
		return switch (isVowel(s.charAt(0))) {
			case true: 'an $s';
			case false: 'a $s';
		}
	}

	static public function pluralize(s:String):String {
		var end = switch (s.charAt(s.length - 1)) {
			case "h": "es";
			case "y":
				s = s.substr(0, s.length - 1);
				"ies";
			case _: "s";
		};

		return '$s$end';
	}

	static public function get(name:String):String->String {
		if (userTransforms.exists(name)) {
			return userTransforms.get(name);
		}
		return Reflect.field(Transforms, name);
	}

	static public function set(name:String, trans:String->String) {
		userTransforms.set(name, trans);
	}
}
