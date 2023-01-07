package storygen;

import massive.munit.Assert;
import dropecho.storygen.*;

class TransformsTest {
	@Test
	public function capitalize() {
		var s = "hi";
		var expected = "Hi";

		var out = Transforms.get("capitalize")(s);
		Assert.areEqual(expected, out);
	}

	@Test
	public function titlize() {
		var s = "lord banana of lemonville";
		var expected = "Lord Banana Of Lemonville";

		var out = Transforms.get("titlize")(s);
		Assert.areEqual(expected, out);
	}

	@Test
	public function a_const() {
		var s = "bird";
		var expected = "a bird";

		var out = Transforms.get('a')(s);
		Assert.areEqual(expected, out);
	}

	@Test
	public function a_const_by_name() {
		var s = "bird";
		var expected = "a bird";

		var out = Transforms.get("a")(s);
		Assert.areEqual(expected, out);
	}

	@Test
	public function a_vowel() {
		var s = "owl";
		var expected = "an owl";

		var out = Transforms.get('a')(s);
		Assert.areEqual(expected, out);
	}

	@Test
	public function pluralize() {
		Assert.areEqual("owls", Transforms.get('pluralize')("owl"));
		Assert.areEqual("birds", Transforms.get('pluralize')("bird"));
		Assert.areEqual("batches", Transforms.get('pluralize')("batch"));
		Assert.areEqual("glories", Transforms.get('pluralize')("glory"));
	}
}
