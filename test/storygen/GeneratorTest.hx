package storygen;

import massive.munit.Assert;
import dropecho.storygen.*;

class GeneratorTest {
	var generator:Generator;

	@Before
	public function setup() {
		var config = [
			"test" => ['a'],
			"bar" => ['#test# bar'],
			"foo" => ['#bar#'],
			"baz" => ['#bar# #bar#']
		];
		generator = new Generator(config);
	}

	@Test
	public function canInstantiate() {
		Assert.isNotNull(generator);
	}

	@Test
	public function runDynamicConfig() {
		var config:Dynamic = {test: ["a"]};
		var gen = new Generator(config);
		var out = gen.run("#test#");
		var expected = "a";

		Assert.areEqual(expected, out);
	}

	@Test
	public function run() {
		var out = generator.run("#test#");
		var expected = "a";

		Assert.areEqual(expected, out);
	}

	@Test
	public function recurse() {
		var out = generator.run("#bar#");
		var expected = "a bar";

		Assert.areEqual(expected, out);
	}

	@Test
	public function recurse2Levels() {
		var out = generator.run("#foo#");
		var expected = "a bar";

		Assert.areEqual(expected, out);
	}

	@Test
	public function recurse3Levels() {
		var out = generator.run("#baz#");
		var expected = "a bar a bar";

		Assert.areEqual(expected, out);
	}

	@Test
	public function memory() {
		var config = [
			"sentence" => ["#n:name# #n:name# #n:name# #n#"],
			"name" => ["Arjun", "Yuuma", "Darcy", "Mia", "Chiaki", "Izzi", "Azra", "Lina"]
		];

		generator = new Generator(config);
		var generated = generator.run("#sentence#");
		var name = generated.split(" ")[0];
		var expected = name + " " + name + " " + name + " " + name;

		Assert.areEqual(expected, generated);
	}

	@Test
	public function memory_with_silent_action() {
		var config = [
			"sentence" => ["#[n:name]##n# #n#"],
			"name" => ["Arjun", "Yuuma", "Darcy", "Mia", "Chiaki", "Izzi", "Azra", "Lina"]
		];

		generator = new Generator(config);
		var generated = generator.run("#sentence#");
		var name = generated.split(" ")[0];
		var expected = name + " " + name;

		Assert.areEqual(expected, generated);
	}

	@Test
	public function memory_with_multiple_silent_action() {
		var config = [
			"sentence" => ["#[n:name]# #[b:name]# #n# #n# #b# #b#"],
			"name" => ["Arjun", "Yuuma", "Darcy", "Mia", "Chiaki", "Izzi", "Azra", "Lina"]
		];

		generator = new Generator(config);
		var generated = generator.run("#sentence#");
    var split = generated.split(" ");

    Assert.areEqual(split[0], split[1]);
    Assert.areEqual(split[2], split[3]);
	}

	@Test
	public function memory_with_transforms() {
		var config = [
			"sentence" => ["#n:name.capitalize# #n:name.capitalize# #n:name.capitalize# #n#"],
			"name" => ["Arjun", "Yuuma", "Darcy", "Mia", "Chiaki", "Izzi", "Azra", "Lina"]
		];

		generator = new Generator(config);
		var generated = generator.run("#sentence#");
		var name = generated.split(" ")[0];
		var expected = name + " " + name + " " + name + " " + name;

		Assert.areEqual(expected, generated);
	}

	@Test public function transforms() {
		var config = ["name" => ["bird"]];

		generator = new Generator(config);
		var generated = generator.run("#name.a#");
		var expected = "a bird";

		Assert.areEqual(expected, generated);
	}

	@Test public function multiple_transforms() {
		var config = ["name" => ["bird"]];

		generator = new Generator(config);
		var generated = generator.run("#name.capitalize.a#");
		var expected = "a Bird";

		Assert.areEqual(expected, generated);
	}

	@Test public function multiple_transforms_other_order() {
		var config = ["name" => ["bird"]];

		generator = new Generator(config);
		var generated = generator.run("#name.a.capitalize#");
		var expected = "A bird";

		Assert.areEqual(expected, generated);
	}

