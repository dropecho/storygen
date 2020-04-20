package storygen;

import massive.munit.Assert;
import dropecho.storygen.*;

class TokenTest {
	@Test
	public function canInstantiate() {
		Assert.isNotNull(new Token("hi"));
	}

	@Test
	public function tokenValidationPositive() {
		var token = new Token("#test#");

		Assert.isTrue(token.isValid);
	}

	@Test
	public function tokenValidationNegative() {
		var token = new Token("test");

		Assert.isFalse(token.isValid);
	}

	@Test
	public function should_be_memorized_when_has_colon() {
		var token = new Token("#t:test#");

		Assert.isTrue(token.isValid);
		Assert.isTrue(token.isMemorized);
	}

	@Test
	public function should_not_be_memorized_when_no_colon_present() {
		var token = new Token("#test#");

		Assert.isTrue(token.isValid);
		Assert.isFalse(token.isMemorized);
	}

	@Test
	public function should_store_key_for_memory_when_has_colon() {
		var token = new Token("#t:test#");

		Assert.areEqual("t", token.memSymbol);
	}

	@Test
	public function should_not_store_key_for_memory_when_has_no_colon() {
		var token = new Token("#test#");

		Assert.areEqual(null, token.memSymbol);
	}

	@Test function should_store_symbol_when_valid() {
		var token = new Token("#test#");

		Assert.areEqual("test", token.symbol);
	}

	@Test function should_not_store_symbol_when_invalid() {
		var token = new Token("test");

		Assert.areEqual(null, token.symbol);
	}

	@Test function should_be_transformed_when_period_present() {
		var token = new Token("#test.cap#");

		Assert.isTrue(token.isTransformed);
	}

	@Test function should_not_be_transformed_when_no_period_present() {
		var token = new Token("#test#");

		Assert.isFalse(token.isTransformed);
	}

	@Test function should_parse_transforms_into_list_when_present() {
		var token = new Token("#test.cap#");

		Assert.isTrue(token.transforms.length > 0);
		Assert.areEqual("cap", token.transforms[0]);
  }

	@Test function should_have_empty_transforms_list_when_not_present() {
		var token = new Token("#test#");

		Assert.isFalse(token.transforms.length > 0);
  }
}
