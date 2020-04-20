package dropecho.storygen;

class Transforms {
	static public function capitalize(s:String):String {
		var chars = s.split("");
		var f = chars.shift();

		return f.toUpperCase() + chars.join("");
	}

	static public function a(s:String):String {
		var vowels = 'aeiou';
		if (vowels.indexOf(s.charAt(0)) != -1) {
			return 'an $s';
		}

		return 'a $s';
	}
}
