package storygen;

import dropecho.storygen.*;
import utest.Assert;

class Token_Tests extends utest.Test {
	public function test_canInstantiate() {
		Assert.notNull(new Token("hi"));
	}

	public function test_tokenValidationPositive() {
		var token = new Token("#test#");

		Assert.isTrue(token.isExpandable);
	}

	public function test_tokenValidationNegative() {
		var token = new Token("test");

		Assert.isFalse(token.isExpandable);
	}

	public function test_should_be_memorized_when_has_colon() {
		var token = new Token("#t:test#");

		Assert.isTrue(token.isExpandable);
		Assert.isTrue(token.isMemorized);
	}

	public function test_should_not_be_memorized_when_no_colon_present() {
		var token = new Token("#test#");

		Assert.isTrue(token.isExpandable);
		Assert.isFalse(token.isMemorized);
	}

	public function test_should_store_key_for_memory_when_has_colon() {
		var token = new Token("#t:test#");

		Assert.equals("t", token.memSymbol);
	}

	public function test_should_not_store_key_for_memory_when_has_no_colon() {
		var token = new Token("#test#");

		Assert.isNull(token.memSymbol);
	}

	function test_should_store_symbol_when_valid() {
		var token = new Token("#test#");

		Assert.equals("test", token.symbol);
	}

	function test_should_not_store_symbol_when_invalid() {
		var token = new Token("test");

		Assert.isNull(token.symbol);
	}

	function test_should_be_transformed_when_period_present() {
		var token = new Token("#test.cap#");

		Assert.isTrue(token.isTransformed);
	}

	function test_should_not_be_transformed_when_no_period_present() {
		var token = new Token("#test#");

		Assert.isFalse(token.isTransformed);
	}

	function test_should_parse_transforms_into_list_when_present() {
		var token = new Token("#test.cap#");

		Assert.isTrue(token.transforms.length > 0);
		Assert.equals("cap", token.transforms[0]);
	}

	function test_should_have_empty_transforms_list_when_not_present() {
		var token = new Token("#test#");

		Assert.isFalse(token.transforms.length > 0);
	}

	function test_should_be_marked_as_function_when_wrapped_in_parens() {
		var token = new Token("#random(5, 10)#");

		Assert.isTrue(token.isFunction);
		Assert.equals("random", token.symbol);
		Assert.equals("5", token.functionArgs[0]);
		Assert.equals("10", token.functionArgs[1]);
	}

	function test_should_be_marked_as_function_with_no_params() {
		var token = new Token("#random()#");

		Assert.isTrue(token.isFunction);
		Assert.equals("random", token.symbol);
		Assert.equals(0, token.functionArgs.length);
	}

	function test_should_not_be_marked_as_function_when_no_parens() {
		var token = new Token("#random#");

		Assert.isFalse(token.isFunction);
		Assert.equals("random", token.symbol);
		Assert.equals(0, token.functionArgs.length);
	}

	function test_should_be_marked_as_silent_when_wrapped_with_brackets() {
		var token = new Token("#[test]#");

		Assert.isTrue(token.isExpandable);
		Assert.isTrue(token.isSilent);
		Assert.equals("test", token.symbol);
	}

	function test_should_not_be_marked_as_silent_when_no_square_brackets() {
		var token = new Token("#test#");

		Assert.isFalse(token.isSilent);
		Assert.equals("test", token.symbol);
	}

	function test_silent_memory_function_with_transforms() {
		var token = new Token("#[t:test(5).capitalize.a]#");

		Assert.isTrue(token.isSilent);
		Assert.isTrue(token.isFunction);
		Assert.isTrue(token.isMemorized);
		Assert.isTrue(token.isTransformed);
		Assert.equals("test", token.symbol);
		Assert.equals("t", token.memSymbol);
		Assert.equals("5", token.functionArgs[0]);
		Assert.equals("capitalize", token.transforms[0]);
		Assert.equals("a", token.transforms[1]);
	}
}
