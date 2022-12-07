(function ($hx_exports, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
class EReg {
	constructor(r,opt) {
		this.r = new RegExp(r,opt.split("u").join(""));
	}
}
EReg.__name__ = true;
class HxOverrides {
	static cca(s,index) {
		let x = s.charCodeAt(index);
		if(x != x) {
			return undefined;
		}
		return x;
	}
	static substr(s,pos,len) {
		if(len == null) {
			len = s.length;
		} else if(len < 0) {
			if(pos == 0) {
				len = s.length + len;
			} else {
				return "";
			}
		}
		return s.substr(pos,len);
	}
	static now() {
		return Date.now();
	}
}
HxOverrides.__name__ = true;
Math.__name__ = true;
class Std {
	static random(x) {
		if(x <= 0) {
			return 0;
		} else {
			return Math.floor(Math.random() * x);
		}
	}
}
Std.__name__ = true;
class StringTools {
	static isSpace(s,pos) {
		let c = HxOverrides.cca(s,pos);
		if(!(c > 8 && c < 14)) {
			return c == 32;
		} else {
			return true;
		}
	}
	static ltrim(s) {
		let l = s.length;
		let r = 0;
		while(r < l && StringTools.isSpace(s,r)) ++r;
		if(r > 0) {
			return HxOverrides.substr(s,r,l - r);
		} else {
			return s;
		}
	}
	static rtrim(s) {
		let l = s.length;
		let r = 0;
		while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
		if(r > 0) {
			return HxOverrides.substr(s,0,l - r);
		} else {
			return s;
		}
	}
	static trim(s) {
		return StringTools.ltrim(StringTools.rtrim(s));
	}
}
StringTools.__name__ = true;
class UInt {
	static toFloat(this1) {
		if(this1 < 0) {
			return 4294967296.0 + this1;
		} else {
			return this1 + 0.0;
		}
	}
}
class dropecho_langgen_Consts {
	static getRandomCorthSet(random) {
		let this1 = dropecho_langgen_Consts.corthsets;
		let _g = [];
		let k_keys = Object.keys(dropecho_langgen_Consts.corthsets.h);
		let k_length = k_keys.length;
		let k_current = 0;
		while(k_current < k_length) _g.push(k_keys[k_current++]);
		let key = random.choice(_g);
		return this1.h[key];
	}
	static getRandomVorthSet(random) {
		let this1 = dropecho_langgen_Consts.vorthsets;
		let _g = [];
		let k_keys = Object.keys(dropecho_langgen_Consts.vorthsets.h);
		let k_length = k_keys.length;
		let k_current = 0;
		while(k_current < k_length) _g.push(k_keys[k_current++]);
		let key = random.choice(_g);
		return this1.h[key];
	}
	static getRandomConsonantSet(random) {
		let _g = [];
		let x_keys = Object.keys(dropecho_langgen_Consts.consonant_sets.h);
		let x_length = x_keys.length;
		let x_current = 0;
		while(x_current < x_length) _g.push(x_keys[x_current++]);
		let this1 = dropecho_langgen_Consts.consonant_sets;
		let key = random.choice(_g);
		return this1.h[key];
	}
	static getRandomVowelSet(random) {
		let _g = [];
		let x_keys = Object.keys(dropecho_langgen_Consts.vowel_sets.h);
		let x_length = x_keys.length;
		let x_current = 0;
		while(x_current < x_length) _g.push(x_keys[x_current++]);
		let this1 = dropecho_langgen_Consts.vowel_sets;
		let key = random.choice(_g);
		return this1.h[key];
	}
	static getRandomSibilantSet(random) {
		let _g = [];
		let x_keys = Object.keys(dropecho_langgen_Consts.sibilant_sets.h);
		let x_length = x_keys.length;
		let x_current = 0;
		while(x_current < x_length) _g.push(x_keys[x_current++]);
		let this1 = dropecho_langgen_Consts.sibilant_sets;
		let key = random.choice(_g);
		return this1.h[key];
	}
	static getRandomFinalSet(random) {
		let _g = [];
		let x_keys = Object.keys(dropecho_langgen_Consts.final_sets.h);
		let x_length = x_keys.length;
		let x_current = 0;
		while(x_current < x_length) _g.push(x_keys[x_current++]);
		let this1 = dropecho_langgen_Consts.final_sets;
		let key = random.choice(_g);
		return this1.h[key];
	}
	static getRandomLiquidSet(random) {
		let _g = [];
		let x_keys = Object.keys(dropecho_langgen_Consts.liquid_sets.h);
		let x_length = x_keys.length;
		let x_current = 0;
		while(x_current < x_length) _g.push(x_keys[x_current++]);
		let this1 = dropecho_langgen_Consts.liquid_sets;
		let key = random.choice(_g);
		return this1.h[key];
	}
	static getRandomRewriteSet(random) {
		let _g = [];
		let x_keys = Object.keys(dropecho_langgen_Consts.rewritesets.h);
		let x_length = x_keys.length;
		let x_current = 0;
		while(x_current < x_length) _g.push(x_keys[x_current++]);
		let this1 = dropecho_langgen_Consts.rewritesets;
		let key = random.choice(_g);
		return this1.h[key];
	}
	static getRandomSyllableStructure(random) {
		return random.choice(dropecho_langgen_Consts.syllable_structures);
	}
	static getRandomPhraseStructure(random) {
		return random.choice(dropecho_langgen_Consts.phrase_structures);
	}
}
$hx_exports["Consts"] = dropecho_langgen_Consts;
dropecho_langgen_Consts.__name__ = true;
class dropecho_langgen_Language {
	constructor(config,seed) {
		this.trans_words = new haxe_ds_StringMap();
		this.words_ipa = new haxe_ds_StringMap();
		this.words = new haxe_ds_StringMap();
		this.syllables = [];
		this.random = new seedyrng_Random();
		if(seed != null) {
			this.random.setStringSeed(seed);
		}
		let randommin;
		let tmp;
		if(config != null) {
			tmp = config;
		} else {
			let tmp1 = dropecho_langgen_Consts.getRandomConsonantSet(this.random);
			let tmp2 = dropecho_langgen_Consts.getRandomVowelSet(this.random);
			let tmp3 = dropecho_langgen_Consts.getRandomSyllableStructure(this.random);
			let tmp4 = dropecho_langgen_Consts.getRandomPhraseStructure(this.random);
			let tmp5 = dropecho_langgen_Consts.getRandomSibilantSet(this.random);
			let tmp6 = dropecho_langgen_Consts.getRandomLiquidSet(this.random);
			let tmp7 = dropecho_langgen_Consts.getRandomFinalSet(this.random);
			let tmp8 = dropecho_langgen_Consts.getRandomRewriteSet(this.random);
			randommin = this.random.randomInt(1,2);
			tmp = { consonants : tmp1, vowels : tmp2, syllable_structure : tmp3, phrase_structure : tmp4, sibilants : tmp5, liquids : tmp6, finals : tmp7, rewriteset : tmp8, word_length_min : randommin, word_length_max : this.random.randomInt(randommin + 1,randommin + this.random.randomInt(1,4))};
		}
		this.config = tmp;
		this.spell = new dropecho_langgen_Spell(null,seed);
		this.rewrite = new dropecho_langgen_Rewrite(this.config);
		this.genitive = this.createWord("of",1,1);
		this.definite = this.createWord("the",1,1);
	}
	createSyllable() {
		let split = this.config.syllable_structure.split("");
		let _g = [];
		let _g1 = 0;
		let _g2 = split.length;
		while(_g1 < _g2) {
			let x = _g1++;
			if(split[x] == "?") {
				continue;
			}
			if(x < split.length - 1 && split[x + 1] == "?" && this.random.random() > 0.5) {
				continue;
			}
			let syl;
			switch(split[x]) {
			case "C":
				syl = this.random.choice(this.config.consonants);
				break;
			case "F":
				syl = this.random.choice(this.config.finals);
				break;
			case "L":
				syl = this.random.choice(this.config.liquids);
				break;
			case "S":
				syl = this.random.choice(this.config.sibilants);
				break;
			case "V":
				syl = this.random.choice(this.config.vowels);
				break;
			default:
				syl = "";
			}
			_g.push(syl);
		}
		return _g.join("");
	}
	createWord(key,min,max) {
		if(min == null) {
			min = this.config.word_length_min;
		}
		if(max == null) {
			max = this.config.word_length_max;
		}
		if(key != null && Object.prototype.hasOwnProperty.call(this.words.h,key)) {
			return this.words.h[key];
		}
		let _g = [];
		let _g1 = 0;
		let _g2 = this.random.randomInt(min,max);
		while(_g1 < _g2) {
			++_g1;
			_g.push(this.createSyllable());
		}
		let word = _g.join("");
		let orig = word;
		word = this.spell.spell(this.rewrite.rewrite(word));
		if(key != null && !Object.prototype.hasOwnProperty.call(this.words.h,key)) {
			this.words.h[key] = word;
			this.trans_words.h[word] = key;
			this.words_ipa.h[word] = orig;
		}
		return word;
	}
	createPhrase(key) {
		let subject = key != null && Object.prototype.hasOwnProperty.call(this.words.h,key) ? this.words.h[key] : this.createWord();
		let split = this.config.phrase_structure.split("");
		let _g = [];
		let _g1 = 0;
		let _g2 = split.length;
		while(_g1 < _g2) {
			let x = _g1++;
			if(split[x] == "?") {
				continue;
			}
			if(x < split.length - 1 && split[x + 1] == "?" && this.random.random() > 0.5) {
				continue;
			}
			let phrase;
			switch(split[x]) {
			case "D":
				phrase = this.definite;
				break;
			case "G":
				phrase = this.genitive;
				break;
			case "N":
				let _g2 = [];
				let k_keys = Object.keys(this.words.h);
				let k_length = k_keys.length;
				let k_current = 0;
				while(k_current < k_length) _g2.push(k_keys[k_current++]);
				let _g3 = [];
				let _g4 = 0;
				while(_g4 < _g2.length) {
					let v = _g2[_g4];
					++_g4;
					if(v != "the" && v != "of") {
						_g3.push(v);
					}
				}
				if(_g3.length > 0) {
					let _this = this.words;
					let key = this.random.choice(_g3);
					phrase = _this.h[key];
				} else {
					phrase = this.createWord();
				}
				break;
			case "S":
				phrase = subject;
				break;
			default:
				phrase = "";
			}
			_g.push(phrase);
		}
		return _g.join(" ");
	}
	translate(text) {
		let tokens = StringTools.trim(text).split(" ");
		let _g = new haxe_ds_StringMap();
		let _g1 = 0;
		let _g2 = [];
		let _g3 = 0;
		while(_g3 < tokens.length) {
			let v = tokens[_g3];
			++_g3;
			if(v != null && v.length > 0) {
				_g2.push(v);
			}
		}
		while(_g1 < _g2.length) {
			let x = _g2[_g1];
			++_g1;
			let word = Object.prototype.hasOwnProperty.call(this.trans_words.h,x) ? this.trans_words.h[x] : "UNKNOWN";
			_g.h[x] = word;
		}
		return _g;
	}
}
$hx_exports["Language"] = dropecho_langgen_Language;
dropecho_langgen_Language.__name__ = true;
class dropecho_langgen_Rewrite {
	constructor(config) {
		this.rules = new haxe_ds_ObjectMap();
		this.config = config;
		let _g = 0;
		let _g1 = this.config.rewriteset;
		while(_g < _g1.length) {
			let rule = _g1[_g];
			++_g;
			this.addRule(rule.character,rule.rule,rule.replaceWith);
		}
	}
	parseRule(char,rule) {
		let consts = this.config.consonants.join("");
		let vowels = this.config.vowels.join("");
		let _this_r = new RegExp("C","g".split("u").join(""));
		rule = rule.replace(_this_r,"[" + consts + "]{1}");
		let _this_r1 = new RegExp("V","g".split("u").join(""));
		rule = rule.replace(_this_r1,"[" + vowels + "]{1}");
		let _this_r2 = new RegExp("_","g".split("u").join(""));
		rule = rule.replace(_this_r2,"(" + char + ")");
		return rule;
	}
	addRule(char,rule,replaceWith) {
		let reg = new EReg(this.parseRule(char,rule),"g");
		this.rules.set(reg,replaceWith);
	}
	rewrite(s) {
		let after = s;
		let this1 = this.rules;
		let _g_keys = this1.keys();
		while(_g_keys.hasNext()) {
			let key = _g_keys.next();
			let _g1_value = this1.get(key);
			after = after.replace(key.r,_g1_value);
		}
		return after;
	}
}
dropecho_langgen_Rewrite.__name__ = true;
class dropecho_langgen_Spell {
	constructor(ortho,seed) {
		let random = new seedyrng_Random();
		if(seed != null) {
			random.setStringSeed(seed);
		}
		if(ortho == null) {
			this.ortho = { consonants : dropecho_langgen_Consts.getRandomCorthSet(random), vowels : dropecho_langgen_Consts.getRandomVorthSet(random)};
		} else {
			this.ortho = ortho;
		}
	}
	getOrthoChar(char) {
		if(this.ortho.consonants != null && Object.prototype.hasOwnProperty.call(this.ortho.consonants.h,char)) {
			return this.ortho.consonants.h[char];
		}
		if(this.ortho.vowels != null && Object.prototype.hasOwnProperty.call(this.ortho.vowels.h,char)) {
			return this.ortho.vowels.h[char];
		}
		if(Object.prototype.hasOwnProperty.call(dropecho_langgen_Consts.default_ortho.h,char)) {
			return dropecho_langgen_Consts.default_ortho.h[char];
		}
		return char;
	}
	spell(s) {
		let _g = [];
		let _g1 = 0;
		let _g2 = s.split("");
		while(_g1 < _g2.length) _g.push(this.getOrthoChar(_g2[_g1++]));
		return _g.join("");
	}
}
$hx_exports["Spell"] = dropecho_langgen_Spell;
dropecho_langgen_Spell.__name__ = true;
class haxe_Exception extends Error {
	constructor(message,previous,native) {
		super(message);
		this.message = message;
		this.__previousException = previous;
		this.__nativeException = native != null ? native : this;
	}
	get_native() {
		return this.__nativeException;
	}
	static thrown(value) {
		if(((value) instanceof haxe_Exception)) {
			return value.get_native();
		} else if(((value) instanceof Error)) {
			return value;
		} else {
			let e = new haxe_ValueException(value);
			return e;
		}
	}
}
haxe_Exception.__name__ = true;
class haxe_Int32 {
	static ucompare(a,b) {
		if(a < 0) {
			if(b < 0) {
				return ~b - ~a | 0;
			} else {
				return 1;
			}
		}
		if(b < 0) {
			return -1;
		} else {
			return a - b | 0;
		}
	}
}
class haxe__$Int64__$_$_$Int64 {
	constructor(high,low) {
		this.high = high;
		this.low = low;
	}
}
haxe__$Int64__$_$_$Int64.__name__ = true;
class haxe_ValueException extends haxe_Exception {
	constructor(value,previous,native) {
		super(String(value),previous,native);
		this.value = value;
	}
}
haxe_ValueException.__name__ = true;
class haxe_crypto_Sha1 {
	constructor() {
	}
	doEncode(x) {
		let w = [];
		let a = 1732584193;
		let b = -271733879;
		let c = -1732584194;
		let d = 271733878;
		let e = -1009589776;
		let i = 0;
		while(i < x.length) {
			let olda = a;
			let oldb = b;
			let oldc = c;
			let oldd = d;
			let olde = e;
			let j = 0;
			while(j < 80) {
				if(j < 16) {
					w[j] = x[i + j];
				} else {
					let num = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
					w[j] = num << 1 | num >>> 31;
				}
				let t = (a << 5 | a >>> 27) + this.ft(j,b,c,d) + e + w[j];
				e = d;
				d = c;
				c = b << 30 | b >>> 2;
				b = a;
				a = t + this.kt(j);
				++j;
			}
			a += olda;
			b += oldb;
			c += oldc;
			d += oldd;
			e += olde;
			i += 16;
		}
		return [a,b,c,d,e];
	}
	ft(t,b,c,d) {
		if(t < 20) {
			return b & c | ~b & d;
		}
		if(t < 40) {
			return b ^ c ^ d;
		}
		if(t < 60) {
			return b & c | b & d | c & d;
		}
		return b ^ c ^ d;
	}
	kt(t) {
		if(t < 20) {
			return 1518500249;
		}
		if(t < 40) {
			return 1859775393;
		}
		if(t < 60) {
			return -1894007588;
		}
		return -899497514;
	}
	static make(b) {
		let h = new haxe_crypto_Sha1().doEncode(haxe_crypto_Sha1.bytes2blks(b));
		let out = new haxe_io_Bytes(new ArrayBuffer(20));
		out.b[0] = h[0] >>> 24;
		out.b[1] = h[0] >> 16 & 255;
		out.b[2] = h[0] >> 8 & 255;
		out.b[3] = h[0] & 255;
		out.b[4] = h[1] >>> 24;
		out.b[5] = h[1] >> 16 & 255;
		out.b[6] = h[1] >> 8 & 255;
		out.b[7] = h[1] & 255;
		out.b[8] = h[2] >>> 24;
		out.b[9] = h[2] >> 16 & 255;
		out.b[10] = h[2] >> 8 & 255;
		out.b[11] = h[2] & 255;
		out.b[12] = h[3] >>> 24;
		out.b[13] = h[3] >> 16 & 255;
		out.b[14] = h[3] >> 8 & 255;
		out.b[15] = h[3] & 255;
		out.b[16] = h[4] >>> 24;
		out.b[17] = h[4] >> 16 & 255;
		out.b[18] = h[4] >> 8 & 255;
		out.b[19] = h[4] & 255;
		return out;
	}
	static bytes2blks(b) {
		let nblk = (b.length + 8 >> 6) + 1;
		let blks = [];
		let _g = 0;
		let _g1 = nblk * 16;
		while(_g < _g1) blks[_g++] = 0;
		let _g2 = 0;
		let _g3 = b.length;
		while(_g2 < _g3) {
			let i = _g2++;
			blks[i >> 2] |= b.b[i] << 24 - ((i & 3) << 3);
		}
		let i = b.length;
		blks[i >> 2] |= 128 << 24 - ((i & 3) << 3);
		blks[nblk * 16 - 1] = b.length * 8;
		return blks;
	}
}
haxe_crypto_Sha1.__name__ = true;
class haxe_ds_ObjectMap {
	constructor() {
		this.h = { __keys__ : { }};
	}
	set(key,value) {
		let id = key.__id__;
		if(id == null) {
			id = (key.__id__ = $global.$haxeUID++);
		}
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	get(key) {
		return this.h[key.__id__];
	}
	keys() {
		let a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) {
			a.push(this.h.__keys__[key]);
		}
		}
		return new haxe_iterators_ArrayIterator(a);
	}
}
haxe_ds_ObjectMap.__name__ = true;
class haxe_ds_StringMap {
	constructor() {
		this.h = Object.create(null);
	}
	get(key) {
		return this.h[key];
	}
	keys() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this.h);
	}
}
haxe_ds_StringMap.__name__ = true;
class haxe_ds__$StringMap_StringMapKeyIterator {
	constructor(h) {
		this.h = h;
		this.keys = Object.keys(h);
		this.length = this.keys.length;
		this.current = 0;
	}
	hasNext() {
		return this.current < this.length;
	}
	next() {
		return this.keys[this.current++];
	}
}
haxe_ds__$StringMap_StringMapKeyIterator.__name__ = true;
class haxe_io_Bytes {
	constructor(data) {
		this.length = data.byteLength;
		this.b = new Uint8Array(data);
		this.b.bufferValue = data;
		data.hxBytes = this;
		data.bytes = this.b;
	}
	getInt32(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getInt32(pos,true);
	}
	setInt32(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setInt32(pos,v,true);
	}
	getInt64(pos) {
		return new haxe__$Int64__$_$_$Int64(this.getInt32(pos + 4),this.getInt32(pos));
	}
	setInt64(pos,v) {
		this.setInt32(pos,v.low);
		this.setInt32(pos + 4,v.high);
	}
	getString(pos,len,encoding) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(encoding == null) {
			encoding = haxe_io_Encoding.UTF8;
		}
		let s = "";
		let b = this.b;
		let i = pos;
		let max = pos + len;
		switch(encoding._hx_index) {
		case 0:
			while(i < max) {
				let c = b[i++];
				if(c < 128) {
					if(c == 0) {
						break;
					}
					s += String.fromCodePoint(c);
				} else if(c < 224) {
					let code = (c & 63) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else if(c < 240) {
					let code = (c & 31) << 12 | (b[i++] & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else {
					let u = (c & 15) << 18 | (b[i++] & 127) << 12 | (b[i++] & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(u);
				}
			}
			break;
		case 1:
			while(i < max) {
				let c = b[i++] | b[i++] << 8;
				s += String.fromCodePoint(c);
			}
			break;
		}
		return s;
	}
	toString() {
		return this.getString(0,this.length);
	}
	static ofString(s,encoding) {
		if(encoding == haxe_io_Encoding.RawNative) {
			let buf = new Uint8Array(s.length << 1);
			let _g = 0;
			let _g1 = s.length;
			while(_g < _g1) {
				let i = _g++;
				let c = s.charCodeAt(i);
				buf[i << 1] = c & 255;
				buf[i << 1 | 1] = c >> 8;
			}
			return new haxe_io_Bytes(buf.buffer);
		}
		let a = [];
		let i = 0;
		while(i < s.length) {
			let c = s.charCodeAt(i++);
			if(55296 <= c && c <= 56319) {
				c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
			}
			if(c <= 127) {
				a.push(c);
			} else if(c <= 2047) {
				a.push(192 | c >> 6);
				a.push(128 | c & 63);
			} else if(c <= 65535) {
				a.push(224 | c >> 12);
				a.push(128 | c >> 6 & 63);
				a.push(128 | c & 63);
			} else {
				a.push(240 | c >> 18);
				a.push(128 | c >> 12 & 63);
				a.push(128 | c >> 6 & 63);
				a.push(128 | c & 63);
			}
		}
		return new haxe_io_Bytes(new Uint8Array(a).buffer);
	}
}
haxe_io_Bytes.__name__ = true;
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:true,__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:true,__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_._hx_name="Custom",$_.__params__ = ["e"],$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
class haxe_iterators_ArrayIterator {
	constructor(array) {
		this.current = 0;
		this.array = array;
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return this.array[this.current++];
	}
}
haxe_iterators_ArrayIterator.__name__ = true;
class js_Boot {
	static __string_rec(o,s) {
		if(o == null) {
			return "null";
		}
		if(s.length >= 5) {
			return "<...>";
		}
		let t = typeof(o);
		if(t == "function" && (o.__name__ || o.__ename__)) {
			t = "object";
		}
		switch(t) {
		case "function":
			return "<function>";
		case "object":
			if(o.__enum__) {
				let e = $hxEnums[o.__enum__];
				let con = e.__constructs__[o._hx_index];
				let n = con._hx_name;
				if(con.__params__) {
					s = s + "\t";
					return n + "(" + ((function($this) {
						var $r;
						let _g = [];
						{
							let _g1 = 0;
							let _g2 = con.__params__;
							while(true) {
								if(!(_g1 < _g2.length)) {
									break;
								}
								let p = _g2[_g1];
								_g1 = _g1 + 1;
								_g.push(js_Boot.__string_rec(o[p],s));
							}
						}
						$r = _g;
						return $r;
					}(this))).join(",") + ")";
				} else {
					return n;
				}
			}
			if(((o) instanceof Array)) {
				let str = "[";
				s += "\t";
				let _g = 0;
				let _g1 = o.length;
				while(_g < _g1) {
					let i = _g++;
					str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
				}
				str += "]";
				return str;
			}
			let tostr;
			try {
				tostr = o.toString;
			} catch( _g ) {
				return "???";
			}
			if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
				let s2 = o.toString();
				if(s2 != "[object Object]") {
					return s2;
				}
			}
			let str = "{\n";
			s += "\t";
			let hasp = o.hasOwnProperty != null;
			let k = null;
			for( k in o ) {
			if(hasp && !o.hasOwnProperty(k)) {
				continue;
			}
			if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
				continue;
			}
			if(str.length != 2) {
				str += ", \n";
			}
			str += s + k + " : " + js_Boot.__string_rec(o[k],s);
			}
			s = s.substring(1);
			str += "\n" + s + "}";
			return str;
		case "string":
			return o;
		default:
			return String(o);
		}
	}
}
js_Boot.__name__ = true;
class seedyrng_Random {
	constructor(seed,generator) {
		if(seed == null) {
			seed = new haxe__$Int64__$_$_$Int64(seedyrng_Random.randomSystemInt(),seedyrng_Random.randomSystemInt());
		}
		if(generator == null) {
			generator = new seedyrng_Xorshift128Plus();
		}
		this.generator = generator;
		this.set_seed(seed);
	}
	get_seed() {
		return this.generator.get_seed();
	}
	set_seed(value) {
		return this.generator.set_seed(value);
	}
	get_state() {
		return this.generator.get_state();
	}
	set_state(value) {
		return this.generator.set_state(value);
	}
	get_usesAllBits() {
		return this.generator.get_usesAllBits();
	}
	nextInt() {
		return this.generator.nextInt();
	}
	nextFullInt() {
		if(this.generator.get_usesAllBits()) {
			return this.generator.nextInt();
		} else {
			let num1 = this.generator.nextInt();
			let num2 = this.generator.nextInt();
			num2 = num2 >>> 16 | num2 << 16;
			return num1 ^ num2;
		}
	}
	setStringSeed(seed) {
		this.setBytesSeed(haxe_io_Bytes.ofString(seed));
	}
	setBytesSeed(seed) {
		this.set_seed(haxe_crypto_Sha1.make(seed).getInt64(0));
	}
	random() {
		let upper = this.nextFullInt() & 2097151;
		return (UInt.toFloat(this.nextFullInt()) + upper * Math.pow(2,32)) * Math.pow(2,-53);
	}
	randomInt(lower,upper) {
		return Math.floor(this.random() * (upper - lower + 1)) + lower;
	}
	uniform(lower,upper) {
		return this.random() * (upper - lower) + lower;
	}
	choice(array) {
		return array[this.randomInt(0,array.length - 1)];
	}
	shuffle(array) {
		let _g = 0;
		let _g1 = array.length - 1;
		while(_g < _g1) {
			let index = _g++;
			let randIndex = this.randomInt(index,array.length - 1);
			let tempA = array[index];
			array[index] = array[randIndex];
			array[randIndex] = tempA;
		}
	}
	static randomSystemInt() {
		return Std.random(255) << 24 | Std.random(255) << 16 | Std.random(255) << 8 | Std.random(255);
	}
}
seedyrng_Random.__name__ = true;
class seedyrng_Xorshift128Plus {
	constructor() {
		this._currentAvailable = false;
		this.set_seed(new haxe__$Int64__$_$_$Int64(0,1));
	}
	get_usesAllBits() {
		return false;
	}
	get_seed() {
		return this._seed;
	}
	set_seed(value) {
		if(!(value.high != 0 || value.low != 0)) {
			value = new haxe__$Int64__$_$_$Int64(0,1);
		}
		this._seed = value;
		this._state0 = value;
		this._state1 = seedyrng_Xorshift128Plus.SEED_1;
		this._currentAvailable = false;
		return value;
	}
	get_state() {
		let bytes = new haxe_io_Bytes(new ArrayBuffer(33));
		bytes.setInt64(0,this._seed);
		bytes.setInt64(8,this._state0);
		bytes.setInt64(16,this._state1);
		bytes.b[24] = this._currentAvailable ? 1 : 0;
		if(this._currentAvailable) {
			bytes.setInt64(25,this._current);
		}
		return bytes;
	}
	set_state(value) {
		if(value.length != 33) {
			throw haxe_Exception.thrown("Wrong state size " + value.length);
		}
		this._seed = value.getInt64(0);
		this._state0 = value.getInt64(8);
		this._state1 = value.getInt64(16);
		this._currentAvailable = value.b[24] == 1;
		if(this._currentAvailable) {
			this._current = value.getInt64(25);
		}
		return value;
	}
	stepNext() {
		let x = this._state0;
		let y = this._state1;
		this._state0 = y;
		let b = new haxe__$Int64__$_$_$Int64(x.high << 23 | x.low >>> 9,x.low << 23);
		x = new haxe__$Int64__$_$_$Int64(x.high ^ b.high,x.low ^ b.low);
		let b1 = new haxe__$Int64__$_$_$Int64(x.high >> 17,x.high << 15 | x.low >>> 17);
		let b2 = new haxe__$Int64__$_$_$Int64(y.high >> 26,y.high << 6 | y.low >>> 26);
		this._state1 = new haxe__$Int64__$_$_$Int64(x.high ^ y.high ^ b1.high ^ b2.high,x.low ^ y.low ^ b1.low ^ b2.low);
		let a = this._state1;
		let high = a.high + y.high | 0;
		let low = a.low + y.low | 0;
		if(haxe_Int32.ucompare(low,a.low) < 0) {
			++high;
			high = high | 0;
		}
		this._current = new haxe__$Int64__$_$_$Int64(high,low);
	}
	nextInt() {
		if(this._currentAvailable) {
			this._currentAvailable = false;
			return this._current.low;
		} else {
			this.stepNext();
			this._currentAvailable = true;
			return this._current.high;
		}
	}
}
seedyrng_Xorshift128Plus.__name__ = true;
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
{
	String.__name__ = true;
	Array.__name__ = true;
}
haxe_ds_ObjectMap.count = 0;
js_Boot.__toStr = ({ }).toString;
dropecho_langgen_Consts.consonant_sets = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["Minimal"] = "ptkmnls".split("");
	_g.h["English-ish"] = "ptkbdgmnlrsʃzʒʧ".split("");
	_g.h["Pirahã (very simple)"] = "ptkmnh".split("");
	_g.h["Hawaiian-ish"] = "hklmnpwʔ".split("");
	_g.h["Greenlandic-ish"] = "ptkqvsgrmnŋlj".split("");
	_g.h["Arabic-ish"] = "tksʃdbqɣxmnlrwj".split("");
	_g.h["Arabic-lite"] = "tkdgmnsʃ".split("");
	_g.h["English-lite"] = "ptkbdgmnszʒʧhjw".split("");
	$r = _g;
	return $r;
}(this));
dropecho_langgen_Consts.vowel_sets = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["Default"] = "aeiou".split("");
	_g.h["3-vowel a i u"] = "aiu".split("");
	_g.h["Extra A E I"] = "aeiouAEI".split("");
	_g.h["Extra U"] = "aeiouU".split("");
	_g.h["5-vowel a i u A I"] = "aiuAI".split("");
	_g.h["3-vowel e o u"] = "eou".split("");
	_g.h["Extra A O U"] = "aeiouAOU".split("");
	$r = _g;
	return $r;
}(this));
dropecho_langgen_Consts.sibilant_sets = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["Just s"] = ["s"];
	_g.h["s ʃ"] = ["s","ʃ"];
	_g.h["s ʃ f"] = ["s","ʃ","f"];
	$r = _g;
	return $r;
}(this));
dropecho_langgen_Consts.liquid_sets = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["r l"] = "rl".split("");
	_g.h["Just r"] = "r".split("");
	_g.h["Just l"] = "l".split("");
	_g.h["w j"] = "wj".split("");
	_g.h["r l w j"] = "rlwj".split("");
	$r = _g;
	return $r;
}(this));
dropecho_langgen_Consts.final_sets = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["m n"] = "mn".split("");
	_g.h["s k"] = "sk".split("");
	_g.h["m n ŋ"] = "mnŋ".split("");
	_g.h["s ʃ z ʒ"] = "sʃzʒ".split("");
	$r = _g;
	return $r;
}(this));
dropecho_langgen_Consts.syllable_structures = ["CVC","CVV?C","CVVC?","CVC?","CV","VC","CVF","C?VC","CVF?","CL?VC","CL?VF","S?CVC","S?CVF","S?CVC?","C?VF","C?VC?","C?VF?","C?L?VC","VC","CVL?C?","C?VL?C","C?VLC?"];
dropecho_langgen_Consts.phrase_structures = ["DS","DSGN","DNGN","NGS","D?S","S?N","D?SN?","DSN?","D?SG?N","D?NSG?","D?NSG","D?SG?N?","D?G?NS"];
dropecho_langgen_Consts.default_ortho = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["ʃ"] = "sh";
	_g.h["ʒ"] = "zh";
	_g.h["ʧ"] = "ch";
	_g.h["ʤ"] = "j";
	_g.h["ŋ"] = "ng";
	_g.h["j"] = "y";
	_g.h["x"] = "kh";
	_g.h["ɣ"] = "gh";
	_g.h["ʔ"] = "‘";
	_g.h["A"] = "á";
	_g.h["E"] = "é";
	_g.h["I"] = "í";
	_g.h["O"] = "ó";
	_g.h["U"] = "ú";
	$r = _g;
	return $r;
}(this));
dropecho_langgen_Consts.corthsets = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["Default"] = new haxe_ds_StringMap();
	{
		let _g1 = new haxe_ds_StringMap();
		_g1.h["ʃ"] = "š";
		_g1.h["ʒ"] = "ž";
		_g1.h["ʧ"] = "č";
		_g1.h["ʤ"] = "ǧ";
		_g1.h["j"] = "j";
		_g.h["Slavic"] = _g1;
	}
	{
		let _g2 = new haxe_ds_StringMap();
		_g2.h["ʃ"] = "sch";
		_g2.h["ʒ"] = "zh";
		_g2.h["ʧ"] = "tsch";
		_g2.h["ʤ"] = "dz";
		_g2.h["j"] = "j";
		_g2.h["x"] = "ch";
		_g.h["German"] = _g2;
	}
	{
		let _g3 = new haxe_ds_StringMap();
		_g3.h["ʃ"] = "ch";
		_g3.h["ʒ"] = "j";
		_g3.h["ʧ"] = "tch";
		_g3.h["ʤ"] = "dj";
		_g3.h["x"] = "kh";
		_g.h["French"] = _g3;
	}
	{
		let _g4 = new haxe_ds_StringMap();
		_g4.h["ʃ"] = "x";
		_g4.h["ʧ"] = "q";
		_g4.h["ʤ"] = "j";
		_g.h["Chinese (pinyin)"] = _g4;
	}
	$r = _g;
	return $r;
}(this));
dropecho_langgen_Consts.vorthsets = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["Ácutes"] = new haxe_ds_StringMap();
	{
		let _g1 = new haxe_ds_StringMap();
		_g1.h["A"] = "ä";
		_g1.h["E"] = "ë";
		_g1.h["I"] = "ï";
		_g1.h["O"] = "ö";
		_g1.h["U"] = "ü";
		_g.h["Ümlauts"] = _g1;
	}
	{
		let _g2 = new haxe_ds_StringMap();
		_g2.h["A"] = "â";
		_g2.h["E"] = "ê";
		_g2.h["I"] = "y";
		_g2.h["O"] = "ô";
		_g2.h["U"] = "w";
		_g.h["Welsh"] = _g2;
	}
	{
		let _g3 = new haxe_ds_StringMap();
		_g3.h["A"] = "au";
		_g3.h["E"] = "ei";
		_g3.h["I"] = "ie";
		_g3.h["O"] = "ou";
		_g3.h["U"] = "oo";
		_g.h["Diphthongs"] = _g3;
	}
	{
		let _g4 = new haxe_ds_StringMap();
		_g4.h["A"] = "aa";
		_g4.h["E"] = "ee";
		_g4.h["I"] = "ii";
		_g4.h["O"] = "oo";
		_g4.h["U"] = "uu";
		_g.h["Doubles"] = _g4;
	}
	$r = _g;
	return $r;
}(this));
dropecho_langgen_Consts.rewritesets = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["None"] = [];
	_g.h["No double sounds"] = [{ character : "", rule : "(.)\\1", replaceWith : "$1"}];
	_g.h["No vowels at end"] = [{ character : "", rule : "V$", replaceWith : ""}];
	_g.h["No u followed by vowels"] = [{ character : "u", rule : "_V", replaceWith : ""}];
	$r = _g;
	return $r;
}(this));
seedyrng_Xorshift128Plus.PARAMETER_A = 23;
seedyrng_Xorshift128Plus.PARAMETER_B = 17;
seedyrng_Xorshift128Plus.PARAMETER_C = 26;
seedyrng_Xorshift128Plus.SEED_1 = new haxe__$Int64__$_$_$Int64(842650776,685298713);
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
