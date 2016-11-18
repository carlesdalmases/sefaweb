/**
 * @license
 * lodash <https://lodash.com/>
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.12.0';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256,
      FLIP_FLAG = 512;

  /** Used to compose bitmasks for comparison styles. */
  var UNORDERED_COMPARE_FLAG = 1,
      PARTIAL_COMPARE_FLAG = 2;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g,
      reTrimStart = /^\s+/,
      reTrimEnd = /\s+$/;

  /** Used to match non-compound words composed of alphanumeric characters. */
  var reBasicWord = /[a-zA-Z0-9]+/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0x/i;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
      rsComboSymbolsRange = '\\u20d0-\\u20f0',
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
      rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reComplexWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
    rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr,
    rsUpper + '+' + rsOptUpperContr,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasComplexSymbol = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasComplexWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError',
    'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `exports`. */
  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
    ? exports
    : undefined;

  /** Detect free variable `module`. */
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
    ? module
    : undefined;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = (freeModule && freeModule.exports === freeExports)
    ? freeExports
    : undefined;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  /** Detect free variable `window`. */
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal ||
    ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
      freeSelf || thisGlobal || Function('return this')();

  /*--------------------------------------------------------------------------*/

  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */
  function addMapEntry(map, pair) {
    // Don't return `Map#set` because it doesn't return the map instance in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }

  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */
  function addSetEntry(set, value) {
    set.add(value);
    return set;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    var length = args.length;
    switch (length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    return !!array.length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * The base implementation of methods like `_.find` and `_.findKey`, without
   * support for iteratee shorthands, which iterates over `collection` using
   * `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @param {boolean} [retKey] Specify returning the key of the found element
   *  instead of the element itself.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFind(collection, predicate, eachFunc, retKey) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = retKey ? key : value;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array ? array.length : 0;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.unary` without support for storing wrapper metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a cache value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Checks if `value` is a global object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
   */
  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        result++;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }
    return result;
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    if (!(string && reHasComplexSymbol.test(string))) {
      return string.length;
    }
    var result = reComplexSymbol.lastIndex = 0;
    while (reComplexSymbol.test(string)) {
      result++;
    }
    return result;
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return string.match(reComplexSymbol);
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Use `context` to mock `Date#getTime` use in `_.now`.
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    context = context ? _.defaults({}, context, _.pick(root, contextProps)) : root;

    /** Built-in constructor references. */
    var Date = context.Date,
        Error = context.Error,
        Math = context.Math,
        RegExp = context.RegExp,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = context.Array.prototype,
        objectProto = context.Object.prototype,
        stringProto = context.String.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = context.Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Reflect = context.Reflect,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        clearTimeout = context.clearTimeout,
        enumerate = Reflect ? Reflect.enumerate : undefined,
        getOwnPropertySymbols = Object.getOwnPropertySymbols,
        iteratorSymbol = typeof (iteratorSymbol = Symbol && Symbol.iterator) == 'symbol' ? iteratorSymbol : undefined,
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        setTimeout = context.setTimeout,
        splice = arrayProto.splice;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetPrototype = Object.getPrototypeOf,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = Object.keys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReplace = stringProto.replace,
        nativeReverse = arrayProto.reverse,
        nativeSplit = stringProto.split;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
    var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array of at least `200` elements
     * and any iteratees accept only one argument. The heuristic for whether a
     * section qualifies for shortcut fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `deburr`, `divide`, `each`,
     * `eachRight`, `endsWith`, `eq`, `escape`, `escapeRegExp`, `every`, `find`,
     * `findIndex`, `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `first`,
     * `floor`, `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`,
     * `forOwnRight`, `get`, `gt`, `gte`, `has`, `hasIn`, `head`, `identity`,
     * `includes`, `indexOf`, `inRange`, `invoke`, `isArguments`, `isArray`,
     * `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`, `isBoolean`,
     * `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isEqualWith`,
     * `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`, `isMap`,
     * `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`, `isNumber`,
     * `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`, `isSafeInteger`,
     * `isSet`, `isString`, `isUndefined`, `isTypedArray`, `isWeakMap`, `isWeakSet`,
     * `join`, `kebabCase`, `last`, `lastIndexOf`, `lowerCase`, `lowerFirst`,
     * `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`, `min`, `minBy`, `multiply`,
     * `noConflict`, `noop`, `now`, `nth`, `pad`, `padEnd`, `padStart`, `parseInt`,
     * `pop`, `random`, `reduce`, `reduceRight`, `repeat`, `result`, `round`,
     * `runInContext`, `sample`, `shift`, `size`, `snakeCase`, `some`, `sortedIndex`,
     * `sortedIndexBy`, `sortedLastIndex`, `sortedLastIndexBy`, `startCase`,
     * `startsWith`, `subtract`, `sum`, `sumBy`, `template`, `times`, `toFinite`,
     * `toInteger`, `toJSON`, `toLength`, `toLower`, `toNumber`, `toSafeInteger`,
     * `toString`, `toUpper`, `trim`, `trimEnd`, `trimStart`, `truncate`, `unescape`,
     * `uniqueId`, `upperCase`, `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE ||
          (arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      return getMapData(this, key)['delete'](key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values ? values.length : 0;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      return this.__data__['delete'](key);
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var cache = this.__data__;
      if (cache instanceof ListCache && cache.__data__.length == LARGE_ARRAY_SIZE) {
        cache = this.__data__ = new MapCache(cache.__data__);
      }
      cache.set(key, value);
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function assignInDefaults(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (typeof key == 'number' && value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to search.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths of elements to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          isNil = object == null,
          length = paths.length,
          result = Array(length);

      while (++index < length) {
        result[index] = isNil ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments to numbers.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {boolean} [isFull] Specify a clone including symbols.
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          if (isHostObject(value)) {
            return object ? value : {};
          }
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
      }
      // Recursively populate clone (susceptible to call stack limits).
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source),
          length = props.length;

      return function(object) {
        if (object == null) {
          return !length;
        }
        var index = length;
        while (index--) {
          var key = props[index],
              predicate = source[key],
              value = object[key];

          if ((value === undefined &&
              !(key in Object(object))) || !predicate(value)) {
            return false;
          }
        }
        return true;
      };
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an array
     * of `func` arguments.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments to provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = isKey(path, object) ? [path] : castPath(path);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments to numbers.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
      // that are composed entirely of index properties, return `false` for
      // `hasOwnProperty` checks of them.
      return hasOwnProperty.call(object, key) ||
        (typeof object == 'object' && key in object && getPrototype(object) === null);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments to numbers.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      if (!isKey(path, object)) {
        path = castPath(path);
        object = parent(object, path);
        path = last(path);
      }
      var func = object == null ? object : object[toKey(path)];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {boolean} [bitmask] The bitmask of comparison flags.
     *  The bitmask may be composed of the following flags:
     *     1 - Unordered comparison
     *     2 - Partial comparison
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, bitmask, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
     *  for more details.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = getTag(object);
        objTag = objTag == argsTag ? objectTag : objTag;
      }
      if (!othIsArr) {
        othTag = getTag(other);
        othTag = othTag == argsTag ? objectTag : othTag;
      }
      var objIsObj = objTag == objectTag && !isHostObject(object),
          othIsObj = othTag == objectTag && !isHostObject(other),
          isSameTag = objTag == othTag;

      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
          : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
      }
      if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't skip the constructor
     * property of prototypes or treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      return nativeKeys(Object(object));
    }

    /**
     * The base implementation of `_.keysIn` which doesn't skip the constructor
     * property of prototypes or treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      object = object == null ? object : Object(object);

      var result = [];
      for (var key in object) {
        result.push(key);
      }
      return result;
    }

    // Fallback for IE < 9 with es6-shim.
    if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
      baseKeysIn = function(object) {
        return iteratorToArray(enumerate(object));
      };
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments to numbers.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      if (!(isArray(source) || isTypedArray(source))) {
        var props = keysIn(source);
      }
      arrayEach(props || source, function(srcValue, key) {
        if (props) {
          key = srcValue;
          srcValue = source[key];
        }
        if (isObject(srcValue)) {
          stack || (stack = new Stack);
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(object[key], srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      });
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = object[key],
          srcValue = source[key],
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        newValue = srcValue;
        if (isArray(srcValue) || isTypedArray(srcValue)) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else {
            isCommon = false;
            newValue = baseClone(srcValue, true);
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
            isCommon = false;
            newValue = baseClone(srcValue, true);
          }
          else {
            newValue = objValue;
          }
        }
        else {
          isCommon = false;
        }
      }
      stack.set(srcValue, newValue);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      }
      stack['delete'](srcValue);
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce `n` to an integer.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      var index = -1;
      iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property identifiers to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, props) {
      object = Object(object);
      return arrayReduce(props, function(result, key) {
        if (key in object) {
          result[key] = object[key];
        }
        return result;
      }, {});
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, predicate) {
      var index = -1,
          props = getAllKeysIn(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index],
            value = object[key];

        if (predicate(value, key)) {
          result[key] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          }
          else if (!isKey(index, array)) {
            var path = castPath(index),
                object = parent(array, path);

            if (object != null) {
              delete object[toKey(last(path))];
            }
          }
          else {
            delete array[toKey(index)];
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments to numbers.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      path = isKey(path, object) ? [path] : castPath(path);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]);
        if (isObject(nested)) {
          var newValue = value;
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined;
            if (newValue === undefined) {
              newValue = objValue == null
                ? (isIndex(path[index + 1]) ? [] : {})
                : objValue;
            }
          }
          assignValue(nested, key, newValue);
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = isKey(path, object) ? [path] : castPath(path);
      object = parent(object, path);

      var key = toKey(last(path));
      return !(object != null && baseHas(object, key)) || delete object[key];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var index = -1,
          length = arrays.length;

      while (++index < length) {
        var result = result
          ? arrayPush(
              baseDifference(result, arrays[index], iteratee, comparator),
              baseDifference(arrays[index], result, iteratee, comparator)
            )
          : arrays[index];
      }
      return (result && result.length) ? baseUniq(result, iteratee, comparator) : [];
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value) {
      return isArray(value) ? value : stringToPath(value);
    }

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned map.
     */
    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned set.
     */
    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor);
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : source[key];

        assignValue(object, key, newValue);
      }
      return object;
    }

    /**
     * Copies own symbol properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return rest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
     *  for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBaseWrapper(func, bitmask, thisArg) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = reHasComplexSymbol.test(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
     *  for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurryWrapper(func, bitmask, arity) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurryWrapper(
            func, bitmask, createHybridWrapper, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return rest(function(funcs) {
        funcs = baseFlatten(funcs, 1);

        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 &&
              isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
     *  for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
          isFlip = bitmask & FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurryWrapper(
            func, bitmask, createHybridWrapper, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return 0;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return rest(function(iteratees) {
        iteratees = (iteratees.length == 1 && isArray(iteratees[0]))
          ? arrayMap(iteratees[0], baseUnary(getIteratee()))
          : arrayMap(baseFlatten(iteratees, 1, isFlattenableIteratee), baseUnary(getIteratee()));

        return rest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return reHasComplexSymbol.test(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
     *  for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toNumber(start);
        start = start === start ? start : 0;
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toNumber(end) || 0;
        }
        step = step === undefined ? (start < end ? 1 : -1) : (toNumber(step) || 0);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
     *  for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurryWrapper(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

      if (!(bitmask & CURRY_BOUND_FLAG)) {
        bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return result;
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = toInteger(precision);
        if (precision) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask of wrapper flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     *   512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] == null
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
        bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == BIND_FLAG) {
        var result = createBaseWrapper(func, bitmask, thisArg);
      } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
        result = createCurryWrapper(func, bitmask, arity);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
        result = createPartialWrapper(func, bitmask, thisArg, partials);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} customizer The function to customize comparisons.
     * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
     *  for more details.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked) {
        return stacked == other;
      }
      var index = -1,
          result = true,
          seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

      stack.set(array, other);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!seen.has(othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
                  return seen.add(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, customizer, bitmask, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} customizer The function to customize comparisons.
     * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
     *  for more details.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and
          // booleans to `1` or `0` treating invalid dates coerced to `NaN` as
          // not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object) ? other != +other : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= UNORDERED_COMPARE_FLAG;
          stack.set(object, other);

          // Recursively compare objects (susceptible to call stack limits).
          return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} customizer The function to customize comparisons.
     * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
     *  for more details.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
          objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : baseHas(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      return result;
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a
     * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
     * Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = toPairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Gets the `[[Prototype]]` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {null|Object} Returns the `[[Prototype]]`.
     */
    function getPrototype(value) {
      return nativeGetPrototype(Object(value));
    }

    /**
     * Creates an array of the own enumerable symbol properties of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    function getSymbols(object) {
      // Coerce `object` to an object to avoid non-object errors in V8.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=3443 for more details.
      return getOwnPropertySymbols(Object(object));
    }

    // Fallback for IE < 11.
    if (!getOwnPropertySymbols) {
      getSymbols = function() {
        return [];
      };
    }

    /**
     * Creates an array of the own and inherited enumerable symbol properties
     * of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !getOwnPropertySymbols ? getSymbols : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function getTag(value) {
      return objectToString.call(value);
    }

    // Fallback for data views, maps, sets, and weak maps in IE 11,
    // for data views in Edge, and promises in Node.js.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = objectToString.call(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : undefined;

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = isKey(path, object) ? [path] : castPath(path);

      var result,
          index = -1,
          length = path.length;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result) {
        return result;
      }
      var length = object ? object.length : 0;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isString(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object, isDeep, cloneFunc);

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Creates an array of index keys for `object` values of arrays,
     * `arguments` objects, and strings, otherwise `null` is returned.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array|null} Returns index keys, else `null`.
     */
    function indexKeys(object) {
      var length = object ? object.length : undefined;
      if (isLength(length) &&
          (isArray(object) || isString(object) || isArguments(object))) {
        return baseTimes(length, String);
      }
      return null;
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value);
    }

    /**
     * Checks if `value` is a flattenable array and not a `_.matchesProperty`
     * iteratee shorthand.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenableIteratee(value) {
      return isArray(value) && !(value.length == 2 && !isFunction(value[0]));
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);

      var isCombo =
        ((srcBitmask == ARY_FLAG) && (bitmask == CURRY_FLAG)) ||
        ((srcBitmask == ARY_FLAG) && (bitmask == REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (ARY_FLAG | REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function mergeDefaults(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        baseMerge(objValue, srcValue, undefined, mergeDefaults, stack.set(srcValue, objValue));
      }
      return objValue;
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoize(function(string) {
      var result = [];
      toString(string).replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array ? array.length : 0;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length,
          args = Array(length ? length - 1 : 0),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return length
        ? arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1))
        : [];
    }

    /**
     * Creates an array of unique `array` values not included in the other given
     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. The order of result values is determined by the
     * order they occur in the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([3, 2, 1], [4, 2]);
     * // => [3, 1]
     */
    var difference = rest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. Result values are chosen from the first array.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
     * // => [3.1, 1.3]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = rest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. Result values
     * are chosen from the first array. The comparator is invoked with two arguments:
     * (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = rest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to search.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate) {
      return (array && array.length)
        ? baseFindIndex(array, getIteratee(predicate, 3))
        : -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to search.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate) {
      return (array && array.length)
        ? baseFindIndex(array, getIteratee(predicate, 3), true)
        : -1;
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs ? pairs.length : 0,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      fromIndex = toInteger(fromIndex);
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. The order of result values is determined by the
     * order they occur in the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [4, 2], [1, 2]);
     * // => [2]
     */
    var intersection = rest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. Result values are chosen from the first array.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = rest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. Result values are chosen
     * from the first array. The comparator is invoked with two arguments:
     * (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = rest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (comparator === last(mapped)) {
        comparator = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array ? nativeJoin.call(array, separator) : '';
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = (
          index < 0
            ? nativeMax(length + index, 0)
            : nativeMin(index, length - 1)
        ) + 1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Gets the element at `n` index of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    var pull = rest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pullAll(array, [2, 3]);
     * console.log(array);
     * // => [1, 1]
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = rest(function(array, indexes) {
      indexes = baseFlatten(indexes, 1);

      var length = array ? array.length : 0,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array ? nativeReverse.call(array) : array;
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 5], 4);
     * // => 0
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var dict = { 'thirty': 30, 'forty': 40, 'fifty': 50 };
     *
     * _.sortedIndexBy(['thirty', 'fifty'], 'forty', _.propertyOf(dict));
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([1, 1, 2, 2], 2);
     * // => 2
     */
    function sortedIndexOf(array, value) {
      var length = array ? array.length : 0;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5], 4);
     * // => 1
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([1, 1, 2, 2], 2);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array ? array.length : 0;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2, 1], [4, 2], [1, 2]);
     * // => [2, 1, 4]
     */
    var union = rest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [2.1, 1.2, 4.3]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = rest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = rest(function(arrays) {
      var comparator = last(arrays);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each
     * element is kept.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length)
        ? baseUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length)
        ? baseUniq(array, getIteratee(iteratee))
        : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The comparator is invoked with
     * two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 },  { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      return (array && array.length)
        ? baseUniq(array, undefined, comparator)
        : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = rest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [4, 2]);
     * // => [1, 4]
     */
    var xor = rest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [1.2, 4.3]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = rest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The comparator is invoked with
     * two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = rest(function(arrays) {
      var comparator = last(arrays);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = rest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = rest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths of elements to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     *
     * _(['a', 'b', 'c']).at(0, 2).value();
     * // => ['a', 'c']
     */
    var wrapperAt = rest(function(paths) {
      paths = baseFlatten(paths, 1);
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to search.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    function find(collection, predicate) {
      predicate = getIteratee(predicate, 3);
      if (isArray(collection)) {
        var index = baseFindIndex(collection, predicate);
        return index > -1 ? collection[index] : undefined;
      }
      return baseFind(collection, predicate, baseEach);
    }

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to search.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, predicate) {
      predicate = getIteratee(predicate, 3);
      if (isArray(collection)) {
        var index = baseFindIndex(collection, predicate, true);
        return index > -1 ? collection[index] : undefined;
      }
      return baseFind(collection, predicate, baseEachRight);
    }

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _([1, 2]).forEach(function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function, it's
     * invoked for and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = rest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getIteratee(predicate, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var array = isArrayLike(collection) ? collection : values(collection),
          length = array.length;

      return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      var index = -1,
          result = toArray(collection),
          length = result.length,
          lastIndex = length - 1;

      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = baseClamp(toInteger(n), 0, length);
      }
      while (++index < n) {
        var rand = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      return sampleSize(collection, MAX_ARRAY_LENGTH);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        var result = collection.length;
        return (result && isString(collection)) ? stringSize(collection) : result;
      }
      if (isObjectLike(collection)) {
        var tag = getTag(collection);
        if (tag == mapTag || tag == setTag) {
          return collection.size;
        }
      }
      return keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
     *  [iteratees=[_.identity]] The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, function(o) { return o.user; });
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
     *
     * _.sortBy(users, 'user', function(o) {
     *   return Math.floor(o.age / 10);
     * });
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    var sortBy = rest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      iteratees = (iteratees.length == 1 && isArray(iteratees[0]))
        ? iteratees[0]
        : baseFlatten(iteratees, 1, isFlattenableIteratee);

      return baseOrderBy(collection, iteratees, []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @type {Function}
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred function to be invoked.
     */
    var now = Date.now;

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = rest(function(func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = rest(function(object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrapper(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrapper(func, CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide an options object to indicate whether `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent calls
     * to the debounced function return the result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime = 0,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            result = wait - timeSinceLastCall;

        return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (!lastCallTime || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        clearTimeout(timerId);
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastCallTime = lastInvokeTime = 0;
        lastArgs = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one or more milliseconds.
     */
    var defer = rest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = rest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrapper(func, FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with arguments transformed by
     * corresponding `transforms`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
     *  [transforms[_.identity]] The functions to transform.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = rest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1, isFlattenableIteratee), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return rest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = rest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrapper(func, PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = rest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrapper(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = rest(function(func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes, 1));
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, array);
          case 1: return func.call(this, args[0], array);
          case 2: return func.call(this, args[0], args[1], array);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/6.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? 0 : nativeMax(toInteger(start), 0);
      return rest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide an options object to indicate whether
     * `func` should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return partial(wrapper, value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, false, true);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      return baseClone(value, false, true, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, true, true);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      return baseClone(value, true, true, customizer);
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
        (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @type {Function}
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    function isArrayBuffer(value) {
      return isObjectLike(value) && objectToString.call(value) == arrayBufferTag;
    }

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value)) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && objectToString.call(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = !Buffer ? constant(false) : function(value) {
      return value instanceof Buffer;
    };

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return isObjectLike(value) && objectToString.call(value) == dateTag;
    }

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element,
     *  else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (isArrayLike(value) &&
          (isArray(value) || isString(value) || isFunction(value.splice) ||
            isArguments(value) || isBuffer(value))) {
        return !value.length;
      }
      if (isObjectLike(value)) {
        var tag = getTag(value);
        if (tag == mapTag || tag == setTag) {
          return !value.size;
        }
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return !(nonEnumShadows && keys(value).length);
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are **not** supported.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent,
     *  else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent,
     *  else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object,
     *  else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      return (objectToString.call(value) == errorTag) ||
        (typeof value.message == 'string' && typeof value.name == 'string');
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number,
     *  else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8 which returns 'object' for typed array and weak map constructors,
      // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length,
     *  else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    function isMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values. This method is
     * equivalent to a `_.matches` function when `source` is partially applied.
     *
     * **Note:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (!isObject(value)) {
        return false;
      }
      var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && objectToString.call(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object,
     *  else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) ||
          objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return (typeof Ctor == 'function' &&
        Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return isObject(value) && objectToString.call(value) == regexpTag;
    }

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer,
     *  else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    function isSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified,
     *  else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && objectToString.call(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (iteratorSymbol && value[iteratorSymbol]) {
        return iteratorToArray(value[iteratorSymbol]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This function is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = isFunction(value.valueOf) ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.c = 3;
     * }
     *
     * function Bar() {
     *   this.e = 5;
     * }
     *
     * Foo.prototype.d = 4;
     * Bar.prototype.f = 6;
     *
     * _.assign({ 'a': 1 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3, 'e': 5 }
     */
    var assign = createAssigner(function(object, source) {
      if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * function Bar() {
     *   this.d = 4;
     * }
     *
     * Foo.prototype.c = 3;
     * Bar.prototype.e = 5;
     *
     * _.assignIn({ 'a': 1 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 }
     */
    var assignIn = createAssigner(function(object, source) {
      if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keysIn(source), object);
        return;
      }
      for (var key in source) {
        assignValue(object, key, source[key]);
      }
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths of elements to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     *
     * _.at(['a', 'b', 'c'], 0, 2);
     * // => ['a', 'c']
     */
    var at = rest(function(object, paths) {
      return baseAt(object, baseFlatten(paths, 1));
    });

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = rest(function(args) {
      args.push(undefined, assignInDefaults);
      return apply(assignInWith, undefined, args);
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = rest(function(args) {
      args.push(undefined, mergeDefaults);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to search.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFind(object, getIteratee(predicate, 3), baseForOwn, true);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to search.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFind(object, getIteratee(predicate, 3), baseForOwnRight, true);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = rest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      var isProto = isPrototype(object);
      if (!(isProto || isArrayLike(object))) {
        return baseKeys(object);
      }
      var indexes = indexKeys(object),
          skipIndexes = !!indexes,
          result = indexes || [],
          length = result.length;

      for (var key in object) {
        if (baseHas(object, key) &&
            !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
            !(isProto && key == 'constructor')) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      var index = -1,
          isProto = isPrototype(object),
          props = baseKeysIn(object),
          propsLength = props.length,
          indexes = indexKeys(object),
          skipIndexes = !!indexes,
          result = indexes || [],
          length = result.length;

      while (++index < propsLength) {
        var key = props[index];
        if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        result[iteratee(value, key, object)] = value;
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        result[key] = iteratee(value, key, object);
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with seven arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable string keyed properties of `object` that are
     * not omitted.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [props] The property identifiers to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = rest(function(object, props) {
      if (object == null) {
        return {};
      }
      props = arrayMap(baseFlatten(props, 1), toKey);
      return basePick(object, baseDifference(getAllKeysIn(object), props));
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      predicate = getIteratee(predicate);
      return basePickBy(object, function(value, key) {
        return !predicate(value, key);
      });
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [props] The property identifiers to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = rest(function(object, props) {
      return object == null ? {} : basePick(object, arrayMap(baseFlatten(props, 1), toKey));
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Array|Function|Object|string} [predicate=_.identity]
     *  The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      return object == null ? {} : basePickBy(object, getIteratee(predicate));
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = isKey(path, object) ? [path] : castPath(path);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        object = undefined;
        length = 1;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[toKey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. The iteratee is invoked
     * with four arguments: (accumulator, value, key, object). Iteratee functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getIteratee(iteratee, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object ? baseValues(object, keys(object)) : [];
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toNumber(start) || 0;
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toNumber(end) || 0;
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toNumber(lower) || 0;
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toNumber(upper) || 0;
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('d�j� vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in IE < 9, they can break out of
     * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the
     * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=3109 for more details.
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = toString(string).replace(reTrim, '');
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : nativeReplace.call(string, args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (separator == '' && reHasComplexSymbol.test(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return nativeSplit.call(string, separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = baseClamp(toInteger(position), 0, string.length);
      return string.lastIndexOf(baseToString(target), position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES delimiter as an alternative to the default "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, assignInDefaults);

      var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrim, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimEnd, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (reHasComplexSymbol.test(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord;
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = rest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, 'onClick');
     * jQuery(element).on('click', view.onClick);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = rest(function(object, methodNames) {
      arrayEach(baseFlatten(methodNames, 1), function(key) {
        key = toKey(key);
        object[key] = bind(object[key], object);
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.constant(true),                _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs ? pairs.length : 0,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return rest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.filter(users, _.conforms({ 'age': _.partial(_.gt, _, 38) }));
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, true));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] Functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] Functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument given to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, true));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`. The created function is equivalent to
     * `_.isMatch` with a `source` partially applied.
     *
     * **Note:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = rest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = rest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at `n` index. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return rest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
     *  [iteratees=[_.identity]] The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over(Math.max, Math.min);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
     *  [predicates=[_.identity]] The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery(Boolean, isFinite);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
     *  [predicates=[_.identity]] The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome(Boolean, isFinite);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(true));
     * // => [true, true, true, true]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     *
     * var path = ['a', 'b', 'c'],
     *     newPath = _.toPath(path);
     *
     * console.log(newPath);
     * // => ['a', 'b', 'c']
     *
     * console.log(path === newPath);
     * // => false
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(value));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    });

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    });

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee), baseGt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee), baseLt)
        : undefined;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    });

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    });

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Array|Function|Object|string} [iteratee=_.identity]
     *  The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.deburr = deburr;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = rest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      predicate = getIteratee(predicate, 3);
      return this.filter(function(value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = (lodashFunc.name + ''),
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    if (iteratorSymbol) {
      lodash.prototype[iteratorSymbol] = wrapperToIterator;
    }
    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Expose Lodash on the free variable `window` or `self` when available so it's
  // globally accessible, even when bundled with Browserify, Webpack, etc. This
  // also prevents errors in cases where Lodash is loaded by a script tag in the
  // presence of an AMD loader. See http://requirejs.org/docs/errors.html#mismatch
  // for more details. Use `_.noConflict` to remove Lodash from the global object.
  (freeWindow || freeSelf || {})._ = _;

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(this));/*!
* d3pie
* @author Ben Keen
* @version 0.1.8
* @date April 2015
* @repo http://github.com/benkeen/d3pie
*/
!function(a,b){"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b(require()):a.d3pie=b(a)}(this,function(){var a="d3pie",b="0.1.6",c=0,d={header:{title:{text:"",color:"#333333",fontSize:18,font:"arial"},subtitle:{text:"",color:"#666666",fontSize:14,font:"arial"},location:"top-center",titleSubtitlePadding:8},footer:{text:"",color:"#666666",fontSize:14,font:"arial",location:"left"},size:{canvasHeight:500,canvasWidth:500,pieInnerRadius:"0%",pieOuterRadius:null},data:{sortOrder:"none",ignoreSmallSegments:{enabled:!1,valueType:"percentage",value:null},smallSegmentGrouping:{enabled:!1,value:1,valueType:"percentage",label:"Other",color:"#cccccc"},content:[]},labels:{outer:{format:"label",hideWhenLessThanPercentage:null,pieDistance:30},inner:{format:"percentage",hideWhenLessThanPercentage:null},mainLabel:{color:"#333333",font:"arial",fontSize:10},percentage:{color:"#dddddd",font:"arial",fontSize:10,decimalPlaces:0},value:{color:"#cccc44",font:"arial",fontSize:10},lines:{enabled:!0,style:"curved",color:"segment"},truncation:{enabled:!1,truncateLength:30},formatter:null},effects:{load:{effect:"default",speed:1e3},pullOutSegmentOnClick:{effect:"bounce",speed:300,size:10},highlightSegmentOnMouseover:!0,highlightLuminosity:-.2},tooltips:{enabled:!1,type:"placeholder",string:"",placeholderParser:null,styles:{fadeInSpeed:250,backgroundColor:"#000000",backgroundOpacity:.5,color:"#efefef",borderRadius:2,font:"arial",fontSize:10,padding:4}},misc:{colors:{background:null,segments:["#2484c1","#65a620","#7b6888","#a05d56","#961a1a","#d8d23a","#e98125","#d0743c","#635222","#6ada6a","#0c6197","#7d9058","#207f33","#44b9b0","#bca44a","#e4a14b","#a3acb2","#8cc3e9","#69a6f9","#5b388f","#546e91","#8bde95","#d2ab58","#273c71","#98bf6e","#4daa4b","#98abc5","#cc1010","#31383b","#006391","#c2643f","#b0a474","#a5a39c","#a9c2bc","#22af8c","#7fcecf","#987ac6","#3d3b87","#b77b1c","#c9c2b6","#807ece","#8db27c","#be66a2","#9ed3c6","#00644b","#005064","#77979f","#77e079","#9c73ab","#1f79a7"],segmentStroke:"#ffffff"},gradient:{enabled:!1,percentage:95,color:"#000000"},canvasPadding:{top:5,right:5,bottom:5,left:5},pieCenterOffset:{x:0,y:0},cssPrefix:null},callbacks:{onload:null,onMouseoverSegment:null,onMouseoutSegment:null,onClickSegment:null}},e={initialCheck:function(a){var b=a.cssPrefix,c=a.element,d=a.options;if(!window.d3||!window.d3.hasOwnProperty("version"))return console.error("d3pie error: d3 is not available"),!1;if(!(c instanceof HTMLElement||c instanceof SVGElement))return console.error("d3pie error: the first d3pie() param must be a valid DOM element (not jQuery) or a ID string."),!1;if(!/[a-zA-Z][a-zA-Z0-9_-]*$/.test(b))return console.error("d3pie error: invalid options.misc.cssPrefix"),!1;if(!f.isArray(d.data.content))return console.error("d3pie error: invalid config structure: missing data.content property."),!1;if(0===d.data.content.length)return console.error("d3pie error: no data supplied."),!1;for(var e=[],g=0;g<d.data.content.length;g++)"number"!=typeof d.data.content[g].value||isNaN(d.data.content[g].value)?console.log("not valid: ",d.data.content[g]):d.data.content[g].value<=0?console.log("not valid - should have positive value: ",d.data.content[g]):e.push(d.data.content[g]);return a.options.data.content=e,!0}},f={addSVGSpace:function(a){var b=a.element,c=a.options.size.canvasWidth,d=a.options.size.canvasHeight,e=a.options.misc.colors.background,f=d3.select(b).append("svg:svg").attr("width",c).attr("height",d);return"transparent"!==e&&f.style("background-color",function(){return e}),f},whenIdExists:function(a,b){var c=1,d=1e3,e=setInterval(function(){document.getElementById(a)&&(clearInterval(e),b()),c>d&&clearInterval(e),c++},1)},whenElementsExist:function(a,b){var c=1,d=1e3,e=setInterval(function(){for(var f=!0,g=0;g<a.length;g++)if(!document.getElementById(a[g])){f=!1;break}f&&(clearInterval(e),b()),c>d&&clearInterval(e),c++},1)},shuffleArray:function(a){for(var b,c,d=a.length;0!==d;)c=Math.floor(Math.random()*d),d-=1,b=a[d],a[d]=a[c],a[c]=b;return a},processObj:function(a,b,c){return"string"==typeof b?f.processObj(a,b.split("."),c):1===b.length&&void 0!==c?(a[b[0]]=c,a[b[0]]):0===b.length?a:f.processObj(a[b[0]],b.slice(1),c)},getDimensions:function(a){var b=document.getElementById(a),c=0,d=0;if(b){var e=b.getBBox();c=e.width,d=e.height}else console.log("error: getDimensions() "+a+" not found.");return{w:c,h:d}},rectIntersect:function(a,b){var c=b.x>a.x+a.w||b.x+b.w<a.x||b.y+b.h<a.y||b.y>a.y+a.h;return!c},getColorShade:function(a,b){a=String(a).replace(/[^0-9a-f]/gi,""),a.length<6&&(a=a[0]+a[0]+a[1]+a[1]+a[2]+a[2]),b=b||0;for(var c="#",d=0;3>d;d++){var e=parseInt(a.substr(2*d,2),16);e=Math.round(Math.min(Math.max(0,e+e*b),255)).toString(16),c+=("00"+e).substr(e.length)}return c},initSegmentColors:function(a){for(var b=a.options.data.content,c=a.options.misc.colors.segments,d=[],e=0;e<b.length;e++)d.push(b[e].hasOwnProperty("color")?b[e].color:c[e]);return d},applySmallSegmentGrouping:function(a,b){var c;"percentage"===b.valueType&&(c=h.getTotalPieSize(a));for(var d=[],e=[],f=0,g=0;g<a.length;g++)if("percentage"===b.valueType){var i=a[g].value/c*100;if(i<=b.value){e.push(a[g]),f+=a[g].value;continue}a[g].isGrouped=!1,d.push(a[g])}else{if(a[g].value<=b.value){e.push(a[g]),f+=a[g].value;continue}a[g].isGrouped=!1,d.push(a[g])}return e.length&&d.push({color:b.color,label:b.label,value:f,isGrouped:!0,groupedData:e}),d},showPoint:function(a,b,c){a.append("circle").attr("cx",b).attr("cy",c).attr("r",2).style("fill","black")},isFunction:function(a){var b={};return a&&"[object Function]"===b.toString.call(a)},isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)}},g=function(){var a,b,c,d,e,f,h=arguments[0]||{},i=1,j=arguments.length,k=!1,l=Object.prototype.toString,m=Object.prototype.hasOwnProperty,n={"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regexp","[object Object]":"object"},o={isFunction:function(a){return"function"===o.type(a)},isArray:Array.isArray||function(a){return"array"===o.type(a)},isWindow:function(a){return null!==a&&a===a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return null===a?String(a):n[l.call(a)]||"object"},isPlainObject:function(a){if(!a||"object"!==o.type(a)||a.nodeType)return!1;try{if(a.constructor&&!m.call(a,"constructor")&&!m.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(b){return!1}var c;for(c in a);return void 0===c||m.call(a,c)}};for("boolean"==typeof h&&(k=h,h=arguments[1]||{},i=2),"object"==typeof h||o.isFunction(h)||(h={}),j===i&&(h=this,--i),i;j>i;i++)if(null!==(a=arguments[i]))for(b in a)c=h[b],d=a[b],h!==d&&(k&&d&&(o.isPlainObject(d)||(e=o.isArray(d)))?(e?(e=!1,f=c&&o.isArray(c)?c:[]):f=c&&o.isPlainObject(c)?c:{},h[b]=g(k,f,d)):void 0!==d&&(h[b]=d));return h},h={toRadians:function(a){return a*(Math.PI/180)},toDegrees:function(a){return a*(180/Math.PI)},computePieRadius:function(a){var b=a.options.size,c=a.options.misc.canvasPadding,d=b.canvasWidth-c.left-c.right,e=b.canvasHeight-c.top-c.bottom;"pie-center"!==a.options.header.location&&(e-=a.textComponents.headerHeight),a.textComponents.footer.exists&&(e-=a.textComponents.footer.h),e=0>e?0:e;var f,g,h=(e>d?d:e)/3;if(null!==b.pieOuterRadius)if(/%/.test(b.pieOuterRadius)){g=parseInt(b.pieOuterRadius.replace(/[\D]/,""),10),g=g>99?99:g,g=0>g?0:g;var i=e>d?d:e;if("none"!==a.options.labels.outer.format){var j=2*parseInt(a.options.labels.outer.pieDistance,10);i-j>0&&(i-=j)}h=Math.floor(i/100*g)/2}else h=parseInt(b.pieOuterRadius,10);/%/.test(b.pieInnerRadius)?(g=parseInt(b.pieInnerRadius.replace(/[\D]/,""),10),g=g>99?99:g,g=0>g?0:g,f=Math.floor(h/100*g)):f=parseInt(b.pieInnerRadius,10),a.innerRadius=f,a.outerRadius=h},getTotalPieSize:function(a){for(var b=0,c=0;c<a.length;c++)b+=a[c].value;return b},sortPieData:function(a){var b=a.options.data.content,c=a.options.data.sortOrder;switch(c){case"none":break;case"random":b=f.shuffleArray(b);break;case"value-asc":b.sort(function(a,b){return a.value<b.value?-1:1});break;case"value-desc":b.sort(function(a,b){return a.value<b.value?1:-1});break;case"label-asc":b.sort(function(a,b){return a.label.toLowerCase()>b.label.toLowerCase()?1:-1});break;case"label-desc":b.sort(function(a,b){return a.label.toLowerCase()<b.label.toLowerCase()?1:-1})}return b},getPieTranslateCenter:function(a){return"translate("+a.x+","+a.y+")"},calculatePieCenter:function(a){var b=a.options.misc.pieCenterOffset,c=a.textComponents.title.exists&&"pie-center"!==a.options.header.location,d=a.textComponents.subtitle.exists&&"pie-center"!==a.options.header.location,e=a.options.misc.canvasPadding.top;c&&d?e+=a.textComponents.title.h+a.options.header.titleSubtitlePadding+a.textComponents.subtitle.h:c?e+=a.textComponents.title.h:d&&(e+=a.textComponents.subtitle.h);var f=0;a.textComponents.footer.exists&&(f=a.textComponents.footer.h+a.options.misc.canvasPadding.bottom);var g=(a.options.size.canvasWidth-a.options.misc.canvasPadding.left-a.options.misc.canvasPadding.right)/2+a.options.misc.canvasPadding.left,h=(a.options.size.canvasHeight-f-e)/2+e;g+=b.x,h+=b.y,a.pieCenter={x:g,y:h}},rotate:function(a,b,c,d,e){e=e*Math.PI/180;var f=Math.cos,g=Math.sin,h=(a-c)*f(e)-(b-d)*g(e)+c,i=(a-c)*g(e)+(b-d)*f(e)+d;return{x:h,y:i}},translate:function(a,b,c,d){var e=h.toRadians(d);return{x:a+c*Math.sin(e),y:b-c*Math.cos(e)}},pointIsInArc:function(a,b,c){var d=c.innerRadius()(b),e=c.outerRadius()(b),f=c.startAngle()(b),g=c.endAngle()(b),h=a.x*a.x+a.y*a.y,i=Math.atan2(a.x,-a.y);return i=0>i?i+2*Math.PI:i,h>=d*d&&e*e>=h&&i>=f&&g>=i}},i={add:function(a,b,c){var d=i.getIncludes(c),e=a.options.labels,f=a.svg.insert("g","."+a.cssPrefix+"labels-"+b).attr("class",a.cssPrefix+"labels-"+b),g=f.selectAll("."+a.cssPrefix+"labelGroup-"+b).data(a.options.data.content).enter().append("g").attr("id",function(c,d){return a.cssPrefix+"labelGroup"+d+"-"+b}).attr("data-index",function(a,b){return b}).attr("class",a.cssPrefix+"labelGroup-"+b).style("opacity",0),h={section:b,sectionDisplayType:c};d.mainLabel&&g.append("text").attr("id",function(c,d){return a.cssPrefix+"segmentMainLabel"+d+"-"+b}).attr("class",a.cssPrefix+"segmentMainLabel-"+b).text(function(a,b){var c=a.label;return e.formatter?(h.index=b,h.part="mainLabel",h.value=a.value,h.label=c,c=e.formatter(h)):e.truncation.enabled&&a.label.length>e.truncation.truncateLength&&(c=a.label.substring(0,e.truncation.truncateLength)+"..."),c}).style("font-size",e.mainLabel.fontSize+"px").style("font-family",e.mainLabel.font).style("fill",e.mainLabel.color),d.percentage&&g.append("text").attr("id",function(c,d){return a.cssPrefix+"segmentPercentage"+d+"-"+b}).attr("class",a.cssPrefix+"segmentPercentage-"+b).text(function(b,c){var d=j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces);return e.formatter?(h.index=c,h.part="percentage",h.value=b.value,h.label=d,d=e.formatter(h)):d+="%",d}).style("font-size",e.percentage.fontSize+"px").style("font-family",e.percentage.font).style("fill",e.percentage.color),d.value&&g.append("text").attr("id",function(c,d){return a.cssPrefix+"segmentValue"+d+"-"+b}).attr("class",a.cssPrefix+"segmentValue-"+b).text(function(a,b){return h.index=b,h.part="value",h.value=a.value,h.label=a.value,e.formatter?e.formatter(h,a.value):a.value}).style("font-size",e.value.fontSize+"px").style("font-family",e.value.font).style("fill",e.value.color)},positionLabelElements:function(a,b,c){i["dimensions-"+b]=[];var d=d3.selectAll("."+a.cssPrefix+"labelGroup-"+b);d.each(function(c,d){var e=d3.select(this).selectAll("."+a.cssPrefix+"segmentMainLabel-"+b),f=d3.select(this).selectAll("."+a.cssPrefix+"segmentPercentage-"+b),g=d3.select(this).selectAll("."+a.cssPrefix+"segmentValue-"+b);i["dimensions-"+b].push({mainLabel:null!==e.node()?e.node().getBBox():null,percentage:null!==f.node()?f.node().getBBox():null,value:null!==g.node()?g.node().getBBox():null})});var e=5,f=i["dimensions-"+b];switch(c){case"label-value1":d3.selectAll("."+a.cssPrefix+"segmentValue-"+b).attr("dx",function(a,b){return f[b].mainLabel.width+e});break;case"label-value2":d3.selectAll("."+a.cssPrefix+"segmentValue-"+b).attr("dy",function(a,b){return f[b].mainLabel.height});break;case"label-percentage1":d3.selectAll("."+a.cssPrefix+"segmentPercentage-"+b).attr("dx",function(a,b){return f[b].mainLabel.width+e});break;case"label-percentage2":d3.selectAll("."+a.cssPrefix+"segmentPercentage-"+b).attr("dx",function(a,b){return f[b].mainLabel.width/2-f[b].percentage.width/2}).attr("dy",function(a,b){return f[b].mainLabel.height})}},computeLabelLinePositions:function(a){a.lineCoordGroups=[],d3.selectAll("."+a.cssPrefix+"labelGroup-outer").each(function(b,c){return i.computeLinePosition(a,c)})},computeLinePosition:function(a,b){var c,d,e,f,g=j.getSegmentAngle(b,a.options.data.content,a.totalSize,{midpoint:!0}),i=h.rotate(a.pieCenter.x,a.pieCenter.y-a.outerRadius,a.pieCenter.x,a.pieCenter.y,g),k=a.outerLabelGroupData[b].h/5,l=6,m=Math.floor(g/90),n=4;switch(2===m&&180===g&&(m=1),m){case 0:c=a.outerLabelGroupData[b].x-l-(a.outerLabelGroupData[b].x-l-i.x)/2,d=a.outerLabelGroupData[b].y+(i.y-a.outerLabelGroupData[b].y)/n,e=a.outerLabelGroupData[b].x-l,f=a.outerLabelGroupData[b].y-k;break;case 1:c=i.x+(a.outerLabelGroupData[b].x-i.x)/n,d=i.y+(a.outerLabelGroupData[b].y-i.y)/n,e=a.outerLabelGroupData[b].x-l,f=a.outerLabelGroupData[b].y-k;break;case 2:var o=a.outerLabelGroupData[b].x+a.outerLabelGroupData[b].w+l;c=i.x-(i.x-o)/n,d=i.y+(a.outerLabelGroupData[b].y-i.y)/n,e=a.outerLabelGroupData[b].x+a.outerLabelGroupData[b].w+l,f=a.outerLabelGroupData[b].y-k;break;case 3:var p=a.outerLabelGroupData[b].x+a.outerLabelGroupData[b].w+l;c=p+(i.x-p)/n,d=a.outerLabelGroupData[b].y+(i.y-a.outerLabelGroupData[b].y)/n,e=a.outerLabelGroupData[b].x+a.outerLabelGroupData[b].w+l,f=a.outerLabelGroupData[b].y-k}"straight"===a.options.labels.lines.style?a.lineCoordGroups[b]=[{x:i.x,y:i.y},{x:e,y:f}]:a.lineCoordGroups[b]=[{x:i.x,y:i.y},{x:c,y:d},{x:e,y:f}]},addLabelLines:function(a){var b=a.svg.insert("g","."+a.cssPrefix+"pieChart").attr("class",a.cssPrefix+"lineGroups").style("opacity",0),c=b.selectAll("."+a.cssPrefix+"lineGroup").data(a.lineCoordGroups).enter().append("g").attr("class",a.cssPrefix+"lineGroup"),d=d3.svg.line().interpolate("basis").x(function(a){return a.x}).y(function(a){return a.y});c.append("path").attr("d",d).attr("stroke",function(b,c){return"segment"===a.options.labels.lines.color?a.options.colors[c]:a.options.labels.lines.color}).attr("stroke-width",1).attr("fill","none").style("opacity",function(b,c){var d=a.options.labels.outer.hideWhenLessThanPercentage,e=j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces),f=null!==d&&d>e||""===a.options.data.content[c].label;return f?0:1})},positionLabelGroups:function(a,b){"none"!==a.options.labels[b].format&&d3.selectAll("."+a.cssPrefix+"labelGroup-"+b).style("opacity",0).attr("transform",function(c,d){var e,i;if("outer"===b)e=a.outerLabelGroupData[d].x,i=a.outerLabelGroupData[d].y;else{var k=g(!0,{},a.pieCenter);if(a.innerRadius>0){var l=j.getSegmentAngle(d,a.options.data.content,a.totalSize,{midpoint:!0}),m=h.translate(a.pieCenter.x,a.pieCenter.y,a.innerRadius,l);k.x=m.x,k.y=m.y}var n=f.getDimensions(a.cssPrefix+"labelGroup"+d+"-inner"),o=n.w/2,p=n.h/4;e=k.x+(a.lineCoordGroups[d][0].x-k.x)/1.8,i=k.y+(a.lineCoordGroups[d][0].y-k.y)/1.8,e-=o,i+=p}return"translate("+e+","+i+")"})},fadeInLabelsAndLines:function(a){var b="default"===a.options.effects.load.effect?a.options.effects.load.speed:1;setTimeout(function(){var b="default"===a.options.effects.load.effect?400:1;d3.selectAll("."+a.cssPrefix+"labelGroup-outer").transition().duration(b).style("opacity",function(b,c){var d=a.options.labels.outer.hideWhenLessThanPercentage,e=j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces);return null!==d&&d>e?0:1}),d3.selectAll("."+a.cssPrefix+"labelGroup-inner").transition().duration(b).style("opacity",function(b,c){var d=a.options.labels.inner.hideWhenLessThanPercentage,e=j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces);return null!==d&&d>e?0:1}),d3.selectAll("g."+a.cssPrefix+"lineGroups").transition().duration(b).style("opacity",1),f.isFunction(a.options.callbacks.onload)&&setTimeout(function(){try{a.options.callbacks.onload()}catch(b){}},b)},b)},getIncludes:function(a){var b=!1,c=!1,d=!1;switch(a){case"label":b=!0;break;case"value":c=!0;break;case"percentage":d=!0;break;case"label-value1":case"label-value2":b=!0,c=!0;break;case"label-percentage1":case"label-percentage2":b=!0,d=!0}return{mainLabel:b,value:c,percentage:d}},computeOuterLabelCoords:function(a){a.svg.selectAll("."+a.cssPrefix+"labelGroup-outer").each(function(b,c){return i.getIdealOuterLabelPositions(a,c)}),i.resolveOuterLabelCollisions(a)},resolveOuterLabelCollisions:function(a){if("none"!==a.options.labels.outer.format){var b=a.options.data.content.length;i.checkConflict(a,0,"clockwise",b),i.checkConflict(a,b-1,"anticlockwise",b)}},checkConflict:function(a,b,c,d){var e,g;if(!(1>=d)){var h=a.outerLabelGroupData[b].hs;if(!("clockwise"===c&&"right"!==h||"anticlockwise"===c&&"left"!==h)){var j="clockwise"===c?b+1:b-1,k=a.outerLabelGroupData[b],l=a.outerLabelGroupData[j],m={labelHeights:a.outerLabelGroupData[0].h,center:a.pieCenter,lineLength:a.outerRadius+a.options.labels.outer.pieDistance,heightChange:a.outerLabelGroupData[0].h+1};if("clockwise"===c){for(e=0;b>=e;e++)if(g=a.outerLabelGroupData[e],f.rectIntersect(g,l)){i.adjustLabelPos(a,j,k,m);break}}else for(e=d-1;e>=b;e--)if(g=a.outerLabelGroupData[e],f.rectIntersect(g,l)){i.adjustLabelPos(a,j,k,m);break}i.checkConflict(a,j,c,d)}}},adjustLabelPos:function(a,b,c,d){var e,f,g,h;h=c.y+d.heightChange,f=d.center.y-h,e=Math.sqrt(Math.abs(d.lineLength)>Math.abs(f)?d.lineLength*d.lineLength-f*f:f*f-d.lineLength*d.lineLength),g="right"===c.hs?d.center.x+e:d.center.x-e-a.outerLabelGroupData[b].w,a.outerLabelGroupData[b].x=g,a.outerLabelGroupData[b].y=h},getIdealOuterLabelPositions:function(a,b){var c=d3.select("#"+a.cssPrefix+"labelGroup"+b+"-outer").node();if(c){var d=c.getBBox(),e=j.getSegmentAngle(b,a.options.data.content,a.totalSize,{midpoint:!0}),f=a.pieCenter.x,g=a.pieCenter.y-(a.outerRadius+a.options.labels.outer.pieDistance),i=h.rotate(f,g,a.pieCenter.x,a.pieCenter.y,e),k="right";e>180?(i.x-=d.width+8,k="left"):i.x+=8,a.outerLabelGroupData[b]={x:i.x,y:i.y,w:d.width,h:d.height,hs:k}}}},j={create:function(a){var b=a.pieCenter,c=a.options.colors,d=a.options.effects.load,e=a.options.misc.colors.segmentStroke,f=a.svg.insert("g","#"+a.cssPrefix+"title").attr("transform",function(){return h.getPieTranslateCenter(b)}).attr("class",a.cssPrefix+"pieChart"),g=d3.svg.arc().innerRadius(a.innerRadius).outerRadius(a.outerRadius).startAngle(0).endAngle(function(b){return b.value/a.totalSize*2*Math.PI}),i=f.selectAll("."+a.cssPrefix+"arc").data(a.options.data.content).enter().append("g").attr("class",a.cssPrefix+"arc"),k=d.speed;"none"===d.effect&&(k=0),i.append("path").attr("id",function(b,c){return a.cssPrefix+"segment"+c}).attr("fill",function(b,d){var e=c[d];return a.options.misc.gradient.enabled&&(e="url(#"+a.cssPrefix+"grad"+d+")"),e}).style("stroke",e).style("stroke-width",1).transition().ease("cubic-in-out").duration(k).attr("data-index",function(a,b){return b}).attrTween("d",function(b){var c=d3.interpolate({value:0},b);return function(b){return a.arc(c(b))}}),a.svg.selectAll("g."+a.cssPrefix+"arc").attr("transform",function(b,c){var d=0;return c>0&&(d=j.getSegmentAngle(c-1,a.options.data.content,a.totalSize)),"rotate("+d+")"}),a.arc=g},addGradients:function(a){var b=a.svg.append("defs").selectAll("radialGradient").data(a.options.data.content).enter().append("radialGradient").attr("gradientUnits","userSpaceOnUse").attr("cx",0).attr("cy",0).attr("r","120%").attr("id",function(b,c){return a.cssPrefix+"grad"+c});b.append("stop").attr("offset","0%").style("stop-color",function(b,c){return a.options.colors[c]}),b.append("stop").attr("offset",a.options.misc.gradient.percentage+"%").style("stop-color",a.options.misc.gradient.color)},addSegmentEventHandlers:function(a){var b=d3.selectAll("."+a.cssPrefix+"arc,."+a.cssPrefix+"labelGroup-inner,."+a.cssPrefix+"labelGroup-outer");b.on("click",function(){var b,c=d3.select(this);if(c.attr("class")===a.cssPrefix+"arc")b=c.select("path");else{var d=c.attr("data-index");b=d3.select("#"+a.cssPrefix+"segment"+d)}var e=b.attr("class")===a.cssPrefix+"expanded";j.onSegmentEvent(a,a.options.callbacks.onClickSegment,b,e),"none"!==a.options.effects.pullOutSegmentOnClick.effect&&(e?j.closeSegment(a,b.node()):j.openSegment(a,b.node()))}),b.on("mouseover",function(){var b,c,d=d3.select(this);if(d.attr("class")===a.cssPrefix+"arc"?b=d.select("path"):(c=d.attr("data-index"),b=d3.select("#"+a.cssPrefix+"segment"+c)),a.options.effects.highlightSegmentOnMouseover){c=b.attr("data-index");var e=a.options.colors[c];b.style("fill",f.getColorShade(e,a.options.effects.highlightLuminosity))}a.options.tooltips.enabled&&(c=b.attr("data-index"),l.showTooltip(a,c));var g=b.attr("class")===a.cssPrefix+"expanded";j.onSegmentEvent(a,a.options.callbacks.onMouseoverSegment,b,g)}),b.on("mousemove",function(){l.moveTooltip(a)}),b.on("mouseout",function(){var b,c,d=d3.select(this);if(d.attr("class")===a.cssPrefix+"arc"?b=d.select("path"):(c=d.attr("data-index"),b=d3.select("#"+a.cssPrefix+"segment"+c)),a.options.effects.highlightSegmentOnMouseover){c=b.attr("data-index");var e=a.options.colors[c];a.options.misc.gradient.enabled&&(e="url(#"+a.cssPrefix+"grad"+c+")"),b.style("fill",e)}a.options.tooltips.enabled&&(c=b.attr("data-index"),l.hideTooltip(a,c));var f=b.attr("class")===a.cssPrefix+"expanded";j.onSegmentEvent(a,a.options.callbacks.onMouseoutSegment,b,f)})},onSegmentEvent:function(a,b,c,d){if(f.isFunction(b)){var e=parseInt(c.attr("data-index"),10);b({segment:c.node(),index:e,expanded:d,data:a.options.data.content[e]})}},openSegment:function(a,b){a.isOpeningSegment||(a.isOpeningSegment=!0,d3.selectAll("."+a.cssPrefix+"expanded").length>0&&j.closeSegment(a,d3.select("."+a.cssPrefix+"expanded").node()),d3.select(b).transition().ease(a.options.effects.pullOutSegmentOnClick.effect).duration(a.options.effects.pullOutSegmentOnClick.speed).attr("transform",function(b,c){var d=a.arc.centroid(b),e=d[0],f=d[1],g=Math.sqrt(e*e+f*f),h=parseInt(a.options.effects.pullOutSegmentOnClick.size,10);return"translate("+e/g*h+","+f/g*h+")"}).each("end",function(c,d){a.currentlyOpenSegment=b,a.isOpeningSegment=!1,d3.select(this).attr("class",a.cssPrefix+"expanded")}))},closeSegment:function(a,b){d3.select(b).transition().duration(400).attr("transform","translate(0,0)").each("end",function(b,c){d3.select(this).attr("class",""),a.currentlyOpenSegment=null})},getCentroid:function(a){var b=a.getBBox();return{x:b.x+b.width/2,y:b.y+b.height/2}},getSegmentAngle:function(a,b,c,d){var e,f=g({compounded:!0,midpoint:!1},d),h=b[a].value;if(f.compounded){e=0;for(var i=0;a>=i;i++)e+=b[i].value}"undefined"==typeof e&&(e=h);var j=e/c*360;if(f.midpoint){var k=h/c*360;j-=k/2}return j},getPercentage:function(a,b,c){var d=a.options.data.content[b].value/a.totalSize;return 0>=c?Math.round(100*d):(100*d).toFixed(c)}},k={offscreenCoord:-1e4,addTitle:function(a){a.svg.selectAll("."+a.cssPrefix+"title").data([a.options.header.title]).enter().append("text").text(function(a){return a.text}).attr({id:a.cssPrefix+"title","class":a.cssPrefix+"title",x:k.offscreenCoord,y:k.offscreenCoord}).attr("text-anchor",function(){var b;return b="top-center"===a.options.header.location||"pie-center"===a.options.header.location?"middle":"left"}).attr("fill",function(a){return a.color}).style("font-size",function(a){return a.fontSize+"px"}).style("font-family",function(a){return a.font})},positionTitle:function(a){var b,c=a.textComponents,d=a.options.header.location,e=a.options.misc.canvasPadding,f=a.options.size.canvasWidth,g=a.options.header.titleSubtitlePadding;b="top-left"===d?e.left:(f-e.right)/2+e.left,b+=a.options.misc.pieCenterOffset.x;var h=e.top+c.title.h;if("pie-center"===d)if(h=a.pieCenter.y,c.subtitle.exists){var i=c.title.h+g+c.subtitle.h;h=h-i/2+c.title.h}else h+=c.title.h/4;a.svg.select("#"+a.cssPrefix+"title").attr("x",b).attr("y",h)},addSubtitle:function(a){var b=a.options.header.location;a.svg.selectAll("."+a.cssPrefix+"subtitle").data([a.options.header.subtitle]).enter().append("text").text(function(a){return a.text}).attr("x",k.offscreenCoord).attr("y",k.offscreenCoord).attr("id",a.cssPrefix+"subtitle").attr("class",a.cssPrefix+"subtitle").attr("text-anchor",function(){var a;return a="top-center"===b||"pie-center"===b?"middle":"left"}).attr("fill",function(a){return a.color}).style("font-size",function(a){return a.fontSize+"px"}).style("font-family",function(a){return a.font})},positionSubtitle:function(a){var b,c=a.options.misc.canvasPadding,d=a.options.size.canvasWidth;b="top-left"===a.options.header.location?c.left:(d-c.right)/2+c.left,b+=a.options.misc.pieCenterOffset.x;var e=k.getHeaderHeight(a);a.svg.select("#"+a.cssPrefix+"subtitle").attr("x",b).attr("y",e)},addFooter:function(a){a.svg.selectAll("."+a.cssPrefix+"footer").data([a.options.footer]).enter().append("text").text(function(a){return a.text}).attr("x",k.offscreenCoord).attr("y",k.offscreenCoord).attr("id",a.cssPrefix+"footer").attr("class",a.cssPrefix+"footer").attr("text-anchor",function(){var b="left";return"bottom-center"===a.options.footer.location?b="middle":"bottom-right"===a.options.footer.location&&(b="left"),b}).attr("fill",function(a){return a.color}).style("font-size",function(a){return a.fontSize+"px"}).style("font-family",function(a){return a.font})},positionFooter:function(a){var b,c=a.options.footer.location,d=a.textComponents.footer.w,e=a.options.size.canvasWidth,f=a.options.size.canvasHeight,g=a.options.misc.canvasPadding;b="bottom-left"===c?g.left:"bottom-right"===c?e-d-g.right:e/2,a.svg.select("#"+a.cssPrefix+"footer").attr("x",b).attr("y",f-g.bottom)},getHeaderHeight:function(a){var b;if(a.textComponents.title.exists){var c=a.textComponents.title.h+a.options.header.titleSubtitlePadding+a.textComponents.subtitle.h;b="pie-center"===a.options.header.location?a.pieCenter.y-c/2+c:c+a.options.misc.canvasPadding.top}else if("pie-center"===a.options.header.location){var d=a.options.misc.canvasPadding.bottom+a.textComponents.footer.h;b=(a.options.size.canvasHeight-d)/2+a.options.misc.canvasPadding.top+a.textComponents.subtitle.h/2}else b=a.options.misc.canvasPadding.top+a.textComponents.subtitle.h;return b}},l={addTooltips:function(a){var b=a.svg.insert("g").attr("class",a.cssPrefix+"tooltips");b.selectAll("."+a.cssPrefix+"tooltip").data(a.options.data.content).enter().append("g").attr("class",a.cssPrefix+"tooltip").attr("id",function(b,c){return a.cssPrefix+"tooltip"+c}).style("opacity",0).append("rect").attr({rx:a.options.tooltips.styles.borderRadius,ry:a.options.tooltips.styles.borderRadius,x:-a.options.tooltips.styles.padding,opacity:a.options.tooltips.styles.backgroundOpacity}).style("fill",a.options.tooltips.styles.backgroundColor),b.selectAll("."+a.cssPrefix+"tooltip").data(a.options.data.content).append("text").attr("fill",function(b){return a.options.tooltips.styles.color}).style("font-size",function(b){return a.options.tooltips.styles.fontSize}).style("font-family",function(b){return a.options.tooltips.styles.font}).text(function(b,c){var d=a.options.tooltips.string;return"caption"===a.options.tooltips.type&&(d=b.caption),l.replacePlaceholders(a,d,c,{label:b.label,value:b.value,percentage:j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces)})}),b.selectAll("."+a.cssPrefix+"tooltip rect").attr({width:function(b,c){var d=f.getDimensions(a.cssPrefix+"tooltip"+c);return d.w+2*a.options.tooltips.styles.padding},height:function(b,c){var d=f.getDimensions(a.cssPrefix+"tooltip"+c);return d.h+2*a.options.tooltips.styles.padding},y:function(b,c){var d=f.getDimensions(a.cssPrefix+"tooltip"+c);return-(d.h/2)+1}})},showTooltip:function(a,b){var c=a.options.tooltips.styles.fadeInSpeed;l.currentTooltip===b&&(c=1),l.currentTooltip=b,d3.select("#"+a.cssPrefix+"tooltip"+b).transition().duration(c).style("opacity",function(){return 1}),l.moveTooltip(a)},moveTooltip:function(a){d3.selectAll("#"+a.cssPrefix+"tooltip"+l.currentTooltip).attr("transform",function(b){var c=d3.mouse(this.parentNode),d=c[0]+a.options.tooltips.styles.padding+2,e=c[1]-2*a.options.tooltips.styles.padding-2;return"translate("+d+","+e+")"})},hideTooltip:function(a,b){d3.select("#"+a.cssPrefix+"tooltip"+b).style("opacity",function(){return 0}),d3.select("#"+a.cssPrefix+"tooltip"+l.currentTooltip).attr("transform",function(b,c){var d=a.options.size.canvasWidth+1e3,e=a.options.size.canvasHeight+1e3;return"translate("+d+","+e+")"})},replacePlaceholders:function(a,b,c,d){f.isFunction(a.options.tooltips.placeholderParser)&&a.options.tooltips.placeholderParser(c,d);var e=function(){return function(a){var b=arguments[1];return d.hasOwnProperty(b)?d[arguments[1]]:arguments[0]}};return b.replace(/\{(\w+)\}/g,e(d))}},m=function(i,j){if(this.element=i,"string"==typeof i){var k=i.replace(/^#/,"");this.element=document.getElementById(k)}var l={};g(!0,l,d,j),this.options=l,null!==this.options.misc.cssPrefix?this.cssPrefix=this.options.misc.cssPrefix:(this.cssPrefix="p"+c+"_",c++),e.initialCheck(this)&&(d3.select(this.element).attr(a,b),this.options.data.content=h.sortPieData(this),this.options.data.smallSegmentGrouping.enabled&&(this.options.data.content=f.applySmallSegmentGrouping(this.options.data.content,this.options.data.smallSegmentGrouping)),this.options.colors=f.initSegmentColors(this),this.totalSize=h.getTotalPieSize(this.options.data.content),n.call(this))};m.prototype.recreate=function(){e.initialCheck(this)&&(this.options.data.content=h.sortPieData(this),this.options.data.smallSegmentGrouping.enabled&&(this.options.data.content=f.applySmallSegmentGrouping(this.options.data.content,this.options.data.smallSegmentGrouping)),this.options.colors=f.initSegmentColors(this),this.totalSize=h.getTotalPieSize(this.options.data.content),n.call(this))},m.prototype.redraw=function(){this.element.innerHTML="",n.call(this)},m.prototype.destroy=function(){this.element.innerHTML="",d3.select(this.element).attr(a,null)},m.prototype.getOpenSegment=function(){var a=this.currentlyOpenSegment;if(null!==a&&"undefined"!=typeof a){var b=parseInt(d3.select(a).attr("data-index"),10);return{element:a,index:b,data:this.options.data.content[b]}}return null},m.prototype.openSegment=function(a){a=parseInt(a,10),0>a||a>this.options.data.content.length-1||j.openSegment(this,d3.select("#"+this.cssPrefix+"segment"+a).node())},m.prototype.closeSegment=function(){var a=this.currentlyOpenSegment;a&&j.closeSegment(this,a)},m.prototype.updateProp=function(a,b){switch(a){case"header.title.text":var c=f.processObj(this.options,a);f.processObj(this.options,a,b),d3.select("#"+this.cssPrefix+"title").html(b),(""===c&&""!==b||""!==c&&""===b)&&this.redraw();break;case"header.subtitle.text":var d=f.processObj(this.options,a);f.processObj(this.options,a,b),d3.select("#"+this.cssPrefix+"subtitle").html(b),(""===d&&""!==b||""!==d&&""===b)&&this.redraw();break;case"callbacks.onload":case"callbacks.onMouseoverSegment":case"callbacks.onMouseoutSegment":case"callbacks.onClickSegment":case"effects.pullOutSegmentOnClick.effect":case"effects.pullOutSegmentOnClick.speed":case"effects.pullOutSegmentOnClick.size":case"effects.highlightSegmentOnMouseover":case"effects.highlightLuminosity":f.processObj(this.options,a,b);break;default:f.processObj(this.options,a,b),this.destroy(),this.recreate()}};var n=function(){this.svg=f.addSVGSpace(this),this.textComponents={headerHeight:0,title:{exists:""!==this.options.header.title.text,h:0,w:0},subtitle:{exists:""!==this.options.header.subtitle.text,h:0,w:0},footer:{exists:""!==this.options.footer.text,h:0,w:0}},this.outerLabelGroupData=[],
this.textComponents.title.exists&&k.addTitle(this),this.textComponents.subtitle.exists&&k.addSubtitle(this),k.addFooter(this);var a=this;f.whenIdExists(this.cssPrefix+"footer",function(){k.positionFooter(a);var b=f.getDimensions(a.cssPrefix+"footer");a.textComponents.footer.h=b.h,a.textComponents.footer.w=b.w});var b=[];this.textComponents.title.exists&&b.push(this.cssPrefix+"title"),this.textComponents.subtitle.exists&&b.push(this.cssPrefix+"subtitle"),this.textComponents.footer.exists&&b.push(this.cssPrefix+"footer"),f.whenElementsExist(b,function(){if(a.textComponents.title.exists){var b=f.getDimensions(a.cssPrefix+"title");a.textComponents.title.h=b.h,a.textComponents.title.w=b.w}if(a.textComponents.subtitle.exists){var c=f.getDimensions(a.cssPrefix+"subtitle");a.textComponents.subtitle.h=c.h,a.textComponents.subtitle.w=c.w}if(a.textComponents.title.exists||a.textComponents.subtitle.exists){var d=0;a.textComponents.title.exists&&(d+=a.textComponents.title.h,a.textComponents.subtitle.exists&&(d+=a.options.header.titleSubtitlePadding)),a.textComponents.subtitle.exists&&(d+=a.textComponents.subtitle.h),a.textComponents.headerHeight=d}h.computePieRadius(a),h.calculatePieCenter(a),k.positionTitle(a),k.positionSubtitle(a),a.options.misc.gradient.enabled&&j.addGradients(a),j.create(a),i.add(a,"inner",a.options.labels.inner.format),i.add(a,"outer",a.options.labels.outer.format),i.positionLabelElements(a,"inner",a.options.labels.inner.format),i.positionLabelElements(a,"outer",a.options.labels.outer.format),i.computeOuterLabelCoords(a),i.positionLabelGroups(a,"outer"),i.computeLabelLinePositions(a),a.options.labels.lines.enabled&&"none"!==a.options.labels.outer.format&&i.addLabelLines(a),i.positionLabelGroups(a,"inner"),i.fadeInLabelsAndLines(a),a.options.tooltips.enabled&&l.addTooltips(a),j.addSegmentEventHandlers(a)})};return m});!function(){function n(){}function t(n){return n}function e(n){return!!n}function r(n){return!n}function u(n){return function(){if(null===n)throw new Error("Callback was already called.");n.apply(this,arguments),n=null}}function i(n){return function(){null!==n&&(n.apply(this,arguments),n=null)}}function o(n){return M(n)||"number"==typeof n.length&&n.length>=0&&n.length%1===0}function c(n,t){for(var e=-1,r=n.length;++e<r;)t(n[e],e,n)}function a(n,t){for(var e=-1,r=n.length,u=Array(r);++e<r;)u[e]=t(n[e],e,n);return u}function f(n){return a(Array(n),function(n,t){return t})}function l(n,t,e){return c(n,function(n,r,u){e=t(e,n,r,u)}),e}function s(n,t){c(W(n),function(e){t(n[e],e)})}function p(n,t){for(var e=0;e<n.length;e++)if(n[e]===t)return e;return-1}function h(n){var t,e,r=-1;return o(n)?(t=n.length,function(){return r++,t>r?r:null}):(e=W(n),t=e.length,function(){return r++,t>r?e[r]:null})}function m(n,t){return t=null==t?n.length-1:+t,function(){for(var e=Math.max(arguments.length-t,0),r=Array(e),u=0;e>u;u++)r[u]=arguments[u+t];switch(t){case 0:return n.call(this,r);case 1:return n.call(this,arguments[0],r)}}}function y(n){return function(t,e,r){return n(t,r)}}function v(t){return function(e,r,o){o=i(o||n),e=e||[];var c=h(e);if(0>=t)return o(null);var a=!1,f=0,l=!1;!function s(){if(a&&0>=f)return o(null);for(;t>f&&!l;){var n=c();if(null===n)return a=!0,void(0>=f&&o(null));f+=1,r(e[n],n,u(function(n){f-=1,n?(o(n),l=!0):s()}))}}()}}function d(n){return function(t,e,r){return n(C.eachOf,t,e,r)}}function g(n){return function(t,e,r,u){return n(v(e),t,r,u)}}function k(n){return function(t,e,r){return n(C.eachOfSeries,t,e,r)}}function b(t,e,r,u){u=i(u||n),e=e||[];var c=o(e)?[]:{};t(e,function(n,t,e){r(n,function(n,r){c[t]=r,e(n)})},function(n){u(n,c)})}function w(n,t,e,r){var u=[];n(t,function(n,t,r){e(n,function(e){e&&u.push({index:t,value:n}),r()})},function(){r(a(u.sort(function(n,t){return n.index-t.index}),function(n){return n.value}))})}function O(n,t,e,r){w(n,t,function(n,t){e(n,function(n){t(!n)})},r)}function S(n,t,e){return function(r,u,i,o){function c(){o&&o(e(!1,void 0))}function a(n,r,u){return o?void i(n,function(r){o&&t(r)&&(o(e(!0,n)),o=i=!1),u()}):u()}arguments.length>3?n(r,u,a,c):(o=i,i=u,n(r,a,c))}}function E(n,t){return t}function L(t,e,r){r=r||n;var u=o(e)?[]:{};t(e,function(n,t,e){n(m(function(n,r){r.length<=1&&(r=r[0]),u[t]=r,e(n)}))},function(n){r(n,u)})}function I(n,t,e,r){var u=[];n(t,function(n,t,r){e(n,function(n,t){u=u.concat(t||[]),r(n)})},function(n){r(n,u)})}function x(t,e,r){function i(t,e,r,u){if(null!=u&&"function"!=typeof u)throw new Error("task callback must be a function");return t.started=!0,M(e)||(e=[e]),0===e.length&&t.idle()?C.setImmediate(function(){t.drain()}):(c(e,function(e){var i={data:e,callback:u||n};r?t.tasks.unshift(i):t.tasks.push(i),t.tasks.length===t.concurrency&&t.saturated()}),void C.setImmediate(t.process))}function o(n,t){return function(){f-=1;var e=!1,r=arguments;c(t,function(n){c(l,function(t,r){t!==n||e||(l.splice(r,1),e=!0)}),n.callback.apply(n,r)}),n.tasks.length+f===0&&n.drain(),n.process()}}if(null==e)e=1;else if(0===e)throw new Error("Concurrency must not be zero");var f=0,l=[],s={tasks:[],concurrency:e,payload:r,saturated:n,empty:n,drain:n,started:!1,paused:!1,push:function(n,t){i(s,n,!1,t)},kill:function(){s.drain=n,s.tasks=[]},unshift:function(n,t){i(s,n,!0,t)},process:function(){if(!s.paused&&f<s.concurrency&&s.tasks.length)for(;f<s.concurrency&&s.tasks.length;){var n=s.payload?s.tasks.splice(0,s.payload):s.tasks.splice(0,s.tasks.length),e=a(n,function(n){return n.data});0===s.tasks.length&&s.empty(),f+=1,l.push(n[0]);var r=u(o(s,n));t(e,r)}},length:function(){return s.tasks.length},running:function(){return f},workersList:function(){return l},idle:function(){return s.tasks.length+f===0},pause:function(){s.paused=!0},resume:function(){if(s.paused!==!1){s.paused=!1;for(var n=Math.min(s.concurrency,s.tasks.length),t=1;n>=t;t++)C.setImmediate(s.process)}}};return s}function j(n){return m(function(t,e){t.apply(null,e.concat([m(function(t,e){"object"==typeof console&&(t?console.error&&console.error(t):console[n]&&c(e,function(t){console[n](t)}))})]))})}function A(n){return function(t,e,r){n(f(t),e,r)}}function T(n){return m(function(t,e){var r=m(function(e){var r=this,u=e.pop();return n(t,function(n,t,u){n.apply(r,e.concat([u]))},u)});return e.length?r.apply(this,e):r})}function z(n){return m(function(t){var e=t.pop();t.push(function(){var n=arguments;r?C.setImmediate(function(){e.apply(null,n)}):e.apply(null,n)});var r=!0;n.apply(this,t),r=!1})}var q,C={},P="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||this;null!=P&&(q=P.async),C.noConflict=function(){return P.async=q,C};var H=Object.prototype.toString,M=Array.isArray||function(n){return"[object Array]"===H.call(n)},U=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},W=Object.keys||function(n){var t=[];for(var e in n)n.hasOwnProperty(e)&&t.push(e);return t},B="function"==typeof setImmediate&&setImmediate,D=B?function(n){B(n)}:function(n){setTimeout(n,0)};"object"==typeof process&&"function"==typeof process.nextTick?C.nextTick=process.nextTick:C.nextTick=D,C.setImmediate=B?D:C.nextTick,C.forEach=C.each=function(n,t,e){return C.eachOf(n,y(t),e)},C.forEachSeries=C.eachSeries=function(n,t,e){return C.eachOfSeries(n,y(t),e)},C.forEachLimit=C.eachLimit=function(n,t,e,r){return v(t)(n,y(e),r)},C.forEachOf=C.eachOf=function(t,e,r){function o(n){f--,n?r(n):null===c&&0>=f&&r(null)}r=i(r||n),t=t||[];for(var c,a=h(t),f=0;null!=(c=a());)f+=1,e(t[c],c,u(o));0===f&&r(null)},C.forEachOfSeries=C.eachOfSeries=function(t,e,r){function o(){var n=!0;return null===a?r(null):(e(t[a],a,u(function(t){if(t)r(t);else{if(a=c(),null===a)return r(null);n?C.setImmediate(o):o()}})),void(n=!1))}r=i(r||n),t=t||[];var c=h(t),a=c();o()},C.forEachOfLimit=C.eachOfLimit=function(n,t,e,r){v(t)(n,e,r)},C.map=d(b),C.mapSeries=k(b),C.mapLimit=g(b),C.inject=C.foldl=C.reduce=function(n,t,e,r){C.eachOfSeries(n,function(n,r,u){e(t,n,function(n,e){t=e,u(n)})},function(n){r(n,t)})},C.foldr=C.reduceRight=function(n,e,r,u){var i=a(n,t).reverse();C.reduce(i,e,r,u)},C.transform=function(n,t,e,r){3===arguments.length&&(r=e,e=t,t=M(n)?[]:{}),C.eachOf(n,function(n,r,u){e(t,n,r,u)},function(n){r(n,t)})},C.select=C.filter=d(w),C.selectLimit=C.filterLimit=g(w),C.selectSeries=C.filterSeries=k(w),C.reject=d(O),C.rejectLimit=g(O),C.rejectSeries=k(O),C.any=C.some=S(C.eachOf,e,t),C.someLimit=S(C.eachOfLimit,e,t),C.all=C.every=S(C.eachOf,r,r),C.everyLimit=S(C.eachOfLimit,r,r),C.detect=S(C.eachOf,t,E),C.detectSeries=S(C.eachOfSeries,t,E),C.detectLimit=S(C.eachOfLimit,t,E),C.sortBy=function(n,t,e){function r(n,t){var e=n.criteria,r=t.criteria;return r>e?-1:e>r?1:0}C.map(n,function(n,e){t(n,function(t,r){t?e(t):e(null,{value:n,criteria:r})})},function(n,t){return n?e(n):void e(null,a(t.sort(r),function(n){return n.value}))})},C.auto=function(t,e,r){function u(n){d.unshift(n)}function o(n){var t=p(d,n);t>=0&&d.splice(t,1)}function a(){h--,c(d.slice(0),function(n){n()})}r||(r=e,e=null),r=i(r||n);var f=W(t),h=f.length;if(!h)return r(null);e||(e=h);var y={},v=0,d=[];u(function(){h||r(null,y)}),c(f,function(n){function i(){return e>v&&l(g,function(n,t){return n&&y.hasOwnProperty(t)},!0)&&!y.hasOwnProperty(n)}function c(){i()&&(v++,o(c),h[h.length-1](d,y))}for(var f,h=M(t[n])?t[n]:[t[n]],d=m(function(t,e){if(v--,e.length<=1&&(e=e[0]),t){var u={};s(y,function(n,t){u[t]=n}),u[n]=e,r(t,u)}else y[n]=e,C.setImmediate(a)}),g=h.slice(0,h.length-1),k=g.length;k--;){if(!(f=t[g[k]]))throw new Error("Has inexistant dependency");if(M(f)&&p(f,n)>=0)throw new Error("Has cyclic dependencies")}i()?(v++,h[h.length-1](d,y)):u(c)})},C.retry=function(n,t,e){function r(n,t){if("number"==typeof t)n.times=parseInt(t,10)||i;else{if("object"!=typeof t)throw new Error("Unsupported argument type for 'times': "+typeof t);n.times=parseInt(t.times,10)||i,n.interval=parseInt(t.interval,10)||o}}function u(n,t){function e(n,e){return function(r){n(function(n,t){r(!n||e,{err:n,result:t})},t)}}function r(n){return function(t){setTimeout(function(){t(null)},n)}}for(;a.times;){var u=!(a.times-=1);c.push(e(a.task,u)),!u&&a.interval>0&&c.push(r(a.interval))}C.series(c,function(t,e){e=e[e.length-1],(n||a.callback)(e.err,e.result)})}var i=5,o=0,c=[],a={times:i,interval:o},f=arguments.length;if(1>f||f>3)throw new Error("Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)");return 2>=f&&"function"==typeof n&&(e=t,t=n),"function"!=typeof n&&r(a,n),a.callback=e,a.task=t,a.callback?u():u},C.waterfall=function(t,e){function r(n){return m(function(t,u){if(t)e.apply(null,[t].concat(u));else{var i=n.next();i?u.push(r(i)):u.push(e),z(n).apply(null,u)}})}if(e=i(e||n),!M(t)){var u=new Error("First argument to waterfall must be an array of functions");return e(u)}return t.length?void r(C.iterator(t))():e()},C.parallel=function(n,t){L(C.eachOf,n,t)},C.parallelLimit=function(n,t,e){L(v(t),n,e)},C.series=function(n,t){L(C.eachOfSeries,n,t)},C.iterator=function(n){function t(e){function r(){return n.length&&n[e].apply(null,arguments),r.next()}return r.next=function(){return e<n.length-1?t(e+1):null},r}return t(0)},C.apply=m(function(n,t){return m(function(e){return n.apply(null,t.concat(e))})}),C.concat=d(I),C.concatSeries=k(I),C.whilst=function(t,e,r){if(r=r||n,t()){var u=m(function(n,i){n?r(n):t.apply(this,i)?e(u):r(null)});e(u)}else r(null)},C.doWhilst=function(n,t,e){var r=0;return C.whilst(function(){return++r<=1||t.apply(this,arguments)},n,e)},C.until=function(n,t,e){return C.whilst(function(){return!n.apply(this,arguments)},t,e)},C.doUntil=function(n,t,e){return C.doWhilst(n,function(){return!t.apply(this,arguments)},e)},C.during=function(t,e,r){r=r||n;var u=m(function(n,e){n?r(n):(e.push(i),t.apply(this,e))}),i=function(n,t){n?r(n):t?e(u):r(null)};t(i)},C.doDuring=function(n,t,e){var r=0;C.during(function(n){r++<1?n(null,!0):t.apply(this,arguments)},n,e)},C.queue=function(n,t){var e=x(function(t,e){n(t[0],e)},t,1);return e},C.priorityQueue=function(t,e){function r(n,t){return n.priority-t.priority}function u(n,t,e){for(var r=-1,u=n.length-1;u>r;){var i=r+(u-r+1>>>1);e(t,n[i])>=0?r=i:u=i-1}return r}function i(t,e,i,o){if(null!=o&&"function"!=typeof o)throw new Error("task callback must be a function");return t.started=!0,M(e)||(e=[e]),0===e.length?C.setImmediate(function(){t.drain()}):void c(e,function(e){var c={data:e,priority:i,callback:"function"==typeof o?o:n};t.tasks.splice(u(t.tasks,c,r)+1,0,c),t.tasks.length===t.concurrency&&t.saturated(),C.setImmediate(t.process)})}var o=C.queue(t,e);return o.push=function(n,t,e){i(o,n,t,e)},delete o.unshift,o},C.cargo=function(n,t){return x(n,1,t)},C.log=j("log"),C.dir=j("dir"),C.memoize=function(n,e){var r={},u={};e=e||t;var i=m(function(t){var i=t.pop(),o=e.apply(null,t);o in r?C.setImmediate(function(){i.apply(null,r[o])}):o in u?u[o].push(i):(u[o]=[i],n.apply(null,t.concat([m(function(n){r[o]=n;var t=u[o];delete u[o];for(var e=0,i=t.length;i>e;e++)t[e].apply(null,n)})])))});return i.memo=r,i.unmemoized=n,i},C.unmemoize=function(n){return function(){return(n.unmemoized||n).apply(null,arguments)}},C.times=A(C.map),C.timesSeries=A(C.mapSeries),C.timesLimit=function(n,t,e,r){return C.mapLimit(f(n),t,e,r)},C.seq=function(){var t=arguments;return m(function(e){var r=this,u=e[e.length-1];"function"==typeof u?e.pop():u=n,C.reduce(t,e,function(n,t,e){t.apply(r,n.concat([m(function(n,t){e(n,t)})]))},function(n,t){u.apply(r,[n].concat(t))})})},C.compose=function(){return C.seq.apply(null,Array.prototype.reverse.call(arguments))},C.applyEach=T(C.eachOf),C.applyEachSeries=T(C.eachOfSeries),C.forever=function(t,e){function r(n){return n?i(n):void o(r)}var i=u(e||n),o=z(t);r()},C.ensureAsync=z,C.constant=m(function(n){var t=[null].concat(n);return function(n){return n.apply(this,t)}}),C.wrapSync=C.asyncify=function(n){return m(function(t){var e,r=t.pop();try{e=n.apply(this,t)}catch(u){return r(u)}U(e)&&"function"==typeof e.then?e.then(function(n){r(null,n)})["catch"](function(n){r(n.message?n:new Error(n))}):r(null,e)})},"object"==typeof module&&module.exports?module.exports=C:"function"==typeof define&&define.amd?define([],function(){return C}):P.async=C}();
//# sourceMappingURL=dist/async.min.map
/* 
*
* @license
*
* Regression.JS - Regression functions for javascript
* http://tom-alexander.github.com/regression-js/
*
* copyright(c) 2013 Tom Alexander
* Licensed under the MIT license.
*
* 
*/

