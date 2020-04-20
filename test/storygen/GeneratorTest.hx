package storygen;

import massive.munit.Assert;
import dropecho.storygen.*;
import dropecho.storygen.Generator.GeneratorConfig;

class GeneratorTest {
	var generator:Generator;

	@Before
	public function setup() {
		var config = {
			grammars: [
				"test" => ['a'],
				"bar" => ['#test# bar'],
				"foo" => ['#bar#'],
				"baz" => ['#bar# #bar#']
			]
		};
		generator = new Generator(config);
	}

	@Test
	public function canInstantiate() {
		Assert.isNotNull(generator);
	}

	@Test
	public function run() {
		var out = generator.run("test", "#test#");
		var expected = "a";

		Assert.areEqual(expected, out);
	}

	@Test
	public function recurse() {
		var out = generator.run("test", "#bar#");
		var expected = "a bar";

		Assert.areEqual(expected, out);
	}

	@Test
	public function recurse2Levels() {
		var out = generator.run("test", "#foo#");
		var expected = "a bar";

		Assert.areEqual(expected, out);
	}

	@Test
	public function recurse3Levels() {
		var out = generator.run("test", "#baz#");
		var expected = "a bar a bar";

		Assert.areEqual(expected, out);
	}

	@Test
	public function memory() {
		var config:GeneratorConfig = {
			grammars: [
				"sentence" => ["#n:name# #n:name# #n:name# #n#"],
				"name" => ["Arjun", "Yuuma", "Darcy", "Mia", "Chiaki", "Izzi", "Azra", "Lina"]
			]
		};

		generator = new Generator(config);
		var generated = generator.run("test", "#sentence#");
		var name = generated.split(" ")[0];
		var expected = name + " " + name + " " + name + " " + name;

		Assert.areEqual(expected, generated);
	}

	@Test
	public function memory_with_transforms() {
		var config:GeneratorConfig = {
			grammars: [
				"sentence" => ["#n:name.capitalize# #n:name.capitalize# #n:name.capitalize# #n#"],
				"name" => ["Arjun", "Yuuma", "Darcy", "Mia", "Chiaki", "Izzi", "Azra", "Lina"]
			]
		};

		generator = new Generator(config);
		var generated = generator.run("test", "#sentence#");
		var name = generated.split(" ")[0];
		var expected = name + " " + name + " " + name + " " + name;

		Assert.areEqual(expected, generated);
	}

	@Test public function transforms() {
		var config:GeneratorConfig = {
			grammars: ["name" => ["bird"]]
		};

		generator = new Generator(config);
		var generated = generator.run("test", "#name.a#");
		var expected = "a bird";

		Assert.areEqual(expected, generated);
	}

	@Test public function multiple_transforms() {
		var config:GeneratorConfig = {
			grammars: ["name" => ["bird"]]
		};

		generator = new Generator(config);
		var generated = generator.run("test", "#name.capitalize.a#");
		var expected = "a Bird";

		Assert.areEqual(expected, generated);
	}

	@Test public function multiple_transforms_other_order() {
		var config:GeneratorConfig = {
			grammars: ["name" => ["bird"]]
		};

		generator = new Generator(config);
		var generated = generator.run("test", "#name.a.capitalize#");
		var expected = "A bird";

		Assert.areEqual(expected, generated);
	}

	@Test public function multiple_transforms_other_transform() {
		var config:GeneratorConfig = {
			grammars: ["name" => ["bird"]]
		};

		generator = new Generator(config);
		var generated = generator.run("test", "#name.capitalize.a.capitalize#");
		var expected = "A Bird";

		Assert.areEqual(expected, generated);
	}

	// @Test
	// public function transform() {
	//   var config = {
	//     grammars: ["sentence" => ["#name.capitalize#"], "name" => ["lina"]]
	//   };
	//
	//   generator = new Generator(config);
	//   var generated = generator.run("test", "#sentence#");
	//   var expected = "Lina";
	//
	//   Assert.areEqual(expected, generated);
	// }
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
		public function jsonParse() {
			var json = '
		  {
			"sentence": ["a", "b", "c"]
		  }
		';

			var config = Generator.configFromJson(json);
			var gen = new Generator(config);
			var out = gen.run("test", "#sentence#");

			trace("json", out);
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
