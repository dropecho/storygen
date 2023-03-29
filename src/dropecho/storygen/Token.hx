package dropecho.storygen;

using StringTools;

class Token {
	private var expandableRegex:EReg = ~/#(.*?)#/;
	private var silentRegex:EReg = ~/\[(.*?)\]/;
	private var memoryRegex:EReg = ~/(.*):(.*)/;
	private var transformRegex:EReg = ~/(.*?)\.(.*)/;
	private var functionRegex:EReg = ~/(.*)\((.*)\)/;

	public var symbol:String;
	public var memSymbol:String;
	public var functionArgs:Array<String> = new Array<String>();
	public var transforms:Array<String> = new Array<String>();

	public var isExpandable:Bool;
	public var isMemorized:Bool;
	public var isTransformed:Bool;
	public var isFunction:Bool;
	public var isSilent:Bool;

	private var origText:String;

	public function new(text:String) {
		origText = text;

		if (!checkExpandable(text)) {
			return;
		}

		symbol = expandableRegex.matched(1);

		if (checkSilent(symbol)) {
			symbol = silentRegex.matched(1);
		}

		if (checkMemorized(symbol)) {
			memSymbol = memoryRegex.matched(1);
			symbol = memoryRegex.matched(2);
		}

		if (checkTransformed(symbol)) {
			symbol = transformRegex.matched(1);
			transforms = transformRegex
				.matched(2)
				.split('.');
		}

		if (checkFunction(symbol)) {
			symbol = functionRegex.matched(1);
			functionArgs = functionRegex
				.matched(2)
				.split(',')
				.map(s -> s.trim())
				.filter(s -> s != null && s != '');
		}
	}

	private function checkExpandable(text:String) {
		return isExpandable = expandableRegex.match(text);
	}

	private function checkSilent(text:String) {
		return isSilent = silentRegex.match(text);
	}

	private function checkMemorized(text:String) {
		return isMemorized = memoryRegex.match(text);
	}

	private function checkTransformed(text:String) {
		return isTransformed = transformRegex.match(text);
	}

	private function checkFunction(text:String) {
		return isFunction = functionRegex.match(text);
	}
}