;(function() {
    'use strict';

    var gaussianElimination = function(a, o) {
           var i = 0, j = 0, k = 0, maxrow = 0, tmp = 0, n = a.length - 1, x = new Array(o);
           for (i = 0; i < n; i++) {
              maxrow = i;
              for (j = i + 1; j < n; j++) {
                 if (Math.abs(a[i][j]) > Math.abs(a[i][maxrow]))
                    maxrow = j;
              }
              for (k = i; k < n + 1; k++) {
                 tmp = a[k][i];
                 a[k][i] = a[k][maxrow];
                 a[k][maxrow] = tmp;
              }
              for (j = i + 1; j < n; j++) {
                 for (k = n; k >= i; k--) {
                    a[k][j] -= a[k][i] * a[i][j] / a[i][i];
                 }
              }
           }
           for (j = n - 1; j >= 0; j--) {
              tmp = 0;
              for (k = j + 1; k < n; k++)
                 tmp += a[k][j] * x[k];
              x[j] = (a[n][j] - tmp) / a[j][j];
           }
           return (x);
    };

        var methods = {
            linear: function(data) {
                var sum = [0, 0, 0, 0, 0], n = 0, results = [];

                for (; n < data.length; n++) {
                  if (data[n][1] != null) {
                    sum[0] += data[n][0];
                    sum[1] += data[n][1];
                    sum[2] += data[n][0] * data[n][0];
                    sum[3] += data[n][0] * data[n][1];
                    sum[4] += data[n][1] * data[n][1];
                  }
                }

                var gradient = (n * sum[3] - sum[0] * sum[1]) / (n * sum[2] - sum[0] * sum[0]);
                var intercept = (sum[1] / n) - (gradient * sum[0]) / n;
              //  var correlation = (n * sum[3] - sum[0] * sum[1]) / Math.sqrt((n * sum[2] - sum[0] * sum[0]) * (n * sum[4] - sum[1] * sum[1]));

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], data[i][0] * gradient + intercept];
                    results.push(coordinate);
                }

                var string = 'y = ' + Math.round(gradient*100) / 100 + 'x + ' + Math.round(intercept*100) / 100;

                return {equation: [gradient, intercept], points: results, string: string};
            },

            linearThroughOrigin: function(data) {
                var sum = [0, 0], n = 0, results = [];

                for (; n < data.length; n++) {
                    if (data[n][1] != null) {
                        sum[0] += data[n][0] * data[n][0]; //sumSqX
                        sum[1] += data[n][0] * data[n][1]; //sumXY
                    }
                }

                var gradient = sum[1] / sum[0];

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], data[i][0] * gradient];
                    results.push(coordinate);
                }

                var string = 'y = ' + Math.round(gradient*100) / 100 + 'x';

                return {equation: [gradient], points: results, string: string};
            },

            exponential: function(data) {
                var sum = [0, 0, 0, 0, 0, 0], n = 0, results = [];

                for (len = data.length; n < len; n++) {
                  if (data[n][1] != null) {
                    sum[0] += data[n][0];
                    sum[1] += data[n][1];
                    sum[2] += data[n][0] * data[n][0] * data[n][1];
                    sum[3] += data[n][1] * Math.log(data[n][1]);
                    sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
                    sum[5] += data[n][0] * data[n][1];
                  }
                }

                var denominator = (sum[1] * sum[2] - sum[5] * sum[5]);
                var A = Math.pow(Math.E, (sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
                var B = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], A * Math.pow(Math.E, B * data[i][0])];
                    results.push(coordinate);
                }

                var string = 'y = ' + Math.round(A*100) / 100 + 'e^(' + Math.round(B*100) / 100 + 'x)';

                return {equation: [A, B], points: results, string: string};
            },

            logarithmic: function(data) {
                var sum = [0, 0, 0, 0], n = 0, results = [];

                for (len = data.length; n < len; n++) {
                  if (data[n][1] != null) {
                    sum[0] += Math.log(data[n][0]);
                    sum[1] += data[n][1] * Math.log(data[n][0]);
                    sum[2] += data[n][1];
                    sum[3] += Math.pow(Math.log(data[n][0]), 2);
                  }
                }

                var B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0]);
                var A = (sum[2] - B * sum[0]) / n;

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], A + B * Math.log(data[i][0])];
                    results.push(coordinate);
                }

                var string = 'y = ' + Math.round(A*100) / 100 + ' + ' + Math.round(B*100) / 100 + ' ln(x)';

                return {equation: [A, B], points: results, string: string};
            },

            power: function(data) {
                var sum = [0, 0, 0, 0], n = 0, results = [];

                for (len = data.length; n < len; n++) {
                  if (data[n][1] != null) {
                    sum[0] += Math.log(data[n][0]);
                    sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
                    sum[2] += Math.log(data[n][1]);
                    sum[3] += Math.pow(Math.log(data[n][0]), 2);
                  }
                }

                var B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0]);
                var A = Math.pow(Math.E, (sum[2] - B * sum[0]) / n);

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], A * Math.pow(data[i][0] , B)];
                    results.push(coordinate);
                }

                 var string = 'y = ' + Math.round(A*100) / 100 + 'x^' + Math.round(B*100) / 100;

                return {equation: [A, B], points: results, string: string};
            },

            polynomial: function(data, order) {
                if(typeof order == 'undefined'){
                    order = 2;
                }
                 var lhs = [], rhs = [], results = [], a = 0, b = 0, i = 0, k = order + 1;

                        for (; i < k; i++) {
                           for (var l = 0, len = data.length; l < len; l++) {
                              if (data[l][1] != null) {
                               a += Math.pow(data[l][0], i) * data[l][1];
                              }
                            }
                            lhs.push(a), a = 0;
                            var c = [];
                            for (var j = 0; j < k; j++) {
                               for (var l = 0, len = data.length; l < len; l++) {
                                  if (data[l][1] != null) {
                                   b += Math.pow(data[l][0], i + j);
                                  }
                                }
                                c.push(b), b = 0;
                            }
                            rhs.push(c);
                        }
                rhs.push(lhs);

               var equation = gaussianElimination(rhs, k);

                    for (var i = 0, len = data.length; i < len; i++) {
                        var answer = 0;
                        for (var w = 0; w < equation.length; w++) {
                            answer += equation[w] * Math.pow(data[i][0], w);
                        }
                        results.push([data[i][0], answer]);
                    }

                    var string = 'y = ';

                    for(var i = equation.length-1; i >= 0; i--){
                      if(i > 1) string += Math.round(equation[i] * Math.pow(10, i)) / Math.pow(10, i)  + 'x^' + i + ' + ';
                      else if (i == 1) string += Math.round(equation[i]*100) / 100 + 'x' + ' + ';
                      else string += Math.round(equation[i]*100) / 100;
                    }

                return {equation: equation, points: results, string: string};
            },

            lastvalue: function(data) {
              var results = [];
              var lastvalue = null;
              for (var i = 0; i < data.length; i++) {
                if (data[i][1]) {
                  lastvalue = data[i][1];
                  results.push([data[i][0], data[i][1]]);
                }
                else {
                  results.push([data[i][0], lastvalue]);
                }
              }

              return {equation: [lastvalue], points: results, string: "" + lastvalue};
            }
        };

