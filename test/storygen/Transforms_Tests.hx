package storygen;

import utest.Assert;
import dropecho.storygen.*;

class Transforms_Tests extends utest.Test {
	public function test_capitalize() {
		var s = "hi";
		var expected = "Hi";

		var out = Transforms.get("capitalize")(s);
		Assert.equals(expected, out);
	}

	public function test_titlize() {
		var s = "lord banana of lemonville";
		var expected = "Lord Banana Of Lemonville";

		var out = Transforms.get("titlize")(s);
		Assert.equals(expected, out);
	}

	public function test_a_const() {
		var s = "bird";
		var expected = "a bird";

		var out = Transforms.get('a')(s);
		Assert.equals(expected, out);
	}

	public function test_a_const_by_name() {
		var s = "bird";
		var expected = "a bird";

		var out = Transforms.get("a")(s);
		Assert.equals(expected, out);
	}

	public function test_a_vowel() {
		var s = "owl";
		var expected = "an owl";

		var out = Transforms.get('a')(s);
		Assert.equals(expected, out);
	}

	public function test_pluralize() {
		Assert.equals("owls", Transforms.get('pluralize')("owl"));
		Assert.equals("birds", Transforms.get('pluralize')("bird"));
		Assert.equals("batches", Transforms.get('pluralize')("batch"));
		Assert.equals("glories", Transforms.get('pluralize')("glory"));
	}
}
