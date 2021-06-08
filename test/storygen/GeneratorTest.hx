package storygen;

import massive.munit.Assert;
import dropecho.storygen.*;
import dropecho.storygen.Generator.GrammarType;

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

	#if js
	@Test
	public function runDynamicConfig() {
		var config:Dynamic = {test: ["a"]};
		var gen = new Generator(config);
		var out = gen.run("#test#");
		var expected = "a";

		Assert.areEqual(expected, out);
	}
	#end

	@Test
	public function run() {
		var out = generator.run("#test#");
		var expected = "a";

		Assert.areEqual(expected, out);
	}

	@Test
	public function run_merged() {
		var c = ["origin" => ["#c2_name# met #c3_name#"]];
		var c2 = ["c2_name" => ["bob"]];
		var c3 = ["c3_name" => ["sally"]];

		var gen = new Generator(c);
		gen.mergeGrammar(c2);
		gen.mergeGrammar(c3);

		var out = gen.run("#origin#");
		var expected = "bob met sally";

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
	public function memory_advanced() {
		var config = [
			"sentence" => ["#n:name# #n:name# #n# #n#"],
			"name" => ["Arjun", "Yuuma", "Darcy", "Mia", "Chiaki", "Izzi", "Azra", "Lina"]
		];

		generator = new Generator(config);
		var generated = generator.runAdvanced("#sentence#");
		var name = generated.output.split(" ")[0];
		var expected = name + " " + name + " " + name + " " + name;

		Assert.areEqual(expected, generated.output);
		Assert.areEqual(name, generated.memory["n"]);
	}

	@Test
	public function memory() {
		var config = [
			"sentence" => ["#n:name# #n:name# #n# #n#"],
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

	@Test
	public function memory_sub_token() {
		var config = ["sentence" => ["#n:name#"], "name" => ["#othername#"], "othername" => ["Arjun"]];

		generator = new Generator(config);
		var generated = generator.run("#sentence#");
		var expected = "Arjun";

		Assert.areEqual(expected, generated);
	}

	@Test
	public function memory_nested() {
		var config = [
			"sentence" => ["#[n:char]##n# #n#"],
			"char" => ["[#[on:othername]##[h:heritage]##on##h#"],
			"othername" => ["Arjun", "Fred"],
			"heritage" => ["-elf", "-dwarf"]
		];

		generator = new Generator(config);
		var generated = generator.run("#sentence#");
		var name = generated.split(" ")[0];
		var expected = name + " " + name;

		Assert.areEqual(expected, generated);
	}

	@Test
	public function memory_first_last_name() {
		var grammar = [
			"origin" => ["#n:full_name# #n# #n# #n#"],
			"full_name" => ["#first_name#-#last_name#"],
			"first_name" => ["Fred", "Sally", "Barb", "Lance", "Francine"],
			"last_name" => ["Smith", "Jones", "Barker", "White", "Snodgrass"]
		];

		generator = new Generator(grammar);
		var generated = generator.run("#origin#");
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

	@Test
	public function function_call_sw() {
		var config = [
			"origin" => ["#[char_race:race]##[char_name:name]##char#"],
			"char" => ["#char_name# the #char_race#"],
			"race" => ["elf", "dwarf"],
			"elfNames" => ["bob"],
			"dwarfNames" => ["sally"],
			"name" => ["#switch(char_race, elf=>elfNames, dwarf=>dwarfNames)#"]
		];

		generator = new Generator(config);
		var generated = generator.run("#origin#");

		Assert.isTrue(generated == "bob the elf" || generated == "sally the dwarf", generated);
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
	public function advanced_with_Seed() {
		var config = ["origin" => ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"]];

		generator = new Generator(config);
		var generated = generator.runAdvanced("#origin#");

		var seed = Std.string(generated.seed);
		var out1 = generated.output;

		var out2 = generator.runAdvanced("#origin#", seed).output;
		var out3 = generator.runAdvanced("#origin#", seed).output;
		var out4 = generator.runAdvanced("#origin#", seed).output;

		Assert.areEqual(out1, out2, "first run should be same");
		Assert.areEqual(out1, out3, "second run should be same");
		Assert.areEqual(out1, out4, "third run should be same");
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
