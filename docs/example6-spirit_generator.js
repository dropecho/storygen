addExample('spirit generator', () => {
  function run() {
    Functions.set('map', (gen, args) => {
      var symbol = gen.memory[args.shift()];
      return args.find(x => x.startsWith(symbol)).split('=>')[1];
    });

    var grammar = {
      spirit_types: [
        'spirit', 'god', 'patron', 'soul', 'avatar', 'manifestation'
      ],
      spirit_places: [
        'mountain', 'river', 'valley', 'forest', 'ocean', 'darkness',
        'hills', 'plains', 'grasslands', 'caves', 'sky', 'clouds', 'mines',
        'lake'
      ],

      spirit_home_verbs: [
        'dwelling', 'dreaming', 'sleeping', 'waiting', 'thinking', 'pulsing'
      ],
      spirit_homes: [
        'prison', 'cocoon', 'palace', 'void', 'fortress', 'egg'
      ],

      power_source_sub_nouns: [
        'innocent', 'guilty', 'troubled', 'forgotten', 'miserly'
      ],
      power_source_nouns: [
        'blood',
        'blood of the #power_source_sub_nouns#',
        'children',
        'children of the #power_source_sub_nouns#',
        'lovers',
        'lovers of the #power_source_sub_nouns#',
        'mothers of the #power_source_sub_nouns#',
        'fathers of the #power_source_sub_nouns#',
        'murders of the #power_source_sub_nouns#',
        'thoughts of the #power_source_sub_nouns#',
        'memories of the #power_source_sub_nouns#',
        'flesh of the #power_source_sub_nouns#',
        'the air',
        'breaths of the #power_source_sub_nouns#',
        'voices',
        'voices of the #power_source_sub_nouns#',
        'souls',
        'souls of the #power_source_sub_nouns#',
        'the moon',
        'water',
        'sunlight',
      ],
      power_source_verbs: [
        'draws', 'gains', 'derives', 'pulls', 'siphons', 'obtains', 'snatches', 'steals', 'breathes in',
        'lavishes in', 'gorges on', 'drinks'
      ],
      power_sources:['#power_source_verbs# power from #power_source_nouns#'],

      body_shapes: [
        'round', 'snake-like', 'fractal', 'ooze-like', 'geometric', 'fading',
        'wolf-like', 'squid-like'
      ],
      body_parts: [
        'head', 'legs', 'arms', 'face', 'back', 'eyes', 'tail', 'ears',
        'tongue', 'fingers', 'feet', 'sides'
      ],
      body_adornments: [
        'scales', 'feathers', 'shells', 'tendrils', 'voids', 'teeth', 'spines', 'patches of fur',
      ],
      body_growth_types: [
        'cover', 'sprout from', 'grow from', 'line', 'proliferate from',
        'engulf', 'smother', 'layer'
      ],
      movement_type: ['slither', 'float', 'shuffle', 'claw', 'swoop', 'crawl', 'shift'],

      colors: [
        'golden', 'blue-black', 'violet', 'green', 'white', 'yellow',
        'black', 'purple', 'red', 'blue', 'orange', 'silver', 'bronze', 'coppery',
        'pink', 'obsidian', 'gray'

      ],
      names: [
        'ba-atu', 'sfrin', 'ado-marus', 'bar-kal', 'eswin', 'nee', 'yal', 'erfn', 'ka`dar',
        'hurn', 'chiwin', 'gotodo', 'kamishi', 'herl', 'narn', 'de-rin', 'vaasto', 'ur-dak'
      ],
      genders: ['male', 'female', 'neuter', 'none', 'both'],

      time_of_day: [
        'twilight', 'sunset', 'midnight', 'dawn', 'night', 'evening', 'dusk',
        'morning', 'noon', 'midday', 'sundown'
      ],


      body_shape_colored: ['#colors# #body_shapes# body'],

      // requires gender stored in memory
      sub_pronoun:['#map(gender, male=>he, female=>she, neuter=>they, none=>it, both=>they)#'],
      pos_pronoun:['#map(gender, male=>his, female=>her, neuter=>their, none=>its, both=>their)#'],

      possesive:['#map(gender, male=>has, female=>has, neuter=>have, none=>has, both=>have)#'],

      body_growth: [
        '#colors# #body_adornments# #body_growth_types# #pos_pronoun# #body_parts#',
      ],

      type_of_speech: [
        'whispering', 'calling out', 'screaming', 'moaning', 'crying', 'whimpering'
      ],
      terror_prefix: [
        'horrors', 'loneliness', 'crushing weight', 'darkness',
        'hatred', 'torment', 'dread', 'awfulness', 'disquiet'
      ],
      terror_suffix:[
        'the universe', 'existence', 'death', 'life', 'sound', 'emotion', 'knowledge'
      ],
      terrors: ['the #terror_prefix# of #terror_suffix#'],

      origin: [`#[gender:genders]# #[name:names.capitalize]# #[spirit:spirit_types]# #[place:spirit_places]#
#name# is the #spirit# of the #place#, and #power_sources#, while #spirit_home_verbs# in #pos_pronoun# #colors# #spirit_homes#.
#sub_pronoun.capitalize# #possesive# a #body_shape_colored#, and #body_growth#. 
Found every #random(2,1000)# days #movement_type#ing through the #place#, #type_of_speech# about #terrors#.`],
    };

      // Every #random(1,20)# days, #sub_pronoun# can be found #movement_type#ing through the #place# at #time_of_day#,
      // #type_of_speech# about #terrors#.
    var gen = new Generator(grammar);
    var output = gen.runAdvanced('#origin#');

    console.log(output);
    console.log(JSON.stringify(gen.memory));

    return output;
  }

  const output = run();
  const code = funcToString(run);

  return {
    text: output.output.trim(),
    output,
    code
  };
});