var regression = (function(method, data, order) {

       if (typeof method == 'string') {
           return methods[method](data, order);
       }
    });

if (typeof exports !== 'undefined') {
    module.exports = regression;
} else {
    window.regression = regression;
}

}());
var sd_tesaurus = [{"ESPECIE":"Adoxa moschatellina","CATEGORIA":"EICP1","CFAC":"0"},
{"ESPECIE":"Aira praecox","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Allium pyrenaicum","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Arenaria fontqueri ssp. cavanillesiana","CATEGORIA":"EICP2","CFAC":"V"},
{"ESPECIE":"Arisarum simorrhinum","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Asplenium (Phyllitis) sagittatum","CATEGORIA":"EICP1","CFAC":"E"},
{"ESPECIE":"Botrychium matricariifolium","CATEGORIA":"EICP1","CFAC":"E"},
{"ESPECIE":"Cheilanthes tinaei","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Cicendia filiformis","CATEGORIA":"EICP2","CFAC":"V"},
{"ESPECIE":"Convolvulus siculus","CATEGORIA":"EICP2","CFAC":"V"},
{"ESPECIE":"Cosentinia vellea","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Cypripedium calceolus","CATEGORIA":"EICP2","CFAC":"E"},
{"ESPECIE":"Dactylorhiza insularis","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Delphinium bolosii","CATEGORIA":"EICP1","CFAC":"E"},
{"ESPECIE":"Epipogium aphyllum","CATEGORIA":"EICP1","CFAC":"E"},
{"ESPECIE":"Erica cinerea","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Galium scabrum","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Geranium lanuginosum","CATEGORIA":"EICP1","CFAC":"V"},
{"ESPECIE":"Halimium halimifolium","CATEGORIA":"EICP2","CFAC":"V"},
{"ESPECIE":"Hippuris vulgaris","CATEGORIA":"EICP1","CFAC":"E"},
{"ESPECIE":"Hypericum pulchrum","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Isoetes durieui","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Lavatera olbia","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Limonium girardianum","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Lotus parviflorus","CATEGORIA":"EICP2","CFAC":"V"},
{"ESPECIE":"Melampyrum catalaunicum","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Myricaria germanica","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Potamogeton lucens","CATEGORIA":"EICP1","CFAC":"V"},
{"ESPECIE":"Potamogeton natans","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Potentilla montana","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Prunus lusitanica","CATEGORIA":"EICP2","CFAC":"V"},
{"ESPECIE":"Salvia sylvestris ssp. valentina","CATEGORIA":"EICP2","CFAC":"V"},
{"ESPECIE":"Saxifraga callosa ssp. catalaunica","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Saxifraga genesiana","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Saxifraga vayredana","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Silene mutabilis","CATEGORIA":"EICP1","CFAC":"0"},
{"ESPECIE":"Silene viridiflora","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Spiraea crenata ssp. parvifolia","CATEGORIA":"EICP1","CFAC":"E"},
{"ESPECIE":"Spiranthes aestivalis","CATEGORIA":"EIC","CFAC":"V"},
{"ESPECIE":"Succowia balearica","CATEGORIA":"EICP2","CFAC":"V"},
{"ESPECIE":"Trifolium diffusum","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Trifolium micranthum","CATEGORIA":"EIC","CFAC":"0"},
{"ESPECIE":"Viola bubanii","CATEGORIA":"EIC","CFAC":"0"}]
var sd_tendenciapobl = [{"IDMOSTREIG":"GRF_Arisim_1_2016-10-20","RODAL":1,"N":416},
{"IDMOSTREIG":"GRF_Halhal_1_2015-05-28","RODAL":1,"N":13},
{"IDMOSTREIG":"GRF_Halhal_1_2015-05-28","RODAL":2,"N":17},
{"IDMOSTREIG":"GRF_Sucbal_1_2015-04-21","RODAL":1,"N":39},
{"IDMOSTREIG":"GRF_Sucbal_1_2015-04-21","RODAL":2,"N":39},
{"IDMOSTREIG":"GRF_Sucbal_1_2016-04-18","RODAL":2,"N":140},
{"IDMOSTREIG":"GRF_Sucbal_2_2015-04-27","RODAL":1,"N":172},
{"IDMOSTREIG":"GRF_Sucbal_2_2016-04-26","RODAL":1,"N":323},
{"IDMOSTREIG":"GUI_Cardep_1_2013-07-03","RODAL":1,"N":46},
{"IDMOSTREIG":"GUI_Cardep_1_2014-05-25","RODAL":1,"N":85},
{"IDMOSTREIG":"GUI_Carpra_1_2014-06-11","RODAL":1,"N":62},
{"IDMOSTREIG":"GUI_Carpra_1_2014-06-11","RODAL":2,"N":310},
{"IDMOSTREIG":"GUI_Carpra_1_2014-06-11","RODAL":3,"N":344},
{"IDMOSTREIG":"GUI_Dicalb_1_2013-07-03","RODAL":1,"N":69},
{"IDMOSTREIG":"GUI_Dicalb_1_2014-08-25","RODAL":1,"N":75},
{"IDMOSTREIG":"GUI_Eupdul_1_2013-07-03","RODAL":1,"N":33},
{"IDMOSTREIG":"GUI_Eupdul_1_2013-07-03","RODAL":2,"N":58},
{"IDMOSTREIG":"GUI_Eupdul_1_2013-07-03","RODAL":3,"N":300},
{"IDMOSTREIG":"GUI_Eupdul_1_2014-05-28","RODAL":1,"N":37},
{"IDMOSTREIG":"GUI_Eupdul_1_2014-05-28","RODAL":2,"N":69},
{"IDMOSTREIG":"GUI_Eupdul_1_2014-05-28","RODAL":3,"N":37},
{"IDMOSTREIG":"GUI_Peuoff_1_2013-07-03","RODAL":1,"N":34},
{"IDMOSTREIG":"GUI_Peuoff_1_2014-05-28","RODAL":1,"N":35},
{"IDMOSTREIG":"MCO_Cosvel_1_2013-12-09","RODAL":1,"N":40},
{"IDMOSTREIG":"MCO_Cosvel_1_2013-12-09","RODAL":2,"N":22},
{"IDMOSTREIG":"MCO_Cosvel_1_2013-12-09","RODAL":3,"N":64},
{"IDMOSTREIG":"MCO_Cosvel_1_2013-12-09","RODAL":4,"N":25},
{"IDMOSTREIG":"MCO_Cosvel_1_2013-12-09","RODAL":5,"N":50},
{"IDMOSTREIG":"MCO_Cosvel_1_2013-12-09","RODAL":6,"N":11},
{"IDMOSTREIG":"MCO_Cosvel_2_2013-12-09","RODAL":1,"N":50},
{"IDMOSTREIG":"MCO_Galsca_1_2002-06-20","RODAL":1,"N":796},
{"IDMOSTREIG":"MCO_Galsca_1_2010-11-10","RODAL":1,"N":718},
{"IDMOSTREIG":"MCO_Galsca_1_2013-09-20","RODAL":1,"N":1129},
{"IDMOSTREIG":"MCO_Galsca_2_2014-09-19","RODAL":1,"N":68},
{"IDMOSTREIG":"MCO_Galsca_2_2014-09-19","RODAL":2,"N":41},
{"IDMOSTREIG":"MCO_Galsca_3_2013-08-22","RODAL":1,"N":106},
{"IDMOSTREIG":"MCO_Halhal_1_2009-06-01","RODAL":1,"N":45},
{"IDMOSTREIG":"MCO_Halhal_1_2009-06-01","RODAL":2,"N":16},
{"IDMOSTREIG":"MCO_Halhal_1_2009-06-01","RODAL":3,"N":6},
{"IDMOSTREIG":"MCO_Halhal_1_2009-06-01","RODAL":4,"N":3},
{"IDMOSTREIG":"MCO_Halhal_1_2010-06-01","RODAL":1,"N":33},
{"IDMOSTREIG":"MCO_Halhal_1_2010-06-01","RODAL":2,"N":12},
{"IDMOSTREIG":"MCO_Halhal_1_2010-06-01","RODAL":3,"N":20},
{"IDMOSTREIG":"MCO_Halhal_1_2010-06-01","RODAL":4,"N":5},
{"IDMOSTREIG":"MCO_Halhal_1_2011-06-07","RODAL":1,"N":28},
{"IDMOSTREIG":"MCO_Halhal_1_2011-06-07","RODAL":2,"N":22},
{"IDMOSTREIG":"MCO_Halhal_1_2011-06-07","RODAL":3,"N":15},
{"IDMOSTREIG":"MCO_Halhal_1_2011-06-07","RODAL":4,"N":4},
{"IDMOSTREIG":"MCO_Halhal_1_2012-06-22","RODAL":1,"N":37},
{"IDMOSTREIG":"MCO_Halhal_1_2012-06-22","RODAL":2,"N":28},
{"IDMOSTREIG":"MCO_Halhal_1_2012-06-22","RODAL":3,"N":22},
{"IDMOSTREIG":"MCO_Halhal_1_2012-06-22","RODAL":4,"N":2},
{"IDMOSTREIG":"MCO_Halhal_1_2014-06-04","RODAL":1,"N":28},
{"IDMOSTREIG":"MCO_Halhal_1_2014-06-04","RODAL":2,"N":18},
{"IDMOSTREIG":"MCO_Halhal_1_2014-06-04","RODAL":3,"N":20},
{"IDMOSTREIG":"MCO_Halhal_1_2014-06-04","RODAL":4,"N":4},
{"IDMOSTREIG":"MCO_Halhal_2_2009-06-01","RODAL":1,"N":2},
{"IDMOSTREIG":"MCO_Halhal_2_2010-06-01","RODAL":1,"N":2},
{"IDMOSTREIG":"MCO_Halhal_2_2010-06-01","RODAL":2,"N":2},
{"IDMOSTREIG":"MCO_Halhal_2_2010-06-01","RODAL":3,"N":7},
{"IDMOSTREIG":"MCO_Halhal_2_2011-06-07","RODAL":1,"N":2},
{"IDMOSTREIG":"MCO_Halhal_2_2011-06-07","RODAL":2,"N":2},
{"IDMOSTREIG":"MCO_Halhal_2_2011-06-07","RODAL":3,"N":6},
{"IDMOSTREIG":"MCO_Halhal_2_2012-06-22","RODAL":1,"N":2},
{"IDMOSTREIG":"MCO_Halhal_2_2012-06-22","RODAL":2,"N":1},
{"IDMOSTREIG":"MCO_Halhal_2_2012-06-22","RODAL":3,"N":4},
{"IDMOSTREIG":"MCO_Halhal_2_2014-06-04","RODAL":1,"N":6},
{"IDMOSTREIG":"MCO_Halhal_2_2014-06-04","RODAL":2,"N":5},
{"IDMOSTREIG":"MCO_Halhal_2_2014-06-04","RODAL":3,"N":5},
{"IDMOSTREIG":"MCO_Halhal_3_2010-06-01","RODAL":1,"N":1},
{"IDMOSTREIG":"MCO_Halhal_3_2012-06-22","RODAL":1,"N":1},
{"IDMOSTREIG":"MCO_Halhal_3_2014-06-04","RODAL":1,"N":3},
{"IDMOSTREIG":"MCO_Halhal_4_2009-03-01","RODAL":1,"N":10},
{"IDMOSTREIG":"MCO_Halhal_4_2009-03-01","RODAL":2,"N":28},
{"IDMOSTREIG":"MCO_Halhal_4_2009-03-01","RODAL":3,"N":23},
{"IDMOSTREIG":"MCO_Halhal_4_2009-03-01","RODAL":4,"N":2},
{"IDMOSTREIG":"MCO_Halhal_4_2009-03-01","RODAL":5,"N":1},
{"IDMOSTREIG":"MCO_Halhal_4_2012-06-22","RODAL":1,"N":8},
{"IDMOSTREIG":"MCO_Halhal_4_2012-06-22","RODAL":2,"N":49},
{"IDMOSTREIG":"MCO_Halhal_4_2012-06-22","RODAL":3,"N":13},
{"IDMOSTREIG":"MCO_Halhal_4_2012-06-22","RODAL":6,"N":1},
{"IDMOSTREIG":"MCO_Halhal_4_2014-06-04","RODAL":1,"N":7},
{"IDMOSTREIG":"MCO_Halhal_4_2014-06-04","RODAL":2,"N":25},
{"IDMOSTREIG":"MCO_Halhal_4_2014-06-04","RODAL":3,"N":19},
{"IDMOSTREIG":"MCO_Hyppul_1_2015-06-26","RODAL":1,"N":34},
{"IDMOSTREIG":"MCO_Hyppul_2_2014-06-20","RODAL":1,"N":11},
{"IDMOSTREIG":"MCO_Hyppul_2_2014-06-20","RODAL":2,"N":8},
{"IDMOSTREIG":"MCO_Hyppul_2_2014-06-20","RODAL":3,"N":51},
{"IDMOSTREIG":"MCO_Hyppul_3_2014-06-20","RODAL":1,"N":359},
{"IDMOSTREIG":"MCO_Hyppul_4_2015-06-26","RODAL":1,"N":5},
{"IDMOSTREIG":"MCO_Hyppul_4_2015-06-26","RODAL":2,"N":6},
{"IDMOSTREIG":"MCO_Isodur_1_2014-05-07","RODAL":1,"N":3},
{"IDMOSTREIG":"MCO_Spiaes_1_2014-07-10","RODAL":1,"N":1},
{"IDMOSTREIG":"MSY_Botmat_1_2012-06-18","RODAL":1,"N":13},
{"IDMOSTREIG":"MSY_Botmat_1_2013-06-28","RODAL":1,"N":27},
{"IDMOSTREIG":"MSY_Botmat_2_2013-06-28","RODAL":1,"N":15},
{"IDMOSTREIG":"MSY_Botmat_2_2014-07-08","RODAL":1,"N":7},
{"IDMOSTREIG":"MSY_Caramp_1_2013-06-26","RODAL":1,"N":379},
{"IDMOSTREIG":"MSY_Caramp_1_2015-05-06","RODAL":1,"N":401},
{"IDMOSTREIG":"MSY_Galsca_1_2014-06-03","RODAL":1,"N":67},
{"IDMOSTREIG":"MSY_Hyppul_1_2013-06-18","RODAL":1,"N":51},
{"IDMOSTREIG":"MSY_Hyppul_1_2013-06-18","RODAL":2,"N":32},
{"IDMOSTREIG":"MSY_Hyppul_1_2013-06-18","RODAL":3,"N":11},
{"IDMOSTREIG":"MSY_Melcat_1_2014-08-31","RODAL":1,"N":23},
{"IDMOSTREIG":"MSY_Pinvul_3_2014-06-13","RODAL":2,"N":7},
{"IDMOSTREIG":"MSY_Polbis_1_2014-06-13","RODAL":1,"N":131},
{"IDMOSTREIG":"MSY_Potmon_1_2014-06-25","RODAL":1,"N":952},
{"IDMOSTREIG":"MSY_Potmon_1_2014-06-25","RODAL":2,"N":1312},
{"IDMOSTREIG":"MSY_Potmon_1_2014-06-25","RODAL":3,"N":117},
{"IDMOSTREIG":"MSY_Potmon_1_2014-06-25","RODAL":4,"N":825},
{"IDMOSTREIG":"MSY_Potpyr_1_2014-06-17","RODAL":1,"N":220},
{"IDMOSTREIG":"MSY_Potpyr_1_2014-06-17","RODAL":2,"N":374},
{"IDMOSTREIG":"MSY_Potpyr_1_2014-06-17","RODAL":3,"N":586},
{"IDMOSTREIG":"MSY_Saxpan_3_2014-12-18","RODAL":1,"N":17},
{"IDMOSTREIG":"MSY_Saxpan_3_2014-12-18","RODAL":2,"N":22},
{"IDMOSTREIG":"MSY_Saxpan_3_2014-12-18","RODAL":3,"N":34},
{"IDMOSTREIG":"SLI_Isodur_1_2010-01-10","RODAL":1,"N":65},
{"IDMOSTREIG":"SLI_Isodur_1_2010-01-10","RODAL":2,"N":656},
{"IDMOSTREIG":"SLI_Isodur_1_2010-01-10","RODAL":3,"N":608},
{"IDMOSTREIG":"SLI_Isodur_1_2010-01-10","RODAL":4,"N":625},
{"IDMOSTREIG":"SLI_Viocat_2_2015-03-26","RODAL":1,"N":52},
{"IDMOSTREIG":"SLI_Viocat_2_2015-03-26","RODAL":2,"N":295},
{"IDMOSTREIG":"SLI_Viocat_2_2016-04-06","RODAL":1,"N":54},
{"IDMOSTREIG":"SLI_Viocat_2_2016-04-06","RODAL":2,"N":200},
{"IDMOSTREIG":"SLL_Arecav_1_2015-05-19","RODAL":1,"N":46},
{"IDMOSTREIG":"SLL_Arecav_1_2015-05-19","RODAL":2,"N":5},
{"IDMOSTREIG":"SLL_Arecav_1_2015-05-19","RODAL":3,"N":95},
{"IDMOSTREIG":"SLL_Arecav_2_2015-05-20","RODAL":1,"N":32},
{"IDMOSTREIG":"SLL_Arecav_2_2015-05-20","RODAL":2,"N":14},
{"IDMOSTREIG":"SLL_Arecav_2_2015-05-20","RODAL":3,"N":6},
{"IDMOSTREIG":"SLL_Delbol_1_2014-06-04","RODAL":1,"N":1},
{"IDMOSTREIG":"SLL_Delbol_1_2014-06-04","RODAL":2,"N":2},
{"IDMOSTREIG":"SLL_Delbol_1_2014-06-04","RODAL":3,"N":10},
{"IDMOSTREIG":"SLL_Delbol_1_2014-06-04","RODAL":4,"N":15},
{"IDMOSTREIG":"SLL_Delbol_1_2014-06-04","RODAL":5,"N":12},
{"IDMOSTREIG":"SLL_Delbol_1_2014-06-04","RODAL":6,"N":2},
{"IDMOSTREIG":"SLL_Delbol_1_2015-05-15","RODAL":1,"N":12},
{"IDMOSTREIG":"SLL_Delbol_1_2015-05-15","RODAL":3,"N":28},
{"IDMOSTREIG":"SLL_Delbol_1_2015-05-15","RODAL":6,"N":1},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":1,"N":12},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":2,"N":17},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":3,"N":74},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":4,"N":138},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":5,"N":22},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":6,"N":30},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":7,"N":4},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":8,"N":219},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":9,"N":56},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":10,"N":26},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","RODAL":11,"N":4},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":1,"N":19},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":2,"N":12},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":3,"N":171},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":4,"N":321},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":5,"N":22},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":6,"N":41},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":7,"N":1},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":9,"N":78},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":10,"N":132},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","RODAL":11,"N":7},
{"IDMOSTREIG":"SLL_Saxcat_1_2015-06-08","RODAL":1,"N":12},
{"IDMOSTREIG":"SLL_Saxcat_2_2015-06-17","RODAL":1,"N":274},
{"IDMOSTREIG":"SLL_Silvir_1_2015-07-15","RODAL":1,"N":65},
{"IDMOSTREIG":"SMA_Arisim_1_2010-11-08","RODAL":1,"N":265},
{"IDMOSTREIG":"SMA_Arisim_1_2010-11-08","RODAL":2,"N":155},
{"IDMOSTREIG":"SMA_Arisim_1_2013-11-08","RODAL":1,"N":215},
{"IDMOSTREIG":"SMA_Arisim_1_2013-11-08","RODAL":2,"N":153},
{"IDMOSTREIG":"SMA_Chetin_1_2014-05-06","RODAL":1,"N":1},
{"IDMOSTREIG":"SMA_Lavolb_4_2014-06-09","RODAL":1,"N":141},
{"IDMOSTREIG":"SMA_Lavolb_4_2014-06-09","RODAL":2,"N":20},
{"IDMOSTREIG":"SMA_Nardub_1_2011-03-18","RODAL":1,"N":53},
{"IDMOSTREIG":"SMA_Nardub_1_2013-03-18","RODAL":1,"N":51},
{"IDMOSTREIG":"SMA_Nardub_1_2013-03-18","RODAL":2,"N":25},
{"IDMOSTREIG":"SMA_Nardub_1_2013-03-18","RODAL":3,"N":5},
{"IDMOSTREIG":"SMA_Nardub_1_2014-03-13","RODAL":1,"N":49},
{"IDMOSTREIG":"SMA_Nardub_1_2014-03-13","RODAL":2,"N":23},
{"IDMOSTREIG":"SMA_Nardub_1_2014-03-13","RODAL":3,"N":13},
{"IDMOSTREIG":"SMA_Viocat_2_2014-03-06","RODAL":1,"N":20},
{"IDMOSTREIG":"SMA_Viocat_2_2014-03-06","RODAL":2,"N":27},
{"IDMOSTREIG":"SMA_Viocat_2_2014-03-06","RODAL":3,"N":28},
{"IDMOSTREIG":"SMA_Viocat_3_2014-03-06","RODAL":1,"N":10},
{"IDMOSTREIG":"SMA_Vitagn_1_2014-09-12","RODAL":1,"N":276},
{"IDMOSTREIG":"SMA_Vitagn_2_2014-09-12","RODAL":1,"N":27},
{"IDMOSTREIG":"SMA_Vitagn_3_2014-10-08","RODAL":1,"N":117},
{"IDMOSTREIG":"SMA_Vitagn_4_2014-10-16","RODAL":1,"N":55},
{"IDMOSTREIG":"SMA_Vitagn_4_2014-10-16","RODAL":2,"N":46},
{"IDMOSTREIG":"SMA_Vitagn_4_2014-10-16","RODAL":3,"N":37},
{"IDMOSTREIG":"SMA_Vitagn_5_2014-11-18","RODAL":1,"N":3},
{"IDMOSTREIG":"SMA_Vitagn_5_2014-11-18","RODAL":2,"N":26},
{"IDMOSTREIG":"SMA_Vitagn_5_2014-11-18","RODAL":3,"N":8},
{"IDMOSTREIG":"SMA_Vitagn_5_2014-11-18","RODAL":4,"N":4}]
var sd_localitatscensadesany = [{"IDMOSTREIG":"MCO_Galsca_1_2002-06-20","DATE":"20/06/2002"},
{"IDMOSTREIG":"MCO_Halhal_4_2009-03-01","DATE":"01/03/2009"},
{"IDMOSTREIG":"MCO_Halhal_1_2009-06-01","DATE":"01/06/2009"},
{"IDMOSTREIG":"MCO_Halhal_2_2009-06-01","DATE":"01/06/2009"},
{"IDMOSTREIG":"MCO_Halhal_1_2010-06-01","DATE":"01/06/2010"},
{"IDMOSTREIG":"MCO_Halhal_2_2010-06-01","DATE":"01/06/2010"},
{"IDMOSTREIG":"MCO_Halhal_3_2010-06-01","DATE":"01/06/2010"},
{"IDMOSTREIG":"SLI_Isodur_1_2010-01-10","DATE":"01/10/2010"},
{"IDMOSTREIG":"SMA_Arisim_1_2010-11-08","DATE":"08/11/2010"},
{"IDMOSTREIG":"MCO_Galsca_1_2010-11-10","DATE":"10/11/2010"},
{"IDMOSTREIG":"SMA_Nardub_1_2011-03-18","DATE":"18/03/2011"},
{"IDMOSTREIG":"MCO_Halhal_1_2011-06-07","DATE":"07/06/2011"},
{"IDMOSTREIG":"MCO_Halhal_2_2011-06-07","DATE":"07/06/2011"},
{"IDMOSTREIG":"MCO_Halhal_3_2011-06-07","DATE":"07/06/2011"},
{"IDMOSTREIG":"MSY_Caramp_1_2012-05-21","DATE":"21/05/2012"},
{"IDMOSTREIG":"MSY_Galsca_1_2012-05-21","DATE":"21/05/2012"},
{"IDMOSTREIG":"MSY_Hyppul_1_2012-05-21","DATE":"21/05/2012"},
{"IDMOSTREIG":"MSY_Potmon_1_2012-05-21","DATE":"21/05/2012"},
{"IDMOSTREIG":"MSY_Prulus_1_2012-05-21","DATE":"21/05/2012"},
{"IDMOSTREIG":"MSY_Viobub_1_2012-05-21","DATE":"21/05/2012"},
{"IDMOSTREIG":"SLI_Cargri_1_2012-05-25","DATE":"25/05/2012"},
{"IDMOSTREIG":"SLI_Lavolb_1_2012-05-25","DATE":"25/05/2012"},
{"IDMOSTREIG":"SLI_Viocat_1_2012-05-25","DATE":"25/05/2012"},
{"IDMOSTREIG":"MSY_Botmat_1_2012-06-18","DATE":"18/06/2012"},
{"IDMOSTREIG":"MSY_Melcat_1_2012-06-18","DATE":"18/06/2012"},
{"IDMOSTREIG":"MSY_Saxgen_1_2012-06-18","DATE":"18/06/2012"},
{"IDMOSTREIG":"MSY_Saxvay_1_2012-06-18","DATE":"18/06/2012"},
{"IDMOSTREIG":"MCO_Halhal_1_2012-06-22","DATE":"22/06/2012"},
{"IDMOSTREIG":"MCO_Halhal_2_2012-06-22","DATE":"22/06/2012"},
{"IDMOSTREIG":"MCO_Halhal_3_2012-06-22","DATE":"22/06/2012"},
{"IDMOSTREIG":"MCO_Halhal_4_2012-06-22","DATE":"22/06/2012"},
{"IDMOSTREIG":"MSY_Potmon_1_2013-06-03","DATE":"06/03/2013"},
{"IDMOSTREIG":"SMA_Nardub_1_2013-03-18","DATE":"18/03/2013"},
{"IDMOSTREIG":"MSY_Melcat_1_2013-08-04","DATE":"08/04/2013"},
{"IDMOSTREIG":"MSY_Gymdry_1_2013-09-04","DATE":"09/04/2013"},
{"IDMOSTREIG":"MSY_Coevir_1_2014-06-13","DATE":"13/06/2013"},
{"IDMOSTREIG":"MSY_Galsca_1_2013-06-13","DATE":"13/06/2013"},
{"IDMOSTREIG":"MSY_Saxgen_2_2013-06-16","DATE":"16/06/2013"},
{"IDMOSTREIG":"MSY_Saxvay_3_2013-06-16","DATE":"16/06/2013"},
{"IDMOSTREIG":"MSY_Hyppul_1_2013-06-18","DATE":"18/06/2013"},
{"IDMOSTREIG":"MSY_Saxgen_1_2013-06-19","DATE":"19/06/2013"},
{"IDMOSTREIG":"MSY_Saxvay_2_2013-06-19","DATE":"19/06/2013"},
{"IDMOSTREIG":"MSY_Coevir_1_2013-06-20","DATE":"20/06/2013"},
{"IDMOSTREIG":"MSY_Polbis_1_2013-06-20","DATE":"20/06/2013"},
{"IDMOSTREIG":"MSY_Prulus_1_2013-06-25","DATE":"25/06/2013"},
{"IDMOSTREIG":"MSY_Caramp_1_2013-06-26","DATE":"26/06/2013"},
{"IDMOSTREIG":"MSY_Pinvul_1_2013-06-27","DATE":"27/06/2013"},
{"IDMOSTREIG":"MSY_Botmat_1_2013-06-28","DATE":"28/06/2013"},
{"IDMOSTREIG":"MSY_Botmat_2_2013-06-28","DATE":"28/06/2013"},
{"IDMOSTREIG":"MSY_Potpyr_1_2013-06-28","DATE":"28/06/2013"},
{"IDMOSTREIG":"GUI_Cardep_1_2013-07-03","DATE":"03/07/2013"},
{"IDMOSTREIG":"GUI_Dicalb_1_2013-07-03","DATE":"03/07/2013"},
{"IDMOSTREIG":"GUI_Eupdul_1_2013-07-03","DATE":"03/07/2013"},
{"IDMOSTREIG":"GUI_Peuoff_1_2013-07-03","DATE":"03/07/2013"},
{"IDMOSTREIG":"MCO_Galsca_3_2013-08-22","DATE":"22/08/2013"},
{"IDMOSTREIG":"MSY_Lonnig_3_2013-09-13","DATE":"13/09/2013"},
{"IDMOSTREIG":"MCO_Galsca_1_2013-09-20","DATE":"20/09/2013"},
{"IDMOSTREIG":"MCO_Cargri_1_2013-10-03","DATE":"03/10/2013"},
{"IDMOSTREIG":"MCO_Cargri_2_2013-10-03","DATE":"03/10/2013"},
{"IDMOSTREIG":"MSY_Lonnig_1_2013-09-10","DATE":"09/10/2013"},
{"IDMOSTREIG":"MSY_Lonnig_2_2013-09-10","DATE":"09/10/2013"},
{"IDMOSTREIG":"MSY_Samrac_3_2013-10-10","DATE":"10/10/2013"},
{"IDMOSTREIG":"MSY_Samrac_2_2013-10-14","DATE":"14/10/2013"},
{"IDMOSTREIG":"MSY_Taxbac_1_2013-10-15","DATE":"15/10/2013"},
{"IDMOSTREIG":"SMA_Arisim_1_2013-11-08","DATE":"08/11/2013"},
{"IDMOSTREIG":"MCO_Arisim_1_2013-12-09","DATE":"09/12/2013"},
{"IDMOSTREIG":"MCO_Arisim_2_2013-12-09","DATE":"09/12/2013"},
{"IDMOSTREIG":"MCO_Cosvel_1_2013-12-09","DATE":"09/12/2013"},
{"IDMOSTREIG":"MCO_Cosvel_2_2013-12-09","DATE":"09/12/2013"},
{"IDMOSTREIG":"MSY_Galsca_1_2014-06-03","DATE":"06/03/2014"},
{"IDMOSTREIG":"SMA_Viocat_1_2014-03-06","DATE":"06/03/2014"},
{"IDMOSTREIG":"SMA_Viocat_2_2014-03-06","DATE":"06/03/2014"},
{"IDMOSTREIG":"SMA_Viocat_3_2014-03-06","DATE":"06/03/2014"},
{"IDMOSTREIG":"SMA_Nardub_1_2014-03-13","DATE":"13/03/2014"},
{"IDMOSTREIG":"SMA_Selden_1_2014-03-27","DATE":"27/03/2014"},
{"IDMOSTREIG":"MCO_Halhal_3_2014-06-04","DATE":"06/04/2014"},
{"IDMOSTREIG":"SLL_Delbol_1_2014-06-04","DATE":"06/04/2014"},
{"IDMOSTREIG":"MCO_Cicfil_1_2014-04-29","DATE":"29/04/2014"},
{"IDMOSTREIG":"SMA_Chetin_1_2014-05-06","DATE":"06/05/2014"},
{"IDMOSTREIG":"MCO_Isodur_1_2014-05-07","DATE":"07/05/2014"},
{"IDMOSTREIG":"SLL_Delbol_2_2014-05-21","DATE":"21/05/2014"},
{"IDMOSTREIG":"SLI_Cargri_1_2014-05-23","DATE":"23/05/2014"},
{"IDMOSTREIG":"SLI_Cargri_18_2014-05-23","DATE":"23/05/2014"},
{"IDMOSTREIG":"GUI_Cardep_1_2014-05-25","DATE":"25/05/2014"},
{"IDMOSTREIG":"GUI_Eupdul_1_2014-05-28","DATE":"28/05/2014"},
{"IDMOSTREIG":"GUI_Peuoff_1_2014-05-28","DATE":"28/05/2014"},
{"IDMOSTREIG":"MSY_Samrac_2_2014-05-28","DATE":"28/05/2014"},
{"IDMOSTREIG":"MSY_Samrac_3_2014-05-28","DATE":"28/05/2014"},
{"IDMOSTREIG":"MCO_Halhal_1_2014-06-04","DATE":"04/06/2014"},
{"IDMOSTREIG":"MCO_Halhal_2_2014-06-04","DATE":"04/06/2014"},
{"IDMOSTREIG":"MCO_Halhal_4_2014-06-04","DATE":"04/06/2014"},
{"IDMOSTREIG":"MSY_Samrac_1_2014-06-06","DATE":"06/06/2014"},
{"IDMOSTREIG":"GUI_Carpra_1_2014-06-11","DATE":"11/06/2014"},
{"IDMOSTREIG":"MCO_Lavolb_2_2014-06-12","DATE":"12/06/2014"},
{"IDMOSTREIG":"MCO_Lavolb_3_2014-06-12","DATE":"12/06/2014"},
{"IDMOSTREIG":"MSY_Pinvul_1_2014-06-13","DATE":"13/06/2014"},
{"IDMOSTREIG":"MSY_Pinvul_3_2014-06-13","DATE":"13/06/2014"},
{"IDMOSTREIG":"MSY_Polbis_1_2014-06-13","DATE":"13/06/2014"},
{"IDMOSTREIG":"SLI_Lavolb_2_2014-06-13","DATE":"13/06/2014"},
{"IDMOSTREIG":"SLI_Lavolb_4_2014-06-13","DATE":"13/06/2014"},
{"IDMOSTREIG":"SMA_Lilmar_1_2014-06-13","DATE":"13/06/2014"},
{"IDMOSTREIG":"MCO_Lavolb_4_2014-06-16","DATE":"16/06/2014"},
{"IDMOSTREIG":"MCO_Lavolb_1_2014-06-17","DATE":"17/06/2014"},
{"IDMOSTREIG":"MSY_Potpyr_1_2014-06-17","DATE":"17/06/2014"},
{"IDMOSTREIG":"MCO_Lavolb_5_2014-06-18","DATE":"18/06/2014"},
{"IDMOSTREIG":"GUI_Melnut_1_2014-06-19","DATE":"19/06/2014"},
{"IDMOSTREIG":"GUI_Carvir_1_2014-06-20","DATE":"20/06/2014"},
{"IDMOSTREIG":"GUI_Latcir_1_2014-06-20","DATE":"20/06/2014"},
{"IDMOSTREIG":"GUI_Phepur_1_2014-06-20","DATE":"20/06/2014"},
{"IDMOSTREIG":"MCO_Hyppul_2_2014-06-20","DATE":"20/06/2014"},
{"IDMOSTREIG":"MCO_Hyppul_3_2014-06-20","DATE":"20/06/2014"},
{"IDMOSTREIG":"MSY_Saxgen_2_2014-06-22","DATE":"22/06/2014"},
{"IDMOSTREIG":"MSY_Saxvay_3_2014-06-22","DATE":"22/06/2014"},
{"IDMOSTREIG":"MSY_Potmon_1_2014-06-25","DATE":"25/06/2014"},
{"IDMOSTREIG":"MSY_Caramp_1_2014-05-07","DATE":"05/07/2014"},
{"IDMOSTREIG":"MSY_Caramp_2_2014-05-07","DATE":"05/07/2014"},
{"IDMOSTREIG":"MSY_Caramp_3_2014-05-07","DATE":"05/07/2014"},
{"IDMOSTREIG":"MCO_Spiaes_1_2014-07-10","DATE":"10/07/2014"},
{"IDMOSTREIG":"MSY_Botmat_1_2014-07-08","DATE":"07/08/2014"},
{"IDMOSTREIG":"MSY_Botmat_2_2014-07-08","DATE":"07/08/2014"},
{"IDMOSTREIG":"MSY_Saxgen_1_2014-07-08","DATE":"07/08/2014"},
{"IDMOSTREIG":"MSY_Saxvay_2_2014-07-08","DATE":"07/08/2014"},
{"IDMOSTREIG":"GUI_Dicalb_1_2014-08-25","DATE":"25/08/2014"},
{"IDMOSTREIG":"MSY_Gymdry_1_2014-08-31","DATE":"31/08/2014"},
{"IDMOSTREIG":"MSY_Melcat_1_2014-08-31","DATE":"31/08/2014"},
{"IDMOSTREIG":"SMA_Lavolb_3_2014-06-09","DATE":"06/09/2014"},
{"IDMOSTREIG":"SMA_Lavolb_4_2014-06-09","DATE":"06/09/2014"},
{"IDMOSTREIG":"MCO_Cargri_3_2014-09-09","DATE":"09/09/2014"},
{"IDMOSTREIG":"MCO_Cargri_4_2014-09-09","DATE":"09/09/2014"},
{"IDMOSTREIG":"MCO_Cargri_5_2014-09-09","DATE":"09/09/2014"},
{"IDMOSTREIG":"MCO_Cargri_6_2014-09-09","DATE":"09/09/2014"},
{"IDMOSTREIG":"MCO_Cargri_7_2014-09-09","DATE":"09/09/2014"},
{"IDMOSTREIG":"SMA_Vitagn_1 _2014-09-12","DATE":"12/09/2014"},
{"IDMOSTREIG":"SMA_Vitagn_2_2014-09-12","DATE":"12/09/2014"},
{"IDMOSTREIG":"MCO_Galsca_2_2014-09-19","DATE":"19/09/2014"},
{"IDMOSTREIG":"SMA_Vitagn_3_2014-10-08","DATE":"08/10/2014"},
{"IDMOSTREIG":"SMA_Vitagn_4_2014-10-16","DATE":"16/10/2014"},
{"IDMOSTREIG":"SLI_Arisim_1_2014-11-14","DATE":"14/11/2014"},
{"IDMOSTREIG":"SMA_Vitagn_5_2014-11-18","DATE":"18/11/2014"},
{"IDMOSTREIG":"MCO_Arisim_4_2014-11-25","DATE":"25/11/2014"},
{"IDMOSTREIG":"MCO_Arisim_5_2014-12-04","DATE":"04/12/2014"},
{"IDMOSTREIG":"MSY_Lonnig_1_2014-06-12","DATE":"06/12/2014"},
{"IDMOSTREIG":"MSY_Lonnig_2_2014-06-12","DATE":"06/12/2014"},
{"IDMOSTREIG":"MSY_Lonnig_3_2014-06-12","DATE":"06/12/2014"},
{"IDMOSTREIG":"MCO_Arisim_3_2014-12-09","DATE":"09/12/2014"},
{"IDMOSTREIG":"MSY_Saxpan_3_2014-12-18","DATE":"18/12/2014"},
{"IDMOSTREIG":"SMA_Arisim_1_2015-03-24","DATE":"24/03/2015"},
{"IDMOSTREIG":"SMA_Viocat_2_2015-03-24","DATE":"24/03/2015"},
{"IDMOSTREIG":"SLI_Viocat_2_2015-03-26","DATE":"26/03/2015"},
{"IDMOSTREIG":"GRF_Sucbal_1_2015-04-21","DATE":"21/04/2015"},
{"IDMOSTREIG":"SMA_Arisim_1_2015-04-23","DATE":"23/04/2015"},
{"IDMOSTREIG":"GRF_Consic_1_2015-04-27","DATE":"27/04/2015"},
{"IDMOSTREIG":"GRF_Sucbal_2_2015-04-27","DATE":"27/04/2015"},
{"IDMOSTREIG":"SLL_Delbol_1_2015-05-15","DATE":"15/05/2015"},
{"IDMOSTREIG":"SLL_Delbol_2_2015-05-15","DATE":"15/05/2015"},
{"IDMOSTREIG":"SLL_Arecav_1_2015-05-19","DATE":"19/05/2015"},
{"IDMOSTREIG":"SLL_Arecav_2_2015-05-20","DATE":"20/05/2015"},
{"IDMOSTREIG":"GRF_Halhal_1_2015-05-28","DATE":"28/05/2015"},
{"IDMOSTREIG":"SLI_Lavolb_2_2015-05-29","DATE":"29/05/2015"},
{"IDMOSTREIG":"SLI_Lavolb_4_2015-05-29","DATE":"29/05/2015"},
{"IDMOSTREIG":"MSY_Caramp_1_2015-05-06","DATE":"05/06/2015"},
{"IDMOSTREIG":"SMA_Arisim_1_2015-06-09","DATE":"09/06/2015"},
{"IDMOSTREIG":"SLL_Saxcat_2_2015-06-17","DATE":"17/06/2015"},
{"IDMOSTREIG":"GUI_Latcir_1_2015-06-18","DATE":"18/06/2015"},
{"IDMOSTREIG":"MSY_Equhye_1_2015-06-25","DATE":"25/06/2015"},
{"IDMOSTREIG":"MCO_Hyppul_1_2015-06-26","DATE":"26/06/2015"},
{"IDMOSTREIG":"MCO_Hyppul_4_2015-06-26","DATE":"26/06/2015"},
{"IDMOSTREIG":"SLL_Silvir_1_2015-07-15","DATE":"15/07/2015"},
{"IDMOSTREIG":"SLL_Saxcat_1_2015-06-08","DATE":"06/08/2015"},
{"IDMOSTREIG":"GRF_Sucbal_1_2016-04-18","DATE":"18/04/2016"},
{"IDMOSTREIG":"GRF_Consic_1_2016-04-26","DATE":"26/04/2016"},
{"IDMOSTREIG":"GRF_Sucbal_2_2016-04-26","DATE":"26/04/2016"},
{"IDMOSTREIG":"SLI_Viocat_2_2016-04-06","DATE":"04/06/2016"},
{"IDMOSTREIG":"GRF_Arisim_1_2016-10-20","DATE":"20/10/2016"}]
var sd_impactesamenaces = [{"GRUP":"Impactes","PARAMETRE":"1. Canvi climàtic","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"1. Canvi climàtic","DATA":2010,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"1. Canvi climàtic","DATA":2011,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"1. Canvi climàtic","DATA":2012,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"1. Canvi climàtic","DATA":2013,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"1. Canvi climàtic","DATA":2014,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"1. Canvi climàtic","DATA":2015,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"1. Canvi climàtic","DATA":2016,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"10. Competència","DATA":2009,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"10. Competència","DATA":2010,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"10. Competència","DATA":2011,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"10. Competència","DATA":2012,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"10. Competència","DATA":2013,"VALOR":18},
{"GRUP":"Impactes","PARAMETRE":"10. Competència","DATA":2014,"VALOR":35},
{"GRUP":"Impactes","PARAMETRE":"10. Competència","DATA":2015,"VALOR":4},
{"GRUP":"Impactes","PARAMETRE":"10. Competència","DATA":2016,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"11. Predació","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"11. Predació","DATA":2010,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"11. Predació","DATA":2011,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"11. Predació","DATA":2012,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"11. Predació","DATA":2013,"VALOR":6},
{"GRUP":"Impactes","PARAMETRE":"11. Predació","DATA":2014,"VALOR":6},
{"GRUP":"Impactes","PARAMETRE":"11. Predació","DATA":2015,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"11. Predació","DATA":2016,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"12. Parasitisme","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"12. Parasitisme","DATA":2010,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"12. Parasitisme","DATA":2011,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"12. Parasitisme","DATA":2012,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"12. Parasitisme","DATA":2013,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"12. Parasitisme","DATA":2014,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"12. Parasitisme","DATA":2015,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"12. Parasitisme","DATA":2016,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"14. Hibridació","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"14. Hibridació","DATA":2010,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"14. Hibridació","DATA":2011,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"14. Hibridació","DATA":2012,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"14. Hibridació","DATA":2013,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"14. Hibridació","DATA":2014,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"14. Hibridació","DATA":2015,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"14. Hibridació","DATA":2016,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2009,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2010,"VALOR":5},
{"GRUP":"Impactes","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2011,"VALOR":4},
{"GRUP":"Impactes","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2012,"VALOR":4},
{"GRUP":"Impactes","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2013,"VALOR":10},
{"GRUP":"Impactes","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2014,"VALOR":11},
{"GRUP":"Impactes","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2015,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2016,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2010,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2011,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2012,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2013,"VALOR":8},
{"GRUP":"Impactes","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2014,"VALOR":8},
{"GRUP":"Impactes","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2015,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2016,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"17. Freqüentació","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"17. Freqüentació","DATA":2010,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"17. Freqüentació","DATA":2011,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"17. Freqüentació","DATA":2012,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"17. Freqüentació","DATA":2013,"VALOR":6},
{"GRUP":"Impactes","PARAMETRE":"17. Freqüentació","DATA":2014,"VALOR":10},
{"GRUP":"Impactes","PARAMETRE":"17. Freqüentació","DATA":2015,"VALOR":7},
{"GRUP":"Impactes","PARAMETRE":"17. Freqüentació","DATA":2016,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"18. Altres","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"18. Altres","DATA":2010,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"18. Altres","DATA":2011,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"18. Altres","DATA":2012,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"18. Altres","DATA":2013,"VALOR":7},
{"GRUP":"Impactes","PARAMETRE":"18. Altres","DATA":2014,"VALOR":6},
{"GRUP":"Impactes","PARAMETRE":"18. Altres","DATA":2015,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"18. Altres","DATA":2016,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2009,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2010,"VALOR":4},
{"GRUP":"Impactes","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2011,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2012,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2013,"VALOR":6},
{"GRUP":"Impactes","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2014,"VALOR":15},
{"GRUP":"Impactes","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2015,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2016,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"4. Alteració del medi hídric","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"4. Alteració del medi hídric","DATA":2010,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"4. Alteració del medi hídric","DATA":2011,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"4. Alteració del medi hídric","DATA":2012,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"4. Alteració del medi hídric","DATA":2013,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"4. Alteració del medi hídric","DATA":2014,"VALOR":4},
{"GRUP":"Impactes","PARAMETRE":"4. Alteració del medi hídric","DATA":2015,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"4. Alteració del medi hídric","DATA":2016,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2009,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2010,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2011,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2012,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2013,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2014,"VALOR":7},
{"GRUP":"Impactes","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2015,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2016,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"6. Pol·lució","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"6. Pol·lució","DATA":2010,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"6. Pol·lució","DATA":2011,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"6. Pol·lució","DATA":2012,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"6. Pol·lució","DATA":2013,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"6. Pol·lució","DATA":2014,"VALOR":4},
{"GRUP":"Impactes","PARAMETRE":"6. Pol·lució","DATA":2015,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"6. Pol·lució","DATA":2016,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2009,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2010,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2011,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2012,"VALOR":4},
{"GRUP":"Impactes","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2013,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2014,"VALOR":9},
{"GRUP":"Impactes","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2015,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2016,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2010,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2011,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2012,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2013,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2014,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2015,"VALOR":1},
{"GRUP":"Impactes","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2016,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2009,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2010,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2011,"VALOR":0},
{"GRUP":"Impactes","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2012,"VALOR":2},
{"GRUP":"Impactes","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2013,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2014,"VALOR":4},
{"GRUP":"Impactes","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2015,"VALOR":3},
{"GRUP":"Impactes","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"1. Canvi climàtic","DATA":2002,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"1. Canvi climàtic","DATA":2010,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"1. Canvi climàtic","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"1. Canvi climàtic","DATA":2012,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"1. Canvi climàtic","DATA":2013,"VALOR":6},
{"GRUP":"Amenaces","PARAMETRE":"1. Canvi climàtic","DATA":2014,"VALOR":4},
{"GRUP":"Amenaces","PARAMETRE":"1. Canvi climàtic","DATA":2015,"VALOR":5},
{"GRUP":"Amenaces","PARAMETRE":"1. Canvi climàtic","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"10. Competència","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"10. Competència","DATA":2010,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"10. Competència","DATA":2011,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"10. Competència","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"10. Competència","DATA":2013,"VALOR":18},
{"GRUP":"Amenaces","PARAMETRE":"10. Competència","DATA":2014,"VALOR":27},
{"GRUP":"Amenaces","PARAMETRE":"10. Competència","DATA":2015,"VALOR":6},
{"GRUP":"Amenaces","PARAMETRE":"10. Competència","DATA":2016,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"11. Predació","DATA":2002,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"11. Predació","DATA":2010,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"11. Predació","DATA":2011,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"11. Predació","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"11. Predació","DATA":2013,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"11. Predació","DATA":2014,"VALOR":4},
{"GRUP":"Amenaces","PARAMETRE":"11. Predació","DATA":2015,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"11. Predació","DATA":2016,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"12. Parasitisme","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"12. Parasitisme","DATA":2010,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"12. Parasitisme","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"12. Parasitisme","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"12. Parasitisme","DATA":2013,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"12. Parasitisme","DATA":2014,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"12. Parasitisme","DATA":2015,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"12. Parasitisme","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"14. Hibridació","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"14. Hibridació","DATA":2010,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"14. Hibridació","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"14. Hibridació","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"14. Hibridació","DATA":2013,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"14. Hibridació","DATA":2014,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"14. Hibridació","DATA":2015,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"14. Hibridació","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2010,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2011,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2013,"VALOR":10},
{"GRUP":"Amenaces","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2014,"VALOR":11},
{"GRUP":"Amenaces","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2015,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"15. Població o superfície recoberta petita","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2010,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2011,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2013,"VALOR":8},
{"GRUP":"Amenaces","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2014,"VALOR":7},
{"GRUP":"Amenaces","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2015,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"16. Aïllament biogeogràfic","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"17. Freqüentació","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"17. Freqüentació","DATA":2010,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"17. Freqüentació","DATA":2011,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"17. Freqüentació","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"17. Freqüentació","DATA":2013,"VALOR":10},
{"GRUP":"Amenaces","PARAMETRE":"17. Freqüentació","DATA":2014,"VALOR":7},
{"GRUP":"Amenaces","PARAMETRE":"17. Freqüentació","DATA":2015,"VALOR":8},
{"GRUP":"Amenaces","PARAMETRE":"17. Freqüentació","DATA":2016,"VALOR":3},
{"GRUP":"Amenaces","PARAMETRE":"18. Altres","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"18. Altres","DATA":2010,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"18. Altres","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"18. Altres","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"18. Altres","DATA":2013,"VALOR":5},
{"GRUP":"Amenaces","PARAMETRE":"18. Altres","DATA":2014,"VALOR":7},
{"GRUP":"Amenaces","PARAMETRE":"18. Altres","DATA":2015,"VALOR":6},
{"GRUP":"Amenaces","PARAMETRE":"18. Altres","DATA":2016,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2010,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2011,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2013,"VALOR":11},
{"GRUP":"Amenaces","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2014,"VALOR":12},
{"GRUP":"Amenaces","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2015,"VALOR":3},
{"GRUP":"Amenaces","PARAMETRE":"2. Reducció de l’hàbitat","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"3. Incendis forestals","DATA":2002,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"3. Incendis forestals","DATA":2010,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"3. Incendis forestals","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"3. Incendis forestals","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"3. Incendis forestals","DATA":2013,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"3. Incendis forestals","DATA":2014,"VALOR":6},
{"GRUP":"Amenaces","PARAMETRE":"3. Incendis forestals","DATA":2015,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"3. Incendis forestals","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"4. Alteració del medi hídric","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"4. Alteració del medi hídric","DATA":2010,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"4. Alteració del medi hídric","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"4. Alteració del medi hídric","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"4. Alteració del medi hídric","DATA":2013,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"4. Alteració del medi hídric","DATA":2014,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"4. Alteració del medi hídric","DATA":2015,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"4. Alteració del medi hídric","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2002,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2010,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2012,"VALOR":3},
{"GRUP":"Amenaces","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2013,"VALOR":4},
{"GRUP":"Amenaces","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2014,"VALOR":7},
{"GRUP":"Amenaces","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2015,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"5. Pràctiques forestals inadequades","DATA":2016,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"6. Pol·lució","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"6. Pol·lució","DATA":2010,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"6. Pol·lució","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"6. Pol·lució","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"6. Pol·lució","DATA":2013,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"6. Pol·lució","DATA":2014,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"6. Pol·lució","DATA":2015,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"6. Pol·lució","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2010,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2012,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2013,"VALOR":3},
{"GRUP":"Amenaces","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2014,"VALOR":8},
{"GRUP":"Amenaces","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2015,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2002,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2010,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2013,"VALOR":3},
{"GRUP":"Amenaces","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2014,"VALOR":3},
{"GRUP":"Amenaces","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2015,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes","DATA":2016,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2002,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2010,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2011,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2012,"VALOR":0},
{"GRUP":"Amenaces","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2013,"VALOR":1},
{"GRUP":"Amenaces","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2014,"VALOR":2},
{"GRUP":"Amenaces","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2015,"VALOR":3},
{"GRUP":"Amenaces","PARAMETRE":"9. Altres alteracions de l’hàbitat","DATA":2016,"VALOR":1}]
var sd_original = [{"ID_LOCALITAT":"GRF_Arisim_1","ID_PARC":"GRF","ESPECIE":"Arisarum simorrhinum var. simorrhinum","":null,"NUCLI_POBLACIONAL":1,"UTMX":413000,"UTMY":4574000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/10/2016","DATA_CENS_LAST":"20/10/2016","N_CENSOS":1},
{"ID_LOCALITAT":"GRF_Consic_1","ID_PARC":"GRF","ESPECIE":"Convolvulus siculus","":null,"NUCLI_POBLACIONAL":1,"UTMX":409000,"UTMY":4569000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"27/04/2015","DATA_CENS_LAST":"26/04/2016","N_CENSOS":2},
{"ID_LOCALITAT":"GRF_Digobs_2","ID_PARC":"GRF","ESPECIE":"Digitalis obscura","":null,"NUCLI_POBLACIONAL":2,"UTMX":392000,"UTMY":4574000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"GRF_Halhal_1","ID_PARC":"GRF","ESPECIE":"Halimium halimifolium","":null,"NUCLI_POBLACIONAL":1,"UTMX":413000,"UTMY":4573000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"28/05/2015","DATA_CENS_LAST":"28/05/2015","N_CENSOS":1},
{"ID_LOCALITAT":"GRF_Lavolb_1","ID_PARC":"GRF","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":1,"UTMX":412000,"UTMY":4574000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"GRF_Lavolb_2","ID_PARC":"GRF","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":2,"UTMX":411000,"UTMY":4573000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"GRF_Sucbal_1","ID_PARC":"GRF","ESPECIE":"Succowia balearica","":null,"NUCLI_POBLACIONAL":1,"UTMX":412000,"UTMY":4574000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"21/04/2015","DATA_CENS_LAST":"18/04/2016","N_CENSOS":2},
{"ID_LOCALITAT":"GRF_Sucbal_2","ID_PARC":"GRF","ESPECIE":"Succowia balearica","":null,"NUCLI_POBLACIONAL":2,"UTMX":410000,"UTMY":4569000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"27/04/2015","DATA_CENS_LAST":"26/04/2016","N_CENSOS":2},
{"ID_LOCALITAT":"GUI_Cardep_1","ID_PARC":"GUI","ESPECIE":"Carex depauperata","":null,"NUCLI_POBLACIONAL":1,"UTMX":453000,"UTMY":4647000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"03/07/2013","DATA_CENS_LAST":"25/05/2014","N_CENSOS":2},
{"ID_LOCALITAT":"GUI_Carpra_1","ID_PARC":"GUI","ESPECIE":"Carex praecox","":null,"NUCLI_POBLACIONAL":1,"UTMX":451000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"11/06/2014","DATA_CENS_LAST":"11/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"GUI_Carpra_2","ID_PARC":"GUI","ESPECIE":"Carex praecox","":null,"NUCLI_POBLACIONAL":2,"UTMX":451000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"GUI_Carvir_1","ID_PARC":"GUI","ESPECIE":"Carex flava ssp. viridula","":null,"NUCLI_POBLACIONAL":1,"UTMX":450000,"UTMY":4644000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/06/2014","DATA_CENS_LAST":"20/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"GUI_Dicalb_1","ID_PARC":"GUI","ESPECIE":"Dictamnus albus","":null,"NUCLI_POBLACIONAL":1,"UTMX":451000,"UTMY":4646000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"03/07/2013","DATA_CENS_LAST":"25/08/2014","N_CENSOS":2},
{"ID_LOCALITAT":"GUI_Eupdul_1","ID_PARC":"GUI","ESPECIE":"Euphorbia dulcis ssp. dulcis","":null,"NUCLI_POBLACIONAL":1,"UTMX":447000,"UTMY":4638000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"03/07/2013","DATA_CENS_LAST":"28/05/2014","N_CENSOS":2},
{"ID_LOCALITAT":"GUI_Latcir_1","ID_PARC":"GUI","ESPECIE":"Lathyrus cirrhosus","":null,"NUCLI_POBLACIONAL":1,"UTMX":450000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/06/2014","DATA_CENS_LAST":"18/06/2015","N_CENSOS":2},
{"ID_LOCALITAT":"GUI_Melnut_1","ID_PARC":"GUI","ESPECIE":"Melica nutans","":null,"NUCLI_POBLACIONAL":1,"UTMX":446000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"19/06/2014","DATA_CENS_LAST":"19/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"GUI_Peuoff_1","ID_PARC":"GUI","ESPECIE":"Peucedanum officinale","":null,"NUCLI_POBLACIONAL":1,"UTMX":451000,"UTMY":4646000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"03/07/2013","DATA_CENS_LAST":"28/05/2014","N_CENSOS":2},
{"ID_LOCALITAT":"GUI_Phepur_1","ID_PARC":"GUI","ESPECIE":"Phelipanche purpurea","":null,"NUCLI_POBLACIONAL":1,"UTMX":442000,"UTMY":4644000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/06/2014","DATA_CENS_LAST":"20/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"GUI_Saxgen_1","ID_PARC":"GUI","ESPECIE":"Saxifraga genesiana","":null,"NUCLI_POBLACIONAL":1,"UTMX":457000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"GUI_Saxgen_2","ID_PARC":"GUI","ESPECIE":"Saxifraga genesiana","":null,"NUCLI_POBLACIONAL":2,"UTMX":456000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"GUI_Saxvay_1","ID_PARC":"GUI","ESPECIE":"Saxifraga vayredana","":null,"NUCLI_POBLACIONAL":1,"UTMX":457000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"GUI_Saxvay_2","ID_PARC":"GUI","ESPECIE":"Saxifraga vayredana","":null,"NUCLI_POBLACIONAL":2,"UTMX":456000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"GUI_Saxvay_3","ID_PARC":"GUI","ESPECIE":"Saxifraga vayredana","":null,"NUCLI_POBLACIONAL":3,"UTMX":457000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"GUI_Saxvay_4","ID_PARC":"GUI","ESPECIE":"Saxifraga vayredana","":null,"NUCLI_POBLACIONAL":4,"UTMX":457000,"UTMY":4642000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"MCO_Arisim_1","ID_PARC":"MCO","ESPECIE":"Arisarum simorrhinum var. simorrhinum","":null,"NUCLI_POBLACIONAL":1,"UTMX":472000,"UTMY":4610000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/12/2013","DATA_CENS_LAST":"09/12/2013","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Arisim_2","ID_PARC":"MCO","ESPECIE":"Arisarum simorrhinum var. simorrhinum","":null,"NUCLI_POBLACIONAL":2,"UTMX":472000,"UTMY":4611000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/12/2013","DATA_CENS_LAST":"09/12/2013","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Arisim_3","ID_PARC":"MCO","ESPECIE":"Arisarum simorrhinum var. simorrhinum","":null,"NUCLI_POBLACIONAL":3,"UTMX":469000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/12/2014","DATA_CENS_LAST":"09/12/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Arisim_4","ID_PARC":"MCO","ESPECIE":"Arisarum simorrhinum var. simorrhinum","":null,"NUCLI_POBLACIONAL":4,"UTMX":472000,"UTMY":4610000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"25/11/2014","DATA_CENS_LAST":"25/11/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Arisim_5","ID_PARC":"MCO","ESPECIE":"Arisarum simorrhinum var. simorrhinum","":null,"NUCLI_POBLACIONAL":5,"UTMX":473000,"UTMY":4610000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"04/12/2014","DATA_CENS_LAST":"04/12/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cargri_1","ID_PARC":"MCO","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":1,"UTMX":469000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"03/10/2013","DATA_CENS_LAST":"03/10/2013","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cargri_2","ID_PARC":"MCO","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":2,"UTMX":469000,"UTMY":4613000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"03/10/2013","DATA_CENS_LAST":"03/10/2013","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cargri_3","ID_PARC":"MCO","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":3,"UTMX":461000,"UTMY":4609000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/09/2014","DATA_CENS_LAST":"09/09/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cargri_4","ID_PARC":"MCO","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":4,"UTMX":460000,"UTMY":4609000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/09/2014","DATA_CENS_LAST":"09/09/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cargri_5","ID_PARC":"MCO","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":5,"UTMX":458000,"UTMY":4606000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/09/2014","DATA_CENS_LAST":"09/09/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cargri_6","ID_PARC":"MCO","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":6,"UTMX":457000,"UTMY":4606000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/09/2014","DATA_CENS_LAST":"09/09/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cargri_7","ID_PARC":"MCO","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":7,"UTMX":455000,"UTMY":4606000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/09/2014","DATA_CENS_LAST":"09/09/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cicfil_1","ID_PARC":"MCO","ESPECIE":"Cicendia filiformis","":null,"NUCLI_POBLACIONAL":1,"UTMX":470000,"UTMY":4615000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"29/04/2014","DATA_CENS_LAST":"29/04/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cosvel_1","ID_PARC":"MCO","ESPECIE":"Cosentinia vellea","":null,"NUCLI_POBLACIONAL":1,"UTMX":473000,"UTMY":4610000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/12/2013","DATA_CENS_LAST":"09/12/2013","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Cosvel_2","ID_PARC":"MCO","ESPECIE":"Cosentinia vellea","":null,"NUCLI_POBLACIONAL":2,"UTMX":472000,"UTMY":4611000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/12/2013","DATA_CENS_LAST":"09/12/2013","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Ericin_1","ID_PARC":"MCO","ESPECIE":"Erica cinerea","":null,"NUCLI_POBLACIONAL":1,"UTMX":474000,"UTMY":4613000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Quinquennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"MCO_Galsca_1","ID_PARC":"MCO","ESPECIE":"Galium scabrum","":null,"NUCLI_POBLACIONAL":1,"UTMX":461000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/06/2002","DATA_CENS_LAST":"20/09/2013","N_CENSOS":3},
{"ID_LOCALITAT":"MCO_Galsca_2","ID_PARC":"MCO","ESPECIE":"Galium scabrum","":null,"NUCLI_POBLACIONAL":2,"UTMX":460000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"19/09/2014","DATA_CENS_LAST":"19/09/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Galsca_3","ID_PARC":"MCO","ESPECIE":"Galium scabrum","":null,"NUCLI_POBLACIONAL":3,"UTMX":462000,"UTMY":4614000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"22/08/2013","DATA_CENS_LAST":"22/08/2013","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Galsca_4","ID_PARC":"MCO","ESPECIE":"Galium scabrum","":null,"NUCLI_POBLACIONAL":4,"UTMX":462000,"UTMY":4614000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"0","":null,"":null,"PERIODICITAT":"0","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"MCO_Halhal_1","ID_PARC":"MCO","ESPECIE":"Halimium halimifolium","":null,"NUCLI_POBLACIONAL":1,"UTMX":475000,"UTMY":4613000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"01/06/2009","DATA_CENS_LAST":"04/06/2014","N_CENSOS":5},
{"ID_LOCALITAT":"MCO_Halhal_2","ID_PARC":"MCO","ESPECIE":"Halimium halimifolium","":null,"NUCLI_POBLACIONAL":2,"UTMX":475000,"UTMY":4613000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"01/06/2009","DATA_CENS_LAST":"04/06/2014","N_CENSOS":5},
{"ID_LOCALITAT":"MCO_Halhal_3","ID_PARC":"MCO","ESPECIE":"Halimium halimifolium","":null,"NUCLI_POBLACIONAL":3,"UTMX":475000,"UTMY":4613000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"01/06/2010","DATA_CENS_LAST":"04/06/2014","N_CENSOS":4},
{"ID_LOCALITAT":"MCO_Halhal_4","ID_PARC":"MCO","ESPECIE":"Halimium halimifolium","":null,"NUCLI_POBLACIONAL":4,"UTMX":475000,"UTMY":4613000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"01/03/2009","DATA_CENS_LAST":"04/06/2014","N_CENSOS":3},
{"ID_LOCALITAT":"MCO_Hyppul_1","ID_PARC":"MCO","ESPECIE":"Hypericum pulchrum","":null,"NUCLI_POBLACIONAL":1,"UTMX":464000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"26/06/2015","DATA_CENS_LAST":"26/06/2015","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Hyppul_2","ID_PARC":"MCO","ESPECIE":"Hypericum pulchrum","":null,"NUCLI_POBLACIONAL":2,"UTMX":466000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/06/2014","DATA_CENS_LAST":"20/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Hyppul_3","ID_PARC":"MCO","ESPECIE":"Hypericum pulchrum","":null,"NUCLI_POBLACIONAL":3,"UTMX":466000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/06/2014","DATA_CENS_LAST":"20/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Hyppul_4","ID_PARC":"MCO","ESPECIE":"Hypericum pulchrum","":null,"NUCLI_POBLACIONAL":4,"UTMX":466000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"26/06/2015","DATA_CENS_LAST":"26/06/2015","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Hyppul_5","ID_PARC":"MCO","ESPECIE":"Hypericum pulchrum","":null,"NUCLI_POBLACIONAL":5,"UTMX":466000,"UTMY":4611000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"MCO_Hyppul_6","ID_PARC":"MCO","ESPECIE":"Hypericum pulchrum","":null,"NUCLI_POBLACIONAL":6,"UTMX":466000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"MCO_Hyppul_7","ID_PARC":"MCO","ESPECIE":"Hypericum pulchrum","":null,"NUCLI_POBLACIONAL":7,"UTMX":466000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"MCO_Isodur_1","ID_PARC":"MCO","ESPECIE":"Isoetes durieui","":null,"NUCLI_POBLACIONAL":1,"UTMX":468000,"UTMY":4616000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"07/05/2014","DATA_CENS_LAST":"07/05/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Latsqu_1","ID_PARC":"MCO","ESPECIE":"Lathraea squamaria","":null,"NUCLI_POBLACIONAL":1,"UTMX":463000,"UTMY":4612000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"MCO_Lavolb_1","ID_PARC":"MCO","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":1,"UTMX":471000,"UTMY":4611000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"17/06/2014","DATA_CENS_LAST":"17/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Lavolb_2","ID_PARC":"MCO","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":2,"UTMX":456000,"UTMY":4604000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"12/06/2014","DATA_CENS_LAST":"12/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Lavolb_3","ID_PARC":"MCO","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":3,"UTMX":456000,"UTMY":4604000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"12/06/2014","DATA_CENS_LAST":"12/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Lavolb_4","ID_PARC":"MCO","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":4,"UTMX":456000,"UTMY":4605000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"16/06/2014","DATA_CENS_LAST":"16/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Lavolb_5","ID_PARC":"MCO","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":5,"UTMX":456000,"UTMY":4605000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quadriennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"18/06/2014","DATA_CENS_LAST":"18/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MCO_Spiaes_1","ID_PARC":"MCO","ESPECIE":"Spiranthes aestivalis","":null,"NUCLI_POBLACIONAL":1,"UTMX":470000,"UTMY":4615000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Triennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"10/07/2014","DATA_CENS_LAST":"10/07/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MSY_Botmat_1","ID_PARC":"MSY","ESPECIE":"Botrychium matricariifolium","":null,"NUCLI_POBLACIONAL":1,"UTMX":455000,"UTMY":4625000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"18/06/2012","DATA_CENS_LAST":"08/07/2014","N_CENSOS":3},
{"ID_LOCALITAT":"MSY_Botmat_2","ID_PARC":"MSY","ESPECIE":"Botrychium matricariifolium","":null,"NUCLI_POBLACIONAL":2,"UTMX":455000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"28/06/2013","DATA_CENS_LAST":"08/07/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Caramp_1","ID_PARC":"MSY","ESPECIE":"Cardamine amporitana","":null,"NUCLI_POBLACIONAL":1,"UTMX":455000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"21/05/2012","DATA_CENS_LAST":"06/05/2015","N_CENSOS":4},
{"ID_LOCALITAT":"MSY_Caramp_2","ID_PARC":"MSY","ESPECIE":"Cardamine amporitana","":null,"NUCLI_POBLACIONAL":2,"UTMX":455000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"07/05/2014","DATA_CENS_LAST":"07/05/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MSY_Caramp_3","ID_PARC":"MSY","ESPECIE":"Cardamine amporitana","":null,"NUCLI_POBLACIONAL":3,"UTMX":455000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"07/05/2014","DATA_CENS_LAST":"07/05/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MSY_Coevir_1","ID_PARC":"MSY","ESPECIE":"Coeloglossum viride","":null,"NUCLI_POBLACIONAL":1,"UTMX":444000,"UTMY":4625000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/06/2013","DATA_CENS_LAST":"13/06/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Equhye_1","ID_PARC":"MSY","ESPECIE":"Equisetum hyemale","":null,"NUCLI_POBLACIONAL":1,"UTMX":455000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"25/06/2015","DATA_CENS_LAST":"25/06/2015","N_CENSOS":1},
{"ID_LOCALITAT":"MSY_Galsca_1","ID_PARC":"MSY","ESPECIE":"Galium scabrum","":null,"NUCLI_POBLACIONAL":1,"UTMX":460000,"UTMY":4623000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"21/05/2012","DATA_CENS_LAST":"03/06/2014","N_CENSOS":3},
{"ID_LOCALITAT":"MSY_Gymdry_1","ID_PARC":"MSY","ESPECIE":"Gymnocarpium dryopteris","":null,"NUCLI_POBLACIONAL":1,"UTMX":454000,"UTMY":4627000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"04/09/2013","DATA_CENS_LAST":"31/08/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Hyppul_1","ID_PARC":"MSY","ESPECIE":"Hypericum pulchrum","":null,"NUCLI_POBLACIONAL":1,"UTMX":458000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"21/05/2012","DATA_CENS_LAST":"18/06/2013","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Lonnig_1","ID_PARC":"MSY","ESPECIE":"Lonicera nigra","":null,"NUCLI_POBLACIONAL":1,"UTMX":450000,"UTMY":4628000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"10/09/2013","DATA_CENS_LAST":"12/06/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Lonnig_2","ID_PARC":"MSY","ESPECIE":"Lonicera nigra","":null,"NUCLI_POBLACIONAL":2,"UTMX":450000,"UTMY":4628000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"10/09/2013","DATA_CENS_LAST":"12/06/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Lonnig_3","ID_PARC":"MSY","ESPECIE":"Lonicera nigra","":null,"NUCLI_POBLACIONAL":3,"UTMX":449000,"UTMY":4628000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"13/09/2013","DATA_CENS_LAST":"12/06/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Melcat_1","ID_PARC":"MSY","ESPECIE":"Melampyrum catalaunicum","":null,"NUCLI_POBLACIONAL":1,"UTMX":456000,"UTMY":4627000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"18/06/2012","DATA_CENS_LAST":"31/08/2014","N_CENSOS":3},
{"ID_LOCALITAT":"MSY_Pinvul_1","ID_PARC":"MSY","ESPECIE":"Pinguicula vulgaris","":null,"NUCLI_POBLACIONAL":1,"UTMX":448000,"UTMY":4628000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"27/06/2013","DATA_CENS_LAST":"13/06/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Pinvul_2","ID_PARC":"MSY","ESPECIE":"Pinguicula vulgaris","":null,"NUCLI_POBLACIONAL":2,"UTMX":447000,"UTMY":4627000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"MSY_Pinvul_3","ID_PARC":"MSY","ESPECIE":"Pinguicula vulgaris","":null,"NUCLI_POBLACIONAL":3,"UTMX":446000,"UTMY":4628000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"13/06/2014","DATA_CENS_LAST":"13/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MSY_Polbis_1","ID_PARC":"MSY","ESPECIE":"Polygonum bistorta","":null,"NUCLI_POBLACIONAL":1,"UTMX":444000,"UTMY":4622000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/06/2013","DATA_CENS_LAST":"13/06/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Potmon_1","ID_PARC":"MSY","ESPECIE":"Potentilla montana","":null,"NUCLI_POBLACIONAL":1,"UTMX":455000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"21/05/2012","DATA_CENS_LAST":"25/06/2014","N_CENSOS":3},
{"ID_LOCALITAT":"MSY_Potpyr_1","ID_PARC":"MSY","ESPECIE":"Potentilla pyrenaica","":null,"NUCLI_POBLACIONAL":1,"UTMX":449000,"UTMY":4628000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"28/06/2013","DATA_CENS_LAST":"17/06/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Prulus_1","ID_PARC":"MSY","ESPECIE":"Prunus lusitanica","":null,"NUCLI_POBLACIONAL":1,"UTMX":458000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"21/05/2012","DATA_CENS_LAST":"25/06/2013","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Samrac_1","ID_PARC":"MSY","ESPECIE":"Sambucus racemosa","":null,"NUCLI_POBLACIONAL":1,"UTMX":449000,"UTMY":4628000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"06/06/2014","DATA_CENS_LAST":"06/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MSY_Samrac_2","ID_PARC":"MSY","ESPECIE":"Sambucus racemosa","":null,"NUCLI_POBLACIONAL":2,"UTMX":450000,"UTMY":4629000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"14/10/2013","DATA_CENS_LAST":"28/05/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Samrac_3","ID_PARC":"MSY","ESPECIE":"Sambucus racemosa","":null,"NUCLI_POBLACIONAL":3,"UTMX":451000,"UTMY":4628000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"10/10/2013","DATA_CENS_LAST":"28/05/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Saxgen_1","ID_PARC":"MSY","ESPECIE":"Saxifraga genesiana","":null,"NUCLI_POBLACIONAL":1,"UTMX":453000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"18/06/2012","DATA_CENS_LAST":"08/07/2014","N_CENSOS":3},
{"ID_LOCALITAT":"MSY_Saxgen_2","ID_PARC":"MSY","ESPECIE":"Saxifraga genesiana","":null,"NUCLI_POBLACIONAL":2,"UTMX":452000,"UTMY":4626000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"16/06/2013","DATA_CENS_LAST":"22/06/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Saxpan_3","ID_PARC":"MSY","ESPECIE":"Saxifraga paniculata","":null,"NUCLI_POBLACIONAL":3,"UTMX":450000,"UTMY":4628000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"18/12/2014","DATA_CENS_LAST":"18/12/2014","N_CENSOS":1},
{"ID_LOCALITAT":"MSY_Saxvay_1","ID_PARC":"MSY","ESPECIE":"Saxifraga vayredana","":null,"NUCLI_POBLACIONAL":1,"UTMX":452000,"UTMY":4626000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"18/06/2012","DATA_CENS_LAST":"18/06/2012","N_CENSOS":1},
{"ID_LOCALITAT":"MSY_Saxvay_2","ID_PARC":"MSY","ESPECIE":"Saxifraga vayredana","":null,"NUCLI_POBLACIONAL":2,"UTMX":453000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"19/06/2013","DATA_CENS_LAST":"08/07/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Saxvay_3","ID_PARC":"MSY","ESPECIE":"Saxifraga vayredana","":null,"NUCLI_POBLACIONAL":3,"UTMX":453000,"UTMY":4624000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"16/06/2013","DATA_CENS_LAST":"22/06/2014","N_CENSOS":2},
{"ID_LOCALITAT":"MSY_Taxbac_1","ID_PARC":"MSY","ESPECIE":"Taxus bacatta","":null,"NUCLI_POBLACIONAL":1,"UTMX":445000,"UTMY":4623000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"15/10/2013","DATA_CENS_LAST":"15/10/2013","N_CENSOS":1},
{"ID_LOCALITAT":"MSY_Viobub_1","ID_PARC":"MSY","ESPECIE":"Viola bubanii","":null,"NUCLI_POBLACIONAL":1,"UTMX":456000,"UTMY":4626000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"21/05/2012","DATA_CENS_LAST":"21/05/2012","N_CENSOS":1},
{"ID_LOCALITAT":"SLI_Arisim_1","ID_PARC":"SLI","ESPECIE":"Arisarum simorrhinum var. simorrhinum","":null,"NUCLI_POBLACIONAL":1,"UTMX":448000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Cada 3 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"14/11/2014","DATA_CENS_LAST":"14/11/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SLI_Cargri_1","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":1,"UTMX":449000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"0","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"25/05/2012","DATA_CENS_LAST":"23/05/2014","N_CENSOS":3},
{"ID_LOCALITAT":"SLI_Cargri_10","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":10,"UTMX":443000,"UTMY":4597000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_11","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":11,"UTMX":444000,"UTMY":4596000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_12","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":12,"UTMX":444000,"UTMY":4597000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_13","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":13,"UTMX":443000,"UTMY":4600000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_14","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":14,"UTMX":444000,"UTMY":4600000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_15","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":15,"UTMX":444000,"UTMY":4600000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_16","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":16,"UTMX":444000,"UTMY":4600000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_17","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":17,"UTMX":448000,"UTMY":4604000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_18","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":18,"UTMX":444000,"UTMY":4597000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"23/05/2014","DATA_CENS_LAST":"23/05/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SLI_Cargri_19","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":19,"UTMX":439000,"UTMY":4596000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_2","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":2,"UTMX":443000,"UTMY":4597000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_20","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":20,"UTMX":443000,"UTMY":4598000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_21","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":21,"UTMX":447000,"UTMY":4602000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_22","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":22,"UTMX":444000,"UTMY":4602000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_3","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":3,"UTMX":445000,"UTMY":4598000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_4","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":4,"UTMX":444000,"UTMY":4598000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_5","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":5,"UTMX":444000,"UTMY":4598000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_6","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":6,"UTMX":446000,"UTMY":4603000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_7","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":7,"UTMX":448000,"UTMY":4598000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_8","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":8,"UTMX":448000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Cargri_9","ID_PARC":"SLI","ESPECIE":"Carex grioletii","":null,"NUCLI_POBLACIONAL":9,"UTMX":447000,"UTMY":4600000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Dicalb_1","ID_PARC":"SLI","ESPECIE":"Dictamnus albus","":null,"NUCLI_POBLACIONAL":1,"UTMX":443000,"UTMY":4602000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Isodur_1","ID_PARC":"SLI","ESPECIE":"Isoetes durieui","":null,"NUCLI_POBLACIONAL":1,"UTMX":443000,"UTMY":4602000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"10/01/2010","DATA_CENS_LAST":"10/01/2010","N_CENSOS":1},
{"ID_LOCALITAT":"SLI_Lavolb_1","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":1,"UTMX":449000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"0","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"25/05/2012","DATA_CENS_LAST":"25/05/2012","N_CENSOS":1},
{"ID_LOCALITAT":"SLI_Lavolb_10","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":10,"UTMX":439000,"UTMY":4594000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Lavolb_11","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":11,"UTMX":438000,"UTMY":4596000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Lavolb_2","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":2,"UTMX":448000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"13/06/2014","DATA_CENS_LAST":"29/05/2015","N_CENSOS":2},
{"ID_LOCALITAT":"SLI_Lavolb_3","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":3,"UTMX":447000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Lavolb_4","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":4,"UTMX":447000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"13/06/2014","DATA_CENS_LAST":"29/05/2015","N_CENSOS":2},
{"ID_LOCALITAT":"SLI_Lavolb_5","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":5,"UTMX":447000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Lavolb_6","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":6,"UTMX":448000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Lavolb_7","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":7,"UTMX":448000,"UTMY":4598000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Lavolb_8","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":8,"UTMX":439000,"UTMY":4595000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Lavolb_9","ID_PARC":"SLI","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":9,"UTMX":439000,"UTMY":4594000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Servom_1","ID_PARC":"SLI","ESPECIE":"Serapias vomeracea","":null,"NUCLI_POBLACIONAL":1,"UTMX":443000,"UTMY":4602000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SLI_Viocat_1","ID_PARC":"SLI","ESPECIE":"Viola suavis ssp. catalonica","":null,"NUCLI_POBLACIONAL":1,"UTMX":449000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"0","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"25/05/2012","DATA_CENS_LAST":"25/05/2012","N_CENSOS":1},
{"ID_LOCALITAT":"SLI_Viocat_2","ID_PARC":"SLI","ESPECIE":"Viola suavis ssp. catalonica","":null,"NUCLI_POBLACIONAL":2,"UTMX":449000,"UTMY":4599000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Cada 3-5 anys","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"26/03/2015","DATA_CENS_LAST":"06/04/2016","N_CENSOS":2},
{"ID_LOCALITAT":"SLL_Arecav_1","ID_PARC":"SLL","ESPECIE":"Arenaria fontqueri ssp. cavanillesiana","":null,"NUCLI_POBLACIONAL":1,"UTMX":414000,"UTMY":4613000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"19/05/2015","DATA_CENS_LAST":"19/05/2015","N_CENSOS":1},
{"ID_LOCALITAT":"SLL_Arecav_2","ID_PARC":"SLL","ESPECIE":"Arenaria fontqueri ssp. cavanillesiana","":null,"NUCLI_POBLACIONAL":2,"UTMX":416000,"UTMY":4613000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"20/05/2015","DATA_CENS_LAST":"20/05/2015","N_CENSOS":1},
{"ID_LOCALITAT":"SLL_Delbol_1","ID_PARC":"SLL","ESPECIE":"Delphinium bolosii","":null,"NUCLI_POBLACIONAL":1,"UTMX":415000,"UTMY":4615000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"04/06/2014","DATA_CENS_LAST":"15/05/2015","N_CENSOS":2},
{"ID_LOCALITAT":"SLL_Delbol_2","ID_PARC":"SLL","ESPECIE":"Delphinium bolosii","":null,"NUCLI_POBLACIONAL":2,"UTMX":415000,"UTMY":4614000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"21/05/2014","DATA_CENS_LAST":"15/05/2015","N_CENSOS":2},
{"ID_LOCALITAT":"SLL_Saxcat_1","ID_PARC":"SLL","ESPECIE":"Saxifraga callosa ssp. catalaunica","":null,"NUCLI_POBLACIONAL":1,"UTMX":416000,"UTMY":4614000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"08/06/2015","DATA_CENS_LAST":"08/06/2015","N_CENSOS":1},
{"ID_LOCALITAT":"SLL_Saxcat_2","ID_PARC":"SLL","ESPECIE":"Saxifraga callosa ssp. catalaunica","":null,"NUCLI_POBLACIONAL":2,"UTMX":417000,"UTMY":4614000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 3 - Estimació amb parcel·les","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"17/06/2015","DATA_CENS_LAST":"17/06/2015","N_CENSOS":1},
{"ID_LOCALITAT":"SLL_Silvir_1","ID_PARC":"SLL","ESPECIE":"Silene viridiflora","":null,"NUCLI_POBLACIONAL":1,"UTMX":414000,"UTMY":4605000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"15/07/2015","DATA_CENS_LAST":"15/07/2015","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Arisim_1","ID_PARC":"SMA","ESPECIE":"Arisarum simorrhinum var. simorrhinum","":null,"NUCLI_POBLACIONAL":1,"UTMX":436000,"UTMY":4592000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Triennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"08/11/2010","DATA_CENS_LAST":"09/06/2015","N_CENSOS":5},
{"ID_LOCALITAT":"SMA_Chetin_1","ID_PARC":"SMA","ESPECIE":"Cheilanthes tinaei","":null,"NUCLI_POBLACIONAL":1,"UTMX":438000,"UTMY":4591000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Anual","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"06/05/2014","DATA_CENS_LAST":"06/05/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Lavolb_1","ID_PARC":"SMA","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":1,"UTMX":434000,"UTMY":4593000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SMA_Lavolb_2","ID_PARC":"SMA","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":2,"UTMX":437000,"UTMY":4592000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"Sense visites","DATA_CENS_LAST":"Sense visites","N_CENSOS":0},
{"ID_LOCALITAT":"SMA_Lavolb_3","ID_PARC":"SMA","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":3,"UTMX":436000,"UTMY":4593000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/06/2014","DATA_CENS_LAST":"09/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Lavolb_4","ID_PARC":"SMA","ESPECIE":"Lavatera olbia","":null,"NUCLI_POBLACIONAL":4,"UTMX":437000,"UTMY":4593000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"09/06/2014","DATA_CENS_LAST":"09/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Lilmar_1","ID_PARC":"SMA","ESPECIE":"Lilium martagon","":null,"NUCLI_POBLACIONAL":1,"UTMX":434000,"UTMY":4594000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Quinquenal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"13/06/2014","DATA_CENS_LAST":"13/06/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Nardub_1","ID_PARC":"SMA","ESPECIE":"Narcissus dubius","":null,"NUCLI_POBLACIONAL":1,"UTMX":436000,"UTMY":4592000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Triennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"18/03/2011","DATA_CENS_LAST":"13/03/2014","N_CENSOS":3},
{"ID_LOCALITAT":"SMA_Selden_1","ID_PARC":"SMA","ESPECIE":"Selaginella denticulata","":null,"NUCLI_POBLACIONAL":1,"UTMX":432000,"UTMY":4590000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 1 - Presència / absència","":null,"":null,"PERIODICITAT":"Triennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"27/03/2014","DATA_CENS_LAST":"27/03/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Viocat_1","ID_PARC":"SMA","ESPECIE":"Viola suavis ssp. catalonica","":null,"NUCLI_POBLACIONAL":1,"UTMX":439000,"UTMY":4593000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"06/03/2014","DATA_CENS_LAST":"06/03/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Viocat_2","ID_PARC":"SMA","ESPECIE":"Viola suavis ssp. catalonica","":null,"NUCLI_POBLACIONAL":2,"UTMX":439000,"UTMY":4593000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"06/03/2014","DATA_CENS_LAST":"24/03/2015","N_CENSOS":2},
{"ID_LOCALITAT":"SMA_Viocat_3","ID_PARC":"SMA","ESPECIE":"Viola suavis ssp. catalonica","":null,"NUCLI_POBLACIONAL":3,"UTMX":437000,"UTMY":4593000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Biennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"06/03/2014","DATA_CENS_LAST":"06/03/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Vitagn_1","ID_PARC":"SMA","ESPECIE":"Vitex agnus-castus","":null,"NUCLI_POBLACIONAL":1,"UTMX":435000,"UTMY":4590000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Triennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"12/09/2014","DATA_CENS_LAST":"12/09/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Vitagn_2","ID_PARC":"SMA","ESPECIE":"Vitex agnus-castus","":null,"NUCLI_POBLACIONAL":2,"UTMX":439000,"UTMY":4593000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Triennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"12/09/2014","DATA_CENS_LAST":"12/09/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Vitagn_3","ID_PARC":"SMA","ESPECIE":"Vitex agnus-castus","":null,"NUCLI_POBLACIONAL":3,"UTMX":436000,"UTMY":4591000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Triennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"08/10/2014","DATA_CENS_LAST":"08/10/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Vitagn_4","ID_PARC":"SMA","ESPECIE":"Vitex agnus-castus","":null,"NUCLI_POBLACIONAL":4,"UTMX":432000,"UTMY":4592000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Triennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"16/10/2014","DATA_CENS_LAST":"16/10/2014","N_CENSOS":1},
{"ID_LOCALITAT":"SMA_Vitagn_5","ID_PARC":"SMA","ESPECIE":"Vitex agnus-castus","":null,"NUCLI_POBLACIONAL":5,"UTMX":432000,"UTMY":4592000,"":null,"":null,"METODOLOGIA_SEGUIMENT":"Metodologia 2 - Recompte total","":null,"":null,"PERIODICITAT":"Triennal","":null,"":null,"":null,"":null,"":null,"":null,"DATA_CENS_FIRST":"18/11/2014","DATA_CENS_LAST":"18/11/2014","N_CENSOS":1}]
function FISHNET()
{
	this.cells = [];
};

function CELL(utmx, utmy)
{
	this.UTMX = utmx;
	this.UTMY = utmy;
};

CELL.prototype.get_polygonXY = function()
{
	var offset = sefa_config.fishnet_resolution/2;
	var xy = [];
	xy.push([this.UTMX-offset,this.UTMY-offset]);
	xy.push([this.UTMX-offset,this.UTMY+offset]);
	xy.push([this.UTMX+offset,this.UTMY+offset]);
	xy.push([this.UTMX+offset,this.UTMY-offset]);
	xy.push([this.UTMX-offset,this.UTMY-offset]);
	return [xy];
}
function MANAGE_SD()
{
	//Eliminar NULL, compte! en queda un primer!
	this.sd = _.compact(sd_original);
		
	//Extreure la llista única de coordenades UTM1x1 i
	// crear la malla.
	_.forEach(_.uniqBy(this.sd, function(w){return w.UTMX+','+w.UTMY;}), function(c){
			fishnet.cells.push(new CELL(c.UTMX, c.UTMY));
		});	
};

MANAGE_SD.prototype.get_unique_protected_areas = function(){
	var w = [];
	_.forEach(_.uniqBy(this.sd, function(w){return w.ID_PARC;}), function(q){w.push(q.ID_PARC);});
	
	//Ordeno l'array de codis únics segons l'ordre que vol el David. Si un codi no apareix a la llista
	//de codis ordenats, s'afegeix al final. Si s'afegeix a les dades un parc nou, s'haurà d'actualizar el primer array!
	return _.union(['GUI','MSY','SLL','MCO','SLI','SMA','GRF'],w);
};


MANAGE_SD.prototype.get_locations_by_feature_name = function(feature_name){
	var coord = _.split(feature_name, ',');
	var cx = _.toNumber(coord[0]);
	var cy = _.toNumber(coord[1]);
	
	return _.orderBy(_.filter(this.sd, function(d) {return (d.UTMX == cx && d.UTMY == cy);}), 
					 ['ESPECIE', 'NUCLI_POBLACIONAL'], ['asc', 'asc']);	
};

MANAGE_SD.prototype.get_groupby_method = function(){
	
	var gd = new GRAPHDATA();
	
	_.forOwn(_.countBy(this.sd, 'METODOLOGIA_SEGUIMENT'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('OrRd');
};

MANAGE_SD.prototype.get_groupby_period = function(){
	
	var gd = new GRAPHDATA();
	
	_.forOwn(_.countBy(this.sd, 'PERIODICITAT'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('OrRd');
};

MANAGE_SD.prototype.get_groupby_species_by_protectedarea = function () {
	
	var gd = new GRAPHDATA();
	var p = _.groupBy(this.sd, 'ID_PARC');
	
	_.forEach(_.forOwn(p,function(value,key){
			var k = sefa_config.translates.get_translate(key);
			var v = _.uniqBy(value, 'ESPECIE').length;
			gd.set_graphdata(k,v);
		}));
	return gd.get_graphdata_colorbyvalue('Greens');
};


MANAGE_SD.prototype.get_groupby_locations_by_protectedarea = function () {
	
	var gd = new GRAPHDATA();
	
	_.forOwn(_.countBy(this.sd, 'ID_PARC'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('GnBu');
};

MANAGE_SD.prototype.get_groupby_species_by_protectionlevel = function () {
	var gd = new GRAPHDATA();
	_.forOwn(_.countBy(this.get_groupby_species_by_protectionlevel_list(), 'protection'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('YlGn');
};

MANAGE_SD.prototype.get_groupby_species_by_protectionlevel_list = function () {
	
	var sps_protection = [];
	function SP_P(specie, protection)
	{
		this.sp = specie;
		this.protection = protection;
	}
	
	//A partir de la llista única d'espècies (de totes les localitats) buscar la seva categoria de protecció.
	//És necessari perquè hi ha espècies (en localitats) que no estan al diccionari i cal indicar la seva
	//categoria de protecció per defecte --> EIL
	
	_.forEach(_.uniqBy(this.sd, 'ESPECIE'), function(s){
	
		var t = _.find(sd_tesaurus, function(x){return x.ESPECIE == s.ESPECIE});
		if(_.isUndefined(t))
		{
			//No la trobat, retorno value
			sps_protection.push(new SP_P(s.ESPECIE, 'EIL'));
		}
		else
		{
			sps_protection.push(new SP_P(s.ESPECIE, t.CATEGORIA));
		}
	});
	
	return _.orderBy(sps_protection, ['sp'], ['asc']);
};

MANAGE_SD.prototype.get_groupby_species_by_protectioncatalog = function () {
	var gd = new GRAPHDATA();
	_.forOwn(_.countBy(this.get_groupby_species_by_protectioncatalog_list(), 'protection'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });
	return gd.get_graphdata_colorbyvalue('YlOrBr');
};

MANAGE_SD.prototype.get_groupby_species_by_protectioncatalog_list = function() {
	
	var sps_protection = [];
	function SP_P(specie, protection)
	{
		this.sp = specie;
		this.protection = protection;
	}
	
	//A partir de la llista única d'espècies (de totes les localitats) buscar la seva categoria al Catàleg.
	//És necessari perquè hi ha espècies (en localitats) que no estan al Catàleg i cal indicar la seva
	//categoria per defecte --> No present
	
	_.forEach(_.uniqBy(this.sd, 'ESPECIE'), function(s){
	
		var t = _.find(sd_tesaurus, function(x){return x.ESPECIE == s.ESPECIE});
		if(_.isUndefined(t))
		{
			//No l'ha trobat, retorno value
			sps_protection.push(new SP_P(s.ESPECIE, sefa_config.translates.get_translate('nopresent')));
		}
		else
		{
			//Es troba al Tesaurus, però pot no tenir categoria al CFAC
			if(t.CFAC == '0'){
				sps_protection.push(new SP_P(s.ESPECIE, sefa_config.translates.get_translate('nopresent')));
			}
			else {
				sps_protection.push(new SP_P(s.ESPECIE, sefa_config.translates.get_translate(t.CFAC)));
			}
		}
	});
	
	return _.orderBy(sps_protection, ['sp'], ['asc']);
};

MANAGE_SD.prototype.get_groupby_species_by_protectionlevel_protectioncatalog_list = function () {
	
	var sps_protection = [];
	function SP_P(specie, protectionlevel, protectioncatalog)
	{
		this.sp = specie;
		this.protectionlevel = protectionlevel;
		this.protectioncatalog = protectioncatalog;
	}
	
	//A partir de la llista única d'espècies (de totes les localitats) buscar les seves categories de protecció.
	//És necessari perquè hi ha espècies (en localitats) que no estan al diccionari i cal indicar la seva
	//categoria de protecció per defecte --> EIL + No present
	
	_.forEach(_.uniqBy(this.sd, 'ESPECIE'), function(s){
	
		var t = _.find(sd_tesaurus, function(x){return x.ESPECIE == s.ESPECIE});
		if(_.isUndefined(t))
		{
			//No la trobat, retorno value
			sps_protection.push(new SP_P(s.ESPECIE, 'EIL', sefa_config.translates.get_translate('nopresent')));
		}
		else
		{
			if(t.CFAC == '0'){
				sps_protection.push(new SP_P(s.ESPECIE, t.CATEGORIA, sefa_config.translates.get_translate('nopresent')));
			}
			else {
				sps_protection.push(new SP_P(s.ESPECIE, t.CATEGORIA, sefa_config.translates.get_translate(t.CFAC)));
			}
		}
	});
	return _.orderBy(sps_protection, ['sp'], ['asc']);
};

MANAGE_SD.prototype.get_groupby_protectionlevel_from_tesaurus_list = function () {
	
	//A partir del diccionari d'espècies i nivell de protecció, fer un group by per 'CATEGORIA'
	return _.countBy(sd_tesaurus, 'CATEGORIA');
};

MANAGE_SD.prototype.get_groupby_protectionlevel_from_tesaurus = function () {
	var gd = new GRAPHDATA();
	_.forOwn(this.get_groupby_protectionlevel_from_tesaurus_list(), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });
	return gd.get_graphdata_colorbycategory_invert('RdPu');
};

MANAGE_SD.prototype.get_groupby_protectioncatalog_from_tesaurus_list = function () {
	
	//A partir del diccionari d'espècies i nivell de protecció del catàleg, fer un group by per 'CFAC'
	return _.countBy(sd_tesaurus, 'CFAC');
};

MANAGE_SD.prototype.get_groupby_protectioncatalog_from_tesaurus = function () {
	var gd = new GRAPHDATA();
	_.forOwn(this.get_groupby_protectioncatalog_from_tesaurus_list(), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });
	return gd.get_graphdata_colorbycategory_invert('YlGnBu');
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates_acumulated = function () {

	return this.get_groupby_species_by_tracked_dates_acumulated_list();
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates_acumulated_list = function () {
	
	//A partir de les dades, per a cada espècie, recollir la data mínima i màxima de seguiment.
	var sps_times = [];
	function SP_T(specie, t0, t1)
	{
		this.sp = specie;
		this.t0 = t0;
		this.t1 = t1;
	}
	
	//Només aquelles localitats amb, com a mínim, un cens
	var x  = _.filter(this.sd, function(o) { return o.N_CENSOS; });

	//Agrupar per espècies i determinar la data mínima i máxima dins de cada grup
	_.forEach(_.groupBy(x, 'ESPECIE'), function(w){
			
			//El nom de l'espècie l'agafo del primer element de l'array
			sps_times.push(new SP_T(w[0].ESPECIE,
									(_.minBy(w, function(t){return moment(t.DATA_CENS_FIRST, 'DD-MM-YYYY').valueOf();})).DATA_CENS_FIRST, 
									(_.maxBy(w, function(t){return moment(t.DATA_CENS_LAST, 'DD-MM-YYYY').valueOf();})).DATA_CENS_LAST
									));
			});
	
	return _.orderBy(sps_times, ['sp'], ['asc']); 
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates = function () {

	return this.get_groupby_species_by_tracked_dates_list();
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates_list = function () {
	
	//A partir de les dades, per a cada espècie, recollir les dates de tots els censos.
	//Només aquelles localitats amb, com a mínim, un cens
	return _.filter(this.sd, function(o) { return o.N_CENSOS; });
};

MANAGE_SD.prototype.get_groupby_species_by_num_locations_by_park = function (id_park) {
	return this.get_groupby_species_by_num_locations_list(id_park);
};

MANAGE_SD.prototype.get_groupby_species_by_num_locations = function () {
	return this.get_groupby_species_by_num_locations_list();
};
MANAGE_SD.prototype.get_groupby_species_by_num_locations_list = function (id_park) {
	
	//A partir de les dades, per a cada espècie, comptar el total de localitats i les localitats amb censos
	var sps_locations = [];
	function SP_L(specie, locations_total, locations_census)
	{
		this.sp = specie;
		this.locations_total = locations_total;
		this.locations_census = locations_census;
	}

	if (_.isUndefined(id_park)){r = this.sd;}
	else {r = _.filter(this.sd,function(w){return _.isEqual(w.ID_PARC,id_park)});}

	//Agrupar per espècies i comptar el num. total de localitats i de localitats amb censos.
	_.forEach(_.groupBy(r, 'ESPECIE'), function(w){
				var x = _.countBy(w, function(d){return !d.N_CENSOS?false:true;}).true;
				//El nom de l'espècie l'agafo del primer element de l'array
				sps_locations.push(new SP_L(w[0].ESPECIE,
											w.length,
											_.isUndefined(x)?0:x));
			});
	return _.orderBy(sps_locations, ['sp'], ['asc']);
}; //get_groupby_species_by_num_locations_list

/* ** */
MANAGE_SD.prototype.get_groupby_species_by_num_census = function () {
	return this.get_groupby_species_by_num_census_list();
};
MANAGE_SD.prototype.get_groupby_species_by_num_census_list = function () {
	
	//A partir de les dades, per a cada espècie, comptar el número total de censos
	var sps_census = [];
	function SP_C(specie, census_total)
	{
		this.sp = specie;
		this.census_total = census_total;
	}

	//Agrupar per espècies i comptar el número total de censos
	_.forEach(_.groupBy(this.sd, 'ESPECIE'), function(w){
				var x = _.sumBy(w, 'N_CENSOS');
				//El nom de l'espècie l'agafo del primer element de l'array
				sps_census.push(new SP_C(w[0].ESPECIE,_.sumBy(w, 'N_CENSOS')));
			});

	return _.orderBy(sps_census, ['sp'], ['asc']);
}; //get_groupby_species_by_num_locations_list

MANAGE_SD.prototype.get_protectedarea_species_locations = function ()
{return this.get_protectedarea_species_locations_list();};


MANAGE_SD.prototype.get_protectedarea_species_locations_list = function ()
{
	function ALL_LOCATIONS (protectedarea, p_locations_total, p_locations_accumulated, specie, s_locations_total, s_locations_accumulated)
	{
		this.protectedarea = protectedarea;
		this.p_locations_total = p_locations_total;
		this.p_locations_accumulated = p_locations_accumulated;
		this.specie = specie;
		this.s_locations_total = s_locations_total;
		this.s_locations_accumulated = s_locations_accumulated;
	}
	
	function PSL_SPECIE (specie, locations_total, locations_accumulated)
	{	
		this.specie = specie;
		this.locations_total = locations_total;
		this.locations_accumulated = locations_accumulated;
	}

	function PSL (protectedarea, locations_total, locations_accumulated)
	{
		this.protectedarea = protectedarea;
		this.locations_total = locations_total;
		this.locations_accumulated = locations_accumulated;
		this.species = [];
	}
	
	var tpsl = {psl:[], pasl:[]};
	
	//Unique Species List
	tpsl.species_list = _.orderBy(_.uniqBy(this.sd, 'ESPECIE'), ['ESPECIE'],['asc']);
	
	_.forOwn(_.groupBy(this.sd, 'ID_PARC'),  function(value,key){
			
			//Total locations on ProtectedArea
			var i = tpsl.psl.push(new PSL(key,value.length,0));
			
			//Total locations by species on ProtectedArea
			_.forOwn(_.groupBy(value, 'ESPECIE'), function(value,key){
					tpsl.psl[i-1].species.push(new PSL_SPECIE(key, value.length,0));
			});
		});
	
	//Order By locations_total
	tpsl.psl = _.orderBy(tpsl.psl,['locations_total'],['desc']);
	
	//Order by locations_total on ProtectedArea
	_.forEach(tpsl.psl, function(d){
			d.species = _.orderBy(d.species,['locations_total','specie'],['desc','asc']);
		});
	
	//Accumulated calculate
	_.forEach(tpsl.psl, function(d,i){
			if(i){
				d.locations_accumulated = tpsl.psl[i-1].locations_accumulated + tpsl.psl[i-1].locations_total;
			};
			_.forEach(d.species, function(w,j){
				if(!j){
					w.locations_accumulated = d.locations_accumulated;
				}
				else{
					w.locations_accumulated = d.species[j-1].locations_accumulated + d.species[j-1].locations_total;
				}
			});
		});	
	
	//Flatten Global array
	_.forEach(tpsl.psl, function(d){
			_.forEach(d.species, function(w){
				tpsl.pasl.push(new ALL_LOCATIONS (d.protectedarea, d.locations_total, d.locations_accumulated, w.specie, w.locations_total, w.locations_accumulated));
				});
		});
	
	return tpsl;
};

//THREATS
MANAGE_SD.prototype.get_groupby_threats = function(){
	
	var gd = new GRAPHDATA();
	
	//Selecciono les amenaces, agrupo per paràmetre i calculo el total de VALOR (per cada paràmetre)
	_.forOwn(_.groupBy(_.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Amenaces');}), 'PARAMETRE'),function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key), _.sumBy(value, function(o) {return o.VALOR;}));
					  });

	return gd.get_graphdata_colorbyvalue('BuPu');
};

//IMPACTS
MANAGE_SD.prototype.get_groupby_impacts = function(){
	
	var gd = new GRAPHDATA();
	
	//Selecciono els impactes, agrupo per paràmetre i calculo el total de VALOR (per cada paràmetre)
	_.forOwn(_.groupBy(_.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Impactes');}), 'PARAMETRE'),function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key), _.sumBy(value, function(o) {return o.VALOR;}));
					  });

	return gd.get_graphdata_colorbyvalue('YlGn');
};

MANAGE_SD.prototype.get_impacts_peryear = function(){

	function DY (date,val)
	{
		this.date = date;
		this.val = val;
	};
		
	var g = {rx:[], ry:[], d:[], d_peryear:[], ry_d:[]};
	
	//Selecciono els impactes
	var p = _.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Impactes');});

	//Calculo els rangs de l'eix x,y
	//Mínim x
	g.rx.push(_.minBy(p, function(o){return o.DATA;}).DATA);
	
	//Màxim x
	g.rx.push(_.maxBy(p, function(o){return o.DATA;}).DATA);
	
	//Mínim y
	g.ry.push(_.minBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Màxim y
	g.ry.push(_.maxBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Agrupo per paràmetre
	g.d = _.groupBy(p, 'PARAMETRE');

	//Calculo el total d'impactes per any
	_.forOwn(_.groupBy(p, 'DATA'),function(value, key) {
  						g.d_peryear.push(new DY( _.toInteger(key), _.sumBy(value, function(o) {return o.VALOR;})));
					  });
	//Calculo el mínim/màxim de la Y agrupada per anys
	g.ry_d.push(_.minBy(g.d_peryear, function(o){return o.val;}).val);
	g.ry_d.push(_.maxBy(g.d_peryear, function(o){return o.val;}).val);

	return g;
};

MANAGE_SD.prototype.get_threats_peryear = function(){

	function DY (date,val)
	{
		this.date = date;
		this.val = val;
	};
		
	var g = {rx:[], ry:[], d:[], d_peryear:[], ry_d:[]};
	
	//Selecciono els impactes
	var p = _.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Amenaces');});

	//Calculo els rangs de l'eix x,y
	//Mínim x
	g.rx.push(_.minBy(p, function(o){return o.DATA;}).DATA);
	
	//Màxim x
	g.rx.push(_.maxBy(p, function(o){return o.DATA;}).DATA);
	
	//Mínim y
	g.ry.push(_.minBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Màxim y
	g.ry.push(_.maxBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Agrupo per paràmetre
	g.d = _.groupBy(p, 'PARAMETRE');

	//Calculo el total d'impactes per any
	_.forOwn(_.groupBy(p, 'DATA'),function(value, key) {
  						g.d_peryear.push(new DY( _.toInteger(key), _.sumBy(value, function(o) {return o.VALOR;})));
					  });
	//Calculo el mínim/màxim de la Y agrupada per anys
	g.ry_d.push(_.minBy(g.d_peryear, function(o){return o.val;}).val);
	g.ry_d.push(_.maxBy(g.d_peryear, function(o){return o.val;}).val);

	return g;
};

MANAGE_SD.prototype.get_population_trend = function(){

	var sd = [];
	function SD (park,sp,date,val)
	{
		this.PARK = park;
		this.SP = sp;
		this.DATE = date;
		this.VAL = val;
	};

	//Agrupar per Parc
	_.forOwn(_.groupBy(sd_tendenciapobl, function(w){return _.split(w.IDMOSTREIG,'_')[0]}), function(value,key){
			//Parc
			var p=key;
			//Agrupar per espècie
			_.forOwn(_.groupBy(value, function(w){return _.split(w.IDMOSTREIG,'_')[1]}),function(value,key){
				var sp = key;
				//Total anual
				_.forOwn(_.groupBy(value, function(w){return moment(_.split(w.IDMOSTREIG,'_')[3]).year();}), function(value,key){
					
					sd.push(new SD(p,
					   			   sp,
					   			   _.toInteger(key),
					   			   _.sumBy(value,function(w){return w.N;})));
				});
				
				
			});
		
	});
	return sd;
};

MANAGE_SD.prototype.get_population_trend_by_park = function(id_park){
	
	return _.filter(this.get_population_trend(), function(w){return _.isEqual(w.PARK, id_park)});
};


MANAGE_SD.prototype.get_anual_surveyed_localities = function(){
	
	var s  = {d:[], rx:[], ry:[]};
	function S(year,count){
		this.year = year;
		this.count = count;
	};
	
	_.forOwn(_.groupBy(sd_localitatscensadesany,function(w){return moment(w.DATE,'DD-MM-YYYY').year()}), function(value,key){
			s.d.push(new S(_.toInteger(key),value.length));
		});
	
	s.d = _.orderBy(s.d,'year');
	s.rx = [_.minBy(s.d,function(w){return w.year}).year,_.maxBy(s.d,function(w){return w.year}).year];
	s.ry = [_.minBy(s.d,function(w){return w.count}).count,_.maxBy(s.d,function(w){return w.count}).count];
	
	return s;
};function create_page()
{
	$('#body').append(
		"<div class='container-fluid'>"+

			"<script>function info_toggle(div){$(div).parent().next('div').toggle();}</script>"+
			"<script>function info_button_blur(div){$(div).blur();}</script>"+
			"<style>.info_text{border-color: rgb(221, 221, 221);border-width: 0.5px;border-style: solid;}</style>"+
			"<style>.btn-default{font-size: x-small}</style>"+

			"<div class='row'>"+
				"<div class='col-md-1'>"+
					"<button type='button' class='btn btn-default' onmouseover='info_toggle(this)' onmouseout='info_toggle(this)' onclick='info_button_blur(this)'>"+
					  "Ajuda"+
					"</button>"+
				"</div>"+
				"<div class='info_text' class='col-md-11' style='display:none'>XXX</div>"+
			"</div>"+			


			"<!-- MAPS -->"+
			"<div id='mapa_sefa_localitats_quadricula' class='panel panel-default'>"+
				"<div id='mapa_sefa_localitats_quadricula_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div id='mslq' class='map'></div>"+
				"</div>"+
			"</div>"+

			"<div class='row'>"+
				"<div class='col-md-1'>"+
					"<button type='button' class='btn btn-default' aria-label='Left Align' onmouseover='info_toggle(this)' onmouseout='info_toggle(this)' onclick='info_button_blur(this)'>"+
					  "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span>"+
					"</button>"+
				"</div>"+
				"<div class='info_text' class='col-md-11' style='display:none'>YYY</div>"+
			"</div>"+			


			
			"<!-- GRAPHS -->"+
			"<div id='sefa_graph' class='panel panel-default'>"+
				"<div id='sefa_graph_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_graphs_methods'></div>"+
						"<div id='sefa_graphs_protectedarea'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_protecionlevel'></div>"+
						"<div id='sefa_graphs_species_protectioncatalog'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_period'></div>"+
						"<div id='sefa_graphs_species_protectedarea'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_tracked_by_protectionlevel' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_tracked_by_protectioncatalog' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_tracked_by_tracked_dates_acumulated' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_groupby_species_by_num_locations' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_groupby_species_by_num_locations_by_park' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_groupby_species_by_num_census' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_protectedarea_species_locations' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_threats' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_impacts' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_impacts_year_series' class='col-md-12'></div>"+
						"<div id='sefa_graphs_impacts_year_totals' class='col-md-12'></div>"+
						"<div id='sefa_graphs_impacts_year_series_button_totals' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_threats_year_series' class='col-md-12'></div>"+
						"<div id='sefa_graphs_threats_year_totals' class='col-md-12'></div>"+
						"<div id='sefa_graphs_threats_year_series_button_totals' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_MCO_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_anual_surveyed_localities' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+
			
			"<!-- TABLES -->"+
			"<div id='sefa_tables' class='panel panel-default'>"+
				"<div id='sefa_table_species_by_protectionlevel_list_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_table_species_by_protectionlevel_list'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+

			"<div id='sefa_tables' class='panel panel-default'>"+
				"<div id='sefa_table_species_by_protectioncatalog_list_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_table_species_by_protectioncatalog_list'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+


			"<div id='sefa_tables' class='panel panel-default'>"+
				"<div id='sefa_table_species_by_protectionlevel_protectioncatalog_list_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_table_species_by_protectionlevel_protectioncatalog_list'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+


		"</div>" //container-fluid
	);
}


function SEFA_TABLES() {
}; //Fi de sefa_tables()


SEFA_TABLES.prototype.table_species_by_protectionlevel_list = function() {
	

	//Actualitzo el títol
	$('div#sefa_table_species_by_protectionlevel_list_heading').html('<h1 class="panel-title">'+_.capitalize(sefa_config.translates.get_translate('sefa_table_species_by_protectionlevel_list_heading'))+'</h1>');


	var list = manage_sd.get_groupby_species_by_protectionlevel_list();
	
	//groupBy
	_.forEach(_.sortBy(_.toPairs(_.groupBy(list, 'protection')), function(o){return o[1].length}), function(c){
			$newtable = $('<table/>')
					    .addClass('table')
					    .addClass('table-condensed');
		
			$newtable.append('<thead>'+
				'<tr>'+
					'<th>'+c[0]+'</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>'
			);
			
			_.forEach(c[1], function(q){
				
				$newtable.append('<tr>'+
						'<td class=\'specie\'>'+q.sp+'</td>'+
						'</tr>'
					);
				});

		$newtable.append('</tbody>');
	
		//Afegeixo la taula al DIV
		$newdivtable = $('<div/>')
						.addClass('col-md-3');
							
		$newdivtable.append($newtable);
		$('#sefa_table_species_by_protectionlevel_list').append($newdivtable);
		});
};

SEFA_TABLES.prototype.table_species_by_protectioncatalog_list = function() {
	
	//Actualitzo el títol
	$('div#sefa_table_species_by_protectioncatalog_list_heading').html('<h1 class="panel-title">'+sefa_config.translates.get_translate('sefa_table_species_by_protectioncatalog_list_heading')+'</h1>');
	
	var list = manage_sd.get_groupby_species_by_protectioncatalog_list();
	
	//groupBy
	_.forEach(_.sortBy(_.toPairs(_.groupBy(list, 'protection')), function(o){return o[1].length}), function(c){

			$newtable = $('<table/>')
					    .addClass('table')
					    .addClass('table-condensed');
		
			$newtable.append('<thead>'+
				'<tr>'+
					'<th>'+c[0]+'</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>'
			);
			
			_.forEach(c[1], function(q){
				
				$newtable.append('<tr>'+
						'<td class=\'specie\'>'+q.sp+'</td>'+
						'</tr>'
					);
				});

		$newtable.append('</tbody>');
	
		//Afegeixo la taula al DIV
		$newdivtable = $('<div/>')
						.addClass('col-md-3');
							
		$newdivtable.append($newtable);
		$('#sefa_table_species_by_protectioncatalog_list').append($newdivtable);
		});
};

SEFA_TABLES.prototype.table_species_by_protectionlevel_protectioncatalog_list = function() {
	
	//Actualitzo el títol
	$('div#sefa_table_species_by_protectionlevel_protectioncatalog_list_heading').html('<h1 class="panel-title">'+sefa_config.translates.get_translate('sefa_table_species_by_protectionlevel_protectioncatalog_list_heading')+'</h1>');
	
	var list = manage_sd.get_groupby_species_by_protectionlevel_protectioncatalog_list();
	
	$newtable = $('<table/>')
			    .addClass('table')
			    .addClass('table-condensed')
			    .addClass('table-striped');

	$newtable.append('<thead>'+
		'<tr>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('espècie'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('protecionlevel'))+'</th>'+
			'<th>'+sefa_config.translates.get_translate('protecioncatalog')+'</th>'+
		'</tr>'+
	'</thead>'+
	'<tbody>'
	);

	_.forEach(list, function(q){
		$newtable.append('<tr ' + (q.protectionlevel=='EICP1'?'class=danger': (q.protectionlevel=='EICP2'?'class=warning':  (q.protectionlevel=='EIC'?'class=info':''))  ) +'>'+
				'<td class=\'specie\'>'+q.sp+'</td>'+
				'<td class=\'specie\'>'+q.protectionlevel+'</td>'+
				'<td class=\'specie\'>'+q.protectioncatalog+'</td>'+
				'</tr>'
			);
		});

	$newtable.append('</tbody>');
	
	//Afegeixo la taula al DIV
	$newdivtable = $('<div/>')
					.addClass('col-md-6');
						
	$newdivtable.append($newtable);
	$('#sefa_table_species_by_protectionlevel_protectioncatalog_list').append($newdivtable);
};
// This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
var colorbrewer = {YlGn: {
3: ["#f7fcb9","#addd8e","#31a354"],
4: ["#ffffcc","#c2e699","#78c679","#238443"],
5: ["#ffffcc","#c2e699","#78c679","#31a354","#006837"],
6: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],
7: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
8: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
9: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]
},YlGnBu: {
3: ["#edf8b1","#7fcdbb","#2c7fb8"],
4: ["#ffffcc","#a1dab4","#41b6c4","#225ea8"],
5: ["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],
6: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],
7: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
8: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
9: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
},GnBu: {
3: ["#e0f3db","#a8ddb5","#43a2ca"],
4: ["#f0f9e8","#bae4bc","#7bccc4","#2b8cbe"],
5: ["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"],
6: ["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#43a2ca","#0868ac"],
7: ["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],
8: ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],
9: ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"]
},BuGn: {
3: ["#e5f5f9","#99d8c9","#2ca25f"],
4: ["#edf8fb","#b2e2e2","#66c2a4","#238b45"],
5: ["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],
6: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],
7: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
8: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
9: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]
},PuBuGn: {
3: ["#ece2f0","#a6bddb","#1c9099"],
4: ["#f6eff7","#bdc9e1","#67a9cf","#02818a"],
5: ["#f6eff7","#bdc9e1","#67a9cf","#1c9099","#016c59"],
6: ["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#1c9099","#016c59"],
7: ["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],
8: ["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],
9: ["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"]
},PuBu: {
3: ["#ece7f2","#a6bddb","#2b8cbe"],
4: ["#f1eef6","#bdc9e1","#74a9cf","#0570b0"],
5: ["#f1eef6","#bdc9e1","#74a9cf","#2b8cbe","#045a8d"],
6: ["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#2b8cbe","#045a8d"],
7: ["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],
8: ["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],
9: ["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"]
},BuPu: {
3: ["#e0ecf4","#9ebcda","#8856a7"],
4: ["#edf8fb","#b3cde3","#8c96c6","#88419d"],
5: ["#edf8fb","#b3cde3","#8c96c6","#8856a7","#810f7c"],
6: ["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8856a7","#810f7c"],
7: ["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],
8: ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],
9: ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]
},RdPu: {
3: ["#fde0dd","#fa9fb5","#c51b8a"],
4: ["#feebe2","#fbb4b9","#f768a1","#ae017e"],
5: ["#feebe2","#fbb4b9","#f768a1","#c51b8a","#7a0177"],
6: ["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#c51b8a","#7a0177"],
7: ["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],
8: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],
9: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]
},PuRd: {
3: ["#e7e1ef","#c994c7","#dd1c77"],
4: ["#f1eef6","#d7b5d8","#df65b0","#ce1256"],
5: ["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],
6: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],
7: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
8: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
9: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]
},OrRd: {
3: ["#fee8c8","#fdbb84","#e34a33"],
4: ["#fef0d9","#fdcc8a","#fc8d59","#d7301f"],
5: ["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"],
6: ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"],
7: ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],
8: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],
9: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]
},YlOrRd: {
3: ["#ffeda0","#feb24c","#f03b20"],
4: ["#ffffb2","#fecc5c","#fd8d3c","#e31a1c"],
5: ["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"],
6: ["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],
7: ["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],
8: ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],
9: ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]
},YlOrBr: {
3: ["#fff7bc","#fec44f","#d95f0e"],
4: ["#ffffd4","#fed98e","#fe9929","#cc4c02"],
5: ["#ffffd4","#fed98e","#fe9929","#d95f0e","#993404"],
6: ["#ffffd4","#fee391","#fec44f","#fe9929","#d95f0e","#993404"],
7: ["#ffffd4","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],
8: ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],
9: ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"]
},Purples: {
3: ["#efedf5","#bcbddc","#756bb1"],
4: ["#f2f0f7","#cbc9e2","#9e9ac8","#6a51a3"],
5: ["#f2f0f7","#cbc9e2","#9e9ac8","#756bb1","#54278f"],
6: ["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"],
7: ["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],
8: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],
9: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]
},Blues: {
3: ["#deebf7","#9ecae1","#3182bd"],
4: ["#eff3ff","#bdd7e7","#6baed6","#2171b5"],
5: ["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"],
6: ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],
7: ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
8: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
9: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]
},Greens: {
3: ["#e5f5e0","#a1d99b","#31a354"],
4: ["#edf8e9","#bae4b3","#74c476","#238b45"],
5: ["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"],
6: ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"],
7: ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],
8: ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],
9: ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]
},Oranges: {
3: ["#fee6ce","#fdae6b","#e6550d"],
4: ["#feedde","#fdbe85","#fd8d3c","#d94701"],
5: ["#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"],
6: ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"],
7: ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],
8: ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],
9: ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"]
},Reds: {
3: ["#fee0d2","#fc9272","#de2d26"],
4: ["#fee5d9","#fcae91","#fb6a4a","#cb181d"],
5: ["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],
6: ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"],
7: ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
8: ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
9: ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]
},Greys: {
3: ["#f0f0f0","#bdbdbd","#636363"],
4: ["#f7f7f7","#cccccc","#969696","#525252"],
5: ["#f7f7f7","#cccccc","#969696","#636363","#252525"],
6: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#636363","#252525"],
7: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
8: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
9: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]
},PuOr: {
3: ["#f1a340","#f7f7f7","#998ec3"],
4: ["#e66101","#fdb863","#b2abd2","#5e3c99"],
5: ["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"],
6: ["#b35806","#f1a340","#fee0b6","#d8daeb","#998ec3","#542788"],
7: ["#b35806","#f1a340","#fee0b6","#f7f7f7","#d8daeb","#998ec3","#542788"],
8: ["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"],
9: ["#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788"],
10: ["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],
11: ["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"]
},BrBG: {
3: ["#d8b365","#f5f5f5","#5ab4ac"],
4: ["#a6611a","#dfc27d","#80cdc1","#018571"],
5: ["#a6611a","#dfc27d","#f5f5f5","#80cdc1","#018571"],
6: ["#8c510a","#d8b365","#f6e8c3","#c7eae5","#5ab4ac","#01665e"],
7: ["#8c510a","#d8b365","#f6e8c3","#f5f5f5","#c7eae5","#5ab4ac","#01665e"],
8: ["#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e"],
9: ["#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e"],
10: ["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],
11: ["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"]
},PRGn: {
3: ["#af8dc3","#f7f7f7","#7fbf7b"],
4: ["#7b3294","#c2a5cf","#a6dba0","#008837"],
5: ["#7b3294","#c2a5cf","#f7f7f7","#a6dba0","#008837"],
6: ["#762a83","#af8dc3","#e7d4e8","#d9f0d3","#7fbf7b","#1b7837"],
7: ["#762a83","#af8dc3","#e7d4e8","#f7f7f7","#d9f0d3","#7fbf7b","#1b7837"],
8: ["#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837"],
9: ["#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837"],
10: ["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],
11: ["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"]
},PiYG: {
3: ["#e9a3c9","#f7f7f7","#a1d76a"],
4: ["#d01c8b","#f1b6da","#b8e186","#4dac26"],
5: ["#d01c8b","#f1b6da","#f7f7f7","#b8e186","#4dac26"],
6: ["#c51b7d","#e9a3c9","#fde0ef","#e6f5d0","#a1d76a","#4d9221"],
7: ["#c51b7d","#e9a3c9","#fde0ef","#f7f7f7","#e6f5d0","#a1d76a","#4d9221"],
8: ["#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221"],
9: ["#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221"],
10: ["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],
11: ["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"]
},RdBu: {
3: ["#ef8a62","#f7f7f7","#67a9cf"],
4: ["#ca0020","#f4a582","#92c5de","#0571b0"],
5: ["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"],
6: ["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"],
7: ["#b2182b","#ef8a62","#fddbc7","#f7f7f7","#d1e5f0","#67a9cf","#2166ac"],
8: ["#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac"],
9: ["#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac"],
10: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],
11: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]
},RdGy: {
3: ["#ef8a62","#ffffff","#999999"],
4: ["#ca0020","#f4a582","#bababa","#404040"],
5: ["#ca0020","#f4a582","#ffffff","#bababa","#404040"],
6: ["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"],
7: ["#b2182b","#ef8a62","#fddbc7","#ffffff","#e0e0e0","#999999","#4d4d4d"],
8: ["#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d"],
9: ["#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d"],
10: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],
11: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"]
},RdYlBu: {
3: ["#fc8d59","#ffffbf","#91bfdb"],
4: ["#d7191c","#fdae61","#abd9e9","#2c7bb6"],
5: ["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"],
6: ["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],
7: ["#d73027","#fc8d59","#fee090","#ffffbf","#e0f3f8","#91bfdb","#4575b4"],
8: ["#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4"],
9: ["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"],
10: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],
11: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]
},Spectral: {
3: ["#fc8d59","#ffffbf","#99d594"],
4: ["#d7191c","#fdae61","#abdda4","#2b83ba"],
5: ["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"],
6: ["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"],
7: ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"],
8: ["#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd"],
9: ["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"],
10: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],
11: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]
},RdYlGn: {
3: ["#fc8d59","#ffffbf","#91cf60"],
4: ["#d7191c","#fdae61","#a6d96a","#1a9641"],
5: ["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"],
6: ["#d73027","#fc8d59","#fee08b","#d9ef8b","#91cf60","#1a9850"],
7: ["#d73027","#fc8d59","#fee08b","#ffffbf","#d9ef8b","#91cf60","#1a9850"],
8: ["#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850"],
9: ["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"],
10: ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],
11: ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]
},Accent: {
3: ["#7fc97f","#beaed4","#fdc086"],
4: ["#7fc97f","#beaed4","#fdc086","#ffff99"],
5: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0"],
6: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f"],
7: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17"],
8: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]
},Dark2: {
3: ["#1b9e77","#d95f02","#7570b3"],
4: ["#1b9e77","#d95f02","#7570b3","#e7298a"],
5: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e"],
6: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"],
7: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],
8: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]
},Paired: {
3: ["#a6cee3","#1f78b4","#b2df8a"],
4: ["#a6cee3","#1f78b4","#b2df8a","#33a02c"],
5: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99"],
6: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c"],
7: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f"],
8: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00"],
9: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"],
10: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a"],
11: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99"],
12: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
},Pastel1: {
3: ["#fbb4ae","#b3cde3","#ccebc5"],
4: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4"],
5: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6"],
6: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc"],
7: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd"],
8: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec"],
9: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]
},Pastel2: {
3: ["#b3e2cd","#fdcdac","#cbd5e8"],
4: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4"],
5: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9"],
6: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae"],
7: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc"],
8: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"]
},Set1: {
3: ["#e41a1c","#377eb8","#4daf4a"],
4: ["#e41a1c","#377eb8","#4daf4a","#984ea3"],
5: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"],
6: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33"],
7: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628"],
8: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf"],
9: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]
},Set2: {
3: ["#66c2a5","#fc8d62","#8da0cb"],
4: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3"],
5: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"],
6: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"],
7: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"],
8: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]
},Set3: {
3: ["#8dd3c7","#ffffb3","#bebada"],
4: ["#8dd3c7","#ffffb3","#bebada","#fb8072"],
5: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3"],
6: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462"],
7: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"],
8: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5"],
9: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9"],
10: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd"],
11: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5"],
12: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]
}};//Values of colorbrewer: view colorbrewer.js

function GRAPHCOLOR(n, id_colorbrewer)
{
	this.colorRamp = d3.scale.quantize()
							.domain([0,n])
							.range((_.toPairs(_.pick(colorbrewer, [id_colorbrewer])))[0][1][9]);

	this.colorRamp_invert = d3.scale.quantize()
							.domain([n,0])
							.range((_.toPairs(_.pick(colorbrewer, [id_colorbrewer])))[0][1][9]);

}

GRAPHCOLOR.prototype.get_colorRGB = function(i)
{
	return this.colorRamp(i);
}

GRAPHCOLOR.prototype.get_colorRGB_invert = function(i)
{
	return this.colorRamp_invert(i);
}


/*  ************************************************************************* */
/*  							GRAPHDATA									  */
/*  ************************************************************************* */
function GRAPHDATA()
{
	this.graphdata = [];
};
GRAPHDATA.prototype.get_graphdata_nocolor = function()
{
	return _.orderBy(this.graphdata,['value'],['desc']);
}

GRAPHDATA.prototype.get_graphdata_colorbyvalue = function(id_colorbrewer)
{
	//Pel propi valor
	if(!_.isUndefined(id_colorbrewer))
	{
		var c = new GRAPHCOLOR(_.maxBy(this.graphdata,'value').value, id_colorbrewer);
		_.forEach(this.graphdata, function(g,i){g.color = c.get_colorRGB(g.value);});
	}	
	return _.orderBy(this.graphdata,['value'],['desc']);
}

GRAPHDATA.prototype.get_graphdata_colorbycategory = function(id_colorbrewer)
{
	//Set Color
	//Per número de categories
	
	var x = _.orderBy(this.graphdata,['value'],['desc']);
	
	if(!_.isUndefined(id_colorbrewer))
	{
		var c = new GRAPHCOLOR(this.graphdata.length, id_colorbrewer);
		_.forEach(x, function(g,i){g.color = c.get_colorRGB(i);});
	}
	return x;
}

GRAPHDATA.prototype.get_graphdata_colorbycategory_invert = function(id_colorbrewer)
{
	//Set Color
	//Per número de categories
	
	var x = _.orderBy(this.graphdata,['value'],['desc']);
	
	if(!_.isUndefined(id_colorbrewer))
	{
		var c = new GRAPHCOLOR(this.graphdata.length, id_colorbrewer);
		_.forEach(x, function(g,i){g.color = c.get_colorRGB_invert(i);});
	}
	return x;
}



GRAPHDATA.prototype.set_graphdata = function(label,value)
{
	this.graphdata.push(new GD(label,value));
};

function GD(label,value)
{
	this.label = label;
	this.value = value;
	this.color;
};function GRAPH_SEFA(){};

function get_string_n_total(d)
{
	return ' ('+sefa_config.translates.get_translate('n_total')+_.sumBy(d, function(o) {return o.value;})+')';
};


GRAPH_SEFA.prototype.graph_by_method = function(){
	
	var div = 'sefa_graphs_methods';
	//if(!_.isUndefined(div)){return;}
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_method();
	
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('methods'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');
	return pie;
};

GRAPH_SEFA.prototype.graph_by_period = function(){
	
	var div = 'sefa_graphs_period';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_period();
	
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('periodicity'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');

	return pie;
};

GRAPH_SEFA.prototype.graph_species_by_protectedarea = function() {
	
	var div = 'sefa_graphs_species_protectedarea';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_species_by_protectedarea();

	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('species_by_protectedarea'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');

	return pie;
	
};

GRAPH_SEFA.prototype.graph_locations_by_protectedarea = function() {
	
	var div = 'sefa_graphs_protectedarea';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_locations_by_protectedarea();
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('locations_by_protectedarea'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');
	return pie;
	
};

GRAPH_SEFA.prototype.graph_species_by_protectionlevel = function() {

	var div = 'sefa_graphs_species_protecionlevel';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_species_by_protectionlevel();
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('species_protecionlevel'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');
	return pie;
	
};

GRAPH_SEFA.prototype.graph_species_by_protectioncatalog = function() {

	var div = 'sefa_graphs_species_protectioncatalog';
	if(!$('#'+div).length){return;}
	var d =  manage_sd.get_groupby_species_by_protectioncatalog();
	var defaults = pie_defaults();
	defaults.header.title.text = sefa_config.translates.get_translate('species_protectioncatalog')+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');

	return pie;
	
};

//PIE GRAPH
function graph_pie_template(div, titol, dades)
{	
};
function pie_defaults()
{
return	{
		"header": {
			"title": {
				"text": '',
				"fontSize": 12,
				"font": "open sans"
			},
			"subtitle": {
				"text":"",
				"color":    "#666666",
				"fontSize": 10,
				"font":     "open sans"
			},
			"location": "top-left"
		},
		"size": {
			"canvasWidth": 400,
			"canvasHeight": 300,
			"pieInnerRadius": "50%",
			"pieOuterRadius": "75%"
		},
		"data": {
			"sortOrder": "value-desc",
			"smallSegmentGrouping": {
				"enabled": true,
				"label": sefa_config.translates.get_translate('others'),
			},
			"content": ''
		},
		"labels": {
			"outer": {
				"pieDistance": 32
			},
			"inner": {
				"hideWhenLessThanPercentage": 3
			},
			"mainLabel": {
				"fontSize": 9
			},
			"percentage": {
				"color": "#BDBDBD",
				"decimalPlaces": 0
			},
			"value": {
				"color": "#adadad",
				"fontSize": 10
			},
			"lines": {
				"enabled": true,
				"color": "#424242"
			},
			"truncation": {
				"enabled": true
			}
		},
		"tooltips": {
			"enabled": true,
			"type": "placeholder",
			"string": "{label}: {value}, {percentage}%"
		},
		"effects": {
			"pullOutSegmentOnClick": {
				"effect": "none",
				"speed": 400,
				"size": 8
			}
		},
		"misc": {
			"gradient": {
				"enabled": false,
				"percentage": 100
			}
		}
	};
};

//graph_species_tracked_by_protectionlevel
GRAPH_SEFA.prototype.graph_species_tracked_by_protectionlevel = function() {

	var div = 'sefa_graphs_species_tracked_by_protectionlevel';
	if(!$('#'+div).length){return;}
	
	//Data
	var data_total = manage_sd.get_groupby_protectionlevel_from_tesaurus();
	//Exclude EIL
	var data_tracked = manage_sd.get_groupby_species_by_protectionlevel();
	_.remove(data_tracked, ['label', 'EIL']);

	var abs_width = 400;
	var abs_height = 200;

    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 50},
	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(data_total, function(d) {return d.value;})]);

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.05,0)
			  .domain(_.map(data_total, function(n){return n.label;}));

	//Calculo l'al�ada de la barra del gr�fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Afegir barres amb el total
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', function(d,i){return d.color;})
		.style('fill-opacity', '0.7')
		.style('stroke', function(d,i){return d.color;})
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a m�nim far� 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Total '+d.label+': '+d.value;})
		;		

	//Patro de ratlles
	svg.append('defs')
	  .append('pattern')
	    .attr('id', 'diagonalHatch')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', 4)
	    .attr('height', 4)
	  .append('path')
	    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
	    .attr('stroke', '#000000')
	    .attr('stroke-width', 1);

	//Afegir barres amb el parcial
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_tracked)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', 'url(#diagonalHatch)')
		.style('fill-opacity', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a m�nim far� 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Amb seguiment '+d.label+': '+d.value;})
		;		

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	


	//Afegeixo text amb el % a les barres
	//Format amb el % i un  decimal
	var percent = d3.format('.1%');
	var minim_weight_bar = 30;
	var padding_label = 3;

	//var total_count = _.reduce(data_tracked, function(memo, d){ return memo + d.count; }, 0);

	svg.append('g')
		.attr('id','text_bars')
		.selectAll('text')
		.data(data_tracked)
		.enter()
		.append('text')
		//Posici� del text
		.attr({'x':function(d){return scaleX(d.value)+(scaleX(d.value)<minim_weight_bar?padding_label:padding_label*-1);}, 'y':function(d){return scaleY(d.label)+(bar_height/2);}})
		//A dins o a fora de la barra
		.style('text-anchor', function(d){return scaleX(d.value)<minim_weight_bar?'start':'end';})
		.style('alignment-baseline', 'middle') 
		.style("font-size", "10px")
		.style("font-family", "sans-serif")
		// Make it a little transparent to tone down the black
		.style("opacity", 1)
		// Format the number, calculo el tant per cent sumant tots els valors presents a da
		.text(function(d){return percent((d.value/((_.find(data_total, function(x){return x.label == d.label})).value)));})
		;
		
		//Afegeixo el t�tol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('number'));
		
	//Afegeixo el t�tol del gr�fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left/2) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_species_tracked_by_protectionlevel_title'));		

}; //Fi de graph_species_tracked_by_protectionlevel()

//graph_species_tracked_by_protectionlevel
GRAPH_SEFA.prototype.graph_species_tracked_by_protectioncatalog = function() {

	var div = 'sefa_graphs_species_tracked_by_protectioncatalog';
	if(!$('#'+div).length){return;}
	
	//Data
	var data_total = manage_sd.get_groupby_protectioncatalog_from_tesaurus();
	_.remove(data_total, ['label', sefa_config.translates.get_translate('0')]);

	//Exclude EIL
	var data_tracked = manage_sd.get_groupby_species_by_protectioncatalog();
	_.remove(data_tracked, ['label', sefa_config.translates.get_translate('nopresent')]);

	var abs_width = 400;
	var abs_height = 200;

    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 60},
	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(data_total, function(d) {return d.value;})]);

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.05,0)
			  .domain(_.map(data_total, function(n){return n.label;}));

	//Calculo l'al�ada de la barra del gr�fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Afegir barres amb el total
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', function(d,i){return d.color;})
		.style('fill-opacity', '0.7')
		.style('stroke', function(d,i){return d.color;})
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a m�nim far� 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Total '+d.label+': '+d.value;})
		;		

	//Patro de ratlles
	svg.append('defs')
	  .append('pattern')
	    .attr('id', 'diagonalHatch')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', 4)
	    .attr('height', 4)
	  .append('path')
	    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
	    .attr('stroke', '#000000')
	    .attr('stroke-width', 1)
	    .style("opacity", 0.8);

	//Afegir barres amb el parcial
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_tracked)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', 'url(#diagonalHatch)')
		.style('fill-opacity', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a m�nim far� 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Amb seguiment '+d.label+': '+d.value;})
		;		

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	


	//Afegeixo text amb el % a les barres
	//Format amb el % i un  decimal
	var percent = d3.format('.1%');
	var minim_weight_bar = 31;
	var padding_label = 3;

	//var total_count = _.reduce(data_tracked, function(memo, d){ return memo + d.count; }, 0);

	svg.append('g')
		.attr('id','text_bars')
		.selectAll('text')
		.data(data_tracked)
		.enter()
		.append('text')
		//Posici� del text
		.attr({'x':function(d){return scaleX(d.value)+(scaleX(d.value)<minim_weight_bar?padding_label:padding_label*-1);}, 'y':function(d){return scaleY(d.label)+(bar_height/2);}})
		//A dins o a fora de la barra
		.style('text-anchor', function(d){return scaleX(d.value)<minim_weight_bar?'start':'end';})
		.style('alignment-baseline', 'middle') 
		.style("font-size", "10px")
		.style("font-family", "sans-serif")
		// Make it a little transparent to tone down the black
		.style("opacity", 1)
		// Format the number, calculo el tant per cent sumant tots els valors presents a da
		.text(function(d){return percent((d.value/((_.find(data_total, function(x){return x.label == d.label})).value)));})
		;
		
		//Afegeixo el t�tol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('number'));
		
	//Afegeixo el t�tol del gr�fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left/2) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_species_tracked_by_protectioncatalog_title'));		

}; //Fi de graph_species_tracked_by_protectioncatalog()

//graph_species_tracked_by_tracked_dates_acumulated
GRAPH_SEFA.prototype.graph_species_tracked_by_tracked_dates_acumulated = function() {

	var div = 'sefa_graphs_species_tracked_by_tracked_dates_acumulated';
	if(!$('#'+div).length){return;}
	
	var min_bar_width = 5;
	
	//Data
	var data_total = manage_sd.get_groupby_species_by_tracked_dates_acumulated();
	var data_census = manage_sd.get_groupby_species_by_tracked_dates();
	
    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (data_total.length * 15) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Date
	var scaleX = d3.time.scale()
	          .range([0, width])
	          .domain([
	          			moment((_.minBy(data_total, function(x){return moment(x.t0, 'DD-MM-YYYY').valueOf();})).t0, 'DD-MM-YYYY').toDate(), 
	          			moment((_.maxBy(data_total, function(x){return moment(x.t1, 'DD-MM-YYYY').valueOf();})).t1, 'DD-MM-YYYY').toDate()
	          			])
	          .nice();

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.1,0)
			  .domain(_.map(data_total, function(n){return n.sp;}));

	//Calculo l'al�ada de la barra del gr�fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX
	
	//Afegir bbox de refer�ncia (invisible) amb title
/*
	svg.append('g')
		.attr('id','bbox_reference')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', 'transparent')
		.style('stroke', 'transparent')
		.attr('width',function(d){return scaleX(moment(d.t0,'DD-MM-YYYY').toDate());})
		.append("svg:title")
		.text(function(d) {return d.sp+': '+d.t0+' -> '+d.t1;})
		;		
*/

	//Afegir l�nia de refer�ncia
	svg.append('g')
		.attr('id','line_reference')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('line')
		.attr('x1', 4)
		.attr('y1', function(d){return scaleY(d.sp)+(bar_height/2);})
		.attr('x2', function(d){return (scaleX(moment(d.t0,'DD-MM-YYYY').toDate()))-4;})
		.attr('y2', function(d){return scaleY(d.sp)+(bar_height/2);})
		//.style('stroke', '#31a354')
		.style('stroke', 'transparent')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '4')
		.on('mouseover', function(d,i){d3.select(this).transition().style('stroke', '#31a354');})
		.on('mouseout', function(d,i){d3.select(this).transition().style('stroke', 'transparent');})
		.append("svg:title")
		.text(function(d) {return d.sp+': '+d.t0+' -> '+d.t1;})
		;		

	//Afegir barres amb els totals
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':function(d){return scaleX(moment(d.t0,'DD-MM-YYYY').toDate());},
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', '#a1d99b')
		.style('fill-opacity', '0.7')
		.style('stroke', '#31a354')
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									var dif = scaleX(moment(d.t1,'DD-MM-YYYY').toDate()) - scaleX(moment(d.t0,'DD-MM-YYYY').toDate()); 
									return dif<min_bar_width?min_bar_width:dif;
								}) //Com a m�nim far� min_bar_width d'amplada

		.append("svg:title")
		.text(function(d) {return d.sp+': '+d.t0+' -> '+d.t1;})
		;		


	//Patro de ratlles
	svg.append('defs')
	  .append('pattern')
	    .attr('id', 'diagonalHatch')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', 4)
	    .attr('height', 4)
	  .append('path')
	    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
	    .attr('stroke', '#000000')
	    .attr('stroke-width', 1)
	    .style("opacity", 0.8);

	//Afegir barres amb el parcial
/*
	svg.append('g')
		.attr('id','bars_pattern')
		.selectAll('rect')
		.data(data_census)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':function(d){
										//Si nom�s tinc una data, miro si est� al final del per�ode
										var scaleX_min = scaleX(moment(d.DATA_CENS_FIRST,'DD-MM-YYYY').toDate());
										var scaleX_max = scaleX(moment(d.DATA_CENS_LAST,'DD-MM-YYYY').toDate());
										var dif = scaleX_max - scaleX_min;
										var data_max_limit = _.find(data_total, function(x){return x.sp == d.ESPECIE}).t1;
										var scaleX_max_limit = scaleX(moment(data_max_limit,'DD-MM-YYYY').toDate());
										var data_min_limit = _.find(data_total, function(x){return x.sp == d.ESPECIE}).t0;
										var scaleX_min_limit = scaleX(moment(data_min_limit,'DD-MM-YYYY').toDate());
										var dif_limit = scaleX_max_limit - scaleX_min_limit;
										
										if(dif < min_bar_width)
										{
											//Cas 1
											if(dif_limit < min_bar_width){return scaleX_min;}
											else if(scaleX_min + min_bar_width > scaleX_max_limit){return scaleX_min - (scaleX_min + min_bar_width - scaleX_max_limit);}
											else{return scaleX_min;}
										}
										else{return scaleX_min;}	
									},
					'y':function(d){return scaleY(d.ESPECIE);}
			  })		
	    .style('fill', 'url(#diagonalHatch)')
		.style('fill-opacity', '0.5')
		.attr('width',function(d){
									var dif = scaleX(moment(d.DATA_CENS_LAST,'DD-MM-YYYY').toDate()) - scaleX(moment(d.DATA_CENS_FIRST,'DD-MM-YYYY').toDate()); 
									return dif<min_bar_width?min_bar_width:dif;
								}) //Com a m�nim far� min_bar_width d'amplada

		.append("svg:title")
		.text(function(d) {return d.ESPECIE+': '+d.DATA_CENS_FIRST+' -> '+d.DATA_CENS_LAST;})
		;		
*/

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	
	
	//Afegeixo el t�tol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('date'));
		
	//Afegeixo el t�tol del gr�fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_species_tracked_by_tracked_dates_acumulated_title'));		

}; //Fi de graph_species_tracked_by_tracked_dates_acumulated()

GRAPH_SEFA.prototype.graph_groupby_species_by_num_locations = function() {
	return this.graph_groupby_species_by_num_locations_(manage_sd.get_groupby_species_by_num_locations());
};


GRAPH_SEFA.prototype.graph_groupby_species_by_num_locations_by_park = function() {
	
	_.forEach(manage_sd.get_unique_protected_areas(),function(w){
		
		var div_origin = 'sefa_graphs_groupby_species_by_num_locations_by_park';
		if(!$('#'+div_origin).length){return;}

		var div = 'sefa_graphs_groupby_species_by_num_locations_by_park_'+w;
		$('#'+div_origin).append('<div class="row"><div class="panel panel-default"><div class="panel-heading">'+sefa_config.translates.get_translate(w)+'</div><div id="'+div+'" class="panel-body"></div></div></div>');
		graphs.graph_groupby_species_by_num_locations_(manage_sd.get_groupby_species_by_num_locations_by_park(w),div);
	});
};

GRAPH_SEFA.prototype.graph_groupby_species_by_num_locations_ = function(num_locations,div_) {

	var min_bar_width = 5;
	var div;
	if(!_.isUndefined(div_)){div = div_;}
	else{div = "sefa_graphs_groupby_species_by_num_locations";}
	if(!$('#'+div).length){return;}
		
	//Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (num_locations.length * 15) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Linear
	//L'escala de les X s'ha de calcular sobre el total de totes les esp�cies a tots els parcs!
	//No �s molt �ptim, per� demano manage_sd.get_groupby_species_by_num_locations()
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(manage_sd.get_groupby_species_by_num_locations(), function(d) {return d.locations_total;})])
	          //.domain([0, d3.max(num_locations, function(d) {return d.locations_total;})])
	          .nice();

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.2,0)
			  .domain(_.map(num_locations, function(n){return n.sp;}));

	//Calculo l'al�ada de la barra del gr�fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
				//.ticks(scaleX.domain()[1]-scaleX.domain()[0])
	            .tickFormat(d3.format('d'));
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select("div#"+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Afegir barres amb els totals
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_locations)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', '#fed976')
		.style('fill-opacity', '0.7')
		.style('stroke', '#fed976')
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									var x = scaleX(d.locations_total);
									return x<min_bar_width?min_bar_width:x;
								}) //Com a m�nim far� min_bar_width d'amplada
		;		

	//Afegir barres amb el parcial
	svg.append('g')
		.attr('id','bars_pattern')
		.selectAll('rect')
		.data(num_locations)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })		
	    //.style('fill', 'url(#diagonalHatch)')
		.style('fill', '#e31a1c')
		.style('fill-opacity', '0.7')
		.attr('width',function(d){
									if(d.locations_census){
										var x = scaleX(d.locations_census);
										return x<min_bar_width?min_bar_width:x;
									}
								
								}) //Com a m�nim far� min_bar_width d'amplada
		;		

	//Barres amb el total, transparents
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_locations)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', 'transparent')
		//.style('fill-opacity', '0.7')
		.style('stroke', 'transparent')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									var x = scaleX(d.locations_total);
									return x<min_bar_width?min_bar_width:x;
								}) //Com a m�nim far� min_bar_width d'amplada
		.on('mouseover', function(d,i){d3.select(this).transition().style('stroke', '#000000');})   
		.on('mouseout', function(d,i){d3.select(this).transition().style('stroke', 'transparent');})		
		.append("svg:title")
		.text(function(d) {return d.sp+', '+sefa_config.translates.get_translate('locations')+': '+d.locations_total+', '+sefa_config.translates.get_translate('locations_with_census')+': '+d.locations_census;})
		;		

	//Afegeixo text amb el % a les barres
	//Format amb el % i un  decimal
	var percent = d3.format('.1%');
	var padding_label = 3;

	svg.append('g')
		.attr('id','text_bars')
		.selectAll('text')
		.data(num_locations)
		.enter()
		.append('text')
		//Posici� del text
		.attr({
				'x':function(d){var x = scaleX(d.locations_census);
								return (x<min_bar_width?padding_label:x+padding_label);}, 
				'y':function(d){return scaleY(d.sp)+(bar_height/2);}
				})
		//A dins o a fora de la barra
		//.style('text-anchor', function(d){return scaleX(d.value)<min_bar_width?'start':'end';})
		.style('text-anchor', 'start')
		.style('alignment-baseline', 'middle') 
		.style("font-size", "9px")
		.style("font-family", "sans-serif")
		// Make it a little transparent to tone down the black
		.style("opacity", 1)
		// Format the number, calculo el tant per cent sumant tots els valors presents a da
		.text(function(d){
							var t = d.locations_census/d.locations_total;
							return _.floor(t)?'':percent(t);
					})
		;


	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	
	
	//Afegeixo el t�tol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('locations_number'));
		
	//Afegeixo el t�tol del gr�fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_groupby_species_by_num_locations_title'));		

}; //Fi de graph_groupby_species_by_num_locations()


GRAPH_SEFA.prototype.graph_groupby_species_by_num_census = function() {

	var div = 'sefa_graphs_groupby_species_by_num_census';
	if(!$('#'+div).length){return;}
	var min_bar_width = 5;
	
	//Data
	var num_census = manage_sd.get_groupby_species_by_num_census();
	
    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (num_census.length * 15) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(num_census, function(d) {return d.census_total;})])
	          .nice();

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.2,0)
			  .domain(_.map(num_census, function(n){return n.sp;}));

	//Calculo l'al�ada de la barra del gr�fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Escala de colors
	var c = new GRAPHCOLOR(_.maxBy(num_census,'census_total').census_total, 'YlOrRd');

	//Afegir barres amb els totals
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_census)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
//		.style('fill', '#fed976')
		.style('fill', function(d){return c.get_colorRGB(d.census_total);})
		.style('fill-opacity', '0.9')
		.style('stroke', '#bdbdbd')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '1')
		.attr('width',function(d){
									if(d.census_total){
										var x = scaleX(d.census_total);
										return x<min_bar_width?min_bar_width:x;
									}
								}) //Com a m�nim far� min_bar_width d'amplada
		;		

	//Barres amb el total, transparents
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_census)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', 'transparent')
		//.style('fill-opacity', '0.7')
		.style('stroke', 'transparent')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									if(d.census_total){
										var x = scaleX(d.census_total);
										return x<min_bar_width?min_bar_width:x;
									}
								}) //Com a m�nim far� min_bar_width d'amplada
		.on('mouseover', function(d,i){d3.select(this).transition().style('stroke', '#000000');})   
		.on('mouseout', function(d,i){d3.select(this).transition().style('stroke', 'transparent');})		
		.append("svg:title")
		.text(function(d) {return d.sp+', '+sefa_config.translates.get_translate('n_census')+': '+d.census_total;})
		;		

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis)
		;	
	
	//Afegeixo el t�tol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('n_census'));
		
	//Afegeixo el t�tol del gr�fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_groupby_species_by_num_census_title'));		

}; //Fi de graph_groupby_species_by_num_census()

/* ***** */
GRAPH_SEFA.prototype.graph_protectedarea_species_locations = function() {

	var div = 'sefa_graphs_protectedarea_species_locations';
	if(!$('#'+div).length){return;}
	
	var min_bar_width = 5;
	var protectedarea_width = 10;
	var gap = 5;
	var sp_height = 15;
	
	//Data
	var w = manage_sd.get_protectedarea_species_locations();
	
	//w.species_list
	//w.psl --> protected areas
	//w.pasl --> All locations
	
	
    //Margins
	var margin = {top: 20, right: 25, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (w.species_list.length * sp_height) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, 1]);

	//Escala Y: Ordinal
	var scaleY_sp = d3.scale.ordinal()
	          .rangeBands([0, height],0.2,0)
			  .domain(_.map(w.species_list, function(n){return n.ESPECIE;}));

	var scaleY_pa = d3.scale.linear()
	          .range([0, height])
	          //.domain([0, d3.max(w.psl, function(d) {return d.locations_accumulated;})])
			  .domain([0, (d3.max(w.psl, function(d) {return d.locations_accumulated;}))+(_.last(w.psl)).locations_total])
			  ;	



	//Calculo l'al�ada de la barra del gr�fic, com una unitat de l'escala
	var bar_height_sp = scaleY_sp.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY_sp)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Escala de colors
	var c = new GRAPHCOLOR(w.psl.length, 'Spectral');

	//*******************************
	//Barres dels parcs naturals
	//*******************************
	svg.append('g')
		.attr('id','bars_pa')
		.selectAll('rect')
		.data(w.psl)
		.enter()
		.append('rect')
		.attr('height',function(d){return scaleY_pa(d.locations_total)})
		.attr({
					'x':scaleX(1)-protectedarea_width,
					'y':function(d){return scaleY_pa(d.locations_accumulated);}
			  })
		.style('fill', function(d,i){return c.get_colorRGB(i);})
		.style('fill-opacity', '0.9')
		.style('stroke', 'black')
		.style('stroke-opacity', '0.9')
		.style('stroke-width', '1')
		.attr('width',protectedarea_width) //Com a m�nim far� min_bar_width d'amplada

		.on('mouseover', function(d,i){
										//PARCS
										//Esborrar les barres de tots els parcs
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.select(this).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										
										//FLUXES
										//Esborrar tots els fluxes
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//Il�luminar nom�s els fluxes d'aquest parc natural
										d3.selectAll('#fluxes path').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);

										//Etiquetes esp�cies
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0.9);
										_.forEach(d.species, function(o){
												d3.selectAll('#bars_species rect').filter(function(r){return r.ESPECIE == o.specie;}).transition().style('fill-opacity', 0);
											});

										//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 1);
									  })
									  
		.on('mouseout', function(d,i){
										//PARCS
										//Tornar a l'estat inicial
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);

									 })
		;		

	//Etiquetes dels Parcs
	svg.append('g')
		.attr('id','protectedareas_labels')
		.selectAll('text')
		.data(w.psl)
		.enter()
		.append('text')
		.attr({
					'x':scaleX(1)+gap,
					'y':function(d){return (scaleY_pa(d.locations_accumulated)+(scaleY_pa(d.locations_total)/2));}
			  })
		.text( function (d) { return d.protectedarea; })
		.style('font-family', 'sans-serif')
		.style('font-size', '8px')
		.style('fill', 'black')
		.style('fill-opacity', '1')
		;	

	//Rectangles sobre les etiquetes dels parcs
	svg.append('g')
		.attr('id','bars_pa_labels')
		.selectAll('rect')
		.data(w.psl)
		.enter()
		.append('rect')
		.attr('height',function(d){return scaleY_pa(d.locations_total)})
		.attr({
					'x':scaleX(1),
					'y':function(d){return scaleY_pa(d.locations_accumulated);}
			  })
		.style('fill', 'white')
		.style('fill-opacity', '0')
		.style('stroke', 'none')
		//.style('stroke-opacity', '0')
		//.style('stroke-width', '1')
		.attr('width',margin.right)

		.on('mouseover', function(d,i){
										//PARCS
										//Esborrar les barres de tots els parcs
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//d3.select(this).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_pa rect').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);										
										//FLUXES
										//Esborrar tots els fluxes
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//Il�luminar nom�s els fluxes d'aquest parc natural
										d3.selectAll('#fluxes path').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);

										//Etiquetes esp�cies
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0.9);
										_.forEach(d.species, function(o){
												d3.selectAll('#bars_species rect').filter(function(r){return r.ESPECIE == o.specie;}).transition().style('fill-opacity', 0);
											});

										//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 1);
									  })
									  
		.on('mouseout', function(d,i){
										//PARCS
										//Tornar a l'estat inicial
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);

									 })
		;		
	

	//Afegir eix Y - Esp�cies
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis)
		;	


	//* **********************
	// Rectangles sobre les etiquetes de les esp�cies
	//* **********************
	svg.append('g')
		.attr('id','bars_species')
		.selectAll('rect')
		.data(w.species_list)
		.enter()
		.append('rect')
		.attr('height',bar_height_sp)
		.attr({
					'x':scaleX(0)-margin.left,
					'y':function(d){return scaleY_sp(d.ESPECIE);}
			  })
		.style('fill', 'white')
		.style('fill-opacity', 0)
		.style('stroke', 'none')
		//.style('stroke-opacity', '0.9')
		//.style('stroke-width', '1')
		.attr('width',margin.left-gap)

		.on('mouseover', function(d,i){
										//FLUXES
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//Il�luminar nom�s els fluxes d'aquesta esp�cie
										d3.selectAll('#fluxes path').filter(function(r){return r.specie == d.ESPECIE;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);

										//ETIQUETES
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0.9);
										d3.select(this).transition().style('fill-opacity', 0);
										
										//PARCS
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.selectAll('#bars_pa rect').filter(function(r){
															var q = _.find(r.species, function(i){return i.specie == d.ESPECIE});
															return _.isUndefined(q)?false:true;
													}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
									  
									  	//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){
															var q = _.find(r.species, function(i){return i.specie == d.ESPECIE});
															return _.isUndefined(q)?false:true;
													}).transition().style('fill-opacity', 1);										
									  })
									  
		.on('mouseout', function(d,i){
										//Tornar a l'estat inicial
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);
									 })
		;

	//********************
	//Path de fluxes
	//********************
	var poly = function(d){
		var xy0 = {'x':(scaleX(1)-protectedarea_width-gap), 'y':(scaleY_pa(d.s_locations_accumulated))};
		var xy1 = {'x':(scaleX(0)+gap), 'y':(scaleY_sp(d.specie))};
		var xy2 = {'x':(scaleX(0)+gap) ,'y':(scaleY_sp(d.specie)+(bar_height_sp))};
		var xy3 = {'x':(scaleX(1)-protectedarea_width-gap) ,'y':(scaleY_pa(d.s_locations_accumulated+d.s_locations_total))};
	
		var i = 'M '+xy0.x+' '+xy0.y+' ';
		var f= 'Z';
		var s0 = 'L '+xy2.x+' '+xy2.y+' ';
	
	//	var randomX = _.random(0.2, 0.8, true);
		var randomX = 0.3;
	
		//https://www.dashingd3js.com/svg-paths-and-d3js
		var curve_d1 = function(x1,y1){
			
			var xp = scaleX(randomX);
			var yp = y1;
			
			return 'Q '+xp+' '+yp+' '+x1+' '+y1+' ';
		};
	
		var curve_d2 = function(x0,y0,x1,y1){
			
			var xp = scaleX(randomX);
			var yp = y0;
			
			return 'Q '+xp+' '+yp+' '+x1+' '+y1+' ';
		};
		var d1 = curve_d1(xy1.x,xy1.y);
		var d2 = curve_d2(xy2.x,xy2.y,xy3.x,xy3.y);
		return i+d1+s0+d2+f;
	};
	svg.append('g')
		.attr('id','fluxes')
		.selectAll('rect')
		.data(w.pasl)
		.enter()
		.append('path')
		.attr('d', function(d){return poly(d);})
		.style('stroke', '#bdbdbd')
		.style('stroke-opacity', 0.9)
		.style('stroke-width', 0.5)
		.style('fill',function(d){return c.get_colorRGB(_.findIndex(w.psl, function(o){return d.protectedarea == o.protectedarea;}));})
		.style('fill-opacity', 0.5)

		.on('mouseover', function(d,i){
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.select(this).transition().style('fill-opacity', 0.9);
										
										//ETIQUETES
										d3.selectAll('#bars_species rect').filter(function(r){return !(r.ESPECIE == d.specie);}).transition().style('fill-opacity', 0.9);

										//PARCS
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.selectAll('#bars_pa rect').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.2);

										//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 1);
									  })
									  
		.on('mouseout', function(d,i){
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);
									 })
		;		

	//Afegeixo el t�tol del gr�fic

	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_locations_species_protectedarea'));		

}; //Fi de graph_protectedarea_species_locations()



// THREATS
GRAPH_SEFA.prototype.graph_by_threats = function(){
	
	var div = 'sefa_graphs_threats';
	if(!$('#'+div).length){return;}
	var width = 500;
	var height = 300;
	var d = manage_sd.get_groupby_threats();
	var n_total = ' ('+sefa_config.translates.get_translate('n_total')+_.sumBy(d, function(o) {return o.value;})+')';
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('threats'))+n_total;
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	defaults.size.pieInnerRadius='25%';
	defaults.size.canvasWidth = width;
	defaults.size.canvasHeight = height;	
	
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+width+'px;'+'height:'+height+'px;');
	return pie;
};


