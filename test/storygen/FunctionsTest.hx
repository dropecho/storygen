package storygen;

import dropecho.storygen.Generator.WordList;
import massive.munit.Assert;
import dropecho.storygen.*;

class FunctionsTest {
	var generator:Generator;

	@Before
	public function setup() {
		var config = ["test" => (['a'] : WordList), "test2" => (['b'] : WordList)];
		generator = new Generator(config);
	}

	@Test
	public function repeat() {
		var repeat = Functions.get("repeat");
		Assert.isNotNull(random);

		var out = repeat(generator, ["test2", "4", "4"]);
		Assert.areEqual("b b b b", out);
	}

	@Test
	public function random() {
		var random = Functions.get("random");
		Assert.isNotNull(random);

		var out = random(generator, ["1", "1"]);
		Assert.areEqual("1", out);
	}

	@Test
	public function switch_test() {
		generator.memory.set("bar", "test2");
		var sw = Functions.get("switch");
		Assert.isNotNull(sw);

		var out = sw(generator, ["bar", "test=>test", "test2=>test2"]);
		Assert.areEqual("#test2#", out);
	}

	@Test
	public function swit_to_null() {
		generator.memory.set("bar", "test2");
		var sw = Functions.get("switch");
		Assert.isNotNull(sw);

		var out = sw(generator, ["bar", "test=>test"]);
		Assert.areEqual("", out);
	}

	@Test
	public function switch_test_default() {
		generator.memory.set("bar", "test2");
		var sw = Functions.get("switch");
		Assert.isNotNull(sw);

		var out = sw(generator, ["bar", "test=>test", "_=>default"]);
		Assert.areEqual("default", out);
	}
}
