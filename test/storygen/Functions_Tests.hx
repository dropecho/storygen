package storygen;

import dropecho.storygen.Generator.WordList;
import dropecho.storygen.*;
import utest.Assert;

class Functions_Tests extends utest.Test {
	var generator:Generator;

	public function setup() {
		var config = ["test" => (['a'] : WordList), "test2" => (['b'] : WordList)];
		generator = new Generator(config);
	}

	public function test_repeat() {
		var repeat = Functions.get("repeat");
		Assert.notNull(repeat);

		var out = repeat(generator, ["test2", "4", "4"]);
		Assert.equals("b b b b", out);
	}

	public function test_random() {
		var random = Functions.get("random");
		Assert.notNull(random);

		var out = random(generator, ["1", "1"]);
		Assert.equals("1", out);
	}

	public function test_switch_test() {
		generator.memory.set("bar", "test2");
		var sw = Functions.get("switch");
		Assert.notNull(sw);

		var out = sw(generator, ["bar", "test=>test", "test2=>test2"]);
		Assert.equals("#test2#", out);
	}

	public function test_switch_to_null() {
		generator.memory.set("bar", "test2");
		var sw = Functions.get("switch");
		Assert.notNull(sw);

		var out = sw(generator, ["bar", "test=>test"]);
		Assert.equals("", out);
	}

	public function test_switch_test_default() {
		generator.memory.set("bar", "test2");
		var sw = Functions.get("switch");
		Assert.notNull(sw);

		var out = sw(generator, ["bar", "test=>test", "_=>default"]);
		Assert.equals("default", out);
	}
}