// IMPACTS
GRAPH_SEFA.prototype.graph_by_impacts = function(){
	
	var div = 'sefa_graphs_impacts';
	if(!$('#'+div).length){return;}
	var width = 500;
	var height = 300;
	var d = manage_sd.get_groupby_impacts();
	var n_total = ' ('+sefa_config.translates.get_translate('n_total')+_.sumBy(d, function(o) {return o.value;})+')';
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('impacts'))+n_total;
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	defaults.size.pieInnerRadius='25%';
	defaults.size.canvasWidth = width;
	defaults.size.canvasHeight = height;	
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+width+'px;'+'height:'+height+'px;');
	return pie;
};

GRAPH_SEFA.prototype.graph_by_impacts_year_series = function(){
	
	var div = 'sefa_graphs_impacts_year_series';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_impacts_peryear();

	/* ************************************************************** */
    //Legend width
    var legend_width = 150;
    
    //Margins
	var margin = {top: 20, right: legend_width, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;
	
	//padding a l'eix de les X
	var padding=10;

	//Llegenda
	legend_line_length = legend_width*0.50;
	legend_line_v_gap = 25;
	legend_line_h_gap = 10;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain(d.ry);

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_impacts_year_series')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Dibuixar les l�nies de les s�ries
	var line = d3.svg.line()
    .x(function(u) { return scaleX(u.DATA); })
    .y(function(u) { return scaleY(u.VALOR); })
    ;

	//Escala de colors
	var c = new GRAPHCOLOR(_.keys(d.d).length, 'Spectral');
	
	var lines_transitions = {stroke_width_normal:2,
					  		stroke_width_selected:4,
					  		stroke_width_notselected:0.5,
					  		stroke_opacity_normal:0.8,
					  		stroke_opacity_selected:0.9,
					  		stroke_opacity_notselected:0.1
					  		};

	var circles_transitions = {					  			
						  		stroke_opacity_normal:0.8,
						  		stroke_opacity_selected:1,
						  		stroke_opacity_notselected:0.3,
						  		
						  		fill_opacity_normal:0.5,
						  		fill_opacity_selected:0.9,
						  		fill_opacity_notselected:0.1,
					  			
					  			radius_normal: '3px',
					  			radius_selected: '5px',
					  			radius_notselected: '1px'
					  			
					  		};

	//Escala Y per la llegenda: linear
	var scaleY_legend = d3.scale.linear()
	          .range([0, legend_line_v_gap*(_.keys(d.d)).length])
	          .domain([0,(_.keys(d.d)).length]);

	_.forOwn(d.d,function(value, key) 
	{
		//index del key a l'array
		var ii = _.indexOf(_.keys(d.d),key);
		var color = c.get_colorRGB(ii);
		var text_label = sefa_config.translates.get_translate(key);
		
		//Dibuixo la l�nia
		svg.append('path')
			.attr('id','linies_impacts'+ii)
			.attr('d', line(value))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)

			.on('mouseover', function(d,i){
											//LINIES, Esborrar totes les altres l�nies i seleccionada l'escollida
											//Seleccions especials amb selectAll: http://codepen.io/AlexBezuska/pen/EtDJe
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select(this).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
										  
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_impact'+ii).transition().style('fill-opacity',0);

										  	//CERCLES
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_impacts'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0);

										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
			.append("svg:title")
			.text(text_label)
			;
			//M�s styles a: http://www.d3noob.org/2014/02/styles-in-d3js.html

		//Dibuixo un punt a cada v�rtex de la l�nia
		_.forEach(value, function(w){
			svg.append('circle')
				.attr('id','punts_impacts'+ii)
				.attr('cx', scaleX(w.DATA))           // position the x-centre
				.attr('cy', scaleY(w.VALOR))           // position the y-centre
				.attr('r', circles_transitions.radius_normal)             // set the radius
				.style('fill', color)     // set the fill colour*/
				.style('fill-opacity',circles_transitions.fill_opacity_normal)
				.style('stroke', color)
				.style('stroke-width', '0.5px')
				.style('stroke-opacity',circles_transitions.stroke_opacity_normal)
				.on('mouseover', function(d,i){
												//LINIES, Esborrar totes les altres l�nies i seleccionada l'escollida
												d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
												d3.select('path#linies_impacts'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
												                            .style('stroke-width', lines_transitions.stroke_width_selected);
												//BBOX
												d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0.9);
												d3.select('#legend_box_impact'+ii).transition().style('fill-opacity',0);
											  
											  	//CERCLES
												d3.selectAll('[id*="punts_impacts"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_notselected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
													.attr('r', circles_transitions.radius_notselected);
	
												d3.selectAll('circle#punts_impacts'+ii).transition()
													.style('fill-opacity', circles_transitions.fill_opacity_selected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
													.attr('r', circles_transitions.radius_selected);
											  })
											  
				.on('mouseout', function(d,i){
												//LINIES, Tornar a l'estat inicial
												d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);

												//BBOX
												d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0);
											 
											 	//CERCLES, Tornar a l'estat inicial
												d3.selectAll('[id*="punts_impacts"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_normal)
													.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
													.attr('r', circles_transitions.radius_normal);
											 })

				.append("svg:title")
				.text(function(d) {return sefa_config.translates.get_translate('n_total')+w.VALOR;})
				;
		});

		//Llegenda
		svg.append('line')
			.attr('id','legend_line_impact'+ii)
			.attr('x1', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y1', scaleY_legend(ii))
			.attr('x2', scaleX(d.rx[1])+legend_line_h_gap+legend_line_length)
			.attr('y2', scaleY_legend(ii))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			;
			
		svg.append('text')
			.attr('id','legend_text_impact'+ii)
			.style('text-anchor', 'start')
			.style('alignment-baseline', 'middle') 
			.style('font-size', '8px')
			.style('font-family', 'sans-serif')
			.text(text_label)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii)+lines_transitions.stroke_width_normal*4)
			;		

		svg.append('rect')
			.attr('id','legend_box_impact'+ii)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii))
			.attr('width', legend_width-legend_line_h_gap)
			.attr('height', legend_line_v_gap)
			.style('fill', 'white')
			.style('fill-opacity', '0')
			.style('stroke', 'none')
			.on('mouseover', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_impact'+ii).transition().style('fill-opacity',0);

											//LINIES, Esborrar totes les altres l�nies i seleccionada l'escollida
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select('path#linies_impacts'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
										  
										  	//CERCLES
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_impacts'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0);

											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
			;
	});

	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('impacts_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;

};

GRAPH_SEFA.prototype.graph_by_impacts_year_totals = function(){
	
	var div = 'sefa_graphs_impacts_year_totals';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_impacts_peryear();

	/* ************************************************************** */
    //Margins
	var margin = {top: 20, right: 25, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	var padding = 25;
	var width_bar = 50;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width-padding])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain([0,d.ry_d[1]])
	          .nice();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_impacts_year_totals')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Escala de colors
	var c = new GRAPHCOLOR(d.d_peryear.length, 'Spectral');

	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(d.d_peryear)
		.enter()
		.append('rect')
		.attr('height',function(h){return height-scaleY(h.val);})
		.attr('width',width_bar)
		.attr({'x':function(w){return scaleX(w.date)-(width_bar/2)},'y':function(r){return scaleY(r.val);}})
		.style('fill', function(d,i){return c.get_colorRGB(i);})
		.style('fill-opacity', '0.5')
		.style('stroke', function(d,i){return c.get_colorRGB(i);})
		.style('stroke-opacity', '1')
		.style('stroke-width', '1')
		.append("svg:title")
		.text(function(d) {return d.date+'\n'+sefa_config.translates.get_translate('n_total')+d.val;})
		;		
		
	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('impacts_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)-padding) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;
};

GRAPH_SEFA.prototype.graph_by_impacts_histo = function(){

	$('#sefa_graphs_impacts_year_totals').toggle();

	this.graph_by_impacts_year_series();
	this.graph_by_impacts_year_totals();
	
	//Bot� per mostrar els totals per cada any (es modifica l'escala y i es dibuixa un histograma
	$('#sefa_graphs_impacts_year_series_button_totals').append('<div class="checkbox"><label><input id="check_graphs_impacts_year_series_button_totals" type="checkbox" value="">'+sefa_config.translates.get_translate('total_for_year')+'</label></div>');
	$('#check_graphs_impacts_year_series_button_totals').change(function() {
		
		if(this.checked) {
        	
        	$('#sefa_graphs_impacts_year_series').toggle('slow');
        	$('#sefa_graphs_impacts_year_totals').toggle('slow');
	   	}
    	else{
        	$('#sefa_graphs_impacts_year_series').toggle('slow');
        	$('#sefa_graphs_impacts_year_totals').toggle('slow');
    	}
	});	
};

GRAPH_SEFA.prototype.graph_by_threats_year_series = function(){
	
	var div = 'sefa_graphs_threats_year_series';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_threats_peryear();

	/* ************************************************************** */
 	//Legend width
    var legend_width = 150;
    
    //Margins
	var margin = {top: 20, right: legend_width, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;
	
	//padding a l'eix de les X
	var padding=10;

	//Llegenda
	legend_line_length = legend_width*0.50;
	legend_line_v_gap = 25;
	legend_line_h_gap = 10;

	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain(d.ry);

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_threats_year_series')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Dibuixar les l�nies de les s�ries
	var line = d3.svg.line()
    .x(function(u) { return scaleX(u.DATA); })
    .y(function(u) { return scaleY(u.VALOR); })
    ;

	//Escala de colors
	var c = new GRAPHCOLOR(_.keys(d.d).length, 'Spectral');
	
	var lines_transitions = {stroke_width_normal:2,
					  		stroke_width_selected:4,
					  		stroke_width_notselected:0.5,
					  		stroke_opacity_normal:0.8,
					  		stroke_opacity_selected:0.9,
					  		stroke_opacity_notselected:0.1
					  		};

	var circles_transitions = {					  			
						  		stroke_opacity_normal:0.8,
						  		stroke_opacity_selected:1,
						  		stroke_opacity_notselected:0.3,
						  		
						  		fill_opacity_normal:0.5,
						  		fill_opacity_selected:0.9,
						  		fill_opacity_notselected:0.1,
					  			
					  			radius_normal: '3px',
					  			radius_selected: '5px',
					  			radius_notselected: '1px'
					  			
					  		};

	//Escala Y per la llegenda: linear
	var scaleY_legend = d3.scale.linear()
	          .range([0, legend_line_v_gap*(_.keys(d.d)).length])
	          .domain([0,(_.keys(d.d)).length]);
	
	_.forOwn(d.d,function(value, key) 
	{
		//index del key a l'array
		var ii = _.indexOf(_.keys(d.d),key);
		var color = c.get_colorRGB(ii);
		var text_label = sefa_config.translates.get_translate(key);
		
		//Dibuixo la l�nia
		svg.append('path')
			.attr('id','linies_threats'+ii)
			.attr('d', line(value))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)
			//.style("stroke-linecap", "round")
			//.style("stroke-dasharray", ("10,3"))
			//.style("fill-opacity", .2
			//.style("stroke-opacity", .2)

			.on('mouseover', function(d,i){
											//LINIES, Esborrar totes les altres l�nies i seleccionada l'escollida
											//Seleccions especials amb selectAll: http://codepen.io/AlexBezuska/pen/EtDJe
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select(this).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_threats'+ii).transition().style('fill-opacity',0);

										  	//CERCLES
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_threats'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0);

										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
			.append("svg:title")
			.text(text_label)
			;
			//M�s styles a: http://www.d3noob.org/2014/02/styles-in-d3js.html

		//Dibuixo un punt a cada v�rtex de la l�nia
		_.forEach(value, function(w){
			svg.append('circle')
				.attr('id','punts_threats'+ii)
				.attr('cx', scaleX(w.DATA))           // position the x-centre
				.attr('cy', scaleY(w.VALOR))           // position the y-centre
				.attr('r', circles_transitions.radius_normal)             // set the radius
				.style('fill', color)     // set the fill colour*/
				.style('fill-opacity',circles_transitions.fill_opacity_normal)
				.style('stroke', color)
				.style('stroke-width', '0.5px')
				.style('stroke-opacity',circles_transitions.stroke_opacity_normal)
				.on('mouseover', function(d,i){
												//LINIES, Esborrar totes les altres l�nies i seleccionada l'escollida
												d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
												d3.select('path#linies_threats'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
												                            .style('stroke-width', lines_transitions.stroke_width_selected);
												//BBOX
												d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0.9);
												d3.select('#legend_box_threats'+ii).transition().style('fill-opacity',0);

											  	//CERCLES
												d3.selectAll('[id*="punts_threats"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_notselected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
													.attr('r', circles_transitions.radius_notselected);
	
												d3.selectAll('circle#punts_threats'+ii).transition()
													.style('fill-opacity', circles_transitions.fill_opacity_selected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
													.attr('r', circles_transitions.radius_selected);
											  })
											  
				.on('mouseout', function(d,i){
												//LINIES, Tornar a l'estat inicial
												d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
											 
												//BBOX
												d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0);

											 	//CERCLES, Tornar a l'estat inicial
												d3.selectAll('[id*="punts_threats"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_normal)
													.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
													.attr('r', circles_transitions.radius_normal);
											 })

				.append("svg:title")
				.text(function(d) {return sefa_config.translates.get_translate('n_total')+w.VALOR;})
				;
			});
		//Llegenda
		svg.append('line')
			.attr('id','legend_line_threats'+ii)
			.attr('x1', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y1', scaleY_legend(ii))
			.attr('x2', scaleX(d.rx[1])+legend_line_h_gap+legend_line_length)
			.attr('y2', scaleY_legend(ii))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			;
			
		svg.append('text')
			.attr('id','legend_text_threats'+ii)
			.style('text-anchor', 'start')
			.style('alignment-baseline', 'middle') 
			.style('font-size', '8px')
			.style('font-family', 'sans-serif')
			.text(text_label)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii)+lines_transitions.stroke_width_normal*4)
			;		

		svg.append('rect')
			.attr('id','legend_box_threats'+ii)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii))
			.attr('width', legend_width-legend_line_h_gap)
			.attr('height', legend_line_v_gap)
			.style('fill', 'white')
			.style('fill-opacity', '0')
			.style('stroke', 'none')
			.on('mouseover', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_threats'+ii).transition().style('fill-opacity',0);

											//LINIES, Esborrar totes les altres l�nies i seleccionada l'escollida
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select('path#linies_threats'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
										  
										  	//CERCLES
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_threats'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0);

											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
	});

	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('threats_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;

};

GRAPH_SEFA.prototype.graph_by_threats_year_totals = function(){
	
	var div = 'sefa_graphs_threats_year_totals';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_threats_peryear();

	/* ************************************************************** */
    //Margins
	var margin = {top: 20, right: 25, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	var padding = 15;
	var width_bar = padding*2;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width-padding])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain([0,d.ry_d[1]])
	          .nice();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_threats_year_totals')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Escala de colors
	var c = new GRAPHCOLOR(d.d_peryear.length, 'Spectral');

	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(d.d_peryear)
		.enter()
		.append('rect')
		.attr('height',function(h){return height-scaleY(h.val);})
		.attr('width',width_bar)
		.attr({'x':function(w){return scaleX(w.date)-(width_bar/2)},'y':function(r){return scaleY(r.val);}})
		.style('fill', function(d,i){return c.get_colorRGB(i);})
		.style('fill-opacity', '0.5')
		.style('stroke', function(d,i){return c.get_colorRGB(i);})
		.style('stroke-opacity', '1')
		.style('stroke-width', '1')
		.append("svg:title")
		.text(function(d) {return d.date+'\n'+sefa_config.translates.get_translate('n_total')+d.val;})
		;		
		
	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('threats_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)-padding) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;
};

GRAPH_SEFA.prototype.graph_by_threats_histo = function(){

	$('#sefa_graphs_threats_year_totals').toggle();

	this.graph_by_threats_year_series();
	this.graph_by_threats_year_totals();
	
	//Bot� per mostrar els totals per cada any (es modifica l'escala y i es dibuixa un histograma
	$('#sefa_graphs_threats_year_series_button_totals').append('<div class="checkbox"><label><input id="check_graphs_threats_year_series_button_totals" type="checkbox" value="">'+sefa_config.translates.get_translate('total_for_year')+'</label></div>');
	$('#check_graphs_threats_year_series_button_totals').change(function() {
		
		if(this.checked) {
        	
        	$('#sefa_graphs_threats_year_series').toggle('slow');
        	$('#sefa_graphs_threats_year_totals').toggle('slow');
	   	}
    	else{
        	$('#sefa_graphs_threats_year_series').toggle('slow');
        	$('#sefa_graphs_threats_year_totals').toggle('slow');
    	}
	});	
};

GRAPH_SEFA.prototype.graph_by_population_trend_by_park = function(id_park,species_trend,defaults){
	
	var factor_escala_1 = defaults.factor_escala_1;
	var factor_escala_2 = defaults.factor_escala_2;

    //Margins
	var margin = defaults.margin;
	//Absolute
	var abs_height = defaults.abs_height;
	var abs_width = defaults.abs_width;
	var width = defaults.width;
	var height = defaults.height;

	var scaleX = defaults.scaleX;

	var s_park = id_park;
	var s_div = 'sefa_graphs_population_trend_'+s_park;

	var v = species_trend;

	//Bucle per a totes les esp�cies dins del parc
	_.forEach(_.uniqBy(v, function(w){return w.SP;}), function(vv){
	
		var s_sp = vv.SP;
		s_div_sp = s_div+'_'+s_sp;
		$('#'+s_div).append('<div id="'+s_div_sp+'" class="col-md-6"></div>');
			
		//De totes les dades, seleccionar per park i esp�cie
		var r = _.filter(v, function(w){return _.isEqual(w.SP, vv.SP)});

		//Gr�fic d'una esp�cie
		//Escala Y: linear, pr�pia per a cada gr�fica
		var scaleY = d3.scale.linear()
			.range([height, 0])
			.domain([0,_.maxBy(r,function(w){return w.VAL;}).VAL*factor_escala_1])
			.nice()
			;
		
		//Si nom�s tinc una data per esp�cie, ajusto l'eix de les Y
		if(r.length<2)
		{
			scaleY.domain([0,(_.maxBy(r,function(w){return w.VAL;}).VAL)*factor_escala_2]);
		}

		//Eix X
		var xAxis = d3.svg.axis()
		            .scale(scaleX)
		            .orient("bottom")
		            .tickFormat(d3.format('d'))
		            //.tickPadding(10)
		            ;
		//Eix Y
		var yAxis = d3.svg.axis()
		            .scale(scaleY)
		            .orient("left")
		            //.innerTickSize(0)
		            //.outerTickSize(0)
		            .ticks(4)
		            .tickFormat(d3.format('d'))
		            ;
		//Objecte grafic
		var svg = d3.select('div#'+s_div_sp).append("svg")
			.attr('id',s_div+'_'+s_sp)
		    .style('width', width + margin.left + margin.right+'px')
		    .style('height', height + margin.top + margin.bottom+'px')
		    .attr('class', 'img-responsive')
			.append('g')
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//ClipPath per evitar que les l�nies de regressi� surtin del CANVAS
		svg.append('clipPath')
			.attr('id', 'rect-clip')
			.append('rect')
				.attr('x', scaleX(scaleX.domain()[0]))
				.attr('y', scaleY(scaleY.domain()[1]))
				.attr('width', scaleX(scaleX.domain()[1])-scaleX(scaleX.domain()[0]))
				.attr('height', scaleY(scaleY.domain()[0])-scaleY(scaleY.domain()[1]))
				.style('stroke', 'red')
				.style('fill', 'black')
			;

		//Dibuixar les l�nies de les s�ries
		var line = d3.svg.line()
		    .x(function(u){return scaleX(u.DATE);})
		    .y(function(u){return scaleY(u.VAL);})
	    ;

		//Si tenim m�s dues dates, dibuixo una l�nia
		if(r.length>1){
			//Dibuixo la l�nia
			svg.append('path')
				.attr('d', line(r))
				.style('fill', 'none')
				.style('stroke', 'black')
				.style('stroke-width', 1)
				.style('stroke-opacity', 1)
				;
		}

		//V�rtexs de les l�nies
		_.forEach(r, function(w){
			svg.append('circle')
				.attr('cx', scaleX(w.DATE))
				.attr('cy', scaleY(w.VAL))
				.attr('r', 3)
				.style('fill', 'black')
				.style('fill-opacity',1)
				.append('svg:title')
				.text(sefa_config.translates.get_translate('n_total')+w.VAL+' ('+w.DATE+')')
				;
		});
		
		//Afegir la l�nia de regressi�, nom�s si tenim m�s de 2 punts
		if(r.length>2){
			var lrxy = [];
			_.forEach(_.orderBy(r, function(w){return w.DATE}), function(z){
					lrxy.push([z.DATE,z.VAL]);
				});
			var lr = regression('linear', lrxy);

			"y = lr.equation[0]*x + lr.equation[1]"
			svg.append('line')
				//.attr('id','legend_line_threats'+ii)
				.attr('x1', scaleX(scaleX.domain()[0]))
				.attr('y1', scaleY(lr.equation[0]*scaleX.domain()[0] + lr.equation[1]))
				.attr('x2', scaleX(scaleX.domain()[1]))
				.attr('y2', scaleY(lr.equation[0]*scaleX.domain()[1] + lr.equation[1]))
				//Faig un clipping perqu� no surti la l�nia del CANVAS
				//http://www.d3noob.org/2015/07/clipped-paths-in-d3js-aka-clippath.html
				.attr('clip-path', 'url(#rect-clip)') 
				.style('fill', 'none')
				.style('stroke-dasharray', ('5, 3'))
				.style('stroke', 'red')
				.style('stroke-opacity', 0.9)
				.style('stroke-width', 0.8)
				;
		};

		//Afegir els eixos
		svg.append("g")
			.attr("class", "y_axis")
			.call(yAxis);
			
		svg.append("g")
			.attr("class", "x_axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
			
		//Titol
		svg.append('g')
	        .append('text')
	        .attr("text-anchor", "start")  
			.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))+10) +","+10+")")
	        .style("font-size", "11px")
	        .style("font-family", "open sans")
	        .text(_.capitalize(sefa_config.translates.get_translate(s_sp)));
	}); //Fi de bucle per a totes els esp�cies dins d'un parc
	
}//Fi de graph_by_population_trend_by_park()

GRAPH_SEFA.prototype.graph_by_population_trend = function(){
	
	var d = manage_sd.get_population_trend();

	//defaults
	var defaults={
		factor_escala_1 : 1.25,
		factor_escala_2 : 2,
	    //Margins
		margin : {top: 10, right: 20, bottom: 20, left: 50},
		//Absolute
		abs_height : 200,
		abs_width : 300,
		width : 0,
		height : 0,
		scaleX : {}
	}; //Fi de Defaults
	
	defaults.width = defaults.abs_width - defaults.margin.left - defaults.margin.right;
	defaults.height = defaults.abs_height - defaults.margin.top - defaults.margin.bottom;
	defaults.scaleX = d3.scale.linear()
	          			.range([0, defaults.width])
	          			.domain([_.minBy(d,function(w){return w.DATE;}).DATE,_.maxBy(d,function(w){return w.DATE;}).DATE])
	          			.nice();
	


	// **********************************************
	//	Bucle per parc
	// **********************************************
	_.forEach(_.uniqBy(d, function(w){return w.PARK;}), function(q){

		var s_div = 'sefa_graphs_population_trend_'+q.PARK;
		if(!$('#'+s_div+'_').length){return;}

		//Omplo el DIV per parc
		$('#'+s_div+'_').append('<div><div class="panel panel-default"><div class="panel-heading">'+sefa_config.translates.get_translate(q.PARK)+'</div><div id="'+s_div+'" class="panel-body"></div></div></div>');

		graphs.graph_by_population_trend_by_park(q.PARK, _.filter(d, function(w){return _.isEqual(w.PARK, q.PARK);}), defaults);
	});
}




GRAPH_SEFA.prototype.graph_by_anual_surveyed_localities = function(){

	var div = 'sefa_graphs_anual_surveyed_localities';
	if(!$('#'+div).length){return;}
	var id_div = div;
	
	var s = manage_sd.get_anual_surveyed_localities();
	
	var factor_escala = 1.25;
	
	// **********************************
	// Defaults
	// **********************************
    //Margins
	var margin = {top: 20, right: 20, bottom: 20, left: 25};
	//Absolute
	var abs_height = 200;
	var abs_width = 400;
	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain(s.rx)
	          .nice();

	//Escala Y: linear
	var scaleY = d3.scale.linear()
		.range([height, 0])
		.domain([s.ry[0],s.ry[1]*factor_escala])
		.nice()
		;

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            //.outerTickSize(0)
	            .ticks(4)
	            .tickFormat(d3.format('d'))
			            ;
	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id',id_div)
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var line = d3.svg.line()
	    .x(function(u){return scaleX(u.year);})
	    .y(function(u){return scaleY(u.count);})
    ;
	
	svg.append('path')
		.attr('d', line(s.d))
		.style('fill', 'none')
		.style('stroke', '#a50f15')
		.style('stroke-width', 1)
		.style('stroke-opacity', 0.8)
		;

	//V�rtexs de les l�nies
	_.forEach(s.d, function(w){
		svg.append('circle')
			.attr('cx', scaleX(w.year))
			.attr('cy', scaleY(w.count))
			.attr('r', 3)
			.style('fill', '#67000d')
			.style('fill-opacity',1)
			.append('svg:title')
			.text(sefa_config.translates.get_translate('n_total')+w.count+' ('+w.year+')')
			;
	});

	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		
	//Titol
	svg.append('g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+ ((scaleY(scaleY.domain()[1]))-(margin.top/2))   +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('surveyed_localities')));
};function LAYER(label, layer_tile)
{
	this.label = label;
	this.layer_tile = layer_tile;
};
LAYER.prototype.gettilelayer = function()
{
	return this.layer_tile;
};

LAYER.prototype.getvectorlayer = function()
{
	return this.layer_tile;
};

//Retorna un array de layers SEFA
function CAPES_SEFA()
{
	this.sefa_layers = [];
	this.sefa_layers.push(new LAYER(
		'sefa_utm1x1', 
		new ol.layer.Vector(
		{
			source: construct_fishnet(),
			opacity: 0.5,
			style: define_fishnet_style(),
			visible: true
		})
	));
}; //Fi de CAPES_SEFA()

//Mètode que retorna un objecte layer indicant el nom de la capa
CAPES_SEFA.prototype.get_vectorlayer = function(nom_layer)
{
	return _.find(this.sefa_layers, function(d){return d.label==nom_layer;}).getvectorlayer();
};


function construct_fishnet()
{
	var vectorSource = new ol.source.Vector();
	_.forEach(fishnet.cells, function(c){
		vectorSource.addFeature(new ol.Feature({
    		name: c.UTMX+','+c.UTMY,
    		geometry: new ol.geom.Polygon(c.get_polygonXY())
		}));
	});
	return vectorSource;
}

function define_fishnet_style()
{
	return new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'red'
			}),
		stroke: new ol.style.Stroke({
			color: 'red',
			width: 1
    	})
    });	
}//Retorna un array d'objectes de tipus ICC amb les capes WMTS
function CAPES_DIBA()
{
	this.diba_layers = [];
	
	this.diba_layers.push(new LAYER(
	'limitsxpn', 
	new ol.layer.Tile(
	{
		source: new ol.source.TileWMS(
		{
			url: 'http://sitmun.diba.cat/wms/servlet/XPE50?',
			params: 
			{
				'LAYERS': 'XPE50_111L',
				'VERSION': '1.1.1',
				'FORMAT': 'image/png',
				'TILED': true,
				'SERVICE': 'WMS',
				'TRANSPARENT': true,
				'BGCOLOR': 0x000000,
				'OUTLINE': true,
				'STYLE': 'opacity:0.8',
				'SRS': sefa_config.get_map_epsg(),
			}
		})
	})
	));
}; //Fi de CAPES_DIBA()

//Mètode que retorna un objecte tile indicant el nom de la capa
CAPES_DIBA.prototype.get_tilelayer = function(nom_layer)
{
	return _.find(this.diba_layers, function(d){return d.label==nom_layer;}).gettilelayer();
};

//Retorna un array d'objectes de tipus ICC amb les capes WMTS
function CAPES_ICC()
{
	this.icc_layers = [];
	
	this.icc_layers.push(new LAYER('topo', wmts('topo')));
	this.icc_layers.push(new LAYER('topogris', wmts('topogris')));
	this.icc_layers.push(new LAYER('orto', wmts('orto')));
	this.icc_layers.push(new LAYER('ortogris', wmts('ortogris')));
	
	function wmts(layer_name)
	{
		return new ol.layer.Tile(
		{
			opacity: 0.7,
			extent: sefa_config.get_map_extent(),
			source: new ol.source.TileWMS(
			{
				//attributions: [attribution],
				url: 'http://mapcache.icc.cat/map/bases/service?',
				params: {'LAYERS': layer_name}
			})
		});
	};
};

//Mètode que retorna un objecte tile indicant el nom de la capa
CAPES_ICC.prototype.get_tilelayer = function(nom_layer)
{
	return _.find(this.icc_layers, function(d){return d.label==nom_layer;}).gettilelayer();
};
function mapa_sefa_localitats_quadricula()
{
	//Si no s'ha declarat el DIV per contenir el mapa, no faig res
	if (!$("#mslq").length){return;}
	
	//Actualitzo el títol
	$('div#mapa_sefa_localitats_quadricula_heading').html('<h1 class="panel-title">'+_.capitalize(sefa_config.translates.get_translate('locations'))+'</h1>');

	//Determino les mides del mapa:
	$().attr('height','700px')
	   .attr('width','100%');
	
	//Instàncies dels objectes amb les capes WMS 
	var icc = new CAPES_ICC();
	var diba = new CAPES_DIBA();
	var sefa = new CAPES_SEFA();
	
	//MAPA
	var map = new ol.Map(
	{
		target: 'mslq',
		interactions: ol.interaction.defaults({mouseWheelZoom:false}),
		view: new ol.View({
			projection: sefa_config.get_map_projection(),
			center: sefa_config.get_map_centerXY(),
			zoom: sefa_config.get_map_zoom_initial(),
			resolutions: sefa_config.get_map_resolutions(),
			extent: sefa_config.get_map_extent()
		})
	});

	//Calculo l'extent del mapa segons la vista inicial
	mapextent = map.getView().calculateExtent(map.getSize());

	//Instància de l'objecte amb la llista de controls del mapa
	var controls_list = new CONTROLS(mapextent);
	_.each(controls_list.getControls(), function(d){map.addControl(d)});

	//TODO fixar el PAN sobre el mapa a mapextent.

	//Consulta sobre el mapa
	map.on('click', function(evt) {displayFeatureInfo(evt.pixel, evt.coordinate);});
	
	//Mousemove
	/*
	$(map.getViewport()).on('mousemove', function(evt) {
  			var pixel = map.getEventPixel(evt.originalEvent);
  			displayFeatureInfo(pixel);
	});
	*/

	addLayer_check(map, icc.get_tilelayer('topogris'));
	addLayer_check(map, diba.get_tilelayer('limitsxpn'));
	addLayer_check(map, sefa.get_vectorlayer('sefa_utm1x1'));


	var displayFeatureInfo = function(pixel, coords) {
	
			map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				view_popup(map, coords, feature.get('name'));
			});
	};

};//Fi de mapa_sefa_localitats_quadricula()


