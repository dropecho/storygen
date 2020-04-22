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

    Assert.isNull(token.memSymbol);
  }

  @Test function should_store_symbol_when_valid() {
    var token = new Token("#test#");

    Assert.areEqual("test", token.symbol);
  }

  @Test function should_not_store_symbol_when_invalid() {
    var token = new Token("test");

    Assert.isNull(token.symbol);
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

  @Test function should_be_marked_as_function_when_wrapped_in_parens() {
    var token = new Token("#random(5, 10)#");

    Assert.isTrue(token.isFunction);
    Assert.areEqual("random", token.symbol);
    Assert.areEqual("5", token.functionArgs[0]);
    Assert.areEqual("10", token.functionArgs[1]);
  }

  @Test function should_be_marked_as_function_with_no_params() {
    var token = new Token("#random()#");

    Assert.isTrue(token.isFunction);
    Assert.areEqual("random", token.symbol);
    Assert.areEqual(0, token.functionArgs.length);
  }


  @Test function should_not_be_marked_as_function_when_no_parens() {
    var token = new Token("#random#");

    Assert.isFalse(token.isFunction);
    Assert.areEqual("random", token.symbol);
    Assert.areEqual(0, token.functionArgs.length);
  }

  @Test function should_be_marked_as_silent_when_wrapped_with_brackets() {
		var token = new Token("[#test#]");

		Assert.isTrue(token.isValid);
		Assert.isTrue(token.isSilent);
		Assert.areEqual("test", token.symbol);
  }

  @Test function should_not_be_marked_as_silent_when_no_square_brackets() {
		var token = new Token("#test#");

		Assert.isFalse(token.isSilent);
		Assert.areEqual("test", token.symbol);
  }

  @Test function silent_memory_function_with_transforms() {
    var token = new Token("[#t:test(5).capitalize.a#]");

		Assert.isTrue(token.isSilent);
		Assert.isTrue(token.isFunction);
		Assert.isTrue(token.isMemorized);
		Assert.isTrue(token.isTransformed);
		Assert.areEqual("test", token.symbol);
		Assert.areEqual("t", token.memSymbol);
		Assert.areEqual("5", token.functionArgs[0]);
		Assert.areEqual("capitalize", token.transforms[0]);
		Assert.areEqual("a", token.transforms[1]);
  }
}
