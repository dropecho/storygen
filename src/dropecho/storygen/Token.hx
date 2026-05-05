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

	public var isExpandable:Bool = false;
	public var isMemorized:Bool = false;
	public var isTransformed:Bool = false;
	public var isFunction:Bool = false;
	public var isSilent:Bool = false;

	private var origText:String;

	public function new(text:String) {
		origText = text;

		if (!expandableRegex.match(text)) {
			isExpandable = false;
			return;
		}
		isExpandable = true;

		var inner = expandableRegex.matched(1);

		if (silentRegex.match(inner)) {
			isSilent = true;
			inner = silentRegex.matched(1);
		}

		if (memoryRegex.match(inner)) {
			isMemorized = true;
			memSymbol = memoryRegex.matched(1);
			inner = memoryRegex.matched(2);
		}

		if (transformRegex.match(inner)) {
			isTransformed = true;
			transforms = transformRegex.matched(2).split('.');
			inner = transformRegex.matched(1);
		}

		if (functionRegex.match(inner)) {
			isFunction = true;
			functionArgs = functionRegex.matched(2)
				.split(',')
				.map(s -> s.trim())
				.filter(s -> s != null && s != '');
			inner = functionRegex.matched(1);
		}

		symbol = inner;
	}
}