function CONTROLS(mapextent)
{
	this.c = [
	
	new ol.control.ScaleLine(
	{
		units: 'metric',
		minWidth: 100
	}),

	new ol.control.MousePosition(
	{
		undefinedHTML: '',
		//projection: ol.proj.get('EPSG:4326'),
		units: 'meters',
		coordinateFormat: function(coordinate) {return ol.coordinate.format(coordinate, '{x}, {y}', 0)},
	}),
	
	new ol.control.ZoomToExtent({extent: mapextent}),
	new ol.control.Zoom()
	];
};

CONTROLS.prototype.getControls = function()
{
	return this.c;	
};

function view_popup(map, pixel, feature_name)
{
	//Exemple: http://jsfiddle.net/ro1ptr0k/26/

	//Si ja hi ha un Overlay obert, no faig res
	if(map.getOverlays().getArray().length){return;};

	//Creo l'element DIV id=popup
	$('#mslq').append('<div id="popup" class="ol-popup"></div>');
	
	$newpopupcloser = $('<a/>')
					 .attr('href', '#')
					 .attr('id', 'popup-closer')
					 .addClass('ol-popup-closer')
					 .on('click', function(){
										map.removeOverlay(overlay);
										$('#popup-closer').blur();
										return false;		
										});
	$('#popup').append($newpopupcloser);

	//Busco a les dades, totes les localitats dins de la quadrícula
	var r = manage_sd.get_locations_by_feature_name(feature_name);
	
	//Creo la taula amb els resultats
	$newtable = $('<table/>')
			    .addClass('table')
			    .addClass('table-condensed');

	$newtable.append('<thead>'+
		'<tr>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('park'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('species'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('core'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('method'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('period'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('date_start'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('date_end'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('n_census'))+'</th>'+
		'</tr>'+
	'</thead>'+
	'<tbody>'
	);
	
	_.forEach(r, function(q){
		
		$newtable.append('<tr>'+
				'<td>'+sefa_config.translates.get_translate(q.ID_PARC)+'</td>'+
				'<td class=\'specie\'>'+q.ESPECIE+'</td>'+
				'<td>'+q.NUCLI_POBLACIONAL+'</td>'+
				'<td>'+q.METODOLOGIA_SEGUIMENT+'</td>'+
				'<td>'+q.PERIODICITAT+'</td>'+
				'<td>'+q.DATA_CENS_FIRST+'</td>'+
				'<td>'+q.DATA_CENS_LAST+'</td>'+
				'<td>'+q.N_CENSOS+'</td>'+
				'</tr>'
			);
		});

	$newtable.append('</tbody>');

	//Afegeixo la taula al contingut
	$newpopupcontent = $('<div/>');
	$('#popup').append($newpopupcontent);
	$newpopupcontent.append($newtable);

	
	//Add Overlay
	var overlay = new ol.Overlay({element: $('#popup')[0]});
	map.addOverlay(overlay);
	overlay.setPosition(pixel);
}; //Fi de view_popup


