package dropecho.storygen;

using StringTools;

class Token {
	public var willWriteToMemory:Bool;
	public var silent:Bool;
	public var symbol:String;
	public var memSymbol:String;
	public var functionArgs:Array<String> = new Array<String>();
	public var transforms:Array<String> = new Array<String>();

	public var isValid:Bool;
	public var isMemorized:Bool;
	public var isTransformed:Bool;
	public var isFunction:Bool;

	private var origText:String;
	private var isValidToken:EReg = ~/#([^#]*)#/;
	private var shouldBeMemorized:EReg = ~/(.*):(.*)/;
	private var shouldBeTransformed:EReg = ~/(.*?)\.(.*)/;
	private var isFunctionCall:EReg = ~/\((.*)\)/;

	public function new(text:String) {
		origText = text;
		isValid = isValidToken.match(text);

		if (isValid) {
			var token = isValidToken.matched(1);

			if (isMemorized = shouldBeMemorized.match(token)) {
				memSymbol = shouldBeMemorized.matched(1);
				token = shouldBeMemorized.matched(2);
			} else {
				token = isValidToken.matched(1);
			}

			if (isTransformed = shouldBeTransformed.match(token)) {
				token = shouldBeTransformed.matched(1);
				transforms = shouldBeTransformed.matched(2).split('.');
			}

			if (isFunction = isFunctionCall.match(token)) {
				var args = isFunctionCall.matched(1).split(',');
				token = args.shift();
				functionArgs = args.map(s -> s.trim());
			}

			symbol = token;
		}
	}
}
