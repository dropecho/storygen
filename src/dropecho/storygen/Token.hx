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
  public var isSilent:Bool;

	private var origText:String;
	// private var isValidToken:EReg = ~/#([^#]*)#/;
  private var isValidToken:EReg = ~/#(.*?)#|\[#(.*?)#\]/;
	private var shouldBeMemorized:EReg = ~/(.*):(.*)/;
	private var shouldBeTransformed:EReg = ~/(.*?)\.(.*)/;
	private var isFunctionCall:EReg = ~/(.*)\((.*)\)/;

	public function new(text:String) {
		origText = text;
		isValid = isValidToken.match(text);

		if (isValid) {
			var token = isValidToken.matched(1);
      if(token == null || token == "") {
        token = isValidToken.matched(2);
        isSilent = true;
      }

			if (isMemorized = shouldBeMemorized.match(token)) {
				memSymbol = shouldBeMemorized.matched(1);
				token = shouldBeMemorized.matched(2);
			// } else {
			//   token = isValidToken.matched(1);
			}

			if (isTransformed = shouldBeTransformed.match(token)) {
				token = shouldBeTransformed.matched(1);
				transforms = shouldBeTransformed.matched(2).split('.');
			}

			if (isFunction = isFunctionCall.match(token)) {
				token = isFunctionCall.matched(1);
				functionArgs = isFunctionCall.matched(2)
          .split(',')
          .map(s -> s.trim())
          .filter(s -> s != null && s != '');
			}

			symbol = token;
		}
	}
}