//Check if layer exist in map, return true/false
function map_layer_check(map, layer)
{
		if(!_.isUndefined(_.find(map.getLayers().getArray(), function(d){return d == layer;})))
		{return true;}
		else{return false;}
}; //Fi de map_layer_check

function addLayer_check(map, layer)
{
	if(!map_layer_check(map, layer))
	{map.addLayer(layer);}
}; //Fi de addLayer_check(map, layer)

function removeLayer_check(map, layer)
{
	if(map_layer_check(map, layer))
	{map.removeLayer(layer);}
}; //Fi de removeLayer_check
function TRANSLATES()
{
	this.language_list = ['ca','es','en'];
	this.lang_select;
	this.translate = [];
};//Fi de translate

TRANSLATES.prototype.set_lang = function(lang) 
{
    this.lang_select = lang;
};

TRANSLATES.prototype.get_translate = function(value)
{
	var langselect = this.lang_select;
	var t = _.find(this.translate, function(x){return x.value == value});
	if(_.isUndefined(t))
	{
		//No la trobat, retorno value
		return value;
	}
	else
	{
		var tt = _.find(t.chains, function(x){
			return x.lang == langselect});
		if(_.isUndefined(tt))
		{
			//No he trobat la cadena amb la llengua seleccionada
			return value;
		}
		else
		{
			//return utf8.encode(tt.text);
			return tt.text;
		} 
	}
};

