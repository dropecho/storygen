(function ($hx_exports, $global) { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
class EReg {
	constructor(r,opt) {
		this.r = new RegExp(r,opt.split("u").join(""));
	}
	match(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	matched(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched");
		}
	}
	matchedLeft() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return HxOverrides.substr(this.r.s,0,this.r.m.index);
	}
	matchedRight() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		let sz = this.r.m.index + this.r.m[0].length;
		return HxOverrides.substr(this.r.s,sz,this.r.s.length - sz);
	}
	matchedPos() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	matchSub(s,pos,len) {
		if(len == null) {
			len = -1;
		}
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0 ? s : HxOverrides.substr(s,0,pos + len));
			let b = this.r.m != null;
			if(b) {
				this.r.s = s;
			}
			return b;
		} else {
			let b = this.match(len < 0 ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len));
			if(b) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b;
		}
	}
	split(s) {
		return s.replace(this.r,"#__delim__#").split("#__delim__#");
	}
	replace(s,by) {
		return s.replace(this.r,by);
	}
	map(s,f) {
		let offset = 0;
		let buf_b = "";
		while(true) {
			if(offset >= s.length) {
				break;
			} else if(!this.matchSub(s,offset)) {
				buf_b += Std.string(HxOverrides.substr(s,offset,null));
				break;
			}
			let p = this.matchedPos();
			buf_b += Std.string(HxOverrides.substr(s,offset,p.pos - offset));
			buf_b += Std.string(f(this));
			if(p.len == 0) {
				buf_b += Std.string(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else {
				offset = p.pos + p.len;
			}
			if(!this.r.global) {
				break;
			}
		}
		if(!this.r.global && offset > 0 && offset < s.length) {
			buf_b += Std.string(HxOverrides.substr(s,offset,null));
		}
		return buf_b;
	}
	static escape(s) {
		return s.replace(EReg.escapeRe,"\\$&");
	}
}
$hxClasses["EReg"] = EReg;
EReg.__name__ = "EReg";
Object.assign(EReg.prototype, {
	__class__: EReg
	,r: null
});
class EnumValue {
	static match(this1,pattern) {
		return false;
	}
}
class HxOverrides {
	static dateStr(date) {
		let m = date.getMonth() + 1;
		let d = date.getDate();
		let h = date.getHours();
		let mi = date.getMinutes();
		let s = date.getSeconds();
		return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
	}
	static strDate(s) {
		switch(s.length) {
		case 8:
			let k = s.split(":");
			let d = new Date();
			d["setTime"](0);
			d["setUTCHours"](k[0]);
			d["setUTCMinutes"](k[1]);
			d["setUTCSeconds"](k[2]);
			return d;
		case 10:
			let k1 = s.split("-");
			return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
		case 19:
			let k2 = s.split(" ");
			let y = k2[0].split("-");
			let t = k2[1].split(":");
			return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
		default:
			throw haxe_Exception.thrown("Invalid date format : " + s);
		}
	}
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
	static indexOf(a,obj,i) {
		let len = a.length;
		if(i < 0) {
			i += len;
			if(i < 0) {
				i = 0;
			}
		}
		while(i < len) {
			if(((a[i]) === obj)) {
				return i;
			}
			++i;
		}
		return -1;
	}
	static lastIndexOf(a,obj,i) {
		let len = a.length;
		if(i >= len) {
			i = len - 1;
		} else if(i < 0) {
			i += len;
		}
		while(i >= 0) {
			if(((a[i]) === obj)) {
				return i;
			}
			--i;
		}
		return -1;
	}
	static remove(a,obj) {
		let i = a.indexOf(obj);
		if(i == -1) {
			return false;
		}
		a.splice(i,1);
		return true;
	}
	static iter(a) {
		return { cur : 0, arr : a, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}};
	}
	static keyValueIter(a) {
		return new haxe_iterators_ArrayKeyValueIterator(a);
	}
	static now() {
		return Date.now();
	}
}
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = "HxOverrides";
class IntIterator {
	constructor(min,max) {
		this.min = min;
		this.max = max;
	}
	hasNext() {
		return this.min < this.max;
	}
	next() {
		return this.min++;
	}
}
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = "IntIterator";
Object.assign(IntIterator.prototype, {
	__class__: IntIterator
	,min: null
	,max: null
});
Math.__name__ = "Math";
class Reflect {
	static hasField(o,field) {
		return Object.prototype.hasOwnProperty.call(o,field);
	}
	static field(o,field) {
		try {
			return o[field];
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return null;
		}
	}
	static setField(o,field,value) {
		o[field] = value;
	}
	static getProperty(o,field) {
		let tmp;
		if(o == null) {
			return null;
		} else {
			let tmp1;
			if(o.__properties__) {
				tmp = o.__properties__["get_" + field];
				tmp1 = tmp;
			} else {
				tmp1 = false;
			}
			if(tmp1) {
				return o[tmp]();
			} else {
				return o[field];
			}
		}
	}
	static setProperty(o,field,value) {
		let tmp;
		let tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["set_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			o[tmp](value);
		} else {
			o[field] = value;
		}
	}
	static callMethod(o,func,args) {
		return func.apply(o,args);
	}
	static fields(o) {
		let a = [];
		if(o != null) {
			let hasOwnProperty = Object.prototype.hasOwnProperty;
			for( var f in o ) {
			if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
				a.push(f);
			}
			}
		}
		return a;
	}
	static isFunction(f) {
		if(typeof(f) == "function") {
			return !(f.__name__ || f.__ename__);
		} else {
			return false;
		}
	}
	static compare(a,b) {
		if(a == b) {
			return 0;
		} else if(a > b) {
			return 1;
		} else {
			return -1;
		}
	}
	static compareMethods(f1,f2) {
		if(f1 == f2) {
			return true;
		}
		if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
			return false;
		}
		if(f1.scope == f2.scope && f1.method == f2.method) {
			return f1.method != null;
		} else {
			return false;
		}
	}
	static isObject(v) {
		if(v == null) {
			return false;
		}
		let t = typeof(v);
		if(!(t == "string" || t == "object" && v.__enum__ == null)) {
			if(t == "function") {
				return (v.__name__ || v.__ename__) != null;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	static isEnumValue(v) {
		if(v != null) {
			return v.__enum__ != null;
		} else {
			return false;
		}
	}
	static deleteField(o,field) {
		if(!Object.prototype.hasOwnProperty.call(o,field)) {
			return false;
		}
		delete(o[field]);
		return true;
	}
	static copy(o) {
		if(o == null) {
			return null;
		}
		let o2 = { };
		let _g = 0;
		let _g1 = Reflect.fields(o);
		while(_g < _g1.length) {
			let f = _g1[_g];
			++_g;
			o2[f] = Reflect.field(o,f);
		}
		return o2;
	}
	static makeVarArgs(f) {
		return function() {
			let a = Array.prototype.slice;
			let a1 = arguments;
			let a2 = a.call(a1);
			return f(a2);
		};
	}
}
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = "Reflect";
class Std {
	static is(v,t) {
		return js_Boot.__instanceof(v,t);
	}
	static isOfType(v,t) {
		return js_Boot.__instanceof(v,t);
	}
	static downcast(value,c) {
		if(js_Boot.__downcastCheck(value,c)) {
			return value;
		} else {
			return null;
		}
	}
	static instance(value,c) {
		if(js_Boot.__downcastCheck(value,c)) {
			return value;
		} else {
			return null;
		}
	}
	static string(s) {
		return js_Boot.__string_rec(s,"");
	}
	static int(x) {
		return x | 0;
	}
	static parseInt(x) {
		if(x != null) {
			let _g = 0;
			let _g1 = x.length;
			while(_g < _g1) {
				let i = _g++;
				let c = x.charCodeAt(i);
				if(c <= 8 || c >= 14 && c != 32 && c != 45) {
					let nc = x.charCodeAt(i + 1);
					let v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
					if(isNaN(v)) {
						return null;
					} else {
						return v;
					}
				}
			}
		}
		return null;
	}
	static parseFloat(x) {
		return parseFloat(x);
	}
	static random(x) {
		if(x <= 0) {
			return 0;
		} else {
			return Math.floor(Math.random() * x);
		}
	}
}
$hxClasses["Std"] = Std;
Std.__name__ = "Std";
class StringBuf {
	constructor() {
		this.b = "";
	}
	get_length() {
		return this.b.length;
	}
	add(x) {
		this.b += Std.string(x);
	}
	addChar(c) {
		this.b += String.fromCodePoint(c);
	}
	addSub(s,pos,len) {
		this.b += len == null ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len);
	}
	toString() {
		return this.b;
	}
}
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = "StringBuf";
Object.assign(StringBuf.prototype, {
	__class__: StringBuf
	,b: null
	,__properties__: {get_length: "get_length"}
});
class haxe_SysTools {
	static quoteUnixArg(argument) {
		if(argument == "") {
			return "''";
		}
		if(!new EReg("[^a-zA-Z0-9_@%+=:,./-]","").match(argument)) {
			return argument;
		}
		return "'" + StringTools.replace(argument,"'","'\"'\"'") + "'";
	}
	static quoteWinArg(argument,escapeMetaCharacters) {
		if(!new EReg("^[^ \t\\\\\"]+$","").match(argument)) {
			let result_b = "";
			let needquote = argument.indexOf(" ") != -1 || argument.indexOf("\t") != -1 || argument == "";
			if(needquote) {
				result_b += "\"";
			}
			let bs_buf = new StringBuf();
			let _g = 0;
			let _g1 = argument.length;
			while(_g < _g1) {
				let _g1 = HxOverrides.cca(argument,_g++);
				if(_g1 == null) {
					let c = _g1;
					if(bs_buf.b.length > 0) {
						result_b += Std.string(bs_buf.b);
						bs_buf = new StringBuf();
					}
					result_b += String.fromCodePoint(c);
				} else {
					switch(_g1) {
					case 34:
						let bs = bs_buf.b;
						result_b += bs == null ? "null" : "" + bs;
						result_b += bs == null ? "null" : "" + bs;
						bs_buf = new StringBuf();
						result_b += "\\\"";
						break;
					case 92:
						bs_buf.b += "\\";
						break;
					default:
						let c = _g1;
						if(bs_buf.b.length > 0) {
							result_b += Std.string(bs_buf.b);
							bs_buf = new StringBuf();
						}
						result_b += String.fromCodePoint(c);
					}
				}
			}
			result_b += Std.string(bs_buf.b);
			if(needquote) {
				result_b += Std.string(bs_buf.b);
				result_b += "\"";
			}
			argument = result_b;
		}
		if(escapeMetaCharacters) {
			let result_b = "";
			let _g = 0;
			let _g1 = argument.length;
			while(_g < _g1) {
				let c = HxOverrides.cca(argument,_g++);
				if(haxe_SysTools.winMetaCharacters.indexOf(c) >= 0) {
					result_b += String.fromCodePoint(94);
				}
				result_b += String.fromCodePoint(c);
			}
			return result_b;
		} else {
			return argument;
		}
	}
}
$hxClasses["haxe.SysTools"] = haxe_SysTools;
haxe_SysTools.__name__ = "haxe.SysTools";
class StringTools {
	static urlEncode(s) {
		return encodeURIComponent(s);
	}
	static urlDecode(s) {
		return decodeURIComponent(s.split("+").join(" "));
	}
	static htmlEscape(s,quotes) {
		let buf_b = "";
		let _g_offset = 0;
		let _g_s = s;
		while(_g_offset < _g_s.length) {
			let s = _g_s;
			let index = _g_offset++;
			let c = s.charCodeAt(index);
			if(c >= 55296 && c <= 56319) {
				c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
			}
			let c1 = c;
			if(c1 >= 65536) {
				++_g_offset;
			}
			let code = c1;
			switch(code) {
			case 34:
				if(quotes) {
					buf_b += "&quot;";
				} else {
					buf_b += String.fromCodePoint(code);
				}
				break;
			case 38:
				buf_b += "&amp;";
				break;
			case 39:
				if(quotes) {
					buf_b += "&#039;";
				} else {
					buf_b += String.fromCodePoint(code);
				}
				break;
			case 60:
				buf_b += "&lt;";
				break;
			case 62:
				buf_b += "&gt;";
				break;
			default:
				buf_b += String.fromCodePoint(code);
			}
		}
		return buf_b;
	}
	static htmlUnescape(s) {
		return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
	}
	static contains(s,value) {
		return s.includes(value);
	}
	static startsWith(s,start) {
		return s.startsWith(start);
	}
	static endsWith(s,end) {
		return s.endsWith(end);
	}
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
	static lpad(s,c,l) {
		if(c.length <= 0) {
			return s;
		}
		let buf_b = "";
		l -= s.length;
		while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
		buf_b += s == null ? "null" : "" + s;
		return buf_b;
	}
	static rpad(s,c,l) {
		if(c.length <= 0) {
			return s;
		}
		let buf_b = "";
		buf_b = "" + (s == null ? "null" : "" + s);
		while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
		return buf_b;
	}
	static replace(s,sub,by) {
		return s.split(sub).join(by);
	}
	static hex(n,digits) {
		let s = "";
		while(true) {
			s = "0123456789ABCDEF".charAt(n & 15) + s;
			n >>>= 4;
			if(!(n > 0)) {
				break;
			}
		}
		if(digits != null) {
			while(s.length < digits) s = "0" + s;
		}
		return s;
	}
	static fastCodeAt(s,index) {
		return s.charCodeAt(index);
	}
	static unsafeCodeAt(s,index) {
		return s.charCodeAt(index);
	}
	static iterator(s) {
		return new haxe_iterators_StringIterator(s);
	}
	static keyValueIterator(s) {
		return new haxe_iterators_StringKeyValueIterator(s);
	}
	static isEof(c) {
		return c != c;
	}
	static quoteUnixArg(argument) {
		if(argument == "") {
			return "''";
		} else if(!new EReg("[^a-zA-Z0-9_@%+=:,./-]","").match(argument)) {
			return argument;
		} else {
			return "'" + StringTools.replace(argument,"'","'\"'\"'") + "'";
		}
	}
	static quoteWinArg(argument,escapeMetaCharacters) {
		let argument1 = argument;
		if(!new EReg("^[^ \t\\\\\"]+$","").match(argument1)) {
			let result_b = "";
			let needquote = argument1.indexOf(" ") != -1 || argument1.indexOf("\t") != -1 || argument1 == "";
			if(needquote) {
				result_b += "\"";
			}
			let bs_buf = new StringBuf();
			let _g = 0;
			let _g1 = argument1.length;
			while(_g < _g1) {
				let _g1 = HxOverrides.cca(argument1,_g++);
				if(_g1 == null) {
					let c = _g1;
					if(bs_buf.b.length > 0) {
						result_b += Std.string(bs_buf.b);
						bs_buf = new StringBuf();
					}
					result_b += String.fromCodePoint(c);
				} else {
					switch(_g1) {
					case 34:
						let bs = bs_buf.b;
						result_b += Std.string(bs);
						result_b += Std.string(bs);
						bs_buf = new StringBuf();
						result_b += "\\\"";
						break;
					case 92:
						bs_buf.b += "\\";
						break;
					default:
						let c = _g1;
						if(bs_buf.b.length > 0) {
							result_b += Std.string(bs_buf.b);
							bs_buf = new StringBuf();
						}
						result_b += String.fromCodePoint(c);
					}
				}
			}
			result_b += Std.string(bs_buf.b);
			if(needquote) {
				result_b += Std.string(bs_buf.b);
				result_b += "\"";
			}
			argument1 = result_b;
		}
		if(escapeMetaCharacters) {
			let result_b = "";
			let _g = 0;
			let _g1 = argument1.length;
			while(_g < _g1) {
				let c = HxOverrides.cca(argument1,_g++);
				if(haxe_SysTools.winMetaCharacters.indexOf(c) >= 0) {
					result_b += String.fromCodePoint(94);
				}
				result_b += String.fromCodePoint(c);
			}
			return result_b;
		} else {
			return argument1;
		}
	}
	static utf16CodePointAt(s,index) {
		let c = s.charCodeAt(index);
		if(c >= 55296 && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
		}
		return c;
	}
}
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = "StringTools";
var ValueType = $hxEnums["ValueType"] = { __ename__:"ValueType",__constructs__:null
	,TNull: {_hx_name:"TNull",_hx_index:0,__enum__:"ValueType",toString:$estr}
	,TInt: {_hx_name:"TInt",_hx_index:1,__enum__:"ValueType",toString:$estr}
	,TFloat: {_hx_name:"TFloat",_hx_index:2,__enum__:"ValueType",toString:$estr}
	,TBool: {_hx_name:"TBool",_hx_index:3,__enum__:"ValueType",toString:$estr}
	,TObject: {_hx_name:"TObject",_hx_index:4,__enum__:"ValueType",toString:$estr}
	,TFunction: {_hx_name:"TFunction",_hx_index:5,__enum__:"ValueType",toString:$estr}
	,TClass: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TClass",$_.__params__ = ["c"],$_)
	,TEnum: ($_=function(e) { return {_hx_index:7,e:e,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TEnum",$_.__params__ = ["e"],$_)
	,TUnknown: {_hx_name:"TUnknown",_hx_index:8,__enum__:"ValueType",toString:$estr}
};
ValueType.__constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TClass,ValueType.TEnum,ValueType.TUnknown];
ValueType.__empty_constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TUnknown];
class Type {
	static getClass(o) {
		return js_Boot.getClass(o);
	}
	static getEnum(o) {
		if(o == null) {
			return null;
		}
		return $hxEnums[o.__enum__];
	}
	static getSuperClass(c) {
		return c.__super__;
	}
	static getClassName(c) {
		return c.__name__;
	}
	static getEnumName(e) {
		return e.__ename__;
	}
	static resolveClass(name) {
		return $hxClasses[name];
	}
	static resolveEnum(name) {
		return $hxEnums[name];
	}
	static createInstance(cl,args) {
		return new (Function.prototype.bind.apply(cl,[null].concat(args)));
	}
	static createEmptyInstance(cl) {
		return Object.create(cl.prototype);
	}
	static createEnum(e,constr,params) {
		let f = Reflect.field(e,constr);
		if(f == null) {
			throw haxe_Exception.thrown("No such constructor " + constr);
		}
		if(Reflect.isFunction(f)) {
			if(params == null) {
				throw haxe_Exception.thrown("Constructor " + constr + " need parameters");
			}
			return f.apply(e,params);
		}
		if(params != null && params.length != 0) {
			throw haxe_Exception.thrown("Constructor " + constr + " does not need parameters");
		}
		return f;
	}
	static createEnumIndex(e,index,params) {
		let c;
		let _g = e.__constructs__[index];
		if(_g == null) {
			c = null;
		} else {
			let ctor = _g;
			c = ctor._hx_name;
		}
		if(c == null) {
			throw haxe_Exception.thrown(index + " is not a valid enum constructor index");
		}
		return Type.createEnum(e,c,params);
	}
	static getInstanceFields(c) {
		let result = [];
		while(c != null) {
			let _g = 0;
			let _g1 = Object.getOwnPropertyNames(c.prototype);
			while(_g < _g1.length) {
				let name = _g1[_g];
				++_g;
				switch(name) {
				case "__class__":case "__properties__":case "constructor":
					break;
				default:
					if(result.indexOf(name) == -1) {
						result.push(name);
					}
				}
			}
			c = c.__super__;
		}
		return result;
	}
	static getClassFields(c) {
		let a = Object.getOwnPropertyNames(c);
		HxOverrides.remove(a,"__id__");
		HxOverrides.remove(a,"hx__closures__");
		HxOverrides.remove(a,"__name__");
		HxOverrides.remove(a,"__interfaces__");
		HxOverrides.remove(a,"__isInterface__");
		HxOverrides.remove(a,"__properties__");
		HxOverrides.remove(a,"__instanceFields__");
		HxOverrides.remove(a,"__super__");
		HxOverrides.remove(a,"__meta__");
		HxOverrides.remove(a,"prototype");
		HxOverrides.remove(a,"name");
		HxOverrides.remove(a,"length");
		return a;
	}
	static getEnumConstructs(e) {
		let _this = e.__constructs__;
		let result = new Array(_this.length);
		let _g = 0;
		let _g1 = _this.length;
		while(_g < _g1) {
			let i = _g++;
			result[i] = _this[i]._hx_name;
		}
		return result;
	}
	static typeof(v) {
		switch(typeof(v)) {
		case "boolean":
			return ValueType.TBool;
		case "function":
			if(v.__name__ || v.__ename__) {
				return ValueType.TObject;
			}
			return ValueType.TFunction;
		case "number":
			if(Math.ceil(v) == v % 2147483648.0) {
				return ValueType.TInt;
			}
			return ValueType.TFloat;
		case "object":
			if(v == null) {
				return ValueType.TNull;
			}
			let e = v.__enum__;
			if(e != null) {
				return ValueType.TEnum($hxEnums[e]);
			}
			let c = js_Boot.getClass(v);
			if(c != null) {
				return ValueType.TClass(c);
			}
			return ValueType.TObject;
		case "string":
			return ValueType.TClass(String);
		case "undefined":
			return ValueType.TNull;
		default:
			return ValueType.TUnknown;
		}
	}
	static enumEq(a,b) {
		if(a == b) {
			return true;
		}
		try {
			let e = a.__enum__;
			if(e == null || e != b.__enum__) {
				return false;
			}
			if(a._hx_index != b._hx_index) {
				return false;
			}
			let enm = $hxEnums[e];
			let params = enm.__constructs__[a._hx_index].__params__;
			let _g = 0;
			while(_g < params.length) {
				let f = params[_g];
				++_g;
				if(!Type.enumEq(a[f],b[f])) {
					return false;
				}
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return false;
		}
		return true;
	}
	static enumConstructor(e) {
		return $hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name;
	}
	static enumParameters(e) {
		let enm = $hxEnums[e.__enum__];
		let params = enm.__constructs__[e._hx_index].__params__;
		if(params != null) {
			let _g = [];
			let _g1 = 0;
			while(_g1 < params.length) {
				let p = params[_g1];
				++_g1;
				_g.push(e[p]);
			}
			return _g;
		} else {
			return [];
		}
	}
	static enumIndex(e) {
		return e._hx_index;
	}
	static allEnums(e) {
		return e.__empty_constructs__.slice();
	}
}
$hxClasses["Type"] = Type;
Type.__name__ = "Type";
class UInt {
	static add(a,b) {
		return a + b;
	}
	static div(a,b) {
		return UInt.toFloat(a) / UInt.toFloat(b);
	}
	static mul(a,b) {
		return a * b;
	}
	static sub(a,b) {
		return a - b;
	}
	static gt(a,b) {
		let aNeg = a < 0;
		if(aNeg != b < 0) {
			return aNeg;
		} else {
			return a > b;
		}
	}
	static gte(a,b) {
		let aNeg = a < 0;
		if(aNeg != b < 0) {
			return aNeg;
		} else {
			return a >= b;
		}
	}
	static lt(a,b) {
		return UInt.gt(b,a);
	}
	static lte(a,b) {
		return UInt.gte(b,a);
	}
	static and(a,b) {
		return a & b;
	}
	static or(a,b) {
		return a | b;
	}
	static xor(a,b) {
		return a ^ b;
	}
	static shl(a,b) {
		return a << b;
	}
	static shr(a,b) {
		return a >>> b;
	}
	static ushr(a,b) {
		return a >>> b;
	}
	static mod(a,b) {
		return UInt.toFloat(a) % UInt.toFloat(b) | 0;
	}
	static addWithFloat(a,b) {
		return UInt.toFloat(a) + b;
	}
	static mulWithFloat(a,b) {
		return UInt.toFloat(a) * b;
	}
	static divFloat(a,b) {
		return UInt.toFloat(a) / b;
	}
	static floatDiv(a,b) {
		return a / UInt.toFloat(b);
	}
	static subFloat(a,b) {
		return UInt.toFloat(a) - b;
	}
	static floatSub(a,b) {
		return a - UInt.toFloat(b);
	}
	static gtFloat(a,b) {
		return UInt.toFloat(a) > b;
	}
	static equalsInt(a,b) {
		return a == b;
	}
	static notEqualsInt(a,b) {
		return a != b;
	}
	static equalsFloat(a,b) {
		return UInt.toFloat(a) == b;
	}
	static notEqualsFloat(a,b) {
		return UInt.toFloat(a) != b;
	}
	static gteFloat(a,b) {
		return UInt.toFloat(a) >= b;
	}
	static floatGt(a,b) {
		return a > UInt.toFloat(b);
	}
	static floatGte(a,b) {
		return a >= UInt.toFloat(b);
	}
	static ltFloat(a,b) {
		return UInt.toFloat(a) < b;
	}
	static lteFloat(a,b) {
		return UInt.toFloat(a) <= b;
	}
	static floatLt(a,b) {
		return a < UInt.toFloat(b);
	}
	static floatLte(a,b) {
		return a <= UInt.toFloat(b);
	}
	static modFloat(a,b) {
		return UInt.toFloat(a) % b;
	}
	static floatMod(a,b) {
		return a % UInt.toFloat(b);
	}
	static negBits(this1) {
		return ~this1;
	}
	static prefixIncrement(this1) {
		return ++this1;
	}
	static postfixIncrement(this1) {
		return this1++;
	}
	static prefixDecrement(this1) {
		return --this1;
	}
	static postfixDecrement(this1) {
		return this1--;
	}
	static toString(this1,radix) {
		return Std.string(UInt.toFloat(this1));
	}
	static toInt(this1) {
		return this1;
	}
	static toFloat(this1) {
		if(this1 < 0) {
			return 4294967296.0 + this1;
		} else {
			return this1 + 0.0;
		}
	}
}
class dropecho_interop_AbstractArray {
	static _new(a) {
		let this1;
		if(a != null) {
			this1 = a;
		} else {
			this1 = [];
		}
		return this1;
	}
	static get(this1,i) {
		return this1[i];
	}
	static set(this1,i,v) {
		return this1[i] = v;
	}
	static fromAny(d) {
		let arr = js_Boot.__cast(d , Array);
		let _g = [];
		let _g1 = 0;
		while(_g1 < arr.length) _g.push(arr[_g1++]);
		return dropecho_interop_AbstractArray._new(_g);
	}
}
class dropecho_interop_AbstractMap {
	static _new(s) {
		let this1;
		if(s != null) {
			this1 = s;
		} else {
			this1 = { };
		}
		return this1;
	}
	static fromDynamic(map) {
		return dropecho_interop_AbstractMap._new(map);
	}
	static fromDynamicAccess(map) {
		return dropecho_interop_AbstractMap._new(map);
	}
	static fromMap(map) {
		let abs = dropecho_interop_AbstractMap._new();
		let _g = map.keyValueIterator();
		while(_g.hasNext()) {
			let _g1 = _g.next();
			abs[Std.string(_g1.key)] = _g1.value;
		}
		return abs;
	}
	static fromIMap(map) {
		let abs = dropecho_interop_AbstractMap._new();
		let _g = map.keyValueIterator();
		while(_g.hasNext()) {
			let _g1 = _g.next();
			abs[Std.string(_g1.key)] = _g1.value;
		}
		return abs;
	}
	static get(this1,key) {
		return this1[Std.string(key)];
	}
	static set(this1,key,value) {
		this1[Std.string(key)] = value;
		return value;
	}
	static clear(this1) {
		let _g = 0;
		let _g1 = Reflect.fields(this1);
		while(_g < _g1.length) Reflect.deleteField(this1,_g1[_g++]);
	}
}
class haxe_ds_Map {
	static set(this1,key,value) {
		this1.set(key,value);
	}
	static get(this1,key) {
		return this1.get(key);
	}
	static exists(this1,key) {
		return this1.exists(key);
	}
	static remove(this1,key) {
		return this1.remove(key);
	}
	static keys(this1) {
		return this1.keys();
	}
	static iterator(this1) {
		return this1.iterator();
	}
	static keyValueIterator(this1) {
		return this1.keyValueIterator();
	}
	static copy(this1) {
		return this1.copy();
	}
	static toString(this1) {
		return this1.toString();
	}
	static clear(this1) {
		this1.clear();
	}
	static arrayWrite(this1,k,v) {
		this1.set(k,v);
		return v;
	}
	static toStringMap(t) {
		return new haxe_ds_StringMap();
	}
	static toIntMap(t) {
		return new haxe_ds_IntMap();
	}
	static toEnumValueMapMap(t) {
		return new haxe_ds_EnumValueMap();
	}
	static toObjectMap(t) {
		return new haxe_ds_ObjectMap();
	}
	static fromStringMap(map) {
		return map;
	}
	static fromIntMap(map) {
		return map;
	}
	static fromObjectMap(map) {
		return map;
	}
}
class js_Boot {
	static isClass(o) {
		return o.__name__;
	}
	static isInterface(o) {
		return o.__isInterface__;
	}
	static isEnum(e) {
		return e.__ename__;
	}
	static getClass(o) {
		if(o == null) {
			return null;
		} else if(((o) instanceof Array)) {
			return Array;
		} else {
			let cl = o.__class__;
			if(cl != null) {
				return cl;
			}
			let name = js_Boot.__nativeClassName(o);
			if(name != null) {
				return js_Boot.__resolveNativeClass(name);
			}
			return null;
		}
	}
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
				haxe_NativeStackTrace.lastError = _g;
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
	static __interfLoop(cc,cl) {
		while(true) {
			if(cc == null) {
				return false;
			}
			if(cc == cl) {
				return true;
			}
			let intf = cc.__interfaces__;
			if(intf != null && (cc.__super__ == null || cc.__super__.__interfaces__ != intf)) {
				let _g = 0;
				let _g1 = intf.length;
				while(_g < _g1) {
					let i = intf[_g++];
					if(i == cl || js_Boot.__interfLoop(i,cl)) {
						return true;
					}
				}
			}
			cc = cc.__super__;
		}
	}
	static __instanceof(o,cl) {
		if(cl == null) {
			return false;
		}
		switch(cl) {
		case Array:
			return ((o) instanceof Array);
		case Bool:
			return typeof(o) == "boolean";
		case Dynamic:
			return o != null;
		case Float:
			return typeof(o) == "number";
		case Int:
			if(typeof(o) == "number") {
				return ((o | 0) === o);
			} else {
				return false;
			}
			break;
		case String:
			return typeof(o) == "string";
		default:
			if(o != null) {
				if(typeof(cl) == "function") {
					if(js_Boot.__downcastCheck(o,cl)) {
						return true;
					}
				} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
					if(((o) instanceof cl)) {
						return true;
					}
				}
			} else {
				return false;
			}
			if(cl == Class ? o.__name__ != null : false) {
				return true;
			}
			if(cl == Enum ? o.__ename__ != null : false) {
				return true;
			}
			return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
		}
	}
	static __downcastCheck(o,cl) {
		if(!((o) instanceof cl)) {
			if(cl.__isInterface__) {
				return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	static __implements(o,iface) {
		return js_Boot.__interfLoop(js_Boot.getClass(o),iface);
	}
	static __cast(o,t) {
		if(o == null || js_Boot.__instanceof(o,t)) {
			return o;
		} else {
			throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
		}
	}
	static __nativeClassName(o) {
		let name = js_Boot.__toStr.call(o).slice(8,-1);
		if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
			return null;
		}
		return name;
	}
	static __isNativeObj(o) {
		return js_Boot.__nativeClassName(o) != null;
	}
	static __resolveNativeClass(name) {
		return $global[name];
	}
}
js_Boot.__toStr = null;
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = "js.Boot";
class dropecho_storygen_Functions {
	static set(name,func) {
		dropecho_storygen_Functions.funcs.h[name] = func;
	}
	static get(name) {
		return dropecho_storygen_Functions.funcs.h[name];
	}
}
$hxClasses["dropecho.storygen.Functions"] = $hx_exports["Functions"] = dropecho_storygen_Functions;
dropecho_storygen_Functions.__name__ = "dropecho.storygen.Functions";
class dropecho_storygen_GeneratorOutput {
	constructor() {
	}
}
$hxClasses["dropecho.storygen.GeneratorOutput"] = dropecho_storygen_GeneratorOutput;
dropecho_storygen_GeneratorOutput.__name__ = "dropecho.storygen.GeneratorOutput";
Object.assign(dropecho_storygen_GeneratorOutput.prototype, {
	__class__: dropecho_storygen_GeneratorOutput
	,seed: null
	,output: null
	,memory: null
});
class dropecho_storygen_Generator {
	constructor(grammars) {
		let map_h = Object.create(null);
		let abs = dropecho_interop_AbstractMap._new();
		let _g_keys = Object.keys(map_h);
		let _g_length = _g_keys.length;
		let _g_current = 0;
		while(_g_current < _g_length) {
			let key = _g_keys[_g_current++];
			abs[Std.string(key)] = map_h[key];
		}
		this.memory = abs;
		this.random = new seedyrng_Random();
		this.matcher = new EReg("(#.*?#)","");
		this.grammars = grammars;
	}
	getSeed() {
		return haxe_Int64.toString(this.random.get_seed());
	}
	mergeGrammar(grammars) {
		let access = grammars;
		let _g_keys = Reflect.fields(access);
		let _g_index = 0;
		while(_g_index < _g_keys.length) {
			let key = _g_keys[_g_index++];
			this.grammars[key == null ? "null" : "" + key] = access[key];
		}
	}
	inMemory(symbol) {
		return Object.prototype.hasOwnProperty.call(this.memory,symbol);
	}
	expand(token) {
		if(token.isMemorized || Object.prototype.hasOwnProperty.call(this.memory,token.symbol)) {
			let sym = token.memSymbol != null ? token.memSymbol : token.symbol;
			if(Object.prototype.hasOwnProperty.call(this.memory,sym)) {
				return this.memory[sym == null ? "null" : "" + sym];
			}
		}
		let s = token.symbol;
		if(token.isFunction) {
			let func = dropecho_storygen_Functions.get(token.symbol);
			if(func != null) {
				return func(this,token.functionArgs);
			} else {
				throw haxe_Exception.thrown("\n\t\t\t\t\tNo function \"" + s + "\" exists on the function object.\n\t\t\t\t\tDouble check spelling (#random(5,10)#) or add function to Functions.\n\t\t\t\t\texample:\n\t\t\t\t\t``` storygen.Functions.set(\"myFunc\", (s:String) => return \"hi\");```\n\t\t\t\t");
			}
		}
		let grammar = this.grammars[s == null ? "null" : "" + s];
		if(grammar == null) {
			throw haxe_Exception.thrown("\n\t\t\t\tNo symbol \"" + s + "\" exists in your grammar.\n\t\t\t\tEnsure the object/map contains an array for this or\n\t\t\t\tthat you have stored this in memory.\n\t\t\t\texample: ``` var grammar = {" + s + ": [\"choice1\", \"choice2\"]}; ```\n\t\t\t\texample: ``` var grammar = {\"example\": [\"#" + s + ":some_other#\"]}; ```\n\t\t\t");
		}
		if(grammar.length <= 0) {
			throw haxe_Exception.thrown("\n\t\t\t\tNo choices in grammar for symbol \"" + s + "\", has 0 elements.\n\t\t\t\tTry adding some.\n\t\t\t\texample: ``` var grammar = {" + s + ": [\"choice1\", \"choice2\"]}; ```\n\t\t\t");
		}
		return grammar[this.random.randomInt(0,grammar.length - 1)];
	}
	doTransforms(s,token) {
		let _g = 0;
		let _g1 = token.transforms;
		while(_g < _g1.length) {
			let transform = _g1[_g];
			++_g;
			let t = dropecho_storygen_Transforms.get(transform);
			if(t == null) {
				throw haxe_Exception.thrown("\n              No transform \"" + transform + "\" exists on the transforms object.\n              Double check spelling (#sym.capitalize#) or add transform to Transforms.\n              example: \n              ``` storygen.Transforms.set(\"myTransform\", (s:String) => return \"hi\");```\n            ");
			} else {
				s = t(s);
			}
		}
		return s;
	}
	parse(string) {
		let tempMemory = [];
		while(this.matcher.match(string)) {
			let token = new dropecho_storygen_Token(this.matcher.matched(1));
			let expanded = this.expand(token);
			if(!token.isValid) {
				continue;
			}
			expanded = this.parse(expanded);
			if(token.isTransformed) {
				expanded = this.doTransforms(expanded,token);
			}
			if(token.isMemorized) {
				this.memory[Std.string(token.memSymbol)] = expanded;
				if(token.memSymbol.charAt(0) == "_") {
					tempMemory.push(token.memSymbol);
				}
			}
			if(token.isSilent) {
				string = string.replace(this.matcher.r,"");
			} else {
				string = string.replace(this.matcher.r,expanded);
			}
		}
		let _g = 0;
		while(_g < tempMemory.length) Reflect.deleteField(this.memory,tempMemory[_g++]);
		return string;
	}
	run(from,seed) {
		if(seed == null) {
			seed = "";
		}
		if(seed != null && seed != "") {
			seed = (seed == null ? "null" : "" + seed).split(".")[0];
			this.random.setStringSeed(seed);
		}
		let out;
		if(from.charAt(0) != "#") {
			out = this.parse("#" + from + "#");
		}
		out = this.parse(from);
		let this1 = this.memory;
		let _g = 0;
		let _g1 = Reflect.fields(this1);
		while(_g < _g1.length) Reflect.deleteField(this1,_g1[_g++]);
		return out;
	}
	runAdvanced(from,seed) {
		if(seed == null) {
			seed = "";
		}
		if(seed != null && seed != "") {
			seed = (seed == null ? "null" : "" + seed).split(".")[0];
			this.random.setStringSeed(seed);
		}
		let output = this.parse(from);
		let memory_h = Object.create(null);
		let access = this.memory;
		let _g1_keys = Reflect.fields(access);
		let _g1_index = 0;
		while(_g1_index < _g1_keys.length) {
			let key = _g1_keys[_g1_index++];
			memory_h[key] = access[key];
		}
		let this1 = this.memory;
		let _g = 0;
		let _g1 = Reflect.fields(this1);
		while(_g < _g1.length) Reflect.deleteField(this1,_g1[_g++]);
		let genOutput = new dropecho_storygen_GeneratorOutput();
		genOutput.seed = this.getSeed();
		genOutput.output = output;
		let abs = dropecho_interop_AbstractMap._new();
		let _g_keys = Object.keys(memory_h);
		let _g_length = _g_keys.length;
		let _g_current = 0;
		while(_g_current < _g_length) {
			let key = _g_keys[_g_current++];
			abs[Std.string(key)] = memory_h[key];
		}
		genOutput.memory = abs;
		return genOutput;
	}
	static configFromJson(json) {
		let json1 = JSON.parse(json);
		let _g = new haxe_ds_StringMap();
		let _g1 = 0;
		let _g2 = Reflect.fields(json1);
		while(_g1 < _g2.length) {
			let f = _g2[_g1];
			++_g1;
			_g.h[f] = Reflect.field(json1,f);
		}
		return _g;
	}
}
$hxClasses["dropecho.storygen.Generator"] = $hx_exports["Generator"] = dropecho_storygen_Generator;
dropecho_storygen_Generator.__name__ = "dropecho.storygen.Generator";
Object.assign(dropecho_storygen_Generator.prototype, {
	__class__: dropecho_storygen_Generator
	,matcher: null
	,random: null
	,memory: null
	,grammars: null
});
class dropecho_storygen_Token {
	constructor(text) {
		this.isFunctionCall = new EReg("(.*)\\((.*)\\)","");
		this.shouldBeTransformed = new EReg("(.*?)\\.(.*)","");
		this.shouldBeMemorized = new EReg("(.*):(.*)","");
		this.shouldBeSilent = new EReg("\\[(.*?)\\]","");
		this.isValidToken = new EReg("#(.*?)#","");
		this.transforms = [];
		this.functionArgs = [];
		this.origText = text;
		this.isValid = this.isValidToken.match(text);
		if(this.isValid) {
			let token = this.isValidToken.matched(1);
			if(this.isSilent = this.shouldBeSilent.match(token)) {
				token = this.shouldBeSilent.matched(1);
			}
			if(this.isMemorized = this.shouldBeMemorized.match(token)) {
				this.memSymbol = this.shouldBeMemorized.matched(1);
				token = this.shouldBeMemorized.matched(2);
			}
			if(this.isTransformed = this.shouldBeTransformed.match(token)) {
				token = this.shouldBeTransformed.matched(1);
				this.transforms = this.shouldBeTransformed.matched(2).split(".");
			}
			if(this.isFunction = this.isFunctionCall.match(token)) {
				token = this.isFunctionCall.matched(1);
				let _this = this.isFunctionCall.matched(2).split(",");
				let result = new Array(_this.length);
				let _g = 0;
				let _g1 = _this.length;
				while(_g < _g1) {
					let i = _g++;
					result[i] = StringTools.trim(_this[i]);
				}
				let _g2 = [];
				let _g3 = 0;
				while(_g3 < result.length) {
					let v = result[_g3];
					++_g3;
					if(v != null && v != "") {
						_g2.push(v);
					}
				}
				this.functionArgs = _g2;
			}
			this.symbol = token;
		}
	}
}
$hxClasses["dropecho.storygen.Token"] = dropecho_storygen_Token;
dropecho_storygen_Token.__name__ = "dropecho.storygen.Token";
Object.assign(dropecho_storygen_Token.prototype, {
	__class__: dropecho_storygen_Token
	,willWriteToMemory: null
	,silent: null
	,symbol: null
	,memSymbol: null
	,functionArgs: null
	,transforms: null
	,isValid: null
	,isMemorized: null
	,isTransformed: null
	,isFunction: null
	,isSilent: null
	,origText: null
	,isValidToken: null
	,shouldBeSilent: null
	,shouldBeMemorized: null
	,shouldBeTransformed: null
	,isFunctionCall: null
});
class dropecho_storygen_Transforms {
	static isVowel(s) {
		return "aeiou".indexOf(s.charAt(0)) != -1;
	}
	static capitalize(s) {
		let chars = s.split("");
		return chars.shift().toUpperCase() + chars.join("");
	}
	static a(s) {
		if(dropecho_storygen_Transforms.isVowel(s.charAt(0))) {
			return "an " + s;
		} else {
			return "a " + s;
		}
	}
	static pluralize(s) {
		let end;
		switch(s.charAt(s.length - 1)) {
		case "h":
			end = "es";
			break;
		case "y":
			s = HxOverrides.substr(s,0,s.length - 1);
			end = "ies";
			break;
		default:
			end = "s";
		}
		return "" + s + end;
	}
	static get(name) {
		if(Object.prototype.hasOwnProperty.call(dropecho_storygen_Transforms.userTransforms.h,name)) {
			return dropecho_storygen_Transforms.userTransforms.h[name];
		}
		return Reflect.field(dropecho_storygen_Transforms,name);
	}
	static set(name,trans) {
		dropecho_storygen_Transforms.userTransforms.h[name] = trans;
	}
}
$hxClasses["dropecho.storygen.Transforms"] = $hx_exports["Transforms"] = dropecho_storygen_Transforms;
dropecho_storygen_Transforms.__name__ = "dropecho.storygen.Transforms";
var haxe_StackItem = $hxEnums["haxe.StackItem"] = { __ename__:"haxe.StackItem",__constructs__:null
	,CFunction: {_hx_name:"CFunction",_hx_index:0,__enum__:"haxe.StackItem",toString:$estr}
	,Module: ($_=function(m) { return {_hx_index:1,m:m,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="Module",$_.__params__ = ["m"],$_)
	,FilePos: ($_=function(s,file,line,column) { return {_hx_index:2,s:s,file:file,line:line,column:column,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="FilePos",$_.__params__ = ["s","file","line","column"],$_)
	,Method: ($_=function(classname,method) { return {_hx_index:3,classname:classname,method:method,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="Method",$_.__params__ = ["classname","method"],$_)
	,LocalFunction: ($_=function(v) { return {_hx_index:4,v:v,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="LocalFunction",$_.__params__ = ["v"],$_)
};
haxe_StackItem.__constructs__ = [haxe_StackItem.CFunction,haxe_StackItem.Module,haxe_StackItem.FilePos,haxe_StackItem.Method,haxe_StackItem.LocalFunction];
haxe_StackItem.__empty_constructs__ = [haxe_StackItem.CFunction];
class haxe_CallStack {
	static get_length(this1) {
		return this1.length;
	}
	static callStack() {
		return haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.callStack());
	}
	static exceptionStack(fullStack) {
		if(fullStack == null) {
			fullStack = false;
		}
		let eStack = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.exceptionStack());
		return fullStack ? eStack : haxe_CallStack.subtract(eStack,haxe_CallStack.callStack());
	}
	static toString(stack) {
		let b = new StringBuf();
		let _g = 0;
		let _g1 = stack;
		while(_g < _g1.length) {
			let s = _g1[_g++];
			b.b += "\nCalled from ";
			haxe_CallStack.itemToString(b,s);
		}
		return b.b;
	}
	static subtract(this1,stack) {
		let startIndex = -1;
		let i = -1;
		while(++i < this1.length) {
			let _g = 0;
			let _g1 = stack.length;
			while(_g < _g1) if(haxe_CallStack.equalItems(this1[i],stack[_g++])) {
				if(startIndex < 0) {
					startIndex = i;
				}
				++i;
				if(i >= this1.length) {
					break;
				}
			} else {
				startIndex = -1;
			}
			if(startIndex >= 0) {
				break;
			}
		}
		if(startIndex >= 0) {
			return this1.slice(0,startIndex);
		} else {
			return this1;
		}
	}
	static copy(this1) {
		return this1.slice();
	}
	static get(this1,index) {
		return this1[index];
	}
	static asArray(this1) {
		return this1;
	}
	static equalItems(item1,item2) {
		if(item1 == null) {
			if(item2 == null) {
				return true;
			} else {
				return false;
			}
		} else {
			switch(item1._hx_index) {
			case 0:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 0) {
					return true;
				} else {
					return false;
				}
				break;
			case 1:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 1) {
					return item1.m == item2.m;
				} else {
					return false;
				}
				break;
			case 2:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 2) {
					if(item1.file == item2.file && item1.line == item2.line && item1.column == item2.column) {
						return haxe_CallStack.equalItems(item1.s,item2.s);
					} else {
						return false;
					}
				} else {
					return false;
				}
				break;
			case 3:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 3) {
					if(item1.classname == item2.classname) {
						return item1.method == item2.method;
					} else {
						return false;
					}
				} else {
					return false;
				}
				break;
			case 4:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 4) {
					return item1.v == item2.v;
				} else {
					return false;
				}
				break;
			}
		}
	}
	static exceptionToString(e) {
		if(e.get_previous() == null) {
			let tmp = "Exception: " + e.toString();
			let tmp1 = e.get_stack();
			return tmp + (tmp1 == null ? "null" : haxe_CallStack.toString(tmp1));
		}
		let result = "";
		let e1 = e;
		let prev = null;
		while(e1 != null) {
			if(prev == null) {
				let result1 = "Exception: " + e1.get_message();
				let tmp = e1.get_stack();
				result = result1 + (tmp == null ? "null" : haxe_CallStack.toString(tmp)) + result;
			} else {
				let prevStack = haxe_CallStack.subtract(e1.get_stack(),prev.get_stack());
				result = "Exception: " + e1.get_message() + (prevStack == null ? "null" : haxe_CallStack.toString(prevStack)) + "\n\nNext " + result;
			}
			prev = e1;
			e1 = e1.get_previous();
		}
		return result;
	}
	static itemToString(b,s) {
		switch(s._hx_index) {
		case 0:
			b.b += "a C function";
			break;
		case 1:
			let _g = s.m;
			b.b = (b.b += "module ") + (_g == null ? "null" : "" + _g);
			break;
		case 2:
			let _g1 = s.s;
			let _g2 = s.file;
			let _g3 = s.line;
			let _g4 = s.column;
			if(_g1 != null) {
				haxe_CallStack.itemToString(b,_g1);
				b.b += " (";
			}
			b.b = (b.b += _g2 == null ? "null" : "" + _g2) + " line ";
			b.b += _g3 == null ? "null" : "" + _g3;
			if(_g4 != null) {
				b.b = (b.b += " column ") + (_g4 == null ? "null" : "" + _g4);
			}
			if(_g1 != null) {
				b.b += ")";
			}
			break;
		case 3:
			let _g5 = s.classname;
			let _g6 = s.method;
			b.b = (b.b += Std.string(_g5 == null ? "<unknown>" : _g5)) + ".";
			b.b += _g6 == null ? "null" : "" + _g6;
			break;
		case 4:
			let _g7 = s.v;
			b.b = (b.b += "local function #") + (_g7 == null ? "null" : "" + _g7);
			break;
		}
	}
}
haxe_CallStack.__properties__ = {get_length: "get_length"};
class haxe_IMap {
}
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = "haxe.IMap";
haxe_IMap.__isInterface__ = true;
Object.assign(haxe_IMap.prototype, {
	__class__: haxe_IMap
	,get: null
	,set: null
	,exists: null
	,remove: null
	,keys: null
	,iterator: null
	,keyValueIterator: null
	,copy: null
	,toString: null
	,clear: null
});
class haxe_DynamicAccess {
	static _new() {
		return { };
	}
	static get(this1,key) {
		return this1[key];
	}
	static set(this1,key,value) {
		return this1[key] = value;
	}
	static exists(this1,key) {
		return Object.prototype.hasOwnProperty.call(this1,key);
	}
	static remove(this1,key) {
		return Reflect.deleteField(this1,key);
	}
	static keys(this1) {
		return Reflect.fields(this1);
	}
	static copy(this1) {
		return Reflect.copy(this1);
	}
	static iterator(this1) {
		return new haxe_iterators_DynamicAccessIterator(this1);
	}
	static keyValueIterator(this1) {
		return new haxe_iterators_DynamicAccessKeyValueIterator(this1);
	}
}
class haxe_Exception extends Error {
	constructor(message,previous,native) {
		super(message);
		this.message = message;
		this.__previousException = previous;
		this.__nativeException = native != null ? native : this;
		this.__skipStack = 0;
		let old = Error.prepareStackTrace;
		Error.prepareStackTrace = function(e) { return e.stack; }
		if(((native) instanceof Error)) {
			this.stack = native.stack;
		} else {
			let e = null;
			if(Error.captureStackTrace) {
				Error.captureStackTrace(this,haxe_Exception);
				e = this;
			} else {
				e = new Error();
				if(typeof(e.stack) == "undefined") {
					try { throw e; } catch(_) {}
					this.__skipStack++;
				}
			}
			this.stack = e.stack;
		}
		Error.prepareStackTrace = old;
	}
	unwrap() {
		return this.__nativeException;
	}
	toString() {
		return this.get_message();
	}
	details() {
		if(this.get_previous() == null) {
			let tmp = "Exception: " + this.toString();
			let tmp1 = this.get_stack();
			return tmp + (tmp1 == null ? "null" : haxe_CallStack.toString(tmp1));
		} else {
			let result = "";
			let e = this;
			let prev = null;
			while(e != null) {
				if(prev == null) {
					let result1 = "Exception: " + e.get_message();
					let tmp = e.get_stack();
					result = result1 + (tmp == null ? "null" : haxe_CallStack.toString(tmp)) + result;
				} else {
					let prevStack = haxe_CallStack.subtract(e.get_stack(),prev.get_stack());
					result = "Exception: " + e.get_message() + (prevStack == null ? "null" : haxe_CallStack.toString(prevStack)) + "\n\nNext " + result;
				}
				prev = e;
				e = e.get_previous();
			}
			return result;
		}
	}
	__shiftStack() {
		this.__skipStack++;
	}
	get_message() {
		return this.message;
	}
	get_previous() {
		return this.__previousException;
	}
	get_native() {
		return this.__nativeException;
	}
	get_stack() {
		let _g = this.__exceptionStack;
		if(_g == null) {
			let value = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.normalize(this.stack),this.__skipStack);
			this.setProperty("__exceptionStack",value);
			return value;
		} else {
			return _g;
		}
	}
	setProperty(name,value) {
		try {
			Object.defineProperty(this,name,{ value : value});
		} catch( _g ) {
			this[name] = value;
		}
	}
	get___exceptionStack() {
		return this.__exceptionStack;
	}
	set___exceptionStack(value) {
		this.setProperty("__exceptionStack",value);
		return value;
	}
	get___skipStack() {
		return this.__skipStack;
	}
	set___skipStack(value) {
		this.setProperty("__skipStack",value);
		return value;
	}
	get___nativeException() {
		return this.__nativeException;
	}
	set___nativeException(value) {
		this.setProperty("__nativeException",value);
		return value;
	}
	get___previousException() {
		return this.__previousException;
	}
	set___previousException(value) {
		this.setProperty("__previousException",value);
		return value;
	}
	static caught(value) {
		if(((value) instanceof haxe_Exception)) {
			return value;
		} else if(((value) instanceof Error)) {
			return new haxe_Exception(value.message,null,value);
		} else {
			return new haxe_ValueException(value,null,value);
		}
	}
	static thrown(value) {
		if(((value) instanceof haxe_Exception)) {
			return value.get_native();
		} else if(((value) instanceof Error)) {
			return value;
		} else {
			let e = new haxe_ValueException(value);
			e.__skipStack++;
			return e;
		}
	}
}
$hxClasses["haxe.Exception"] = haxe_Exception;
haxe_Exception.__name__ = "haxe.Exception";
haxe_Exception.__super__ = Error;
Object.assign(haxe_Exception.prototype, {
	__class__: haxe_Exception
	,__skipStack: null
	,__nativeException: null
	,__previousException: null
	,__properties__: {set___exceptionStack: "set___exceptionStack",get___exceptionStack: "get___exceptionStack",get_native: "get_native",get_previous: "get_previous",get_stack: "get_stack",get_message: "get_message"}
});
class haxe_Int32 {
	static negate(this1) {
		return ~this1 + 1 | 0;
	}
	static preIncrement(this1) {
		this1 = ++this1 | 0;
		return this1;
	}
	static postIncrement(this1) {
		let ret = this1++;
		this1 |= 0;
		return ret;
	}
	static preDecrement(this1) {
		this1 = --this1 | 0;
		return this1;
	}
	static postDecrement(this1) {
		let ret = this1--;
		this1 |= 0;
		return ret;
	}
	static add(a,b) {
		return a + b | 0;
	}
	static addInt(a,b) {
		return a + b | 0;
	}
	static sub(a,b) {
		return a - b | 0;
	}
	static subInt(a,b) {
		return a - b | 0;
	}
	static intSub(a,b) {
		return a - b | 0;
	}
	static mul(a,b) {
		return haxe_Int32._mul(a,b);
	}
	static mulInt(a,b) {
		return haxe_Int32._mul(a,b);
	}
	static toFloat(this1) {
		return this1;
	}
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
	static clamp(x) {
		return x | 0;
	}
}
class haxe_Int64 {
	static _new(x) {
		return x;
	}
	static copy(this1) {
		return new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
	}
	static make(high,low) {
		return new haxe__$Int64__$_$_$Int64(high,low);
	}
	static ofInt(x) {
		return new haxe__$Int64__$_$_$Int64(x >> 31,x);
	}
	static toInt(x) {
		if(x.high != x.low >> 31) {
			throw haxe_Exception.thrown("Overflow");
		}
		return x.low;
	}
	static is(val) {
		return ((val) instanceof haxe__$Int64__$_$_$Int64);
	}
	static isInt64(val) {
		return ((val) instanceof haxe__$Int64__$_$_$Int64);
	}
	static getHigh(x) {
		return x.high;
	}
	static getLow(x) {
		return x.low;
	}
	static isNeg(x) {
		return x.high < 0;
	}
	static isZero(x) {
		if(x.high == 0) {
			return x.low == 0;
		} else {
			return false;
		}
	}
	static compare(a,b) {
		let v = a.high - b.high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a.low,b.low);
		}
		if(a.high < 0) {
			if(b.high < 0) {
				return v;
			} else {
				return -1;
			}
		} else if(b.high >= 0) {
			return v;
		} else {
			return 1;
		}
	}
	static ucompare(a,b) {
		let v = haxe_Int32.ucompare(a.high,b.high);
		if(v != 0) {
			return v;
		} else {
			return haxe_Int32.ucompare(a.low,b.low);
		}
	}
	static toStr(x) {
		return haxe_Int64.toString(x);
	}
	static toString(this1) {
		let i = this1;
		if(i.high == 0 && i.low == 0) {
			return "0";
		}
		let str = "";
		let neg = false;
		if(i.high < 0) {
			neg = true;
		}
		let ten = new haxe__$Int64__$_$_$Int64(0,10);
		while(i.high != 0 || i.low != 0) {
			let r = haxe_Int64.divMod(i,ten);
			if(r.modulus.high < 0) {
				str = (~r.modulus.low + 1 | 0) + str;
				let x = r.quotient;
				let high = ~x.high;
				let low = ~x.low + 1 | 0;
				if(low == 0) {
					++high;
					high = high | 0;
				}
				i = new haxe__$Int64__$_$_$Int64(high,low);
			} else {
				str = r.modulus.low + str;
				i = r.quotient;
			}
		}
		if(neg) {
			str = "-" + str;
		}
		return str;
	}
	static parseString(sParam) {
		return haxe_Int64Helper.parseString(sParam);
	}
	static fromFloat(f) {
		return haxe_Int64Helper.fromFloat(f);
	}
	static divMod(dividend,divisor) {
		if(divisor.high == 0) {
			switch(divisor.low) {
			case 0:
				throw haxe_Exception.thrown("divide by zero");
			case 1:
				return { quotient : new haxe__$Int64__$_$_$Int64(dividend.high,dividend.low), modulus : new haxe__$Int64__$_$_$Int64(0,0)};
			}
		}
		let divSign = dividend.high < 0 != divisor.high < 0;
		let modulus;
		if(dividend.high < 0) {
			let high = ~dividend.high;
			let low = ~dividend.low + 1 | 0;
			if(low == 0) {
				++high;
				high = high | 0;
			}
			modulus = new haxe__$Int64__$_$_$Int64(high,low);
		} else {
			modulus = new haxe__$Int64__$_$_$Int64(dividend.high,dividend.low);
		}
		if(divisor.high < 0) {
			let high = ~divisor.high;
			let low = ~divisor.low + 1 | 0;
			if(low == 0) {
				++high;
				high = high | 0;
			}
			divisor = new haxe__$Int64__$_$_$Int64(high,low);
		}
		let quotient = new haxe__$Int64__$_$_$Int64(0,0);
		let mask = new haxe__$Int64__$_$_$Int64(0,1);
		while(!(divisor.high < 0)) {
			let v = haxe_Int32.ucompare(divisor.high,modulus.high);
			let cmp = v != 0 ? v : haxe_Int32.ucompare(divisor.low,modulus.low);
			divisor = new haxe__$Int64__$_$_$Int64(divisor.high << 1 | divisor.low >>> 31,divisor.low << 1);
			mask = new haxe__$Int64__$_$_$Int64(mask.high << 1 | mask.low >>> 31,mask.low << 1);
			if(cmp >= 0) {
				break;
			}
		}
		while(mask.high != 0 || mask.low != 0) {
			let v = haxe_Int32.ucompare(modulus.high,divisor.high);
			if((v != 0 ? v : haxe_Int32.ucompare(modulus.low,divisor.low)) >= 0) {
				quotient = new haxe__$Int64__$_$_$Int64(quotient.high | mask.high,quotient.low | mask.low);
				let high = modulus.high - divisor.high | 0;
				if(haxe_Int32.ucompare(modulus.low,divisor.low) < 0) {
					--high;
					high = high | 0;
				}
				modulus = new haxe__$Int64__$_$_$Int64(high,modulus.low - divisor.low | 0);
			}
			mask = new haxe__$Int64__$_$_$Int64(mask.high >>> 1,mask.high << 31 | mask.low >>> 1);
			divisor = new haxe__$Int64__$_$_$Int64(divisor.high >>> 1,divisor.high << 31 | divisor.low >>> 1);
		}
		if(divSign) {
			let high = ~quotient.high;
			let low = ~quotient.low + 1 | 0;
			if(low == 0) {
				++high;
				high = high | 0;
			}
			quotient = new haxe__$Int64__$_$_$Int64(high,low);
		}
		if(dividend.high < 0) {
			let high = ~modulus.high;
			let low = ~modulus.low + 1 | 0;
			if(low == 0) {
				++high;
				high = high | 0;
			}
			modulus = new haxe__$Int64__$_$_$Int64(high,low);
		}
		return { quotient : quotient, modulus : modulus};
	}
	static neg(x) {
		let high = ~x.high;
		let low = ~x.low + 1 | 0;
		if(low == 0) {
			++high;
			high = high | 0;
		}
		return new haxe__$Int64__$_$_$Int64(high,low);
	}
	static preIncrement(this1) {
		let x = new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
		this1 = x;
		x.low++;
		x.low = x.low | 0;
		if(x.low == 0) {
			x.high++;
			x.high = x.high | 0;
		}
		return x;
	}
	static postIncrement(this1) {
		let ret = this1;
		let x = new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
		this1 = x;
		x.low++;
		x.low = x.low | 0;
		if(x.low == 0) {
			x.high++;
			x.high = x.high | 0;
		}
		return ret;
	}
	static preDecrement(this1) {
		let x = new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
		this1 = x;
		if(x.low == 0) {
			x.high--;
			x.high = x.high | 0;
		}
		x.low--;
		x.low = x.low | 0;
		return x;
	}
	static postDecrement(this1) {
		let ret = this1;
		let x = new haxe__$Int64__$_$_$Int64(this1.high,this1.low);
		this1 = x;
		if(x.low == 0) {
			x.high--;
			x.high = x.high | 0;
		}
		x.low--;
		x.low = x.low | 0;
		return ret;
	}
	static add(a,b) {
		let high = a.high + b.high | 0;
		let low = a.low + b.low | 0;
		if(haxe_Int32.ucompare(low,a.low) < 0) {
			++high;
			high = high | 0;
		}
		return new haxe__$Int64__$_$_$Int64(high,low);
	}
	static addInt(a,b) {
		let high = a.high + (b >> 31) | 0;
		let low = a.low + b | 0;
		if(haxe_Int32.ucompare(low,a.low) < 0) {
			++high;
			high = high | 0;
		}
		return new haxe__$Int64__$_$_$Int64(high,low);
	}
	static sub(a,b) {
		let high = a.high - b.high | 0;
		if(haxe_Int32.ucompare(a.low,b.low) < 0) {
			--high;
			high = high | 0;
		}
		return new haxe__$Int64__$_$_$Int64(high,a.low - b.low | 0);
	}
	static subInt(a,b) {
		let b_low = b;
		let high = a.high - (b >> 31) | 0;
		if(haxe_Int32.ucompare(a.low,b_low) < 0) {
			--high;
			high = high | 0;
		}
		return new haxe__$Int64__$_$_$Int64(high,a.low - b_low | 0);
	}
	static intSub(a,b) {
		let a_low = a;
		let high = (a >> 31) - b.high | 0;
		if(haxe_Int32.ucompare(a_low,b.low) < 0) {
			--high;
			high = high | 0;
		}
		return new haxe__$Int64__$_$_$Int64(high,a_low - b.low | 0);
	}
	static mul(a,b) {
		let al = a.low & 65535;
		let ah = a.low >>> 16;
		let bl = b.low & 65535;
		let bh = b.low >>> 16;
		let p00 = haxe_Int32._mul(al,bl);
		let p10 = haxe_Int32._mul(ah,bl);
		let p01 = haxe_Int32._mul(al,bh);
		let low = p00;
		let high = (haxe_Int32._mul(ah,bh) + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
		p01 <<= 16;
		low = p00 + p01 | 0;
		if(haxe_Int32.ucompare(low,p01) < 0) {
			++high;
			high = high | 0;
		}
		p10 <<= 16;
		low = low + p10 | 0;
		if(haxe_Int32.ucompare(low,p10) < 0) {
			++high;
			high = high | 0;
		}
		high = high + (haxe_Int32._mul(a.low,b.high) + haxe_Int32._mul(a.high,b.low) | 0) | 0;
		return new haxe__$Int64__$_$_$Int64(high,low);
	}
	static mulInt(a,b) {
		let b_low = b;
		let al = a.low & 65535;
		let ah = a.low >>> 16;
		let bl = b_low & 65535;
		let bh = b_low >>> 16;
		let p00 = haxe_Int32._mul(al,bl);
		let p10 = haxe_Int32._mul(ah,bl);
		let p01 = haxe_Int32._mul(al,bh);
		let low = p00;
		let high = (haxe_Int32._mul(ah,bh) + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
		p01 <<= 16;
		low = p00 + p01 | 0;
		if(haxe_Int32.ucompare(low,p01) < 0) {
			++high;
			high = high | 0;
		}
		p10 <<= 16;
		low = low + p10 | 0;
		if(haxe_Int32.ucompare(low,p10) < 0) {
			++high;
			high = high | 0;
		}
		high = high + (haxe_Int32._mul(a.low,b >> 31) + haxe_Int32._mul(a.high,b_low) | 0) | 0;
		return new haxe__$Int64__$_$_$Int64(high,low);
	}
	static div(a,b) {
		return haxe_Int64.divMod(a,b).quotient;
	}
	static divInt(a,b) {
		return haxe_Int64.divMod(a,new haxe__$Int64__$_$_$Int64(b >> 31,b)).quotient;
	}
	static intDiv(a,b) {
		let x = haxe_Int64.divMod(new haxe__$Int64__$_$_$Int64(a >> 31,a),b).quotient;
		if(x.high != x.low >> 31) {
			throw haxe_Exception.thrown("Overflow");
		}
		let x1 = x.low;
		return new haxe__$Int64__$_$_$Int64(x1 >> 31,x1);
	}
	static mod(a,b) {
		return haxe_Int64.divMod(a,b).modulus;
	}
	static modInt(a,b) {
		let x = haxe_Int64.divMod(a,new haxe__$Int64__$_$_$Int64(b >> 31,b)).modulus;
		if(x.high != x.low >> 31) {
			throw haxe_Exception.thrown("Overflow");
		}
		let x1 = x.low;
		return new haxe__$Int64__$_$_$Int64(x1 >> 31,x1);
	}
	static intMod(a,b) {
		let x = haxe_Int64.divMod(new haxe__$Int64__$_$_$Int64(a >> 31,a),b).modulus;
		if(x.high != x.low >> 31) {
			throw haxe_Exception.thrown("Overflow");
		}
		let x1 = x.low;
		return new haxe__$Int64__$_$_$Int64(x1 >> 31,x1);
	}
	static eq(a,b) {
		if(a.high == b.high) {
			return a.low == b.low;
		} else {
			return false;
		}
	}
	static eqInt(a,b) {
		if(a.high == b >> 31) {
			return a.low == b;
		} else {
			return false;
		}
	}
	static neq(a,b) {
		if(a.high == b.high) {
			return a.low != b.low;
		} else {
			return true;
		}
	}
	static neqInt(a,b) {
		if(a.high == b >> 31) {
			return a.low != b;
		} else {
			return true;
		}
	}
	static lt(a,b) {
		let v = a.high - b.high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a.low,b.low);
		}
		return (a.high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) < 0;
	}
	static ltInt(a,b) {
		let b_high = b >> 31;
		let v = a.high - b_high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a.low,b);
		}
		return (a.high < 0 ? b_high < 0 ? v : -1 : b_high >= 0 ? v : 1) < 0;
	}
	static intLt(a,b) {
		let a_high = a >> 31;
		let v = a_high - b.high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a,b.low);
		}
		return (a_high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) < 0;
	}
	static lte(a,b) {
		let v = a.high - b.high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a.low,b.low);
		}
		return (a.high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) <= 0;
	}
	static lteInt(a,b) {
		let b_high = b >> 31;
		let v = a.high - b_high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a.low,b);
		}
		return (a.high < 0 ? b_high < 0 ? v : -1 : b_high >= 0 ? v : 1) <= 0;
	}
	static intLte(a,b) {
		let a_high = a >> 31;
		let v = a_high - b.high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a,b.low);
		}
		return (a_high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) <= 0;
	}
	static gt(a,b) {
		let v = a.high - b.high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a.low,b.low);
		}
		return (a.high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) > 0;
	}
	static gtInt(a,b) {
		let b_high = b >> 31;
		let v = a.high - b_high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a.low,b);
		}
		return (a.high < 0 ? b_high < 0 ? v : -1 : b_high >= 0 ? v : 1) > 0;
	}
	static intGt(a,b) {
		let a_high = a >> 31;
		let v = a_high - b.high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a,b.low);
		}
		return (a_high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) > 0;
	}
	static gte(a,b) {
		let v = a.high - b.high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a.low,b.low);
		}
		return (a.high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) >= 0;
	}
	static gteInt(a,b) {
		let b_high = b >> 31;
		let v = a.high - b_high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a.low,b);
		}
		return (a.high < 0 ? b_high < 0 ? v : -1 : b_high >= 0 ? v : 1) >= 0;
	}
	static intGte(a,b) {
		let a_high = a >> 31;
		let v = a_high - b.high | 0;
		if(v == 0) {
			v = haxe_Int32.ucompare(a,b.low);
		}
		return (a_high < 0 ? b.high < 0 ? v : -1 : b.high >= 0 ? v : 1) >= 0;
	}
	static complement(a) {
		return new haxe__$Int64__$_$_$Int64(~a.high,~a.low);
	}
	static and(a,b) {
		return new haxe__$Int64__$_$_$Int64(a.high & b.high,a.low & b.low);
	}
	static or(a,b) {
		return new haxe__$Int64__$_$_$Int64(a.high | b.high,a.low | b.low);
	}
	static xor(a,b) {
		return new haxe__$Int64__$_$_$Int64(a.high ^ b.high,a.low ^ b.low);
	}
	static shl(a,b) {
		b &= 63;
		if(b == 0) {
			return new haxe__$Int64__$_$_$Int64(a.high,a.low);
		} else if(b < 32) {
			return new haxe__$Int64__$_$_$Int64(a.high << b | a.low >>> 32 - b,a.low << b);
		} else {
			return new haxe__$Int64__$_$_$Int64(a.low << b - 32,0);
		}
	}
	static shr(a,b) {
		b &= 63;
		if(b == 0) {
			return new haxe__$Int64__$_$_$Int64(a.high,a.low);
		} else if(b < 32) {
			return new haxe__$Int64__$_$_$Int64(a.high >> b,a.high << 32 - b | a.low >>> b);
		} else {
			return new haxe__$Int64__$_$_$Int64(a.high >> 31,a.high >> b - 32);
		}
	}
	static ushr(a,b) {
		b &= 63;
		if(b == 0) {
			return new haxe__$Int64__$_$_$Int64(a.high,a.low);
		} else if(b < 32) {
			return new haxe__$Int64__$_$_$Int64(a.high >>> b,a.high << 32 - b | a.low >>> b);
		} else {
			return new haxe__$Int64__$_$_$Int64(0,a.high >>> b - 32);
		}
	}
	static get_high(this1) {
		return this1.high;
	}
	static set_high(this1,x) {
		return this1.high = x;
	}
	static get_low(this1) {
		return this1.low;
	}
	static set_low(this1,x) {
		return this1.low = x;
	}
}
haxe_Int64.__properties__ = {get_low: "get_low",get_high: "get_high"};
class haxe__$Int64__$_$_$Int64 {
	constructor(high,low) {
		this.high = high;
		this.low = low;
	}
	toString() {
		return haxe_Int64.toString(this);
	}
}
$hxClasses["haxe._Int64.___Int64"] = haxe__$Int64__$_$_$Int64;
haxe__$Int64__$_$_$Int64.__name__ = "haxe._Int64.___Int64";
Object.assign(haxe__$Int64__$_$_$Int64.prototype, {
	__class__: haxe__$Int64__$_$_$Int64
	,high: null
	,low: null
});
class haxe_Int64Helper {
	static parseString(sParam) {
		let base_high = 0;
		let base_low = 10;
		let current = new haxe__$Int64__$_$_$Int64(0,0);
		let multiplier = new haxe__$Int64__$_$_$Int64(0,1);
		let sIsNegative = false;
		let s = StringTools.trim(sParam);
		if(s.charAt(0) == "-") {
			sIsNegative = true;
			s = s.substring(1,s.length);
		}
		let len = s.length;
		let _g = 0;
		while(_g < len) {
			let digitInt = HxOverrides.cca(s,len - 1 - _g++) - 48;
			if(digitInt < 0 || digitInt > 9) {
				throw haxe_Exception.thrown("NumberFormatError");
			}
			if(digitInt != 0) {
				let digit_high = digitInt >> 31;
				let digit_low = digitInt;
				if(sIsNegative) {
					let al = multiplier.low & 65535;
					let ah = multiplier.low >>> 16;
					let bl = digit_low & 65535;
					let bh = digit_low >>> 16;
					let p00 = haxe_Int32._mul(al,bl);
					let p10 = haxe_Int32._mul(ah,bl);
					let p01 = haxe_Int32._mul(al,bh);
					let low = p00;
					let high = (haxe_Int32._mul(ah,bh) + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
					p01 <<= 16;
					low = p00 + p01 | 0;
					if(haxe_Int32.ucompare(low,p01) < 0) {
						++high;
						high = high | 0;
					}
					p10 <<= 16;
					low = low + p10 | 0;
					if(haxe_Int32.ucompare(low,p10) < 0) {
						++high;
						high = high | 0;
					}
					high = high + (haxe_Int32._mul(multiplier.low,digit_high) + haxe_Int32._mul(multiplier.high,digit_low) | 0) | 0;
					let b_low = low;
					let high1 = current.high - high | 0;
					if(haxe_Int32.ucompare(current.low,b_low) < 0) {
						--high1;
						high1 = high1 | 0;
					}
					current = new haxe__$Int64__$_$_$Int64(high1,current.low - b_low | 0);
					if(!(current.high < 0)) {
						throw haxe_Exception.thrown("NumberFormatError: Underflow");
					}
				} else {
					let al = multiplier.low & 65535;
					let ah = multiplier.low >>> 16;
					let bl = digit_low & 65535;
					let bh = digit_low >>> 16;
					let p00 = haxe_Int32._mul(al,bl);
					let p10 = haxe_Int32._mul(ah,bl);
					let p01 = haxe_Int32._mul(al,bh);
					let low = p00;
					let high = (haxe_Int32._mul(ah,bh) + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
					p01 <<= 16;
					low = p00 + p01 | 0;
					if(haxe_Int32.ucompare(low,p01) < 0) {
						++high;
						high = high | 0;
					}
					p10 <<= 16;
					low = low + p10 | 0;
					if(haxe_Int32.ucompare(low,p10) < 0) {
						++high;
						high = high | 0;
					}
					high = high + (haxe_Int32._mul(multiplier.low,digit_high) + haxe_Int32._mul(multiplier.high,digit_low) | 0) | 0;
					let high1 = current.high + high | 0;
					let low1 = current.low + low | 0;
					if(haxe_Int32.ucompare(low1,current.low) < 0) {
						++high1;
						high1 = high1 | 0;
					}
					current = new haxe__$Int64__$_$_$Int64(high1,low1);
					if(current.high < 0) {
						throw haxe_Exception.thrown("NumberFormatError: Overflow");
					}
				}
			}
			let al = multiplier.low & 65535;
			let ah = multiplier.low >>> 16;
			let bl = base_low & 65535;
			let bh = base_low >>> 16;
			let p00 = haxe_Int32._mul(al,bl);
			let p10 = haxe_Int32._mul(ah,bl);
			let p01 = haxe_Int32._mul(al,bh);
			let low = p00;
			let high = (haxe_Int32._mul(ah,bh) + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
			p01 <<= 16;
			low = p00 + p01 | 0;
			if(haxe_Int32.ucompare(low,p01) < 0) {
				++high;
				high = high | 0;
			}
			p10 <<= 16;
			low = low + p10 | 0;
			if(haxe_Int32.ucompare(low,p10) < 0) {
				++high;
				high = high | 0;
			}
			high = high + (haxe_Int32._mul(multiplier.low,base_high) + haxe_Int32._mul(multiplier.high,base_low) | 0) | 0;
			multiplier = new haxe__$Int64__$_$_$Int64(high,low);
		}
		return current;
	}
	static fromFloat(f) {
		if(isNaN(f) || !isFinite(f)) {
			throw haxe_Exception.thrown("Number is NaN or Infinite");
		}
		let noFractions = f - f % 1;
		if(noFractions > 9007199254740991) {
			throw haxe_Exception.thrown("Conversion overflow");
		}
		if(noFractions < -9007199254740991) {
			throw haxe_Exception.thrown("Conversion underflow");
		}
		let result = new haxe__$Int64__$_$_$Int64(0,0);
		let neg = noFractions < 0;
		let rest = neg ? -noFractions : noFractions;
		let i = 0;
		while(rest >= 1) {
			let curr = rest % 2;
			rest /= 2;
			if(curr >= 1) {
				let a_high = 0;
				let a_low = 1;
				let b = i;
				b &= 63;
				let b1 = b == 0 ? new haxe__$Int64__$_$_$Int64(a_high,a_low) : b < 32 ? new haxe__$Int64__$_$_$Int64(a_high << b | a_low >>> 32 - b,a_low << b) : new haxe__$Int64__$_$_$Int64(a_low << b - 32,0);
				let high = result.high + b1.high | 0;
				let low = result.low + b1.low | 0;
				if(haxe_Int32.ucompare(low,result.low) < 0) {
					++high;
					high = high | 0;
				}
				result = new haxe__$Int64__$_$_$Int64(high,low);
			}
			++i;
		}
		if(neg) {
			let high = ~result.high;
			let low = ~result.low + 1 | 0;
			if(low == 0) {
				++high;
				high = high | 0;
			}
			result = new haxe__$Int64__$_$_$Int64(high,low);
		}
		return result;
	}
}
$hxClasses["haxe.Int64Helper"] = haxe_Int64Helper;
haxe_Int64Helper.__name__ = "haxe.Int64Helper";
class haxe_NativeStackTrace {
	static saveStack(e) {
		haxe_NativeStackTrace.lastError = e;
	}
	static callStack() {
		let e = new Error("");
		let stack = haxe_NativeStackTrace.tryHaxeStack(e);
		if(typeof(stack) == "undefined") {
			try {
				throw e;
			} catch( _g ) {
			}
			stack = e.stack;
		}
		return haxe_NativeStackTrace.normalize(stack,2);
	}
	static exceptionStack() {
		return haxe_NativeStackTrace.normalize(haxe_NativeStackTrace.tryHaxeStack(haxe_NativeStackTrace.lastError));
	}
	static toHaxe(s,skip) {
		if(skip == null) {
			skip = 0;
		}
		if(s == null) {
			return [];
		} else if(typeof(s) == "string") {
			let stack = s.split("\n");
			if(stack[0] == "Error") {
				stack.shift();
			}
			let m = [];
			let _g = 0;
			let _g1 = stack.length;
			while(_g < _g1) {
				let i = _g++;
				if(skip > i) {
					continue;
				}
				let line = stack[i];
				let matched = line.match(/^    at ([A-Za-z0-9_. ]+) \(([^)]+):([0-9]+):([0-9]+)\)$/);
				if(matched != null) {
					let path = matched[1].split(".");
					if(path[0] == "$hxClasses") {
						path.shift();
					}
					let meth = path.pop();
					let file = matched[2];
					let line = Std.parseInt(matched[3]);
					let column = Std.parseInt(matched[4]);
					m.push(haxe_StackItem.FilePos(meth == "Anonymous function" ? haxe_StackItem.LocalFunction() : meth == "Global code" ? null : haxe_StackItem.Method(path.join("."),meth),file,line,column));
				} else {
					m.push(haxe_StackItem.Module(StringTools.trim(line)));
				}
			}
			return m;
		} else if(skip > 0 && Array.isArray(s)) {
			return s.slice(skip);
		} else {
			return s;
		}
	}
	static tryHaxeStack(e) {
		if(e == null) {
			return [];
		}
		let oldValue = Error.prepareStackTrace;
		Error.prepareStackTrace = haxe_NativeStackTrace.prepareHxStackTrace;
		Error.prepareStackTrace = oldValue;
		return e.stack;
	}
	static prepareHxStackTrace(e,callsites) {
		let stack = [];
		let _g = 0;
		while(_g < callsites.length) {
			let site = callsites[_g];
			++_g;
			if(haxe_NativeStackTrace.wrapCallSite != null) {
				site = haxe_NativeStackTrace.wrapCallSite(site);
			}
			let method = null;
			let fullName = site.getFunctionName();
			if(fullName != null) {
				let idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					method = haxe_StackItem.Method(fullName.substring(0,idx),fullName.substring(idx + 1));
				} else {
					method = haxe_StackItem.Method(null,fullName);
				}
			}
			let fileName = site.getFileName();
			let fileAddr = fileName == null ? -1 : fileName.indexOf("file:");
			if(haxe_NativeStackTrace.wrapCallSite != null && fileAddr > 0) {
				fileName = fileName.substring(fileAddr + 6);
			}
			stack.push(haxe_StackItem.FilePos(method,fileName,site.getLineNumber(),site.getColumnNumber()));
		}
		return stack;
	}
	static normalize(stack,skipItems) {
		if(skipItems == null) {
			skipItems = 0;
		}
		if(Array.isArray(stack) && skipItems > 0) {
			return stack.slice(skipItems);
		} else if(typeof(stack) == "string") {
			switch(stack.substring(0,6)) {
			case "Error\n":case "Error:":
				++skipItems;
				break;
			default:
			}
			return haxe_NativeStackTrace.skipLines(stack,skipItems);
		} else {
			return stack;
		}
	}
	static skipLines(stack,skip,pos) {
		if(pos == null) {
			pos = 0;
		}
		while(true) if(skip > 0) {
			pos = stack.indexOf("\n",pos);
			if(pos < 0) {
				return "";
			} else {
				skip = --skip;
				pos += 1;
				continue;
			}
		} else {
			return stack.substring(pos);
		}
	}
}
haxe_NativeStackTrace.lastError = null;
haxe_NativeStackTrace.wrapCallSite = null;
$hxClasses["haxe.NativeStackTrace"] = haxe_NativeStackTrace;
haxe_NativeStackTrace.__name__ = "haxe.NativeStackTrace";
class haxe_Rest {
	static get_length(this1) {
		return this1.length;
	}
	static of(array) {
		return array;
	}
	static _new(array) {
		return array;
	}
	static get(this1,index) {
		return this1[index];
	}
	static toArray(this1) {
		return this1.slice();
	}
	static iterator(this1) {
		return new haxe_iterators_RestIterator(this1);
	}
	static keyValueIterator(this1) {
		return new haxe_iterators_RestKeyValueIterator(this1);
	}
	static append(this1,item) {
		let result = this1.slice();
		result.push(item);
		return result;
	}
	static prepend(this1,item) {
		let result = this1.slice();
		result.unshift(item);
		return result;
	}
	static toString(this1) {
		return "[" + this1.toString() + "]";
	}
}
haxe_Rest.__properties__ = {get_length: "get_length"};
class haxe_ValueException extends haxe_Exception {
	constructor(value,previous,native) {
		super(String(value),previous,native);
		this.value = value;
		this.__skipStack++;
	}
	unwrap() {
		return this.value;
	}
}
$hxClasses["haxe.ValueException"] = haxe_ValueException;
haxe_ValueException.__name__ = "haxe.ValueException";
haxe_ValueException.__super__ = haxe_Exception;
Object.assign(haxe_ValueException.prototype, {
	__class__: haxe_ValueException
	,value: null
});
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
	rol(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
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
	hex(a) {
		let str = "";
		let _g = 0;
		while(_g < a.length) str += StringTools.hex(a[_g++],8);
		return str.toLowerCase();
	}
	static encode(s) {
		let sh = new haxe_crypto_Sha1();
		return sh.hex(sh.doEncode(haxe_crypto_Sha1.str2blks(s)));
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
	static str2blks(s) {
		let s1 = haxe_io_Bytes.ofString(s);
		let nblk = (s1.length + 8 >> 6) + 1;
		let blks = [];
		let _g = 0;
		let _g1 = nblk * 16;
		while(_g < _g1) blks[_g++] = 0;
		let _g2 = 0;
		let _g3 = s1.length;
		while(_g2 < _g3) {
			let i = _g2++;
			blks[i >> 2] |= s1.b[i] << 24 - ((i & 3) << 3);
		}
		let i = s1.length;
		blks[i >> 2] |= 128 << 24 - ((i & 3) << 3);
		blks[nblk * 16 - 1] = s1.length * 8;
		return blks;
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
$hxClasses["haxe.crypto.Sha1"] = haxe_crypto_Sha1;
haxe_crypto_Sha1.__name__ = "haxe.crypto.Sha1";
Object.assign(haxe_crypto_Sha1.prototype, {
	__class__: haxe_crypto_Sha1
});
class haxe_ds_BalancedTree {
	constructor() {
	}
	set(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	get(key) {
		let node = this.root;
		while(node != null) {
			let c = this.compare(key,node.key);
			if(c == 0) {
				return node.value;
			}
			if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return null;
	}
	remove(key) {
		try {
			this.root = this.removeLoop(key,this.root);
			return true;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			if(typeof(haxe_Exception.caught(_g).unwrap()) == "string") {
				return false;
			} else {
				throw _g;
			}
		}
	}
	exists(key) {
		let node = this.root;
		while(node != null) {
			let c = this.compare(key,node.key);
			if(c == 0) {
				return true;
			} else if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return false;
	}
	iterator() {
		let ret = [];
		haxe_ds_BalancedTree.iteratorLoop(this.root,ret);
		return new haxe_iterators_ArrayIterator(ret);
	}
	keyValueIterator() {
		return new haxe_iterators_MapKeyValueIterator(this);
	}
	keys() {
		let ret = [];
		this.keysLoop(this.root,ret);
		return new haxe_iterators_ArrayIterator(ret);
	}
	copy() {
		let copied = new haxe_ds_BalancedTree();
		copied.root = this.root;
		return copied;
	}
	setLoop(k,v,node) {
		if(node == null) {
			return new haxe_ds_TreeNode(null,k,v,null);
		}
		let c = this.compare(k,node.key);
		if(c == 0) {
			return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null ? 0 : node._height);
		} else if(c < 0) {
			return this.balance(this.setLoop(k,v,node.left),node.key,node.value,node.right);
		} else {
			let nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	removeLoop(k,node) {
		if(node == null) {
			throw haxe_Exception.thrown("Not_found");
		}
		let c = this.compare(k,node.key);
		if(c == 0) {
			return this.merge(node.left,node.right);
		} else if(c < 0) {
			return this.balance(this.removeLoop(k,node.left),node.key,node.value,node.right);
		} else {
			return this.balance(node.left,node.key,node.value,this.removeLoop(k,node.right));
		}
	}
	keysLoop(node,acc) {
		if(node != null) {
			this.keysLoop(node.left,acc);
			acc.push(node.key);
			this.keysLoop(node.right,acc);
		}
	}
	merge(t1,t2) {
		if(t1 == null) {
			return t2;
		}
		if(t2 == null) {
			return t1;
		}
		let t = this.minBinding(t2);
		return this.balance(t1,t.key,t.value,this.removeMinBinding(t2));
	}
	minBinding(t) {
		if(t == null) {
			throw haxe_Exception.thrown("Not_found");
		} else if(t.left == null) {
			return t;
		} else {
			return this.minBinding(t.left);
		}
	}
	removeMinBinding(t) {
		if(t.left == null) {
			return t.right;
		} else {
			return this.balance(this.removeMinBinding(t.left),t.key,t.value,t.right);
		}
	}
	balance(l,k,v,r) {
		let hl = l == null ? 0 : l._height;
		let hr = r == null ? 0 : r._height;
		if(hl > hr + 2) {
			let _this = l.left;
			let _this1 = l.right;
			if((_this == null ? 0 : _this._height) >= (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r));
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
			}
		} else if(hr > hl + 2) {
			let _this = r.right;
			let _this1 = r.left;
			if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right);
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
			}
		} else {
			return new haxe_ds_TreeNode(l,k,v,r,(hl > hr ? hl : hr) + 1);
		}
	}
	compare(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	toString() {
		if(this.root == null) {
			return "{}";
		} else {
			return "{" + this.root.toString() + "}";
		}
	}
	clear() {
		this.root = null;
	}
	static iteratorLoop(node,acc) {
		while(true) {
			if(node != null) {
				haxe_ds_BalancedTree.iteratorLoop(node.left,acc);
				acc.push(node.value);
				node = node.right;
				continue;
			}
			return;
		}
	}
}
$hxClasses["haxe.ds.BalancedTree"] = haxe_ds_BalancedTree;
haxe_ds_BalancedTree.__name__ = "haxe.ds.BalancedTree";
haxe_ds_BalancedTree.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_BalancedTree.prototype, {
	__class__: haxe_ds_BalancedTree
	,root: null
});
class haxe_ds_TreeNode {
	constructor(l,k,v,r,h) {
		if(h == null) {
			h = -1;
		}
		this.left = l;
		this.key = k;
		this.value = v;
		this.right = r;
		if(h == -1) {
			let tmp;
			let _this = this.left;
			let _this1 = this.right;
			if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				let _this = this.left;
				tmp = _this == null ? 0 : _this._height;
			} else {
				let _this = this.right;
				tmp = _this == null ? 0 : _this._height;
			}
			this._height = tmp + 1;
		} else {
			this._height = h;
		}
	}
	toString() {
		return (this.left == null ? "" : this.left.toString() + ", ") + ("" + Std.string(this.key) + "=" + Std.string(this.value)) + (this.right == null ? "" : ", " + this.right.toString());
	}
}
$hxClasses["haxe.ds.TreeNode"] = haxe_ds_TreeNode;
haxe_ds_TreeNode.__name__ = "haxe.ds.TreeNode";
Object.assign(haxe_ds_TreeNode.prototype, {
	__class__: haxe_ds_TreeNode
	,left: null
	,right: null
	,key: null
	,value: null
	,_height: null
});
class haxe_ds_EnumValueMap extends haxe_ds_BalancedTree {
	constructor() {
		super();
	}
	compare(k1,k2) {
		let d = k1._hx_index - k2._hx_index;
		if(d != 0) {
			return d;
		}
		let p1 = Type.enumParameters(k1);
		let p2 = Type.enumParameters(k2);
		if(p1.length == 0 && p2.length == 0) {
			return 0;
		}
		return this.compareArgs(p1,p2);
	}
	compareArgs(a1,a2) {
		let ld = a1.length - a2.length;
		if(ld != 0) {
			return ld;
		}
		let _g = 0;
		let _g1 = a1.length;
		while(_g < _g1) {
			let i = _g++;
			let d = this.compareArg(a1[i],a2[i]);
			if(d != 0) {
				return d;
			}
		}
		return 0;
	}
	compareArg(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) {
			return this.compare(v1,v2);
		} else if(((v1) instanceof Array) && ((v2) instanceof Array)) {
			return this.compareArgs(v1,v2);
		} else {
			return Reflect.compare(v1,v2);
		}
	}
	copy() {
		let copied = new haxe_ds_EnumValueMap();
		copied.root = this.root;
		return copied;
	}
}
$hxClasses["haxe.ds.EnumValueMap"] = haxe_ds_EnumValueMap;
haxe_ds_EnumValueMap.__name__ = "haxe.ds.EnumValueMap";
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
Object.assign(haxe_ds_EnumValueMap.prototype, {
	__class__: haxe_ds_EnumValueMap
});
class haxe_ds_HashMap {
	static _new() {
		return new haxe_ds__$HashMap_HashMapData();
	}
	static set(this1,k,v) {
		let _this = this1.keys;
		let key = k.hashCode();
		_this.h[key] = k;
		let _this1 = this1.values;
		let key1 = k.hashCode();
		_this1.h[key1] = v;
	}
	static get(this1,k) {
		let _this = this1.values;
		let key = k.hashCode();
		return _this.h[key];
	}
	static exists(this1,k) {
		let _this = this1.values;
		let key = k.hashCode();
		return _this.h.hasOwnProperty(key);
	}
	static remove(this1,k) {
		this1.values.remove(k.hashCode());
		return this1.keys.remove(k.hashCode());
	}
	static keys(this1) {
		return this1.keys.iterator();
	}
	static copy(this1) {
		let copied = new haxe_ds__$HashMap_HashMapData();
		copied.keys = this1.keys.copy();
		copied.values = this1.values.copy();
		return copied;
	}
	static iterator(this1) {
		return this1.values.iterator();
	}
	static keyValueIterator(this1) {
		return new haxe_iterators_HashMapKeyValueIterator(this1);
	}
	static clear(this1) {
		this1.keys.h = { };
		this1.values.h = { };
	}
}
class haxe_ds__$HashMap_HashMapData {
	constructor() {
		this.keys = new haxe_ds_IntMap();
		this.values = new haxe_ds_IntMap();
	}
}
$hxClasses["haxe.ds._HashMap.HashMapData"] = haxe_ds__$HashMap_HashMapData;
haxe_ds__$HashMap_HashMapData.__name__ = "haxe.ds._HashMap.HashMapData";
Object.assign(haxe_ds__$HashMap_HashMapData.prototype, {
	__class__: haxe_ds__$HashMap_HashMapData
	,keys: null
	,values: null
});
class haxe_ds_IntMap {
	constructor() {
		this.h = { };
	}
	set(key,value) {
		this.h[key] = value;
	}
	get(key) {
		return this.h[key];
	}
	exists(key) {
		return this.h.hasOwnProperty(key);
	}
	remove(key) {
		if(!this.h.hasOwnProperty(key)) {
			return false;
		}
		delete(this.h[key]);
		return true;
	}
	keys() {
		let a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) a.push(+key);
		return new haxe_iterators_ArrayIterator(a);
	}
	iterator() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			let i = this.it.next();
			return this.ref[i];
		}};
	}
	keyValueIterator() {
		return new haxe_iterators_MapKeyValueIterator(this);
	}
	copy() {
		let copied = new haxe_ds_IntMap();
		let key = this.keys();
		while(key.hasNext()) {
			let key1 = key.next();
			copied.h[key1] = this.h[key1];
		}
		return copied;
	}
	toString() {
		let s_b = "";
		s_b = "{";
		let it = this.keys();
		while(it.hasNext()) {
			let i = it.next();
			s_b += i == null ? "null" : "" + i;
			s_b += " => ";
			s_b += Std.string(Std.string(this.h[i]));
			if(it.hasNext()) {
				s_b += ", ";
			}
		}
		s_b += "}";
		return s_b;
	}
	clear() {
		this.h = { };
	}
}
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = "haxe.ds.IntMap";
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_IntMap.prototype, {
	__class__: haxe_ds_IntMap
	,h: null
});
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
	exists(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	remove(key) {
		let id = key.__id__;
		if(this.h.__keys__[id] == null) {
			return false;
		}
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
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
	iterator() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			let i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	keyValueIterator() {
		return new haxe_iterators_MapKeyValueIterator(this);
	}
	copy() {
		let copied = new haxe_ds_ObjectMap();
		let key = this.keys();
		while(key.hasNext()) {
			let key1 = key.next();
			copied.set(key1,this.h[key1.__id__]);
		}
		return copied;
	}
	toString() {
		let s_b = "";
		s_b = "{";
		let it = this.keys();
		while(it.hasNext()) {
			let i = it.next();
			s_b += Std.string(Std.string(i));
			s_b += " => ";
			s_b += Std.string(Std.string(this.h[i.__id__]));
			if(it.hasNext()) {
				s_b += ", ";
			}
		}
		s_b += "}";
		return s_b;
	}
	clear() {
		this.h = { __keys__ : { }};
	}
	static assignId(obj) {
		return (obj.__id__ = $global.$haxeUID++);
	}
	static getId(obj) {
		return obj.__id__;
	}
}
haxe_ds_ObjectMap.count = null;
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = "haxe.ds.ObjectMap";
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_ObjectMap.prototype, {
	__class__: haxe_ds_ObjectMap
	,h: null
});
class haxe_ds_ReadOnlyArray {
	static get_length(this1) {
		return this1.length;
	}
	static get(this1,i) {
		return this1[i];
	}
	static concat(this1,a) {
		return this1.concat(a);
	}
}
haxe_ds_ReadOnlyArray.__properties__ = {get_length: "get_length"};
class haxe_ds_StringMap {
	constructor() {
		this.h = Object.create(null);
	}
	exists(key) {
		return Object.prototype.hasOwnProperty.call(this.h,key);
	}
	get(key) {
		return this.h[key];
	}
	set(key,value) {
		this.h[key] = value;
	}
	remove(key) {
		if(Object.prototype.hasOwnProperty.call(this.h,key)) {
			delete(this.h[key]);
			return true;
		} else {
			return false;
		}
	}
	keys() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this.h);
	}
	iterator() {
		return new haxe_ds__$StringMap_StringMapValueIterator(this.h);
	}
	keyValueIterator() {
		return new haxe_ds__$StringMap_StringMapKeyValueIterator(this.h);
	}
	copy() {
		return haxe_ds_StringMap.createCopy(this.h);
	}
	clear() {
		this.h = Object.create(null);
	}
	toString() {
		return haxe_ds_StringMap.stringify(this.h);
	}
	static createCopy(h) {
		let copy = new haxe_ds_StringMap();
		for (var key in h) copy.h[key] = h[key];
		return copy;
	}
	static stringify(h) {
		let s = "{";
		let first = true;
		for (var key in h) {
			if (first) first = false; else s += ',';
			s += key + ' => ' + Std.string(h[key]);
		}
		return s + "}";
	}
}
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = "haxe.ds.StringMap";
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_StringMap.prototype, {
	__class__: haxe_ds_StringMap
	,h: null
});
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
$hxClasses["haxe.ds._StringMap.StringMapKeyIterator"] = haxe_ds__$StringMap_StringMapKeyIterator;
haxe_ds__$StringMap_StringMapKeyIterator.__name__ = "haxe.ds._StringMap.StringMapKeyIterator";
Object.assign(haxe_ds__$StringMap_StringMapKeyIterator.prototype, {
	__class__: haxe_ds__$StringMap_StringMapKeyIterator
	,h: null
	,keys: null
	,length: null
	,current: null
});
class haxe_ds__$StringMap_StringMapValueIterator {
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
		return this.h[this.keys[this.current++]];
	}
}
$hxClasses["haxe.ds._StringMap.StringMapValueIterator"] = haxe_ds__$StringMap_StringMapValueIterator;
haxe_ds__$StringMap_StringMapValueIterator.__name__ = "haxe.ds._StringMap.StringMapValueIterator";
Object.assign(haxe_ds__$StringMap_StringMapValueIterator.prototype, {
	__class__: haxe_ds__$StringMap_StringMapValueIterator
	,h: null
	,keys: null
	,length: null
	,current: null
});
class haxe_ds__$StringMap_StringMapKeyValueIterator {
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
		let key = this.keys[this.current++];
		return { key : key, value : this.h[key]};
	}
}
$hxClasses["haxe.ds._StringMap.StringMapKeyValueIterator"] = haxe_ds__$StringMap_StringMapKeyValueIterator;
haxe_ds__$StringMap_StringMapKeyValueIterator.__name__ = "haxe.ds._StringMap.StringMapKeyValueIterator";
Object.assign(haxe_ds__$StringMap_StringMapKeyValueIterator.prototype, {
	__class__: haxe_ds__$StringMap_StringMapKeyValueIterator
	,h: null
	,keys: null
	,length: null
	,current: null
});
class haxe_ds_WeakMap {
	constructor() {
		throw new haxe_exceptions_NotImplementedException("Not implemented for this platform",null,{ fileName : "haxe/ds/WeakMap.hx", lineNumber : 39, className : "haxe.ds.WeakMap", methodName : "new"});
	}
	set(key,value) {
	}
	get(key) {
		return null;
	}
	exists(key) {
		return false;
	}
	remove(key) {
		return false;
	}
	keys() {
		return null;
	}
	iterator() {
		return null;
	}
	keyValueIterator() {
		return null;
	}
	copy() {
		return null;
	}
	toString() {
		return null;
	}
	clear() {
	}
}
$hxClasses["haxe.ds.WeakMap"] = haxe_ds_WeakMap;
haxe_ds_WeakMap.__name__ = "haxe.ds.WeakMap";
haxe_ds_WeakMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_WeakMap.prototype, {
	__class__: haxe_ds_WeakMap
});
class haxe_exceptions_PosException extends haxe_Exception {
	constructor(message,previous,pos) {
		super(message,previous);
		if(pos == null) {
			this.posInfos = { fileName : "(unknown)", lineNumber : 0, className : "(unknown)", methodName : "(unknown)"};
		} else {
			this.posInfos = pos;
		}
		this.__skipStack++;
	}
	toString() {
		return "" + super.toString() + " in " + this.posInfos.className + "." + this.posInfos.methodName + " at " + this.posInfos.fileName + ":" + this.posInfos.lineNumber;
	}
}
$hxClasses["haxe.exceptions.PosException"] = haxe_exceptions_PosException;
haxe_exceptions_PosException.__name__ = "haxe.exceptions.PosException";
haxe_exceptions_PosException.__super__ = haxe_Exception;
Object.assign(haxe_exceptions_PosException.prototype, {
	__class__: haxe_exceptions_PosException
	,posInfos: null
});
class haxe_exceptions_NotImplementedException extends haxe_exceptions_PosException {
	constructor(message,previous,pos) {
		if(message == null) {
			message = "Not implemented";
		}
		super(message,previous,pos);
		this.__skipStack++;
	}
}
$hxClasses["haxe.exceptions.NotImplementedException"] = haxe_exceptions_NotImplementedException;
haxe_exceptions_NotImplementedException.__name__ = "haxe.exceptions.NotImplementedException";
haxe_exceptions_NotImplementedException.__super__ = haxe_exceptions_PosException;
Object.assign(haxe_exceptions_NotImplementedException.prototype, {
	__class__: haxe_exceptions_NotImplementedException
});
class haxe_io_Bytes {
	constructor(data) {
		this.length = data.byteLength;
		this.b = new Uint8Array(data);
		this.b.bufferValue = data;
		data.hxBytes = this;
		data.bytes = this.b;
	}
	get(pos) {
		return this.b[pos];
	}
	set(pos,v) {
		this.b[pos] = v;
	}
	blit(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(srcpos == 0 && len == src.b.byteLength) {
			this.b.set(src.b,pos);
		} else {
			this.b.set(src.b.subarray(srcpos,srcpos + len),pos);
		}
	}
	fill(pos,len,value) {
		let _g = 0;
		while(_g < len) {
			++_g;
			this.b[pos++] = value;
		}
	}
	sub(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		return new haxe_io_Bytes(this.b.buffer.slice(pos + this.b.byteOffset,pos + this.b.byteOffset + len));
	}
	compare(other) {
		let b1 = this.b;
		let b2 = other.b;
		let _g = 0;
		let _g1 = this.length < other.length ? this.length : other.length;
		while(_g < _g1) {
			let i = _g++;
			if(b1[i] != b2[i]) {
				return b1[i] - b2[i];
			}
		}
		return this.length - other.length;
	}
	initData() {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
	}
	getDouble(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getFloat64(pos,true);
	}
	getFloat(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getFloat32(pos,true);
	}
	setDouble(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setFloat64(pos,v,true);
	}
	setFloat(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setFloat32(pos,v,true);
	}
	getUInt16(pos) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		return this.data.getUint16(pos,true);
	}
	setUInt16(pos,v) {
		if(this.data == null) {
			this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		}
		this.data.setUint16(pos,v,true);
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
	readString(pos,len) {
		return this.getString(pos,len);
	}
	toString() {
		return this.getString(0,this.length);
	}
	toHex() {
		let s_b = "";
		let chars = [];
		let str = "0123456789abcdef";
		let _g = 0;
		let _g1 = str.length;
		while(_g < _g1) chars.push(HxOverrides.cca(str,_g++));
		let _g2 = 0;
		let _g3 = this.length;
		while(_g2 < _g3) {
			let c = this.b[_g2++];
			s_b += String.fromCodePoint(chars[c >> 4]);
			s_b += String.fromCodePoint(chars[c & 15]);
		}
		return s_b;
	}
	getData() {
		return this.b.bufferValue;
	}
	static alloc(length) {
		return new haxe_io_Bytes(new ArrayBuffer(length));
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
	static ofData(b) {
		let hb = b.hxBytes;
		if(hb != null) {
			return hb;
		}
		return new haxe_io_Bytes(b);
	}
	static ofHex(s) {
		if((s.length & 1) != 0) {
			throw haxe_Exception.thrown("Not a hex string (odd number of digits)");
		}
		let a = [];
		let i = 0;
		let len = s.length >> 1;
		while(i < len) {
			let high = s.charCodeAt(i * 2);
			let low = s.charCodeAt(i * 2 + 1);
			high = (high & 15) + ((high & 64) >> 6) * 9;
			low = (low & 15) + ((low & 64) >> 6) * 9;
			a.push((high << 4 | low) & 255);
			++i;
		}
		return new haxe_io_Bytes(new Uint8Array(a).buffer);
	}
	static fastGet(b,pos) {
		return b.bytes[pos];
	}
}
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = "haxe.io.Bytes";
Object.assign(haxe_io_Bytes.prototype, {
	__class__: haxe_io_Bytes
	,length: null
	,b: null
	,data: null
});
class haxe_io_BytesBuffer {
	constructor() {
		this.pos = 0;
		this.size = 0;
	}
	get_length() {
		return this.pos;
	}
	addByte(byte) {
		if(this.pos == this.size) {
			this.grow(1);
		}
		this.view.setUint8(this.pos++,byte);
	}
	add(src) {
		if(this.pos + src.length > this.size) {
			this.grow(src.length);
		}
		if(this.size == 0) {
			return;
		}
		this.u8.set(new Uint8Array(src.b.buffer,src.b.byteOffset,src.length),this.pos);
		this.pos += src.length;
	}
	addString(v,encoding) {
		this.add(haxe_io_Bytes.ofString(v,encoding));
	}
	addInt32(v) {
		if(this.pos + 4 > this.size) {
			this.grow(4);
		}
		this.view.setInt32(this.pos,v,true);
		this.pos += 4;
	}
	addInt64(v) {
		if(this.pos + 8 > this.size) {
			this.grow(8);
		}
		this.view.setInt32(this.pos,v.low,true);
		this.view.setInt32(this.pos + 4,v.high,true);
		this.pos += 8;
	}
	addFloat(v) {
		if(this.pos + 4 > this.size) {
			this.grow(4);
		}
		this.view.setFloat32(this.pos,v,true);
		this.pos += 4;
	}
	addDouble(v) {
		if(this.pos + 8 > this.size) {
			this.grow(8);
		}
		this.view.setFloat64(this.pos,v,true);
		this.pos += 8;
	}
	addBytes(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(this.pos + len > this.size) {
			this.grow(len);
		}
		if(this.size == 0) {
			return;
		}
		this.u8.set(new Uint8Array(src.b.buffer,src.b.byteOffset + pos,len),this.pos);
		this.pos += len;
	}
	grow(delta) {
		let req = this.pos + delta;
		let nsize = this.size == 0 ? 16 : this.size;
		while(nsize < req) nsize = nsize * 3 >> 1;
		let nbuf = new ArrayBuffer(nsize);
		let nu8 = new Uint8Array(nbuf);
		if(this.size > 0) {
			nu8.set(this.u8);
		}
		this.size = nsize;
		this.buffer = nbuf;
		this.u8 = nu8;
		this.view = new DataView(this.buffer);
	}
	getBytes() {
		if(this.size == 0) {
			return new haxe_io_Bytes(new ArrayBuffer(0));
		}
		let b = new haxe_io_Bytes(this.buffer);
		b.length = this.pos;
		return b;
	}
}
$hxClasses["haxe.io.BytesBuffer"] = haxe_io_BytesBuffer;
haxe_io_BytesBuffer.__name__ = "haxe.io.BytesBuffer";
Object.assign(haxe_io_BytesBuffer.prototype, {
	__class__: haxe_io_BytesBuffer
	,buffer: null
	,view: null
	,u8: null
	,pos: null
	,size: null
	,__properties__: {get_length: "get_length"}
});
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:"haxe.io.Encoding",__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
haxe_io_Encoding.__empty_constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:"haxe.io.Error",__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_._hx_name="Custom",$_.__params__ = ["e"],$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
haxe_io_Error.__empty_constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds];
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
$hxClasses["haxe.iterators.ArrayIterator"] = haxe_iterators_ArrayIterator;
haxe_iterators_ArrayIterator.__name__ = "haxe.iterators.ArrayIterator";
Object.assign(haxe_iterators_ArrayIterator.prototype, {
	__class__: haxe_iterators_ArrayIterator
	,array: null
	,current: null
});
class haxe_iterators_ArrayKeyValueIterator {
	constructor(array) {
		this.current = 0;
		this.array = array;
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return { value : this.array[this.current], key : this.current++};
	}
}
$hxClasses["haxe.iterators.ArrayKeyValueIterator"] = haxe_iterators_ArrayKeyValueIterator;
haxe_iterators_ArrayKeyValueIterator.__name__ = "haxe.iterators.ArrayKeyValueIterator";
Object.assign(haxe_iterators_ArrayKeyValueIterator.prototype, {
	__class__: haxe_iterators_ArrayKeyValueIterator
	,current: null
	,array: null
});
class haxe_iterators_DynamicAccessIterator {
	constructor(access) {
		this.access = access;
		this.keys = Reflect.fields(access);
		this.index = 0;
	}
	hasNext() {
		return this.index < this.keys.length;
	}
	next() {
		return this.access[this.keys[this.index++]];
	}
}
$hxClasses["haxe.iterators.DynamicAccessIterator"] = haxe_iterators_DynamicAccessIterator;
haxe_iterators_DynamicAccessIterator.__name__ = "haxe.iterators.DynamicAccessIterator";
Object.assign(haxe_iterators_DynamicAccessIterator.prototype, {
	__class__: haxe_iterators_DynamicAccessIterator
	,access: null
	,keys: null
	,index: null
});
class haxe_iterators_DynamicAccessKeyValueIterator {
	constructor(access) {
		this.access = access;
		this.keys = Reflect.fields(access);
		this.index = 0;
	}
	hasNext() {
		return this.index < this.keys.length;
	}
	next() {
		let key = this.keys[this.index++];
		return { value : this.access[key], key : key};
	}
}
$hxClasses["haxe.iterators.DynamicAccessKeyValueIterator"] = haxe_iterators_DynamicAccessKeyValueIterator;
haxe_iterators_DynamicAccessKeyValueIterator.__name__ = "haxe.iterators.DynamicAccessKeyValueIterator";
Object.assign(haxe_iterators_DynamicAccessKeyValueIterator.prototype, {
	__class__: haxe_iterators_DynamicAccessKeyValueIterator
	,access: null
	,keys: null
	,index: null
});
class haxe_iterators_HashMapKeyValueIterator {
	constructor(map) {
		this.map = map;
		this.keys = map.keys.iterator();
	}
	hasNext() {
		return this.keys.hasNext();
	}
	next() {
		let key = this.keys.next();
		let _this = this.map.values;
		let key1 = key.hashCode();
		return { value : _this.h[key1], key : key};
	}
}
$hxClasses["haxe.iterators.HashMapKeyValueIterator"] = haxe_iterators_HashMapKeyValueIterator;
haxe_iterators_HashMapKeyValueIterator.__name__ = "haxe.iterators.HashMapKeyValueIterator";
Object.assign(haxe_iterators_HashMapKeyValueIterator.prototype, {
	__class__: haxe_iterators_HashMapKeyValueIterator
	,map: null
	,keys: null
});
class haxe_iterators_MapKeyValueIterator {
	constructor(map) {
		this.map = map;
		this.keys = map.keys();
	}
	hasNext() {
		return this.keys.hasNext();
	}
	next() {
		let key = this.keys.next();
		return { value : this.map.get(key), key : key};
	}
}
$hxClasses["haxe.iterators.MapKeyValueIterator"] = haxe_iterators_MapKeyValueIterator;
haxe_iterators_MapKeyValueIterator.__name__ = "haxe.iterators.MapKeyValueIterator";
Object.assign(haxe_iterators_MapKeyValueIterator.prototype, {
	__class__: haxe_iterators_MapKeyValueIterator
	,map: null
	,keys: null
});
class haxe_iterators_RestIterator {
	constructor(args) {
		this.current = 0;
		this.args = args;
	}
	hasNext() {
		return this.current < this.args.length;
	}
	next() {
		return this.args[this.current++];
	}
}
$hxClasses["haxe.iterators.RestIterator"] = haxe_iterators_RestIterator;
haxe_iterators_RestIterator.__name__ = "haxe.iterators.RestIterator";
Object.assign(haxe_iterators_RestIterator.prototype, {
	__class__: haxe_iterators_RestIterator
	,args: null
	,current: null
});
class haxe_iterators_RestKeyValueIterator {
	constructor(args) {
		this.current = 0;
		this.args = args;
	}
	hasNext() {
		return this.current < this.args.length;
	}
	next() {
		return { key : this.current, value : this.args[this.current++]};
	}
}
$hxClasses["haxe.iterators.RestKeyValueIterator"] = haxe_iterators_RestKeyValueIterator;
haxe_iterators_RestKeyValueIterator.__name__ = "haxe.iterators.RestKeyValueIterator";
Object.assign(haxe_iterators_RestKeyValueIterator.prototype, {
	__class__: haxe_iterators_RestKeyValueIterator
	,args: null
	,current: null
});
class haxe_iterators_StringIterator {
	constructor(s) {
		this.offset = 0;
		this.s = s;
	}
	hasNext() {
		return this.offset < this.s.length;
	}
	next() {
		return this.s.charCodeAt(this.offset++);
	}
}
$hxClasses["haxe.iterators.StringIterator"] = haxe_iterators_StringIterator;
haxe_iterators_StringIterator.__name__ = "haxe.iterators.StringIterator";
Object.assign(haxe_iterators_StringIterator.prototype, {
	__class__: haxe_iterators_StringIterator
	,offset: null
	,s: null
});
class haxe_iterators_StringIteratorUnicode {
	constructor(s) {
		this.offset = 0;
		this.s = s;
	}
	hasNext() {
		return this.offset < this.s.length;
	}
	next() {
		let s = this.s;
		let index = this.offset++;
		let c = s.charCodeAt(index);
		if(c >= 55296 && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
		}
		let c1 = c;
		if(c1 >= 65536) {
			this.offset++;
		}
		return c1;
	}
	static unicodeIterator(s) {
		return new haxe_iterators_StringIteratorUnicode(s);
	}
}
$hxClasses["haxe.iterators.StringIteratorUnicode"] = haxe_iterators_StringIteratorUnicode;
haxe_iterators_StringIteratorUnicode.__name__ = "haxe.iterators.StringIteratorUnicode";
Object.assign(haxe_iterators_StringIteratorUnicode.prototype, {
	__class__: haxe_iterators_StringIteratorUnicode
	,offset: null
	,s: null
});
class haxe_iterators_StringKeyValueIterator {
	constructor(s) {
		this.offset = 0;
		this.s = s;
	}
	hasNext() {
		return this.offset < this.s.length;
	}
	next() {
		return { key : this.offset, value : this.s.charCodeAt(this.offset++)};
	}
}
$hxClasses["haxe.iterators.StringKeyValueIterator"] = haxe_iterators_StringKeyValueIterator;
haxe_iterators_StringKeyValueIterator.__name__ = "haxe.iterators.StringKeyValueIterator";
Object.assign(haxe_iterators_StringKeyValueIterator.prototype, {
	__class__: haxe_iterators_StringKeyValueIterator
	,offset: null
	,s: null
});
class js_Lib {
	static debug() {
		debugger;
	}
	static alert(v) {
		alert(js_Boot.__string_rec(v,""));
	}
	static eval(code) {
		return eval(code);
	}
	static get_undefined() {
		return undefined;
	}
	static rethrow() {
	}
	static getOriginalException() {
		return null;
	}
	static getNextHaxeUID() {
		return $global.$haxeUID++;
	}
}
$hxClasses["js.Lib"] = js_Lib;
js_Lib.__name__ = "js.Lib";
js_Lib.__properties__ = {get_undefined: "get_undefined"};
class js_lib_KeyValue {
	static get_key(this1) {
		return this1[0];
	}
	static get_value(this1) {
		return this1[1];
	}
}
js_lib_KeyValue.__properties__ = {get_value: "get_value",get_key: "get_key"};
class js_lib_ObjectEntry {
	static get_key(this1) {
		return this1[0];
	}
	static get_value(this1) {
		return this1[1];
	}
}
js_lib_ObjectEntry.__properties__ = {get_value: "get_value",get_key: "get_key"};
class seedyrng_GeneratorInterface {
}
$hxClasses["seedyrng.GeneratorInterface"] = seedyrng_GeneratorInterface;
seedyrng_GeneratorInterface.__name__ = "seedyrng.GeneratorInterface";
seedyrng_GeneratorInterface.__isInterface__ = true;
Object.assign(seedyrng_GeneratorInterface.prototype, {
	__class__: seedyrng_GeneratorInterface
	,get_seed: null
	,set_seed: null
	,get_state: null
	,set_state: null
	,get_usesAllBits: null
	,nextInt: null
	,__properties__: {get_usesAllBits: "get_usesAllBits",set_state: "set_state",get_state: "get_state",set_seed: "set_seed",get_seed: "get_seed"}
});
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
$hxClasses["seedyrng.Random"] = seedyrng_Random;
seedyrng_Random.__name__ = "seedyrng.Random";
seedyrng_Random.__interfaces__ = [seedyrng_GeneratorInterface];
Object.assign(seedyrng_Random.prototype, {
	__class__: seedyrng_Random
	,generator: null
	,__properties__: {get_usesAllBits: "get_usesAllBits",set_state: "set_state",get_state: "get_state",set_seed: "set_seed",get_seed: "get_seed"}
});
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
$hxClasses["seedyrng.Xorshift128Plus"] = seedyrng_Xorshift128Plus;
seedyrng_Xorshift128Plus.__name__ = "seedyrng.Xorshift128Plus";
seedyrng_Xorshift128Plus.__interfaces__ = [seedyrng_GeneratorInterface];
Object.assign(seedyrng_Xorshift128Plus.prototype, {
	__class__: seedyrng_Xorshift128Plus
	,_seed: null
	,_state0: null
	,_state1: null
	,_current: null
	,_currentAvailable: null
	,__properties__: {get_usesAllBits: "get_usesAllBits",set_state: "set_state",get_state: "get_state",set_seed: "set_seed",get_seed: "get_seed"}
});
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
$hxClasses["Math"] = Math;
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
{
	String.prototype.__class__ = $hxClasses["String"] = String;
	String.__name__ = "String";
	$hxClasses["Array"] = Array;
	Array.__name__ = "Array";
	Date.prototype.__class__ = $hxClasses["Date"] = Date;
	Date.__name__ = "Date";
	var Int = { };
	var Dynamic = { };
	var Float = Number;
	var Bool = Boolean;
	var Class = { };
	var Enum = { };
}
js_Boot.__toStr = ({ }).toString;
haxe_ds_ObjectMap.count = 0;
EReg.escapeRe = new RegExp("[.*+?^${}()|[\\]\\\\]","g");
haxe_SysTools.winMetaCharacters = [32,40,41,37,33,94,34,60,62,38,124,10,13,44,59];
StringTools.winMetaCharacters = haxe_SysTools.winMetaCharacters;
StringTools.MIN_SURROGATE_CODE_POINT = 65536;
dropecho_storygen_Functions.funcs = (function($this) {
	var $r;
	let _g = new haxe_ds_StringMap();
	_g.h["random"] = function(gen,args) {
		let int = gen.random.randomInt(Std.parseInt(args[0]),Std.parseInt(args[1]));
		if(int == null) {
			return "null";
		} else {
			return "" + int;
		}
	};
	_g.h["switch"] = function(gen,args) {
		let symbol = args.shift();
		let parsed = gen.memory[Std.string(symbol)];
		if(parsed != null) {
			let _g = 0;
			while(_g < args.length) {
				let split = args[_g++].split("=>");
				if(split[0] == parsed) {
					return "#" + split[1] + "#";
				}
			}
		}
		return "";
	};
	$r = _g;
	return $r;
}(this));
dropecho_storygen_Transforms.userTransforms = new haxe_ds_StringMap();
haxe_Int32._mul = Math.imul != null ? Math.imul : function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
};
seedyrng_Xorshift128Plus.PARAMETER_A = 23;
seedyrng_Xorshift128Plus.PARAMETER_B = 17;
seedyrng_Xorshift128Plus.PARAMETER_C = 26;
seedyrng_Xorshift128Plus.SEED_1 = new haxe__$Int64__$_$_$Int64(842650776,685298713);
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