	@Test public function multiple_transforms_other_transform() {
		var config = ["name" => ["bird"]];

		generator = new Generator(config);
		var generated = generator.run("#name.capitalize.a.capitalize#");
		var expected = "A Bird";

		Assert.areEqual(expected, generated);
	}

	@Test public function function_call() {
		var config = ["rand" => ["#random( 0, 0)#"]];

		generator = new Generator(config);
		var generated = generator.run("#rand#");
		var expected = "0";

		Assert.areEqual(expected, generated);
	}

	@Test public function basically_everything() {
		Functions.set("test", (gen:Generator, args:Array<String>) -> {
			return "test";
		});
		var config = ["test" => ["#[t:test().capitalize.a]##t#"]];

		generator = new Generator(config);
		var generated = generator.run("#test#");
		var expected = "a Test";

		Assert.areEqual(expected, generated);
	}

	@Test
	public function jsonParse() {
		var json = '
      {
      "sentence": ["a"]
      }
    ';

		var config = Generator.configFromJson(json);
		var gen = new Generator(config);
		var out = gen.run("#sentence#");

		Assert.areEqual("a", out);
	}

	@Test
	public function transform() {
		var config = ["sentence" => ["#name.capitalize#"], "name" => ["lina"]];

		generator = new Generator(config);
		var generated = generator.run("#sentence#");
		var expected = "Lina";

		Assert.areEqual(expected, generated);
	}

	@Test
	public function advanced() {
		var config = ["sentence" => ["#name:name.capitalize#"], "name" => ["lina"]];

		generator = new Generator(config);
		var generated = generator.runAdvanced("#sentence#");
		var expected = "Lina";

		Assert.areEqual(expected, generated.output);
	}

	@Test
  @Ignore
	public function missing_symbol_exception() {
		var config = ["origin" => ["#someFunc()"]];

		generator = new Generator(config);
		try {
			generator.run("other");
		} catch (e:Any) {
			trace(e);
		}
	}

	@Test
  @Ignore
	public function missing_choices_exception() {
		var config = ["origin" => []];

		generator = new Generator(config);
		try {
			generator.run("origin");
		} catch (e:Any) {
			trace(e);
		}
	}

	@Test
  @Ignore
	public function missing_function_exception() {
		var config = ["origin" => ["#myFunc()#"]];

		generator = new Generator(config);
		try {
			generator.run("origin");
		} catch (e:Any) {
			trace(e);
		}
	}

	@Test
  @Ignore
	public function missing_transform_exception() {
		var config = ["origin" => ["#foo.bar#"], "foo" => ["hi"]];

		generator = new Generator(config);
		try {
			generator.run("origin");
		} catch (e:Any) {
			trace(e);
		}
	}
	/*
		@Test
		public function moreComplicatedGrammar() {
			var config = {
				grammars: [
					"sentence" => ["The #color# #animal# of the #natureNoun# is called #name#"],
					"color" => ["orange", "blue", "white", "black", "grey", "purple", "indigo", "turquoise"],
					"animal" => [
						"unicorn", "raven", "sparrow", "scorpion", "coyote", "eagle", "owl", "lizard", "zebra", "duck", "kitten"
					],
					"natureNoun" => ["ocean", "mountain", "forest", "cloud", "river", "tree", "sky", "sea", "desert"],
					"name" => ["Arjun", "Yuuma", "Darcy", "Mia", "Chiaki", "Izzi", "Azra", "Lina"]
				]
			};

			generator = new Generator(config);
			var out = generator.run("test", "#sentence#");

			trace("TEST", out);
		}

		@Test
		public function guildGenerator() {
			var config = {
				grammars: [
					"origin" => [
						"
			  #guild:name#

			  The #guild# is a guild.
			  They have #number# members.
			  The #guild# is run by a dude.
			  The #guild# is run by a dude.
			  The #guild# is run by a dude.
			  The #guild# is run by a dude.
			  "
					],
					"name" => ["#color# #tool#"],
					"tool" => ["hammer", "anvil", "pot", "clay"],
					"color" => ["white", "grey", "blue", "green"],
					"number" => ["1", "100", "25"],
				]
			};

			generator = new Generator(config);
			var generated = generator.run("guild_1", "#origin#");

			trace("GUILD:", generated);
		}
	 */
}