function TRANSLATE(value)
{
	this.value = value;
	this.chains = [];
};

TRANSLATE.prototype.set_chain = function(lang,text)
{
	this.chains.push(new CHAIN(lang,text));
};

function CHAIN(lang, text)
{
	this.lang = lang;
	this.text = text;
};

TRANSLATES.prototype.set_translates = function(value, lang, text)
{
	var t = _.find(this.translate, function(x){return x.value == value});
	if(_.isUndefined(t))
	{
		t = new TRANSLATE(value);
		t.set_chain(lang,text);
		this.translate.push(t);
	}
	else
	{
		t.set_chain(lang,text);
	}
};

TRANSLATES.prototype.load_translates = function()
{
	//this.set_translates(value,lang,text);
	this.set_translates('n_total','ca','n='); //--> N=, total dels piegraphs
	this.set_translates('locations','ca','localitats');
	
	//Capçaleres de la taula amb els resultats al mapa
	this.set_translates('park','ca','parc');
	this.set_translates('species','ca','espècie');
	this.set_translates('method','ca','mètode');
	this.set_translates('period','ca','període');
	this.set_translates('date_start','ca','inici');
	this.set_translates('date_end','ca','fi');
	this.set_translates('n_census','ca','censos');
	this.set_translates('core','ca','nucli');
	
	//Gràfics
	this.set_translates('others','ca','altres');
	this.set_translates('methods','ca','Metodologies');
	this.set_translates('species_by_protectedarea','ca','espècies d\'interès (amb localitats) per parc');
	this.set_translates('locations_by_protectedarea','ca','Localitats per parc');
	this.set_translates('species_protecionlevel','ca','Espècies per categoria d\'interès');
	this.set_translates('species_protectioncatalog','ca','Espècies per categories CFAC');
	this.set_translates('periodicity','ca','periodicitat');
	this.set_translates('number','ca','número');
	this.set_translates('graph_species_tracked_by_protectionlevel_title','ca','Espècies amb seguiment per categoria d\'interès');
	this.set_translates('graph_species_tracked_by_protectioncatalog_title','ca','Espècies amb seguiment per categoria del CFAC');
	this.set_translates('date','ca','data');
//	this.set_translates('graph_species_tracked_by_tracked_dates_acumulated_title','ca','Data dels censos i període de seguiment');
	this.set_translates('graph_species_tracked_by_tracked_dates_acumulated_title','ca','Període de seguiment');
	this.set_translates('locations','ca','localitats');
	this.set_translates('locations_with_census','ca','amb seguiment');
	this.set_translates('graph_groupby_species_by_num_locations_title','ca','Localitats amb seguiment sobre el total per espècie');
	this.set_translates('locations_number','ca','número de localitats');
	this.set_translates('graph_groupby_species_by_num_census_title','ca','Número de censos per espècie');
	this.set_translates('graph_locations_species_protectedarea','ca','Localitats per espècie i parc');

	//group by method
	this.set_translates('Metodologia 2 - Recompte total','ca','Mètode 2');
	this.set_translates('Metodologia 1 - Presència / absència','ca','Mètode 1');
	this.set_translates('Metodologia 3 - Estimació amb parcel·les','ca','Mètode 3');
	this.set_translates('0','ca','Sense seguiment');
	
	
	//groupby_locations_by_protectedarea
	this.set_translates('MCO','ca','Montnegre i el Corredor');
	this.set_translates('SLI','ca','Serralada Litoral');
	this.set_translates('MSY','ca','Montseny');
	this.set_translates('SMA','ca','Serralada de Marina');
	this.set_translates('GUI','ca','Guilleries-Savassona');
	this.set_translates('GRF','ca','Garraf');
	this.set_translates('SLL','ca','Sant Llorenç del Munt i l\'Obac');
	
	//groupby_species_by_protectioncatalog
	this.set_translates('E','ca','En perill');
	this.set_translates('V','ca','Vulnerable');
	this.set_translates('nopresent','ca','No present');

	//Tables
	this.set_translates('sefa_table_species_by_protectioncatalog_list_heading','ca','Llistat d\'espècies per categories CFAC');
	this.set_translates('sefa_table_species_by_protectionlevel_list_heading','ca','llistat d\'espècies per categories de priorització');
	this.set_translates('sefa_table_species_by_protectionlevel_protectioncatalog_list_heading','ca','Llistat d\'espècies amb localitats introduïdes a la base de dades del SEFA');

	this.set_translates('protecionlevel','ca','categoria de priorització');
	this.set_translates('protecioncatalog','ca','Categoria CFAC');

	//Impactes i amenaces

	this.set_translates('threats','ca','Síntesi d\'amenaces');
	this.set_translates('impacts','ca','Síntesi d\'impactes');
	this.set_translates('year','ca','any');
	this.set_translates('totals','ca','totals');
	this.set_translates('total_for_year','ca','totals per any');

	this.set_translates('impacts_evolution','ca','Evolució temporal dels impactes');
	this.set_translates('threats_evolution','ca','Evolució temporal de les amenaces');
	

	
	this.set_translates('surveyed_localities','ca','localitats censades');


	this.set_translates('1. Canvi climàtic','ca','Canvi climàtic');
	this.set_translates('2. Reducció de l’hàbitat','ca','Reducció hàbitat');
	this.set_translates('3. Incendis forestals','ca','Incendis forestals');
	this.set_translates('4. Alteració del medi hídric','ca','Alteració medi hídric');
	this.set_translates('5. Pràctiques forestals inadequades','ca','Pràctiques forestals');
	this.set_translates('6. Pol·lució','ca','Pol·lució');
	this.set_translates('7. Canvis en el medi com a resultat de l’abandonament de pràctiques agroramaderes','ca','Abandonament agroramader');
	this.set_translates('8. Canvis en el medi com a resultat de la intensificació de pràctiques agroramaderes','ca','Intensificació agroramadera');
	this.set_translates('9. Altres alteracions de l’hàbitat','ca','Altres alteracions hàbitat');
	this.set_translates('10. Competència','ca','Competència');
	this.set_translates('11. Predació','ca','Predació');
	this.set_translates('12. Parasitisme','ca','Parasitisme');
	this.set_translates('13. Malalties','ca','Malalties');
	this.set_translates('14. Hibridació','ca','Hibridació');
	this.set_translates('15. Població o superfície recoberta petita','ca','Població o superfície recoberta petita');
	this.set_translates('16. Aïllament biogeogràfic','ca','Aïllament biogeogràfic');
	this.set_translates('17. Freqüentació','ca','Freqüentació');
	this.set_translates('18. Altres','ca','Altres');

	this.set_translates('Arecav','ca','Arenaria fontqueri ssp. cavanillesiana');
	this.set_translates('Arisim','ca','Arisarum simorrhinum var. simorrhinum');
	this.set_translates('Botmat','ca','Botrychium matricariifolium');
	this.set_translates('Caramp','ca','Cardamine amporitana');
	this.set_translates('Cardep','ca','Carex depauperata');
	this.set_translates('Carvir','ca','Carex flava ssp. viridula');
	this.set_translates('Cargri','ca','Carex grioletii');
	this.set_translates('Carpra','ca','Carex praecox');
	this.set_translates('Chetin','ca','Cheilanthes tinaei');
	this.set_translates('Cicfil','ca','Cicendia filiformis');
	this.set_translates('Coevir','ca','Coeloglossum viride');
	this.set_translates('Consic','ca','Convolvulus siculus');
	this.set_translates('Cosvel','ca','Cosentinia vellea');
	this.set_translates('Delbol','ca','Delphinium bolosii');
	this.set_translates('Dicalb','ca','Dictamnus albus');
	this.set_translates('Digobs','ca','Digitalis obscura');
	this.set_translates('Equhye','ca','Equisetum hyemale');
	this.set_translates('Ericin','ca','Erica cinerea');
	this.set_translates('Eupdul','ca','Euphorbia dulcis ssp. dulcis');
	this.set_translates('Galsca','ca','Galium scabrum');
	this.set_translates('Gymdry','ca','Gymnocarpium dryopteris');
	this.set_translates('Halhal','ca','Halimium halimifolium');
	this.set_translates('Hyppul','ca','Hypericum pulchrum');
	this.set_translates('Isodur','ca','Isoetes durieui');
	this.set_translates('Latsqu','ca','Lathraea squamaria');
	this.set_translates('Latcir','ca','Lathyrus cirrhosus');
	this.set_translates('Lavolb','ca','Lavatera olbia');
	this.set_translates('Lilmar','ca','Lilium martagon');
	this.set_translates('Lonnig','ca','Lonicera nigra');	
	this.set_translates('Melcat','ca','Melampyrum catalaunicum');
	this.set_translates('Melnut','ca','Melica nutans');
	this.set_translates('Nardub','ca','Narcissus dubius');
	this.set_translates('Peuoff','ca','Peucedanum officinale');
	this.set_translates('Phepur','ca','Phelipanche purpurea');
	this.set_translates('Pinvul','ca','Pinguicula vulgaris');
	this.set_translates('Polbis','ca','Polygonum bistorta');
	this.set_translates('Potmon','ca','Potentilla montana');
	this.set_translates('Potpyr','ca','Potentilla pyrenaica');
	this.set_translates('Prulus','ca','Prunus lusitanica');
	this.set_translates('Samrac','ca','Sambucus racemosa');
	this.set_translates('Saxcat','ca','Saxifraga callosa ssp. catalaunica');
	this.set_translates('Saxgen','ca','Saxifraga genesiana');
	this.set_translates('Saxpan','ca','Saxifraga paniculata');
	this.set_translates('Saxvay','ca','Saxifraga vayredana');
	this.set_translates('Selden','ca','Selaginella denticulata');
	this.set_translates('Servom','ca','Serapias vomeracea');
	this.set_translates('Silvir','ca','Silene viridiflora');
	this.set_translates('Spiaes','ca','Spiranthes aestivalis');
	this.set_translates('Sucbal','ca','Succowia balearica');
	this.set_translates('Taxbac','ca','Taxus bacatta');
	this.set_translates('Viobub','ca','Viola bubanii');
	this.set_translates('Viocat','ca','Viola suavis ssp. catalonica');
	this.set_translates('Vitagn','ca','Vitex agnus-castus');


}; //Fi de load_translates






