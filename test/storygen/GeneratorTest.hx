package storygen;

import massive.munit.Assert;
import dropecho.storygen.*;

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
		var out = generator.run("test");
		var expected = "a";

		Assert.areEqual(expected, out);
	}

	@Test
	public function recurse() {
		var out = generator.run("bar");
		var expected = "a bar";

		Assert.areEqual(expected, out);
	}

	@Test
	public function recurse2Levels() {
		var out = generator.run("foo");
		var expected = "a bar";

		Assert.areEqual(expected, out);
	}

	@Test
	public function recurse3Levels() {
		var out = generator.run("baz");
		var expected = "a bar a bar";

		Assert.areEqual(expected, out);
	}

	@Test
	public function memory() {
		var config = {
			grammars: [
				"sentence" => ["He is called #n:name#.  #n:name# loved bananas."],
				"name" => ["Arjun", "Yuuma", "Darcy", "Mia", "Chiaki", "Izzi", "Azra", "Lina"]
			]
		};

		generator = new Generator(config);
		var generated = generator.run("sentence");

		trace("TEST", generated);
	}

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
		var generated = generator.run("sentence");

		trace("TEST", generated);
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
		var out = gen.run("sentence");

		trace("json", out);
	}

	@Test
	public function guildGenerator() {
		var config = {
			grammars: [
				"origin" => ["
          The #guild:name# is a guild. 
          They have #number# members.
          The #guild:name# is run by a dude.
          "
				],
				"name" => ["#color# #tool#"],
				"tool" => ["hammer", "anvil", "pot", "clay"],
				"color" => ["white", "grey", "blue", "green"],
				"number" => ["1", "100", "25"],
			]
		};

		generator = new Generator(config);
		var generated = generator.run("origin");

		trace("GUILD:", generated);
	}
}
