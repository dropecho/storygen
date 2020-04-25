package storygen;

import massive.munit.Assert;
import dropecho.storygen.*;

class FunctionsTest {
	var generator:Generator;

	@Before
	public function setup() {
		var config = ["test" => ['a'], "test2" => ['b']];
		generator = new Generator(config);
	}

	@Test
	public function random() {
		var random = Functions.get("random");
		Assert.isNotNull(random);

		var out = random(generator, ["1", "1"]);
		Assert.areEqual("1", out);
	}

	@Test
	public function pick() {
		var pick = Functions.get("pick");
		Assert.isNotNull(pick);

		var out = pick(generator, ["test", "test"]);
		Assert.areEqual("#test#", out);
	}

	@Test
	public function swit() {
		generator.memory.set("bar", "test2");
		var sw = Functions.get("switch");
		Assert.isNotNull(sw);

		var out = sw(generator, ["bar", "test=>test", "test2=>test2"]);
		Assert.areEqual("#test2#", out);
	}
}