/* ****************************************************************************/
//							Objecte SEFA_CONFIG
/* ****************************************************************************/
function SEFA_CONFIG()
{
	this.translates = new TRANSLATES();
	this.translates.set_lang('ca');
	this.translates.load_translates();

	//Fishnet resolution, in meters
	this.fishnet_resolution = 1000
	
	//Maps
	this.map_centerXY = [423850,4617000];
	this.map_zoom_initial = 0;
	this.map_EPSG = 'EPSG:25831';
	this.map_extent = [257904,4484796,535907,4751795];
	this.map_projection = ol.proj.get('EPSG:25831');
	this.map_projection.setExtent(this.get_map_extent());
	this.map_resolutions = [275,100,50,25,10,5,2,1,0.5,];


}; //Fi de SEFA_CONFIG()

/* ****************************************************************************/
//									METHODS
/* ****************************************************************************/

SEFA_CONFIG.prototype.get_map_centerXY = function(){return this.map_centerXY;}
SEFA_CONFIG.prototype.get_map_zoom_initial = function(){return this.map_zoom_initial;}
SEFA_CONFIG.prototype.get_map_epsg = function(){return this.map_EPSG;}
SEFA_CONFIG.prototype.get_map_resolutions = function(){return this.map_resolutions;}
SEFA_CONFIG.prototype.get_map_projection = function(){return this.map_projection;}
SEFA_CONFIG.prototype.get_map_extent = function(){return this.map_extent;}






//Configuració i tractament de les dades
var sefa_config = new SEFA_CONFIG();
var fishnet = new FISHNET();
var manage_sd = new MANAGE_SD();
var graphs = new GRAPH_SEFA();
var tables = new SEFA_TABLES();

	
function main_()
{
	//create_page();


	mapa_sefa_localitats_quadricula();

	graphs.graph_by_method();
	graphs.graph_by_period();

	graphs.graph_locations_by_protectedarea();	
	graphs.graph_species_by_protectionlevel();
	graphs.graph_species_by_protectioncatalog();
	graphs.graph_species_by_protectedarea();
	
	tables.table_species_by_protectionlevel_list();
	tables.table_species_by_protectioncatalog_list();
	tables.table_species_by_protectionlevel_protectioncatalog_list();

	graphs.graph_species_tracked_by_protectionlevel();
	graphs.graph_species_tracked_by_protectioncatalog();
	graphs.graph_species_tracked_by_tracked_dates_acumulated();

	graphs.graph_groupby_species_by_num_locations();
	graphs.graph_groupby_species_by_num_locations_by_park();

	graphs.graph_groupby_species_by_num_census();
	graphs.graph_protectedarea_species_locations();

	graphs.graph_by_threats();
	graphs.graph_by_impacts();

	graphs.graph_by_impacts_histo();
	graphs.graph_by_threats_histo();

	graphs.graph_by_population_trend();
	
	graphs.graph_by_anual_surveyed_localities();
	
} // Fi de main_()

