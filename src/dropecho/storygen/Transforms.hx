package dropecho.storygen;

@:expose("Transforms")
class Transforms {
	static private var transforms:Map<String, (String -> String)> = [
		"toUpperCase" => (s:String) -> s.toUpperCase(),
		"toLowerCase" => (s:String) -> s.toLowerCase(),
		"capitalize" => capitalize,
		"pluralize" => pluralize,
		"titlize" => titlize,
		"a" => a,
	];

	static function isVowel(s:String):Bool {
		var vowels = 'aeiouAEIOU';
		return vowels.indexOf(s.charAt(0)) != -1;
	}

	static function capitalize(s:String):String {
		var chars = s.split("");
		var f = chars.shift();

		return f.toUpperCase() + chars.join("");
	}

	static function titlize(s:String):String {
		var words = s.split(" ");
		for (i in 0...words.length) {
			words[i] = capitalize(words[i]);
		}

		return words.join(" ");
	}

	static function a(s:String):String {
		return switch (isVowel(s.charAt(0))) {
			case true: 'an $s';
			case false: 'a $s';
		}
	}

	static function pluralize(s:String):String {
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
		if (transforms.exists(name)) {
			return transforms.get(name);
		}

		throw 'There is no transform named "${name}", please ensure you registered it.';
	}

	static public function set(name:String, trans:String->String) {
		transforms.set(name, trans);
	}
}
