package storygen;

import massive.munit.Assert;
import dropecho.storygen.*;

class TransformsTest {
	@Test
	public function capitalize() {
		var s = "hi";
		var expected = "Hi";

		var out = Transforms.capitalize(s);
		Assert.areEqual(expected, out);
	}

	@Test
	public function a_const() {
		var s = "bird";
		var expected = "a bird";

		var out = Transforms.a(s);
		Assert.areEqual(expected, out);
	}

	@Test
	public function a_vowel() {
		var s = "owl";
		var expected = "an owl";

		var out = Transforms.a(s);
		Assert.areEqual(expected, out);
	}
}
