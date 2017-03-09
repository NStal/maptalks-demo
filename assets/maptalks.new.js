/*!
 * maptalks v0.19.5
 * LICENSE : Apache-2.0
 * (c) 2016-2017 maptalks.org
 */
(function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.maptalks = global.maptalks || {})));
}(this, (function (exports) { 'use strict';

/**
 * INTERNAL_LAYER_PREFIX The id prefix of internal layers
 * @global
 */
var INTERNAL_LAYER_PREFIX = '_maptalks__internal_layer_';

var GEOMETRY_COLLECTION_TYPES = ['MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'];

var GEOJSON_TYPES = ['FeatureCollection', 'Feature', 'Point', 'LineString', 'Polygon'].concat(GEOMETRY_COLLECTION_TYPES);

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function now() {
    if (!Date.now) {
        return new Date().getTime();
    }
    return Date.now();
}

/**
 * @classdesc
 * Utilities methods used internally. It is static and should not be initiated.
 * @class
 * @static
 * @category core
 * @name Util
 */

/**
 * Merges the properties of sources into destination object.
 * @param  {Object} dest   - object to extend
 * @param  {...Object} src - sources
 * @return {Object}
 * @memberOf Util
 */
function extend(dest) {
    // (Object[, Object, ...]) ->
    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i];
        for (var k in src) {
            dest[k] = src[k];
        }
    }
    return dest;
}

/**
 * From leaflet <br>
 * return a function that won't be called more often than the given interval
 *
 * @param  {Function} fn      - function to call
 * @param  {Number}   time    - interval to throttle
 * @param  {Object}   context - function's context
 * @return {Function} the throttled function
 * @memberOf Util
 */
function throttle(fn, time, context) {
    var lock, args, wrapperFn, later;

    later = function later() {
        // reset lock and call if queued
        lock = false;
        if (args) {
            wrapperFn.apply(context, args);
            args = false;
        }
    };

    wrapperFn = function wrapperFn() {
        if (lock) {
            // called too soon, queue to call later
            args = arguments;
        } else {
            // call and lock until later
            fn.apply(context, arguments);
            setTimeout(later, time);
            lock = true;
        }
    };

    return wrapperFn;
}

/**
 * Whether the object is null or undefined.
 * @param  {Object}  obj - object
 * @return {Boolean}
 * @memberOf Util
 */
function isNil(obj) {
    return obj == null;
}

/**
 * Whether val is a number and not a NaN.
 * @param  {Object}  val - val
 * @return {Boolean}
 * @memberOf Util
 */
function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
}

/**
 * Whether a number is an integer
 * @param  {Number}  n
 * @return {Boolean}
 * @memberOf Util
 */
function isInteger(n) {
    return (n | 0) === n;
}

/**
 * Whether the obj is a javascript object.
 * @param  {Object}  obj  - object
 * @return {Boolean}
 * @memberOf Util
 */
function isObject(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !!obj;
}

/**
 * Check whether the object is a string
 * @param {Object} obj
 * @return {Boolean}
 * @memberOf Util
 */
function isString(obj) {
    if (isNil(obj)) {
        return false;
    }
    return typeof obj === 'string' || obj.constructor !== null && obj.constructor === String;
}

/**
 * Check whether the object is a function
 * @param {Object} obj
 * @return {Boolean}
 * @memberOf Util
 */
function isFunction(obj) {
    if (isNil(obj)) {
        return false;
    }
    return typeof obj === 'function' || obj.constructor !== null && obj.constructor === Function;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Check whether the object owns the property.
 * @param  {Object}  obj - object
 * @param  {String}  key - property
 * @return {Boolean}
 * @memberOf Util
 */
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

/**
 * From https://github.com/abhirathore2006/detect-is-node/
 *
 * @property {boolean} isNode - whether running in nodejs.
 * @global
 * @name isNode
 */
var isNode = function () {
  return new Function('try { return this === global; } catch(e) { return false; }')();
}();

// RequestAnimationFrame, inspired by Leaflet
var requestAnimFrame;
var cancelAnimFrame;
(function () {
    if (isNode) {
        requestAnimFrame = function requestAnimFrame(fn) {
            return setTimeout(fn, 16);
        };

        cancelAnimFrame = clearTimeout;
        return;
    }

    var requestFn, cancelFn;
    var lastTime = 0;

    // fallback for IE 7-8
    function timeoutDefer(fn) {
        var time = +new Date(),
            timeToCall = Math.max(0, 16 - (time - lastTime));

        lastTime = time + timeToCall;
        return setTimeout(fn, timeToCall);
    }

    function getPrefixed(name) {
        return window['webkit' + name] || window['moz' + name] || window['ms' + name];
    }
    if (typeof window != 'undefined') {
        // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

        requestFn = window['requestAnimationFrame'] || getPrefixed('RequestAnimationFrame') || timeoutDefer;
        cancelFn = window['cancelAnimationFrame'] || getPrefixed('CancelAnimationFrame') || getPrefixed('CancelRequestAnimationFrame') || function (id) {
            window.clearTimeout(id);
        };
    } else {
        requestFn = timeoutDefer;
        cancelFn = function cancelFn(id) {
            clearTimeout(id);
        };
    }
    /**
     * Polyfill of RequestAnimationFrame
     * @param  {Function} fn callback
     * @return {Number}      request id
     * @memberOf Util
     */
    requestAnimFrame = function requestAnimFrame(fn) {
        return requestFn(fn);
    };

    /**
     * Polyfill of cancelAnimationFrame
     * @param  {Number}      request id
     * @memberOf Util
     */
    cancelAnimFrame = function cancelAnimFrame(id) {
        if (id) {
            cancelFn(id);
        }
    };
})();
var uid = 0;

/**
 * Merges options with the default options of the object.
 * @param {Object} obj      - object
 * @param {Object} options  - options
 * @returns {Object} options
 * @memberOf Util
 */
function setOptions(obj, options) {
    if (hasOwn(obj, 'options')) {
        obj.options = obj.options ? Object.create(obj.options) : {};
    }
    for (var i in options) {
        obj.options[i] = options[i];
    }
    return obj.options;
}

function isSVG(url) {
    var prefix = 'data:image/svg+xml';
    if (url.length > 4 && url.slice(-4) === '.svg') {
        return 1;
    } else if (url.slice(0, prefix.length) === prefix) {
        return 2;
    }
    return 0;
}

var noop = function noop() {};

// TODO: convertSVG???
var convertSVG = noop;

var _loadRemoteImage = noop;
var _loadLocalImage = noop;

if (isNode) {
    _loadRemoteImage = function _loadRemoteImage(img, url, onComplete) {
        // http
        var request;
        if (url.indexOf('https://') === 0) {
            request = require('https').request;
        } else {
            request = require('http').request;
        }
        var urlObj = require('url').parse(url);
        //mimic the browser to prevent server blocking.
        urlObj.headers = {
            'Accept': 'image/*,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Host': urlObj.host,
            'Pragma': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
        };
        request(urlObj, function (res) {
            var data = [];
            res.on('data', function (chunk) {
                data.push(chunk);
            });
            res.on('end', function () {
                onComplete(null, Buffer.concat(data));
            });
        }).on('error', onComplete).end();
    };

    _loadLocalImage = function _loadLocalImage(img, url, onComplete) {
        // local file
        require('fs').readFile(url, onComplete);
    };
}
/**
 * Load a image, can be a remote one or a local file. <br>
 * If in node, a SVG image will be converted to a png file by [svg2img]{@link https://github.com/FuZhenn/node-svg2img}<br>
 * @param  {Image} img  - the image object to load.
 * @param  {Object[]} imgDesc - image's descriptor, it's an array. imgUrl[0] is the url string, imgUrl[1] is the width, imgUrl[2] is the height.
 * @private
 * @memberOf Util
 */
function loadImage(img, imgDesc) {
    if (!isNode) {
        img.src = imgDesc[0];
        return;
    }

    function onError(err) {
        if (err) {
            console.error(err);
            console.error(err.stack);
        }
        var onerrorFn = img.onerror;
        if (onerrorFn) {
            onerrorFn.call(img);
        }
    }

    function onLoadComplete(err, data) {
        if (err) {
            onError(err);
            return;
        }
        var onloadFn = img.onload;
        if (onloadFn) {
            img.onload = function () {
                onloadFn.call(img);
            };
        }
        img.src = data;
    }
    var url = imgDesc[0],
        w = imgDesc[1],
        h = imgDesc[2];
    try {
        if (isSVG(url) && convertSVG) {
            convertSVG(url, w, h, onLoadComplete);
        } else if (isURL(url)) {
            // canvas-node的Image对象
            _loadRemoteImage(img, url, onLoadComplete);
        } else {
            _loadLocalImage(img, url, onLoadComplete);
        }
    } catch (error) {
        onError(error);
    }
}

function UID() {
    return uid++;
}
var GUID = UID;

/**
 * Parse a JSON string to a object
 * @param {String} str      - a JSON string
 * @return {Object}
 * @memberOf Util
 */
function parseJSON(str) {
    if (!str || !isString(str)) {
        return str;
    }
    return JSON.parse(str);
}

function executeWhen(fn, when) {
    var exe = function exe() {
        if (when()) {
            fn();
        } else {
            requestAnimFrame(exe);
        }
    };

    exe();
}

function removeFromArray(obj, array) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === obj) {
            return array.splice(i, 1);
        }
    }
    return null;
}

function mapArrayRecursively(arr, fn, context) {
    if (!Array.isArray(arr)) {
        return null;
    }
    var result = [],
        p,
        pp;
    for (var i = 0, len = arr.length; i < len; i++) {
        p = arr[i];
        if (isNil(p)) {
            result.push(null);
            continue;
        }
        if (Array.isArray(p)) {
            result.push(mapArrayRecursively(p, fn, context));
        } else {
            pp = context ? fn.call(context, p) : fn(p);
            result.push(pp);
        }
    }
    return result;
}

function getValueOrDefault(v, d) {
    return v === undefined ? d : v;
}

/*
 * Caculate round of a number, more efficient.
 * @param  {Number} num - num to round
 * @return {Number}
 * @memberOf Util
 */
function round(num) {
    if (num > 0) {
        return 0.5 + num << 0;
    } else {
        return num - 0.5 << 0;
    }
}

/**
 * Polyfill for Math.sign
 * @param  {Number} x
 * @return {Number}
 * @memberOf Util
 */
function sign(x) {
    if (Math.sign) {
        return Math.sign(x);
    }
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return Number(x);
    }
    return x > 0 ? 1 : -1;
}

/*
 * Is object an array and not empty.
 * @param {Object} obj
 * @return {Boolean} true|false
 * @private
 * @memberOf Util
 */
function isArrayHasData(obj) {
    return Array.isArray(obj) && obj.length > 0;
}

/**
 * Whether the input string is a valid url.
 * @param  {String}  url - url to check
 * @return {Boolean}
 * @memberOf Util
 * @private
 */
function isURL(url) {
    if (!url) {
        return false;
    }
    var head = url.slice(0, 6);
    if (head === 'http:/' || head === 'https:' || head === 'file:/') {
        return true;
    }
    return false;
}

//改原先的regex名字为xWithQuote；不带引号的regex，/^url\(([^\'\"].*[^\'\"])\)$/i，为xWithoutQuote。然后在is函数里||测试，extract函数里if...else处理。没引号的匹配后，取matches[1]

// match: url('x'), url("x").
// TODO: url(x)
var cssUrlReWithQuote = /^url\(([\'\"])(.+)\1\)$/i;

var cssUrlRe = /^url\(([^\'\"].*[^\'\"])\)$/i;

function isCssUrl(str) {
    if (!isString(str)) {
        return 0;
    }
    var head = str.slice(0, 6);
    if (head === 'http:/' || head === 'https:') {
        return 3;
    }
    if (cssUrlRe.test(str)) {
        return 1;
    }
    if (cssUrlReWithQuote.test(str)) {
        return 2;
    }
    return 0;
}

function extractCssUrl(str) {
    var test = isCssUrl(str),
        matches;
    if (test === 3) {
        return str;
    }
    if (test === 1) {
        matches = cssUrlRe.exec(str);
        return matches[1];
    } else if (test === 2) {
        matches = cssUrlReWithQuote.exec(str);
        return matches[2];
    } else {
        // return as is if not an css url
        return str;
    }
}

var b64chrs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * btoa or a polyfill in old browsers. <br>
 * Creates a base-64 encoded ASCII string from a String object in which each character in the string is treated as a byte of binary data.<br>
 * From https://github.com/davidchambers/Base64.js
 * @param  {Buffer} input - input string to convert
 * @return {String} ascii
 * @memberOf Util
 * @example
 *     var encodedData = Util.btoa(stringToEncode);
 */
function btoa$1(input) {
    if (typeof window !== 'undefined' && window.btoa) {
        return window.btoa(input);
    }
    var str = String(input);
    for (
    // initialize result and counter
    var block, charCode, idx = 0, map = b64chrs, output = '';
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = str.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) {
            throw new Error('\'btoa\' failed: The string to be encoded contains characters outside of the Latin1 range.');
        }
        block = block << 8 | charCode;
    }
    return output;
}

/**
 * Compute degree bewteen 2 points.
 * @param  {Point} p1 point 1
 * @param  {Point} p2 point 2
 * @return {Number}    degree between 2 points
 * @memberOf Util
 */
function computeDegree(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.atan2(dy, dx);
}

/*!
    Feature Filter by

    (c) mapbox 2016
    www.mapbox.com
    License: MIT, header required.
*/
var types = ['Unknown', 'Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'];

/**
 * Given a filter expressed as nested arrays, return a new function
 * that evaluates whether a given feature (with a .properties or .tags property)
 * passes its test.
 *
 * @param {Array} filter mapbox gl filter
 * @returns {Function} filter-evaluating function
 * @memberOf MapboxUtil
 */
function createFilter(filter) {
    return new Function('f', 'var p = (f && f.properties || {}); return ' + compile(filter));
}

function compile(filter) {
    if (!filter) return 'true';
    var op = filter[0];
    if (filter.length <= 1) return op === 'any' ? 'false' : 'true';
    var str = op === '==' ? compileComparisonOp(filter[1], filter[2], '===', false) : op === '!=' ? compileComparisonOp(filter[1], filter[2], '!==', false) : op === '<' || op === '>' || op === '<=' || op === '>=' ? compileComparisonOp(filter[1], filter[2], op, true) : op === 'any' ? compileLogicalOp(filter.slice(1), '||') : op === 'all' ? compileLogicalOp(filter.slice(1), '&&') : op === 'none' ? compileNegation(compileLogicalOp(filter.slice(1), '||')) : op === 'in' ? compileInOp(filter[1], filter.slice(2)) : op === '!in' ? compileNegation(compileInOp(filter[1], filter.slice(2))) : op === 'has' ? compileHasOp(filter[1]) : op === '!has' ? compileNegation(compileHasOp([filter[1]])) : 'true';
    return '(' + str + ')';
}

function compilePropertyReference(property) {
    return property[0] === '$' ? 'f.' + property.substring(1) : 'p[' + JSON.stringify(property) + ']';
}

function compileComparisonOp(property, value, op, checkType) {
    var left = compilePropertyReference(property);
    var right = property === '$type' ? types.indexOf(value) : JSON.stringify(value);
    return (checkType ? 'typeof ' + left + '=== typeof ' + right + '&&' : '') + left + op + right;
}

function compileLogicalOp(expressions, op) {
    return expressions.map(compile).join(op);
}

function compileInOp(property, values) {
    if (property === '$type') values = values.map(function (value) {
        return types.indexOf(value);
    });
    var left = JSON.stringify(values.sort(compare));
    var right = compilePropertyReference(property);

    if (values.length <= 200) return left + '.indexOf(' + right + ') !== -1';
    return 'function(v, a, i, j) {' + 'while (i <= j) { var m = (i + j) >> 1;' + '    if (a[m] === v) return true; if (a[m] > v) j = m - 1; else i = m + 1;' + '}' + 'return false; }(' + right + ', ' + left + ',0,' + (values.length - 1) + ')';
}

function compileHasOp(property) {
    return JSON.stringify(property) + ' in p';
}

function compileNegation(expression) {
    return '!(' + expression + ')';
}

// Comparison function to sort numbers and strings
function compare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Get feature object from a geometry for filter functions.
 * @param  {Geometry} geometry geometry
 * @return {Object}          feature for filter functions
 * @memberOf MapboxUtil
 */
function getFilterFeature(geometry) {
    var json = geometry._toJSON(),
        g = json['feature'];
    g['type'] = types.indexOf(g['geometry']['type']);
    g['subType'] = json['subType'];
    return g;
}

/**
 * Compile layer's style, styles to symbolize layer's geometries, e.g.<br>
 * <pre>
 * [
 *   {
 *     'filter' : ['==', 'foo', 'val'],
 *     'symbol' : {'markerFile':'foo.png'}
 *   }
 * ]
 * </pre>
 * @param  {Object|Object[]} styles - style to compile
 * @return {Object[]}       compiled styles
 * @memberOf MapboxUtil
 */
function compileStyle(styles) {
    if (!Array.isArray(styles)) {
        return compileStyle([styles]);
    }
    var compiled = [];
    for (var i = 0; i < styles.length; i++) {
        if (styles[i]['filter'] === true) {
            compiled.push({
                filter: function filter() {
                    return true;
                },
                symbol: styles[i].symbol
            });
        } else {
            compiled.push({
                filter: createFilter(styles[i]['filter']),
                symbol: styles[i].symbol
            });
        }
    }
    return compiled;
}

function createFunction(parameters, defaultType) {
    var fun;

    if (!isFunctionDefinition(parameters)) {
        fun = function fun() {
            return parameters;
        };
        fun.isFeatureConstant = true;
        fun.isZoomConstant = true;
    } else {
        var zoomAndFeatureDependent = _typeof(parameters.stops[0][0]) === 'object';
        var featureDependent = zoomAndFeatureDependent || parameters.property !== undefined;
        var zoomDependent = zoomAndFeatureDependent || !featureDependent;
        var type = parameters.type || defaultType || 'exponential';

        var innerFun;
        if (type === 'exponential') {
            innerFun = evaluateExponentialFunction;
        } else if (type === 'interval') {
            innerFun = evaluateIntervalFunction;
        } else if (type === 'categorical') {
            innerFun = evaluateCategoricalFunction;
        } else {
            throw new Error('Unknown function type "' + type + '"');
        }

        if (zoomAndFeatureDependent) {
            var featureFunctions = {};
            var featureFunctionStops = [];
            for (var s = 0; s < parameters.stops.length; s++) {
                var stop = parameters.stops[s];
                if (featureFunctions[stop[0].zoom] === undefined) {
                    featureFunctions[stop[0].zoom] = {
                        zoom: stop[0].zoom,
                        type: parameters.type,
                        property: parameters.property,
                        stops: []
                    };
                }
                featureFunctions[stop[0].zoom].stops.push([stop[0].value, stop[1]]);
            }

            for (var z in featureFunctions) {
                featureFunctionStops.push([featureFunctions[z].zoom, createFunction(featureFunctions[z])]);
            }
            fun = function fun(zoom, feature) {
                return evaluateExponentialFunction({ stops: featureFunctionStops, base: parameters.base }, zoom)(zoom, feature);
            };
            fun.isFeatureConstant = false;
            fun.isZoomConstant = false;
        } else if (zoomDependent) {
            fun = function fun(zoom) {
                return innerFun(parameters, zoom);
            };
            fun.isFeatureConstant = true;
            fun.isZoomConstant = false;
        } else {
            fun = function fun(zoom, feature) {
                return innerFun(parameters, feature[parameters.property]);
            };
            fun.isFeatureConstant = false;
            fun.isZoomConstant = true;
        }
    }

    return fun;
}

function evaluateCategoricalFunction(parameters, input) {
    for (var i = 0; i < parameters.stops.length; i++) {
        if (input === parameters.stops[i][0]) {
            return parameters.stops[i][1];
        }
    }
    return parameters.stops[0][1];
}

function evaluateIntervalFunction(parameters, input) {
    for (var i = 0; i < parameters.stops.length; i++) {
        if (input < parameters.stops[i][0]) break;
    }
    return parameters.stops[Math.max(i - 1, 0)][1];
}

function evaluateExponentialFunction(parameters, input) {
    var base = parameters.base !== undefined ? parameters.base : 1;

    var i = 0;
    while (true) {
        if (i >= parameters.stops.length) break;else if (input <= parameters.stops[i][0]) break;else i++;
    }

    if (i === 0) {
        return parameters.stops[i][1];
    } else if (i === parameters.stops.length) {
        return parameters.stops[i - 1][1];
    } else {
        return interpolate(input, base, parameters.stops[i - 1][0], parameters.stops[i][0], parameters.stops[i - 1][1], parameters.stops[i][1]);
    }
}

function interpolate(input, base, inputLower, inputUpper, outputLower, outputUpper) {
    if (typeof outputLower === 'function') {
        return function () {
            var evaluatedLower = outputLower.apply(undefined, arguments);
            var evaluatedUpper = outputUpper.apply(undefined, arguments);
            return interpolate(input, base, inputLower, inputUpper, evaluatedLower, evaluatedUpper);
        };
    } else if (outputLower.length) {
        return interpolateArray(input, base, inputLower, inputUpper, outputLower, outputUpper);
    } else {
        return interpolateNumber(input, base, inputLower, inputUpper, outputLower, outputUpper);
    }
}

function interpolateNumber(input, base, inputLower, inputUpper, outputLower, outputUpper) {
    var difference = inputUpper - inputLower;
    var progress = input - inputLower;

    var ratio;
    if (base === 1) {
        ratio = progress / difference;
    } else {
        ratio = (Math.pow(base, progress) - 1) / (Math.pow(base, difference) - 1);
    }

    return outputLower * (1 - ratio) + outputUpper * ratio;
}

function interpolateArray(input, base, inputLower, inputUpper, outputLower, outputUpper) {
    var output = [];
    for (var i = 0; i < outputLower.length; i++) {
        output[i] = interpolateNumber(input, base, inputLower, inputUpper, outputLower[i], outputUpper[i]);
    }
    return output;
}

/**
 * Check if object is a definition of function type
 * @param  {Object}  obj object
 * @return {Boolean}
 * @memberOf MapboxUtil
 */
function isFunctionDefinition(obj) {
    return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.stops;
}

function interpolated(parameters) {
    return createFunction(parameters, 'exponential');
}

function piecewiseConstant(parameters) {
    return createFunction(parameters, 'interval');
}

/**
 * Load function types defined in object
 * @param  {Object[]} parameters parameters
 * @return {Object}   loaded object
 * @memberOf MapboxUtil
 */
function loadFunctionTypes(obj, argFn) {
    if (!obj) {
        return null;
    }
    var hit = false;
    if (Array.isArray(obj)) {
        var multResult = [],
            loaded;
        for (var i = 0; i < obj.length; i++) {
            loaded = loadFunctionTypes(obj[i], argFn);
            if (!loaded) {
                multResult.push(obj[i]);
            } else {
                multResult.push(loaded);
                hit = true;
            }
        }
        return hit ? multResult : obj;
    }
    var result = {
        '__fn_types_loaded': true
    },
        props = [],
        p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            props.push(p);
        }
    }

    for (var _i = 0, len = props.length; _i < len; _i++) {
        p = props[_i];
        if (isFunctionDefinition(obj[p])) {
            hit = true;
            result['_' + p] = obj[p];
            (function (_p) {
                Object.defineProperty(result, _p, {
                    get: function get$$1() {
                        if (!this['__fn_' + _p]) {
                            this['__fn_' + _p] = interpolated(this['_' + _p]);
                        }
                        return this['__fn_' + _p].apply(this, argFn());
                    },
                    set: function set$$1(v) {
                        this['_' + _p] = v;
                    },
                    configurable: true,
                    enumerable: true
                });
            })(p);
        } else {
            result[p] = obj[p];
        }
    }
    return hit ? result : obj;
}

/**
 * Get external resources in the function type
 * @param  {Object} t Function type definition
 * @return {String[]}   resouces
 * @memberOf MapboxUtil
 */
function getFunctionTypeResources(t) {
    if (!t || !t.stops) {
        return null;
    }
    var res = [];
    for (var i = 0, l = t.stops.length; i < l; i++) {
        res.push(t.stops[i][1]);
    }
    return res;
}

/**
 * @classdesc
 * Utilities from mapbox or implementations of mapbox specifications. It is static and should not be initiated.
 * @class
 * @category core
 * @name MapboxUtil
 */



var index$1 = Object.freeze({
	createFilter: createFilter,
	getFilterFeature: getFilterFeature,
	compileStyle: compileStyle,
	isFunctionDefinition: isFunctionDefinition,
	interpolated: interpolated,
	piecewiseConstant: piecewiseConstant,
	loadFunctionTypes: loadFunctionTypes,
	getFunctionTypeResources: getFunctionTypeResources
});

/**
 * @classdesc
 * Base class for all the symbolilzers, a symbolizers contains the following methods:
 * refresh: 刷新逻辑, 例如地图放大缩小时需要刷新像素坐标时
 * svg:     在svg/vml上的绘制逻辑
 * canvas:  在canvas上的绘制逻辑
 * show:    显示
 * hide:    隐藏
 * setZIndex:设置ZIndex
 * remove:  删除逻辑
 * test: 定义在类上, 测试传入的geometry和symbol是否应由该Symbolizer渲染
 * @class
 * @extends Class
 * @abstract
 * @protected
 */

var Symbolizer = function () {
    function Symbolizer() {
        classCallCheck(this, Symbolizer);
    }

    Symbolizer.prototype.getMap = function getMap() {
        return this.geometry.getMap();
    };

    Symbolizer.prototype.getPainter = function getPainter() {
        return this.painter;
    };

    /**
     * Test if the property is a property related with coloring
     * @param {String} prop - property name to test
     * @static
     * @function
     * @return {Boolean}
     */


    Symbolizer.testColor = function testColor(prop) {
        if (!prop || !isString(prop)) {
            return false;
        }
        if (Symbolizer.colorProperties.indexOf(prop) >= 0) {
            return true;
        }
        return false;
    };

    return Symbolizer;
}();

Symbolizer.resourceProperties = ['markerFile', 'polygonPatternFile', 'linePatternFile', 'markerFillPatternFile', 'markerLinePatternFile'];

Symbolizer.resourceSizeProperties = [['markerWidth', 'markerHeight'], [], [null, 'lineWidth'], [], [null, 'markerLineWidth']];

Symbolizer.numericalProperties = {
    'lineWidth': 1,
    'lineOpacity': 1,
    'lineDx': 1,
    'lineDy': 1,
    'polygonOpacity': 1,
    'markerWidth': 1,
    'markerHeight': 1,
    'markerDx': 1,
    'markerDy': 1,
    'markerOpacity': 1,
    'markerFillOpacity': 1,
    'markerLineWidth': 1,
    'markerLineOpacity': 1,
    'textSize': 1,
    'textOpacity': 1,
    'textHaloRadius': 1,
    'textWrapWidth': 1,
    'textLineSpacing': 1,
    'textDx': 1,
    'textDy': 1
};

/**
 * @property {String[]} colorProperties - Symbol properties related with coloring
 * @static
 * @constant
 */
Symbolizer.colorProperties = ['lineColor', 'polygonFill', 'markerFill', 'markerLineColor', 'textFill'];

/**
 * @classdesc
 * Base symbolizer class for all the symbolizers base on HTML5 Canvas2D
 * @abstract
 * @class
 * @protected
 * @memberOf symbolizer
 * @name CanvasSymbolizer
 * @extends {Symbolizer}
 */

var CanvasSymbolizer = function (_Symbolizer) {
    inherits(CanvasSymbolizer, _Symbolizer);

    function CanvasSymbolizer() {
        classCallCheck(this, CanvasSymbolizer);
        return possibleConstructorReturn(this, _Symbolizer.apply(this, arguments));
    }

    CanvasSymbolizer.prototype._prepareContext = function _prepareContext(ctx) {
        if (isNumber(this.symbol['opacity'])) {
            if (ctx.globalAlpha !== this.symbol['opacity']) {
                ctx.globalAlpha = this.symbol['opacity'];
            }
        } else if (ctx.globalAlpha !== 1) {
            ctx.globalAlpha = 1;
        }
    };

    //所有point symbolizer的共同的remove方法


    CanvasSymbolizer.prototype.remove = function remove() {};

    CanvasSymbolizer.prototype.setZIndex = function setZIndex() {};

    CanvasSymbolizer.prototype.show = function show() {};

    CanvasSymbolizer.prototype.hide = function hide() {};

    CanvasSymbolizer.prototype._defineStyle = function _defineStyle(style) {
        var _this2 = this;

        return loadFunctionTypes(style, function () {
            return [_this2.getMap().getZoom(), _this2.geometry.getProperties()];
        });
    };

    return CanvasSymbolizer;
}(Symbolizer);

/**
 * Represents a 2d point.<br>
 * Can be created in serveral ways:
 * @example
 * var point = new Point(1000, 1000);
 * @example
 * var point = new Point([1000,1000]);
 * @example
 * var point = new Point({x:1000, y:1000});
 * @category basic types
 */

var Point = function () {

    /**
     * @param {Number} x - x value
     * @param {Number} y - y value
     */
    function Point(x, y) {
        classCallCheck(this, Point);

        if (!isNil(x) && !isNil(y)) {
            /**
             * @property x {Number} - x value
             */
            this.x = x;
            /**
             * @property y {Number} - y value
             */
            this.y = y;
        } else if (!isNil(x.x) && !isNil(x.y)) {
            this.x = x.x;
            this.y = x.y;
        } else if (isArrayHasData(x)) {
            this.x = x[0];
            this.y = x[1];
        }
        if (this._isNaN()) {
            throw new Error('point is NaN');
        }
    }

    /**
     * Return abs value of the point
     * @return {Point} abs point
     */


    Point.prototype.abs = function abs() {
        return new Point(Math.abs(this.x), Math.abs(this.y));
    };

    //destructive abs


    Point.prototype._abs = function _abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    };

    /**
     * Returns a copy of the point
     * @return {Point} copy
     */


    Point.prototype.copy = function copy() {
        return new Point(this.x, this.y);
    };

    Point.prototype._round = function _round() {
        this.x = round(this.x);
        this.y = round(this.y);
        return this;
    };

    /**
     * Like math.round, rounding the point's xy.
     * @return {Point} rounded point
     */


    Point.prototype.round = function round$$1() {
        return new Point(round(this.x), round(this.y));
    };

    /**
     * Compare with another point to see whether they are equal.
     * @param {Point} c2 - point to compare
     * @return {Boolean}
     */


    Point.prototype.equals = function equals(p) {
        return this.x === p.x && this.y === p.y;
    };

    /**
     * Returns the distance between the current and the given point.
     * @param  {Point} point - another point
     * @return {Number} distance
     */


    Point.prototype.distanceTo = function distanceTo(point) {
        var x = point.x - this.x,
            y = point.y - this.y;
        return Math.sqrt(x * x + y * y);
    };

    //Destructive add


    Point.prototype._add = function _add(x, y) {
        if (x instanceof Point) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    };

    /**
     * Returns the result of addition of another point.
     * @param {Point} point - point to add
     * @return {Point} result
     */


    Point.prototype.add = function add(x, y) {
        var nx, ny;
        if (x instanceof Point) {
            nx = this.x + x.x;
            ny = this.y + x.y;
        } else {
            nx = this.x + x;
            ny = this.y + y;
        }
        return new Point(nx, ny);
    };

    Point.prototype._substract = function _substract(x, y) {
        if (x instanceof Point) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    };

    Point.prototype._sub = function _sub(x, y) {
        return this._substract(x, y);
    };

    /**
     * Returns the result of subtraction of another point.
     * @param {Point} point - point to substract
     * @return {Point} result
     */


    Point.prototype.substract = function substract(x, y) {
        var nx, ny;
        if (x instanceof Point) {
            nx = this.x - x.x;
            ny = this.y - x.y;
        } else {
            nx = this.x - x;
            ny = this.y - y;
        }
        return new Point(nx, ny);
    };

    /**
     * alias for substract
     * @param {Point} point - point to substract
     * @return {Point} result
     */


    Point.prototype.sub = function sub(x, y) {
        return this.substract(x, y);
    };

    //destructive multi


    Point.prototype._multi = function _multi(n) {
        this.x *= n;
        this.y *= n;
        return this;
    };

    /**
     * Returns the result of multiplication of the current point by the given number.
     * @param {Number} n - number to multi
     * @return {Point} result
     */


    Point.prototype.multi = function multi(n) {
        return new Point(this.x * n, this.y * n);
    };

    /**
     * Returns the result of division of the current point by the given number.
     * @param {Number} n - number to div
     * @return {Point} result
     */


    Point.prototype.div = function div(n) {
        return this.multi(1 / n);
    };

    Point.prototype._div = function _div(n) {
        return this._multi(1 / n);
    };

    /**
     * Whether the point is NaN
     * @return {Boolean}
     */


    Point.prototype._isNaN = function _isNaN() {
        return isNaN(this.x) || isNaN(this.y);
    };

    /**
     * Convert the point to a number array [x, y]
     * @return {Number[]} number array
     */


    Point.prototype.toArray = function toArray$$1() {
        return [this.x, this.y];
    };

    /**
     * Convert the point to a json object {x : .., y : ..}
     * @return {Object} json
     */


    Point.prototype.toJSON = function toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    };

    /**
     * Return the magitude of this point: this is the Euclidean
     * distance from the 0, 0 coordinate to this point's x and y
     * coordinates.
     * @return {Number} magnitude
     */


    Point.prototype.mag = function mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    /**
     * Calculate this point but as a unit vector from 0, 0, meaning
     * that the distance from the resulting point to the 0, 0
     * coordinate will be equal to 1 and the angle from the resulting
     * point to the 0, 0 coordinate will be the same as before.
     * @return {Point} unit vector point
     */


    Point.prototype.unit = function unit() {
        return this.copy()._unit();
    };

    Point.prototype._unit = function _unit() {
        this._div(this.mag());
        return this;
    };

    /**
     * Compute a perpendicular point, where the new y coordinate
     * is the old x coordinate and the new x coordinate is the old y
     * coordinate multiplied by -1
     * @return {Point} perpendicular point
     */


    Point.prototype.perp = function perp() {
        return this.copy()._perp();
    };

    Point.prototype._perp = function _perp() {
        var y = this.y;
        this.y = this.x;
        this.x = -y;
        return this;
    };

    return Point;
}();

/**
 * Whether the color is a gradient
 * @param  {Object}  g - color to test
 * @return {Boolean}
 * @memberOf Util
 */
function isGradient(g) {
    return g && g['colorStops'];
}

/**
 * Get stamp of a gradient color object.
 * @param  {Object} g gradient color object
 * @return {String}     gradient stamp
 * @memberOf Util
 */
function getGradientStamp(g) {
    var keys = [g['type']];
    if (g['places']) {
        keys.push(g['places'].join());
    }
    if (g['colorStops']) {
        var stops = [];
        for (var i = g['colorStops'].length - 1; i >= 0; i--) {
            stops.push(g['colorStops'][i].join());
        }
        keys.push(stops.join(','));
    }
    return keys.join('_');
}

/**
 * Get stamp of a symbol
 * @param  {Object|Object[]} symbol symbol
 * @return {String}        symbol's stamp
 * @memberOf Util
 */
function getSymbolStamp(symbol) {
    var keys = [];
    if (Array.isArray(symbol)) {
        for (var i = 0; i < symbol.length; i++) {
            keys.push(getSymbolStamp(symbol[i]));
        }
        return '[ ' + keys.join(' , ') + ' ]';
    }
    for (var p in symbol) {
        if (hasOwn(symbol, p)) {
            if (!isFunction(symbol[p])) {
                if (isGradient(symbol[p])) {
                    keys.push(p + '=' + getGradientStamp(symbol[p]));
                } else {
                    keys.push(p + '=' + symbol[p]);
                }
            }
        }
    }
    return keys.join(';');
}

/**
 * Reduce opacity of the color by ratio
 * @param  {Object|Object[]} symbol symbols to set
 * @param  {Number} ratio  ratio of opacity to reduce
 * @return {Object|Object[]}      new symbol or symbols
 * @memberOf Util
 */
function lowerSymbolOpacity(symbol, ratio) {
    function s(_symbol, _ratio) {
        var op = _symbol['opacity'];
        if (isNil(op)) {
            _symbol['opacity'] = _ratio;
        } else {
            _symbol['opacity'] *= _ratio;
        }
    }
    var lower;
    if (Array.isArray(symbol)) {
        lower = [];
        for (var i = 0; i < symbol.length; i++) {
            var d = extend({}, symbol[i]);
            s(d, ratio);
            lower.push(d);
        }
    } else {
        lower = extend({}, symbol);
        s(lower, ratio);
    }
    return lower;
}

/**
 * Merges the properties of sources into the symbol. <br>
 * @param  {Object|Object[]} symbol symbol to extend
 * @param  {...Object} src - sources
 * @return {Object|Object[]}        merged symbol
 * @memberOf Util
 */
function extendSymbol(symbol) {
    var sources = Array.prototype.slice.call(arguments, 1);
    if (!sources || !sources.length) {
        sources = [{}];
    }
    if (Array.isArray(symbol)) {
        var s, dest;
        var result = [];
        for (var i = 0, l = symbol.length; i < l; i++) {
            s = symbol[i];
            dest = {};
            for (var ii = 0, ll = sources.length; ii < ll; ii++) {
                if (!Array.isArray(sources[ii])) {
                    extend(dest, s, sources[ii] ? sources[ii] : {});
                } else if (!isNil(sources[ii][i])) {
                    extend(dest, s, sources[ii][i]);
                } else {
                    extend(dest, s ? s : {});
                }
            }
            result.push(dest);
        }
        return result;
    } else {
        var args = [{}, symbol];
        args.push.apply(args, sources);
        return extend.apply(this, args);
    }
}

/**
 * Represents a size.
 * @category basic types
 */

var Size = function () {

    /**
     * @param {Number} width - width value
     * @param {Number} height - height value
     */
    function Size(width, height) {
        classCallCheck(this, Size);

        /**
         * @property {Number} width - width
         */
        this.width = width;
        /**
         * @property {Number} height - height
         */
        this.height = height;
    }

    /**
     * Returns a copy of the size
     * @return {Size} copy
     */


    Size.prototype.copy = function copy() {
        return new Size(this['width'], this['height']);
    };

    /**
     * Returns the result of addition of another size.
     * @param {Size} size - size to add
     * @return {Size} result
     */


    Size.prototype.add = function add(size) {
        return new Size(this['width'] + size['width'], this['height'] + size['height']);
    };

    /**
     * Compare with another size to see whether they are equal.
     * @param {Size} size - size to compare
     * @return {Boolean}
     */


    Size.prototype.equals = function equals(size) {
        return this['width'] === size['width'] && this['height'] === size['height'];
    };

    /**
     * Returns the result of multiplication of the current size by the given number.
     * @param {Number} ratio - ratio to multi
     * @return {Size} result
     */


    Size.prototype.multi = function multi(ratio) {
        return new Size(this['width'] * ratio, this['height'] * ratio);
    };

    Size.prototype._multi = function _multi(ratio) {
        this['width'] *= ratio;
        this['height'] *= ratio;
        return this;
    };

    Size.prototype._round = function _round() {
        this['width'] = round(this['width']);
        this['height'] = round(this['height']);
        return this;
    };

    /**
     * Converts the size object to a [Point]{Point}
     * @return {Point} point
     */


    Size.prototype.toPoint = function toPoint() {
        return new Point(this['width'], this['height']);
    };

    /**
     * Converts the size object to an array [width, height]
     * @return {Number[]}
     */


    Size.prototype.toArray = function toArray$$1() {
        return [this['width'], this['height']];
    };

    /**
     * Convert the size object to a json object {width : .., height : ..}
     * @return {Object} json
     */


    Size.prototype.toJSON = function toJSON() {
        return {
            'width': this['width'],
            'height': this['height']
        };
    };

    return Size;
}();

/**
 * @classdesc
 * Utilities methods for Strings used internally. It is static and should not be initiated.
 * @class
 * @static
 * @category core
 * @name StringUtil
 */

/**
 * Trim the string
 * @param {String} str
 * @return {String}
 * @memberOf StringUtil
 */
function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Split string by specified char
 * @param {String} chr - char to split
 * @return {String[]}
 * @memberOf StringUtil
 */
function splitWords(chr) {
    return trim(chr).split(/\s+/);
}

/**
 * Gets size in pixel of the text with a certain font.
 * @param {String} text - text to measure
 * @param {String} font - font of the text, same as the CSS font.
 * @return {Size}
 * @memberOf StringUtil
 */
function stringLength(text, font) {
    var ruler = _getDomRuler('span');
    ruler.style.font = font;
    ruler.innerHTML = text;
    var result = new Size(ruler.clientWidth, ruler.clientHeight);
    //if not removed, the canvas container on chrome will turn to unexpected blue background.
    //Reason is unknown.
    removeDomNode(ruler);
    return result;
}

/**
 * Split content by wrapLength 根据长度分割文本
 * @param {String} content      - text to split
 * @param {Number} textLength   - width of the text, provided to prevent expensive repeated text measuring
 * @param {Number} wrapWidth    - width to wrap
 * @return {String[]}
 * @memberOf StringUtil
 */
function splitContent(content, textLength, wrapWidth) {
    var rowNum = Math.ceil(textLength / wrapWidth);
    var avgLen = textLength / content.length;
    var approxLen = Math.floor(wrapWidth / avgLen);
    var result = [];
    for (var i = 0; i < rowNum; i++) {
        if (i < rowNum - 1) {
            result.push(content.substring(i * approxLen, (i + 1) * approxLen));
        } else {
            result.push(content.substring(i * approxLen));
        }
    }
    return result;
}

var contentExpRe = /\{([\w_]+)\}/g;

/**
 * Replace variables wrapped by square brackets ({foo}) with actual values in props.
 * @example
 *     // will returns 'John is awesome'
 *     var actual = replaceVariable('{foo} is awesome', {'foo' : 'John'});
 * @param {String} str      - string to replace
 * @param {Object} props    - variable value properties
 * @return {String}
 * @memberOf StringUtil
 */
function replaceVariable(str, props) {
    if (!isObject(props) || !isString(str)) {
        return str;
    }
    return str.replace(contentExpRe, function (str, key) {
        var value = props[key];
        if (isNil(value)) {
            return str;
        }
        return value;
    });
}

/**
 * Gets text's align point according to the horizontalAlignment and verticalAlignment
 * @param  {Size} size                  - text size
 * @param  {String} horizontalAlignment - horizontalAlignment: left/middle/right
 * @param  {String} verticalAlignment   - verticalAlignment: top/middle/bottom
 * @return {Point}
 * @memberOf StringUtil
 */
function getAlignPoint(size, horizontalAlignment, verticalAlignment) {
    var width = size['width'],
        height = size['height'];
    var alignW, alignH;
    if (horizontalAlignment === 'left') {
        alignW = -width;
    } else if (horizontalAlignment === 'middle') {
        alignW = -width / 2;
    } else if (horizontalAlignment === 'right') {
        alignW = 0;
    }
    if (verticalAlignment === 'top') {
        alignH = -height;
    } else if (verticalAlignment === 'middle') {
        alignH = -height / 2;
    } else if (verticalAlignment === 'bottom') {
        alignH = 0;
    }
    return new Point(alignW, alignH);
}

/**
 * Returns CSS Font from a symbol with text styles.
 * @param  {Object} style symbol with text styles
 * @return {String}       CSS Font String
 * @memberOf StringUtil
 */
function getFont(style) {
    if (style['textFont']) {
        return style['textFont'];
    } else {
        return (style['textStyle'] ? style['textStyle'] + ' ' : '') + (style['textWeight'] ? style['textWeight'] + ' ' : '') + style['textSize'] + 'px ' + (style['textFaceName'][0] === '"' ? style['textFaceName'] : '"' + style['textFaceName'] + '"');
    }
}

/**
 * Split a text to multiple rows according to the style.
 * @param {String} text     - text to split
 * @param {Object} style    - text style
 * @return {Object[]} the object's structure: {rowNum: rowNum, textSize: textSize, rows: textRows}
 * @memberOf StringUtil
 */
function splitTextToRow(text, style) {
    var font = getFont(style),
        lineSpacing = style['textLineSpacing'] || 0,
        rawTextSize = stringLength(text, font),
        textWidth = rawTextSize['width'],
        textHeight = rawTextSize['height'],
        wrapChar = style['textWrapCharacter'],
        wrapWidth = style['textWrapWidth'],
        textRows = [];
    if (!wrapWidth || wrapWidth > textWidth) {
        wrapWidth = textWidth;
    }
    if (!isString(text)) {
        text += '';
    }
    var actualWidth = 0,
        size;
    if (wrapChar && text.indexOf(wrapChar) >= 0) {
        var texts = text.split(wrapChar),
            t,
            tSize,
            tWidth,
            contents,
            ii,
            ll;
        for (var i = 0, l = texts.length; i < l; i++) {
            t = texts[i];
            //TODO stringLength is expensive, should be reduced here.
            tSize = stringLength(t, font);
            tWidth = tSize['width'];
            if (tWidth > wrapWidth) {
                contents = splitContent(t, tWidth, wrapWidth);
                for (ii = 0, ll = contents.length; ii < ll; ii++) {
                    size = stringLength(contents[ii], font);
                    if (size['width'] > actualWidth) {
                        actualWidth = size['width'];
                    }
                    textRows.push({
                        'text': contents[ii],
                        'size': size
                    });
                }
            } else {
                if (tSize['width'] > actualWidth) {
                    actualWidth = tSize['width'];
                }
                textRows.push({
                    'text': t,
                    'size': tSize
                });
            }
        }
    } else if (textWidth > wrapWidth) {
        var splitted = splitContent(text, textWidth, wrapWidth);
        for (var _i = 0; _i < splitted.length; _i++) {
            size = stringLength(splitted[_i], font);
            if (size['width'] > actualWidth) {
                actualWidth = size['width'];
            }
            textRows.push({
                'text': splitted[_i],
                'size': size
            });
        }
    } else {
        if (rawTextSize['width'] > actualWidth) {
            actualWidth = rawTextSize['width'];
        }
        textRows.push({
            'text': text,
            'size': rawTextSize
        });
    }

    var rowNum = textRows.length;
    var textSize = new Size(actualWidth, textHeight * rowNum + lineSpacing * (rowNum - 1));
    return {
        'total': rowNum,
        'size': textSize,
        'rows': textRows,
        'rawSize': rawTextSize
    };
}

var strings = Object.freeze({
	trim: trim,
	splitWords: splitWords,
	stringLength: stringLength,
	splitContent: splitContent,
	replaceVariable: replaceVariable,
	getAlignPoint: getAlignPoint,
	getFont: getFont,
	splitTextToRow: splitTextToRow
});

/**
 * DOM utilities used internally.
 * Learned a lot from Leaflet.DomUtil
 * @class
 * @category core
 * @name DomUtil
 */

var first = function first(props) {
    return props[0];
};

/**
 * From Leaflet.DomUtil
 * Goes through the array of style names and returns the first name
 * that is a valid style name for an element. If no such name is found,
 * it returns false. Useful for vendor-prefixed styles like `transform`.
 * @param  {String[]} props
 * @return {Boolean}
 * @memberOf DomUtil
 * @private
 */
var testProp = isNode ? first : function (props) {

    var style = document.documentElement.style;

    for (var i = 0; i < props.length; i++) {
        if (props[i] in style) {
            return props[i];
        }
    }
    return false;
};

// prefix style property names

/**
 * Vendor-prefixed fransform style name (e.g. `'webkitTransform'` for WebKit).
 * @property {String} TRANSFORM
 * @memberOf DomUtil
 * @type {String}
 */
var TRANSFORM = testProp(['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

/**
 * Vendor-prefixed tfransform-origin name (e.g. `'webkitTransformOrigin'` for WebKit).
 * @property {String} TRANSFORMORIGIN
 * @memberOf DomUtil
 * @type {String}
 */
var TRANSFORMORIGIN = testProp(['transformOrigin', 'WebkitTransformOrigin', 'OTransformOrigin', 'MozTransformOrigin', 'msTransformOrigin']);

/**
 * Vendor-prefixed transition name (e.g. `'WebkitTransition'` for WebKit).
 * @property {String} TRANSITION
 * @memberOf DomUtil
 * @type {String}
 */
var TRANSITION = testProp(['transition', 'WebkitTransition', 'OTransition', 'MozTransition', 'msTransition']);

/**
 * Vendor-prefixed filter name (e.g. `'WebkitFilter'` for WebKit).
 * @property {String} FILTER
 * @memberOf DomUtil
 * @type {String}
 */
var CSSFILTER = testProp(['filter', 'WebkitFilter', 'OFilter', 'MozFilter', 'msFilter']);

/**
 * Create a html element.
 * @param {String} tagName
 * @returns {HTMLElement}
 * @memberOf DomUtil
 */
function createEl(tagName, className) {
    var el = document.createElement(tagName);
    if (className) {
        setClass(el, className);
    }
    return el;
}

/**
 * Create a html element on the specified container
 * @param {String} tagName
 * @param {String} style - css styles
 * @param {HTMLElement} container
 * @return {HTMLElement}
 * @memberOf DomUtil
 */
function createElOn(tagName, style, container) {
    var el = createEl(tagName);
    if (style) {
        setStyle(el, style);
    }
    if (container) {
        container.appendChild(el);
    }
    return el;
}

/**
 * Removes a html element.
 * @param {HTMLElement} node
 * @memberOf DomUtil
 */
function removeDomNode(node) {
    if (!node) {
        return this;
    }
    if (Browser$1.ielt9 || Browser$1.ie9) {
        //fix memory leak in IE9-
        //http://com.hemiola.com/2009/11/23/memory-leaks-in-ie8/
        var d = createEl('div');
        d.appendChild(node);
        d.innerHTML = '';
        d = null;
    } else if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
    return this;
}

/**
 * Adds a event listener to the dom element.
 * @param {HTMLElement} obj     - dom element to listen on
 * @param {String} typeArr      - event types, seperated by space
 * @param {Function} handler    - listener function
 * @param {Object} context      - function context
 * @memberOf DomUtil
 */
function addDomEvent(obj, typeArr, handler, context) {
    if (!obj || !typeArr || !handler) {
        return this;
    }
    var eventHandler = function eventHandler(e) {
        if (!e) {
            e = window.event;
        }
        handler.call(context || obj, e);
        return;
    };
    var types = typeArr.split(' ');
    for (var i = types.length - 1; i >= 0; i--) {
        var type = types[i];
        if (!type) {
            continue;
        }

        if (!obj['Z__' + type]) {
            obj['Z__' + type] = [];
        }
        var hit = listensDomEvent(obj, type, handler);
        if (hit >= 0) {
            removeDomEvent(obj, type, handler);
        }
        obj['Z__' + type].push({
            callback: eventHandler,
            src: handler
        });
        if ('addEventListener' in obj) {
            //滚轮事件的特殊处理
            if (type === 'mousewheel' && document['mozHidden'] !== undefined) {
                type = 'DOMMouseScroll';
            }
            obj.addEventListener(type, eventHandler, false);
        } else if ('attachEvent' in obj) {
            obj.attachEvent('on' + type, eventHandler);
        }
    }
    return this;
}

/**
 * Removes event listener from a dom element
 * @param {HTMLElement} obj         - dom element
 * @param {String} typeArr          - event types, separated by space
 * @param {Function} handler        - listening function
 * @memberOf DomUtil
 */
function removeDomEvent(obj, typeArr, handler) {
    function doRemove(type, callback) {
        if ('removeEventListener' in obj) {
            //mouse wheel in firefox
            if (type === 'mousewheel' && document['mozHidden'] !== undefined) {
                type = 'DOMMouseScroll';
            }
            obj.removeEventListener(type, callback, false);
        } else if ('detachEvent' in obj) {
            obj.detachEvent('on' + type, callback);
        }
    }
    if (!obj || !typeArr) {
        return this;
    }
    var types = typeArr.split(' ');
    for (var i = types.length - 1; i >= 0; i--) {
        var type = types[i];
        if (!type) {
            continue;
        }
        //remove all the listeners if handler is not given.
        if (!handler && obj['Z__' + type]) {
            var handlers = obj['Z__' + type];
            for (var j = 0, jlen = handlers.length; j < jlen; j++) {
                doRemove(handlers[j].callback);
            }
            delete obj['Z__' + type];
            return this;
        }
        var hit = listensDomEvent(obj, type, handler);
        if (hit < 0) {
            return this;
        }
        var hitHandler = obj['Z__' + type][hit];
        doRemove(type, hitHandler.callback);
        obj['Z__' + type].splice(hit, 1);
    }
    return this;
}

/**
 * Check if event type of the dom is listened by the handler
 * @param {HTMLElement} obj     - dom element to check
 * @param {String} typeArr      - event
 * @param {Function} handler    - the listening function
 * @return {Number} - the handler's index in the listener chain, returns -1 if not.
 * @memberOf DomUtil
 */
function listensDomEvent(obj, type, handler) {
    if (!obj || !obj['Z__' + type] || !handler) {
        return -1;
    }
    var handlers = obj['Z__' + type];
    for (var i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i].src === handler) {
            return i;
        }
    }
    return -1;
}

/**
 * Prevent default behavior of the browser. <br/>
 * preventDefault Cancels the event if it is cancelable, without stopping further propagation of the event.
 * @param {Event} event - browser event
 * @memberOf DomUtil
 */
function preventDefault(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
    return this;
}

/**
 * Stop browser event propagation
 * @param  {Event} e - browser event.
 * @memberOf DomUtil
 */
function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    return this;
}

function preventSelection(dom) {
    dom.onselectstart = function () {
        return false;
    };
    dom.ondragstart = function () {
        return false;
    };
    dom.setAttribute('unselectable', 'on');
    return this;
}

/**
 * Get the dom element's current position or offset its position by offset
 * @param  {HTMLElement} dom - HTMLElement
 * @param  {Point} [offset=null] - position to set.
 * @return {Point} - dom element's current position if offset is null.
 * @memberOf DomUtil
 */
function offsetDom(dom, offset) {
    if (!dom) {
        return null;
    }

    if (Browser$1.any3d) {
        setTransform(dom, offset);
    } else {
        dom.style.left = offset.x + 'px';
        dom.style.top = offset.y + 'px';
    }
    return offset;
}

/**
 * 获取dom对象在页面上的屏幕坐标
 * @param  {HTMLElement} obj Dom对象
 * @return {Object}     屏幕坐标
 * @memberOf DomUtil
 */
function getPagePosition(obj) {
    var docEl = document.documentElement;
    var rect = obj.getBoundingClientRect();
    return new Point(rect['left'] + docEl['scrollLeft'], rect['top'] + docEl['scrollTop']);
}

/**
 * 获取鼠标在容器上相对容器左上角的坐标值
 * @param {Event} ev  触发的事件
 * @return {Point} left:鼠标在页面上的横向位置, top:鼠标在页面上的纵向位置
 * @memberOf DomUtil
 */
function getEventContainerPoint(ev, dom) {
    if (!ev) {
        ev = window.event;
    }
    var rect = dom.getBoundingClientRect();

    return new Point(ev.clientX - rect.left - dom.clientLeft, ev.clientY - rect.top - dom.clientTop);
}

/**
 * 为dom设置样式
 * @param {HTMLElement} dom dom节点
 * @param {String} strCss 样式字符串
 * @memberOf DomUtil
 */
function setStyle(dom, strCss) {
    function endsWith(str, suffix) {
        var l = str.length - suffix.length;
        return l >= 0 && str.indexOf(suffix, l) === l;
    }
    var style = dom.style,
        cssText = style.cssText;
    if (!endsWith(cssText, ';')) {
        cssText += ';';
    }
    dom.style.cssText = cssText + strCss;
    return this;
}

/**
 * 清空dom样式
 * @param {HTMLElement} dom dom节点
 * @memberOf DomUtil
 */
function removeStyle(dom) {
    dom.style.cssText = '';
    return this;
}

/**
 * 为dom添加样式
 * @param {HTMLElement} dom dom节点
 * @param {String} attr 样式标签
 * @param {String} value 样式值
 * @memberOf DomUtil
 */
function addStyle(dom, attr, value) {
    var css = dom.style.cssText;
    if (attr && value) {
        var newStyle = attr + ':' + value + ';';
        dom.style.cssText = css + newStyle;
    }
    return this;
}

/**
 * 判断元素是否包含class
 * @param {HTMLElement} el html元素
 * @param {String} name class名称
 * @memberOf DomUtil
 */
function hasClass(el, name) {
    if (el.classList !== undefined) {
        return el.classList.contains(name);
    }
    var className = getClass(el);
    return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
}

/**
 * 为dom添加class
 * @param {HTMLElement} el html元素
 * @param {String} name class名称
 * @memberOf DomUtil
 */
function addClass(el, name) {
    if (el.classList !== undefined) {
        var classes = splitWords(name);
        for (var i = 0, len = classes.length; i < len; i++) {
            el.classList.add(classes[i]);
        }
    } else if (!hasClass(el, name)) {
        var className = getClass(el);
        setClass(el, (className ? className + ' ' : '') + name);
    }
    return this;
}

/**
 * 移除dom class
 * @param {HTMLElement} el html元素
 * @param {String} name class名称
 * @memberOf DomUtil
 */
function removeClass(el, name) {
    if (el.classList !== undefined) {
        el.classList.remove(name);
    } else {
        setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
    }
    return this;
}

/**
 * 设置dom class
 * @param {HTMLElement} el html元素
 * @param {String} name class名称
 * @memberOf DomUtil
 */
function setClass(el, name) {
    if (isNil(el.className.baseVal)) {
        el.className = name;
    } else {
        el.className.baseVal = name;
    }
    return this;
}

/**
 * 获取dom class
 * @param {String} name class名称
 * @retrun {String} class字符串
 * @memberOf DomUtil
 */
function getClass(el) {
    return isNil(el.className.baseVal) ? el.className : el.className.baseVal;
}

// Borrowed from Leaflet
// @function setOpacity(el: HTMLElement, opacity: Number)
// Set the opacity of an element (including old IE support).
// `opacity` must be a number from `0` to `1`.
function setOpacity(el, value) {
    if ('opacity' in el.style) {
        el.style.opacity = value;
    } else if ('filter' in el.style) {
        _setOpacityIE(el, value);
    }
    return this;
}

function _setOpacityIE(el, value) {
    var filter = false,
        filterName = 'DXImageTransform.Microsoft.Alpha';

    // filters collection throws an error if we try to retrieve a filter that doesn't exist
    try {
        filter = el.filters.item(filterName);
    } catch (e) {
        // don't set opacity to 1 if we haven't already set an opacity,
        // it isn't needed and breaks transparent pngs.
        if (value === 1) {
            return;
        }
    }

    value = Math.round(value * 100);

    if (filter) {
        filter.Enabled = value !== 100;
        filter.Opacity = value;
    } else {
        el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
    }
}

/**
 * Copy the source canvas
 * @param  {Element|Canvas} src - source canvas
 * @return {Element|Canvas}     target canvas
 * @memberOf DomUtil
 */
function copyCanvas(src) {
    if (isNode) {
        return null;
    }
    var target = createEl('canvas');
    target.width = src.width;
    target.height = src.height;
    target.getContext('2d').drawImage(src, 0, 0);
    return target;
}

/**
 * Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
 * @param {HTMLElement} el
 * @param {Point} offset
 * @memberOf DomUtil
 */
function setTransform(el, offset) {
    var pos = offset || new Point(0, 0);
    el.style[TRANSFORM] = Browser$1.ie3d ? 'translate(' + pos.x + 'px,' + pos.y + 'px)' : 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)';

    return this;
}

function setTransformMatrix(el, m) {
    el.style[TRANSFORM] = 'matrix(' + m.join() + ')';
    return this;
}

function removeTransform(el) {
    el.style[TRANSFORM] = null;
    return this;
}

function isHTML(str) {
    return (/<[a-z\][\s\S]*>/i.test(str)
    );
}

function measureDom(parentTag, dom) {
    var ruler = _getDomRuler(parentTag);
    if (isString(dom)) {
        ruler.innerHTML = dom;
    } else {
        ruler.appendChild(dom);
    }
    var result = new Size(ruler.clientWidth, ruler.clientHeight);
    removeDomNode(ruler);
    return result;
}

function _getDomRuler(tag) {
    var span = document.createElement(tag);
    span.style.cssText = 'position:absolute;left:-10000px;top:-10000px;';
    document.body.appendChild(span);
    return span;
}

/**
 * Alias for [addDomEvent]{@link DomUtil.addDomEvent}
 * @param {HTMLElement} obj     - dom element to listen on
 * @param {String} typeArr      - event types, seperated by space
 * @param {Function} handler    - listener function
 * @param {Object} context      - function context
 * @static
 * @function
 * @return {DomUtil}
 * @memberOf DomUtil
 */
var on = addDomEvent;

/**
 * Alias for [removeDomEvent]{@link DomUtil.removeDomEvent}
 * @param {HTMLElement} obj         - dom element
 * @param {String} typeArr          - event types, separated by space
 * @param {Function} handler        - listening function
 * @static
 * @function
 * @return {DomUtil}
 * @memberOf DomUtil
 */
var off = removeDomEvent;

var dom = Object.freeze({
	TRANSFORM: TRANSFORM,
	TRANSFORMORIGIN: TRANSFORMORIGIN,
	TRANSITION: TRANSITION,
	CSSFILTER: CSSFILTER,
	createEl: createEl,
	createElOn: createElOn,
	removeDomNode: removeDomNode,
	addDomEvent: addDomEvent,
	removeDomEvent: removeDomEvent,
	listensDomEvent: listensDomEvent,
	preventDefault: preventDefault,
	stopPropagation: stopPropagation,
	preventSelection: preventSelection,
	offsetDom: offsetDom,
	getPagePosition: getPagePosition,
	getEventContainerPoint: getEventContainerPoint,
	setStyle: setStyle,
	removeStyle: removeStyle,
	addStyle: addStyle,
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	setClass: setClass,
	getClass: getClass,
	setOpacity: setOpacity,
	copyCanvas: copyCanvas,
	setTransform: setTransform,
	setTransformMatrix: setTransformMatrix,
	removeTransform: removeTransform,
	isHTML: isHTML,
	measureDom: measureDom,
	_getDomRuler: _getDomRuler,
	on: on,
	off: off
});

var DEFAULT_STROKE_COLOR = '#000';
var DEFAULT_FILL_COLOR = 'rgba(255,255,255,0)';
var DEFAULT_TEXT_COLOR = '#000';

var Canvas = {
    createCanvas: function createCanvas(width, height, canvasClass) {
        var canvas;
        if (!isNode) {
            canvas = createEl('canvas');
            canvas.width = width;
            canvas.height = height;
        } else {
            //can be node-canvas or any other canvas mock
            canvas = new canvasClass(width, height);
        }
        return canvas;
    },
    setDefaultCanvasSetting: function setDefaultCanvasSetting(ctx) {
        ctx.lineWidth = 1;
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.fillStyle = 'rgba(255,255,255,0)';
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        var fontSize = 11;
        ctx.font = fontSize + 'px monospace';
        ctx.shadowBlur = null;
        ctx.shadowColor = null;
        if (ctx.setLineDash) {
            ctx.setLineDash([]);
        }
        ctx.globalAlpha = 1;
    },
    prepareCanvasFont: function prepareCanvasFont(ctx, style) {
        ctx.textBaseline = 'top';
        ctx.font = getFont(style);
        var fill = style['textFill'];
        if (!fill) {
            fill = DEFAULT_TEXT_COLOR;
        }
        ctx.fillStyle = Canvas.getRgba(fill, style['textOpacity']);
    },
    prepareCanvas: function prepareCanvas(ctx, style, resources) {
        if (!style) {
            return;
        }
        var strokeWidth = style['lineWidth'];
        if (!isNil(strokeWidth) && ctx.lineWidth !== strokeWidth) {
            ctx.lineWidth = strokeWidth;
        }
        var strokeColor = style['linePatternFile'] || style['lineColor'] || DEFAULT_STROKE_COLOR;
        if (isCssUrl(strokeColor) && resources) {
            Canvas._setStrokePattern(ctx, strokeColor, strokeWidth, resources);
            //line pattern will override stroke-dasharray
            style['lineDasharray'] = [];
        } else if (isGradient(strokeColor)) {
            if (style['lineGradientExtent']) {
                ctx.strokeStyle = Canvas._createGradient(ctx, strokeColor, style['lineGradientExtent']);
            } else {
                ctx.strokeStyle = 'rgba(0,0,0,1)';
            }
        } else /*if (ctx.strokeStyle !== strokeColor)*/{
                ctx.strokeStyle = strokeColor;
            }
        if (style['lineJoin']) {
            ctx.lineJoin = style['lineJoin'];
        }
        if (style['lineCap']) {
            ctx.lineCap = style['lineCap'];
        }
        if (ctx.setLineDash && isArrayHasData(style['lineDasharray'])) {
            ctx.setLineDash(style['lineDasharray']);
        }
        var fill = style['polygonPatternFile'] || style['polygonFill'] || DEFAULT_FILL_COLOR;
        if (isCssUrl(fill)) {
            var fillImgUrl = extractCssUrl(fill);
            var fillTexture = resources.getImage([fillImgUrl, null, null]);
            if (!fillTexture) {
                //if the linestring has a arrow and a linePatternFile, polygonPatternFile will be set with the linePatternFile.
                fillTexture = resources.getImage([fillImgUrl + '-texture', null, strokeWidth]);
            }
            if (isSVG(fillImgUrl) && fillTexture instanceof Image && (Browser$1.edge || Browser$1.ie)) {
                //opacity of svg img painted on canvas is always 1, so we paint svg on a canvas at first.
                var w = fillTexture.width || 20,
                    h = fillTexture.height || 20;
                var canvas = Canvas.createCanvas(w, h);
                Canvas.image(canvas.getContext('2d'), fillTexture, 0, 0, w, h);
                fillTexture = canvas;
            }
            if (!fillTexture) {
                if (!Browser$1.phantomjs && console) {
                    console.warn('img not found for', fillImgUrl);
                }
            } else {
                ctx.fillStyle = ctx.createPattern(fillTexture, 'repeat');
            }
        } else if (isGradient(fill)) {
            if (style['polygonGradientExtent']) {
                ctx.fillStyle = Canvas._createGradient(ctx, fill, style['polygonGradientExtent']);
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0)';
            }
        } else /*if (ctx.fillStyle !== fill)*/{
                ctx.fillStyle = fill;
            }
    },
    _createGradient: function _createGradient(ctx, g, extent) {
        var gradient = null,
            places = g['places'],
            min = extent.getMin(),
            max = extent.getMax(),
            width = extent.getWidth(),
            height = extent.getHeight();
        if (!g['type'] || g['type'] === 'linear') {
            if (!places) {
                places = [min.x, min.y, max.x, min.y];
            } else {
                if (places.length !== 4) {
                    throw new Error('A linear gradient\'s places should have 4 numbers.');
                }
                places = [min.x + places[0] * width, min.y + places[1] * height, min.x + places[2] * width, min.y + places[3] * height];
            }
            gradient = ctx.createLinearGradient.apply(ctx, places);
        } else if (g['type'] === 'radial') {
            if (!places) {
                var c = extent.getCenter()._round();
                places = [c.x, c.y, Math.abs(c.x - min.x), c.x, c.y, 0];
            } else {
                if (places.length !== 6) {
                    throw new Error('A radial gradient\'s places should have 6 numbers.');
                }
                places = [min.x + places[0] * width, min.y + places[1] * height, width * places[2], min.x + places[3] * width, min.y + places[4] * height, width * places[5]];
            }
            gradient = ctx.createRadialGradient.apply(ctx, places);
        }
        g['colorStops'].forEach(function (stop) {
            gradient.addColorStop.apply(gradient, stop);
        });
        return gradient;
    },
    _setStrokePattern: function _setStrokePattern(ctx, strokePattern, strokeWidth, resources) {
        var imgUrl = extractCssUrl(strokePattern);
        var imageTexture;
        if (isNode) {
            imageTexture = resources.getImage([imgUrl, null, strokeWidth]);
        } else {
            var key = imgUrl + '-texture-' + strokeWidth;
            imageTexture = resources.getImage(key);
            if (!imageTexture) {
                var imageRes = resources.getImage([imgUrl, null, null]);
                if (imageRes) {
                    var w;
                    if (!imageRes.width || !imageRes.height) {
                        w = strokeWidth;
                    } else {
                        w = round(imageRes.width * strokeWidth / imageRes.height);
                    }
                    var patternCanvas = Canvas.createCanvas(w, strokeWidth, ctx.canvas.constructor);
                    Canvas.image(patternCanvas.getContext('2d'), imageRes, 0, 0, w, strokeWidth);
                    resources.addResource([key, null, strokeWidth], patternCanvas);
                    imageTexture = patternCanvas;
                }
            }
        }
        if (imageTexture) {
            ctx.strokeStyle = ctx.createPattern(imageTexture, 'repeat');
        } else if (!Browser$1.phantomjs && console) {
            console.warn('img not found for', imgUrl);
        }
    },
    clearRect: function clearRect(ctx, x1, y1, x2, y2) {
        ctx.clearRect(x1, y1, x2, y2);
    },
    fillCanvas: function fillCanvas(ctx, fillOpacity, x, y) {
        if (fillOpacity === 0) {
            return;
        }
        var isPattern = Canvas._isPattern(ctx.fillStyle);
        if (isNil(fillOpacity)) {
            fillOpacity = 1;
        }
        var alpha;
        if (fillOpacity < 1) {
            alpha = ctx.globalAlpha;
            ctx.globalAlpha *= fillOpacity;
        }
        if (isPattern) {
            // x = round(x);
            // y = round(y);
            ctx.translate(x, y);
        }
        ctx.fill();
        if (isPattern) {
            ctx.translate(-x, -y);
        }
        if (fillOpacity < 1) {
            ctx.globalAlpha = alpha;
        }
    },


    // hexColorRe: /^#([0-9a-f]{6}|[0-9a-f]{3})$/i,

    // support #RRGGBB/#RGB now.
    // if color was like [red, orange...]/rgb(a)/hsl(a), op will not combined to result
    getRgba: function getRgba(color, op) {
        if (isNil(op)) {
            op = 1;
        }
        if (color[0] !== '#') {
            return color;
        }
        var r, g, b;
        if (color.length === 7) {
            r = parseInt(color.substring(1, 3), 16);
            g = parseInt(color.substring(3, 5), 16);
            b = parseInt(color.substring(5, 7), 16);
        } else {
            r = parseInt(color.substring(1, 2), 16) * 17;
            g = parseInt(color.substring(2, 3), 16) * 17;
            b = parseInt(color.substring(3, 4), 16) * 17;
        }
        return 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
    },
    image: function image(ctx, img, x, y, width, height) {
        // x = round(x);
        // y = round(y);
        try {
            if (isNumber(width) && isNumber(height)) {
                ctx.drawImage(img, x, y, width, height);
            } else {
                ctx.drawImage(img, x, y);
            }
        } catch (error) {
            if (console) {
                console.warn('error when drawing image on canvas:', error);
                console.warn(img);
            }
        }
    },
    text: function text(ctx, _text, pt, style, textDesc) {
        // pt = pt.add(new Point(style['textDx'], style['textDy']));
        Canvas._textOnMultiRow(ctx, textDesc['rows'], style, pt, textDesc['size'], textDesc['rawSize']);
    },
    _textOnMultiRow: function _textOnMultiRow(ctx, texts, style, point, splitTextSize, textSize) {
        var ptAlign = getAlignPoint(splitTextSize, style['textHorizontalAlignment'], style['textVerticalAlignment']);
        var lineHeight = textSize['height'] + style['textLineSpacing'];
        var basePoint = point.add(0, ptAlign.y);
        var text, rowAlign;
        for (var i = 0, len = texts.length; i < len; i++) {
            text = texts[i]['text'];
            rowAlign = getAlignPoint(texts[i]['size'], style['textHorizontalAlignment'], style['textVerticalAlignment']);
            Canvas._textOnLine(ctx, text, basePoint.add(rowAlign.x, i * lineHeight), style['textHaloRadius'], style['textHaloFill'], style['textHaloOpacity']);
        }
    },
    _textOnLine: function _textOnLine(ctx, text, pt, textHaloRadius, textHaloFill, textHaloOp) {
        // pt = pt._round();
        ctx.textBaseline = 'top';
        if (textHaloOp !== 0 && textHaloRadius !== 0) {
            //http://stackoverflow.com/questions/14126298/create-text-outline-on-canvas-in-javascript
            //根据text-horizontal-alignment和text-vertical-alignment计算绘制起始点偏移量
            if (textHaloOp) {
                var alpha = ctx.globalAlpha;
                ctx.globalAlpha *= textHaloOp;
            }

            if (textHaloRadius) {
                ctx.miterLimit = 2;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.lineWidth = textHaloRadius * 2 - 1;
                ctx.strokeStyle = textHaloFill;
                ctx.strokeText(text, pt.x, pt.y);
                ctx.lineWidth = 1;
                ctx.miterLimit = 10; //default
            }

            if (textHaloOp) {
                ctx.globalAlpha = alpha;
            }
        }
        ctx.fillText(text, pt.x, pt.y);
    },
    fillText: function fillText(ctx, text, point, rgba) {
        if (rgba) {
            ctx.fillStyle = rgba;
        }
        ctx.fillText(text, point.x, point.y);
    },
    _stroke: function _stroke(ctx, strokeOpacity, x, y) {
        var isPattern = Canvas._isPattern(ctx.strokeStyle) && !isNil(x) && !isNil(y);
        if (isNil(strokeOpacity)) {
            strokeOpacity = 1;
        }
        var alpha;
        if (strokeOpacity < 1) {
            alpha = ctx.globalAlpha;
            ctx.globalAlpha *= strokeOpacity;
        }
        if (isPattern) {
            // x = round(x);
            // y = round(y);
            ctx.translate(x, y);
        }
        ctx.stroke();
        if (isPattern) {
            ctx.translate(-x, -y);
        }
        if (strokeOpacity < 1) {
            ctx.globalAlpha = alpha;
        }
    },
    _path: function _path(ctx, points, lineDashArray, lineOpacity, ignoreStrokePattern) {
        function fillWithPattern(p1, p2) {
            var degree = computeDegree(p1, p2);
            ctx.save();
            ctx.translate(p1.x, p1.y - ctx.lineWidth / 2 / Math.cos(degree));
            ctx.rotate(degree);
            Canvas._stroke(ctx, lineOpacity);
            ctx.restore();
        }

        function drawDashLine(startPoint, endPoint, dashArray) {
            //https://davidowens.wordpress.com/2010/09/07/html-5-canvas-and-dashed-lines/
            //
            // Our growth rate for our line can be one of the following:
            //   (+,+), (+,-), (-,+), (-,-)
            // Because of this, our algorithm needs to understand if the x-coord and
            // y-coord should be getting smaller or larger and properly cap the values
            // based on (x,y).
            var fromX = startPoint.x,
                fromY = startPoint.y,
                toX = endPoint.x,
                toY = endPoint.y;
            var pattern = dashArray;
            var lt = function lt(a, b) {
                return a <= b;
            };
            var gt = function gt(a, b) {
                return a >= b;
            };
            var capmin = function capmin(a, b) {
                return Math.min(a, b);
            };
            var capmax = function capmax(a, b) {
                return Math.max(a, b);
            };

            var checkX = {
                thereYet: gt,
                cap: capmin
            };
            var checkY = {
                thereYet: gt,
                cap: capmin
            };

            if (fromY - toY > 0) {
                checkY.thereYet = lt;
                checkY.cap = capmax;
            }
            if (fromX - toX > 0) {
                checkX.thereYet = lt;
                checkX.cap = capmax;
            }

            ctx.moveTo(fromX, fromY);
            var offsetX = fromX;
            var offsetY = fromY;
            var idx = 0,
                dash = true;
            var ang, len;
            while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY))) {
                ang = Math.atan2(toY - fromY, toX - fromX);
                len = pattern[idx];

                offsetX = checkX.cap(toX, offsetX + Math.cos(ang) * len);
                offsetY = checkY.cap(toY, offsetY + Math.sin(ang) * len);

                if (dash) {
                    ctx.lineTo(offsetX, offsetY);
                } else {
                    ctx.moveTo(offsetX, offsetY);
                }

                idx = (idx + 1) % pattern.length;
                dash = !dash;
            }
        }
        if (!isArrayHasData(points)) {
            return;
        }

        var isDashed = isArrayHasData(lineDashArray);
        var isPatternLine = ignoreStrokePattern === true ? false : Canvas._isPattern(ctx.strokeStyle);
        var point, prePoint, nextPoint;
        for (var i = 0, len = points.length; i < len; i++) {
            point = points[i];
            if (!isDashed || ctx.setLineDash) {
                //IE9+
                ctx.lineTo(point.x, point.y);
                if (isPatternLine && i > 0) {
                    prePoint = points[i - 1];
                    fillWithPattern(prePoint, point);
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                }
            } else if (isDashed) {
                if (i === len - 1) {
                    break;
                }
                nextPoint = points[i + 1];
                drawDashLine(point, nextPoint, lineDashArray, isPatternLine);
            }
        }
    },
    path: function path(ctx, points, lineOpacity, fillOpacity, lineDashArray) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        Canvas._path(ctx, points, lineDashArray, lineOpacity);
        Canvas._stroke(ctx, lineOpacity);
    },
    polygon: function polygon(ctx, points, lineOpacity, fillOpacity, lineDashArray) {
        function fillPolygon(points, i, op) {
            Canvas.fillCanvas(ctx, op, points[i][0].x, points[i][0].y);
        }
        var isPatternLine = Canvas._isPattern(ctx.strokeStyle),
            fillFirst = isArrayHasData(lineDashArray) && !ctx.setLineDash || isPatternLine;
        if (!isArrayHasData(points[0])) {
            points = [points];
        }
        var op, i, len;
        if (fillFirst) {
            //因为canvas只填充moveto,lineto,lineto的空间, 而dashline的moveto不再构成封闭空间, 所以重新绘制图形轮廓用于填充
            ctx.save();
            for (i = 0, len = points.length; i < len; i++) {
                Canvas._ring(ctx, points[i], null, 0, true);
                op = fillOpacity;
                if (i > 0) {
                    ctx.globalCompositeOperation = 'destination-out';
                    op = 1;
                }
                fillPolygon(points, i, op);
                if (i > 0) {
                    ctx.globalCompositeOperation = 'source-over';
                } else {
                    ctx.fillStyle = '#fff';
                }
                Canvas._stroke(ctx, 0);
            }
            ctx.restore();
        }
        for (i = 0, len = points.length; i < len; i++) {

            Canvas._ring(ctx, points[i], lineDashArray, lineOpacity);

            if (!fillFirst) {
                op = fillOpacity;
                if (i > 0) {
                    ctx.globalCompositeOperation = 'destination-out';
                    op = 1;
                }
                fillPolygon(points, i, op);
                if (i > 0) {
                    //return to default compositeOperation to display strokes.
                    ctx.globalCompositeOperation = 'source-over';
                } else {
                    ctx.fillStyle = '#fff';
                }
            }
            Canvas._stroke(ctx, lineOpacity);
        }
    },
    _ring: function _ring(ctx, ring, lineDashArray, lineOpacity, ignoreStrokePattern) {
        var isPatternLine = ignoreStrokePattern === true ? false : Canvas._isPattern(ctx.strokeStyle);
        if (isPatternLine && !ring[0].equals(ring[ring.length - 1])) {
            ring = ring.concat([ring[0]]);
        }
        ctx.beginPath();
        ctx.moveTo(ring[0].x, ring[0].y);
        Canvas._path(ctx, ring, lineDashArray, lineOpacity, ignoreStrokePattern);
        if (!isPatternLine) {
            ctx.closePath();
        }
    },


    /**
     * draw an arc from p1 to p2 with degree of (p1, center) and (p2, center)
     * @param  {Context} ctx    canvas context
     * @param  {Point} p1      point 1
     * @param  {Point} p2      point 2
     * @param  {Number} degree arc degree between p1 and p2
     */
    _arcBetween: function _arcBetween(ctx, p1, p2, degree) {
        var a = degree,
            dist = p1.distanceTo(p2),

        //radius of circle
        r = dist / 2 / Math.sin(a / 2);
        //angle between p1 and p2
        var p1p2 = Math.asin((p2.y - p1.y) / dist);
        if (p1.x > p2.x) {
            p1p2 = Math.PI - p1p2;
        }
        //angle between circle center and p2
        var cp2 = 90 * Math.PI / 180 - a / 2,
            da = p1p2 - cp2;

        var dx = Math.cos(da) * r,
            dy = Math.sin(da) * r,
            cx = p1.x + dx,
            cy = p1.y + dy;

        var startAngle = Math.asin((p2.y - cy) / r);
        if (cx > p2.x) {
            startAngle = Math.PI - startAngle;
        }
        var endAngle = startAngle + a;

        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
    },
    _lineTo: function _lineTo(ctx, p) {
        ctx.lineTo(p.x, p.y);
    },
    bezierCurveAndFill: function bezierCurveAndFill(ctx, points, lineOpacity, fillOpacity) {
        ctx.beginPath();
        var start = points[0];
        ctx.moveTo(start.x, start.y);
        Canvas._bezierCurveTo.apply(Canvas, [ctx].concat(points.splice(1)));
        Canvas.fillCanvas(ctx, fillOpacity);
        Canvas._stroke(ctx, lineOpacity);
    },
    _bezierCurveTo: function _bezierCurveTo(ctx, p1, p2, p3) {
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    },


    //各种图形的绘制方法
    ellipse: function ellipse(ctx, pt, width, height, lineOpacity, fillOpacity) {
        function bezierEllipse(x, y, a, b) {
            var k = 0.5522848,
                ox = a * k,
                // 水平控制点偏移量
            oy = b * k; // 垂直控制点偏移量
            ctx.beginPath();
            //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
            ctx.moveTo(x - a, y);
            ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
            ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
            ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
            ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
            ctx.closePath();
            Canvas.fillCanvas(ctx, fillOpacity, pt.x - width, pt.y - height);
            Canvas._stroke(ctx, lineOpacity, pt.x - width, pt.y - height);
        }
        // pt = pt._round();
        if (width === height) {
            //如果高宽相同,则直接绘制圆形, 提高效率
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, width, 0, 2 * Math.PI);
            Canvas.fillCanvas(ctx, fillOpacity, pt.x - width, pt.y - height);
            Canvas._stroke(ctx, lineOpacity, pt.x - width, pt.y - height);
        } else {
            bezierEllipse(pt.x, pt.y, width, height);
        }
    },
    rectangle: function rectangle(ctx, pt, size, lineOpacity, fillOpacity) {
        // pt = pt._round();
        ctx.beginPath();
        ctx.rect(pt.x, pt.y, size['width'], size['height']);
        Canvas.fillCanvas(ctx, fillOpacity, pt.x, pt.y);
        Canvas._stroke(ctx, lineOpacity, pt.x, pt.y);
    },
    sector: function sector(ctx, pt, size, angles, lineOpacity, fillOpacity) {
        var startAngle = angles[0],
            endAngle = angles[1];

        function sector(ctx, x, y, radius, startAngle, endAngle) {
            var rad = Math.PI / 180;
            var sDeg = rad * -endAngle;
            var eDeg = rad * -startAngle;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, sDeg, eDeg);
            ctx.lineTo(x, y);
            Canvas.fillCanvas(ctx, fillOpacity, x - radius, y - radius);
            Canvas._stroke(ctx, lineOpacity, x - radius, y - radius);
        }
        // pt = pt._round();
        sector(ctx, pt.x, pt.y, size, startAngle, endAngle);
    },
    _isPattern: function _isPattern(style) {
        return !isString(style) && !('addColorStop' in style);
    },


    // reference:
    // http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
    quadraticCurve: function quadraticCurve(ctx, points) {
        if (!points || points.length <= 2) {
            return;
        }
        var xc = (points[0].x + points[1].x) / 2,
            yc = (points[0].y + points[1].y) / 2;
        ctx.lineTo(xc, yc);
        var ctrlPts = Canvas._getQuadCurvePoints(points);
        var i,
            len = ctrlPts.length;
        for (i = 0; i < len; i += 4) {
            ctx.quadraticCurveTo(ctrlPts[i], ctrlPts[i + 1], ctrlPts[i + 2], ctrlPts[i + 3]);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    },
    _getQuadCurvePoints: function _getQuadCurvePoints(points) {
        var ctrlPts = [];
        var i,
            len = points.length;
        var xc, yc;
        for (i = 1; i < len - 1; i++) {
            xc = (points[i].x + points[i + 1].x) / 2;
            yc = (points[i].y + points[i + 1].y) / 2;
            ctrlPts.push(points[i].x, points[i].y, xc, yc);
        }
        return ctrlPts;
    },
    drawCross: function drawCross(ctx, p, lineWidth, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(p.x - 5, p.y);
        ctx.lineTo(p.x + 5, p.y);
        ctx.moveTo(p.x, p.y - 5);
        ctx.lineTo(p.x, p.y + 5);
        ctx.stroke();
    }
};

/**
 * Represents a coordinate point <br>
 * e.g. <br>
 * A geographical point (longitude, latitude)
 * @example
 * var coord = new Coordinate(0, 0);
 * @example
 * var coord = new Coordinate([ 0, 0 ]);
 * @example
 * var coord = new Coordinate({ x : 0, y : 0 });
 * @category basic types
 */

var Coordinate = function () {
    /**
     * @param {Number} x - x value
     * @param {Number} y - y value
     */
    function Coordinate(x, y) {
        classCallCheck(this, Coordinate);

        if (!isNil(x) && !isNil(y)) {
            /**
             * @property {Number} x - value on X-Axis or longitude in degrees
             */
            this.x = +x;
            /**
             * @property {Number} y - value on Y-Axis or Latitude in degrees
             */
            this.y = +y;
        } else if (Array.isArray(x)) {
            //数组
            this.x = +x[0];
            this.y = +x[1];
        } else if (!isNil(x['x']) && !isNil(x['y'])) {
            //对象
            this.x = +x['x'];
            this.y = +x['y'];
        }
        if (this._isNaN()) {
            throw new Error('coordinate is NaN');
        }
    }

    /**
    * Convert one or more Coordinate objects to GeoJSON style coordinates
    * @param  {Coordinate|Coordinate[]} coordinates - coordinates to convert
    * @return {Number[]|Number[][]}
    * @example
    * // result is [[100,0], [101,1]]
    * var numCoords = Coordinate.toNumberArrays([new Coordinate(100,0), new Coordinate(101,1)]);
    */


    Coordinate.toNumberArrays = function toNumberArrays(coordinates) {
        if (!Array.isArray(coordinates)) {
            return [coordinates.x, coordinates.y];
        }
        return mapArrayRecursively(coordinates, function (coord) {
            return [coord.x, coord.y];
        });
    };

    /**
     * Convert one or more GeoJSON style coordiantes to Coordinate objects
     * @param  {Number[]|Number[][]} coordinates - coordinates to convert
     * @return {Coordinate|Coordinate[]}
     * @example
     * var coordinates = Coordinate.toCoordinates([[100,0], [101,1]]);
     */


    Coordinate.toCoordinates = function toCoordinates(coordinates) {
        if (isNumber(coordinates[0]) && isNumber(coordinates[1])) {
            return new Coordinate(coordinates);
        }
        var result = [];
        for (var i = 0, len = coordinates.length; i < len; i++) {
            var child = coordinates[i];
            if (Array.isArray(child)) {
                if (isNumber(child[0])) {
                    result.push(new Coordinate(child));
                } else {
                    result.push(Coordinate.toCoordinates(child));
                }
            } else {
                result.push(new Coordinate(child));
            }
        }
        return result;
    };

    /**
     * Returns a copy of the coordinate
     * @return {Coordinate} copy
     */


    Coordinate.prototype.copy = function copy() {
        return new Coordinate(this.x, this.y);
    };

    //destructive add, to improve performance in some circumstances.


    Coordinate.prototype._add = function _add(x, y) {
        if (x instanceof Coordinate) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    };

    /**
     * Returns the result of addition of another coordinate.
     * @param {Coordinate} coordinate - coordinate to add
     * @return {Coordinate} result
     */


    Coordinate.prototype.add = function add(x, y) {
        var nx, ny;
        if (x instanceof Coordinate) {
            nx = this.x + x.x;
            ny = this.y + x.y;
        } else {
            nx = this.x + x;
            ny = this.y + y;
        }
        return new Coordinate(nx, ny);
    };

    //destructive substract


    Coordinate.prototype._substract = function _substract(x, y) {
        if (x instanceof Coordinate) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    };

    /**
     * Returns the result of subtraction of another coordinate.
     * @param {Coordinate} coordinate - coordinate to substract
     * @return {Coordinate} result
     */


    Coordinate.prototype.substract = function substract(x, y) {
        var nx, ny;
        if (x instanceof Coordinate) {
            nx = this.x - x.x;
            ny = this.y - x.y;
        } else {
            nx = this.x - x;
            ny = this.y - y;
        }
        return new Coordinate(nx, ny);
    };

    /**
     * Returns the result of multiplication of the current coordinate by the given number.
     * @param {Number} ratio - ratio to multi
     * @return {Coordinate} result
     */


    Coordinate.prototype.multi = function multi(ratio) {
        return new Coordinate(this.x * ratio, this.y * ratio);
    };

    Coordinate.prototype._multi = function _multi(ratio) {
        this.x *= ratio;
        this.y *= ratio;
        return this;
    };

    /**
     * Compare with another coordinate to see whether they are equal.
     * @param {Coordinate} c - coordinate to compare
     * @return {Boolean}
     */


    Coordinate.prototype.equals = function equals(c) {
        if (!(c instanceof Coordinate)) {
            return false;
        }
        return this.x === c.x && this.y === c.y;
    };

    /**
     * Whether the coordinate is NaN
     * @return {Boolean}
     * @private
     */


    Coordinate.prototype._isNaN = function _isNaN() {
        return isNaN(this.x) || isNaN(this.y);
    };

    /**
     * Convert the coordinate to a number array [x, y]
     * @return {Number[]} number array
     */


    Coordinate.prototype.toArray = function toArray$$1() {
        return [this.x, this.y];
    };

    /**
     * Convert the coordinate to a json object {x : .., y : ..}
     * @return {Object} json
     */


    Coordinate.prototype.toJSON = function toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    };

    return Coordinate;
}();

/**
 * Represent a bounding box on the map, a rectangular geographical area with minimum and maximum coordinates. <br>
 * There are serveral ways to create a extent:
 * @category basic types
 * @example
 * //with 4 numbers
 * var extent = new Extent(100, 10, 120, 20);
 * @example
 * //with 2 coordinates
 * var extent = new Extent(new Coordinate(100, 10), new Coordinate(120, 20));
 * @example
 * //with a json object containing xmin, ymin, xmax and ymax
 * var extent = new Extent({xmin : 100, ymin: 10, xmax: 120, ymax:20});
 * @example
 * var extent1 = new Extent(100, 10, 120, 20);
 * //with another extent
 * var extent2 = new Extent(extent1);
 */

var Extent = function () {

    /**
     * @param {Number} x1   - x of coordinate 1
     * @param {Number} y1   - y of coordinate 1
     * @param {Number} x2   - x of coordinate 2
     * @param {Number} y2   - y of coordinate 2
     */
    function Extent(p1, p2, p3, p4) {
        classCallCheck(this, Extent);

        this._clazz = Coordinate;
        this._initialize(p1, p2, p3, p4);
    }

    Extent.prototype._initialize = function _initialize(p1, p2, p3, p4) {
        /**
         * @property {Number} xmin - minimum x
         */
        this.xmin = null;
        /**
         * @property {Number} xmax - maximum x
         */
        this.xmax = null;
        /**
         * @property {Number} ymin - minimum y
         */
        this.ymin = null;
        /**
         * @property {Number} ymax - maximum y
         */
        this.ymax = null;
        if (isNil(p1)) {
            return;
        }
        //Constructor 1: all numbers
        if (isNumber(p1) && isNumber(p2) && isNumber(p3) && isNumber(p4)) {
            this['xmin'] = Math.min(p1, p3);
            this['ymin'] = Math.min(p2, p4);
            this['xmax'] = Math.max(p1, p3);
            this['ymax'] = Math.max(p2, p4);
            return;
        } else if (isNumber(p1.x) && isNumber(p2.x) && isNumber(p1.y) && isNumber(p2.y)) {
            //Constructor 2: two coordinates
            if (p1.x > p2.x) {
                this['xmin'] = p2.x;
                this['xmax'] = p1.x;
            } else {
                this['xmin'] = p1.x;
                this['xmax'] = p2.x;
            }
            if (p1.y > p2.y) {
                this['ymin'] = p2.y;
                this['ymax'] = p1.y;
            } else {
                this['ymin'] = p1.y;
                this['ymax'] = p2.y;
            }
            //constructor 3: another extent or a object containing xmin, ymin, xmax and ymax
        } else if (isNumber(p1['xmin']) && isNumber(p1['xmax']) && isNumber(p1['ymin']) && isNumber(p1['ymax'])) {
            this['xmin'] = p1['xmin'];
            this['ymin'] = p1['ymin'];
            this['xmax'] = p1['xmax'];
            this['ymax'] = p1['ymax'];
        }
    };

    Extent.prototype._add = function _add(p) {
        this['xmin'] += p.x;
        this['ymin'] += p.y;
        this['xmax'] += p.x;
        this['ymax'] += p.y;
        return this;
    };

    /**
     * Add the extent with a coordinate or a point.
     * @param {Coordinate|Point} p - point or coordinate to add
     * @returns {Extent} a new extent
     */


    Extent.prototype.add = function add(p) {
        return new this.constructor(this['xmin'] + p.x, this['ymin'] + p.y, this['xmax'] + p.x, this['ymax'] + p.y);
    };

    Extent.prototype._substract = function _substract(p) {
        this['xmin'] -= p.x;
        this['ymin'] -= p.y;
        this['xmax'] -= p.x;
        this['ymax'] -= p.y;
        return this;
    };

    /**
     * Substract the extent with a coordinate or a point.
     * @param {Coordinate|Point} p - point or coordinate to substract
     * @returns {Extent} a new extent
     */


    Extent.prototype.substract = function substract(p) {
        return new this.constructor(this['xmin'] - p.x, this['ymin'] - p.y, this['xmax'] - p.x, this['ymax'] - p.y);
    };

    /**
     * Round the extent
     * @return {Extent} rounded extent
     */


    Extent.prototype.round = function round$$1() {
        return new this.constructor(round(this['xmin']), round(this['ymin']), round(this['xmax']), round(this['ymax']));
    };

    Extent.prototype._round = function _round() {
        this['xmin'] = round(this['xmin']);
        this['ymin'] = round(this['ymin']);
        this['xmax'] = round(this['xmax']);
        this['ymax'] = round(this['ymax']);
        return this;
    };

    /**
     * Get the minimum point
     * @return {Coordinate}
     */


    Extent.prototype.getMin = function getMin() {
        return new this._clazz(this['xmin'], this['ymin']);
    };

    /**
     * Get the maximum point
     * @return {Coordinate}
     */


    Extent.prototype.getMax = function getMax() {
        return new this._clazz(this['xmax'], this['ymax']);
    };

    /**
     * Get center of the extent.
     * @return {Coordinate}
     */


    Extent.prototype.getCenter = function getCenter() {
        return new this._clazz((this['xmin'] + this['xmax']) / 2, (this['ymin'] + this['ymax']) / 2);
    };

    /**
     * Whether the extent is valid
     * @protected
     * @return {Boolean}
     */


    Extent.prototype.isValid = function isValid() {
        return isNumber(this['xmin']) && isNumber(this['ymin']) && isNumber(this['xmax']) && isNumber(this['ymax']);
    };

    /**
     * Compare with another extent to see whether they are equal.
     * @param  {Extent}  ext2 - extent to compare
     * @return {Boolean}
     */


    Extent.prototype.equals = function equals(ext2) {
        return this['xmin'] === ext2['xmin'] && this['xmax'] === ext2['xmax'] && this['ymin'] === ext2['ymin'] && this['ymax'] === ext2['ymax'];
    };

    /**
     * Whether it intersects with another extent
     * @param  {Extent}  ext2 - another extent
     * @return {Boolean}
     */


    Extent.prototype.intersects = function intersects(ext2) {
        var rxmin = Math.max(this['xmin'], ext2['xmin']);
        var rymin = Math.max(this['ymin'], ext2['ymin']);
        var rxmax = Math.min(this['xmax'], ext2['xmax']);
        var rymax = Math.min(this['ymax'], ext2['ymax']);
        var intersects = !(rxmin > rxmax || rymin > rymax);
        return intersects;
    };

    /**
     * Whether the extent contains the input point.
     * @param  {Coordinate|Number[]} coordinate - input point
     * @returns {Boolean}
     */


    Extent.prototype.contains = function contains(c) {
        return c.x >= this.xmin && c.x <= this.xmax && c.y >= this.ymin && c.y <= this.ymax;
    };

    /**
     * Get the width of the Extent
     * @return {Number}
     */


    Extent.prototype.getWidth = function getWidth() {
        return this['xmax'] - this['xmin'];
    };

    /**
     * Get the height of the Extent
     * @return {Number}
     */


    Extent.prototype.getHeight = function getHeight() {
        return this['ymax'] - this['ymin'];
    };

    Extent.prototype.__combine = function __combine(extent) {
        if (extent instanceof Point) {
            extent = {
                'xmin': extent.x,
                'xmax': extent.x,
                'ymin': extent.y,
                'ymax': extent.y
            };
        }
        var xmin = this['xmin'];
        if (!isNumber(xmin)) {
            xmin = extent['xmin'];
        } else if (isNumber(extent['xmin'])) {
            if (xmin > extent['xmin']) {
                xmin = extent['xmin'];
            }
        }

        var xmax = this['xmax'];
        if (!isNumber(xmax)) {
            xmax = extent['xmax'];
        } else if (isNumber(extent['xmax'])) {
            if (xmax < extent['xmax']) {
                xmax = extent['xmax'];
            }
        }

        var ymin = this['ymin'];
        if (!isNumber(ymin)) {
            ymin = extent['ymin'];
        } else if (isNumber(extent['ymin'])) {
            if (ymin > extent['ymin']) {
                ymin = extent['ymin'];
            }
        }

        var ymax = this['ymax'];
        if (!isNumber(ymax)) {
            ymax = extent['ymax'];
        } else if (isNumber(extent['ymax'])) {
            if (ymax < extent['ymax']) {
                ymax = extent['ymax'];
            }
        }
        return [xmin, ymin, xmax, ymax];
    };

    Extent.prototype._combine = function _combine(extent) {
        if (!extent) {
            return this;
        }
        var ext = this.__combine(extent);
        this['xmin'] = ext[0];
        this['ymin'] = ext[1];
        this['xmax'] = ext[2];
        this['ymax'] = ext[3];
        return this;
    };

    /**
     * Combine it with another extent to a larger extent.
     * @param  {Extent} extent - another extent
     * @returns {Extent} extent combined
     */


    Extent.prototype.combine = function combine(extent) {
        if (!extent) {
            return this;
        }
        var ext = this.__combine(extent);
        return new this.constructor(ext[0], ext[1], ext[2], ext[3]);
    };

    /**
     * Gets the intersection extent of this and another extent.
     * @param  {Extent} extent - another extent
     * @return {Extent} intersection extent
     */


    Extent.prototype.intersection = function intersection(extent) {
        if (!this.intersects(extent)) {
            return null;
        }
        return new this.constructor(Math.max(this['xmin'], extent['xmin']), Math.max(this['ymin'], extent['ymin']), Math.min(this['xmax'], extent['xmax']), Math.min(this['ymax'], extent['ymax']));
    };

    /**
     * Expand the extent by distance
     * @param  {Size|Number} distance  - distance to expand
     * @returns {Extent} a new extent expanded from
     */


    Extent.prototype.expand = function expand(distance) {
        if (distance instanceof Size) {
            return new this.constructor(this['xmin'] - distance['width'], this['ymin'] - distance['height'], this['xmax'] + distance['width'], this['ymax'] + distance['height']);
        } else {
            return new this.constructor(this['xmin'] - distance, this['ymin'] - distance, this['xmax'] + distance, this['ymax'] + distance);
        }
    };

    Extent.prototype._expand = function _expand(distance) {
        if (distance instanceof Size) {
            this['xmin'] -= distance['width'];
            this['ymin'] -= distance['height'];
            this['xmax'] += distance['width'];
            this['ymax'] += distance['height'];
        } else {
            this['xmin'] -= distance;
            this['ymin'] -= distance;
            this['xmax'] += distance;
            this['ymax'] += distance;
        }
        return this;
    };

    /**
     * Get extent's JSON object.
     * @return {Object} jsonObject
     * @example
     * // {xmin : 100, ymin: 10, xmax: 120, ymax:20}
     * var json = extent.toJSON();
     */


    Extent.prototype.toJSON = function toJSON() {
        return {
            'xmin': this['xmin'],
            'ymin': this['ymin'],
            'xmax': this['xmax'],
            'ymax': this['ymax']
        };
    };

    /**
     * Get a coordinate array of extent's rectangle area, containing 5 coordinates in which the first equals with the last.
     * @return {Coordinate[]} coordinates array
     */


    Extent.prototype.toArray = function toArray$$1() {
        var xmin = this['xmin'],
            ymin = this['ymin'],
            xmax = this['xmax'],
            ymax = this['ymax'];
        return [new this._clazz([xmin, ymax]), new this._clazz([xmax, ymax]), new this._clazz([xmax, ymin]), new this._clazz([xmin, ymin]), new this._clazz([xmin, ymax])];
    };

    /**
     * Get a copy of the extent.
     * @return {Extent} copy
     */


    Extent.prototype.copy = function copy() {
        return new this.constructor(this['xmin'], this['ymin'], this['xmax'], this['ymax']);
    };

    return Extent;
}();

/**
 * Represent a bounding box on 2d surface , a rectangular area with minimum and maximum points. <br>
 * There are serveral ways to create a PointExtent:
 * @category basic types
 * @extends Extent
 * @example
 * //with 4 numbers
 * var extent = new PointExtent(100, 10, 120, 20);
 * @example
 * //with 2 points
 * var extent = new PointExtent(new Point(100, 10), new Point(120, 20));
 * @example
 * //with a json object containing xmin, ymin, xmax and ymax
 * var extent = new PointExtent({xmin : 100, ymin: 10, xmax: 120, ymax:20});
 * @example
 * var extent1 = new PointExtent(100, 10, 120, 20);
 * //with another extent
 * var extent2 = new PointExtent(extent1);
 */

var PointExtent = function (_Extent) {
    inherits(PointExtent, _Extent);

    /**
     * @param {Number} x1   - x of point 1
     * @param {Number} y1   - y of point 1
     * @param {Number} x2   - x of point 2
     * @param {Number} y2   - y of point 2
     */
    function PointExtent(p1, p2, p3, p4) {
        classCallCheck(this, PointExtent);

        var _this = possibleConstructorReturn(this, _Extent.call(this, p1, p2, p3, p4));

        _this._clazz = Point;
        return _this;
    }

    /**
     * Get size of the PointExtent
     * @return {Size}
     */


    PointExtent.prototype.getSize = function getSize() {
        return new Size(this.getWidth(), this.getHeight());
    };

    return PointExtent;
}(Extent);

// for point precise
var delta = 1E-6;

/**
 * @classdesc
 * Base symbolizer class for all the point type symbol styles.
 * @abstract
 * @class
 * @protected
 * @memberOf symbolizer
 * @name PointSymbolizer
 * @extends {CanvasSymbolizer}
 */

var PointSymbolizer = function (_CanvasSymbolizer) {
    inherits(PointSymbolizer, _CanvasSymbolizer);

    function PointSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, PointSymbolizer);

        var _this = possibleConstructorReturn(this, _CanvasSymbolizer.call(this));

        _this.symbol = symbol;
        _this.geometry = geometry;
        _this.painter = painter;
        return _this;
    }

    PointSymbolizer.prototype.get2DExtent = function get2DExtent(resources) {
        var map = this.getMap();
        var maxZoom = map.getMaxZoom();
        var extent = new PointExtent(),
            m = this.getMarkerExtent(resources);
        var renderPoints = this._getRenderPoints()[0];
        for (var i = renderPoints.length - 1; i >= 0; i--) {
            extent._combine(map._pointToPoint(renderPoints[i], maxZoom));
        }
        extent['xmin'] += m['xmin'];
        extent['ymin'] += m['ymin'];
        extent['xmax'] += m['xmax'];
        extent['ymax'] += m['ymax'];
        return extent;
    };

    PointSymbolizer.prototype._getRenderPoints = function _getRenderPoints() {
        return this.getPainter().getRenderPoints(this.getPlacement());
    };

    /**
     * Get container points to draw on Canvas
     * @return {Point[]}
     */


    PointSymbolizer.prototype._getRenderContainerPoints = function _getRenderContainerPoints() {
        var painter = this.getPainter(),
            points = this._getRenderPoints()[0];
        if (painter.isSpriting()) {
            return points;
        }
        var map = this.getMap();
        var maxZoom = map.getMaxZoom();
        var dxdy = this.getDxDy(),
            layerPoint = map._pointToContainerPoint(this.geometry.getLayer()._getRenderer()._northWest);
        var containerPoints = mapArrayRecursively(points, function (point) {
            return map._pointToContainerPoint(point, maxZoom)._add(dxdy)._substract(layerPoint)._substract(delta, delta)._round();
        });
        return containerPoints;
    };

    PointSymbolizer.prototype._getRotationAt = function _getRotationAt(i) {
        var r = this.getRotation(),
            rotations = this._getRenderPoints()[1];
        if (!rotations) {
            return r;
        }
        if (!r) {
            r = 0;
        }
        return rotations[i] + r;
    };

    PointSymbolizer.prototype._rotate = function _rotate(ctx, origin, rotation) {
        if (!isNil(rotation)) {
            ctx.save();
            ctx.translate(origin.x, origin.y);
            ctx.rotate(rotation);
            return new Point(0, 0);
        }
        return null;
    };

    return PointSymbolizer;
}(CanvasSymbolizer);

var VectorMarkerSymbolizer = function (_PointSymbolizer) {
    inherits(VectorMarkerSymbolizer, _PointSymbolizer);

    VectorMarkerSymbolizer.test = function test(symbol) {
        if (!symbol) {
            return false;
        }
        if (isNil(symbol['markerFile']) && !isNil(symbol['markerType']) && symbol['markerType'] !== 'path') {
            return true;
        }
        return false;
    };

    function VectorMarkerSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, VectorMarkerSymbolizer);

        var _this = possibleConstructorReturn(this, _PointSymbolizer.call(this, symbol, geometry, painter));

        _this.style = _this._defineStyle(_this.translate());
        _this.strokeAndFill = _this._defineStyle(VectorMarkerSymbolizer.translateLineAndFill(_this.style));
        if ((_this.style['markerWidth'] + _this.strokeAndFill['lineWidth']) % 2 === 0) {
            _this.padding = [4, 4];
        } else {
            _this.padding = [3, 3];
        }
        return _this;
    }

    VectorMarkerSymbolizer.prototype.symbolize = function symbolize(ctx, resources) {
        var style = this.style;
        if (style['markerWidth'] === 0 || style['markerHeight'] === 0 || style['polygonOpacity'] === 0 && style['lineOpacity'] === 0) {
            return;
        }
        var cookedPoints = this._getRenderContainerPoints();
        if (!isArrayHasData(cookedPoints)) {
            return;
        }
        this._prepareContext(ctx);
        if (this.getPainter().isSpriting() || this.geometry.getLayer().getMask() === this.geometry || this.geometry.getLayer().options['cacheVectorOnCanvas'] === false) {
            this._drawMarkers(ctx, cookedPoints, resources);
        } else {
            this._drawMarkersWithCache(ctx, cookedPoints, resources);
        }
    };

    VectorMarkerSymbolizer.prototype._drawMarkers = function _drawMarkers(ctx, cookedPoints, resources) {

        var strokeAndFill = this.strokeAndFill,
            point,
            origin;
        var gradient = isGradient(strokeAndFill['lineColor']) || isGradient(strokeAndFill['polygonFill']);
        if (!gradient) {
            Canvas.prepareCanvas(ctx, strokeAndFill, resources);
        }
        for (var i = cookedPoints.length - 1; i >= 0; i--) {
            point = cookedPoints[i];
            origin = this._rotate(ctx, point, this._getRotationAt(i));
            if (origin) {
                point = origin;
            }

            this._drawVectorMarker(ctx, point, resources);
            if (origin) {
                ctx.restore();
            }
        }
    };

    VectorMarkerSymbolizer.prototype._drawMarkersWithCache = function _drawMarkersWithCache(ctx, cookedPoints, resources) {
        var stamp = this._stampSymbol(),
            lineWidth = this.strokeAndFill['lineWidth'],
            shadow = this.geometry.options['shadowBlur'],
            w = this.style['markerWidth'] + lineWidth + 2 * shadow + this.padding[0],
            h = this.style['markerHeight'] + lineWidth + 2 * shadow + this.padding[1];
        var image = resources.getImage(stamp);
        if (!image) {
            image = this._createMarkerImage(ctx, resources);
            resources.addResource([stamp, w, h], image);
        }
        var point,
            origin,
            anchor = this._getAnchor();
        for (var i = cookedPoints.length - 1; i >= 0; i--) {
            point = cookedPoints[i].substract(anchor);
            origin = this._rotate(ctx, point, this._getRotationAt(i));
            if (origin) {
                point = origin;
            }
            Canvas.image(ctx, image, point.x, point.y, w, h);
            if (origin) {
                ctx.restore();
            }
        }
    };

    VectorMarkerSymbolizer.prototype._createMarkerImage = function _createMarkerImage(ctx, resources) {
        var canvasClass = ctx.canvas.constructor,
            lineWidth = this.strokeAndFill['lineWidth'],
            shadow = this.geometry.options['shadowBlur'],
            w = this.style['markerWidth'] + lineWidth + 2 * shadow + this.padding[0],
            h = this.style['markerHeight'] + lineWidth + 2 * shadow + this.padding[1],
            canvas = Canvas.createCanvas(w, h, canvasClass),
            point = this._getAnchor();
        var context = canvas.getContext('2d');
        var gradient = isGradient(this.strokeAndFill['lineColor']) || isGradient(this.strokeAndFill['polygonFill']);
        if (!gradient) {
            Canvas.prepareCanvas(context, this.strokeAndFill, resources);
        }
        this._drawVectorMarker(context, point, resources);
        // context.strokeStyle = '#f00';
        // context.strokeWidth = 10;
        // context.strokeRect(0, 0, w, h);
        return canvas;
    };

    VectorMarkerSymbolizer.prototype._stampSymbol = function _stampSymbol() {
        if (!this._stamp) {
            this._stamp = [this.style['markerType'], isGradient(this.style['markerFill']) ? getGradientStamp(this.style['markerFill']) : this.style['markerFill'], this.style['markerFillOpacity'], this.style['markerFillPatternFile'], isGradient(this.style['markerLineColor']) ? getGradientStamp(this.style['markerLineColor']) : this.style['markerLineColor'], this.style['markerLineWidth'], this.style['markerLineOpacity'], this.style['markerLineDasharray'] ? this.style['markerLineDasharray'].join(',') : '', this.style['markerLinePatternFile'], this.style['markerWidth'], this.style['markerHeight']].join('_');
        }
        return this._stamp;
    };

    VectorMarkerSymbolizer.prototype._getAnchor = function _getAnchor() {
        var markerType = this.style['markerType'].toLowerCase(),
            lineWidth = this.strokeAndFill['lineWidth'],
            shadow = this.geometry.options['shadowBlur'],
            w = this.style['markerWidth'],
            h = this.style['markerHeight'];
        if (markerType === 'bar' || markerType === 'pie' || markerType === 'pin') {
            return new Point((w + lineWidth + this.padding[0]) / 2 + shadow, h + lineWidth / 2 + shadow + this.padding[1]);
        } else {
            return new Point((w + lineWidth + this.padding[0]) / 2 + shadow, h / 2 + lineWidth / 2 + shadow + this.padding[1] / 2);
        }
    };

    VectorMarkerSymbolizer.prototype._getGraidentExtent = function _getGraidentExtent(points) {
        var e = new PointExtent(),
            m = this.getMarkerExtent();
        if (Array.isArray(points)) {
            for (var i = points.length - 1; i >= 0; i--) {
                e._combine(points[i]);
            }
        } else {
            e._combine(points);
        }
        e['xmin'] += m['xmin'];
        e['ymin'] += m['ymin'];
        e['xmax'] += m['xmax'];
        e['ymax'] += m['ymax'];
        return e;
    };

    VectorMarkerSymbolizer.prototype._drawVectorMarker = function _drawVectorMarker(ctx, point, resources) {
        var style = this.style,
            strokeAndFill = this.strokeAndFill,
            markerType = style['markerType'].toLowerCase(),
            vectorArray = VectorMarkerSymbolizer._getVectorPoints(markerType, style['markerWidth'], style['markerHeight']),
            lineOpacity = strokeAndFill['lineOpacity'],
            fillOpacity = strokeAndFill['polygonOpacity'],
            j,
            lineCap,
            angle,
            gradientExtent;
        var gradient = isGradient(strokeAndFill['lineColor']) || isGradient(strokeAndFill['polygonFill']);
        if (gradient) {
            if (isGradient(strokeAndFill['lineColor'])) {
                gradientExtent = this._getGraidentExtent(point);
                strokeAndFill['lineGradientExtent'] = gradientExtent.expand(strokeAndFill['lineWidth']);
            }
            if (isGradient(strokeAndFill['polygonFill'])) {
                if (!gradientExtent) {
                    gradientExtent = this._getGraidentExtent(point);
                }
                strokeAndFill['polygonGradientExtent'] = gradientExtent;
            }
            Canvas.prepareCanvas(ctx, strokeAndFill, resources);
        }

        var width = style['markerWidth'],
            height = style['markerHeight'];
        if (markerType === 'ellipse') {
            //ellipse default
            Canvas.ellipse(ctx, point, width / 2, height / 2, lineOpacity, fillOpacity);
        } else if (markerType === 'cross' || markerType === 'x') {
            for (j = vectorArray.length - 1; j >= 0; j--) {
                vectorArray[j]._add(point);
            }
            //线类型
            Canvas.path(ctx, vectorArray.slice(0, 2), lineOpacity);
            Canvas.path(ctx, vectorArray.slice(2, 4), lineOpacity);
        } else if (markerType === 'diamond' || markerType === 'bar' || markerType === 'square' || markerType === 'triangle') {
            if (markerType === 'bar') {
                point = point.add(0, -style['markerLineWidth'] / 2);
            }
            for (j = vectorArray.length - 1; j >= 0; j--) {
                vectorArray[j]._add(point);
            }
            //面类型
            Canvas.polygon(ctx, vectorArray, lineOpacity, fillOpacity);
        } else if (markerType === 'pin') {
            point = point.add(0, -style['markerLineWidth'] / 2);
            for (j = vectorArray.length - 1; j >= 0; j--) {
                vectorArray[j]._add(point);
            }
            lineCap = ctx.lineCap;
            ctx.lineCap = 'round'; //set line cap to round to close the pin bottom
            Canvas.bezierCurveAndFill(ctx, vectorArray, lineOpacity, fillOpacity);
            ctx.lineCap = lineCap;
        } else if (markerType === 'pie') {
            point = point.add(0, -style['markerLineWidth'] / 2);
            angle = Math.atan(width / 2 / height) * 180 / Math.PI;
            lineCap = ctx.lineCap;
            ctx.lineCap = 'round';
            Canvas.sector(ctx, point, height, [90 - angle, 90 + angle], lineOpacity, fillOpacity);
            ctx.lineCap = lineCap;
        } else {
            throw new Error('unsupported markerType: ' + markerType);
        }
    };

    VectorMarkerSymbolizer.prototype.getPlacement = function getPlacement() {
        return this.symbol['markerPlacement'];
    };

    VectorMarkerSymbolizer.prototype.getRotation = function getRotation() {
        var r = this.style['markerRotation'];
        if (!isNumber(r)) {
            return null;
        }
        //to radian
        return r * Math.PI / 180;
    };

    VectorMarkerSymbolizer.prototype.getDxDy = function getDxDy() {
        var s = this.style;
        var dx = s['markerDx'],
            dy = s['markerDy'];
        return new Point(dx, dy);
    };

    VectorMarkerSymbolizer.prototype.getMarkerExtent = function getMarkerExtent() {
        var dxdy = this.getDxDy(),
            style = this.style;
        var markerType = style['markerType'].toLowerCase();
        var width = style['markerWidth'],
            height = style['markerHeight'];
        var result;
        if (markerType === 'bar' || markerType === 'pie' || markerType === 'pin') {
            result = new PointExtent(dxdy.add(-width / 2, -height), dxdy.add(width / 2, 0));
        } else {
            result = new PointExtent(dxdy.add(-width / 2, -height / 2), dxdy.add(width / 2, height / 2));
        }
        if (this.style['markerLineWidth']) {
            result._expand(this.style['markerLineWidth'] / 2);
        }
        return result;
    };

    VectorMarkerSymbolizer.prototype.translate = function translate() {
        var s = this.symbol;
        var result = {
            'markerType': getValueOrDefault(s['markerType'], 'ellipse'), //<----- ellipse | cross | x | triangle | diamond | square | bar | pin等,默认ellipse
            'markerFill': getValueOrDefault(s['markerFill'], '#00f'), //blue as cartoCSS
            'markerFillOpacity': getValueOrDefault(s['markerFillOpacity'], 1),
            'markerFillPatternFile': getValueOrDefault(s['markerFillPatternFile'], null),
            'markerLineColor': getValueOrDefault(s['markerLineColor'], '#000'), //black
            'markerLineWidth': getValueOrDefault(s['markerLineWidth'], 1),
            'markerLineOpacity': getValueOrDefault(s['markerLineOpacity'], 1),
            'markerLineDasharray': getValueOrDefault(s['markerLineDasharray'], []),
            'markerLinePatternFile': getValueOrDefault(s['markerLinePatternFile'], null),

            'markerWidth': getValueOrDefault(s['markerWidth'], 10),
            'markerHeight': getValueOrDefault(s['markerHeight'], 10),

            'markerDx': getValueOrDefault(s['markerDx'], 0),
            'markerDy': getValueOrDefault(s['markerDy'], 0)
        };
        //markerOpacity覆盖fillOpacity和lineOpacity
        if (isNumber(s['markerOpacity'])) {
            result['markerFillOpacity'] *= s['markerOpacity'];
            result['markerLineOpacity'] *= s['markerOpacity'];
        }
        return result;
    };

    VectorMarkerSymbolizer.translateLineAndFill = function translateLineAndFill(s) {
        var result = {
            'lineColor': s['markerLineColor'],
            'linePatternFile': s['markerLinePatternFile'],
            'lineWidth': s['markerLineWidth'],
            'lineOpacity': s['markerLineOpacity'],
            'lineDasharray': null,
            'lineCap': 'butt',
            'lineJoin': 'round',
            'polygonFill': s['markerFill'],
            'polygonPatternFile': s['markerFillPatternFile'],
            'polygonOpacity': s['markerFillOpacity']
        };
        if (result['lineWidth'] === 0) {
            result['lineOpacity'] = 0;
        }
        return result;
    };

    VectorMarkerSymbolizer._getVectorPoints = function _getVectorPoints(markerType, width, height) {
        //half height and half width
        var hh = height / 2,
            hw = width / 2;
        var left = 0,
            top = 0;
        var v0, v1, v2, v3;
        if (markerType === 'triangle') {
            v0 = new Point(left, top - hh);
            v1 = new Point(left - hw, top + hh);
            v2 = new Point(left + hw, top + hh);
            return [v0, v1, v2];
        } else if (markerType === 'cross') {
            v0 = new Point(left - hw, top);
            v1 = new Point(left + hw, top);
            v2 = new Point(left, top - hh);
            v3 = new Point(left, top + hh);
            return [v0, v1, v2, v3];
        } else if (markerType === 'diamond') {
            v0 = new Point(left - hw, top);
            v1 = new Point(left, top - hh);
            v2 = new Point(left + hw, top);
            v3 = new Point(left, top + hh);
            return [v0, v1, v2, v3];
        } else if (markerType === 'square') {
            v0 = new Point(left - hw, top + hh);
            v1 = new Point(left + hw, top + hh);
            v2 = new Point(left + hw, top - hh);
            v3 = new Point(left - hw, top - hh);
            return [v0, v1, v2, v3];
        } else if (markerType === 'x') {
            v0 = new Point(left - hw, top + hh);
            v1 = new Point(left + hw, top - hh);
            v2 = new Point(left + hw, top + hh);
            v3 = new Point(left - hw, top - hh);
            return [v0, v1, v2, v3];
        } else if (markerType === 'bar') {
            v0 = new Point(left - hw, top - height);
            v1 = new Point(left + hw, top - height);
            v2 = new Point(left + hw, top);
            v3 = new Point(left - hw, top);
            return [v0, v1, v2, v3];
        } else if (markerType === 'pin') {
            var extWidth = height * Math.atan(hw / hh);
            v0 = new Point(left, top);
            v1 = new Point(left - extWidth, top - height);
            v2 = new Point(left + extWidth, top - height);
            v3 = new Point(left, top);
            return [v0, v1, v2, v3];
        }
        return null;
    };

    return VectorMarkerSymbolizer;
}(PointSymbolizer);

var styles = {
    'lineColor': '#000',
    'lineOpacity': 1,
    'lineWidth': 1
};

var DebugSymbolizer = function (_PointSymbolizer) {
    inherits(DebugSymbolizer, _PointSymbolizer);

    function DebugSymbolizer() {
        classCallCheck(this, DebugSymbolizer);
        return possibleConstructorReturn(this, _PointSymbolizer.apply(this, arguments));
    }

    DebugSymbolizer.prototype.getPlacement = function getPlacement() {
        return 'point';
    };

    DebugSymbolizer.prototype.getDxDy = function getDxDy() {
        return new Point(0, 0);
    };

    DebugSymbolizer.prototype.symbolize = function symbolize(ctx) {
        var geometry = this.geometry,
            layer = geometry.getLayer();
        if (!geometry.options['debug'] && layer && !layer.options['debug']) {
            return;
        }
        var map = this.getMap();
        if (!map || map.isZooming()) {
            return;
        }
        Canvas.prepareCanvas(ctx, styles);
        var op = styles['lineOpacity'];

        //outline
        var pixelExtent = this.getPainter().getContainerExtent();
        var nw = pixelExtent.getMin(),
            size = pixelExtent.getSize();
        Canvas.rectangle(ctx, nw, size, op, 0);

        //center cross and id if have any.
        var points = this._getRenderContainerPoints();

        var id = this.geometry.getId();
        var cross = VectorMarkerSymbolizer._getVectorPoints('cross', 10, 10);
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (!isNil(id)) {
                Canvas.fillText(ctx, id, p.add(8, -4), 'rgba(0,0,0,1)');
            }
            var c = [];
            for (var ii = 0; ii < cross.length; ii++) {
                c.push(cross[ii].add(p));
            }
            Canvas.path(ctx, c.slice(0, 2), op);
            Canvas.path(ctx, c.slice(2, 4), op);
        }
    };

    return DebugSymbolizer;
}(PointSymbolizer);

var ImageMarkerSymbolizer = function (_PointSymbolizer) {
    inherits(ImageMarkerSymbolizer, _PointSymbolizer);

    ImageMarkerSymbolizer.test = function test(symbol) {
        if (!symbol) {
            return false;
        }
        if (!isNil(symbol['markerFile'])) {
            return true;
        }
        return false;
    };

    function ImageMarkerSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, ImageMarkerSymbolizer);

        var _this = possibleConstructorReturn(this, _PointSymbolizer.call(this, symbol, geometry, painter));

        _this.style = _this._defineStyle(_this.translate());
        return _this;
    }

    ImageMarkerSymbolizer.prototype.symbolize = function symbolize(ctx, resources) {
        var style = this.style;
        if (style['markerWidth'] === 0 || style['markerHeight'] === 0 || style['markerOpacity'] === 0) {
            return;
        }
        var cookedPoints = this._getRenderContainerPoints();
        if (!isArrayHasData(cookedPoints)) {
            return;
        }

        var img = this._getImage(resources);
        if (!img) {
            if (!Browser$1.phantomjs && console) {
                console.warn('no img found for ' + (this.style['markerFile'] || this._url[0]));
            }
            return;
        }
        this._prepareContext(ctx);
        var width = style['markerWidth'];
        var height = style['markerHeight'];
        if (!isNumber(width) || !isNumber(height)) {
            width = img.width;
            height = img.height;
            style['markerWidth'] = width;
            style['markerHeight'] = height;
            var imgURL = [style['markerFile'], style['markerWidth'], style['markerHeight']];
            if (!resources.isResourceLoaded(imgURL)) {
                resources.addResource(imgURL, img);
            }
            var painter = this.getPainter();
            if (!painter.isSpriting()) {
                painter.removeCache();
            }
        }
        var alpha;
        // for VectorPathMarkerSymbolizer, opacity is already set into SVG element.
        if (this.symbol['markerType'] !== 'path' && isNumber(style['markerOpacity']) && style['markerOpacity'] < 1) {
            alpha = ctx.globalAlpha;
            ctx.globalAlpha *= style['markerOpacity'];
        }
        var p;
        for (var i = 0, len = cookedPoints.length; i < len; i++) {
            p = cookedPoints[i];
            var origin = this._rotate(ctx, p, this._getRotationAt(i));
            if (origin) {
                p = origin;
            }
            //图片定位到中心底部
            Canvas.image(ctx, img, p.x - width / 2, p.y - height, width, height);
            if (origin) {
                ctx.restore();
            }
        }
        if (alpha !== undefined) {
            ctx.globalAlpha = alpha;
        }
    };

    ImageMarkerSymbolizer.prototype._getImage = function _getImage(resources) {
        var img = !resources ? null : resources.getImage([this.style['markerFile'], this.style['markerWidth'], this.style['markerHeight']]);
        return img;
    };

    ImageMarkerSymbolizer.prototype.getPlacement = function getPlacement() {
        return this.symbol['markerPlacement'];
    };

    ImageMarkerSymbolizer.prototype.getRotation = function getRotation() {
        var r = this.style['markerRotation'];
        if (!isNumber(r)) {
            return null;
        }
        //to radian
        return r * Math.PI / 180;
    };

    ImageMarkerSymbolizer.prototype.getDxDy = function getDxDy() {
        var s = this.style;
        var dx = s['markerDx'] || 0,
            dy = s['markerDy'] || 0;
        return new Point(dx, dy);
    };

    ImageMarkerSymbolizer.prototype.getMarkerExtent = function getMarkerExtent(resources) {
        var url = this.style['markerFile'],
            img = resources ? resources.getImage(url) : null;
        var width = this.style['markerWidth'] || (img ? img.width : 0),
            height = this.style['markerHeight'] || (img ? img.height : 0);
        var dxdy = this.getDxDy();
        return new PointExtent(dxdy.add(-width / 2, 0), dxdy.add(width / 2, -height));
    };

    ImageMarkerSymbolizer.prototype.translate = function translate() {
        var s = this.symbol;
        return {
            'markerFile': s['markerFile'],
            'markerOpacity': getValueOrDefault(s['markerOpacity'], 1),
            'markerWidth': getValueOrDefault(s['markerWidth'], null),
            'markerHeight': getValueOrDefault(s['markerHeight'], null),
            'markerDx': getValueOrDefault(s['markerDx'], 0),
            'markerDy': getValueOrDefault(s['markerDy'], 0)
        };
    };

    return ImageMarkerSymbolizer;
}(PointSymbolizer);

var StrokeAndFillSymbolizer = function (_CanvasSymbolizer) {
    inherits(StrokeAndFillSymbolizer, _CanvasSymbolizer);

    StrokeAndFillSymbolizer.test = function test(symbol, geometry) {
        if (!symbol) {
            return false;
        }
        if (geometry && geometry.type === 'Point') {
            return false;
        }
        for (var p in symbol) {
            var f = p.slice(0, 4);
            if (f === 'line' || f === 'poly') {
                return true;
            }
        }
        return false;
    };

    function StrokeAndFillSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, StrokeAndFillSymbolizer);

        var _this = possibleConstructorReturn(this, _CanvasSymbolizer.call(this));

        _this.symbol = symbol;
        _this.geometry = geometry;
        _this.painter = painter;
        if (geometry.type === 'Point') {
            return possibleConstructorReturn(_this);
        }
        _this.style = _this._defineStyle(_this.translate());
        return _this;
    }

    StrokeAndFillSymbolizer.prototype.symbolize = function symbolize(ctx, resources) {
        if (this.geometry.type === 'Point') {
            return;
        }
        var style = this.style;
        if (style['polygonOpacity'] === 0 && style['lineOpacity'] === 0) {
            return;
        }
        var paintParams = this._getPaintParams();
        if (!paintParams) {
            return;
        }
        this._prepareContext(ctx);
        var isGradient$$1 = isGradient(style['lineColor']),
            isPath = this.geometry.getJSONType() === 'Polygon' || this.geometry.type === 'LineString';
        if (isGradient$$1 && (style['lineColor']['places'] || !isPath)) {
            style['lineGradientExtent'] = this.getPainter().getContainerExtent()._expand(style['lineWidth']);
        }
        if (isGradient(style['polygonFill'])) {
            style['polygonGradientExtent'] = this.getPainter().getContainerExtent();
        }

        var points = paintParams[0],
            isSplitted = this.geometry.getJSONType() === 'Polygon' && points.length > 1 && Array.isArray(points[0][0]) || this.geometry.type === 'LineString' && points.length > 1 && Array.isArray(points[0]);
        var params;
        if (isSplitted) {
            for (var i = 0; i < points.length; i++) {
                Canvas.prepareCanvas(ctx, style, resources);
                if (isGradient$$1 && isPath && !style['lineColor']['places']) {
                    this._createGradient(ctx, points[i], style['lineColor']);
                }
                params = [ctx, points[i]];
                if (paintParams.length > 1) {
                    params.push.apply(params, paintParams.slice(1));
                }
                params.push(style['lineOpacity'], style['polygonOpacity'], style['lineDasharray']);
                this.geometry._paintOn.apply(this.geometry, params);
            }
        } else {
            Canvas.prepareCanvas(ctx, style, resources);
            if (isGradient$$1 && isPath && !style['lineColor']['places']) {
                this._createGradient(ctx, points, style['lineColor']);
            }
            params = [ctx];
            params.push.apply(params, paintParams);
            params.push(style['lineOpacity'], style['polygonOpacity'], style['lineDasharray']);
            this.geometry._paintOn.apply(this.geometry, params);
        }

        if (ctx.setLineDash && Array.isArray(style['lineDasharray'])) {
            ctx.setLineDash([]);
        }
    };

    StrokeAndFillSymbolizer.prototype.get2DExtent = function get2DExtent() {
        if (this.geometry.type === 'Point') {
            return null;
        }
        var map = this.getMap();
        var extent = this.geometry._getPrjExtent();
        if (!extent) {
            return null;
        }
        // this ugly implementation is to improve perf as we can
        // it tries to avoid creating instances to save cpu consumption.
        if (!this._extMin || !this._extMax) {
            this._extMin = new Coordinate(0, 0);
            this._extMax = new Coordinate(0, 0);
        }
        this._extMin.x = extent['xmin'];
        this._extMin.y = extent['ymin'];
        this._extMax.x = extent['xmax'];
        this._extMax.y = extent['ymax'];
        var min = map._prjToPoint(this._extMin),
            max = map._prjToPoint(this._extMax);
        if (!this._pxExtent) {
            this._pxExtent = new PointExtent(min, max);
        } else {
            if (min.x < max.x) {
                this._pxExtent['xmin'] = min.x;
                this._pxExtent['xmax'] = max.x;
            } else {
                this._pxExtent['xmax'] = min.x;
                this._pxExtent['xmin'] = max.x;
            }
            if (min.y < max.y) {
                this._pxExtent['ymin'] = min.y;
                this._pxExtent['ymax'] = max.y;
            } else {
                this._pxExtent['ymax'] = min.y;
                this._pxExtent['ymin'] = max.y;
            }
        }
        return this._pxExtent._expand(this.style['lineWidth'] / 2);
    };

    StrokeAndFillSymbolizer.prototype._getPaintParams = function _getPaintParams() {
        return this.getPainter().getPaintParams(this.style['lineDx'], this.style['lineDy']);
    };

    StrokeAndFillSymbolizer.prototype.translate = function translate() {
        var s = this.symbol;
        var result = {
            'lineColor': getValueOrDefault(s['lineColor'], '#000'),
            'lineWidth': getValueOrDefault(s['lineWidth'], 2),
            'lineOpacity': getValueOrDefault(s['lineOpacity'], 1),
            'lineDasharray': getValueOrDefault(s['lineDasharray'], []),
            'lineCap': getValueOrDefault(s['lineCap'], 'butt'), //“butt”, “square”, “round”
            'lineJoin': getValueOrDefault(s['lineJoin'], 'miter'), //“bevel”, “round”, “miter”
            'linePatternFile': getValueOrDefault(s['linePatternFile'], null),
            'lineDx': getValueOrDefault(s['lineDx'], 0),
            'lineDy': getValueOrDefault(s['lineDy'], 0),
            'polygonFill': getValueOrDefault(s['polygonFill'], null),
            'polygonOpacity': getValueOrDefault(s['polygonOpacity'], 1),
            'polygonPatternFile': getValueOrDefault(s['polygonPatternFile'], null)
        };
        if (result['lineWidth'] === 0) {
            result['lineOpacity'] = 0;
        }
        // fill of arrow
        if (this.geometry.type === 'LineString' && !result['polygonFill']) {
            result['polygonFill'] = result['lineColor'];
        }
        return result;
    };

    StrokeAndFillSymbolizer.prototype._createGradient = function _createGradient(ctx, points, lineColor) {
        if (!Array.isArray(points)) {
            return;
        }
        var len = points.length;
        var grad = ctx.createLinearGradient(points[0].x, points[0].y, points[len - 1].x, points[len - 1].y);
        lineColor['colorStops'].forEach(function (stop) {
            grad.addColorStop.apply(grad, stop);
        });
        ctx.strokeStyle = grad;
    };

    return StrokeAndFillSymbolizer;
}(CanvasSymbolizer);

var TextMarkerSymbolizer = function (_PointSymbolizer) {
    inherits(TextMarkerSymbolizer, _PointSymbolizer);

    TextMarkerSymbolizer.test = function test(symbol) {
        if (!symbol) {
            return false;
        }
        if (!isNil(symbol['textName'])) {
            return true;
        }
        return false;
    };

    function TextMarkerSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, TextMarkerSymbolizer);

        var _this = possibleConstructorReturn(this, _PointSymbolizer.call(this, symbol, geometry, painter));

        _this.style = _this._defineStyle(_this.translate());
        _this.strokeAndFill = _this._defineStyle(_this.translateLineAndFill(_this.style));
        var textContent = replaceVariable(_this.style['textName'], _this.geometry.getProperties());
        _this._descText(textContent);
        return _this;
    }

    TextMarkerSymbolizer.prototype.symbolize = function symbolize(ctx, resources) {
        if (this.style['textSize'] === 0 || this.style['textOpacity'] === 0) {
            return;
        }
        var cookedPoints = this._getRenderContainerPoints();
        if (!isArrayHasData(cookedPoints)) {
            return;
        }
        var style = this.style,
            strokeAndFill = this.strokeAndFill;
        var textContent = replaceVariable(this.style['textName'], this.geometry.getProperties());
        this._descText(textContent);
        this._prepareContext(ctx);
        Canvas.prepareCanvas(ctx, strokeAndFill, resources);
        Canvas.prepareCanvasFont(ctx, style);
        var p;
        for (var i = 0, len = cookedPoints.length; i < len; i++) {
            p = cookedPoints[i];
            var origin = this._rotate(ctx, p, this._getRotationAt(i));
            if (origin) {
                p = origin;
            }
            Canvas.text(ctx, textContent, p, style, this.textDesc);
            if (origin) {
                ctx.restore();
            }
        }
    };

    TextMarkerSymbolizer.prototype.getPlacement = function getPlacement() {
        return this.symbol['textPlacement'];
    };

    TextMarkerSymbolizer.prototype.getRotation = function getRotation() {
        var r = this.style['textRotation'];
        if (!isNumber(r)) {
            return null;
        }
        //to radian
        return r * Math.PI / 180;
    };

    TextMarkerSymbolizer.prototype.getDxDy = function getDxDy() {
        var s = this.style;
        var dx = s['textDx'],
            dy = s['textDy'];
        return new Point(dx, dy);
    };

    TextMarkerSymbolizer.prototype.getMarkerExtent = function getMarkerExtent() {
        var dxdy = this.getDxDy(),
            style = this.style,
            size = this.textDesc['size'];
        var alignPoint = getAlignPoint(size, style['textHorizontalAlignment'], style['textVerticalAlignment']);
        var alignW = alignPoint.x,
            alignH = alignPoint.y;
        return new PointExtent(dxdy.add(alignW, alignH), dxdy.add(alignW + size['width'], alignH + size['height']));
    };

    TextMarkerSymbolizer.prototype.translate = function translate() {
        var s = this.symbol;
        var result = {
            'textName': s['textName'],
            'textFaceName': getValueOrDefault(s['textFaceName'], 'monospace'),
            'textWeight': getValueOrDefault(s['textWeight'], 'normal'), //'bold', 'bolder'
            'textStyle': getValueOrDefault(s['textStyle'], 'normal'), //'italic', 'oblique'
            'textSize': getValueOrDefault(s['textSize'], 10),
            'textFont': getValueOrDefault(s['textFont'], null),
            'textFill': getValueOrDefault(s['textFill'], '#000'),
            'textOpacity': getValueOrDefault(s['textOpacity'], 1),

            'textHaloFill': getValueOrDefault(s['textHaloFill'], '#ffffff'),
            'textHaloRadius': getValueOrDefault(s['textHaloRadius'], 0),
            'textHaloOpacity': getValueOrDefault(s['textHaloOpacity'], 1),

            'textWrapWidth': getValueOrDefault(s['textWrapWidth'], null),
            'textWrapBefore': getValueOrDefault(s['textWrapBefore'], false),
            'textWrapCharacter': getValueOrDefault(s['textWrapCharacter'], null),
            'textLineSpacing': getValueOrDefault(s['textLineSpacing'], 0),

            'textDx': getValueOrDefault(s['textDx'], 0),
            'textDy': getValueOrDefault(s['textDy'], 0),

            'textHorizontalAlignment': getValueOrDefault(s['textHorizontalAlignment'], 'middle'), //left | middle | right | auto
            'textVerticalAlignment': getValueOrDefault(s['textVerticalAlignment'], 'middle'), // top | middle | bottom | auto
            'textAlign': getValueOrDefault(s['textAlign'], 'center') //left | right | center | auto
        };

        return result;
    };

    TextMarkerSymbolizer.prototype.translateLineAndFill = function translateLineAndFill(s) {
        return {
            'lineColor': s['textHaloRadius'] ? s['textHaloFill'] : s['textFill'],
            'lineWidth': s['textHaloRadius'],
            'lineOpacity': s['textOpacity'],
            'lineDasharray': null,
            'lineCap': 'butt',
            'lineJoin': 'round',
            'polygonFill': s['textFill'],
            'polygonOpacity': s['textOpacity']
        };
    };

    TextMarkerSymbolizer.prototype._descText = function _descText(textContent) {
        this.textDesc = this._loadFromCache(textContent, this.style);
        if (!this.textDesc) {
            this.textDesc = splitTextToRow(textContent, this.style);
            this._storeToCache(textContent, this.style, this.textDesc);
        }
    };

    TextMarkerSymbolizer.prototype._storeToCache = function _storeToCache(textContent, style, textDesc) {
        if (isNode) {
            return;
        }
        if (!this.geometry['___text_symbol_cache']) {
            this.geometry['___text_symbol_cache'] = {};
        }
        this.geometry['___text_symbol_cache'][this._genCacheKey(style)] = textDesc;
    };

    TextMarkerSymbolizer.prototype._loadFromCache = function _loadFromCache(textContent, style) {
        if (!this.geometry['___text_symbol_cache']) {
            return null;
        }
        return this.geometry['___text_symbol_cache'][this._genCacheKey(textContent, style)];
    };

    TextMarkerSymbolizer.prototype._genCacheKey = function _genCacheKey(textContent, style) {
        var key = [textContent];
        for (var p in style) {
            if (style.hasOwnProperty(p) && p.length > 4 && p.substring(0, 4) === 'text') {
                key.push(p + '=' + style[p]);
            }
        }
        return key.join('-');
    };

    return TextMarkerSymbolizer;
}(PointSymbolizer);

var VectorPathMarkerSymbolizer = function (_ImageMarkerSymbolize) {
    inherits(VectorPathMarkerSymbolizer, _ImageMarkerSymbolize);

    VectorPathMarkerSymbolizer.test = function test(symbol) {
        if (!symbol) {
            return false;
        }
        if (isNil(symbol['markerFile']) && symbol['markerType'] === 'path') {
            return true;
        }
        return false;
    };

    function VectorPathMarkerSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, VectorPathMarkerSymbolizer);

        var _this = possibleConstructorReturn(this, _ImageMarkerSymbolize.call(this, symbol, geometry, painter));

        _this.style = _this._defineStyle(_this.translate());
        _this._url = [getMarkerPathBase64(symbol), symbol['markerWidth'], symbol['markerHeight']];
        //IE must have a valid width and height to draw a svg image
        //otherwise, error will be thrown
        if (isNil(_this.style['markerWidth'])) {
            _this.style['markerWidth'] = 80;
        }
        if (isNil(_this.style['markerHeight'])) {
            _this.style['markerHeight'] = 80;
        }
        return _this;
    }

    VectorPathMarkerSymbolizer.prototype._prepareContext = function _prepareContext() {
        //for VectorPathMarkerSymbolizer, opacity is already added into SVG element.
    };

    VectorPathMarkerSymbolizer.prototype._getImage = function _getImage(resources) {
        if (resources && resources.isResourceLoaded(this._url)) {
            return resources.getImage(this._url);
        }
        var image = new Image();
        image.src = this._url[0];
        if (resources) {
            resources.addResource(this._url, image);
        }
        return image;
        // return resources ? resources.getImage(this._url) : null;
    };

    return VectorPathMarkerSymbolizer;
}(ImageMarkerSymbolizer);



var index$2 = Object.freeze({
	Symbolizer: Symbolizer,
	CanvasSymbolizer: CanvasSymbolizer,
	DebugSymbolizer: DebugSymbolizer,
	ImageMarkerSymbolizer: ImageMarkerSymbolizer,
	PointSymbolizer: PointSymbolizer,
	StrokeAndFillSymbolizer: StrokeAndFillSymbolizer,
	TextMarkerSymbolizer: TextMarkerSymbolizer,
	VectorMarkerSymbolizer: VectorMarkerSymbolizer,
	VectorPathMarkerSymbolizer: VectorPathMarkerSymbolizer
});

/**
 * Translate symbol properties to SVG properties
 * @param  {Object} s - object with symbol properties
 * @return {Object}   object with SVG properties
 * @memberOf Util
 */
function translateToSVGStyles(s) {
    var result = {
        'stroke': {
            'stroke': s['markerLineColor'],
            'stroke-width': s['markerLineWidth'],
            'stroke-opacity': s['markerLineOpacity'],
            'stroke-dasharray': null,
            'stroke-linecap': 'butt',
            'stroke-linejoin': 'round'
        },
        'fill': {
            'fill': s['markerFill'],
            'fill-opacity': s['markerFillOpacity']
        }
    };
    //vml和svg对linecap的定义不同
    if (result['stroke']['stroke-linecap'] === 'butt') {
        if (Browser$1.vml) {
            result['stroke']['stroke-linecap'] = 'flat';
        }
    }
    if (result['stroke']['stroke-width'] === 0) {
        result['stroke']['stroke-opacity'] = 0;
    }
    return result;
}

/**
 * Get SVG Base64 String from a marker symbol with (markerType : path)
 * @param  {Object} symbol - symbol with markerType of path
 * @return {String}        SVG Base64 String
 * @memberOf Util
 */
function getMarkerPathBase64(symbol) {
    if (!symbol['markerPath']) {
        return null;
    }
    var op = 1,
        styles = translateToSVGStyles(symbol);
    //context.globalAlpha doesn't take effect with drawing SVG in IE9/10/11 and EGDE, so set opacity in SVG element.
    if (isNumber(symbol['markerOpacity'])) {
        op = symbol['markerOpacity'];
    }
    if (isNumber(symbol['opacity'])) {
        op *= symbol['opacity'];
    }
    var p,
        svgStyles = {};
    if (styles) {
        for (p in styles['stroke']) {
            if (styles['stroke'].hasOwnProperty(p)) {
                if (!isNil(styles['stroke'][p])) {
                    svgStyles[p] = styles['stroke'][p];
                }
            }
        }
        for (p in styles['fill']) {
            if (styles['fill'].hasOwnProperty(p)) {
                if (!isNil(styles['fill'][p])) {
                    svgStyles[p] = styles['fill'][p];
                }
            }
        }
    }

    var pathes = Array.isArray(symbol['markerPath']) ? symbol['markerPath'] : [symbol['markerPath']];
    var i,
        path,
        pathesToRender = [];
    for (i = 0; i < pathes.length; i++) {
        path = isString(pathes[i]) ? {
            'path': pathes[i]
        } : pathes[i];
        path = extend({}, path, svgStyles);
        path['d'] = path['path'];
        delete path['path'];
        pathesToRender.push(path);
    }
    var svg = ['<svg version="1.1"', 'xmlns="http://www.w3.org/2000/svg"'];
    if (op < 1) {
        svg.push('opacity="' + op + '"');
    }
    // if (symbol['markerWidth'] && symbol['markerHeight']) {
    //     svg.push('height="' + symbol['markerHeight'] + '" width="' + symbol['markerWidth'] + '"');
    // }
    if (symbol['markerPathWidth'] && symbol['markerPathHeight']) {
        svg.push('viewBox="0 0 ' + symbol['markerPathWidth'] + ' ' + symbol['markerPathHeight'] + '"');
    }
    svg.push('preserveAspectRatio="none"');
    svg.push('><defs></defs>');

    for (i = 0; i < pathesToRender.length; i++) {
        var strPath = '<path ';
        for (p in pathesToRender[i]) {
            if (pathesToRender[i].hasOwnProperty(p)) {
                strPath += ' ' + p + '="' + pathesToRender[i][p] + '"';
            }
        }
        strPath += '></path>';
        svg.push(strPath);
    }
    svg.push('</svg>');
    var b64 = 'data:image/svg+xml;base64,' + btoa(svg.join(' '));
    return b64;
}

/**
 * Get external resources from the given symbol
 * @param  {Object} symbol      - symbol
 * @param  {Boolean} toAbsolute - whether convert url to aboslute
 * @return {String[]}           - resource urls
 * @memberOf Util
 */
function getExternalResources(symbol, toAbsolute) {
    if (!symbol) {
        return null;
    }
    var symbols = symbol;
    if (!Array.isArray(symbol)) {
        symbols = [symbol];
    }
    var resources = [];
    var props = Symbolizer.resourceProperties,
        i,
        ii,
        iii,
        res,
        resSizeProp;
    var w, h;
    for (i = symbols.length - 1; i >= 0; i--) {
        symbol = symbols[i];
        if (!symbol) {
            continue;
        }
        if (toAbsolute) {
            symbol = convertResourceUrl(symbol);
        }
        for (ii = 0; ii < props.length; ii++) {
            res = symbol[props[ii]];
            if (isFunctionDefinition(res)) {
                res = getFunctionTypeResources(res);
            }
            if (!res) {
                continue;
            }
            if (!Array.isArray(res)) {
                res = [res];
            }
            for (iii = 0; iii < res.length; iii++) {
                if (res[iii].slice(0, 4) === 'url(') {
                    res[iii] = extractCssUrl(res[iii]);
                }
                resSizeProp = Symbolizer.resourceSizeProperties[ii];
                resources.push([res[iii], symbol[resSizeProp[0]], symbol[resSizeProp[1]]]);
            }
        }
        if (symbol['markerType'] === 'path' && symbol['markerPath']) {
            w = isFunctionDefinition(symbol['markerWidth']) ? 200 : symbol['markerWidth'];
            h = isFunctionDefinition(symbol['markerHeight']) ? 200 : symbol['markerHeight'];
            if (isFunctionDefinition(symbol['markerPath'])) {
                res = getFunctionTypeResources(symbol['markerPath']);
                var path = symbol['markerPath'];
                for (iii = 0; iii < res.length; iii++) {
                    symbol['markerPath'] = res[iii];
                    resources.push([getMarkerPathBase64(symbol), w, h]);
                }
                symbol['markerPath'] = path;
            } else {
                resources.push([getMarkerPathBase64(symbol), w, h]);
            }
        }
    }
    return resources;
}

/**
 * Convert symbol's resources' urls from relative path to an absolute path.
 * @param  {Object} symbol
 * @private
 * @memberOf Util
 */
function convertResourceUrl(symbol) {
    if (!symbol) {
        return null;
    }

    var s = symbol;
    if (isNode) {
        return s;
    }
    var props = Symbolizer.resourceProperties;
    var res;
    for (var ii = 0, len = props.length; ii < len; ii++) {
        res = s[props[ii]];
        if (!res) {
            continue;
        }
        s[props[ii]] = _convertUrlToAbsolute(res);
    }
    return s;
}

function _convertUrlToAbsolute(res) {
    if (isFunctionDefinition(res)) {
        var stops = res.stops;
        for (var i = 0; i < stops.length; i++) {
            stops[i][1] = _convertUrlToAbsolute(stops[i][1]);
        }
        return res;
    }
    var embed = 'data:';
    if (res.slice(0, 4) === 'url(') {
        res = extractCssUrl(res);
    }
    if (!isURL(res) && (res.length <= embed.length || res.substring(0, embed.length) !== embed)) {
        res = _absolute(location.href, res);
    }
    return res;
}

function _absolute(base, relative) {
    var stack = base.split('/'),
        parts = relative.split('/');
    if (relative.slice(0, 1) === 0) {
        return stack.slice(0, 3).join('/') + relative;
    } else {
        stack.pop(); // remove current file name (or empty string)
        // (omit if "base" is the current folder without trailing slash)
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === '.') continue;
            if (parts[i] === '..') stack.pop();else stack.push(parts[i]);
        }
        return stack.join('/');
    }
}



var index = Object.freeze({
	now: now,
	extend: extend,
	throttle: throttle,
	isNil: isNil,
	isNumber: isNumber,
	isInteger: isInteger,
	isObject: isObject,
	isString: isString,
	isFunction: isFunction,
	hasOwn: hasOwn,
	isNode: isNode,
	get requestAnimFrame () { return requestAnimFrame; },
	get cancelAnimFrame () { return cancelAnimFrame; },
	setOptions: setOptions,
	isSVG: isSVG,
	noop: noop,
	convertSVG: convertSVG,
	loadImage: loadImage,
	UID: UID,
	GUID: GUID,
	parseJSON: parseJSON,
	executeWhen: executeWhen,
	removeFromArray: removeFromArray,
	mapArrayRecursively: mapArrayRecursively,
	getValueOrDefault: getValueOrDefault,
	round: round,
	sign: sign,
	isArrayHasData: isArrayHasData,
	isURL: isURL,
	isCssUrl: isCssUrl,
	extractCssUrl: extractCssUrl,
	btoa: btoa$1,
	computeDegree: computeDegree,
	translateToSVGStyles: translateToSVGStyles,
	getMarkerPathBase64: getMarkerPathBase64,
	getExternalResources: getExternalResources,
	convertResourceUrl: convertResourceUrl,
	isGradient: isGradient,
	getGradientStamp: getGradientStamp,
	getSymbolStamp: getSymbolStamp,
	lowerSymbolOpacity: lowerSymbolOpacity,
	extendSymbol: extendSymbol
});

var Browser = void 0;

if (!isNode) {
            (function () {

                        var ua = navigator.userAgent.toLowerCase(),
                            doc = document.documentElement,
                            ie = 'ActiveXObject' in window,
                            webkit = ua.indexOf('webkit') !== -1,
                            phantomjs = ua.indexOf('phantom') !== -1,
                            android23 = ua.search('android [23]') !== -1,
                            chrome = ua.indexOf('chrome') !== -1,
                            gecko = ua.indexOf('gecko') !== -1 && !webkit && !window.opera && !ie,
                            mobile = typeof orientation !== 'undefined' || ua.indexOf('mobile') !== -1,
                            msPointer = !window.PointerEvent && window.MSPointerEvent,
                            pointer = window.PointerEvent && navigator.pointerEnabled || msPointer,
                            ie3d = ie && 'transition' in doc.style,
                            webkit3d = 'WebKitCSSMatrix' in window && 'm11' in new window.WebKitCSSMatrix() && !android23,
                            gecko3d = 'MozPerspective' in doc.style,
                            opera12 = 'OTransition' in doc.style,
                            any3d = (ie3d || webkit3d || gecko3d) && !opera12 && !phantomjs;

                        var touch = !phantomjs && (pointer || 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);

                        Browser = {
                                    ie: ie,
                                    ielt9: ie && !document.addEventListener,
                                    edge: 'msLaunchUri' in navigator && !('documentMode' in document),
                                    webkit: webkit,
                                    gecko: gecko,
                                    android: ua.indexOf('android') !== -1,
                                    android23: android23,
                                    chrome: chrome,
                                    safari: !chrome && ua.indexOf('safari') !== -1,
                                    phantomjs: phantomjs,

                                    ie3d: ie3d,
                                    webkit3d: webkit3d,
                                    gecko3d: gecko3d,
                                    opera12: opera12,
                                    any3d: any3d,

                                    mobile: mobile,
                                    mobileWebkit: mobile && webkit,
                                    mobileWebkit3d: mobile && webkit3d,
                                    mobileOpera: mobile && window.opera,
                                    mobileGecko: mobile && gecko,

                                    touch: !!touch,
                                    msPointer: !!msPointer,
                                    pointer: !!pointer,

                                    retina: (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1,

                                    language: navigator.browserLanguage ? navigator.browserLanguage : navigator.language,
                                    ie9: ie && document.documentMode === 9,
                                    ie10: ie && document.documentMode === 10,
                                    canvas: !!document.createElement('canvas').getContext
                        };
            })();
} else {
            // usually in node
            Browser = {
                        canvas: true
            };
}

var Browser$1 = Browser;

var Ajax;
if (isNode) {
    var urlParser = require('url'),
        http = require('http'),
        https = require('https');

    Ajax = {
        get: function get(url, cb) {
            var parsed = urlParser.parse(url);
            this._getClient(parsed.protocol).get(url, this._wrapCallback(cb)).on('error', cb);
            return this;
        },

        post: function post(options, postData, cb) {
            var reqOpts = urlParser.parse(options.url);
            reqOpts.method = 'POST';
            if (!options.headers) {
                options.headers = {};
            }
            if (!options.headers['Content-Type']) {
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            reqOpts.headers = options.headers;

            var req = this._getClient(reqOpts.protocol).request(reqOpts, this._wrapCallback(cb));

            req.on('error', cb);

            if (!isString(postData)) {
                postData = JSON.stringify(postData);
            }

            req.write(postData);
            req.end();
            return this;
        },

        _wrapCallback: function _wrapCallback(cb) {
            return function (res) {
                var data = [],
                    isBuffer = false;
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    if (chunk instanceof Buffer) {
                        isBuffer = true;
                    }
                    data.push(chunk);
                });
                res.on('end', function () {
                    cb(null, isBuffer ? Buffer.concat(data).toString('utf8') : data.join(''));
                });
            };
        },

        _getClient: function _getClient(protocol) {
            if (!this._client) {
                this._client = protocol && protocol === 'https:' ? https : http;
            }
            return this._client;
        }
    };
} else {
    /**
     * @classdesc
     * Ajax Utilities in both Browser and Node. It is static and should not be initiated.
     * @class
     * @static
     * @category core
     */
    Ajax = {
        /**
         * Fetch remote resource by HTTP "GET" method
         * @param  {String}   url - resource url
         * @param  {Function} cb  - callback function when completed
         * @return {Ajax}  Ajax
         * @example
         * maptalks.Ajax.get(
         *     'url/to/resource',
         *     (err, data) => {
         *         if (err) {
         *             throw new Error(err);
         *         }
         *         // do things with data
         *     }
         * );
         */
        get: function get(url, cb) {
            var client = this._getClient(cb);
            client.open('GET', url, true);
            client.send(null);
            return this;
        },

        /**
         * Fetch remote resource by HTTP "POST" method
         * @param  {Object}   options - post options
         * @param  {String}   options.url - url
         * @param  {Object}   options.headers - HTTP headers
         * @param  {String|Object} postData - data post to server
         * @param  {Function} cb  - callback function when completed
         * @return {Ajax}  Ajax
         * @example
         * maptalks.Ajax.post(
         *     {
         *         'url' : 'url/to/post'
         *     },
         *     {
         *         'param0' : 'val0',
         *         'param1' : 1
         *     },
         *     (err, data) => {
         *         if (err) {
         *             throw new Error(err);
         *         }
         *         // do things with data
         *     }
         * );
         */
        post: function post(options, postData, cb) {
            var client = this._getClient(cb);
            client.open('POST', options.url, true);
            if (!options.headers) {
                options.headers = {};
            }
            if (!options.headers['Content-Type']) {
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            if ('setRequestHeader' in client) {
                for (var p in options.headers) {
                    if (options.headers.hasOwnProperty(p)) {
                        client.setRequestHeader(p, options.headers[p]);
                    }
                }
            }
            if (!isString(postData)) {
                postData = JSON.stringify(postData);
            }
            client.send(postData);
            return this;
        },

        _wrapCallback: function _wrapCallback(client, cb) {
            var me = this;
            return function () {
                if (client.withCredentials !== undefined || me._isIE8()) {
                    cb(null, client.responseText);
                } else if (client.readyState === 4) {
                    if (client.status === 200) {
                        cb(null, client.responseText);
                    } else {
                        if (client.status === 0) {
                            return;
                        }
                        cb(null, '{"success":false,"error":\"Status:' + client.status + ',' + client.statusText + '\"}');
                    }
                }
            };
        },

        _isIE8: function _isIE8() {
            return Browser$1.ie && document.documentMode === 8;
        },

        _getClient: function _getClient(cb) {
            /*eslint-disable no-empty, no-undef*/
            var client;
            if (this._isIE8()) {
                try {
                    client = new XDomainRequest();
                } catch (e) {}
            }
            try {
                client = new XMLHttpRequest();
            } catch (e) {}
            try {
                client = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {}
            try {
                client = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}

            if (this._isIE8() || client.withCredentials !== undefined) {
                //Cross Domain request in IE 8
                client.onload = this._wrapCallback(client, cb);
            } else {
                client.onreadystatechange = this._wrapCallback(client, cb);
            }

            return client;
            /*eslint-enable no-empty, no-undef*/
        }
    };
}

/**
 * Fetch resource as a JSON Object.
 * @param {String} url          - json's url
 * @param {Function} callback   - callback function when completed.
 * @example
 * maptalks.Ajax.getJSON(
 *     'url/to/resource.json',
 *     (err, json) => {
 *         if (err) {
 *             throw new Error(err);
 *         }
 *         // json is a JSON Object
 *         console.log(json.foo);
 *     }
 * );
 * @static
 */
Ajax.getJSON = function (url, cb) {
    var callback = function callback(err, resp) {
        var data = resp ? parseJSON(resp) : null;
        cb(err, data);
    };
    return Ajax.get(url, callback);
};

var Ajax$1 = Ajax;

/**
 * This provides methods used for event handling. It's a mixin and not meant to be used directly.
 * @mixin Eventable
 */

var Eventable = function Eventable(Base) {
    return function (_Base) {
        inherits(Eventable, _Base);

        function Eventable() {
            classCallCheck(this, Eventable);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        /**
         * Register a handler function to be called whenever this event is fired.
         *
         * @param {String} eventsOn                  - event types to register, seperated by space if more than one.
         * @param {Function} handler                 - handler function to be called
         * @param {Object} [context=null]            - the context of the handler
         * @return {Any} this
         * @function Eventable.on
         * @example
         * foo.on('mousedown mousemove mouseup', onMouseEvent, foo);
         */
        Eventable.prototype.on = function on$$1(eventsOn, handler, context) {
            if (!eventsOn || !handler) {
                return this;
            }
            if (!isString(eventsOn)) {
                return this._switch('on', eventsOn, handler);
            }
            if (!this._eventMap) {
                this._eventMap = {};
            }
            var eventTypes = eventsOn.toLowerCase().split(' ');
            var evtType;
            if (!context) {
                context = this;
            }
            var handlerChain, i, l;
            for (var ii = 0, ll = eventTypes.length; ii < ll; ii++) {
                evtType = eventTypes[ii];
                handlerChain = this._eventMap[evtType];
                if (!handlerChain) {
                    handlerChain = [];
                    this._eventMap[evtType] = handlerChain;
                }
                l = handlerChain.length;
                if (l > 0) {
                    for (i = 0; i < l; i++) {
                        if (handler === handlerChain[i].handler && handlerChain[i].context === context) {
                            return this;
                        }
                    }
                }
                handlerChain.push({
                    handler: handler,
                    context: context
                });
            }
            return this;
        };

        /**
         * Alias for [on]{@link Eventable.on}
         *
         * @param {String} eventTypes     - event types to register, seperated by space if more than one.
         * @param {Function} handler                 - handler function to be called
         * @param {Object} [context=null]            - the context of the handler
         * @return {} this
         * @function Eventable.addEventListener
         */


        Eventable.prototype.addEventListener = function addEventListener() {
            return this.on.apply(this, arguments);
        };

        /**
         * Same as on, except the listener will only get fired once and then removed.
         *
         * @param {String} eventTypes                - event types to register, seperated by space if more than one.
         * @param {Function} handler                 - listener handler
         * @param {Object} [context=null]            - the context of the handler
         * @return {} this
         * @example
         * foo.once('mousedown mousemove mouseup', onMouseEvent, foo);
         * @function Eventable.once
         */


        Eventable.prototype.once = function once(eventTypes, handler, context) {
            if (!isString(eventTypes)) {
                var once = {};
                for (var p in eventTypes) {
                    if (eventTypes.hasOwnProperty(p)) {
                        once[p] = this._wrapOnceHandler(p, eventTypes[p], context);
                    }
                }
                return this._switch('on', once);
            }
            var evetTypes = eventTypes.split(' ');
            for (var i = 0, l = evetTypes.length; i < l; i++) {
                this.on(evetTypes[i], this._wrapOnceHandler(evetTypes[i], handler, context));
            }
            return this;
        };

        /**
         * Unregister the event handler for the specified event types.
         *
         * @param {String} eventsOff                - event types to unregister, seperated by space if more than one.
         * @param {Function} handler                - listener handler
         * @param {Object} [context=null]           - the context of the handler
         * @return {} this
         * @example
         * foo.off('mousedown mousemove mouseup', onMouseEvent, foo);
         * @function Eventable.off
         */


        Eventable.prototype.off = function off$$1(eventsOff, handler, context) {
            if (!eventsOff || !this._eventMap || !handler) {
                return this;
            }
            if (!isString(eventsOff)) {
                return this._switch('off', eventsOff, handler);
            }
            var eventTypes = eventsOff.split(' ');
            var eventType, handlerChain;
            if (!context) {
                context = this;
            }
            var i;
            for (var j = 0, jl = eventTypes.length; j < jl; j++) {
                eventType = eventTypes[j].toLowerCase();
                handlerChain = this._eventMap[eventType];
                if (!handlerChain) {
                    return this;
                }
                for (i = handlerChain.length - 1; i >= 0; i--) {
                    if (handler === handlerChain[i].handler && handlerChain[i].context === context) {
                        handlerChain.splice(i, 1);
                    }
                }
            }
            return this;
        };

        /**
         * Alias for [off]{@link Eventable.off}
         *
         * @param {String} eventTypes    - event types to unregister, seperated by space if more than one.
         * @param {Function} handler                - listener handler
         * @param {Object} [context=null]           - the context of the handler
         * @return {} this
         * @function Eventable.removeEventListener
         */


        Eventable.prototype.removeEventListener = function removeEventListener() {
            return this.off.apply(this, arguments);
        };

        /**
         * Returns listener's count registered for the event type.
         *
         * @param {String} eventType        - an event type
         * @param {Function} [hanlder=null] - listener function
         * @param {Object} [context=null]   - the context of the handler
         * @return {Number}
         * @function Eventable.listens
         */


        Eventable.prototype.listens = function listens(eventType, handler, context) {
            if (!this._eventMap || !isString(eventType)) {
                return 0;
            }
            var handlerChain = this._eventMap[eventType.toLowerCase()];
            if (!handlerChain || handlerChain.length === 0) {
                return 0;
            }
            var count = 0;
            for (var i = 0, len = handlerChain.length; i < len; i++) {
                if (handler) {
                    if (handler === handlerChain[i].handler && (isNil(context) || handlerChain[i].context === context)) {
                        return 1;
                    }
                } else {
                    count++;
                }
            }
            return count;
        };

        /**
         * Copy all the event listener to the target object
         * @param {Object} target - target object to copy to.
         * @return {} this
         * @function Eventable.copyEventListeners
         */


        Eventable.prototype.copyEventListeners = function copyEventListeners(target) {
            var eventMap = target._eventMap;
            if (!eventMap) {
                return this;
            }
            var handlerChain, i, len;
            for (var eventType in eventMap) {
                handlerChain = eventMap[eventType];
                for (i = 0, len = handlerChain.length; i < len; i++) {
                    this.on(eventType, handlerChain[i].handler, handlerChain[i].context);
                }
            }
            return this;
        };

        /**
         * Fire an event, causing all handlers for that event name to run.
         *
         * @param  {String} eventType - an event type to fire
         * @param  {Object} param     - parameters for the listener function.
         * @return {} this
         * @function Eventable.fire
         */


        Eventable.prototype.fire = function fire() {
            if (this._eventParent) {
                return this._eventParent.fire.apply(this._eventParent, arguments);
            }
            return this._fire.apply(this, arguments);
        };

        Eventable.prototype._wrapOnceHandler = function _wrapOnceHandler(evtType, handler, context) {
            var me = this;
            var called = false;
            return function onceHandler() {
                if (called) {
                    return;
                }
                called = true;
                if (context) {
                    handler.apply(context, arguments);
                } else {
                    handler.apply(this, arguments);
                }
                me.off(evtType, onceHandler, this);
            };
        };

        Eventable.prototype._switch = function _switch(to, eventKeys, context) {
            for (var p in eventKeys) {
                if (eventKeys.hasOwnProperty(p)) {
                    this[to](p, eventKeys[p], context);
                }
            }
            return this;
        };

        Eventable.prototype._clearListeners = function _clearListeners(eventType) {
            if (!this._eventMap || !isString(eventType)) {
                return;
            }
            var handlerChain = this._eventMap[eventType.toLowerCase()];
            if (!handlerChain) {
                return;
            }
            this._eventMap[eventType] = null;
        };

        Eventable.prototype._clearAllListeners = function _clearAllListeners() {
            this._eventMap = null;
        };

        /**
         * Set a event parent to handle all the events
         * @param {Any} parent - event parent
         * @return {Any} this
         * @private
         * @function Eventable._setEventParent
         */


        Eventable.prototype._setEventParent = function _setEventParent(parent) {
            this._eventParent = parent;
            return this;
        };

        Eventable.prototype._fire = function _fire(eventType, param) {
            if (!this._eventMap) {
                return this;
            }
            var handlerChain = this._eventMap[eventType.toLowerCase()];
            if (!handlerChain) {
                return this;
            }
            if (!param) {
                param = {};
            }
            param['type'] = eventType;
            param['target'] = this;
            //in case of deleting a listener in a execution, copy the handlerChain to execute.
            var queue = handlerChain.slice(0),
                context,
                bubble,
                passed;
            for (var i = 0, len = queue.length; i < len; i++) {
                if (!queue[i]) {
                    continue;
                }
                context = queue[i].context;
                bubble = true;
                passed = extend({}, param);
                if (context) {
                    bubble = queue[i].handler.call(context, passed);
                } else {
                    bubble = queue[i].handler(passed);
                }
                //stops the event propagation if the handler returns false.
                if (bubble === false) {
                    if (param['domEvent']) {
                        stopPropagation(param['domEvent']);
                    }
                }
            }
            return this;
        };

        return Eventable;
    }(Base);
};

/**
 * Base class for all the interaction handlers
 * @category handler
 * @abstract
 * @protected
 */

var Handler = function () {
    function Handler(target) {
        classCallCheck(this, Handler);

        this.target = target;
    }

    /**
     * Enables the handler
     * @return {Handler} this
     */


    Handler.prototype.enable = function enable() {
        if (this._enabled) {
            return this;
        }
        this._enabled = true;
        this.addHooks();
        return this;
    };

    /**
     * Disablesthe handler
     * @return {Handler} this
     */


    Handler.prototype.disable = function disable() {
        if (!this._enabled) {
            return this;
        }
        this._enabled = false;
        this.removeHooks();
        return this;
    };

    /**
     * Returns true if the handler is enabled.
     * @return {Boolean}
     */


    Handler.prototype.enabled = function enabled() {
        return !!this._enabled;
    };

    Handler.prototype.remove = function remove() {
        this.disable();
        delete this.target;
        delete this.dom;
    };

    return Handler;
}();

var Handler$1 = Eventable(Handler);

/**
 * This library uses ES2015 class system. <br />
 * Class is the root class of class hierachy. <br />
 * It provides utility methods to make it easier to manage configration options, merge mixins and add init hooks.
 * @example
 * const defaultOptions = {
 *     'foo' : 'bar'
 * };
 * class Foo extends maptalks.Class {
 *     constructor(id, options) {
 *         super(options);
 *         this.setId(id);
 *     }
 *
 *     setId(id) {
 *         this.id = id;
 *     }
 *
 *     whenCreated() {
 *         // .....
 *     }
 * }
 *
 * Foo.mergeOptions(defaultOptions);
 *
 * Foo.addInitHook('whenCreated');
 * @category core
 * @abstract
 */

var Class = function () {

    /**
     * Create an object, set options if given and call all the init hooks.<br />
     * Options is where the object manages its configuration. Options passed to the object will be merged with parent's instead of overriding it.
     *
     * @param  {Object} options - options to set
     */
    function Class(options) {
        classCallCheck(this, Class);

        if (!this || !this.setOptions) {
            throw new Error('Class instance is being created without "new" operator.');
        }
        this.setOptions(options);
        this.callInitHooks();
    }

    /**
     * Visit and call all the init hooks defined on Class and its parents.
     * @return {Class} this
     */


    Class.prototype.callInitHooks = function callInitHooks() {
        var proto = Object.getPrototypeOf(this);
        this._visitInitHooks(proto);
        return this;
    };

    /**
     * Merges options with the default options of the object.
     * @param {Object} options - options to set
     * @return {Class} this
     */


    Class.prototype.setOptions = function setOptions(options) {
        if (!this.hasOwnProperty('options')) {
            this.options = this.options ? Object.create(this.options) : {};
        }
        if (!options) {
            return this;
        }
        for (var i in options) {
            this.options[i] = options[i];
        }
        return this;
    };

    /**
     * 1. Return object's options if no parameter is provided. <br/>
     *
     * 2. update an option and enable/disable the handler if a handler with the same name existed.
     * @example
     * // Get marker's options;
     * var options = marker.config();
     * // Set map's option "draggable" to false and disable map's draggable handler.
     * map.config('draggable', false);
     * // You can update more than one options like this:
     * map.config({
     *     'scrollWheelZoom' : false,
     *     'doubleClickZoom' : false
     * });
     * @param  {Object} conf - config to update
     * @return {Class} this
     */


    Class.prototype.config = function config(conf) {
        if (!conf) {
            var config = {};
            for (var p in this.options) {
                if (this.options.hasOwnProperty(p)) {
                    config[p] = this.options[p];
                }
            }
            return config;
        } else {
            if (arguments.length === 2) {
                var t = {};
                t[conf] = arguments[1];
                conf = t;
            }
            for (var i in conf) {
                this.options[i] = conf[i];
                // enable/disable handler
                if (this[i] && this[i] instanceof Handler$1) {
                    if (conf[i]) {
                        this[i].enable();
                    } else {
                        this[i].disable();
                    }
                }
            }
            // callback when set config
            if (this.onConfig) {
                this.onConfig(conf);
            }
        }
        return this;
    };

    Class.prototype._visitInitHooks = function _visitInitHooks(proto) {
        if (this._initHooksCalled) {
            return;
        }
        var parentProto = Object.getPrototypeOf(proto);
        if (parentProto._visitInitHooks) {
            parentProto._visitInitHooks.call(this, parentProto);
        }
        this._initHooksCalled = true;
        var hooks = proto._initHooks;
        if (hooks && hooks !== parentProto._initHooks) {
            for (var i = 0; i < hooks.length; i++) {
                hooks[i].call(this);
            }
        }
    };

    /**
     * Add an init hook, which will be called when the object is initiated. <br>
     * It is useful in plugin developing to do things when creating objects without changing class's constructor.
     * @param {String|Function} fn - a hook function or name of the hook function
     * @param {Any[]} args         - arguments for the init hook function
     */


    Class.addInitHook = function addInitHook(fn) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var init = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };
        var proto = this.prototype;
        var parentProto = Object.getPrototypeOf(proto);
        if (!proto._initHooks || proto._initHooks === parentProto._initHooks) {
            proto._initHooks = [];
        }
        proto._initHooks.push(init);
        return this;
    };

    /**
     * Mixin the specified objects into the class as prototype properties or methods.
     * @param  {...Object} sources - objects to mixin
     */


    Class.include = function include() {
        for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            sources[_key2] = arguments[_key2];
        }

        for (var i = 0; i < sources.length; i++) {
            extend(this.prototype, sources[i]);
        }
        return this;
    };

    /**
     * Mixin options with the class's default options. <br />
     * @param  {Object} options - options to merge.
     */


    Class.mergeOptions = function mergeOptions(options) {
        var proto = this.prototype;
        var parentProto = Object.getPrototypeOf(proto);
        if (!proto.options || proto.options === parentProto.options) {
            proto.options = proto.options ? Object.create(proto.options) : {};
        }
        extend(proto.options, options);
        return this;
    };

    return Class;
}();

var registeredTypes = {};

/**
 * A helper mixin for JSON serialization.
 * @mixin JSONAble
 */
var JSONAble = (function (Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        /**
         * It is a static method. <br>
         * Register layer for JSON serialization and assign a JSON type.
         * @param  {String} type - JSON type
         * @function JSONAble.registerJSONType
         */
        _class.registerJSONType = function registerJSONType(type) {
            if (!type) {
                return this;
            }
            registeredTypes[type] = this;
            return this;
        };

        /**
         * It is a static method. <br>
         * Get class of input JSON type
         * @param  {String} type - JSON type
         * @return {Class}      Class
         * @function JSONAble.getClass
         */


        _class.getClass = function getClass(type) {
            if (!type) {
                return null;
            }
            return registeredTypes[type];
        };

        /**
         * Get object's JSON Type
         * @return {String}
         * @function JSONAble.getJSONType
         */


        _class.prototype.getJSONType = function getJSONType() {
            if (this._jsonType === undefined) {
                var clazz = Object.getPrototypeOf(this).constructor;
                for (var p in registeredTypes) {
                    if (registeredTypes[p] === clazz) {
                        this._jsonType = p;
                        break;
                    }
                }
            }
            if (!this._jsonType) {
                throw new Error('Found an unregistered geometry class!');
            }
            return this._jsonType;
        };

        return _class;
    }(Base);
});

/**
 * A mixin, to enable a class with [interaction handlers]{@link Handler}
 * @protected
 * @category handler
 * @mixin Handlerable
 */
var Handlerable = function (Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        /**
         * Register a handler
         * @param {String} name       - name of the handler
         * @param {Handler}           - handler class
         * @return {*} this
         * @protected
         * @function Handerable.addHandler
         */
        _class.prototype.addHandler = function addHandler(name, handlerClass) {
            if (!handlerClass) {
                return this;
            }
            if (!this._handlers) {
                this._handlers = [];
            }
            //handler已经存在
            if (this[name]) {
                this[name].enable();
                return this;
            }

            var handler = this[name] = new handlerClass(this);

            this._handlers.push(handler);

            if (this.options[name]) {
                handler.enable();
            }
            return this;
        };

        /**
         * Removes a handler
         * @param {String} name       - name of the handler
         * @return {*} this
         * @protected
         * @function Handerable.removeHandler
         */


        _class.prototype.removeHandler = function removeHandler(name) {
            if (!name) {
                return this;
            }
            var handler = this[name];
            if (handler) {
                //handler registered
                var hit = this._handlers.indexOf(handler);
                if (hit >= 0) {
                    this._handlers.splice(hit, 1);
                }
                this[name].remove();
                delete this[name];
            }
            return this;
        };

        _class.prototype._clearHandlers = function _clearHandlers() {
            for (var i = 0, len = this._handlers.length; i < len; i++) {
                this._handlers[i].remove();
            }
            this._handlers = [];
        };

        return _class;
    }(Base);
};

/**
 * Represent CRS defined by [GeoJSON]{@link http://geojson.org/geojson-spec.html#coordinate-reference-system-objects}
 *
 * @category geo
 */
var CRS = function () {

  /**
   * @param {String} type          - type of the CRS
   * @param {Object} properties    - CRS's properties
   */
  function CRS(type, properties) {
    classCallCheck(this, CRS);

    this.type = type;
    this.properties = properties;
  }

  /**
   * Create a [proj4]{@link https://github.com/OSGeo/proj.4} style CRS used by maptalks <br>
   * @example
   * {
   *     "type"       : "proj4",
   *     "properties" : {
   *         "proj"   : "+proj=longlat +datum=WGS84 +no_defs"
   *     }
   * }
   * var crs_wgs84 = CRS.createProj4("+proj=longlat +datum=WGS84 +no_defs");
   * @param  {String} proj - a proj4 projection string.
   * @return {CRS}
   */


  CRS.createProj4 = function createProj4(proj) {
    return new CRS('proj4', {
      'proj': proj
    });
  };

  return CRS;
}();

// some common CRS definitions

/**
 * Predefined CRS of well-known WGS84 (aka EPSG:4326)
 * @type {CRS}
 * @constant
 */


CRS.WGS84 = CRS.createProj4('+proj=longlat +datum=WGS84 +no_defs');

/**
 * Alias for CRS.WGS84
 * @type {CRS}
 * @constant
 */
CRS.EPSG4326 = CRS.WGS84;

/**
 * Projected Coordinate System used by google maps that has the following alias: 'EPSG:3785', 'GOOGLE', 'EPSG:900913'
 * @type {CRS}
 * @constant
 */
CRS.EPSG3857 = CRS.createProj4('+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');

/**
 * A CRS represents a simple Cartesian coordinate system. <br>
 * Maps x, y directly, is useful for maps of flat surfaces (e.g. indoor maps, game maps).
 * @type {CRS}
 * @constant
 */
CRS.IDENTITY = CRS.createProj4('+proj=identity +no_defs');

/**
 * Official coordinate system in China (aka EPSG:4490), in most cases, it can be considered the same with WGS84.
 * @type {CRS}
 * @see  {@link http://spatialreference.org/ref/sr-org/7408/}
 * @constant
 */
CRS.CGCS2000 = CRS.createProj4('+proj=longlat +datum=CGCS2000');

/**
 * Alias for CRS.CGCS2000
 * @type {CRS}
 * @constant
 */
CRS.EPSG4490 = CRS.CGCS2000;

/**
 * Projection used by [Baidu Map]{@link http://map.baidu.com}, a popular web map service in China.
 * @type {CRS}
 * @constant
 */
CRS.BD09LL = CRS.createProj4('+proj=longlat +datum=BD09');

/**
 * A encrypted CRS usded in the most online map services in China..
 * @type {CRS}
 * @see {@link https://en.wikipedia.org/wiki/Restrictions_on_geographic_data_in_China}
 * @constant
 */
CRS.GCJ02 = CRS.createProj4('+proj=longlat +datum=GCJ02');

/**
 * Transformation between projected coordinates and base 2d point system.
 * A core class used internally for mapping map's (usually geographical) coordinates to 2d points.<br>
 *
 * @category geo
 * @protected
 */

var Transformation = function () {
    /**
     * The base 2d point system is a fixed system that is consistent with HTML coordinate system: on X-Axis, left is smaller and right is larger; on Y-Axis, top is smaller and bottom is larger. <br>
     * As map's coordinates may not be in the same order(e.g. on a mercator projected earth, top is larger and bottom is smaller), <br>
     * transformation provides mapping functions to map arbitrary coordinates system to the fixed 2d point system. <br>
     * How to transform is decided by the constructor parameters which is a 4 number array [a, b, c, d]:<br>
     * a : the order scale of X-axis values 1 means right is larger and -1 means the reverse, left is larger;<br>
     * b : the order scale of Y-axis values 1 means bottom is larger and -1 means the reverse, top is larger;<br>
     * c : x of the origin point of the projected coordinate system <br>
     * d : y of the origin point of the projected coordinate system <br>
     * e.g.: Transformation parameters for Google map: [1, -1, -20037508.34, 20037508.34] <br>
     * @param  {Number[]} matrix transformation array
     */
    function Transformation(matrix) {
        classCallCheck(this, Transformation);

        this.matrix = matrix;
    }

    /**
     * Transform a projected coordinate to a 2d point. <br>
     * Parameter scale in transform/untransform method is used to scale the result 2d points on map's different zoom levels.
     * @param  {Number[]|Coordinate} coordinates - projected coordinate to transform
     * @param  {Number} scale                              - transform scale
     * @return {Point} 2d point.
     */


    Transformation.prototype.transform = function transform(coordinates, scale) {
        return new Point(this.matrix[0] * (coordinates.x - this.matrix[2]) / scale, this.matrix[1] * (coordinates.y - this.matrix[3]) / scale);
    };

    /**
     * Transform a 2d point to a projected coordinate.
     * @param  {Point} point   - 2d point
     * @param  {Number} scale           - transform scale
     * @return {Coordinate}  projected coordinate.
     */


    Transformation.prototype.untransform = function untransform(point, scale) {
        return new Coordinate(point.x * scale / this.matrix[0] + this.matrix[2], point.y * scale / this.matrix[1] + this.matrix[3]);
    };

    return Transformation;
}();

/**
 * Common Methods of Projections.
 * @mixin
 * @protected
 * @memberOf projection
 * @name Common
 */
var Common = /** @lends projection.Common */{
  /**
   * Project a geographical coordinate to a projected coordinate (2d coordinate)
   * @param  {Coordinate} p - coordinate to project
   * @return {Coordinate}
   * @function projection.Common.project
   */
  project: function project() {},

  /**
   * Unproject a projected coordinate to a geographical coordinate (2d coordinate)
   * @param  {Coordinate} p - coordinate to project
   * @return {Coordinate}
   * @function projection.Common.unproject
   */
  unproject: function unproject() {},

  /**
   * Project a group of geographical coordinates to projected coordinates.
   * @param  {Coordinate[]|Coordinate[][]|Coordinate[][][]} coordinates - coordinates to project
   * @return {Coordinate[]|Coordinate[][]|Coordinate[][][]}
   * @function projection.Common.projectCoords
   */
  projectCoords: function projectCoords(coordinates) {
    return mapArrayRecursively(coordinates, this.project, this);
  },


  /**
   * Unproject a group of projected coordinates to geographical coordinates.
   * @param  {Coordinate[]|Coordinate[][]|Coordinate[][][]} projCoords - projected coordinates to unproject
   * @return {Coordinate[]|Coordinate[][]|Coordinate[][][]}
   * @function projection.Common.unprojectCoords
   */
  unprojectCoords: function unprojectCoords(projCoords) {
    return mapArrayRecursively(projCoords, this.unproject, this);
  }
};

/**
 * This provides methods used for event handling. It's a mixin and not meant to be used directly.
 * @mixin Common
 * @memberOf measurer
 * @protected
 */
var Common$1 = {
    /**
     * Measure length between coordinate c1 and coordinate c2
     * @param  {coordinate} c1 coordinate
     * @param  {coordinate} c2 coordinate
     * @return {Number}    length
     * @function measurer.Common.measureLength
     */
    measureLength: function measureLength(c1, c2) {
        if (!Array.isArray(c1)) {
            return this.measureLenBetween(c1, c2);
        }
        var len = 0;
        for (var i = 0, l = c1.length; i < l - 1; i++) {
            len += this.measureLenBetween(c1[i], c1[i + 1]);
        }
        return len;
    }
};

/**
 * Identity measurer, a measurer for Cartesian coordinate system.
 *
 * @class
 * @category geo
 * @protected
 * @memberOf measurer
 * @name Identity
 * @mixes measurer.Common
 */
var Identity = extend( /** @lends measurer.Identity */{
    /**
     * the code of the measurer
     * @static
     * @type {String}
     */
    'measure': 'IDENTITY',
    /**
     * Measure the length between 2 coordinates.
     * @param  {Coordinate} c1
     * @param  {Coordinate} c2
     * @return {Number}
     */
    measureLenBetween: function measureLenBetween(c1, c2) {
        if (!c1 || !c2) {
            return 0;
        }
        try {
            return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
        } catch (err) {
            return 0;
        }
    },
    /**
     * Measure the area closed by the given coordinates.
     * @param  {Coordinate[]} coordinates
     * @return {number}
     */
    measureArea: function measureArea(coordinates) {
        if (!Array.isArray(coordinates)) {
            return 0;
        }
        var area = 0;
        for (var i = 0, len = coordinates.length; i < len; i++) {
            var c1 = coordinates[i];
            var c2 = null;
            if (i === len - 1) {
                c2 = coordinates[0];
            } else {
                c2 = coordinates[i + 1];
            }
            area += c1.x * c2.y - c1.y * c2.x;
        }
        return Math.abs(area / 2);
    },

    /**
     * Locate a coordinate from the given source coordinate with a x-axis distance and a y-axis distance.
     * @param  {Coordinate} c     - source coordinate
     * @param  {Number} xDist     - x-axis distance
     * @param  {Number} yDist     - y-axis distance
     * @return {Coordinate}
     */
    locate: function locate(c, xDist, yDist) {
        if (!c) {
            return null;
        }
        if (!xDist) {
            xDist = 0;
        }
        if (!yDist) {
            yDist = 0;
        }
        if (!xDist && !yDist) {
            return c;
        }
        return new Coordinate(c.x + xDist, c.y + yDist);
    }
}, Common$1);

/**
 * A helper class with common measure methods for Sphere.
 * @memberOf measurer
 * @private
 */

var Sphere = function () {
    /**
     * @param  {Number} radius Sphere's radius
     */
    function Sphere(radius) {
        classCallCheck(this, Sphere);

        this.radius = radius;
    }

    Sphere.prototype.rad = function rad(a) {
        return a * Math.PI / 180;
    };

    Sphere.prototype.measureLenBetween = function measureLenBetween(c1, c2) {
        if (!c1 || !c2) {
            return 0;
        }
        var b = this.rad(c1.y),
            d = this.rad(c2.y),
            e = b - d,
            f = this.rad(c1.x) - this.rad(c2.x);
        b = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(e / 2), 2) + Math.cos(b) * Math.cos(d) * Math.pow(Math.sin(f / 2), 2)));
        b *= this.radius;
        return Math.round(b * 1E5) / 1E5;
    };

    Sphere.prototype.measureArea = function measureArea(coordinates) {
        var a = this.radius * Math.PI / 180,
            b = 0,
            c = coordinates,
            d = c.length;
        if (d < 3) {
            return 0;
        }
        for (var i = 0; i < d - 1; i++) {
            var e = c[i],
                f = c[i + 1];
            b += e.x * a * Math.cos(e.y * Math.PI / 180) * f.y * a - f.x * a * Math.cos(f.y * Math.PI / 180) * e.y * a;
        }
        d = c[i];
        c = c[0];
        b += d.x * a * Math.cos(d.y * Math.PI / 180) * c.y * a - c.x * a * Math.cos(c.y * Math.PI / 180) * d.y * a;
        return 0.5 * Math.abs(b);
    };

    Sphere.prototype.locate = function locate(c, xDist, yDist) {
        if (!c) {
            return null;
        }
        if (!xDist) {
            xDist = 0;
        }
        if (!yDist) {
            yDist = 0;
        }
        if (!xDist && !yDist) {
            return c;
        }
        var dx = Math.abs(xDist);
        var dy = Math.abs(yDist);
        var ry = this.rad(c.y);
        var rx = this.rad(c.x);
        var sy = Math.sin(dy / (2 * this.radius)) * 2;
        ry = ry + sy * (yDist > 0 ? 1 : -1);
        var sx = 2 * Math.sqrt(Math.pow(Math.sin(dx / (2 * this.radius)), 2) / Math.pow(Math.cos(ry), 2));
        rx = rx + sx * (xDist > 0 ? 1 : -1);
        return new Coordinate(rx * 180 / Math.PI, ry * 180 / Math.PI);
    };

    return Sphere;
}();

/**
 * WGS84 Sphere measurer.
 * @class
 * @category geo
 * @protected
 * @memberOf measurer
 * @name WGS84Sphere
 * @mixes measurer.Common
 */


var WGS84Sphere = extend( /** @lends measurer.WGS84Sphere */{
    'measure': 'EPSG:4326',
    sphere: new Sphere(6378137),
    /**
     * Measure the length between 2 coordinates.
     * @param  {Coordinate} c1
     * @param  {Coordinate} c2
     * @return {Number}
     */
    measureLenBetween: function measureLenBetween() {
        return this.sphere.measureLenBetween.apply(this.sphere, arguments);
    },

    /**
     * Measure the area closed by the given coordinates.
     * @param  {Coordinate[]} coordinates
     * @return {number}
     */
    measureArea: function measureArea() {
        return this.sphere.measureArea.apply(this.sphere, arguments);
    },

    /**
     * Locate a coordinate from the given source coordinate with a x-axis distance and a y-axis distance.
     * @param  {Coordinate} c     - source coordinate
     * @param  {Number} xDist              - x-axis distance
     * @param  {Number} yDist              - y-axis distance
     * @return {Coordinate}
     */
    locate: function locate() {
        return this.sphere.locate.apply(this.sphere, arguments);
    }
}, Common$1);

/**
 * Baidu sphere measurer
 * @class
 * @category geo
 * @protected
 * @memberOf measurer
 * @name BaiduSphere
 * @mixes measurer.Common
 */
var BaiduSphere = extend( /** @lends measurer.BaiduSphere */{
    'measure': 'BAIDU',
    sphere: new Sphere(6370996.81),
    /**
     * Measure the length between 2 coordinates.
     * @param  {Coordinate} c1
     * @param  {Coordinate} c2
     * @return {Number}
     */
    measureLenBetween: function measureLenBetween() {
        return this.sphere.measureLenBetween.apply(this.sphere, arguments);
    },

    /**
     * Measure the area closed by the given coordinates.
     * @param  {Coordinate[]} coordinates
     * @return {number}
     */
    measureArea: function measureArea() {
        return this.sphere.measureArea.apply(this.sphere, arguments);
    },

    /**
     * Locate a coordinate from the given source coordinate with a x-axis distance and a y-axis distance.
     * @param  {Coordinate} c     - source coordinate
     * @param  {Number} xDist              - x-axis distance
     * @param  {Number} yDist              - y-axis distance
     * @return {Coordinate}
     */
    locate: function locate() {
        return this.sphere.locate.apply(this.sphere, arguments);
    }
}, Common$1);

/** @namespace measurer */

/**
 * Default measurer, [WGS84Sphere]{@link measurer.WGS84Sphere}
 *
 * @class
 * @category geo
 * @protected
 * @memberOf measurer
 * @name DEFAULT
 * @extends measurer.WGS84Sphere
 */
var DEFAULT$1 = WGS84Sphere;

var measurers = {};

function registerMeasurer(m) {
    measurers[m.measure] = m;
}

registerMeasurer(Identity);
registerMeasurer(WGS84Sphere);
registerMeasurer(BaiduSphere);

/**
 * @classdesc
 * Utilities with measurers. It is static and should not be initiated.<br>
 * Measurer provides methods for geographical computations such as length and area measuring, etc.
 * @class
 * @name Measurer
 * @memberOf measurer
 * @category geo
 */
var Measurer = {
    /**
     * Get a measurer instance.
     * @param  {String} name - code of the measurer: 'EPSG:4326', 'Identity', 'BAIDU'
     * @return {Object} a measurer object
     * @function measurer.Measurer.getInstance
     */
    getInstance: function getInstance(name) {
        if (!name) {
            return DEFAULT$1;
        }
        for (var p in measurers) {
            if (hasOwn(measurers, p)) {
                var mName = measurers[p]['measure'];
                if (!mName) {
                    continue;
                }
                if (name.toLowerCase() === mName.toLowerCase()) {
                    return measurers[p];
                }
            }
        }
        return null;
    },


    /**
     * Whether the measurer is based on earth sphere
     * @param  {Object}  m
     * @return {Boolean}
     * @function measurer.Measurer.isSphere
     */
    isSphere: function isSphere(measure) {
        return !isNil(measure.sphere);
    }
};

var index$3 = Object.freeze({
	Identity: Identity,
	DEFAULT: DEFAULT$1,
	Measurer: Measurer,
	WGS84Sphere: WGS84Sphere,
	BaiduSphere: BaiduSphere
});

/**
 * Well-known projection used by Google maps or Open Street Maps, aka Mercator Projection.<br>
 * It is map's default projection.
 * @class
 * @category geo
 * @protected
 * @memberOf projection
 * @name EPSG3857
 * @mixes projection.Common
 * @mixes measurer.WGS84Sphere
 */
var EPSG3857 = extend({}, Common, /** @lends projection.EPSG3857 */{
    /**
     * "EPSG:3857", Code of the projection, used by [View]{@link View} to get projection instance.
     * @type {String}
     * @constant
     */
    code: 'EPSG:3857',
    rad: Math.PI / 180,
    metersPerDegree: 6378137 * Math.PI / 180,
    maxLatitude: 85.0511287798,

    project: function project(lnglat) {
        var rad = this.rad,
            metersPerDegree = this.metersPerDegree,
            max = this.maxLatitude;
        var lng = lnglat.x,
            lat = Math.max(Math.min(max, lnglat.y), -max);
        var c;
        if (lat === 0) {
            c = 0;
        } else {
            c = Math.log(Math.tan((90 + lat) * rad / 2)) / rad;
        }
        return new Coordinate(lng * metersPerDegree, c * metersPerDegree);
    },

    unproject: function unproject(pLnglat) {
        var x = pLnglat.x,
            y = pLnglat.y;
        var rad = this.rad,
            metersPerDegree = this.metersPerDegree;
        var c;
        if (y === 0) {
            c = 0;
        } else {
            c = y / metersPerDegree;
            c = (2 * Math.atan(Math.exp(c * rad)) - Math.PI / 2) / rad;
        }
        return new Coordinate(x / metersPerDegree, c);
    }
}, WGS84Sphere);

/**
 * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
 *
 * @class
 * @category geo
 * @protected
 * @memberOf projection
 * @name EPSG4326
 * @mixes projection.Common
 * @mixes measurer.WGS84Sphere
 */
var Projection_EPSG4326 = extend({}, Common, /** @lends projection.EPSG4326 */{
    /**
     * "EPSG:4326", Code of the projection, used by [View]{@link View} to get projection instance.
     * @type {String}
     * @constant
     */
    code: 'EPSG:4326',
    project: function project(p) {
        return new Coordinate(p);
    },
    unproject: function unproject(p) {
        return new Coordinate(p);
    }
}, WGS84Sphere);

/**
 * Projection used by [Baidu Map]{@link http://map.baidu.com}
 * @class
 * @category geo
 * @protected
 * @memberOf projection
 * @name BAIDU
 * @mixes projection.Common
 * @mixes measurer.BaiduSphere
 */
var Projection_Baidu = extend({}, Common, /** @lends projection.BAIDU */{
    /**
     * "BAIDU", Code of the projection, used by [View]{@link View} to get projection instance.
     * @type {String}
     * @constant
     */
    code: 'BAIDU',

    project: function project(p) {
        return this.convertLL2MC(p);
    },

    unproject: function unproject(p) {
        return this.convertMC2LL(p);
    }
}, BaiduSphere, {
    EARTHRADIUS: 6370996.81,
    MCBAND: [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
    LLBAND: [75, 60, 45, 30, 15, 0],
    MC2LL: [[1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2], [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86], [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37], [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06], [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4], [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5]],
    LL2MC: [[-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5], [0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5], [0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5], [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5], [-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5], [-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]],

    convertMC2LL: function convertMC2LL(cB) {
        var cC, cE;
        cC = {
            x: Math.abs(cB.x),
            y: Math.abs(cB.y)
        };
        for (var cD = 0, len = this.MCBAND.length; cD < len; cD++) {
            if (cC.y >= this.MCBAND[cD]) {
                cE = this.MC2LL[cD];
                break;
            }
        }
        var T = this.convertor(cB, cE);
        var result = new Coordinate(T.x.toFixed(6), T.y.toFixed(6));
        return result;
    },
    convertLL2MC: function convertLL2MC(T) {
        var cB, cD, cC, len;
        T.x = this.getLoop(T.x, -180, 180);
        T.y = this.getRange(T.y, -74, 74);
        cB = new Coordinate(T.x, T.y);
        for (cC = 0, len = this.LLBAND.length; cC < len; cC++) {
            if (cB.y >= this.LLBAND[cC]) {
                cD = this.LL2MC[cC];
                break;
            }
        }
        if (!cD) {
            for (cC = this.LLBAND.length - 1; cC >= 0; cC--) {
                if (cB.y <= -this.LLBAND[cC]) {
                    cD = this.LL2MC[cC];
                    break;
                }
            }
        }
        var cE = this.convertor(T, cD);
        var result = new Coordinate(cE.x.toFixed(2), cE.y.toFixed(2));
        return result;
    },
    convertor: function convertor(cC, cD) {
        if (!cC || !cD) {
            return null;
        }
        var T = cD[0] + cD[1] * Math.abs(cC.x);
        var cB = Math.abs(cC.y) / cD[9];
        var cE = cD[2] + cD[3] * cB + cD[4] * cB * cB + cD[5] * cB * cB * cB + cD[6] * cB * cB * cB * cB + cD[7] * cB * cB * cB * cB * cB + cD[8] * cB * cB * cB * cB * cB * cB;
        T *= cC.x < 0 ? -1 : 1;
        cE *= cC.y < 0 ? -1 : 1;
        return new Coordinate(T, cE);
    },
    toRadians: function toRadians(T) {
        return Math.PI * T / 180;
    },
    toDegrees: function toDegrees(T) {
        return 180 * T / Math.PI;
    },
    getRange: function getRange(cC, cB, T) {
        if (cB != null) {
            cC = Math.max(cC, cB);
        }
        if (T != null) {
            cC = Math.min(cC, T);
        }
        return cC;
    },
    getLoop: function getLoop(cC, cB, T) {
        while (cC > T) {
            cC -= T - cB;
        }
        while (cC < cB) {
            cC += T - cB;
        }
        return cC;
    }
});

/**
 * A projection based on Cartesian coordinate system.<br>
 * This projection maps x, y directly, it is useful for maps of flat surfaces (e.g. indoor maps, game maps).
 * @class
 * @category geo
 * @protected
 * @memberOf projection
 * @name IDENTITY
 * @mixes projection.Common
 * @mixes measurer.Identity
 */
var Projection_IDENTITY = extend({}, Common, /** @lends projection.IDENTITY */{
    /**
     * "IDENTITY", Code of the projection, used by [View]{@link View} to get projection instance.
     * @type {String}
     * @constant
     */
    code: 'IDENTITY',
    project: function project(p) {
        return p.copy();
    },
    unproject: function unproject(p) {
        return p.copy();
    }
}, Identity);

/** @namespace projection */

/**
 * Default projection, [EPSG3857]{@link projection.EPSG3857}
 *
 * @class
 * @category geo
 * @protected
 * @memberOf projection
 * @name DEFAULT
 * @extends projection.EPSG3857
 */
var DEFAULT = EPSG3857;

var projections = Object.freeze({
	EPSG3857: EPSG3857,
	DEFAULT: DEFAULT,
	EPSG4326: Projection_EPSG4326,
	BAIDU: Projection_Baidu,
	IDENTITY: Projection_IDENTITY
});

/**
 * Common methods for classes can be rendered, e.g. Map, Layers
 * @mixin Renderable
 * @protected
 */
var Renderable = (function (Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        /**
         * Register a renderer class with the given name.
         * @param  {String} name  - renderer's register key
         * @param  {Function} clazz - renderer's class, a function (not necessarily a [Class]{@link Class}).
         * @return {*} this
         * @function Renderable.registerRenderer
         */
        _class.registerRenderer = function registerRenderer(name, clazz) {
            var proto = this.prototype;
            var parentProto = Object.getPrototypeOf(proto);
            if (!proto._rendererClasses || proto._rendererClasses === parentProto._rendererClasses) {
                proto._rendererClasses = proto._rendererClasses ? Object.create(proto._rendererClasses) : {};
            }
            proto._rendererClasses[name.toLowerCase()] = clazz;
            return this;
        };

        /**
         * Get the registered renderer class by the given name
         * @param  {String} name  - renderer's register key
         * @return {Function} renderer's class
         * @function Renderable.getRendererClass
         */


        _class.getRendererClass = function getRendererClass(name) {
            var proto = this.prototype;
            if (!proto._rendererClasses) {
                return null;
            }
            return proto._rendererClasses[name.toLowerCase()];
        };

        return _class;
    }(Base);
});

/**
 * @property {Object}  [options=null] - base options of layer.
 * @property {Number}  [options.minZoom=-1] - the minimum zoom to display the layer, set to -1 to unlimit it.
 * @property {Number}  [options.maxZoom=-1] - the maximum zoom to display the layer, set to -1 to unlimit it.
 * @property {Boolean} [options.visible=true] - whether to display the layer.
 * @property {Number}  [options.opacity=1] - opacity of the layer, from 0 to 1.
 * @property {String}  [options.renderer=canvas] - renderer type, "canvas" in default.
 * @property {Boolean}  [options.drawImmediate=false] - (Only for layer rendered with [CanvasRenderer]{@link renderer.CanvasRenderer}) <br>
 *                                                    In default, for performance reason, layer will be drawn in a frame requested by RAF(RequestAnimationFrame).<br>
 *                                                    Set drawImmediate to true to draw immediately.<br>
 *                                                    This is necessary when layer's drawing is wrapped with another frame requested by RAF.
 * @property {String}   [options.globalCompositeOperation=null] - (Only for layer rendered with [CanvasRenderer]{@link renderer.CanvasRenderer}) globalCompositeOperation of layer's canvas 2d context.
 * @property {Boolean}  [options.debugOutline=false]  - (Only for layer rendered with 2d canvas) An outline with debug information will be drawn with layer.
 * @memberOf Layer
 * @instance
 */
var options$1 = {
    'minZoom': null,
    'maxZoom': null,
    //图层是否可见
    'visible': true,
    'opacity': 1,
    'drawImmediate': false,
    // context.globalCompositeOperation, 'source-in' in default
    'globalCompositeOperation': null,
    'renderer': 'canvas',
    'debugOutline': false
};

/**
 * @classdesc
 * Base class for all the layers, defines common methods that all the layer classes share. <br>
 * It is abstract and not intended to be instantiated.
 *
 * @category layer
 * @abstract
 * @extends Class
 * @mixes Eventable
 * @mixes JSONAble
 * @mixes Renderable
 */

var Layer = function (_JSONAble) {
    inherits(Layer, _JSONAble);

    function Layer(id, options) {
        classCallCheck(this, Layer);

        var _this = possibleConstructorReturn(this, _JSONAble.call(this, options));

        _this.setId(id);
        return _this;
    }

    /**
     * load the tile layer, can't be overrided by sub-classes
     */


    Layer.prototype.load = function load() {
        if (!this.getMap()) {
            return this;
        }
        this._initRenderer();
        var zIndex = this.getZIndex();
        if (this.onAdd()) {
            if (!isNil(zIndex)) {
                this._renderer.setZIndex(zIndex);
            }
            this._renderer.render(true);
        }
        return this;
    };

    /**
     * Get the layer id
     * @returns {String} id
     */


    Layer.prototype.getId = function getId() {
        return this._id;
    };

    /**
     * Set a new id to the layer
     * @param {String} id - new layer id
     * @return {Layer} this
     * @fires Layer#idchange
     */


    Layer.prototype.setId = function setId(id) {
        //TODO 设置id可能造成map无法找到layer
        var old = this._id;
        if (!isNil(id)) {
            id = id + '';
        }
        this._id = id;
        /**
         * idchange event.
         *
         * @event Layer#idchange
         * @type {Object}
         * @property {String} type - idchange
         * @property {Layer} target    - the layer fires the event
         * @property {String} old        - value of the old id
         * @property {String} new        - value of the new id
         */
        this.fire('idchange', {
            'old': old,
            'new': id
        });
        return this;
    };

    /**
     * Adds itself to a map.
     * @param {Map} map - map added to
     * @return {Layer} this
     */


    Layer.prototype.addTo = function addTo(map) {
        map.addLayer(this);
        return this;
    };

    /**
     * Set a z-index to the layer
     * @param {Number} zIndex - layer's z-index
     * @return {Layer} this
     */


    Layer.prototype.setZIndex = function setZIndex(zIndex) {
        this._zIndex = zIndex;
        if (this.map) {
            var layerList = this._getLayerList();
            this.map._sortLayersByZIndex(layerList);
        }
        if (this._renderer) {
            this._renderer.setZIndex(zIndex);
        }
        return this;
    };

    /**
     * Get the layer's z-index
     * @return {Number}
     */


    Layer.prototype.getZIndex = function getZIndex() {
        return this._zIndex;
    };

    /**
     * If the layer is rendered by HTML5 Canvas 2d.
     * @return {Boolean}
     * @protected
     */


    Layer.prototype.isCanvasRender = function isCanvasRender() {
        var renderer = this._getRenderer();
        if (renderer) {
            return renderer.isCanvasRender();
        }
        return false;
    };

    /**
     * Get the map that the layer added to
     * @returns {Map}
     */


    Layer.prototype.getMap = function getMap() {
        if (this.map) {
            return this.map;
        }
        return null;
    };

    /**
     * Brings the layer to the top of all the layers
     * @returns {Layer} this
     */


    Layer.prototype.bringToFront = function bringToFront() {
        var layers = this._getLayerList();
        if (!layers) {
            return this;
        }
        var topLayer = layers[layers.length - 1];
        if (layers.length === 1 || topLayer === this) {
            return this;
        }
        var max = topLayer.getZIndex();
        this.setZIndex(max + 1);
        return this;
    };

    /**
     * Brings the layer under the bottom of all the layers
     * @returns {Layer} this
     */


    Layer.prototype.bringToBack = function bringToBack() {
        var layers = this._getLayerList();
        if (!layers) {
            return this;
        }
        var bottomLayer = layers[0];
        if (layers.length === 1 || bottomLayer === this) {
            return this;
        }
        var min = bottomLayer.getZIndex();
        this.setZIndex(min - 1);
        return this;
    };

    /**
     * Show the layer
     * @returns {Layer} this
     */


    Layer.prototype.show = function show() {
        if (!this.options['visible']) {
            this.options['visible'] = true;
            if (this._getRenderer()) {
                this._getRenderer().show();
            }
        }
        this.fire('show');
        return this;
    };

    /**
     * Hide the layer
     * @returns {Layer} this
     */


    Layer.prototype.hide = function hide() {
        if (this.options['visible']) {
            this.options['visible'] = false;
            if (this._getRenderer()) {
                this._getRenderer().hide();
            }
        }
        this.fire('hide');
        return this;
    };

    Layer.prototype.isLoaded = function isLoaded() {
        if (!this._renderer) {
            return false;
        }
        return this._renderer.isLoaded();
    };

    /**
     * Whether the layer is visible now.
     * @return {Boolean}
     */


    Layer.prototype.isVisible = function isVisible() {
        if (isNumber(this.options['opacity']) && this.options['opacity'] <= 0) {
            return false;
        }
        var map = this.getMap();
        if (map) {
            var zoom = map.getZoom();
            if (!isNil(this.options['maxZoom']) && this.options['maxZoom'] < zoom || !isNil(this.options['minZoom']) && this.options['minZoom'] > zoom) {
                return false;
            }
        }

        if (isNil(this.options['visible'])) {
            this.options['visible'] = true;
        }
        return this.options['visible'];
    };

    /**
     * Remove itself from the map added to.
     * @returns {Layer} this
     */


    Layer.prototype.remove = function remove() {
        if (this.map) {
            this.map.removeLayer(this);
        }
        return this;
    };

    /**
     * Get the mask geometry of the layer
     * @return {Geometry}
     */


    Layer.prototype.getMask = function getMask() {
        return this._mask;
    };

    /**
     * Set a mask geometry on the layer, only the area in the mask will be displayed.
     * @param {Geometry} mask - mask geometry, can only be a Marker with vector symbol, a Polygon or a MultiPolygon
     * @returns {Layer} this
     */


    Layer.prototype.setMask = function setMask(mask) {
        if (!(mask.type === 'Point' && mask._isVectorMarker() || mask.type === 'Polygon')) {
            throw new Error('Mask for a layer must be either a marker with vector marker symbol, a Polygon or a MultiPolygon.');
        }

        if (mask.type === 'Point') {
            mask.updateSymbol({
                'markerLineColor': 'rgba(0, 0, 0, 0)',
                'markerFillOpacity': 0
            });
        } else {
            mask.setSymbol({
                'lineColor': 'rgba(0, 0, 0, 0)',
                'polygonOpacity': 0
            });
        }
        mask._bindLayer(this);
        this._mask = mask;
        if (!this.getMap() || this.getMap().isZooming()) {
            return this;
        }
        if (this._getRenderer()) {
            this._getRenderer().render();
        }
        return this;
    };

    /**
     * Remove the mask
     * @returns {Layer} this
     */


    Layer.prototype.removeMask = function removeMask() {
        delete this._mask;
        if (!this.getMap() || this.getMap().isZooming()) {
            return this;
        }
        if (this._getRenderer()) {
            this._getRenderer().render();
        }
        return this;
    };

    /**
     * Prepare Layer's loading, this is a method intended to be overrided by subclasses.
     * @return {Boolean} true to continue loading, false to cease.
     * @protected
     */


    Layer.prototype.onAdd = function onAdd() {
        return true;
    };

    Layer.prototype._refreshMask = function _refreshMask() {
        if (this._mask) {
            this._mask._removeZoomCache();
        }
    };

    Layer.prototype._bindMap = function _bindMap(map, zIndex) {
        if (!map) {
            return;
        }
        this.map = map;
        this.setZIndex(zIndex);
        this._registerEvents();
        this._switchEvents('on', this);

        this.fire('add');
    };

    Layer.prototype._initRenderer = function _initRenderer() {
        var renderer = this.options['renderer'];
        if (!this.constructor.getRendererClass) {
            return;
        }
        var clazz = this.constructor.getRendererClass(renderer);
        if (!clazz) {
            throw new Error('Invalid renderer for Layer(' + this.getId() + '):' + renderer);
        }
        this._renderer = new clazz(this);
        this._renderer.layer = this;
        this._renderer.setZIndex(this.getZIndex());
        this._switchEvents('on', this._renderer);
    };

    Layer.prototype._doRemove = function _doRemove() {
        if (this.onRemove) {
            this.onRemove();
        }
        this._switchEvents('off', this);
        this._removeEvents();
        if (this._renderer) {
            this._switchEvents('off', this._renderer);
            this._renderer.remove();
            delete this._renderer;
        }
        delete this._mask;
        delete this.map;
    };

    Layer.prototype._switchEvents = function _switchEvents(to, emitter) {
        if (emitter && emitter.getEvents) {
            this.getMap()[to](emitter.getEvents(), emitter);
        }
    };

    Layer.prototype._registerEvents = function _registerEvents() {
        this.getMap().on('_zoomend', this._refreshMask, this);
    };

    Layer.prototype._removeEvents = function _removeEvents() {
        this.getMap().off('_zoomend', this._refreshMask, this);
    };

    Layer.prototype._getRenderer = function _getRenderer() {
        return this._renderer;
    };

    Layer.prototype._getLayerList = function _getLayerList() {
        if (!this.map) {
            return null;
        }
        return this.map._layers;
    };

    return Layer;
}(JSONAble(Eventable(Renderable(Class))));

Layer.mergeOptions(options$1);

/**
 * @classdesc
 * A class internally used by tile layer helps to descibe tile system used by different tile services.<br>
 *
 * @class
 * @category layer
 * @example
 * var ts = new TileSystem([1, -1, -20037508.34, 20037508.34]);
 */

var TileSystem = function () {

    /**
     * Similar with [transformation]{@link Transformation}, it contains 4 numbers: sx, sy, ox, oy.<br>
     * @see {@link http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification}
     * @param  {Number} sx the order of X-axis tile index, 1 means right is larger and -1 means the reverse, left is larger;
     * @param  {Number} sy the order of Y-axis tile index, 1 means top is larger and -1 means the reverse, bottom is larger;
     * @param  {Number} ox x of the origin point of the world's projected coordinate system
     * @param  {Number} oy y of the origin point of the world's projected coordinate system
     */
    function TileSystem(sx, sy, ox, oy) {
        classCallCheck(this, TileSystem);

        if (Array.isArray(sx)) {
            this.scale = {
                x: sx[0],
                y: sx[1]
            };
            this.origin = {
                x: sx[2],
                y: sx[3]
            };
        } else {
            this.scale = {
                x: sx,
                y: sy
            };
            this.origin = {
                x: ox,
                y: oy
            };
        }
    }

    /**
     * Get the default tile system's code for the projection.
     * @param  {Object} projection      - a projection object
     * @return {String} tile system code
     */


    TileSystem.getDefault = function getDefault(projection) {
        if (projection['code'].toLowerCase() === 'baidu') {
            return 'baidu';
        } else if (projection['code'].toLowerCase() === 'EPSG:4326'.toLowerCase()) {
            return 'tms-global-geodetic';
        } else if (projection['code'].toLowerCase() === 'identity') {
            return [1, -1, 0, 0];
        } else {
            return 'web-mercator';
        }
    };

    return TileSystem;
}();

extend(TileSystem, /** @lends TileSystem */{
    /**
     * The most common used tile system, used by google maps, bing maps and amap, soso maps in China.
     * @see {@link https://en.wikipedia.org/wiki/Web_Mercator}
     * @constant
     * @static
     */
    'web-mercator': new TileSystem([1, -1, -20037508.34, 20037508.34]),

    /**
     * Predefined tile system for TMS tile system, A tile system published by [OSGEO]{@link http://www.osgeo.org/}. <br>
     * Also used by mapbox's [mbtiles]{@link https://github.com/mapbox/mbtiles-spec} specification.
     * @see {@link http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification}
     * @constant
     * @static
     */
    'tms-global-mercator': new TileSystem([1, 1, -20037508.34, -20037508.34]),

    /**
     * Another tile system published by [OSGEO]{@link http://www.osgeo.org/}, based on EPSG:4326 SRS.
     * @see {@link http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic}
     * @constant
     * @static
     */
    'tms-global-geodetic': new TileSystem([1, 1, -180, -90]),

    /**
     * Tile system used by [baidu]{@link http://map.baidu.com}
     * @constant
     * @static
     */
    'baidu': new TileSystem([1, 1, 0, 0])
});

/**
 * Tile config for tile layers, an utilities class for tile layers to render tiles
 * @class
 * @category layer
 * @private
 */

var TileConfig = function () {

    /**
     * @param {TileSystem} tileSystem  - tileSystem
     * @param {Extent} fullExtent      - fullExtent of the tile layer
     * @param {Size} tileSize          - tile size
     */
    function TileConfig(tileSystem, fullExtent, tileSize) {
        classCallCheck(this, TileConfig);

        this.tileSize = tileSize;
        this.fullExtent = fullExtent;
        this.prepareTileInfo(tileSystem, fullExtent);
    }

    TileConfig.prototype.prepareTileInfo = function prepareTileInfo(tileSystem, fullExtent) {
        if (isString(tileSystem)) {
            tileSystem = TileSystem[tileSystem.toLowerCase()];
        } else if (Array.isArray(tileSystem)) {
            tileSystem = new TileSystem(tileSystem);
        }

        if (!tileSystem) {
            throw new Error('Invalid TileSystem');
        }
        this.tileSystem = tileSystem;

        //自动计算transformation
        var a = fullExtent['right'] > fullExtent['left'] ? 1 : -1,
            b = fullExtent['top'] > fullExtent['bottom'] ? -1 : 1,
            c = tileSystem['origin']['x'],
            d = tileSystem['origin']['y'];
        this.transformation = new Transformation([a, b, c, d]);
        //计算transform后的以像素为单位的原点
        tileSystem['transOrigin'] = this.transformation.transform(tileSystem['origin'], 1);
    };

    TileConfig.prototype.getTileIndex = function getTileIndex(point, res) {
        var tileSystem = this.tileSystem,
            tileSize = this['tileSize'],
            transOrigin = tileSystem['transOrigin'],
            delta = 1E-7;

        var tileX = Math.floor(delta + (point.x - transOrigin.x) / (tileSize['width'] * res));
        var tileY = -Math.floor(delta + (point.y - transOrigin.y) / (tileSize['height'] * res));

        return {
            'x': tileSystem['scale']['x'] * tileX,
            'y': tileSystem['scale']['y'] * tileY
        };
    };

    /**
     * 根据中心点投影坐标, 计算中心点对应的瓦片和瓦片内偏移量
     * @param  {*} pLonlat   [description]
     * @param  {*} res [description]
     * @return {*}           [description]
     */


    TileConfig.prototype.getCenterTile = function getCenterTile(pLonlat, res) {
        var tileSystem = this.tileSystem,
            tileSize = this['tileSize'];
        var point = this.transformation.transform(pLonlat, 1);
        var tileIndex = this.getTileIndex(point, res);

        var tileLeft = tileIndex['x'] * tileSize['width'];
        var tileTop = tileIndex['y'] * tileSize['height'];

        var offsetLeft = point.x / res - tileSystem['scale']['x'] * tileLeft;
        var offsetTop = point.y / res + tileSystem['scale']['y'] * tileTop;

        //如果x方向为左大右小
        if (tileSystem['scale']['x'] < 0) {
            tileIndex['x'] -= 1;
        }
        //如果y方向上大下小
        if (tileSystem['scale']['y'] > 0) {
            tileIndex['y'] -= 1;
        }

        //有可能tileIndex超出世界范围
        tileIndex = this.getNeighorTileIndex(tileIndex['y'], tileIndex['x'], 0, 0, true);

        return {
            'x': tileIndex['x'],
            'y': tileIndex['y'],
            'offsetLeft': offsetLeft,
            'offsetTop': offsetTop
        };
    };

    /**
     * 根据给定的瓦片编号,和坐标编号偏移量,计算指定的瓦片编号
     * @param  {*} tileY   [description]
     * @param  {*} tileX   [description]
     * @param  {*} offsetY [description]
     * @param  {*} offsetX [description]
     * @param  {*} zoomLevel [description]
     * @return {*}         [description]
     */


    TileConfig.prototype.getNeighorTileIndex = function getNeighorTileIndex(tileY, tileX, offsetY, offsetX, res, isRepeatWorld) {
        var tileSystem = this.tileSystem;
        var x = tileX + tileSystem['scale']['x'] * offsetX;
        var y = tileY - tileSystem['scale']['y'] * offsetY;
        //连续世界瓦片计算
        if (isRepeatWorld) {
            var ext = this._getTileFullIndex(res);
            if (x < ext['xmin']) {
                x = ext['xmax'] - (ext['xmin'] - x) % (ext['xmax'] - ext['xmin']);
                if (x === ext['xmax']) {
                    x = ext['xmin'];
                }
            } else if (x >= ext['xmax']) {
                x = ext['xmin'] + (x - ext['xmin']) % (ext['xmax'] - ext['xmin']);
            }

            if (y >= ext['ymax']) {
                y = ext['ymin'] + (y - ext['ymin']) % (ext['ymax'] - ext['ymin']);
            } else if (y < ext['ymin']) {
                y = ext['ymax'] - (ext['ymin'] - y) % (ext['ymax'] - ext['ymin']);
                if (y === ext['ymax']) {
                    y = ext['ymin'];
                }
            }
        }
        return {
            'x': x,
            'y': y
        };
    };

    TileConfig.prototype._getTileFullIndex = function _getTileFullIndex(res) {
        var ext = this.fullExtent;
        var transformation = this.transformation;
        var nwIndex = this.getTileIndex(transformation.transform(new Coordinate(ext['left'], ext['top']), 1), res);
        var seIndex = this.getTileIndex(transformation.transform(new Coordinate(ext['right'], ext['bottom']), 1), res);
        return new Extent(nwIndex, seIndex);
    };

    /**
     * 计算瓦片左下角的大地投影坐标
     * @param  {*} tileY     [description]
     * @param  {*} tileX     [description]
     * @param  {*} res       [description]
     * @return {*}           [description]
     */


    TileConfig.prototype.getTileProjectedSw = function getTileProjectedSw(tileY, tileX, res) {
        var tileSystem = this.tileSystem;
        var tileSize = this['tileSize'];
        var y = tileSystem['origin']['y'] + tileSystem['scale']['y'] * (tileY + (tileSystem['scale']['y'] === 1 ? 0 : 1)) * (res * tileSize['height']);
        var x = tileSystem['scale']['x'] * (tileX + (tileSystem['scale']['x'] === 1 ? 0 : 1)) * res * tileSize['width'] + tileSystem['origin']['x'];
        return [x, y];
    };

    return TileConfig;
}();

/**
 * @property {Object}              options                     - TileLayer's options
 * @property {String}              [options.errorTileUrl=null] - tile's url when error
 * @property {String}              options.urlTemplate         - url templates
 * @property {String[]|Number[]}   [options.subdomains=null]   - subdomains to replace '{s}' in urlTemplate
 * @property {Boolean}             [options.repeatWorld=true]  - tiles will be loaded repeatedly outside the world.
 * @property {String}              [options.crossOrigin=null]  - tile Image's corssOrigin
 * @property {Object}              [options.tileSize={'width':256, 'height':256}] - size of the tile image
 * @property {Number[]}            [options.tileSystem=null]   - tile system number arrays
 * @property {Boolean}             [options.debug=false]       - if set to true, tiles will have borders and a title of its coordinates.
 * @memberOf TileLayer
 * @instance
 */
var options$2 = {
    'errorTileUrl': null,
    'urlTemplate': null,
    'subdomains': null,

    'repeatWorld': true,

    'renderWhenPanning': false,
    //移图时地图的更新间隔, 默认为0即实时更新, -1表示不更新.如果效率较慢则可改为适当的值
    'updateInterval': function () {
        return Browser$1.mobile ? -1 : 200;
    }(),

    'cssFilter': null,

    'crossOrigin': null,

    'tileSize': {
        'width': 256,
        'height': 256
    },

    'tileSystem': null,
    'debug': false,

    'cacheTiles': true,

    'keepBuffer': null,

    'container': 'back',

    'baseLayerRenderer': function () {
        return isNode ? 'canvas' : 'dom';
    }()
};

/**
 * @classdesc
 * A layer used to display tiled map services, such as [google maps]{@link http://maps.google.com}, [open street maps]{@link http://www.osm.org}
 * @category layer
 * @extends Layer
 * @param {String|Number} id - tile layer's id
 * @param {Object} [options=null] - options defined in [TileLayer]{@link TileLayer#options}
 * @example
 * new TileLayer("tile",{
        urlTemplate : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        subdomains:['a','b','c']
    })
 */

var TileLayer = function (_Layer) {
    inherits(TileLayer, _Layer);

    function TileLayer() {
        classCallCheck(this, TileLayer);
        return possibleConstructorReturn(this, _Layer.apply(this, arguments));
    }

    /**
     * Reproduce a TileLayer from layer's profile JSON.
     * @param  {Object} layerJSON - layer's profile JSON
     * @return {TileLayer}
     * @static
     * @private
     * @function
     */
    TileLayer.fromJSON = function fromJSON(layerJSON) {
        if (!layerJSON || layerJSON['type'] !== 'TileLayer') {
            return null;
        }
        return new TileLayer(layerJSON['id'], layerJSON['options']);
    };

    /**
     * Get tile size of the tile layer
     * @return {Size}
     */


    TileLayer.prototype.getTileSize = function getTileSize() {
        var size = this.options['tileSize'];
        return new Size(size['width'], size['height']);
    };

    /**
     * Get tile descriptors
     * @return {Object[]} tile descriptors
     */


    TileLayer.prototype.getTiles = function getTiles() {
        return this._getTiles();
    };

    /**
     * Clear the layer
     * @return {TileLayer} this
     */


    TileLayer.prototype.clear = function clear() {
        if (this._renderer) {
            this._renderer.clear();
        }
        /**
         * clear event, fired when tile layer is cleared.
         *
         * @event TileLayer#clear
         * @type {Object}
         * @property {String} type - clear
         * @property {TileLayer} target - tile layer
         */
        this.fire('clear');
        return this;
    };

    /**
     * Export the tile layer's profile json. <br>
     * Layer's profile is a snapshot of the layer in JSON format. <br>
     * It can be used to reproduce the instance by [fromJSON]{@link Layer#fromJSON} method
     * @return {Object} layer's profile JSON
     */


    TileLayer.prototype.toJSON = function toJSON() {
        var profile = {
            'type': this.getJSONType(),
            'id': this.getId(),
            'options': this.config()
        };
        return profile;
    };

    TileLayer.prototype._initRenderer = function _initRenderer() {
        var renderer = this.options['renderer'];
        if (this.getMap().getBaseLayer() === this) {
            renderer = this.options['baseLayerRenderer'];
            if (this.getMap()._getRenderer()._isCanvasContainer) {
                renderer = 'canvas';
            }
        }
        if (!this.constructor.getRendererClass) {
            return;
        }
        var clazz = this.constructor.getRendererClass(renderer);
        if (!clazz) {
            return;
        }
        this._renderer = new clazz(this);
        this._renderer.setZIndex(this.getZIndex());
        this._switchEvents('on', this._renderer);
    };

    /**
     * initialize [tileConfig]{@link TileConfig} for the tilelayer
     * @private
     */


    TileLayer.prototype._initTileConfig = function _initTileConfig() {
        var map = this.getMap();
        this._defaultTileConfig = new TileConfig(TileSystem.getDefault(map.getProjection()), map.getFullExtent(), this.getTileSize());
        if (this.options['tileSystem']) {
            this._tileConfig = new TileConfig(this.options['tileSystem'], map.getFullExtent(), this.getTileSize());
        }
        //inherit baselayer's tileconfig
        if (map && map.getBaseLayer() && map.getBaseLayer() !== this && map.getBaseLayer()._getTileConfig) {
            var base = map.getBaseLayer()._getTileConfig();
            this._tileConfig = new TileConfig(base.tileSystem, base.fullExtent, this.getTileSize());
        }
    };

    TileLayer.prototype._getTileConfig = function _getTileConfig() {
        if (!this._defaultTileConfig) {
            this._initTileConfig();
        }
        return this._tileConfig || this._defaultTileConfig;
    };

    TileLayer.prototype._getTiles = function _getTiles() {
        // rendWhenReady = false;
        var map = this.getMap();
        if (!map) {
            return null;
        }
        if (!this.isVisible()) {
            return null;
        }

        var tileConfig = this._getTileConfig();
        if (!tileConfig) {
            return null;
        }

        var tileSize = this.getTileSize(),
            zoom = map.getZoom(),
            res = map._getResolution();

        var containerCenter = new Point(map.width / 2, map.height / 2),
            containerExtent = map.getContainerExtent();
        if (containerExtent.getWidth() === 0 || containerExtent.getHeight() === 0) {
            return {
                'tiles': []
            };
        }

        //中心瓦片信息,包括瓦片编号,和中心点在瓦片上相对左上角的位置
        var centerTile = tileConfig.getCenterTile(map._getPrjCenter(), res);

        var center2D = map._prjToPoint(map._getPrjCenter())._substract(centerTile['offsetLeft'], centerTile['offsetTop']);

        var keepBuffer = this.getMask() ? 0 : this.options['keepBuffer'] === null ? map.getBaseLayer() === this ? 1 : 0 : this.options['keepBuffer'];
        //中心瓦片上下左右的瓦片数
        var top = Math.ceil(Math.abs(containerCenter.y - containerExtent['ymin'] - centerTile['offsetTop']) / tileSize['height']) + keepBuffer,
            left = Math.ceil(Math.abs(containerCenter.x - containerExtent['xmin'] - centerTile['offsetLeft']) / tileSize['width']) + keepBuffer,
            bottom = Math.ceil(Math.abs(containerExtent['ymax'] - containerCenter.y + centerTile['offsetTop']) / tileSize['height']) + keepBuffer,
            right = Math.ceil(Math.abs(containerExtent['xmax'] - containerCenter.x + centerTile['offsetLeft']) / tileSize['width']) + keepBuffer;

        var tiles = [];

        for (var i = -left; i < right; i++) {
            for (var j = -top; j < bottom; j++) {
                var tileIndex = tileConfig.getNeighorTileIndex(centerTile['y'], centerTile['x'], j, i, res, this.options['repeatWorld']),
                    tileUrl = this._getTileUrl(tileIndex['x'], tileIndex['y'], zoom),
                    tileId = [tileIndex['y'], tileIndex['x'], zoom].join('__'),
                    tileDesc = {
                    'url': tileUrl,
                    'point': new Point(center2D.x + tileSize['width'] * i, center2D.y + tileSize['height'] * j),
                    'id': tileId,
                    'z': zoom,
                    'x': tileIndex['x'],
                    'y': tileIndex['y']
                };
                tiles.push(tileDesc);
            }
        }

        //sort tiles according to tile's distance to center
        tiles.sort(function (a, b) {
            return b['point'].distanceTo(center2D) - a['point'].distanceTo(center2D);
        });
        return {
            'tiles': tiles
        };
    };

    TileLayer.prototype._getTileUrl = function _getTileUrl(x, y, z) {
        if (!this.options['urlTemplate']) {
            return this.options['errorTileUrl'];
        }
        var urlTemplate = this.options['urlTemplate'];
        var domain = '';
        if (this.options['subdomains']) {
            var subdomains = this.options['subdomains'];
            if (isArrayHasData(subdomains)) {
                var length = subdomains.length;
                var s = (x + y) % length;
                if (s < 0) {
                    s = 0;
                }
                domain = subdomains[s];
            }
        }
        if (isFunction(urlTemplate)) {
            return urlTemplate(x, y, z, domain);
        }
        var data = {
            'x': x,
            'y': y,
            'z': z,
            's': domain
        };
        return urlTemplate.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            var value = data[key];

            if (value === undefined) {
                throw new Error('No value provided for variable ' + str);
            } else if (typeof value === 'function') {
                value = value(data);
            }
            return value;
        });
    };

    return TileLayer;
}(Layer);

TileLayer.registerJSONType('TileLayer');

TileLayer.mergeOptions(options$2);

function parse(arcConf) {
    var tileInfo = arcConf['tileInfo'],
        tileSize = {
        'width': tileInfo['cols'],
        'height': tileInfo['rows']
    },
        resolutions = [],
        lods = tileInfo['lods'];
    for (var i = 0, len = lods.length; i < len; i++) {
        resolutions.push(lods[i]['resolution']);
    }
    var fullExtent = arcConf['fullExtent'],
        origin = tileInfo['origin'],
        tileSystem = [1, -1, origin['x'], origin['y']];
    delete fullExtent['spatialReference'];
    return {
        'view': {
            'resolutions': resolutions,
            'fullExtent': fullExtent
        },
        'tileSystem': tileSystem,
        'tileSize': tileSize
    };
}

function loadArcgis(url, cb, context) {
    if (isString(url) && url.substring(0, 1) !== '{') {
        Ajax$1.getJSON(url, function (err, json) {
            if (err) {
                if (context) {
                    cb.call(context, err);
                } else {
                    cb(err);
                }
                return;
            }
            var view = parse(json);
            if (context) {
                cb.call(context, null, view);
            } else {
                cb(null, view);
            }
        });
    } else {
        if (isString(url)) {
            url = parseJSON(url);
        }
        var view = parse(url);
        if (context) {
            cb.call(context, null, view);
        } else {
            cb(null, view);
        }
    }
    return this;
}

var DefaultView = {
    'EPSG:3857': {
        'resolutions': function () {
            var resolutions = [];
            var d = 2 * 6378137 * Math.PI;
            for (var i = 0; i < 21; i++) {
                resolutions[i] = d / (256 * Math.pow(2, i));
            }
            return resolutions;
        }(),
        'fullExtent': {
            'top': 6378137 * Math.PI,
            'left': -6378137 * Math.PI,
            'bottom': -6378137 * Math.PI,
            'right': 6378137 * Math.PI
        }
    },
    'EPSG:4326': {
        'fullExtent': {
            'top': 90,
            'left': -180,
            'bottom': -90,
            'right': 180
        },
        'resolutions': function () {
            var resolutions = [];
            for (var i = 0; i < 21; i++) {
                resolutions[i] = 180 / (Math.pow(2, i) * 128);
            }
            return resolutions;
        }()
    },
    'BAIDU': {
        'resolutions': function () {
            var res = Math.pow(2, 18);
            var resolutions = [];
            for (var i = 0; i < 20; i++) {
                resolutions[i] = res;
                res *= 0.5;
            }
            resolutions[0] = null;
            resolutions[1] = null;
            resolutions[2] = null;
            return resolutions;
        }(),
        'fullExtent': {
            'top': 33554432,
            'left': -33554432,
            'bottom': -33554432,
            'right': 33554432
        }
    }
};

var View = function () {
    function View() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, View);

        this.options = options;
        this._initView();
    }

    View.prototype._initView = function _initView() {
        var projection = this.options['projection'];
        if (projection) {
            if (isString(projection)) {
                for (var p in projections) {
                    if (hasOwn(projections, p)) {
                        var regName = projections[p]['code'];
                        if (regName && regName.toLowerCase() === projection.toLowerCase()) {
                            projection = projections[p];
                            break;
                        }
                    }
                }
            }
        } else {
            projection = DEFAULT;
        }
        if (!projection || isString(projection)) {
            throw new Error('must provide a valid projection in map\'s view.');
        }
        projection = extend({}, projection);
        if (!projection.measureLength) {
            extend(projection, Measurer.DEFAULT);
        }
        this._projection = projection;
        var defaultView,
            resolutions = this.options['resolutions'];
        if (!resolutions) {
            if (projection['code']) {
                defaultView = DefaultView[projection['code']];
                if (defaultView) {
                    resolutions = defaultView['resolutions'];
                }
            }
            if (!resolutions) {
                throw new Error('must provide valid resolutions in map\'s view.');
            }
        }
        this._resolutions = resolutions;
        var fullExtent = this.options['fullExtent'];
        if (!fullExtent) {
            if (projection['code']) {
                defaultView = DefaultView[projection['code']];
                if (defaultView) {
                    fullExtent = defaultView['fullExtent'];
                }
            }
            if (!fullExtent) {
                throw new Error('must provide a valid fullExtent in map\'s view.');
            }
        }
        if (!isNil(fullExtent['left'])) {
            this._fullExtent = new Extent(new Coordinate(fullExtent['left'], fullExtent['top']), new Coordinate(fullExtent['right'], fullExtent['bottom']));
        } else {
            //xmin, ymin, xmax, ymax
            this._fullExtent = new Extent(fullExtent);
            fullExtent['left'] = fullExtent['xmin'];
            fullExtent['right'] = fullExtent['xmax'];
            fullExtent['top'] = fullExtent['ymax'];
            fullExtent['bottom'] = fullExtent['ymin'];
        }

        //set left, right, top, bottom value
        extend(this._fullExtent, fullExtent);

        var a = fullExtent['right'] >= fullExtent['left'] ? 1 : -1,
            b = fullExtent['top'] >= fullExtent['bottom'] ? -1 : 1;
        this._transformation = new Transformation([a, b, 0, 0]);
    };

    View.prototype.getResolutions = function getResolutions() {
        return this._resolutions;
    };

    View.prototype.getResolution = function getResolution(zoom) {
        var z = zoom | 0;
        if (z < 0) {
            z = 0;
        } else if (z > this._resolutions.length - 1) {
            z = this._resolutions.length - 1;
        }
        var res = this._resolutions[z];
        if (!isInteger(zoom) && z !== this._resolutions.length - 1) {
            var next = this._resolutions[z + 1];
            return res + (next - res) * (zoom - z);
        }
        return res;
    };

    View.prototype.getProjection = function getProjection() {
        return this._projection;
    };

    View.prototype.getFullExtent = function getFullExtent() {
        return this._fullExtent;
    };

    View.prototype.getTransformation = function getTransformation() {
        return this._transformation;
    };

    View.prototype.getMinZoom = function getMinZoom() {
        for (var i = 0; i < this._resolutions.length; i++) {
            if (!isNil(this._resolutions[i])) {
                return i;
            }
        }
        return 0;
    };

    View.prototype.getMaxZoom = function getMaxZoom() {
        for (var i = this._resolutions.length - 1; i >= 0; i--) {
            if (!isNil(this._resolutions[i])) {
                return i;
            }
        }
        return this._resolutions.length - 1;
    };

    return View;
}();

View.loadArcgis = loadArcgis;

/**
 * @property {Object} options                                   - map's options, options must be updated by config method:<br> map.config('zoomAnimation', false);
 * @property {Boolean} [options.centerCross=false]              - Display a red cross in the center of map
 * @property {Boolean} [options.clipFullExtent=false]           - clip geometries outside map's full extent
 * @property {Boolean} [options.zoomAnimation=true]             - enable zooming animation
 * @property {Number}  [options.zoomAnimationDuration=330]      - zoom animation duration.
 * @property {Boolean} [options.zoomBackground=true]            - leaves a background after zooming.
 * @property {Boolean} [options.layerZoomAnimation=true]        - also animate layers when zooming.
 * @property {Number}  [options.pointThresholdOfZoomAnimation=150] - threshold of point count to perform zoom animation.
 * @property {Boolean} [options.panAnimation=true]              - continue to animate panning when draging or touching ended.
 * @property {Boolean} [options.panAnimationDuration=600]       - duration of pan animation.
 * @property {Boolean} [options.zoomable=true]                  - whether to enable map zooming.
 * @property {Boolean} [options.enableInfoWindow=true]          - whether to enable infowindow on this map.
 * @property {Boolean} [options.hitDetect=true]                 - whether to enable hit detecting of layers for cursor style on this map, disable it to improve performance.
 * @property {Number}  [options.maxZoom=null]                   - the maximum zoom the map can be zooming to.
 * @property {Number}  [options.minZoom=null]                   - the minimum zoom the map can be zooming to.
 * @property {Extent} [options.maxExtent=null]         - when maxExtent is set, map will be restricted to the give max extent and bouncing back when user trying to pan ouside the extent.
 *
 * @property {Boolean} [options.draggable=true]                         - disable the map dragging if set to false.
 * @property {Boolean} [options.doublClickZoom=true]                    - whether to allow map to zoom by double click events.
 * @property {Boolean} [options.scrollWheelZoom=true]                   - whether to allow map to zoom by scroll wheel events.
 * @property {Boolean} [options.touchZoom=true]                         - whether to allow map to zoom by touch events.
 * @property {Boolean} [options.autoBorderPanning=false]                - whether to pan the map automatically if mouse moves on the border of the map
 * @property {Boolean} [options.geometryEvents=true]                    - enable/disable firing geometry events
 *
 * @property {Boolean}        [options.control=true]                    - whether allow map to add controls.
 * @property {Boolean|Object} [options.attributionControl=false]        - display the attribution control on the map if set to true or a object as the control construct option.
 * @property {Boolean|Object} [options.zoomControl=false]               - display the zoom control on the map if set to true or a object as the control construct option.
 * @property {Boolean|Object} [options.scaleControl=false]              - display the scale control on the map if set to true or a object as the control construct option.
 * @property {Boolean|Object} [options.overviewControl=false]           - display the overview control on the map if set to true or a object as the control construct option.
 *
 * @property {String} [options.renderer=canvas]                 - renderer type. Don't change it if you are not sure about it. About renderer, see [TODO]{@link tutorial.renderer}.
 * @memberOf Map
 * @instance
 */
var options = {
    'centerCross': false,

    'clipFullExtent': false,

    'zoomAnimation': function () {
        return !isNode;
    }(),
    'zoomAnimationDuration': 330,
    //still leave background after zooming, set it to false if baseLayer is a transparent layer
    'zoomBackground': false,
    //controls whether other layers than base tilelayer will show during zoom animation.
    'layerZoomAnimation': true,

    'pointThresholdOfZoomAnimation': 200,

    'panAnimation': function () {
        return !isNode;
    }(),
    //default pan animation duration
    'panAnimationDuration': 600,

    'zoomable': true,
    'enableInfoWindow': true,

    'hitDetect': function () {
        return !Browser$1.mobile;
    }(),

    'maxZoom': null,
    'minZoom': null,
    'maxExtent': null,

    'checkSize': true,

    'renderer': 'canvas'
};

/**
 * The central class of the library, to create a map on a container.
 * @category map
 * @extends Class
 *
 * @mixes Eventable
 * @mixes Handlerable
 * @mixes ui.Menuable
 * @mixes Renderable
 *
 * @example
 * var map = new maptalks.Map("map",{
 *      center:     [180,0],
 *      zoom:  4,
 *      baseLayer : new maptalks.TileLayer("base",{
 *          urlTemplate:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
 *          subdomains:['a','b','c']
 *      }),
 *      layers : [
 *          new maptalks.VectorLayer('v', [new maptalks.Marker([180, 0]])
 *      ]
 * });
 */

var Map = function (_Handlerable) {
    inherits(Map, _Handlerable);

    /**
     * @param {(string|HTMLElement|object)} container - The container to create the map on, can be:<br>
     *                                          1. A HTMLElement container.<br/>
     *                                          2. ID of a HTMLElement container.<br/>
     *                                          3. A canvas compatible container in node,
     *                                          e.g. [node-canvas]{@link https://github.com/Automattic/node-canvas},
     *                                              [canvas2svg]{@link https://github.com/gliffy/canvas2svg}
     * @param {Object} options - construct options
     * @param {(Number[]|Coordinate)} options.center - initial center of the map.
     * @param {Number} options.zoom - initial zoom of the map.
     * @param {Object} [options.view=null] - map's view config, default is using projection EPSG:3857 with resolutions used by google map/osm.
     * @param {Layer} [options.baseLayer=null] - base layer that will be set to map initially.
     * @param {Layer[]} [options.layers=null] - layers that will be added to map initially.
     * @param {*} options.* - any other option defined in [Map.options]{@link Map#options}      [description]
     */
    function Map(container, options) {
        classCallCheck(this, Map);

        if (!options) {
            throw new Error('Invalid options when creating map.');
        }
        if (!options['center']) {
            throw new Error('Invalid center when creating map.');
        }
        // copy options
        var opts = extend({}, options);
        var zoom = opts['zoom'];
        delete opts['zoom'];
        var center = new Coordinate(opts['center']);
        delete opts['center'];

        var baseLayer = opts['baseLayer'];
        delete opts['baseLayer'];
        var layers = opts['layers'];
        delete opts['layers'];

        var _this = possibleConstructorReturn(this, _Handlerable.call(this, opts));

        _this._loaded = false;
        if (isString(container)) {
            _this._containerDOM = document.getElementById(container);
            if (!_this._containerDOM) {
                throw new Error('invalid container when creating map: \'' + container + '\'');
            }
        } else {
            _this._containerDOM = container;
            if (isNode) {
                //Reserve container's constructor in node for canvas creating.
                _this.CanvasClass = _this._containerDOM.constructor;
            }
        }

        if (!isNode) {
            if (_this._containerDOM.childNodes && _this._containerDOM.childNodes.length > 0) {
                if (_this._containerDOM.childNodes[0].className === 'maptalks-wrapper') {
                    throw new Error('Container is already loaded with another map instance, use map.remove() to clear it.');
                }
            }
        }

        _this._panels = {};

        //Layers
        _this._baseLayer = null;
        _this._layers = [];

        _this._zoomLevel = zoom;
        _this._center = center;

        _this.setView(opts['view']);

        if (baseLayer) {
            _this.setBaseLayer(baseLayer);
        }
        if (layers) {
            _this.addLayer(layers);
        }

        _this._mapViewPoint = new Point(0, 0);

        _this._initRenderer();
        _this._getRenderer().initContainer();
        _this._updateMapSize(_this._getContainerDomSize());

        _this._Load();
        return _this;
    }

    /**
     * Add hooks for additional codes when map's loading complete, useful for plugin developping.
     * @param {Function} fn
     * @returns {Map}
     * @protected
     */


    Map.addOnLoadHook = function addOnLoadHook(fn) {
        // (Function) || (String, args...)
        var args = Array.prototype.slice.call(arguments, 1);
        var onload = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };
        this.prototype._onLoadHooks = this.prototype._onLoadHooks || [];
        this.prototype._onLoadHooks.push(onload);
        return this;
    };

    /**
     * Whether the map is loaded or not.
     * @return {Boolean}
     */


    Map.prototype.isLoaded = function isLoaded() {
        return this._loaded;
    };

    /**
     * Whether the map is rendered by canvas
     * @return {Boolean}
     * @protected
     * @example
     * var isCanvas = map.isCanvasRender();
     */


    Map.prototype.isCanvasRender = function isCanvasRender() {
        var renderer = this._getRenderer();
        if (renderer) {
            return renderer.isCanvasRender();
        }
        return false;
    };

    /**
     * Get the view of the Map.
     * @return {View} map's view
     */


    Map.prototype.getView = function getView() {
        if (!this._view) {
            return null;
        }
        return this._view;
    };

    /**
     * Change the view of the map. <br>
     * A view is a series of settings to decide the map presentation:<br>
     * 1. the projection.<br>
     * 2. zoom levels and resolutions. <br>
     * 3. full extent.<br>
     * There are some [predefined views]{@link http://www.foo.com}, and surely you can [define a custom one.]{@link http://www.foo.com}.<br>
     * View can also be set by map.config('view', view);
     * @param {View} view - view settings
     * @returns {Map} this
     * @fires Map#viewchange
     * @example
     *  map.setView({
            projection:'EPSG:4326',
            resolutions: (function() {
                var resolutions = [];
                for (var i=0; i < 19; i++) {
                    resolutions[i] = 180/(Math.pow(2, i)*128);
                }
                return resolutions;
            })()
        });
     */


    Map.prototype.setView = function setView(view) {
        var oldView = this.options['view'];
        if (oldView && !view) {
            return this;
        }
        this._center = this.getCenter();
        this.options['view'] = view;
        this._view = new View(view);
        if (this.options['view'] && isFunction(this.options['view']['projection'])) {
            var projection = this._view.getProjection();
            //save projection code for map profiling (toJSON/fromJSON)
            this.options['view']['projection'] = projection['code'];
        }
        this._resetMapStatus();
        /**
         * viewchange event, fired when map's view is updated.
         *
         * @event Map#viewchange
         * @type {Object}
         * @property {String} type - viewchange
         * @property {Map} target - map
         * @property {Map} old - the old view
         * @property {Map} new - the new view changed to
         */
        this._fireEvent('viewchange', {
            'old': oldView,
            'new': extend({}, this.options['view'])
        });
        return this;
    };

    /**
     * Callback when any option is updated
     * @private
     * @param  {Object} conf - options to update
     * @return {Map}   this
     */


    Map.prototype.onConfig = function onConfig(conf) {
        if (!isNil(conf['view'])) {
            this.setView(conf['view']);
        }
        return this;
    };

    /**
     * Get the projection of the map. <br>
     * Projection is an algorithm for map projection, e.g. well-known [Mercator Projection]{@link https://en.wikipedia.org/wiki/Mercator_projection} <br>
     * A projection must have 2 methods: <br>
     * 1. project(coordinate) - project the input coordinate <br>
     * 2. unproject(coordinate) - unproject the input coordinate <br>
     * Projection also contains measuring method usually extended from a measurer: <br>
     * 1. measureLength(coord1, coord2) - compute length between 2 coordinates.  <br>
     * 2. measureArea(coords[]) - compute area of the input coordinates. <br>
     * 3. locate(coord, distx, disty) - compute the coordinate from the coord with xdist on axis x and ydist on axis y.
     * @return {Object}
     */


    Map.prototype.getProjection = function getProjection() {
        return this._view.getProjection();
    };

    /**
     * Get map's full extent, which is defined in map's view. <br>
     * eg: {'left': -180, 'right' : 180, 'top' : 90, 'bottom' : -90}
     * @return {Extent}
     */


    Map.prototype.getFullExtent = function getFullExtent() {
        return this._view.getFullExtent();
    };

    /**
     * Set map's cursor style, cursor style is same with CSS.
     * @param {String} cursor - cursor style
     * @returns {Map} this
     * @example
     * map.setCursor('url(cursor.png) 4 12, auto');
     */


    Map.prototype.setCursor = function setCursor(cursor) {
        delete this._cursor;
        this._trySetCursor(cursor);
        this._cursor = cursor;
        return this;
    };

    /**
     * Reset map's cursor style.
     * @return {Map} this
     * @example
     * map.resetCursor();
     */


    Map.prototype.resetCursor = function resetCursor() {
        return this.setCursor(null);
    };

    /**
     * Get center of the map.
     * @return {Coordinate}
     */


    Map.prototype.getCenter = function getCenter() {
        if (!this._loaded || !this._prjCenter) {
            return this._center;
        }
        var projection = this.getProjection();
        return projection.unproject(this._prjCenter);
    };

    /**
     * Set a new center to the map.
     * @param {Coordinate} center
     * @return {Map} this
     */


    Map.prototype.setCenter = function setCenter(center) {
        if (!center) {
            return this;
        }
        center = new Coordinate(center);
        if (!this._verifyExtent(center)) {
            return this;
        }
        if (!this._loaded) {
            this._center = center;
            return this;
        }
        this.onMoveStart();
        var projection = this.getProjection();
        var _pcenter = projection.project(center);
        this._setPrjCenterAndMove(_pcenter);
        this.onMoveEnd();
        return this;
    };

    /**
     * Get map's size (width and height) in pixel.
     * @return {Size}
     */


    Map.prototype.getSize = function getSize() {
        if (isNil(this.width) || isNil(this.height)) {
            return this._getContainerDomSize();
        }
        return new Size(this.width, this.height);
    };

    /**
     * Get container extent of the map
     * @return {PointExtent}
     */


    Map.prototype.getContainerExtent = function getContainerExtent() {
        return new PointExtent(0, 0, this.width, this.height);
    };

    /**
     * Get the geographical extent of map's current view extent.
     *
     * @return {Extent}
     */


    Map.prototype.getExtent = function getExtent() {
        return this._pointToExtent(this._get2DExtent());
    };

    /**
     * Get the projected geographical extent of map's current view extent.
     *
     * @return {Extent}
     */


    Map.prototype.getProjExtent = function getProjExtent() {
        var extent2D = this._get2DExtent();
        return new Extent(this._pointToPrj(extent2D.getMin()), this._pointToPrj(extent2D.getMax()));
    };

    /**
     * Get the max extent that the map is restricted to.
     * @return {Extent}
     */


    Map.prototype.getMaxExtent = function getMaxExtent() {
        if (!this.options['maxExtent']) {
            return null;
        }
        return new Extent(this.options['maxExtent']);
    };

    /**
     * Sets the max extent that the map is restricted to.
     * @param {Extent}
     * @return {Map} this
     * @example
     * map.setMaxExtent(map.getExtent());
     */


    Map.prototype.setMaxExtent = function setMaxExtent(extent) {
        if (extent) {
            var maxExt = new Extent(extent);
            this.options['maxExtent'] = maxExt;
            var center = this.getCenter();
            if (!this._verifyExtent(center)) {
                this.panTo(maxExt.getCenter());
            }
        } else {
            delete this.options['maxExtent'];
        }
        return this;
    };

    /**
     * Get map's current zoom.
     * @return {Number}
     */


    Map.prototype.getZoom = function getZoom() {
        return this._zoomLevel;
    };

    /**
     * Caculate the target zoom if scaling from "fromZoom" by "scale"
     * @param  {Number} scale
     * @param  {Number} fromZoom
     * @return {Number} zoom fit for scale starting from fromZoom
     */


    Map.prototype.getZoomForScale = function getZoomForScale(scale, fromZoom) {
        if (isNil(fromZoom)) {
            fromZoom = this.getZoom();
        }
        var res = this._getResolution(fromZoom),
            resolutions = this._getResolutions(),
            minZoom = this.getMinZoom(),
            maxZoom = this.getMaxZoom(),
            min = Number.MAX_VALUE,
            hit = -1;
        for (var i = resolutions.length - 1; i >= 0; i--) {
            var test = Math.abs(res / resolutions[i] - scale);
            if (test < min) {
                min = test;
                hit = i;
            }
        }
        if (isNumber(minZoom) && hit < minZoom) {
            hit = minZoom;
        }
        if (isNumber(maxZoom) && hit > maxZoom) {
            hit = maxZoom;
        }
        return hit;
    };

    Map.prototype.getZoomFromRes = function getZoomFromRes(res) {
        var resolutions = this._getResolutions(),
            minRes = this._getResolution(this.getMinZoom()),
            maxRes = this._getResolution(this.getMaxZoom());
        if (minRes <= maxRes) {
            if (res <= minRes) {
                return this.getMinZoom();
            } else if (res >= maxRes) {
                return this.getMaxZoom();
            }
        } else if (res >= minRes) {
            return this.getMinZoom();
        } else if (res <= maxRes) {
            return this.getMaxZoom();
        }

        var l = resolutions.length;
        for (var i = 0; i < l - 1; i++) {
            if (!resolutions[i]) {
                continue;
            }
            var gap = Math.abs(resolutions[i + 1] - resolutions[i]);
            var test = Math.abs(res - resolutions[i]);
            if (gap >= test) {
                return i + test / gap;
            }
        }
        return l - 1;
    };

    /**
     * Sets zoom of the map
     * @param {Number} zoom
     * @returns {Map} this
     */


    Map.prototype.setZoom = function setZoom(zoom) {
        var me = this;
        executeWhen(function () {
            if (me._loaded && me.options['zoomAnimation']) {
                me._zoomAnimation(zoom);
            } else {
                me._zoom(zoom);
            }
        }, function () {
            return !me._zooming;
        });
        return this;
    };

    /**
     * Get the max zoom that the map can be zoom to.
     * @return {Number}
     */


    Map.prototype.getMaxZoom = function getMaxZoom() {
        if (!isNil(this.options['maxZoom'])) {
            return this.options['maxZoom'];
        }
        var view = this.getView();
        if (!view) {
            return null;
        }
        return view.getResolutions().length - 1;
    };

    /**
     * Sets the max zoom that the map can be zoom to.
     * @param {Number} maxZoom
     * @returns {Map} this
     */


    Map.prototype.setMaxZoom = function setMaxZoom(maxZoom) {
        var viewMaxZoom = this._view.getMaxZoom();
        if (maxZoom > viewMaxZoom) {
            maxZoom = viewMaxZoom;
        }
        if (maxZoom < this._zoomLevel) {
            this.setZoom(maxZoom);
        }
        this.options['maxZoom'] = maxZoom;
        return this;
    };

    /**
     * Get the min zoom that the map can be zoom to.
     * @return {Number}
     */


    Map.prototype.getMinZoom = function getMinZoom() {
        if (!isNil(this.options['minZoom'])) {
            return this.options['minZoom'];
        }
        return 0;
    };

    /**
     * Sets the min zoom that the map can be zoom to.
     * @param {Number} minZoom
     * @return {Map} this
     */


    Map.prototype.setMinZoom = function setMinZoom(minZoom) {
        var viewMinZoom = this._view.getMinZoom();
        if (minZoom < viewMinZoom) {
            minZoom = viewMinZoom;
        }
        this.options['minZoom'] = minZoom;
        return this;
    };

    /**
     * zoom in
     * @return {Map} this
     */


    Map.prototype.zoomIn = function zoomIn() {
        var me = this;
        executeWhen(function () {
            me.setZoom(me.getZoom() + 1);
        }, function () {
            return !me._zooming;
        });
        return this;
    };

    /**
     * zoom out
     * @return {Map} this
     */


    Map.prototype.zoomOut = function zoomOut() {
        var me = this;
        executeWhen(function () {
            me.setZoom(me.getZoom() - 1);
        }, function () {
            return !me._zooming;
        });
        return this;
    };

    /**
     * Whether the map is zooming
     * @return {Boolean}
     */


    Map.prototype.isZooming = function isZooming() {
        return !!this._zooming;
    };

    /**
     * Sets the center and zoom at the same time.
     * @param {Coordinate} center
     * @param {Number} zoom
     * @return {Map} this
     */


    Map.prototype.setCenterAndZoom = function setCenterAndZoom(center, zoom) {
        if (this._zoomLevel !== zoom) {
            this.setCenter(center);
            if (!isNil(zoom)) {
                this.setZoom(zoom);
            }
        } else {
            this.setCenter(center);
        }
        return this;
    };

    /**
     * Caculate the zoom level that contains the given extent with the maximum zoom level possible.
     * @param {Extent} extent
     * @return {Number} zoom fit for the extent
     */


    Map.prototype.getFitZoom = function getFitZoom(extent) {
        if (!extent || !(extent instanceof Extent)) {
            return this._zoomLevel;
        }
        //It's a point
        if (extent['xmin'] === extent['xmax'] && extent['ymin'] === extent['ymax']) {
            return this.getMaxZoom();
        }
        var projection = this.getProjection(),
            x = Math.abs(extent['xmin'] - extent['xmax']),
            y = Math.abs(extent['ymin'] - extent['ymax']),
            projectedExtent = projection.project({
            x: x,
            y: y
        }),
            resolutions = this._getResolutions(),
            xz = -1,
            yz = -1;
        for (var i = this.getMinZoom(), len = this.getMaxZoom(); i < len; i++) {
            if (round(projectedExtent.x / resolutions[i]) >= this.width) {
                if (xz === -1) {
                    xz = i;
                }
            }
            if (round(projectedExtent.y / resolutions[i]) >= this.height) {
                if (yz === -1) {
                    yz = i;
                }
            }
            if (xz > -1 && yz > -1) {
                break;
            }
        }
        var ret = xz < yz ? xz : yz;
        if (ret === -1) {
            ret = xz < yz ? yz : xz;
        }
        if (ret === -1) {
            return this.getMaxZoom();
        }
        return ret;
    };

    /**
     * Get map's resolution
     * @param {Number} zoom - zoom or current zoom if not given
     * @return {Number} resolution
     */


    Map.prototype.getResolution = function getResolution(zoom) {
        return this._getResolution(zoom);
    };

    /**
     * Get scale of resolutions from zoom to max zoom
     * @param {Number} zoom - zoom or current zoom if not given
     * @return {Number} scale
     */


    Map.prototype.getScale = function getScale(zoom) {
        var z = isNil(zoom) ? this.getZoom() : zoom;
        var max = this._getResolution(this.getMaxZoom()),
            res = this._getResolution(z);
        return res / max;
    };

    /**
     * Set the map to be fit for the given extent with the max zoom level possible.
     * @param  {Extent} extent - extent
     * @param  {Number} zoomOffset - zoom offset
     * @return {Map} - this
     */


    Map.prototype.fitExtent = function fitExtent(extent, zoomOffset) {
        if (!extent) {
            return this;
        }
        zoomOffset = zoomOffset || 0;
        var zoom = this.getFitZoom(extent);
        zoom += zoomOffset;
        var center = new Extent(extent).getCenter();
        return this.setCenterAndZoom(center, zoom);
    };

    /**
     * Get the base layer of the map.
     * @return {Layer}
     */


    Map.prototype.getBaseLayer = function getBaseLayer() {
        return this._baseLayer;
    };

    /**
     * Sets a new base layer to the map.<br>
     * Some events will be thrown such as baselayerchangestart, baselayerload, baselayerchangeend.
     * @param  {Layer} baseLayer - new base layer
     * @return {Map} this
     * @fires Map#setbaselayer
     * @fires Map#baselayerchangestart
     * @fires Map#baselayerchangeend
     */


    Map.prototype.setBaseLayer = function setBaseLayer(baseLayer) {
        var isChange = false;
        if (this._baseLayer) {
            isChange = true;
            /**
             * baselayerchangestart event, fired when base layer is changed.
             *
             * @event Map#baselayerchangestart
             * @type {Object}
             * @property {String} type - baselayerchangestart
             * @property {Map} target - map
             */
            this._fireEvent('baselayerchangestart');
            this._baseLayer.remove();
        }
        if (!baseLayer) {
            delete this._baseLayer;
            /**
             * baselayerchangeend event, fired when base layer is changed.
             *
             * @event Map#baselayerchangeend
             * @type {Object}
             * @property {String} type - baselayerchangeend
             * @property {Map} target - map
             */
            this._fireEvent('baselayerchangeend');
            /**
             * setbaselayer event, fired when base layer is set.
             *
             * @event Map#setbaselayer
             * @type {Object}
             * @property {String} type - setbaselayer
             * @property {Map} target - map
             */
            this._fireEvent('setbaselayer');
            return this;
        }
        if (baseLayer instanceof TileLayer) {
            baseLayer.config({
                'renderWhenPanning': true
            });
            if (!baseLayer.options['tileSystem']) {
                baseLayer.config('tileSystem', TileSystem.getDefault(this.getProjection()));
            }
        }
        baseLayer._bindMap(this, -1);
        this._baseLayer = baseLayer;

        function onbaseLayerload() {
            /**
             * baselayerload event, fired when base layer is loaded.
             *
             * @event Map#baselayerload
             * @type {Object}
             * @property {String} type - baselayerload
             * @property {Map} target - map
             */
            this._fireEvent('baselayerload');
            if (isChange) {
                isChange = false;
                this._fireEvent('baselayerchangeend');
            }
        }
        this._baseLayer.on('layerload', onbaseLayerload, this);
        if (this._loaded) {
            this._baseLayer.load();
        }
        this._fireEvent('setbaselayer');
        return this;
    };

    /**
     * Remove the base layer from the map
     * @return {Map} this
     * @fires Map#baselayerremove
     */


    Map.prototype.removeBaseLayer = function removeBaseLayer() {
        if (this._baseLayer) {
            this._baseLayer.remove();
            delete this._baseLayer;
            /**
             * baselayerremove event, fired when base layer is removed.
             *
             * @event Map#baselayerremove
             * @type {Object}
             * @property {String} type - baselayerremove
             * @property {Map} target - map
             */
            this._fireEvent('baselayerremove');
        }
        return this;
    };

    /**
     * Get the layers of the map, except base layer (which should be by getBaseLayer). <br>
     * A filter function can be given to filter layers, e.g. exclude all the VectorLayers.
     * @param {Function} [filter=undefined] - a filter function of layers, return false to exclude the given layer.
     * @return {Layer[]}
     * @example
     * var vectorLayers = map.getLayers(function (layer) {
     *     return (layer instanceof VectorLayer);
     * });
     */


    Map.prototype.getLayers = function getLayers(filter) {
        return this._getLayers(function (layer) {
            if (layer === this._baseLayer || layer.getId().indexOf(INTERNAL_LAYER_PREFIX) >= 0) {
                return false;
            }
            if (filter) {
                return filter(layer);
            }
            return true;
        });
    };

    /**
     * Get the layer with the given id.
     * @param  {String} id - layer id
     * @return {Layer}
     */


    Map.prototype.getLayer = function getLayer(id) {
        if (!id || !this._layerCache || !this._layerCache[id]) {
            return null;
        }
        return this._layerCache[id];
    };

    /**
     * Add a new layer on the top of the map.
     * @param  {Layer|Layer[]} layer - one or more layers to add
     * @return {Map} this
     * @fires Map#addlayer
     */


    Map.prototype.addLayer = function addLayer(layers) {
        if (!layers) {
            return this;
        }
        if (!Array.isArray(layers)) {
            return this.addLayer([layers]);
        }
        if (!this._layerCache) {
            this._layerCache = {};
        }
        for (var i = 0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            var id = layer.getId();
            if (isNil(id)) {
                throw new Error('Invalid id for the layer: ' + id);
            }
            if (this._layerCache[id]) {
                throw new Error('Duplicate layer id in the map: ' + id);
            }
            this._layerCache[id] = layer;
            layer._bindMap(this, this._layers.length);
            this._layers.push(layer);
            if (this._loaded) {
                layer.load();
            }
        }
        /**
         * addlayer event, fired when adding layers.
         *
         * @event Map#addlayer
         * @type {Object}
         * @property {String} type - addlayer
         * @property {Map} target - map
         * @property {Layer[]} layers - layers to add
         */
        this._fireEvent('addlayer', {
            'layers': layers
        });
        return this;
    };

    /**
     * Remove a layer from the map
     * @param  {String|String[]|Layer|Layer[]} layer - one or more layers or layer ids
     * @return {Map} this
     * @fires Map#removelayer
     */


    Map.prototype.removeLayer = function removeLayer(layers) {
        if (!layers) {
            return this;
        }
        if (!Array.isArray(layers)) {
            return this.removeLayer([layers]);
        }
        for (var i = 0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            if (!(layer instanceof Layer)) {
                layer = this.getLayer(layer);
            }
            if (!layer) {
                continue;
            }
            var map = layer.getMap();
            if (!map || map !== this) {
                continue;
            }
            this._removeLayer(layer, this._layers);
            if (this._loaded) {
                layer._doRemove();
            }
            var id = layer.getId();
            if (this._layerCache) {
                delete this._layerCache[id];
            }
            layer.fire('remove');
        }
        /**
         * removelayer event, fired when removing layers.
         *
         * @event Map#removelayer
         * @type {Object}
         * @property {String} type - removelayer
         * @property {Map} target - map
         * @property {Layer[]} layers - layers to remove
         */
        this._fireEvent('removelayer', {
            'layers': layers
        });
        return this;
    };

    /**
     * Sort layers according to the order provided, the last will be on the top.
     * @param  {string[]|Layer[]} layers - layers or layer ids to sort
     * @return {Map} this
     * @example
     * map.addLayer([layer1, layer2, layer3]);
     * map.sortLayers([layer2, layer3, layer1]);
     * map.sortLayers(['3', '2', '1']); // sort by layer ids.
     */


    Map.prototype.sortLayers = function sortLayers(layers) {
        if (!layers || !Array.isArray(layers)) {
            return this;
        }
        var layersToOrder = [];
        var minZ = Number.MAX_VALUE;
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (isString(layers[i])) {
                layer = this.getLayer(layer);
            }
            if (!(layer instanceof Layer) || !layer.getMap() || layer.getMap() !== this) {
                throw new Error('It must be a layer added to this map to order.');
            }
            if (layer.getZIndex() < minZ) {
                minZ = layer.getZIndex();
            }
            layersToOrder.push(layer);
        }
        for (var ii = 0; ii < layersToOrder.length; ii++) {
            layersToOrder[ii].setZIndex(minZ + ii);
        }
        return this;
    };

    /**
     * Exports image from the map's canvas.
     * @param {Object} [options=undefined] - options
     * @param {String} [options.mimeType=image/png] - mime type of the image
     * @param {Boolean} [options.save=false] - whether pop a file save dialog to save the export image.
     * @param {String} [options.filename=export] - specify the file name, if options.save is true.
     * @return {String} image of base64 format.
     */


    Map.prototype.toDataURL = function toDataURL(options) {
        if (!options) {
            options = {};
        }
        var mimeType = options['mimeType'];
        if (!mimeType) {
            mimeType = 'image/png';
        }
        var save = options['save'];
        var renderer = this._getRenderer();
        if (renderer && renderer.toDataURL) {
            var file = options['filename'];
            if (!file) {
                file = 'export';
            }
            var dataURL = renderer.toDataURL(mimeType);
            if (save && dataURL) {
                var imgURL = dataURL;

                var dlLink = document.createElement('a');
                dlLink.download = file;
                dlLink.href = imgURL;
                dlLink.dataset.downloadurl = [mimeType, dlLink.download, dlLink.href].join(':');

                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
            }
            return dataURL;
        }
        return null;
    };

    /**
     * Converts a coordinate to the 2D point in current zoom or in the specific zoom. <br>
     * The 2D point's coordinate system's origin is the same with map's origin.
     * @param  {Coordinate} coordinate - coordinate
     * @param  {Number} [zoom=undefined]       - zoom level
     * @return {Point}  2D point
     * @example
     * var point = map.coordinateToPoint(new Coordinate(121.3, 29.1));
     */


    Map.prototype.coordinateToPoint = function coordinateToPoint(coordinate, zoom) {
        var prjCoord = this.getProjection().project(coordinate);
        return this._prjToPoint(prjCoord, zoom);
    };

    /**
     * Converts a 2D point in current zoom or a specific zoom to a coordinate.
     * @param  {Point} point - 2D point
     * @param  {Number} zoom  - zoom level
     * @return {Coordinate} coordinate
     * @example
     * var coord = map.pointToCoordinate(new Point(4E6, 3E4));
     */


    Map.prototype.pointToCoordinate = function pointToCoordinate(point, zoom) {
        var prjCoord = this._pointToPrj(point, zoom);
        return this.getProjection().unproject(prjCoord);
    };

    /**
     * Converts a geographical coordinate to view point.<br>
     * A view point is a point relative to map's mapPlatform panel's position. <br>
     * @param {Coordinate} coordinate
     * @return {Point}
     */


    Map.prototype.coordinateToViewPoint = function coordinateToViewPoint(coordinate) {
        return this._prjToViewPoint(this.getProjection().project(coordinate));
    };

    /**
     * Converts a view point to the geographical coordinate.
     * @param {Point} viewPoint
     * @return {Coordinate}
     */


    Map.prototype.viewPointToCoordinate = function viewPointToCoordinate(viewPoint) {
        return this.getProjection().unproject(this._viewPointToPrj(viewPoint));
    };

    /**
     * Convert a geographical coordinate to the container point. <br>
     *  A container point is a point relative to map container's top-left corner. <br>
     * @param {Coordinate}
     * @return {Point}
     */


    Map.prototype.coordinateToContainerPoint = function coordinateToContainerPoint(coordinate) {
        var pCoordinate = this.getProjection().project(coordinate);
        return this._prjToContainerPoint(pCoordinate);
    };

    /**
     * Converts a container point to geographical coordinate.
     * @param {Point}
     * @return {Coordinate}
     */


    Map.prototype.containerPointToCoordinate = function containerPointToCoordinate(containerPoint) {
        var pCoordinate = this._containerPointToPrj(containerPoint);
        return this.getProjection().unproject(pCoordinate);
    };

    /**
     * Converts a container point to the view point.
     *
     * @param {Point}
     * @returns {Point}
     */


    Map.prototype.containerPointToViewPoint = function containerPointToViewPoint(containerPoint) {
        return containerPoint.substract(this.offsetPlatform());
    };

    /**
     * Converts a view point to the container point.
     *
     * @param {Point}
     * @returns {Point}
     */


    Map.prototype.viewPointToContainerPoint = function viewPointToContainerPoint(viewPoint) {
        return viewPoint.add(this.offsetPlatform());
    };

    /**
     * Converts a container point extent to the geographic extent.
     * @param  {PointExtent} containerExtent - containeproints extent
     * @return {Extent}  geographic extent
     */


    Map.prototype.containerToExtent = function containerToExtent(containerExtent) {
        var extent2D = new PointExtent(this._containerPointToPoint(containerExtent.getMin()), this._containerPointToPoint(containerExtent.getMax()));
        return this._pointToExtent(extent2D);
    };

    /**
     * Checks if the map container size changed and updates the map if so.
     * @return {Map} this
     * @fires Map#resize
     */


    Map.prototype.checkSize = function checkSize() {
        var justStart = now() - this._initTime < 1500 && this.width === 0 || this.height === 0;

        var watched = this._getContainerDomSize(),
            oldHeight = this.height,
            oldWidth = this.width;
        if (watched['width'] === oldWidth && watched['height'] === oldHeight) {
            return this;
        }
        var center = this.getCenter();
        this._updateMapSize(watched);
        var resizeOffset = new Point((oldWidth - watched.width) / 2, (oldHeight - watched.height) / 2);
        this._offsetCenterByPixel(resizeOffset);

        var hided = watched['width'] === 0 || watched['height'] === 0 || oldWidth === 0 || oldHeight === 0;

        if (justStart || hided) {
            this._eventSuppressed = true;
            this.setCenter(center);
            this._eventSuppressed = false;
        }
        /**
         * resize event when map container's size changes
         * @event Map#resize
         * @type {Object}
         * @property {String} type - resize
         * @property {Map} target - map fires the event
         */
        this._fireEvent('resize');

        return this;
    };

    /**
     * Converts geographical distances to the pixel length.<br>
     * The value varis with difference zoom level.
     *
     * @param  {Number} xDist - distance on X axis.
     * @param  {Number} yDist - distance on Y axis.
     * @return {Size} result.width: pixel length on X axis; result.height: pixel length on Y axis
     */


    Map.prototype.distanceToPixel = function distanceToPixel(xDist, yDist, zoom) {
        var projection = this.getProjection();
        if (!projection) {
            return null;
        }
        var center = this.getCenter(),
            target = projection.locate(center, xDist, yDist),
            res = this._getResolution(zoom);

        var width = !xDist ? 0 : (projection.project(new Coordinate(target.x, center.y)).x - projection.project(center).x) / res;
        var height = !yDist ? 0 : (projection.project(new Coordinate(center.x, target.y)).y - projection.project(center).y) / res;
        return new Size(Math.abs(width), Math.abs(height));
    };

    /**
     * Converts pixel size to geographical distance.
     *
     * @param  {Number} width - pixel width
     * @param  {Number} height - pixel height
     * @return {Number}  distance - Geographical distance
     */


    Map.prototype.pixelToDistance = function pixelToDistance(width, height, zoom) {
        var projection = this.getProjection();
        if (!projection) {
            return null;
        }
        //����ǰˢ��scales
        var center = this.getCenter(),
            pcenter = this._getPrjCenter(),
            res = this._getResolution(zoom);
        var pTarget = new Coordinate(pcenter.x + width * res, pcenter.y + height * res);
        var target = projection.unproject(pTarget);
        return projection.measureLength(target, center);
    };

    /**
     * Computes the coordinate from the given meter distance.
     * @param  {Coordinate} coordinate - source coordinate
     * @param  {Number} dx           - meter distance on X axis
     * @param  {Number} dy           - meter distance on Y axis
     * @return {Coordinate} Result coordinate
     */


    Map.prototype.locate = function locate(coordinate, dx, dy) {
        return this.getProjection().locate(new Coordinate(coordinate), dx, dy);
    };

    /**
     * Computes the coordinate from the given pixel distance.
     * @param  {Coordinate} coordinate - source coordinate
     * @param  {Number} px           - pixel distance on X axis
     * @param  {Number} py           - pixel distance on Y axis
     * @return {Coordinate} Result coordinate
     */


    Map.prototype.locateByPoint = function locateByPoint(coordinate, px, py) {
        var point = this.coordinateToPoint(coordinate);
        return this.pointToCoordinate(point._add(px, py));
    };

    /**
     * Return map's main panel
     * @returns {HTMLElement}
     */


    Map.prototype.getMainPanel = function getMainPanel() {
        return this._getRenderer().getMainPanel();
    };

    /**
     * Returns map panels.
     * @return {Object}
     */


    Map.prototype.getPanels = function getPanels() {
        return this._panels;
    };

    Map.prototype.remove = function remove() {
        this._registerDomEvents(true);
        this._clearHandlers();
        this.removeBaseLayer();
        var layers = this.getLayers();
        for (var i = 0; i < layers.length; i++) {
            layers[i].remove();
        }
        if (this._getRenderer()) {
            this._getRenderer().remove();
        }
        this._clearAllListeners();
        if (this._containerDOM && this._containerDOM.innerHTML) {
            this._containerDOM.innerHTML = '';
        }
        delete this._panels;
        delete this._containerDOM;
        return this;
    };

    /**
     * Whether the map is moving
     * @return {Boolean}
     */


    Map.prototype.isMoving = function isMoving() {
        return !!this._moving;
    };

    /**
     * The callback function when move started
     * @private
     * @fires Map#movestart
     */


    Map.prototype.onMoveStart = function onMoveStart(param) {
        this._originCenter = this.getCenter();
        this._enablePanAnimation = false;
        this._moving = true;
        this._trySetCursor('move');
        /**
         * movestart event
         * @event Map#movestart
         * @type {Object}
         * @property {String} type - movestart
         * @property {Map} target - map fires the event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this._fireEvent('movestart', this._parseEvent(param ? param['domEvent'] : null, 'movestart'));
    };

    Map.prototype.onMoving = function onMoving(param) {
        /**
         * moving event
         * @event Map#moving
         * @type {Object}
         * @property {String} type - moving
         * @property {Map} target - map fires the event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this._fireEvent('moving', this._parseEvent(param ? param['domEvent'] : null, 'moving'));
    };

    Map.prototype.onMoveEnd = function onMoveEnd(param) {
        this._moving = false;
        this._trySetCursor('default');
        /**
         * moveend event
         * @event Map#moveend
         * @type {Object}
         * @property {String} type - moveend
         * @property {Map} target - map fires the event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this._fireEvent('moveend', this._parseEvent(param ? param['domEvent'] : null, 'moveend'));
        if (!this._verifyExtent(this.getCenter())) {
            var moveTo = this._originCenter;
            if (!this._verifyExtent(moveTo)) {
                moveTo = this.getMaxExtent().getCenter();
            }
            this.panTo(moveTo);
        }
    };

    //-----------------------------------------------------------
    /**
     * try to change cursor when map is not setCursored
     * @private
     * @param  {String} cursor css cursor
     */


    Map.prototype._trySetCursor = function _trySetCursor(cursor) {
        if (!this._cursor && !this._priorityCursor) {
            if (!cursor) {
                cursor = 'default';
            }
            this._setCursorToPanel(cursor);
        }
        return this;
    };

    Map.prototype._setPriorityCursor = function _setPriorityCursor(cursor) {
        if (!cursor) {
            var hasCursor = false;
            if (this._priorityCursor) {
                hasCursor = true;
            }
            delete this._priorityCursor;
            if (hasCursor) {
                this.setCursor(this._cursor);
            }
        } else {
            this._priorityCursor = cursor;
            this._setCursorToPanel(cursor);
        }
        return this;
    };

    Map.prototype._setCursorToPanel = function _setCursorToPanel(cursor) {
        var panel = this.getMainPanel();
        if (panel && panel.style && panel.style.cursor !== cursor) {
            panel.style.cursor = cursor;
        }
    };

    /**
     * Get map's extent in view points.
     * @param {Number} zoom - zoom
     * @return {PointExtent}
     * @private
     */


    Map.prototype._get2DExtent = function _get2DExtent(zoom) {
        var c1 = this._containerPointToPoint(new Point(0, 0), zoom),
            c2 = this._containerPointToPoint(new Point(this.width, 0), zoom),
            c3 = this._containerPointToPoint(new Point(this.width, this.height), zoom),
            c4 = this._containerPointToPoint(new Point(0, this.height), zoom);
        var xmin = Math.min(c1.x, c2.x, c3.x, c4.x),
            xmax = Math.max(c1.x, c2.x, c3.x, c4.x),
            ymin = Math.min(c1.y, c2.y, c3.y, c4.y),
            ymax = Math.max(c1.y, c2.y, c3.y, c4.y);
        return new PointExtent(xmin, ymin, xmax, ymax);
    };

    /**
     * Converts a view point extent to the geographic extent.
     * @param  {PointExtent} extent2D - view points extent
     * @return {Extent}  geographic extent
     * @protected
     */


    Map.prototype._pointToExtent = function _pointToExtent(extent2D) {
        return new Extent(this.pointToCoordinate(extent2D.getMin()), this.pointToCoordinate(extent2D.getMax()));
    };

    Map.prototype._setPrjCenterAndMove = function _setPrjCenterAndMove(pcenter) {
        var offset = this._getPixelDistance(pcenter);
        this._setPrjCenter(pcenter);
        this.offsetPlatform(offset);
    };

    //remove a layer from the layerList


    Map.prototype._removeLayer = function _removeLayer(layer, layerList) {
        if (!layer || !layerList) {
            return;
        }
        var index = layerList.indexOf(layer);
        if (index > -1) {
            layerList.splice(index, 1);

            for (var j = 0, jlen = layerList.length; j < jlen; j++) {
                if (layerList[j].setZIndex) {
                    layerList[j].setZIndex(j);
                }
            }
        }
    };

    Map.prototype._sortLayersByZIndex = function _sortLayersByZIndex(layerList) {
        layerList.sort(function (a, b) {
            return a.getZIndex() - b.getZIndex();
        });
    };

    /**
     * Gets pixel lenth from pcenter to map's current center.
     * @param  {Coordinate} pcenter - a projected coordinate
     * @return {Point}
     * @private
     */


    Map.prototype._getPixelDistance = function _getPixelDistance(pCoord) {
        var center = this._getPrjCenter();
        var pxCenter = this._prjToContainerPoint(center);
        var pxCoord = this._prjToContainerPoint(pCoord);
        var dist = new Point(-pxCoord.x + pxCenter.x, pxCenter.y - pxCoord.y);
        return dist;
    };

    Map.prototype._fireEvent = function _fireEvent(eventName, param) {
        if (this._eventSuppressed) {
            return;
        }
        //fire internal events at first
        this.fire('_' + eventName, param);
        this.fire(eventName, param);
    };

    Map.prototype._Load = function _Load() {
        this._resetMapStatus();
        this._registerDomEvents();
        this._loadAllLayers();
        this._getRenderer().onLoad();
        this._loaded = true;
        this._callOnLoadHooks();
        this._initTime = now();
        /**
         * load event, fired when the map completes loading.
         *
         * @event Map#load
         * @type {Object}
         * @property {String} type - load
         * @property {Map} target - map
         */
        this._fireEvent('load');
    };

    Map.prototype._initRenderer = function _initRenderer() {
        var renderer = this.options['renderer'];
        var clazz = Map.getRendererClass(renderer);
        this._renderer = new clazz(this);
    };

    Map.prototype._getRenderer = function _getRenderer() {
        return this._renderer;
    };

    Map.prototype._loadAllLayers = function _loadAllLayers() {
        function loadLayer(layer) {
            if (layer) {
                layer.load();
            }
        }
        if (this._baseLayer) {
            this._baseLayer.load();
        }
        this._eachLayer(loadLayer, this.getLayers());
    };

    /**
     * Gets layers that fits for the filter
     * @param  {fn} filter - filter function
     * @return {Layer[]}
     * @private
     */


    Map.prototype._getLayers = function _getLayers(filter) {
        var layers = this._baseLayer ? [this._baseLayer].concat(this._layers) : this._layers;
        var result = [];
        for (var i = 0; i < layers.length; i++) {
            if (!filter || filter.call(this, layers[i])) {
                result.push(layers[i]);
            }
        }
        return result;
    };

    Map.prototype._eachLayer = function _eachLayer(fn) {
        if (arguments.length < 2) {
            return;
        }
        var layerLists = Array.prototype.slice.call(arguments, 1);
        if (layerLists && !Array.isArray(layerLists)) {
            layerLists = [layerLists];
        }
        var layers = [];
        for (var i = 0, len = layerLists.length; i < len; i++) {
            layers = layers.concat(layerLists[i]);
        }
        for (var j = 0, jlen = layers.length; j < jlen; j++) {
            fn.call(fn, layers[j]);
        }
    };

    //Check and reset map's status when map'sview is changed.


    Map.prototype._resetMapStatus = function _resetMapStatus() {
        var maxZoom = this.getMaxZoom(),
            minZoom = this.getMinZoom();
        var viewMaxZoom = this._view.getMaxZoom(),
            viewMinZoom = this._view.getMinZoom();
        if (!maxZoom || maxZoom === -1 || maxZoom > viewMaxZoom) {
            this.setMaxZoom(viewMaxZoom);
        }
        if (!minZoom || minZoom === -1 || minZoom < viewMinZoom) {
            this.setMinZoom(viewMinZoom);
        }
        maxZoom = this.getMaxZoom();
        minZoom = this.getMinZoom();
        if (maxZoom < minZoom) {
            this.setMaxZoom(minZoom);
        }
        if (!this._zoomLevel || this._zoomLevel > maxZoom) {
            this._zoomLevel = maxZoom;
        }
        if (this._zoomLevel < minZoom) {
            this._zoomLevel = minZoom;
        }
        delete this._prjCenter;
        var projection = this.getProjection();
        this._prjCenter = projection.project(this._center);
    };

    Map.prototype._getContainerDomSize = function _getContainerDomSize() {
        if (!this._containerDOM) {
            return null;
        }
        var containerDOM = this._containerDOM,
            width,
            height;
        if (!isNil(containerDOM.width) && !isNil(containerDOM.height)) {
            width = containerDOM.width;
            height = containerDOM.height;
            if (Browser$1.retina && containerDOM['layer']) {
                //is a canvas tile of CanvasTileLayer
                width /= 2;
                height /= 2;
            }
        } else if (!isNil(containerDOM.clientWidth) && !isNil(containerDOM.clientHeight)) {
            width = parseInt(containerDOM.clientWidth, 0);
            height = parseInt(containerDOM.clientHeight, 0);
        } else {
            throw new Error('can not get size of container');
        }
        return new Size(width, height);
    };

    Map.prototype._updateMapSize = function _updateMapSize(mSize) {
        this.width = mSize['width'];
        this.height = mSize['height'];
        this._getRenderer().updateMapSize(mSize);
        return this;
    };

    /**
     * Gets projected center of the map
     * @return {Coordinate}
     * @private
     */


    Map.prototype._getPrjCenter = function _getPrjCenter() {
        return this._prjCenter;
    };

    Map.prototype._setPrjCenter = function _setPrjCenter(pcenter) {
        this._prjCenter = pcenter;
    };

    Map.prototype._verifyExtent = function _verifyExtent(center) {
        if (!center) {
            return false;
        }
        var maxExt = this.getMaxExtent();
        if (!maxExt) {
            return true;
        }
        return maxExt.contains(center);
    };

    /**
     * Move map's center by pixels.
     * @param  {Point} pixel - pixels to move, the relation between value and direction is as:
     * -1,1 | 1,1
     * ------------
     *-1,-1 | 1,-1
     * @private
     * @returns {Coordinate} the new projected center.
     */


    Map.prototype._offsetCenterByPixel = function _offsetCenterByPixel(pixel) {
        var pos = new Point(this.width / 2 - pixel.x, this.height / 2 - pixel.y);
        var pCenter = this._containerPointToPrj(pos);
        this._setPrjCenter(pCenter);
        return pCenter;
    };

    /**
     * offset map platform panel.
     *
     * @param  {Point} offset - offset in pixel to move
     * @return {Map} this
     */
    /**
     * Gets map platform panel's current view point.
     * @return {Point}
     */


    Map.prototype.offsetPlatform = function offsetPlatform(offset) {
        if (!offset) {
            return this._mapViewPoint;
        } else {
            this._getRenderer().offsetPlatform(offset);
            this._mapViewPoint = this._mapViewPoint.add(offset);
            return this;
        }
    };

    Map.prototype._resetMapViewPoint = function _resetMapViewPoint() {
        this._mapViewPoint = new Point(0, 0);
    };

    /**
     * Get map's current resolution
     * @return {Number} resolution
     * @private
     */


    Map.prototype._getResolution = function _getResolution(zoom) {
        if (isNil(zoom)) {
            zoom = this.getZoom();
        }
        return this._view.getResolution(zoom);
    };

    Map.prototype._getResolutions = function _getResolutions() {
        return this._view.getResolutions();
    };

    /**
     * Converts the projected coordinate to a 2D point in the specific zoom
     * @param  {Coordinate} pCoord - projected Coordinate
     * @param  {Number} zoom   - zoom level
     * @return {Point} 2D point
     * @private
     */


    Map.prototype._prjToPoint = function _prjToPoint(pCoord, zoom) {
        zoom = isNil(zoom) ? this.getZoom() : zoom;
        return this._view.getTransformation().transform(pCoord, this._getResolution(zoom));
    };

    /**
     * Converts the 2D point to projected coordinate
     * @param  {Point} point - 2D point
     * @param  {Number} zoom   - zoom level
     * @return {Coordinate} projected coordinate
     * @private
     */


    Map.prototype._pointToPrj = function _pointToPrj(point, zoom) {
        zoom = isNil(zoom) ? this.getZoom() : zoom;
        return this._view.getTransformation().untransform(point, this._getResolution(zoom));
    };

    Map.prototype._pointToPoint = function _pointToPoint(point, zoom) {
        if (!isNil(zoom)) {
            return point.multi(this._getResolution(zoom) / this._getResolution(this.getZoom()));
        }
        return point;
    };

    /**
     * transform container point to geographical projected coordinate
     *
     * @param  {Point} containerPoint
     * @return {Coordinate}
     * @private
     */


    Map.prototype._containerPointToPrj = function _containerPointToPrj(containerPoint) {
        return this._pointToPrj(this._containerPointToPoint(containerPoint));
    };

    /**
     * transform view point to geographical projected coordinate
     * @param  {Point} viewPoint
     * @return {Coordinate}
     * @private
     */


    Map.prototype._viewPointToPrj = function _viewPointToPrj(viewPoint) {
        return this._containerPointToPrj(this.viewPointToContainerPoint(viewPoint));
    };

    /**
     * transform geographical projected coordinate to container point
     * @param  {Coordinate} pCoordinate
     * @return {Point}
     * @private
     */


    Map.prototype._prjToContainerPoint = function _prjToContainerPoint(pCoordinate) {
        return this._pointToContainerPoint(this._prjToPoint(pCoordinate));
    };

    /**
     * transform geographical projected coordinate to view point
     * @param  {Coordinate} pCoordinate
     * @return {Point}
     * @private
     */


    Map.prototype._prjToViewPoint = function _prjToViewPoint(pCoordinate) {
        var containerPoint = this._prjToContainerPoint(pCoordinate);
        return this._containerPointToViewPoint(containerPoint);
    };

    //destructive containerPointToViewPoint


    Map.prototype._containerPointToViewPoint = function _containerPointToViewPoint(containerPoint) {
        if (!containerPoint) {
            return null;
        }
        var platformOffset = this.offsetPlatform();
        return containerPoint._substract(platformOffset);
    };

    Map.prototype._pointToContainerPoint = function _pointToContainerPoint(point, zoom) {
        point = this._pointToPoint(point, zoom);
        var centerPoint = this._prjToPoint(this._getPrjCenter());
        return new Point(this.width / 2 + point.x - centerPoint.x, this.height / 2 + point.y - centerPoint.y);
    };

    Map.prototype._containerPointToPoint = function _containerPointToPoint(containerPoint, zoom) {
        var centerPoint = this._prjToPoint(this._getPrjCenter(), zoom),
            scale = !isNil(zoom) ? this._getResolution() / this._getResolution(zoom) : 1;

        return new Point(centerPoint.x + scale * (containerPoint.x - this.width / 2), centerPoint.y + scale * (containerPoint.y - this.height / 2));
    };

    Map.prototype._viewPointToPoint = function _viewPointToPoint(viewPoint) {
        return this._containerPointToPoint(this.viewPointToContainerPoint(viewPoint));
    };

    Map.prototype._pointToViewPoint = function _pointToViewPoint(point) {
        return this._prjToViewPoint(this._pointToPrj(point));
    };

    /* eslint no-extend-native: 0 */


    Map.prototype._callOnLoadHooks = function _callOnLoadHooks() {
        var proto = Map.prototype;
        for (var i = 0, len = proto._onLoadHooks.length; i < len; i++) {
            proto._onLoadHooks[i].call(this);
        }
    };

    return Map;
}(Handlerable(Eventable(Renderable(Class))));

Map.mergeOptions(options);

var MapAutoBorderPanningHandler = function (_Handler) {
    inherits(MapAutoBorderPanningHandler, _Handler);

    function MapAutoBorderPanningHandler(target) {
        classCallCheck(this, MapAutoBorderPanningHandler);

        //threshold to trigger panning, in px
        var _this = possibleConstructorReturn(this, _Handler.call(this, target));

        _this.threshold = 10;
        //number of px to move when panning is triggered
        _this.step = 4;
        return _this;
    }

    MapAutoBorderPanningHandler.prototype.addHooks = function addHooks() {
        this.dom = this.target._containerDOM;
        on(this.dom, 'mousemove', this._onMouseMove, this);
        on(this.dom, 'mouseout', this._onMouseOut, this);
    };

    MapAutoBorderPanningHandler.prototype.removeHooks = function removeHooks() {
        this._cancelPan();
        off(this.dom, 'mousemove', this._onMouseMove, this);
        off(this.dom, 'mouseout', this._onMouseOut, this);
    };

    MapAutoBorderPanningHandler.prototype._onMouseMove = function _onMouseMove(event) {
        var eventParam = this.target._parseEvent(event);
        var mousePos = eventParam['containerPoint'];
        var size = this.target.getSize();
        var tests = [mousePos.x, size['width'] - mousePos.x, mousePos.y, size['height'] - mousePos.y];

        var min = Math.min.apply(Math, tests),
            absMin = Math.abs(min);

        if (absMin === 0 || absMin > this.threshold) {
            this._cancelPan();
            return;
        }
        var step = this.step;
        var offset = new Point(0, 0);
        if (tests[0] === min) {
            offset.x = -step;
        } else if (tests[1] === min) {
            offset.x = step;
        }
        if (tests[2] === min) {
            offset.y = -step;
        } else if (tests[3] === min) {
            offset.y = step;
        }
        this._stepOffset = offset;
        this._pan();
    };

    MapAutoBorderPanningHandler.prototype._onMouseOut = function _onMouseOut() {
        this._cancelPan();
    };

    MapAutoBorderPanningHandler.prototype._cancelPan = function _cancelPan() {
        delete this._stepOffset;
        if (this._animationId) {
            cancelAnimFrame(this._animationId);
            delete this._animationId;
        }
    };

    MapAutoBorderPanningHandler.prototype._pan = function _pan() {
        if (this._stepOffset) {
            this.target.panBy(this._stepOffset, {
                'animation': false
            });
            this._animationId = requestAnimFrame(this._pan.bind(this));
        }
    };

    return MapAutoBorderPanningHandler;
}(Handler$1);

Map.mergeOptions({
    'autoBorderPanning': false
});

Map.addOnLoadHook('addHandler', 'autoBorderPanning', MapAutoBorderPanningHandler);

var MapDoubleClickZoomHandler = function (_Handler) {
    inherits(MapDoubleClickZoomHandler, _Handler);

    function MapDoubleClickZoomHandler() {
        classCallCheck(this, MapDoubleClickZoomHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapDoubleClickZoomHandler.prototype.addHooks = function addHooks() {
        this.target.on('_dblclick', this._onDoubleClick, this);
    };

    MapDoubleClickZoomHandler.prototype.removeHooks = function removeHooks() {
        this.target.off('_dblclick', this._onDoubleClick, this);
    };

    MapDoubleClickZoomHandler.prototype._onDoubleClick = function _onDoubleClick(param) {
        var map = this.target;
        if (map.options['doubleClickZoom']) {
            var oldZoom = map.getZoom(),
                zoom = param['domEvent']['shiftKey'] ? Math.ceil(oldZoom) - 1 : Math.floor(oldZoom) + 1;
            map._zoomAnimation(zoom, param['containerPoint']);
        }
    };

    return MapDoubleClickZoomHandler;
}(Handler$1);

Map.mergeOptions({
    'doubleClickZoom': true
});

Map.addOnLoadHook('addHandler', 'doubleClickZoom', MapDoubleClickZoomHandler);

var START_EVENTS = Browser$1.touch ? 'touchstart mousedown' : 'mousedown';
var MOVE_EVENTS = {
    mousedown: 'mousemove',
    touchstart: 'touchmove',
    pointerdown: 'touchmove',
    MSPointerDown: 'touchmove'
};
var END_EVENTS = {
    mousedown: 'mouseup',
    touchstart: 'touchend',
    pointerdown: 'touchend',
    MSPointerDown: 'touchend'
};

/**
 * Drag handler
 * @category handler
 * @protected
 * @extends Handler
 */

var DragHandler = function (_Handler) {
    inherits(DragHandler, _Handler);

    function DragHandler(dom, options) {
        classCallCheck(this, DragHandler);

        var _this = possibleConstructorReturn(this, _Handler.call(this, null));

        _this.dom = dom;
        _this.options = options;
        return _this;
    }

    DragHandler.prototype.enable = function enable() {
        if (!this.dom) {
            return;
        }
        on(this.dom, START_EVENTS, this.onMouseDown, this);
    };

    DragHandler.prototype.disable = function disable() {
        if (!this.dom) {
            return;
        }
        off(this.dom, START_EVENTS, this.onMouseDown);
    };

    DragHandler.prototype.onMouseDown = function onMouseDown(event) {
        if (isNumber(event.button) && event.button === 2) {
            //ignore right mouse down
            return;
        }
        if (this.options && this.options['cancelOn'] && this.options['cancelOn'](event) === true) {
            return;
        }
        var dom = this.dom;
        if (dom.setCapture) {
            dom.setCapture();
        } else if (window.captureEvents) {
            window.captureEvents(window['Event'].MOUSEMOVE | window['Event'].MOUSEUP);
        }
        dom['ondragstart'] = function () {
            return false;
        };
        this.moved = false;
        var actual = event.touches ? event.touches[0] : event;
        this.startPos = new Point(actual.clientX, actual.clientY);
        //2015-10-26 fuzhen 改为document, 解决鼠标移出地图容器后的不可控现象
        on(document, MOVE_EVENTS[event.type], this.onMouseMove, this);
        on(document, END_EVENTS[event.type], this.onMouseUp, this);
        this.fire('mousedown', {
            'domEvent': event,
            'mousePos': new Point(actual.clientX, actual.clientY)
        });
    };

    DragHandler.prototype.onMouseMove = function onMouseMove(event) {
        if (event.touches && event.touches.length > 1) {
            return;
        }
        var actual = event.touches ? event.touches[0] : event;

        var newPos = new Point(actual.clientX, actual.clientY),
            offset = newPos.substract(this.startPos);
        if (!offset.x && !offset.y) {
            return;
        }
        if (!this.moved) {
            this.fire('dragstart', {
                'domEvent': event,
                'mousePos': this.startPos.copy()
            });
            this.moved = true;
        } else {
            this.fire('dragging', {
                'domEvent': event,
                'mousePos': new Point(actual.clientX, actual.clientY)
            });
        }
    };

    DragHandler.prototype.onMouseUp = function onMouseUp(event) {
        var dom = this.dom;
        var actual = event.changedTouches ? event.changedTouches[0] : event;
        for (var i in MOVE_EVENTS) {
            off(document, MOVE_EVENTS[i], this.onMouseMove, this);
            off(document, END_EVENTS[i], this.onMouseUp, this);
        }
        if (dom['releaseCapture']) {
            dom['releaseCapture']();
        } else if (window.captureEvents) {
            window.captureEvents(window['Event'].MOUSEMOVE | window['Event'].MOUSEUP);
        }
        var param = {
            'domEvent': event
        };
        if (isNumber(actual.clientX)) {
            param['mousePos'] = new Point(parseInt(actual.clientX, 0), parseInt(actual.clientY, 0));
        }
        if (this.moved /* && this.moving*/) {
                this.fire('dragend', param);
            }

        this.fire('mouseup', param);
    };

    return DragHandler;
}(Handler$1);

var MapDragHandler = function (_Handler) {
    inherits(MapDragHandler, _Handler);

    function MapDragHandler() {
        classCallCheck(this, MapDragHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapDragHandler.prototype.addHooks = function addHooks() {
        var map = this.target;
        if (!map) {
            return;
        }
        var dom = map._panels.mapWrapper || map._containerDOM;
        this._dragHandler = new DragHandler(dom, {
            'cancelOn': this._cancelOn.bind(this)
        });
        this._dragHandler.on('mousedown', this._onMouseDown, this).on('dragstart', this._onDragStart, this).on('dragging', this._onDragging, this).on('dragend', this._onDragEnd, this).enable();
    };

    MapDragHandler.prototype.removeHooks = function removeHooks() {
        this._dragHandler.off('mousedown', this._onMouseDown, this).off('dragstart', this._onDragStart, this).off('dragging', this._onDragging, this).off('dragend', this._onDragEnd, this).disable();
        this._dragHandler.remove();
        delete this._dragHandler;
    };

    MapDragHandler.prototype._cancelOn = function _cancelOn(domEvent) {
        if (this._ignore(domEvent)) {
            return true;
        }
        return false;
    };

    MapDragHandler.prototype._ignore = function _ignore(param) {
        if (!param) {
            return false;
        }
        if (param.domEvent) {
            param = param.domEvent;
        }
        return this.target._ignoreEvent(param);
    };

    MapDragHandler.prototype._onMouseDown = function _onMouseDown(param) {
        if (this.target._panAnimating) {
            this.target._enablePanAnimation = false;
        }
        preventDefault(param['domEvent']);
    };

    MapDragHandler.prototype._onDragStart = function _onDragStart(param) {
        var map = this.target;
        this.startDragTime = now();
        var domOffset = map.offsetPlatform();
        this.startLeft = domOffset.x;
        this.startTop = domOffset.y;
        this.preX = param['mousePos'].x;
        this.preY = param['mousePos'].y;
        this.startX = this.preX;
        this.startY = this.preY;
        map.onMoveStart(param);
    };

    MapDragHandler.prototype._onDragging = function _onDragging(param) {
        //preventDefault(param['domEvent']);
        if (this.startLeft === undefined) {
            return;
        }
        var map = this.target;
        var mx = param['mousePos'].x,
            my = param['mousePos'].y;
        var nextLeft = this.startLeft + mx - this.startX;
        var nextTop = this.startTop + my - this.startY;
        var mapPos = map.offsetPlatform();
        var offset = new Point(nextLeft, nextTop)._substract(mapPos);
        map.offsetPlatform(offset);
        map._offsetCenterByPixel(offset);
        map.onMoving(param);
    };

    MapDragHandler.prototype._onDragEnd = function _onDragEnd(param) {
        //preventDefault(param['domEvent']);
        if (this.startLeft === undefined) {
            return;
        }
        var map = this.target;
        var t = now() - this.startDragTime;
        var domOffset = map.offsetPlatform();
        var xSpan = domOffset.x - this.startLeft;
        var ySpan = domOffset.y - this.startTop;

        delete this.startLeft;
        delete this.startTop;
        delete this.preX;
        delete this.preY;
        delete this.startX;
        delete this.startY;

        if (t < 280 && Math.abs(ySpan) + Math.abs(xSpan) > 5) {
            // var distance = new Point(xSpan * Math.ceil(500 / t), ySpan * Math.ceil(500 / t))._multi(0.5);
            var distance = new Point(xSpan, ySpan);
            t = 5 * t * (Math.abs(distance.x) + Math.abs(distance.y)) / 500;
            map._panAnimation(distance, t);
        } else {
            map.onMoveEnd(param);
        }
    };

    return MapDragHandler;
}(Handler$1);

Map.mergeOptions({
    'draggable': true
});

Map.addOnLoadHook('addHandler', 'draggable', MapDragHandler);

//注册的symbolizer
var registerSymbolizers = [StrokeAndFillSymbolizer, ImageMarkerSymbolizer, VectorPathMarkerSymbolizer, VectorMarkerSymbolizer, TextMarkerSymbolizer];

/**
 * @classdesc
 * Painter class for all geometry types except the collection types.
 * @class
 * @protected
 * @param {Geometry} geometry - geometry to paint
 */

var Painter = function (_Class) {
    inherits(Painter, _Class);

    function Painter(geometry) {
        classCallCheck(this, Painter);

        var _this = possibleConstructorReturn(this, _Class.call(this));

        _this.geometry = geometry;
        _this.symbolizers = _this._createSymbolizers();
        return _this;
    }

    Painter.prototype.getMap = function getMap() {
        return this.geometry.getMap();
    };

    /**
     * 构造symbolizers
     * @return {*} [description]
     */


    Painter.prototype._createSymbolizers = function _createSymbolizers() {
        var geoSymbol = this.getSymbol(),
            symbolizers = [],
            regSymbolizers = registerSymbolizers,
            symbols = geoSymbol;
        if (!Array.isArray(geoSymbol)) {
            symbols = [geoSymbol];
        }
        var symbol, symbolizer;
        for (var ii = symbols.length - 1; ii >= 0; ii--) {
            symbol = symbols[ii];
            for (var i = regSymbolizers.length - 1; i >= 0; i--) {
                if (regSymbolizers[i].test(symbol, this.geometry)) {
                    symbolizer = new regSymbolizers[i](symbol, this.geometry, this);
                    symbolizers.push(symbolizer);
                    if (symbolizer instanceof PointSymbolizer) {
                        this._hasPointSymbolizer = true;
                    }
                }
            }
        }
        if (symbolizers.length === 0) {
            if (console) {
                console.warn('invalid symbol for geometry(' + (this.geometry ? this.geometry.getType() + (this.geometry.getId() ? ':' + this.geometry.getId() : '') : '') + ') to draw : ' + JSON.stringify(geoSymbol));
            }
            // throw new Error('no symbolizers can be created to draw, check the validity of the symbol.');
        }
        this._debugSymbolizer = new DebugSymbolizer(symbol, this.geometry, this);
        this._hasShadow = this.geometry.options['shadowBlur'] > 0;
        return symbolizers;
    };

    Painter.prototype.hasPointSymbolizer = function hasPointSymbolizer() {
        return this._hasPointSymbolizer;
    };

    /**
     * for point symbolizers
     * @return {Point[]} points to render
     */


    Painter.prototype.getRenderPoints = function getRenderPoints(placement) {
        if (!this._renderPoints) {
            this._renderPoints = {};
        }
        if (!placement) {
            placement = 'point';
        }
        if (!this._renderPoints[placement]) {
            this._renderPoints[placement] = this.geometry._getRenderPoints(placement);
        }
        return this._renderPoints[placement];
    };

    /**
     * for strokeAndFillSymbolizer
     * @return {Object[]} resources to render vector
     */


    Painter.prototype.getPaintParams = function getPaintParams(dx, dy) {
        if (!this._paintParams) {
            //render resources geometry returned are based on 2d points.
            this._paintParams = this.geometry._getPaintParams();
        }
        if (!this._paintParams) {
            return null;
        }
        var map = this.getMap();
        var maxZoom = map.getMaxZoom();
        var zoomScale = map.getScale();
        var layerNorthWest = this.geometry.getLayer()._getRenderer()._northWest;
        var layerPoint = map._pointToContainerPoint(layerNorthWest),
            paintParams = this._paintParams,
            tPaintParams = [],
            // transformed params
        //refer to Geometry.Canvas
        points = paintParams[0];
        var containerPoints;
        //convert view points to container points needed by canvas
        if (Array.isArray(points)) {
            containerPoints = mapArrayRecursively(points, function (point) {
                var p = map._pointToContainerPoint(point, maxZoom)._substract(layerPoint);
                if (dx || dy) {
                    p._add(dx, dy);
                }
                return p;
            });
        } else if (points instanceof Point) {
            // containerPoints = points.substract(layerPoint);
            containerPoints = map._pointToContainerPoint(points, maxZoom)._substract(layerPoint);
            if (dx || dy) {
                containerPoints._add(dx, dy);
            }
        }
        tPaintParams.push(containerPoints);
        for (var i = 1, len = paintParams.length; i < len; i++) {
            if (isNumber(paintParams[i]) || paintParams[i] instanceof Size) {
                if (isNumber(paintParams[i])) {
                    tPaintParams.push(paintParams[i] / zoomScale);
                } else {
                    tPaintParams.push(paintParams[i].multi(1 / zoomScale));
                }
            } else {
                tPaintParams.push(paintParams[i]);
            }
        }
        return tPaintParams;
    };

    Painter.prototype.getSymbol = function getSymbol() {
        return this.geometry._getInternalSymbol();
    };

    /**
     * 绘制图形
     */


    Painter.prototype.paint = function paint() {
        var contexts = this.geometry.getLayer()._getRenderer().getPaintContext();
        if (!contexts || !this.symbolizers) {
            return;
        }

        this.symbolize(contexts);
    };

    Painter.prototype.symbolize = function symbolize(contexts) {
        this._prepareShadow(contexts[0]);
        for (var i = this.symbolizers.length - 1; i >= 0; i--) {
            this.symbolizers[i].symbolize.apply(this.symbolizers[i], contexts);
        }
        this._painted = true;
        this._debugSymbolizer.symbolize.apply(this._debugSymbolizer, contexts);
    };

    Painter.prototype.getSprite = function getSprite(resources, canvasClass) {
        var _this2 = this;

        if (this.geometry.type !== 'Point') {
            return null;
        }
        this._genSprite = true;
        if (!this._sprite && this.symbolizers.length > 0) {
            var bak;

            (function () {
                var extent = new PointExtent();
                _this2.symbolizers.forEach(function (s) {
                    var markerExtent = s.getMarkerExtent(resources);
                    extent._combine(markerExtent);
                });
                var origin = extent.getMin().multi(-1);
                var clazz = canvasClass || (_this2.getMap() ? _this2.getMap().CanvasClass : null);
                var canvas = Canvas.createCanvas(extent.getWidth(), extent.getHeight(), clazz);

                if (_this2._renderPoints) {
                    bak = _this2._renderPoints;
                }
                var contexts = [canvas.getContext('2d'), resources];
                _this2._prepareShadow(canvas.getContext('2d'));
                for (var i = _this2.symbolizers.length - 1; i >= 0; i--) {
                    var dxdy = _this2.symbolizers[i].getDxDy();
                    _this2._renderPoints = {
                        'point': [[origin.add(dxdy)]]
                    };

                    _this2.symbolizers[i].symbolize.apply(_this2.symbolizers[i], contexts);
                }
                if (bak) {
                    _this2._renderPoints = bak;
                }
                _this2._sprite = {
                    'canvas': canvas,
                    'offset': extent.getCenter()
                };
            })();
        }
        this._genSprite = false;
        return this._sprite;
    };

    Painter.prototype.isSpriting = function isSpriting() {
        return this._genSprite;
    };

    Painter.prototype._prepareShadow = function _prepareShadow(ctx) {
        if (this._hasShadow) {
            ctx.shadowBlur = this.geometry.options['shadowBlur'];
            ctx.shadowColor = this.geometry.options['shadowColor'];
        } else if (ctx.shadowBlur) {
            ctx.shadowBlur = null;
            ctx.shadowColor = null;
        }
    };

    Painter.prototype._eachSymbolizer = function _eachSymbolizer(fn, context) {
        if (!this.symbolizers) {
            return;
        }
        if (!context) {
            context = this;
        }
        for (var i = this.symbolizers.length - 1; i >= 0; i--) {
            fn.apply(context, [this.symbolizers[i]]);
        }
    };

    //需要实现的接口方法


    Painter.prototype.get2DExtent = function get2DExtent(resources) {
        if (!this._extent2D) {
            if (this.symbolizers) {
                var _extent2D = new PointExtent();
                var len = this.symbolizers.length - 1;
                for (var i = len; i >= 0; i--) {
                    _extent2D._combine(this.symbolizers[i].get2DExtent(resources));
                }
                this._extent2D = _extent2D;
            }
        }
        return this._extent2D;
    };

    Painter.prototype.getContainerExtent = function getContainerExtent() {
        var map = this.getMap(),
            extent2D = this.get2DExtent(this.resources);
        var containerExtent = new PointExtent(map._pointToContainerPoint(extent2D.getMin()), map._pointToContainerPoint(extent2D.getMax()));
        return containerExtent;
    };

    Painter.prototype.setZIndex = function setZIndex(change) {
        this._eachSymbolizer(function (symbolizer) {
            symbolizer.setZIndex(change);
        });
    };

    Painter.prototype.show = function show() {
        if (!this._painted) {
            var layer = this.geometry.getLayer();
            if (!layer.isCanvasRender()) {
                this.paint();
            }
        } else {
            this.removeCache();
            this._eachSymbolizer(function (symbolizer) {
                symbolizer.show();
            });
        }
    };

    Painter.prototype.hide = function hide() {
        this._eachSymbolizer(function (symbolizer) {
            symbolizer.hide();
        });
    };

    Painter.prototype.repaint = function repaint() {
        this.removeCache();
    };

    /**
     * symbol发生变化后, 刷新symbol
     */


    Painter.prototype.refreshSymbol = function refreshSymbol() {
        this.removeCache();
        this._removeSymbolizers();
        this.symbolizers = this._createSymbolizers();
        // if (!this.getMap()) {
        //     return;
        // }
        // var layer = this.geometry.getLayer();
        // if (this.geometry.isVisible() && layer.addGeometry) {
        //     if (!layer.isCanvasRender()) {
        //         this.paint();
        //     }
        // }
    };

    Painter.prototype.remove = function remove() {
        this.removeCache();
        this._removeSymbolizers();
    };

    Painter.prototype._removeSymbolizers = function _removeSymbolizers() {
        this._eachSymbolizer(function (symbolizer) {
            delete symbolizer.painter;
            symbolizer.remove();
        });
        delete this.symbolizers;
    };

    /**
     * delete painter's caches
     */


    Painter.prototype.removeCache = function removeCache() {
        delete this._renderPoints;
        delete this._paintParams;
        delete this._sprite;
        this.removeZoomCache();
    };

    Painter.prototype.removeZoomCache = function removeZoomCache() {
        if (this.geometry._simplified) {
            // remove cached points if the geometry is simplified on the zoom.
            delete this._paintParams;
        }
        delete this._extent2D;
    };

    return Painter;
}(Class);

/**
 * @classdesc
 * Painter for collection type geometries
 * @class
 * @protected
 * @param {GeometryCollection} geometry - geometry to paint
 */

var CollectionPainter = function (_Class) {
    inherits(CollectionPainter, _Class);

    function CollectionPainter(geometry) {
        classCallCheck(this, CollectionPainter);

        var _this = possibleConstructorReturn(this, _Class.call(this));

        _this.geometry = geometry;
        return _this;
    }

    CollectionPainter.prototype._eachPainter = function _eachPainter(fn) {
        var geometries = this.geometry.getGeometries();
        var painter;
        for (var i = 0, len = geometries.length; i < len; i++) {
            painter = geometries[i]._getPainter();
            if (!painter) {
                continue;
            }
            if (painter) {
                if (fn.call(this, painter) === false) {
                    break;
                }
            }
        }
    };

    CollectionPainter.prototype.paint = function paint() {
        if (!this.geometry) {
            return;
        }
        this._eachPainter(function (painter) {
            painter.paint();
        });
    };

    CollectionPainter.prototype.get2DExtent = function get2DExtent(resources) {
        var extent = new PointExtent();
        this._eachPainter(function (painter) {
            extent = extent.combine(painter.get2DExtent(resources));
        });
        return extent;
    };

    CollectionPainter.prototype.remove = function remove() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.remove.apply(painter, args);
        });
    };

    CollectionPainter.prototype.setZIndex = function setZIndex() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.setZIndex.apply(painter, args);
        });
    };

    CollectionPainter.prototype.show = function show() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.show.apply(painter, args);
        });
    };

    CollectionPainter.prototype.hide = function hide() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.hide.apply(painter, args);
        });
    };

    CollectionPainter.prototype.repaint = function repaint() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.repaint.apply(painter, args);
        });
    };

    CollectionPainter.prototype.refreshSymbol = function refreshSymbol() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.refreshSymbol.apply(painter, args);
        });
    };

    CollectionPainter.prototype.hasPointSymbolizer = function hasPointSymbolizer() {
        var result = false;
        this._eachPainter(function (painter) {
            if (painter.hasPointSymbolizer()) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    };

    CollectionPainter.prototype.removeZoomCache = function removeZoomCache() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.removeZoomCache.apply(painter, args);
        });
    };

    return CollectionPainter;
}(Class);

/**
 * @property {Object} options                       - geometry options
 * @property {Boolean} [options.id=null]            - id of the geometry
 * @property {Boolean} [options.visible=true]       - whether the geometry is visible.
 * @property {Boolean} [options.editable=true]      - whether the geometry can be edited.
 * @property {String} [options.cursor=null]         - cursor style when mouseover the geometry, same as the definition in CSS.
 * @property {Number} [options.shadowBlur=0]        - level of the shadow around the geometry, see [MDN's explanation]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur}
 * @property {String} [options.shadowColor=black]   - color of the shadow around the geometry, a CSS style color
 * @property {String} [options.measure=EPSG:4326]   - the measure code for the geometry, defines {@tutorial measureGeometry how it can be measured}.
 * @property {Boolean} [options.draggable=false]    - whether the geometry can be dragged.
 * @property {Boolean} [options.dragShadow=false]   - if true, during geometry dragging, a shadow will be dragged before geometry was moved.
 * @property {Boolean} [options.dragOnAxis=null]    - if set, geometry can only be dragged along the specified axis, possible values: x, y
 * @memberOf Geometry
 * @instance
 */
var options$3 = {
    'id': null,
    'visible': true,
    'editable': true,
    'cursor': null,
    'shadowBlur': 0,
    'shadowColor': 'black',
    'measure': 'EPSG:4326' // BAIDU, IDENTITY
};

/**
 * Base class for all the geometries. <br/>
 * It defines common methods that all the geometry classes share. <br>
 * It is abstract and not intended to be instantiated but extended.
 *
 * @category geometry
 * @abstract
 * @extends Class
 * @mixes Eventable
 * @mixes Handlerable
 * @mixes JSONAble
 * @mixes ui.Menuable
 */

var Geometry = function (_JSONAble) {
    inherits(Geometry, _JSONAble);

    function Geometry(options) {
        classCallCheck(this, Geometry);

        var opts = extend({}, options);
        var symbol = opts['symbol'];
        var properties = opts['properties'];
        var id = opts['id'];
        delete opts['symbol'];
        delete opts['id'];
        delete opts['properties'];

        var _this = possibleConstructorReturn(this, _JSONAble.call(this, opts));

        if (symbol) {
            _this.setSymbol(symbol);
        }
        if (properties) {
            _this.setProperties(properties);
        }
        if (!isNil(id)) {
            _this.setId(id);
        }
        _this._zIndex = 0;
        return _this;
    }

    /**
     * Returns the first coordinate of the geometry.
     *
     * @return {Coordinate} First Coordinate
     */


    Geometry.prototype.getFirstCoordinate = function getFirstCoordinate() {
        if (this.type === 'GeometryCollection') {
            var geometries = this.getGeometries();
            if (!geometries || !isArrayHasData(geometries)) {
                return null;
            }
            return geometries[0].getFirstCoordinate();
        }
        var coordinates = this.getCoordinates();
        if (!Array.isArray(coordinates)) {
            return coordinates;
        }
        var first = coordinates;
        do {
            first = first[0];
        } while (Array.isArray(first));
        return first;
    };

    /**
     * Returns the last coordinate of the geometry.
     *
     * @return {Coordinate} Last Coordinate
     */


    Geometry.prototype.getLastCoordinate = function getLastCoordinate() {
        if (this.type === 'GeometryCollection') {
            var geometries = this.getGeometries();
            if (!geometries || !isArrayHasData(geometries)) {
                return null;
            }
            return geometries[geometries.length - 1].getLastCoordinate();
        }
        var coordinates = this.getCoordinates();
        if (!Array.isArray(coordinates)) {
            return coordinates;
        }
        var last = coordinates;
        do {
            last = last[last.length - 1];
        } while (Array.isArray(last));
        return last;
    };

    /**
     * Adds the geometry to a layer
     * @param {Layer} layer    - layer add to
     * @param {Boolean} [fitview=false] - automatically set the map to a fit center and zoom for the geometry
     * @return {Geometry} this
     * @fires Geometry#add
     */


    Geometry.prototype.addTo = function addTo(layer, fitview) {
        layer.addGeometry(this, fitview);
        return this;
    };

    /**
     * Get the layer which this geometry added to.
     * @returns {Layer} - layer added to
     */


    Geometry.prototype.getLayer = function getLayer() {
        if (!this._layer) {
            return null;
        }
        return this._layer;
    };

    /**
     * Get the map which this geometry added to
     * @returns {Map} - map added to
     */


    Geometry.prototype.getMap = function getMap() {
        if (!this._layer) {
            return null;
        }
        return this._layer.getMap();
    };

    /**
     * Gets geometry's id. Id is set by setId or constructor options.
     * @returns {String|Number} geometry的id
     */


    Geometry.prototype.getId = function getId() {
        return this._id;
    };

    /**
     * Set geometry's id.
     * @param {String} id - new id
     * @returns {Geometry} this
     * @fires Geometry#idchange
     */


    Geometry.prototype.setId = function setId(id) {
        var oldId = this.getId();
        this._id = id;
        /**
         * idchange event.
         *
         * @event Geometry#idchange
         * @type {Object}
         * @property {String} type - idchange
         * @property {Geometry} target - the geometry fires the event
         * @property {String|Number} old        - value of the old id
         * @property {String|Number} new        - value of the new id
         */
        this._fireEvent('idchange', {
            'old': oldId,
            'new': id
        });

        return this;
    };

    /**
     * Get geometry's properties. Defined by GeoJSON as [feature's properties]{@link http://geojson.org/geojson-spec.html#feature-objects}.
     *
     * @returns {Object} properties
     */


    Geometry.prototype.getProperties = function getProperties() {
        if (!this.properties) {
            if (this._getParent()) {
                return this._getParent().getProperties();
            }
            return null;
        }
        return this.properties;
    };

    /**
     * Set a new properties to geometry.
     * @param {Object} properties - new properties
     * @returns {Geometry} this
     * @fires Geometry#propertieschange
     */


    Geometry.prototype.setProperties = function setProperties(properties) {
        var old = this.properties;
        this.properties = isObject(properties) ? extend({}, properties) : properties;
        /**
         * propertieschange event, thrown when geometry's properties is changed.
         *
         * @event Geometry#propertieschange
         * @type {Object}
         * @property {String} type - propertieschange
         * @property {Geometry} target - the geometry fires the event
         * @property {String|Number} old        - value of the old properties
         * @property {String|Number} new        - value of the new properties
         */
        this._fireEvent('propertieschange', {
            'old': old,
            'new': properties
        });

        return this;
    };

    /**
     * Get type of the geometry, e.g. "Point", "LineString"
     * @returns {String} type of the geometry
     */


    Geometry.prototype.getType = function getType() {
        return this.type;
    };

    /**
     * Get symbol of the geometry
     * @returns {Object} geometry's symbol
     */


    Geometry.prototype.getSymbol = function getSymbol() {
        var s = this._symbol;
        if (s) {
            if (!Array.isArray(s)) {
                return extend({}, s);
            } else {
                return extendSymbol(s);
            }
        }
        return null;
    };

    /**
     * Set a new symbol to style the geometry.
     * @param {Object} symbol - new symbol
     * @see {@tutorial symbol Style a geometry with symbols}
     * @return {Geometry} this
     * @fires Geometry#symbolchange
     */


    Geometry.prototype.setSymbol = function setSymbol(symbol) {
        this._symbol = this._prepareSymbol(symbol);
        this.onSymbolChanged();
        return this;
    };

    /**
     * Update geometry's current symbol.
     *
     * @param  {Object} props - symbol properties to update
     * @return {Geometry} this
     * @fires Geometry#symbolchange
     * @example
     * var marker = new Marker([0, 0], {
     *    symbol : {
     *       markerType : 'ellipse',
     *       markerWidth : 20,
     *       markerHeight : 30
     *    }
     * });
     * // update symbol's markerWidth to 40
     * marker.updateSymbol({
     *     markerWidth : 40
     * });
     */


    Geometry.prototype.updateSymbol = function updateSymbol(props) {
        if (!props) {
            return this;
        }
        var s = this.getSymbol();
        if (s) {
            s = extendSymbol(s, props);
        } else {
            s = extendSymbol(this._getInternalSymbol(), props);
        }
        return this.setSymbol(s);
    };

    /**
     * Get the geographical center of the geometry.
     *
     * @returns {Coordinate}
     */


    Geometry.prototype.getCenter = function getCenter() {
        return this._computeCenter(this._getMeasurer()).copy();
    };

    /**
     * Get the geometry's geographical extent
     *
     * @returns {Extent} geometry's extent
     */


    Geometry.prototype.getExtent = function getExtent() {
        var prjExt = this._getPrjExtent();
        if (prjExt) {
            var p = this._getProjection();
            return new Extent(p.unproject(new Coordinate(prjExt['xmin'], prjExt['ymin'])), p.unproject(new Coordinate(prjExt['xmax'], prjExt['ymax'])));
        } else {
            return this._computeExtent(this._getMeasurer());
        }
    };

    /**
     * Get pixel size of the geometry, which may vary in different zoom levels.
     *
     * @returns {Size}
     */


    Geometry.prototype.getSize = function getSize() {
        var map = this.getMap();
        if (!map) {
            return null;
        }
        var pxExtent = this._getPainter().get2DExtent();
        return pxExtent.getSize();
    };

    /**
     * Whehter the geometry contains the input container point.
     *
     * @param  {Point|Coordinate} point - input container point or coordinate
     * @param  {Number} [t=undefined] - tolerance in pixel
     * @return {Boolean}
     * @example
     * var circle = new Circle([0, 0], 1000)
     *     .addTo(layer);
     * var contains = circle.containsPoint([400, 300]);
     */


    Geometry.prototype.containsPoint = function containsPoint(containerPoint, t) {
        if (!this.getMap()) {
            throw new Error('The geometry is required to be added on a map to perform "containsPoint".');
        }
        if (containerPoint instanceof Coordinate) {
            containerPoint = this.getMap().coordinateToContainerPoint(containerPoint);
        }
        return this._containsPoint(this.getMap()._containerPointToPoint(new Point(containerPoint)), t);
    };

    /**
     * Show the geometry.
     *
     * @return {Geometry} this
     * @fires Geometry#show
     */


    Geometry.prototype.show = function show() {
        this.options['visible'] = true;
        if (this.getMap()) {
            var painter = this._getPainter();
            if (painter) {
                painter.show();
            }
            /**
             * show event
             *
             * @event Geometry#show
             * @type {Object}
             * @property {String} type - show
             * @property {Geometry} target - the geometry fires the event
             */
            this._fireEvent('show');
        }
        return this;
    };

    /**
     * Hide the geometry
     *
     * @return {Geometry} this
     * @fires Geometry#hide
     */


    Geometry.prototype.hide = function hide() {
        this.options['visible'] = false;
        if (this.getMap()) {
            this.onHide();
            var painter = this._getPainter();
            if (painter) {
                painter.hide();
            }
            /**
             * hide event
             *
             * @event Geometry#hide
             * @type {Object}
             * @property {String} type - hide
             * @property {Geometry} target - the geometry fires the event
             */
            this._fireEvent('hide');
        }
        return this;
    };

    /**
     * Whether the geometry is visible
     *
     * @returns {Boolean}
     */


    Geometry.prototype.isVisible = function isVisible() {
        if (!this.options['visible']) {
            return false;
        }
        var symbol = this._getInternalSymbol();
        if (!symbol) {
            return true;
        }
        if (Array.isArray(symbol)) {
            if (symbol.length === 0) {
                return true;
            }
            for (var i = 0, len = symbol.length; i < len; i++) {
                if (isNil(symbol[i]['opacity']) || symbol[i]['opacity'] > 0) {
                    return true;
                }
            }
            return false;
        } else {
            return isNil(symbol['opacity']) || isNumber(symbol['opacity']) && symbol['opacity'] > 0;
        }
    };

    /**
     * Get zIndex of the geometry, default is 0
     * @return {Number} zIndex
     */


    Geometry.prototype.getZIndex = function getZIndex() {
        return this._zIndex;
    };

    /**
     * Set a new zIndex to Geometry and fire zindexchange event (will cause layer to sort geometries and render)
     * @param {Number} zIndex - new zIndex
     * @return {Geometry} this
     * @fires Geometry#zindexchange
     */


    Geometry.prototype.setZIndex = function setZIndex(zIndex) {
        var old = this._zIndex;
        this._zIndex = zIndex;
        /**
         * zindexchange event, fired when geometry's zIndex is changed.
         *
         * @event Geometry#zindexchange
         * @type {Object}
         * @property {String} type - zindexchange
         * @property {Geometry} target - the geometry fires the event
         * @property {Number} old        - old zIndex
         * @property {Number} new        - new zIndex
         */
        this._fireEvent('zindexchange', {
            'old': old,
            'new': zIndex
        });

        return this;
    };

    /**
     * Only set a new zIndex to Geometry without firing zindexchange event. <br>
     * Can be useful to improve perf when a lot of geometries' zIndex need to be updated. <br>
     * When updated N geometries, You can use setZIndexSilently with (N-1) geometries and use setZIndex with the last geometry for layer to sort and render.
     * @param {Number} zIndex - new zIndex
     * @return {Geometry} this
     */


    Geometry.prototype.setZIndexSilently = function setZIndexSilently(zIndex) {
        this._zIndex = zIndex;
        return this;
    };

    /**
     * Bring the geometry on the top
     * @return {Geometry} this
     * @fires Geometry#zindexchange
     */


    Geometry.prototype.bringToFront = function bringToFront() {
        var layer = this.getLayer();
        if (!layer || !layer.getLastGeometry) {
            return this;
        }
        var topZ = layer.getLastGeometry().getZIndex();
        this.setZIndex(topZ + 1);
        return this;
    };

    /**
     * Bring the geometry to the back
     * @return {Geometry} this
     * @fires Geometry#zindexchange
     */


    Geometry.prototype.bringToBack = function bringToBack() {
        var layer = this.getLayer();
        if (!layer || !layer.getFirstGeometry) {
            return this;
        }
        var bottomZ = layer.getFirstGeometry().getZIndex();
        this.setZIndex(bottomZ - 1);
        return this;
    };

    /**
     * Translate or move the geometry by the given offset.
     *
     * @param  {Coordinate} offset - translate offset
     * @return {Geometry} this
     * @fires Geometry#positionchange
     * @fires Geometry#shapechange
     */


    Geometry.prototype.translate = function translate(offset) {
        if (!offset) {
            return this;
        }
        offset = new Coordinate(offset);
        if (offset.x === 0 && offset.y === 0) {
            return this;
        }
        var coordinates = this.getCoordinates();
        if (coordinates) {
            if (Array.isArray(coordinates)) {
                var translated = mapArrayRecursively(coordinates, function (coord) {
                    return coord.add(offset);
                });
                this.setCoordinates(translated);
            } else {
                this.setCoordinates(coordinates.add(offset));
            }
        }
        return this;
    };

    /**
     * Flash the geometry, show and hide by certain internal for times of count.
     *
     * @param {Number} [interval=100]     - interval of flash, in millisecond (ms)
     * @param {Number} [count=4]          - flash times
     * @param {Function} [cb=null]        - callback function when flash ended
     * @param {*} [context=null]          - callback context
     * @return {Geometry} this
     */


    Geometry.prototype.flash = function flash(interval, count, cb, context) {
        if (!interval) {
            interval = 100;
        }
        if (!count) {
            count = 4;
        }
        var me = this;
        count *= 2;
        if (this._flashTimeout) {
            clearTimeout(this._flashTimeout);
        }

        function flashGeo() {
            if (count === 0) {
                me.show();
                if (cb) {
                    if (context) {
                        cb.call(context);
                    } else {
                        cb();
                    }
                }
                return;
            }

            if (count % 2 === 0) {
                me.hide();
            } else {
                me.show();
            }
            count--;
            me._flashTimeout = setTimeout(flashGeo, interval);
        }
        this._flashTimeout = setTimeout(flashGeo, interval);
        return this;
    };

    /**
     * Returns a copy of the geometry without the event listeners.
     * @returns {Geometry} copy
     */


    Geometry.prototype.copy = function copy() {
        var json = this.toJSON();
        var ret = Geometry.fromJSON(json);
        //restore visibility
        ret.options['visible'] = true;
        return ret;
    };

    /**
     * remove itself from the layer if any.
     * @returns {Geometry} this
     * @fires Geometry#removestart
     * @fires Geometry#remove
     */


    Geometry.prototype.remove = function remove() {
        var layer = this.getLayer();
        if (!layer) {
            return this;
        }
        /**
         * removestart event.
         *
         * @event Geometry#removestart
         * @type {Object}
         * @property {String} type - removestart
         * @property {Geometry} target - the geometry fires the event
         */
        this._fireEvent('removestart');

        this._unbind();
        /**
         * removeend event.
         *
         * @event Geometry#removeend
         * @type {Object}
         * @property {String} type - removeend
         * @property {Geometry} target - the geometry fires the event
         */
        this._fireEvent('removeend');
        /**
         * remove event.
         *
         * @event Geometry#remove
         * @type {Object}
         * @property {String} type - remove
         * @property {Geometry} target - the geometry fires the event
         */
        this._fireEvent('remove');
        return this;
    };

    /**
     * Exports [geometry]{@link http://geojson.org/geojson-spec.html#feature-objects} out of a GeoJSON feature.
     * @return {Object} GeoJSON Geometry
     */


    Geometry.prototype.toGeoJSONGeometry = function toGeoJSONGeometry() {
        var gJson = this._exportGeoJSONGeometry();
        return gJson;
    };

    /**
     * Exports a GeoJSON feature.
     * @param {Object} [opts=null]              - export options
     * @param {Boolean} [opts.geometry=true]    - whether export geometry
     * @param {Boolean} [opts.properties=true]  - whether export properties
     * @returns {Object} GeoJSON Feature
     */


    Geometry.prototype.toGeoJSON = function toGeoJSON(opts) {
        if (!opts) {
            opts = {};
        }
        var feature = {
            'type': 'Feature',
            'geometry': null
        };
        if (isNil(opts['geometry']) || opts['geometry']) {
            var geoJSON = this._exportGeoJSONGeometry();
            feature['geometry'] = geoJSON;
        }
        var id = this.getId();
        if (!isNil(id)) {
            feature['id'] = id;
        }
        var properties;
        if (isNil(opts['properties']) || opts['properties']) {
            properties = this._exportProperties();
        }
        feature['properties'] = properties;
        return feature;
    };

    /**
     * Export a profile json out of the geometry. <br>
     * Besides exporting the feature object, a profile json also contains symbol, construct options and infowindow info.<br>
     * The profile json can be stored somewhere else and be used to reproduce the geometry later.<br>
     * Due to the problem of serialization for functions, event listeners and contextmenu are not included in profile json.
     * @example
     *     // an example of a profile json.
     * var profile = {
            "feature": {
                  "type": "Feature",
                  "id" : "point1",
                  "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                  "properties": {"prop0": "value0"}
            },
            //construct options.
            "options":{
                "draggable" : true
            },
            //symbol
            "symbol":{
                "markerFile"  : "http://foo.com/icon.png",
                "markerWidth" : 20,
                "markerHeight": 20
            },
            //infowindow info
            "infowindow" : {
                "options" : {
                    "style" : "black"
                },
                "title" : "this is a infowindow title",
                "content" : "this is a infowindow content"
            }
        };
     * @param {Object}  [options=null]          - export options
     * @param {Boolean} [opts.geometry=true]    - whether export feature's geometry
     * @param {Boolean} [opts.properties=true]  - whether export feature's properties
     * @param {Boolean} [opts.options=true]     - whether export construct options
     * @param {Boolean} [opts.symbol=true]      - whether export symbol
     * @param {Boolean} [opts.infoWindow=true]  - whether export infowindow
     * @return {Object} profile json object
     */


    Geometry.prototype.toJSON = function toJSON(options) {
        //一个Graphic的profile
        /*
            //因为响应函数无法被序列化, 所以menu, 事件listener等无法被包含在graphic中
        }*/
        if (!options) {
            options = {};
        }
        var json = this._toJSON(options);
        var other = this._exportGraphicOptions(options);
        extend(json, other);
        return json;
    };

    /**
     * Get the geographic length of the geometry.
     * @returns {Number} geographic length, unit is meter
     */


    Geometry.prototype.getLength = function getLength() {
        return this._computeGeodesicLength(this._getMeasurer());
    };

    /**
     * Get the geographic area of the geometry.
     * @returns {Number} geographic area, unit is sq.meter
     */


    Geometry.prototype.getArea = function getArea() {
        return this._computeGeodesicArea(this._getMeasurer());
    };

    /**
     * Get the connect points for [ConnectorLine]{@link ConnectorLine}
     * @return {Coordinate[]} connect points
     * @private
     */


    Geometry.prototype._getConnectPoints = function _getConnectPoints() {
        return [this.getCenter()];
    };

    //options initializing


    Geometry.prototype._initOptions = function _initOptions(options) {
        var opts = extend({}, options);
        var symbol = opts['symbol'];
        var properties = opts['properties'];
        var id = opts['id'];
        delete opts['symbol'];
        delete opts['id'];
        delete opts['properties'];
        this.setOptions(opts);
        if (symbol) {
            this.setSymbol(symbol);
        }
        if (properties) {
            this.setProperties(properties);
        }
        if (!isNil(id)) {
            this.setId(id);
        }
        this._zIndex = 0;
    };

    //bind the geometry to a layer


    Geometry.prototype._bindLayer = function _bindLayer(layer) {
        //check dupliaction
        if (this.getLayer()) {
            throw new Error('Geometry cannot be added to two or more layers at the same time.');
        }
        this._layer = layer;
        this._clearProjection();
        // this.callInitHooks();
    };

    Geometry.prototype._prepareSymbol = function _prepareSymbol(symbol) {
        if (Array.isArray(symbol)) {
            var cookedSymbols = [];
            for (var i = 0; i < symbol.length; i++) {
                cookedSymbols.push(convertResourceUrl(this._checkAndCopySymbol(symbol[i])));
            }
            return cookedSymbols;
        } else if (symbol) {
            symbol = this._checkAndCopySymbol(symbol);
            return convertResourceUrl(symbol);
        }
        return null;
    };

    Geometry.prototype._checkAndCopySymbol = function _checkAndCopySymbol(symbol) {
        var s = {};
        var numericalProperties = Symbolizer.numericalProperties;
        for (var i in symbol) {
            if (numericalProperties[i] && isString(symbol[i])) {
                s[i] = +symbol[i];
            } else {
                s[i] = symbol[i];
            }
        }
        return s;
    };

    /**
     * Sets a external symbol to the geometry, e.g. style from VectorLayer's setStyle
     * @private
     * @param {Object} symbol - external symbol
     */


    Geometry.prototype._setExternSymbol = function _setExternSymbol(symbol) {
        this._externSymbol = this._prepareSymbol(symbol);
        this.onSymbolChanged();
        return this;
    };

    Geometry.prototype._getInternalSymbol = function _getInternalSymbol() {
        if (this._symbol) {
            return this._symbol;
        } else if (this._externSymbol) {
            return this._externSymbol;
        } else if (this.options['symbol']) {
            return this.options['symbol'];
        }
        return null;
    };

    Geometry.prototype._getPrjExtent = function _getPrjExtent() {
        var p = this._getProjection();
        if (!this._extent && p) {
            var ext = this._computeExtent(p);
            if (ext) {
                var isAntiMeridian = this.options['antiMeridian'] && Measurer.isSphere(p);
                if (isAntiMeridian && isAntiMeridian !== 'default') {
                    var firstCoordinate = this.getFirstCoordinate();
                    if (isAntiMeridian === 'continuous') {
                        if (ext['xmax'] - ext['xmin'] > 180) {
                            if (firstCoordinate.x > 0) {
                                ext['xmin'] += 360;
                            } else {
                                ext['xmax'] -= 360;
                            }
                        }
                    }
                    if (ext['xmax'] < ext['xmin']) {
                        var tmp = ext['xmax'];
                        ext['xmax'] = ext['xmin'];
                        ext['xmin'] = tmp;
                    }
                }
                this._extent = new Extent(p.project(new Coordinate(ext['xmin'], ext['ymin'])), p.project(new Coordinate(ext['xmax'], ext['ymax'])));
            }
        }
        return this._extent;
    };

    Geometry.prototype._unbind = function _unbind() {
        var layer = this.getLayer();
        if (!layer) {
            return;
        }

        if (this._animPlayer) {
            this._animPlayer.finish();
            return;
        }

        //contextmenu
        this._unbindMenu();
        //infowindow
        this._unbindInfoWindow();

        if (this.isEditing()) {
            this.endEdit();
        }
        this._removePainter();
        if (this.onRemove) {
            this.onRemove();
        }
        if (layer.onRemoveGeometry) {
            layer.onRemoveGeometry(this);
        }
        delete this._layer;
        delete this._internalId;
        delete this._extent;
    };

    Geometry.prototype._getInternalId = function _getInternalId() {
        return this._internalId;
    };

    //只能被图层调用


    Geometry.prototype._setInternalId = function _setInternalId(id) {
        this._internalId = id;
    };

    Geometry.prototype._getMeasurer = function _getMeasurer() {
        if (this._getProjection()) {
            return this._getProjection();
        }
        return Measurer.getInstance(this.options['measure']);
    };

    Geometry.prototype._getProjection = function _getProjection() {
        var map = this.getMap();
        if (map && map.getProjection()) {
            return map.getProjection();
        }
        return null;
    };

    //获取geometry样式中依赖的外部图片资源


    Geometry.prototype._getExternalResources = function _getExternalResources() {
        var geometry = this;
        var symbol = geometry._getInternalSymbol();
        var resources = getExternalResources(symbol);
        return resources;
    };

    Geometry.prototype._getPainter = function _getPainter() {
        if (!this._painter && this.getMap()) {
            if (GEOMETRY_COLLECTION_TYPES.indexOf(this.type) !== -1) {
                this._painter = new CollectionPainter(this);
            } else {
                this._painter = new Painter(this);
            }
        }
        return this._painter;
    };

    Geometry.prototype._removePainter = function _removePainter() {
        if (this._painter) {
            this._painter.remove();
        }
        delete this._painter;
    };

    Geometry.prototype._paint = function _paint() {
        if (this._painter) {
            this._painter.paint();
        }
    };

    Geometry.prototype._repaint = function _repaint() {
        if (this._painter) {
            this._painter.repaint();
        }
    };

    Geometry.prototype._removeZoomCache = function _removeZoomCache() {
        if (this._painter) {
            this._painter.removeZoomCache();
        }
    };

    Geometry.prototype.onHide = function onHide() {
        this.closeMenu();
        this.closeInfoWindow();
    };

    Geometry.prototype.onShapeChanged = function onShapeChanged() {
        this._extent = null;
        this._repaint();
        /**
         * shapechange event.
         *
         * @event Geometry#shapechange
         * @type {Object}
         * @property {String} type - shapechange
         * @property {Geometry} target - the geometry fires the event
         */
        this._fireEvent('shapechange');
    };

    Geometry.prototype.onPositionChanged = function onPositionChanged() {
        this._extent = null;
        this._repaint();
        /**
         * positionchange event.
         *
         * @event Geometry#positionchange
         * @type {Object}
         * @property {String} type - positionchange
         * @property {Geometry} target - the geometry fires the event
         */
        this._fireEvent('positionchange');
    };

    Geometry.prototype.onSymbolChanged = function onSymbolChanged() {
        if (this._painter) {
            this._painter.refreshSymbol();
        }
        /**
         * symbolchange event.
         *
         * @event Geometry#symbolchange
         * @type {Object}
         * @property {String} type - symbolchange
         * @property {Geometry} target - the geometry fires the event
         */
        this._fireEvent('symbolchange');
    };

    Geometry.prototype.onConfig = function onConfig(conf) {
        var needRepaint = false;
        for (var p in conf) {
            if (conf.hasOwnProperty(p)) {
                var prefix = p.slice(0, 5);
                if (prefix === 'arrow' || prefix === 'shado') {
                    needRepaint = true;
                    break;
                }
            }
        }
        if (needRepaint) {
            this._repaint();
        }
    };

    /**
     * Set a parent to the geometry, which is usually a MultiPolygon, GeometryCollection, etc
     * @param {GeometryCollection} geometry - parent geometry
     * @private
     */


    Geometry.prototype._setParent = function _setParent(geometry) {
        if (geometry) {
            this._parent = geometry;
        }
    };

    Geometry.prototype._getParent = function _getParent() {
        return this._parent;
    };

    Geometry.prototype._fireEvent = function _fireEvent(eventName, param) {
        if (this.getLayer() && this.getLayer()._onGeometryEvent) {
            if (!param) {
                param = {};
            }
            param['type'] = eventName;
            param['target'] = this;
            this.getLayer()._onGeometryEvent(param);
        }
        this.fire(eventName, param);
    };

    Geometry.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options)
        };
    };

    Geometry.prototype._exportGraphicOptions = function _exportGraphicOptions(options) {
        var json = {};
        if (isNil(options['options']) || options['options']) {
            json['options'] = this.config();
        }
        if (isNil(options['symbol']) || options['symbol']) {
            json['symbol'] = this.getSymbol();
        }
        if (isNil(options['infoWindow']) || options['infoWindow']) {
            if (this._infoWinOptions) {
                json['infoWindow'] = this._infoWinOptions;
            }
        }
        return json;
    };

    Geometry.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var points = this.getCoordinates();
        var coordinates = Coordinate.toNumberArrays(points);
        return {
            'type': this.getType(),
            'coordinates': coordinates
        };
    };

    Geometry.prototype._exportProperties = function _exportProperties() {
        var properties = null;
        var geoProperties = this.getProperties();
        if (geoProperties) {
            if (isObject(geoProperties)) {
                properties = extend({}, geoProperties);
            } else {
                geoProperties = properties;
            }
        }
        return properties;
    };

    return Geometry;
}(JSONAble(Eventable(Handlerable(Class))));

Geometry.mergeOptions(options$3);

/**
 * Common methods for geometry classes that base on a center, e.g. Marker, Circle, Ellipse , etc
 * @mixin CenterMixin
 */
var CenterMixin = function (Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        /**
         * Get geometry's center
         * @return {Coordinate} - center of the geometry
         * @function CenterMixin.getCoordinates
         */
        _class.prototype.getCoordinates = function getCoordinates() {
            return this._coordinates;
        };

        /**
         * Set a new center to the geometry
         * @param {Coordinate|Number[]} coordinates - new center
         * @return {Geometry} this
         * @fires Geometry#positionchange
         * @function CenterMixin.setCoordinates
         */


        _class.prototype.setCoordinates = function setCoordinates(coordinates) {
            var center = coordinates instanceof Coordinate ? coordinates : new Coordinate(coordinates);
            if (center.equals(this._coordinates)) {
                return this;
            }
            this._coordinates = center;
            if (!this.getMap()) {
                this.onPositionChanged();
                return this;
            }
            var projection = this._getProjection();
            this._setPrjCoordinates(projection.project(this._coordinates));
            return this;
        };

        //Gets view point of the geometry's center


        _class.prototype._getCenter2DPoint = function _getCenter2DPoint(zoom) {
            var map = this.getMap();
            if (!map) {
                return null;
            }
            var z = isNil(zoom) ? map.getZoom() : map.getMaxZoom();
            var pcenter = this._getPrjCoordinates();
            if (!pcenter) {
                return null;
            }

            return map._prjToPoint(pcenter, z);
        };

        _class.prototype._getPrjCoordinates = function _getPrjCoordinates() {
            var projection = this._getProjection();
            if (!projection) {
                return null;
            }
            if (!this._pcenter) {
                if (this._coordinates) {
                    this._pcenter = projection.project(this._coordinates);
                }
            }
            return this._pcenter;
        };

        //Set center by projected coordinates


        _class.prototype._setPrjCoordinates = function _setPrjCoordinates(pcenter) {
            this._pcenter = pcenter;
            this.onPositionChanged();
        };

        //update cached variables if geometry is updated.


        _class.prototype._updateCache = function _updateCache() {
            delete this._extent;
            var projection = this._getProjection();
            if (this._pcenter && projection) {
                this._coordinates = projection.unproject(this._pcenter);
            }
        };

        _class.prototype._clearProjection = function _clearProjection() {
            this._pcenter = null;
        };

        _class.prototype._computeCenter = function _computeCenter() {
            return this._coordinates;
        };

        return _class;
    }(Base);
};

var options$5 = {
    'symbol': {
        'markerType': 'path',
        'markerPath': [{
            'path': 'M8 23l0 0 0 0 0 0 0 0 0 0c-4,-5 -8,-10 -8,-14 0,-5 4,-9 8,-9l0 0 0 0c4,0 8,4 8,9 0,4 -4,9 -8,14z M3,9 a5,5 0,1,0,0,-0.9Z',
            'fill': '#DE3333'
        }],
        'markerPathWidth': 16,
        'markerPathHeight': 23,
        'markerWidth': 24,
        'markerHeight': 34
    }
};

/**
 * @classdesc
 * Represents a Point type Geometry.
 * @category geometry
 * @extends Geometry
 * @mixes CenterMixin
 * @example
 * var marker = new Marker([100, 0], {
 *     'id' : 'marker0',
 *     'symbol' : {
 *         'markerFile'  : 'foo.png',
 *         'markerWidth' : 20,
 *         'markerHeight': 20,
 *     },
 *     'properties' : {
 *         'foo' : 'value'
 *     }
 * });
 */

var Marker = function (_CenterMixin) {
    inherits(Marker, _CenterMixin);

    /**
     * @param {Coordinate} coordinates      - coordinates of the marker
     * @param {Object} [options=null]       - construct options defined in [Marker]{@link Marker#options}
     */
    function Marker(coordinates, opts) {
        classCallCheck(this, Marker);

        var _this = possibleConstructorReturn(this, _CenterMixin.call(this, opts));

        _this.type = 'Point';
        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        return _this;
    }

    Marker.prototype._isVectorMarker = function _isVectorMarker() {
        var symbol = this._getInternalSymbol();
        if (Array.isArray(symbol)) {
            return false;
        }
        return VectorMarkerSymbolizer.test(symbol);
    };

    /**
     * Can be edited, only marker with a vector symbol, vector path symbol or a image symbol can be edited.
     * @return {Boolean}
     * @private
     */


    Marker.prototype._canEdit = function _canEdit() {
        var symbol = this._getInternalSymbol();
        if (Array.isArray(symbol)) {
            return false;
        }
        return VectorMarkerSymbolizer.test(symbol) || VectorPathMarkerSymbolizer.test(symbol) || ImageMarkerSymbolizer.test(symbol);
    };

    Marker.prototype._containsPoint = function _containsPoint(point) {
        var pxExtent = this._getPainter().get2DExtent();
        return pxExtent.contains(point);
    };

    Marker.prototype._computeExtent = function _computeExtent() {
        var coordinates = this.getCenter();
        if (!coordinates) {
            return null;
        }
        return new Extent(coordinates, coordinates);
    };

    Marker.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        return 0;
    };

    Marker.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        return 0;
    };

    Marker.prototype._getSprite = function _getSprite(resources, canvasClass) {
        if (this._getPainter()) {
            return this._getPainter().getSprite(resources, canvasClass);
        }
        return new Painter(this).getSprite(resources, canvasClass);
    };

    return Marker;
}(CenterMixin(Geometry));

Marker.mergeOptions(options$5);

Marker.registerJSONType('Marker');

/** @namespace animation */

/**
 * @classdesc
 * Easing functions for anmation, from openlayers 3
 * @class
 * @category animation
 * @memberof animation
 * @protected
 */
var Easing = {
    /**
     * Start slow and speed up.
     * @param {number} t Input between 0 and 1.
     * @return {number} Output between 0 and 1.
     */
    in: function _in(t) {
        return Math.pow(t, 2);
    },


    /**
     * Start fast and slow down.
     * @param {number} t Input between 0 and 1.
     * @return {number} Output between 0 and 1.
     */
    out: function out(t) {
        return 1 - Easing.in(1 - t);
    },


    /**
     * Start slow, speed up, and then slow down again.
     * @param {number} t Input between 0 and 1.
     * @return {number} Output between 0 and 1.
     */
    inAndOut: function inAndOut(t) {
        return 3 * t * t - 2 * t * t * t;
    },


    /**
     * Maintain a constant speed over time.
     * @param {number} t Input between 0 and 1.
     * @return {number} Output between 0 and 1.
     */
    linear: function linear(t) {
        return t;
    },


    /**
     * Start slow, speed up, and at the very end slow down again.  This has the
     * same general behavior as {@link inAndOut}, but the final slowdown
     * is delayed.
     * @param {number} t Input between 0 and 1.
     * @return {number} Output between 0 and 1.
     */
    upAndDown: function upAndDown(t) {
        if (t < 0.5) {
            return Easing.inAndOut(2 * t);
        } else {
            return 1 - Easing.inAndOut(2 * (t - 0.5));
        }
    }
};

/**
 * Animation Frame used internally in animation player.
 * @category animation
 * @memberof animation
 * @protected
 */

var Frame =
/**
 * Create an animation frame.
 * @param {Object} state  - animation state
 * @param {Object} styles - styles to animate
 */
function Frame(state, styles) {
    classCallCheck(this, Frame);

    this.state = state;
    this.styles = styles;
};

/**
 * An [Web Animation API]{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Animation} style animation player
 * @category animation
 * @memberof animation
 */


var Player =

/**
 * Create an animation player
 * @param {Function} animation - animation [framing]{@link framing} function
 * @param {Object} options     - animation options
 * @param {Function} onFrame  - callback function for animation steps
 */
function Player(animation, options, onFrame) {
    classCallCheck(this, Player);

    this._animation = animation;
    this._options = options;
    this._onFrame = onFrame;
    this.playState = 'idle';
    this.ready = true;
    this.finished = false;
};

/**
 * @classdesc
 * Utilities for animation
 * @class
 * @category animation
 * @memberof animation
 */


var Animation = {
    /**
     * @property {Object} speed         - predefined animation speed
     * @property {Number} speed.slow    - 2000ms
     * @property {Number} speed.normal  - 1000ms
     * @property {Number} speed.fast    - 500ms
     */
    speed: {
        'slow': 2000,
        'normal': 1000,
        'fast': 500
    },

    /**
     * resolve styles for animation, get a style group of start style, styles to animate and end styles.
     * @param  {Object} styles - styles to resolve
     * @return {Object[]}  styles resolved
     * @private
     */
    _resolveStyles: function _resolveStyles(styles) {
        if (!styles) {
            return null;
        }
        //resolve a child styles.
        function resolveChild(child) {
            if (!Array.isArray(child)) {
                return Animation._resolveStyles(child);
            }
            var start = [],
                d = [],
                dest = [];
            for (var i = 0; i < child.length; i++) {
                var _styles = Animation._resolveStyles(child[i]);
                if (_styles) {
                    start.push(_styles[0]);
                    d.push(_styles[1]);
                    dest.push(_styles[2]);
                }
            }
            if (start.length === 0) {
                return null;
            } else {
                return [start, d, dest];
            }
        }
        // resolve a style value.
        function resolveVal(val) {
            var values = val,
                clazz;
            //val is just a destination value, so we set start value to 0 or a 0-point or a 0-coordinate.
            if (!Array.isArray(val)) {
                if (isNumber(val)) {
                    values = [0, val];
                } else if (val instanceof Point || val instanceof Coordinate) {
                    clazz = val.constructor;
                    values = [new clazz(0, 0), val];
                } else {
                    values = [val, val];
                }
            }
            //val is an array and val[0] is the start value and val[1] is the destination value.
            var v1 = values[0],
                v2 = values[1];
            if (isNumber(v1) && isNumber(v2)) {
                if (v1 === v2) {
                    return null;
                }
                return [v1, v2 - v1, v2];
            } else if (Array.isArray(v1) || v1 instanceof Coordinate || v1 instanceof Point) {
                // is a coordinate (array or a coordinate) or a point
                if (Array.isArray(v1)) {
                    v1 = new Coordinate(v1);
                    v2 = new Coordinate(v2);
                } else {
                    clazz = v1.constructor;
                    v1 = new clazz(v1);
                    v2 = new clazz(v2);
                }
                if (v1.equals(v2)) {
                    //a Coordinate or a Point to be eql with each other
                    return null;
                }
                return [v1, v2.substract(v1), v2];
            } else {
                return [v1, 0, v2];
            }
        }

        function isChild(val) {
            if (!Array.isArray(val) && val.constructor === Object) {
                return true;
            } else if (Array.isArray(val) && val[0].constructor === Object) {
                return true;
            }
            return false;
        }

        var d = {},
            start = {},
            dest = {};
        for (var p in styles) {
            if (styles.hasOwnProperty(p)) {
                var values = styles[p];
                var childStyles;
                if (isChild(values)) {
                    childStyles = resolveChild(values);
                } else {
                    childStyles = resolveVal(values);
                }
                if (childStyles) {
                    start[p] = childStyles[0];
                    d[p] = childStyles[1];
                    dest[p] = childStyles[2];
                }
            }
        }
        return [start, d, dest];
    },


    /**
     * Generate a framing function
     * @param  {Object[]} styles        - animation style group
     * @param  {Object} [options=null]  - options
     * @param  {Object} [options.easing=null]  - animation easing
     * @return {Function} framing function helps to generate animation frames.
     */
    framing: function framing(styles, options) {
        if (!options) {
            options = {};
        }
        var easing = options['easing'] ? Easing[options['easing']] : Easing.linear;
        if (!easing) {
            easing = Easing.linear;
        }
        var dStyles, startStyles, destStyles;
        styles = Animation._resolveStyles(styles);
        if (styles) {
            startStyles = styles[0];
            dStyles = styles[1];
            destStyles = styles[2];
        }
        var deltaStyles = function deltaStyles(delta, _startStyles, _dStyles) {
            if (!_startStyles || !_dStyles) {
                return null;
            }
            var result = {};
            for (var p in _dStyles) {
                if (_dStyles.hasOwnProperty(p)) {
                    if (_startStyles[p] === destStyles[p]) {
                        result[p] = _startStyles[p];
                        continue;
                    }
                    var s = _startStyles[p],
                        d = _dStyles[p];
                    if (isNumber(d)) {
                        //e.g. radius, width, height
                        result[p] = s + delta * d;
                    } else if (Array.isArray(d)) {
                        //e.g. a composite symbol, element in array can only be a object.
                        var children = [];
                        for (var i = 0; i < d.length; i++) {
                            children.push(deltaStyles(delta, s[i], d[i]));
                        }
                        result[p] = children;
                    } else {
                        //e.g. translate or a child
                        var clazz = d.constructor;
                        if (clazz === Object) {
                            result[p] = deltaStyles(delta, s, d);
                        } else if (s instanceof Point || s instanceof Coordinate) {
                            result[p] = s.add(d.multi(delta));
                        }
                    }
                }
            }
            return result;
        };
        return function (elapsed, duration) {
            var state, d;
            if (elapsed < 0) {
                state = {
                    'playState': 'idle',
                    'delta': 0
                };
                d = startStyles;
            } else if (elapsed < duration) {
                var delta = easing(elapsed / duration);
                state = {
                    'playState': 'running',
                    'delta': delta
                };
                d = deltaStyles(delta, startStyles, dStyles);
            } else {
                state = {
                    'playState': 'finished',
                    'delta': 1
                };
                d = destStyles;
            }
            state['startStyles'] = startStyles;
            state['destStyles'] = destStyles;
            state['progress'] = elapsed;
            state['remainingMs'] = duration - elapsed;
            return new Frame(state, d);
        };
    },
    _requestAnimFrame: function _requestAnimFrame(fn) {
        if (!this._frameQueue) {
            this._frameQueue = [];
        }
        this._frameQueue.push(fn);
        this._a();
    },
    _a: function _a() {
        if (!this._animationFrameId) {
            this._animationFrameId = requestAnimFrame(Animation._frameFn);
        }
    },
    _run: function _run() {
        if (this._frameQueue.length) {
            var running = this._frameQueue;
            this._frameQueue = [];
            for (var i = 0, len = running.length; i < len; i++) {
                running[i]();
            }
            if (this._frameQueue.length) {
                this._animationFrameId = requestAnimFrame(Animation._frameFn);
            } else {
                delete this._animationFrameId;
            }
        }
    },


    /**
     * Create an animation player
     * @param  {Object} styles  - styles to animate
     * @param  {Object} options - animation options
     * @param  {Function} step  - callback function for animation steps
     * @return {Player} player
     */
    animate: function animate(styles, options, step) {
        if (!options) {
            options = {};
        }
        var animation = Animation.framing(styles, options);
        return new Player(animation, options, step);
    }
};

Animation._frameFn = Animation._run.bind(Animation);

extend(Player.prototype, /** @lends animation.Player.prototype */{
    _prepare: function _prepare() {
        var options = this._options;
        var duration = options['speed'] || options['duration'];
        if (isString(duration)) {
            duration = Animation.speed[duration];
            if (!duration) {
                duration = +duration;
            }
        }
        if (!duration) {
            duration = Animation.speed['normal'];
        }
        this.duration = duration;
    },


    /**
     * Start or resume the animation
     * @return {Player} this
     */
    play: function play() {
        if (this.playState !== 'idle' && this.playState !== 'paused') {
            return this;
        }
        if (this.playState === 'idle') {
            this.currentTime = 0;
            this._prepare();
        }
        var t = Date.now();
        if (!this.startTime) {
            var options = this._options;
            this.startTime = options['startTime'] ? options['startTime'] : t;
        }
        this._playStartTime = Math.max(t, this.startTime);
        if (this.playState === 'paused') {
            this._playStartTime -= this.currentTime;
        }
        this.playState = 'running';
        this._run();
        return this;
    },


    /**
     * Pause the animation
     * @return {Player} this
     */
    pause: function pause() {
        this.playState = 'paused';
        //this.duration = this.duration - this.currentTime;
        return this;
    },


    /**
     * Cancel the animation play and ready to play again
     * @return {Player} this
     */
    cancel: function cancel() {
        this.playState = 'idle';
        this.finished = false;
        return this;
    },


    /**
     * Finish the animation play, and can't be played any more.
     * @return {Player} this
     */
    finish: function finish() {
        this.playState = 'finished';
        this.finished = true;
        return this;
    },
    reverse: function reverse() {},
    _run: function _run() {
        var _this = this;

        if (this.playState === 'finished' || this.playState === 'paused') {
            return;
        }
        var t = Date.now();
        var elapsed = t - this._playStartTime;
        if (this._options['repeat'] && elapsed >= this.duration) {
            this._playStartTime = t;
            elapsed = 0;
        }
        //elapsed, duration
        var frame = this._animation(elapsed, this.duration);
        this.playState = frame.state['playState'];
        var onFrame = this._onFrame;
        if (this.playState === 'idle') {
            setTimeout(this._run.bind(this), this.startTime - t);
        } else if (this.playState === 'running') {
            this._animeFrameId = Animation._requestAnimFrame(function () {
                if (_this.playState !== 'running') {
                    return;
                }
                _this.currentTime = elapsed;
                if (onFrame) {
                    onFrame(frame);
                }
                _this._run();
            });
        } else if (this.playState === 'finished') {
            this.finished = true;
            //finished
            if (onFrame) {
                requestAnimFrame(function () {
                    onFrame(frame);
                });
            }
        }
    }
});



var Animation$1 = Object.freeze({
	Animation: Animation,
	Easing: Easing,
	Player: Player,
	Frame: Frame
});

/**
 * caculate the distance from a point to a segment.
 * @param {Point} p
 * @param {Point} p1
 * @param {Point} p2
 * @return {Number} distance from p to (p1, p2)
 * @memberOf Util
 */
function distanceToSegment(p, p1, p2) {
    var x = p.x,
        y = p.y,
        x1 = p1.x,
        y1 = p1.y,
        x2 = p2.x,
        y2 = p2.y;

    var cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
    if (cross <= 0) {
        // P->P1
        return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
    }
    var d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (cross >= d2) {
        // P->P2
        return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
    }
    var r = cross / d2;
    var px = x1 + (x2 - x1) * r;
    var py = y1 + (y2 - y1) * r;
    // P->P(px,py)
    return Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
}

/**
 * Whether the coordinate is inside the polygon
 * @param {Polygon}         - polygon
 * @param {Coordinate}      - coordinate
 * @return {Boolean}
 * @memberOf Util
 */
function pointInsidePolygon(p, points) {
    var i,
        j,
        p1,
        p2,
        len = points.length;
    var c = false;

    for (i = 0, j = len - 1; i < len; j = i++) {
        p1 = points[i];
        p2 = points[j];
        if (p1.y > p.y !== p2.y > p.y && p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x) {
            c = !c;
        }
    }

    return c;
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var simplify = createCommonjsModule(function (module) {
    /*
     (c) 2013, Vladimir Agafonkin
     Simplify.js, a high-performance JS polyline simplification library
     mourner.github.io/simplify-js
    */

    (function () {
        'use strict';

        // to suit your point format, run search/replace for '.x' and '.y';
        // for 3D version, see 3d branch (configurability would draw significant performance overhead)

        // square distance between 2 points

        function getSqDist(p1, p2) {

            var dx = p1.x - p2.x,
                dy = p1.y - p2.y;

            return dx * dx + dy * dy;
        }

        // square distance from a point to a segment
        function getSqSegDist(p, p1, p2) {

            var x = p1.x,
                y = p1.y,
                dx = p2.x - x,
                dy = p2.y - y;

            if (dx !== 0 || dy !== 0) {

                var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

                if (t > 1) {
                    x = p2.x;
                    y = p2.y;
                } else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }

            dx = p.x - x;
            dy = p.y - y;

            return dx * dx + dy * dy;
        }
        // rest of the code doesn't care about point format

        // basic distance-based simplification
        function simplifyRadialDist(points, sqTolerance) {

            var prevPoint = points[0],
                newPoints = [prevPoint],
                point;

            for (var i = 1, len = points.length; i < len; i++) {
                point = points[i];

                if (getSqDist(point, prevPoint) > sqTolerance) {
                    newPoints.push(point);
                    prevPoint = point;
                }
            }

            if (prevPoint !== point) newPoints.push(point);

            return newPoints;
        }

        // simplification using optimized Douglas-Peucker algorithm with recursion elimination
        function simplifyDouglasPeucker(points, sqTolerance) {

            var len = points.length,
                MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
                markers = new MarkerArray(len),
                first = 0,
                last = len - 1,
                stack = [],
                newPoints = [],
                i,
                maxSqDist,
                sqDist,
                index;

            markers[first] = markers[last] = 1;

            while (last) {

                maxSqDist = 0;

                for (i = first + 1; i < last; i++) {
                    sqDist = getSqSegDist(points[i], points[first], points[last]);

                    if (sqDist > maxSqDist) {
                        index = i;
                        maxSqDist = sqDist;
                    }
                }

                if (maxSqDist > sqTolerance) {
                    markers[index] = 1;
                    stack.push(first, index, index, last);
                }

                last = stack.pop();
                first = stack.pop();
            }

            for (i = 0; i < len; i++) {
                if (markers[i]) newPoints.push(points[i]);
            }

            return newPoints;
        }

        // both algorithms combined for awesome performance
        function simplify(points, tolerance, highestQuality) {

            var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

            points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
            points = simplifyDouglasPeucker(points, sqTolerance);

            return points;
        }

        // export as AMD module / Node module / browser or worker variable
        if (typeof undefined === 'function' && undefined.amd) undefined(function () {
            return simplify;
        });else module.exports = simplify;
    })();
});

/**
 * @property {Object} options - configuration options
 * @property {String} [options.antiMeridian=continuous] - continue | split, how to deal with the anti-meridian problem, split or continue the polygon when it cross the 180 or -180 longtitude line.
 * @property {Object} options.symbol - Path's default symbol
 * @memberOf Path
 * @instance
 */
var options$7 = {
    'antiMeridian': 'continuous',
    'symbol': {
        'lineColor': '#000',
        'lineWidth': 2,
        'lineOpacity': 1,

        'polygonFill': '#fff', //default color in cartoCSS
        'polygonOpacity': 1,
        'opacity': 1
    }
};

/**
 * An abstract class Path containing common methods for Path geometry classes, e.g. LineString, Polygon
 * @abstract
 * @category geometry
 * @extends Geometry
 */

var Path = function (_Geometry) {
    inherits(Path, _Geometry);

    function Path() {
        classCallCheck(this, Path);
        return possibleConstructorReturn(this, _Geometry.apply(this, arguments));
    }

    /**
     * Transform projected coordinates to view points
     * @param  {Coordinate[]} prjCoords           - projected coordinates
     * @param  {Boolean} disableSimplify          - whether to disable simplify\
     * @param  {Number} zoom                      - 2d points' zoom level
     * @returns {Point[]}
     * @private
     */
    Path.prototype._getPath2DPoints = function _getPath2DPoints(prjCoords, disableSimplify, zoom) {
        var result = [];
        if (!isArrayHasData(prjCoords)) {
            return result;
        }
        var map = this.getMap(),
            fullExtent = map.getFullExtent(),
            projection = this._getProjection();
        var anti = this.options['antiMeridian'] && Measurer.isSphere(projection),
            isClip = map.options['clipFullExtent'],
            isSimplify = !disableSimplify && this.getLayer() && this.getLayer().options['enableSimplify'],
            tolerance = 2 * map._getResolution(),
            isMulti = Array.isArray(prjCoords[0]);
        delete this._simplified;
        if (isSimplify && !isMulti) {
            var count = prjCoords.length;
            prjCoords = simplify(prjCoords, tolerance, false);
            this._simplified = prjCoords.length < count;
        }
        if (isNil(zoom)) {
            zoom = map.getZoom();
        }
        var p,
            pre,
            current,
            dx,
            dy,
            my,

        // for anit-meridian splits
        part1 = [],
            part2 = [],
            part = part1;
        for (var i = 0, len = prjCoords.length; i < len; i++) {
            p = prjCoords[i];
            if (isMulti) {
                part.push(this._getPath2DPoints(p, disableSimplify, zoom));
                continue;
            }
            if (isNil(p) || isClip && !fullExtent.contains(p)) {
                continue;
            }
            if (i > 0 && (anti === 'continuous' || anti === 'split')) {
                current = projection.unproject(p);
                if (anti === 'split' || !pre) {
                    pre = projection.unproject(prjCoords[i - 1]);
                }
                if (pre && current) {
                    dx = current.x - pre.x;
                    dy = current.y - pre.y;
                    if (Math.abs(dx) > 180) {
                        if (anti === 'continuous') {
                            current = this._anti(current, dx);
                            pre = current;
                            p = projection.project(current);
                        } else if (anti === 'split') {
                            if (dx > 0) {
                                my = pre.y + dy * (pre.x - -180) / (360 - dx) * (pre.y > current.y ? -1 : 1);
                                part = part === part1 ? part2 : part1;
                                part.push(map.coordinateToPoint(new Coordinate(180, my), zoom));
                            } else {
                                my = pre.y + dy * (180 - pre.x) / (360 + dx) * (pre.y > current.y ? 1 : -1);
                                part.push(map.coordinateToPoint(new Coordinate(180, my), zoom));
                                part = part === part1 ? part2 : part1;
                                part.push(map.coordinateToPoint(new Coordinate(-180, my), zoom));
                            }
                        }
                    }
                }
            }
            part.push(map._prjToPoint(p, zoom));
        }
        if (part2.length > 0) {
            result = [part1, part2];
        } else {
            result = part;
        }
        return result;
    };

    Path.prototype._anti = function _anti(c, dx) {
        if (dx > 0) {
            return c.substract(180 * 2, 0);
        } else {
            return c.add(180 * 2, 0);
        }
    };

    Path.prototype._setPrjCoordinates = function _setPrjCoordinates(prjPoints) {
        this._prjCoords = prjPoints;
        this.onShapeChanged();
    };

    Path.prototype._getPrjCoordinates = function _getPrjCoordinates() {
        if (!this._prjCoords) {
            var points = this._coordinates;
            this._prjCoords = this._projectCoords(points);
        }
        return this._prjCoords;
    };

    //update cached variables if geometry is updated.


    Path.prototype._updateCache = function _updateCache() {
        delete this._extent;
        var projection = this._getProjection();
        if (!projection) {
            return;
        }
        if (this._prjCoords) {
            this._coordinates = this._unprojectCoords(this._getPrjCoordinates());
        }
        if (this._prjHoles) {
            this._holes = this._unprojectCoords(this._getPrjHoles());
        }
    };

    Path.prototype._clearProjection = function _clearProjection() {
        this._prjCoords = null;
        if (this._prjHoles) {
            this._prjHoles = null;
        }
    };

    Path.prototype._projectCoords = function _projectCoords(points) {
        var projection = this._getProjection();
        if (projection) {
            return projection.projectCoords(points);
        }
        return null;
    };

    Path.prototype._unprojectCoords = function _unprojectCoords(prjPoints) {
        var projection = this._getProjection();
        if (projection) {
            return projection.unprojectCoords(prjPoints);
        }
        return null;
    };

    Path.prototype._computeCenter = function _computeCenter() {
        var ring = this._coordinates;
        if (!isArrayHasData(ring)) {
            return null;
        }
        var sumx = 0,
            sumy = 0;
        var counter = 0;
        var size = ring.length;
        for (var i = 0; i < size; i++) {
            if (ring[i]) {
                if (isNumber(ring[i].x) && isNumber(ring[i].y)) {
                    sumx += ring[i].x;
                    sumy += ring[i].y;
                    counter++;
                }
            }
        }
        return new Coordinate(sumx / counter, sumy / counter);
    };

    Path.prototype._computeExtent = function _computeExtent() {
        var ring = this._coordinates;
        if (!isArrayHasData(ring)) {
            return null;
        }
        var rings = [ring];
        if (this.hasHoles && this.hasHoles()) {
            rings = rings.concat(this.getHoles());
        }
        return this._computeCoordsExtent(rings);
    };

    /**
     * Compute extent of a group of coordinates
     * @param  {Coordinate[]} coords  - coordinates
     * @returns {Extent}
     * @private
     */


    Path.prototype._computeCoordsExtent = function _computeCoordsExtent(coords) {
        var result = null,
            anti = this.options['antiMeridian'];
        var ext, p, dx, pre;
        for (var i = 0, len = coords.length; i < len; i++) {
            for (var j = 0, jlen = coords[i].length; j < jlen; j++) {
                p = coords[i][j];
                if (j > 0 && anti) {
                    if (!pre) {
                        pre = coords[i][j - 1];
                    }
                    dx = p.x - pre.x;
                    if (Math.abs(dx) > 180) {
                        p = this._anti(p, dx);
                        pre = p;
                    }
                }
                ext = new Extent(p, p);
                result = ext.combine(result);
            }
        }
        return result;
    };

    Path.prototype._get2DLength = function _get2DLength() {
        var vertexes = this._getPath2DPoints(this._getPrjCoordinates(), true);
        var len = 0;
        for (var i = 1, l = vertexes.length; i < l; i++) {
            len += vertexes[i].distanceTo(vertexes[i - 1]);
        }
        return len;
    };

    Path.prototype._hitTestTolerance = function _hitTestTolerance() {
        var symbol = this._getInternalSymbol();
        var w;
        if (Array.isArray(symbol)) {
            w = 0;
            for (var i = 0; i < symbol.length; i++) {
                if (isNumber(symbol[i]['lineWidth'])) {
                    if (symbol[i]['lineWidth'] > w) {
                        w = symbol[i]['lineWidth'];
                    }
                }
            }
        } else {
            w = symbol['lineWidth'];
        }
        return w ? w / 2 : 1.5;
    };

    return Path;
}(Geometry);

Path.mergeOptions(options$7);

/**
 * @property {Object} [options=null]
 * @property {String} [options.antiMeridian=continuous] - how to deal with the anti-meridian problem, split or continue the linestring when it cross the 180 or -180 longtitude line.
 * @property {String} [options.arrowStyle=null]                 - style of arrow, if not null, arrows will be drawn, possible values: classic
 * @property {String} [options.arrowPlacement=vertex-last]      - arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
 * @memberOf LineString
 * @instance
 */
var options$6 = {
    'arrowStyle': null,
    'arrowPlacement': 'vertex-last' //vertex-first, vertex-last, vertex-firstlast, point
};

/**
 * Represents a LineString type Geometry.
 * @category geometry
 * @extends Path
 * @example
 * var line = new LineString(
 *     [
 *         [121.45942, 31.24123],
 *         [121.46371, 31.24226],
 *         [121.46727, 31.23870],
 *         [121.47019, 31.24145]
 *     ]
 * ).addTo(layer);
 */

var LineString = function (_Path) {
    inherits(LineString, _Path);

    /**
     * @param {Coordinate[]|Number[][]} coordinates - coordinates of the line string
     * @param {Object} [options=null] - construct options defined in [LineString]{@link LineString#options}
     */
    function LineString(coordinates, options) {
        classCallCheck(this, LineString);

        var _this = possibleConstructorReturn(this, _Path.call(this, options));

        _this.type = 'LineString';
        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        return _this;
    }

    /**
     * Set new coordinates to the line string
     * @param {Coordinate[]|Number[][]} coordinates - new coordinates
     * @fires LineString#shapechange
     * @return {LineString} this
     */


    LineString.prototype.setCoordinates = function setCoordinates(coordinates) {
        if (!coordinates) {
            this._coordinates = null;
            this._setPrjCoordinates(null);
            return this;
        }
        this._coordinates = Coordinate.toCoordinates(coordinates);
        if (this.getMap()) {
            this._setPrjCoordinates(this._projectCoords(this._coordinates));
        } else {
            this.onShapeChanged();
        }
        return this;
    };

    /**
     * Get coordinates of the line string
     * @return {Coordinate[]|Number[][]} coordinates
     */


    LineString.prototype.getCoordinates = function getCoordinates() {
        if (!this._coordinates) {
            return [];
        }
        return this._coordinates;
    };

    /**
     * Show the linestring with animation
     * @param  {Object} [options=null] animation options
     * @param  {Number} [options.duration=1000] duration
     * @param  {String} [options.easing=out] animation easing
     * @return {LineString}         this
     */


    LineString.prototype.animateShow = function animateShow(options) {
        var _this2 = this;

        if (!options) {
            options = {};
        }
        var coordinates = this.getCoordinates();
        var duration = options['duration'] || 1000;
        var length = this.getLength();
        var easing = options['easing'] || 'out';
        this.setCoordinates([]);
        var player = Animation.animate({
            't': duration
        }, {
            'duration': duration,
            'easing': easing
        }, function (frame) {
            if (!_this2.getMap()) {
                player.finish();
                _this2.setCoordinates(coordinates);
                return;
            }
            _this2._drawAnimFrame(frame.styles.t, duration, length, coordinates);
        });
        player.play();
        return this;
    };

    LineString.prototype._drawAnimFrame = function _drawAnimFrame(t, duration, length, coordinates) {
        if (t === 0) {
            this.setCoordinates([]);
            return;
        }
        var map = this.getMap();
        var targetLength = t / duration * length;
        if (!this._animIdx) {
            this._animIdx = 0;
            this._animLenSoFar = 0;
            this.show();
        }
        var i, l;
        var segLen = 0;
        for (i = this._animIdx, l = coordinates.length; i < l - 1; i++) {
            segLen = map.computeLength(coordinates[i], coordinates[i + 1]);
            if (this._animLenSoFar + segLen > targetLength) {
                break;
            }
            this._animLenSoFar += segLen;
        }
        this._animIdx = i;
        if (this._animIdx >= l - 1) {
            this.setCoordinates(coordinates);
            return;
        }
        var idx = this._animIdx;
        var p1 = coordinates[idx],
            p2 = coordinates[idx + 1],
            span = targetLength - this._animLenSoFar,
            r = span / segLen;
        var x = p1.x + (p2.x - p1.x) * r,
            y = p1.y + (p2.y - p1.y) * r,
            targetCoord = new Coordinate(x, y);
        var animCoords = coordinates.slice(0, this._animIdx + 1);
        animCoords.push(targetCoord);

        this.setCoordinates(animCoords);
    };

    LineString.prototype._computeGeodesicLength = function _computeGeodesicLength(measurer) {
        return measurer.measureLength(this.getCoordinates());
    };

    LineString.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        return 0;
    };

    LineString.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var t = isNil(tolerance) ? this._hitTestTolerance() : tolerance;

        function isContains(points) {
            var i,
                p1,
                p2,
                len = points.length;

            for (i = 0, len = points.length; i < len - 1; i++) {
                p1 = points[i];
                p2 = points[i + 1];

                if (distanceToSegment(point, p1, p2) <= t) {
                    return true;
                }
            }
            return false;
        }

        if (t < 2) {
            t = 2;
        }

        var arrowStyle = this._getArrowStyle();
        var lineWidth = this._getInternalSymbol()['lineWidth'];

        var map = this.getMap(),
            extent = this._getPrjExtent(),
            nw = new Coordinate(extent.xmin, extent.ymax),
            se = new Coordinate(extent.xmax, extent.ymin),
            pxMin = map._prjToPoint(nw),
            pxMax = map._prjToPoint(se),
            pxExtent = new PointExtent(pxMin.x - t, pxMin.y - t, pxMax.x + t, pxMax.y + t);
        if (arrowStyle) {
            pxExtent._expand(Math.max(arrowStyle[0] * lineWidth, arrowStyle[1] * lineWidth));
        }
        if (!pxExtent.contains(point)) {
            return false;
        }

        // check arrow
        var points;
        if (this._getArrowStyle()) {
            points = this._getPath2DPoints(this._getPrjCoordinates(), true);
            var arrows = this._getArrows(points, lineWidth, (tolerance ? tolerance : 2) + lineWidth / 2);
            for (var ii = arrows.length - 1; ii >= 0; ii--) {
                if (pointInsidePolygon(point, arrows[ii])) {
                    return true;
                }
            }
        }

        points = points || this._getPath2DPoints(this._getPrjCoordinates());
        var isSplitted = points.length > 0 && Array.isArray(points[0]);
        if (isSplitted) {
            for (var i = 0, l = points.length; i < l; i++) {
                if (isContains(points[i])) {
                    return true;
                }
            }
            return false;
        } else {
            return isContains(points);
        }
    };

    return LineString;
}(Path);

LineString.mergeOptions(options$6);

LineString.registerJSONType('LineString');

/**
 * @classdesc
 * Geometry class for polygon type
 * @category geometry
 * @extends Path
 * @example
 * var polygon = new Polygon(
 *      [
 *          [
 *              [121.48053653961283, 31.24244899384889],
 *              [121.48049362426856, 31.238559229494186],
 *              [121.49032123809872, 31.236210614999653],
 *              [121.49366863494917, 31.242926029397037],
 *              [121.48577221160967, 31.243880093267567],
 *              [121.48053653961283, 31.24244899384889]
 *          ]
 *      ]
 *  ).addTo(layer);
 */

var Polygon = function (_Path) {
    inherits(Polygon, _Path);

    /**
     * @param {Number[][]|Number[][][]|Coordinate[]|Coordinate[][]} coordinates - coordinates, shell coordinates or all the rings.
     * @param {Object} [options=null] - construct options defined in [Polygon]{@link Polygon#options}
     */
    function Polygon(coordinates, opts) {
        classCallCheck(this, Polygon);

        var _this = possibleConstructorReturn(this, _Path.call(this, opts));

        _this.type = 'Polygon';
        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        return _this;
    }

    /**
     * Set coordinates to the polygon
     *
     * @param {Number[][]|Number[][][]|Coordinate[]|Coordinate[][]} coordinates - new coordinates
     * @return {Polygon} this
     * @fires Polygon#shapechange
     */


    Polygon.prototype.setCoordinates = function setCoordinates(coordinates) {
        if (!coordinates) {
            this._coordinates = null;
            this._holes = null;
            this._projectRings();
            return this;
        }
        var rings = Coordinate.toCoordinates(coordinates);
        var len = rings.length;
        if (!Array.isArray(rings[0])) {
            this._coordinates = this._trimRing(rings);
        } else {
            this._coordinates = this._trimRing(rings[0]);
            if (len > 1) {
                var holes = [];
                for (var i = 1; i < len; i++) {
                    if (!rings[i]) {
                        continue;
                    }
                    holes.push(this._trimRing(rings[i]));
                }
                this._holes = holes;
            }
        }

        this._projectRings();
        return this;
    };

    /**
     * Gets polygons's coordinates
     *
     * @returns {Coordinate[][]}
     */


    Polygon.prototype.getCoordinates = function getCoordinates() {
        if (!this._coordinates) {
            return [];
        }
        if (isArrayHasData(this._holes)) {
            var holes = [];
            for (var i = 0; i < this._holes.length; i++) {
                holes.push(this._closeRing(this._holes[i]));
            }
            return [this._closeRing(this._coordinates)].concat(holes);
        }
        return [this._closeRing(this._coordinates)];
    };

    /**
     * Gets shell's coordinates of the polygon
     *
     * @returns {Coordinate[]}
     */


    Polygon.prototype.getShell = function getShell() {
        return this._coordinates;
    };

    /**
     * Gets holes' coordinates of the polygon if it has.
     * @returns {Coordinate[][]}
     */


    Polygon.prototype.getHoles = function getHoles() {
        if (this.hasHoles()) {
            return this._holes;
        }
        return null;
    };

    /**
     * Whether the polygon has any holes inside.
     *
     * @returns {Boolean}
     */


    Polygon.prototype.hasHoles = function hasHoles() {
        if (isArrayHasData(this._holes)) {
            if (isArrayHasData(this._holes[0])) {
                return true;
            }
        }
        return false;
    };

    Polygon.prototype._projectRings = function _projectRings() {
        if (!this.getMap()) {
            this.onShapeChanged();
            return;
        }
        this._prjCoords = this._projectCoords(this._coordinates);
        this._prjHoles = this._projectCoords(this._holes);
        this.onShapeChanged();
    };

    Polygon.prototype._cleanRing = function _cleanRing(ring) {
        for (var i = ring.length - 1; i >= 0; i--) {
            if (!ring[i]) {
                ring.splice(i, 1);
            }
        }
    };

    /**
     * Check if ring is valid
     * @param  {*} ring ring to check
     * @return {Boolean} is ring a closed one
     * @private
     */


    Polygon.prototype._checkRing = function _checkRing(ring) {
        this._cleanRing(ring);
        if (!ring || !isArrayHasData(ring)) {
            return false;
        }
        var lastPoint = ring[ring.length - 1];
        var isClose = true;
        if (ring[0].x !== lastPoint.x || ring[0].y !== lastPoint.y) {
            isClose = false;
        }
        return isClose;
    };

    /**
     * If the first coordinate is equal with the last one, then remove the last coordinates.
     * @private
     */


    Polygon.prototype._trimRing = function _trimRing(ring) {
        var isClose = this._checkRing(ring);
        if (isArrayHasData(ring) && isClose) {
            return ring.slice(0, ring.length - 1);
        } else {
            return ring;
        }
    };

    /**
     * If the first coordinate is different with the last one, then copy the first coordinates and add to the ring.
     * @private
     */


    Polygon.prototype._closeRing = function _closeRing(ring) {
        var isClose = this._checkRing(ring);
        if (isArrayHasData(ring) && !isClose) {
            return ring.concat([new Coordinate(ring[0].x, ring[0].y)]);
        } else {
            return ring;
        }
    };

    Polygon.prototype._getPrjHoles = function _getPrjHoles() {
        if (!this._prjHoles) {
            this._prjHoles = this._projectCoords(this._holes);
        }
        return this._prjHoles;
    };

    Polygon.prototype._computeGeodesicLength = function _computeGeodesicLength(measurer) {
        var rings = this.getCoordinates();
        if (!isArrayHasData(rings)) {
            return 0;
        }
        var result = 0;
        for (var i = 0, len = rings.length; i < len; i++) {
            result += measurer.measureLength(rings[i]);
        }
        return result;
    };

    Polygon.prototype._computeGeodesicArea = function _computeGeodesicArea(measurer) {
        var rings = this.getCoordinates();
        if (!isArrayHasData(rings)) {
            return 0;
        }
        var result = measurer.measureArea(rings[0]);
        //holes
        for (var i = 1, len = rings.length; i < len; i++) {
            result -= measurer.measureArea(rings[i]);
        }
        return result;
    };

    Polygon.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var t = isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            pxExtent = this._getPainter().get2DExtent().expand(t);

        function isContains(points) {
            var c = pointInsidePolygon(point, points);
            if (c) {
                return c;
            }

            var i,
                j,
                p1,
                p2,
                len = points.length;

            for (i = 0, j = len - 1; i < len; j = i++) {
                p1 = points[i];
                p2 = points[j];

                if (distanceToSegment(point, p1, p2) <= t) {
                    return true;
                }
            }

            return false;
        }

        if (!pxExtent.contains(point)) {
            return false;
        }

        // screen points
        var points = this._getPath2DPoints(this._getPrjCoordinates()),
            isSplitted = Array.isArray(points[0]);
        if (isSplitted) {
            for (var i = 0; i < points.length; i++) {
                if (isContains(points[i])) {
                    return true;
                }
            }
            return false;
        } else {
            return isContains(points);
        }
    };

    return Polygon;
}(Path);

Polygon.registerJSONType('Polygon');

/**
 * @classdesc
 * Represents a GeometryCollection.
 * @category geometry
 * @extends Geometry
 * @example
 * var marker = new Marker([0, 0]),
 *     line = new LineString([[0, 0], [0, 1]]),
 *     polygon = new Polygon([[0, 0], [0, 1], [1, 3]]);
 * var collection = new GeometryCollection([marker, line, polygon])
 *     .addTo(layer);
 */

var GeometryCollection = function (_Geometry) {
    inherits(GeometryCollection, _Geometry);

    /**
     * @param {Geometry[]} geometries - GeometryCollection's geometries
     * @param {Object} [options=null] - options defined in [nGeometryCollection]{@link GeometryCollection#options}
     */
    function GeometryCollection(geometries, opts) {
        classCallCheck(this, GeometryCollection);

        var _this = possibleConstructorReturn(this, _Geometry.call(this, opts));

        _this.type = 'GeometryCollection';
        _this.setGeometries(geometries);
        return _this;
    }

    /**
     * Set new geometries to the geometry collection
     * @param {Geometry[]} geometries
     * @return {GeometryCollection} this
     * @fires GeometryCollection#shapechange
     */


    GeometryCollection.prototype.setGeometries = function setGeometries(_geometries) {
        var geometries = this._checkGeometries(_geometries);
        //Set the collection as child geometries' parent.
        if (Array.isArray(geometries)) {
            for (var i = geometries.length - 1; i >= 0; i--) {
                geometries[i]._initOptions(this.config());
                geometries[i]._setParent(this);
                geometries[i]._setEventParent(this);
                geometries[i].setSymbol(this.getSymbol());
            }
        }
        this._geometries = geometries;
        if (this.getLayer()) {
            this._bindGeometriesToLayer();
            this.onShapeChanged();
        }
        return this;
    };

    /**
     * Get geometries of the geometry collection
     * @return {Geometry[]} geometries
     */


    GeometryCollection.prototype.getGeometries = function getGeometries() {
        if (!this._geometries) {
            return [];
        }
        return this._geometries;
    };

    /**
     * Executes the provided callback once for each geometry present in the collection in order.
     * @param  {Function} fn             - a callback function
     * @param  {*} [context=undefined]   - callback's context
     * @return {GeometryCollection} this
     */


    GeometryCollection.prototype.forEach = function forEach(fn, context) {
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            if (!context) {
                fn(geometries[i], i);
            } else {
                fn.call(context, geometries[i], i);
            }
        }
        return this;
    };

    /**
     * Creates a GeometryCollection with all elements that pass the test implemented by the provided function.
     * @param  {Function} fn      - Function to test each geometry
     * @param  {*} [context=undefined]    - Function's context
     * @return {GeometryCollection} A GeometryCollection with all elements that pass the test
     */


    GeometryCollection.prototype.filter = function filter(fn, context) {
        if (!fn) {
            return null;
        }
        var selected = [];
        var isFn = isFunction(fn);
        var filter = isFn ? fn : createFilter(fn);

        this.forEach(function (geometry) {
            var g = isFn ? geometry : getFilterFeature(geometry);
            if (context ? filter.call(context, g) : filter(g)) {
                selected.push(geometry);
            }
        }, this);

        return selected.length > 0 ? new GeometryCollection(selected) : null;
    };

    /**
     * Translate or move the geometry collection by the given offset.
     * @param  {Coordinate} offset - translate offset
     * @return {GeometryCollection} this
     */


    GeometryCollection.prototype.translate = function translate(offset) {
        if (!offset) {
            return this;
        }
        if (this.isEmpty()) {
            return this;
        }
        this.forEach(function (geometry) {
            if (geometry && geometry.translate) {
                geometry.translate(offset);
            }
        });
        return this;
    };

    /**
     * Whether the geometry collection is empty
     * @return {Boolean}
     */


    GeometryCollection.prototype.isEmpty = function isEmpty() {
        return !isArrayHasData(this.getGeometries());
    };

    /**
     * remove itself from the layer if any.
     * @returns {Geometry} this
     * @fires GeometryCollection#removestart
     * @fires GeometryCollection#remove
     * @fires GeometryCollection#removeend
     */


    GeometryCollection.prototype.remove = function remove() {
        this.forEach(function (geometry) {
            geometry._unbind();
        });
        return Geometry.prototype.remove.apply(this, arguments);
    };

    /**
     * Show the geometry collection.
     * @return {GeometryCollection} this
     * @fires GeometryCollection#show
     */


    GeometryCollection.prototype.show = function show() {
        this.options['visible'] = true;
        this.forEach(function (geometry) {
            geometry.show();
        });
        return this;
    };

    /**
     * Hide the geometry collection.
     * @return {GeometryCollection} this
     * @fires GeometryCollection#hide
     */


    GeometryCollection.prototype.hide = function hide() {
        this.options['visible'] = false;
        this.forEach(function (geometry) {
            geometry.hide();
        });
        return this;
    };

    GeometryCollection.prototype.setSymbol = function setSymbol(symbol) {
        symbol = this._prepareSymbol(symbol);
        this._symbol = symbol;
        this.forEach(function (geometry) {
            geometry.setSymbol(symbol);
        });
        this.onSymbolChanged();
        return this;
    };

    GeometryCollection.prototype.updateSymbol = function updateSymbol(symbol) {
        this.forEach(function (geometry) {
            geometry.updateSymbol(symbol);
        });
        this.onSymbolChanged();
        return this;
    };

    GeometryCollection.prototype.onConfig = function onConfig(config) {
        this.forEach(function (geometry) {
            geometry.config(config);
        });
    };

    GeometryCollection.prototype._setExternSymbol = function _setExternSymbol(symbol) {
        symbol = this._prepareSymbol(symbol);
        this._externSymbol = symbol;
        this.forEach(function (geometry) {
            geometry._setExternSymbol(symbol);
        });
        this.onSymbolChanged();
        return this;
    };

    /**
     * bind this geometry collection to a layer
     * @param  {Layer} layer
     * @private
     */


    GeometryCollection.prototype._bindLayer = function _bindLayer() {
        Geometry.prototype._bindLayer.apply(this, arguments);
        this._bindGeometriesToLayer();
    };

    GeometryCollection.prototype._bindGeometriesToLayer = function _bindGeometriesToLayer() {
        var layer = this.getLayer();
        this.forEach(function (geometry) {
            geometry._bindLayer(layer);
        });
    };

    /**
     * Check whether the type of geometries is valid
     * @param  {Geometry[]} geometries - geometries to check
     * @private
     */


    GeometryCollection.prototype._checkGeometries = function _checkGeometries(geometries) {
        var invalidGeoError = 'The geometry added to collection is invalid.';
        if (geometries && !Array.isArray(geometries)) {
            if (geometries instanceof Geometry) {
                return [geometries];
            } else {
                throw new Error(invalidGeoError);
            }
        } else if (Array.isArray(geometries)) {
            for (var i = 0, len = geometries.length; i < len; i++) {
                if (!(geometries[i] instanceof Geometry)) {
                    throw new Error(invalidGeoError + ' Index: ' + i);
                }
            }
            return geometries;
        }
        return null;
    };

    GeometryCollection.prototype._updateCache = function _updateCache() {
        delete this._extent;
        if (this.isEmpty()) {
            return;
        }
        this.forEach(function (geometry) {
            if (geometry && geometry._updateCache) {
                geometry._updateCache();
            }
        });
    };

    GeometryCollection.prototype._removePainter = function _removePainter() {
        if (this._painter) {
            this._painter.remove();
        }
        delete this._painter;
        this.forEach(function (geometry) {
            geometry._removePainter();
        });
    };

    GeometryCollection.prototype._computeCenter = function _computeCenter(projection) {
        if (!projection || this.isEmpty()) {
            return null;
        }
        var sumX = 0,
            sumY = 0,
            counter = 0;
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            var center = geometries[i]._computeCenter(projection);
            if (center) {
                sumX += center.x;
                sumY += center.y;
                counter++;
            }
        }
        if (counter === 0) {
            return null;
        }
        return new Coordinate(sumX / counter, sumY / counter);
    };

    GeometryCollection.prototype._containsPoint = function _containsPoint(point, t) {
        if (this.isEmpty()) {
            return false;
        }
        var i, len;
        var geometries = this.getGeometries();
        for (i = 0, len = geometries.length; i < len; i++) {
            if (geometries[i]._containsPoint(point, t)) {
                return true;
            }
        }

        return false;
    };

    GeometryCollection.prototype._computeExtent = function _computeExtent(projection) {
        if (this.isEmpty()) {
            return null;
        }
        var geometries = this.getGeometries();
        var result = null;
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            var geoExtent = geometries[i]._computeExtent(projection);
            if (geoExtent) {
                result = geoExtent.combine(result);
            }
        }
        return result;
    };

    GeometryCollection.prototype._computeGeodesicLength = function _computeGeodesicLength(projection) {
        if (!projection || this.isEmpty()) {
            return 0;
        }
        var geometries = this.getGeometries();
        var result = 0;
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            result += geometries[i]._computeGeodesicLength(projection);
        }
        return result;
    };

    GeometryCollection.prototype._computeGeodesicArea = function _computeGeodesicArea(projection) {
        if (!projection || this.isEmpty()) {
            return 0;
        }
        var geometries = this.getGeometries();
        var result = 0;
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            result += geometries[i]._computeGeodesicArea(projection);
        }
        return result;
    };

    GeometryCollection.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var geoJSON = [];
        if (!this.isEmpty()) {
            var geometries = this.getGeometries();
            for (var i = 0, len = geometries.length; i < len; i++) {
                if (!geometries[i]) {
                    continue;
                }
                geoJSON.push(geometries[i]._exportGeoJSONGeometry());
            }
        }
        return {
            'type': 'GeometryCollection',
            'geometries': geoJSON
        };
    };

    GeometryCollection.prototype._clearProjection = function _clearProjection() {
        if (this.isEmpty()) {
            return;
        }
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            if (!geometries[i]) {
                continue;
            }
            geometries[i]._clearProjection();
        }
    };

    /**
     * Get connect points if being connected by [ConnectorLine]{@link ConnectorLine}
     * @private
     * @return {Coordinate[]}
     */


    GeometryCollection.prototype._getConnectPoints = function _getConnectPoints() {
        var extent = this.getExtent();
        var anchors = [new Coordinate(extent.xmin, extent.ymax), new Coordinate(extent.xmax, extent.ymin), new Coordinate(extent.xmin, extent.ymin), new Coordinate(extent.xmax, extent.ymax)];
        return anchors;
    };

    GeometryCollection.prototype._getExternalResources = function _getExternalResources() {
        if (this.isEmpty()) {
            return null;
        }
        var i, l, ii, ll;
        var geometries = this.getGeometries(),
            resources = [],
            symbol,
            res,
            cache = {},
            key;
        for (i = 0, l = geometries.length; i < l; i++) {
            if (!geometries[i]) {
                continue;
            }
            symbol = geometries[i]._getInternalSymbol();
            res = getExternalResources(symbol);
            if (!res) {
                continue;
            }
            for (ii = 0, ll = res.length; ii < ll; ii++) {
                key = res[ii].join();
                if (!cache[key]) {
                    resources.push(res[ii]);
                    cache[key] = 1;
                }
            }
        }
        return resources;
    };

    //----------Overrides editor methods in Geometry-----------------

    GeometryCollection.prototype.startEdit = function startEdit(opts) {
        var _this2 = this;

        if (this.isEmpty()) {
            return this;
        }
        if (!opts) {
            opts = {};
        }
        if (opts['symbol']) {
            this._originalSymbol = this.getSymbol();
            this.setSymbol(opts['symbol']);
        }
        this._draggbleBeforeEdit = this.options['draggable'];
        this.config('draggable', false);
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            geometries[i].startEdit(opts);
        }
        this._editing = true;
        this.hide();
        setTimeout(function () {
            _this2.fire('editstart');
        }, 1);
        return this;
    };

    GeometryCollection.prototype.endEdit = function endEdit() {
        if (this.isEmpty()) {
            return this;
        }
        var geometries = this.getGeometries();
        for (var i = 0, len = geometries.length; i < len; i++) {
            geometries[i].endEdit();
        }
        if (this._originalSymbol) {
            this.setSymbol(this._originalSymbol);
            delete this._originalSymbol;
        }
        this._editing = false;
        this.show();
        this.config('draggable', this._draggbleBeforeEdit);
        this.fire('editend');
        return this;
    };

    GeometryCollection.prototype.isEditing = function isEditing() {
        if (!this._editing) {
            return false;
        }
        return true;
    };

    return GeometryCollection;
}(Geometry);

GeometryCollection.registerJSONType('GeometryCollection');

/**
 * The parent class for MultiPoint, MultiLineString and MultiPolygon
 * @category geometry
 * @abstract
 * @extends {GeometryCollection}
 */

var MultiGeometry = function (_GeometryCollection) {
    inherits(MultiGeometry, _GeometryCollection);

    /**
     * @param  {Class} geoType      Type of the geometry
     * @param  {String} type        type in String, e.g. "MultiPoint", "MultiLineString"
     * @param  {Geometry[]} data    data
     * @param  {Object} [options=null] configuration options
     */
    function MultiGeometry(geoType, type, data, options) {
        classCallCheck(this, MultiGeometry);

        var _this = possibleConstructorReturn(this, _GeometryCollection.call(this, null, options));

        _this.GeometryType = geoType;
        _this.type = type;
        _this._initData(data);
        return _this;
    }

    /**
     * Get coordinates of the collection
     * @return {Coordinate[]|Coordinate[][]|Coordinate[][][]} coordinates
     */


    MultiGeometry.prototype.getCoordinates = function getCoordinates() {
        var coordinates = [];
        var geometries = this.getGeometries();
        if (!Array.isArray(geometries)) {
            return null;
        }
        for (var i = 0, len = geometries.length; i < len; i++) {
            coordinates.push(geometries[i].getCoordinates());
        }
        return coordinates;
    };

    /**
     * Set new coordinates to the collection
     * @param {Coordinate[]|Coordinate[][]|Coordinate[][][]} coordinates
     * @returns {Geometry} this
     * @fires maptalk.Geometry#shapechange
     */


    MultiGeometry.prototype.setCoordinates = function setCoordinates(coordinates) {
        if (isArrayHasData(coordinates)) {
            var geometries = [];
            for (var i = 0, len = coordinates.length; i < len; i++) {
                var p = new this.GeometryType(coordinates[i], this.config());
                geometries.push(p);
            }
            this.setGeometries(geometries);
        } else {
            this.setGeometries([]);
        }
        return this;
    };

    MultiGeometry.prototype._initData = function _initData(data) {
        if (isArrayHasData(data)) {
            if (data[0] instanceof this.GeometryType) {
                this.setGeometries(data);
            } else {
                this.setCoordinates(data);
            }
        }
    };

    MultiGeometry.prototype._checkGeometries = function _checkGeometries(geometries) {
        if (Array.isArray(geometries)) {
            for (var i = 0, len = geometries.length; i < len; i++) {
                if (geometries[i] && !(geometries[i] instanceof this.GeometryType)) {
                    throw new Error('Geometry is not valid for collection, index:' + i);
                }
            }
        }
        return geometries;
    };

    //override _exportGeoJSONGeometry in GeometryCollection


    MultiGeometry.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var points = this.getCoordinates();
        var coordinates = Coordinate.toNumberArrays(points);
        return {
            'type': this.getType(),
            'coordinates': coordinates
        };
    };

    return MultiGeometry;
}(GeometryCollection);

/**
 * @classdesc
 * Represents a Geometry type of MultiPoint.
 * @category geometry
 * @extends MultiGeometry
 * @example
 * var multiPoint = new MultiPoint(
 *     [
 *         [121.5080881906138, 31.241128104458117],
 *         [121.50804527526954, 31.237238340103413],
 *         [121.5103728890997, 31.23888972560888]
 *     ]
 * ).addTo(layer);
 */

var MultiPoint = function (_MultiGeometry) {
  inherits(MultiPoint, _MultiGeometry);

  /**
   * @param {Number[][]|Coordinate[]|Marker[]} data - construct data, coordinates or an array of markers
   * @param {Object} [options=null] - options defined in [nMultiPoint]{@link MultiPoint#options}
   */
  function MultiPoint(data, opts) {
    classCallCheck(this, MultiPoint);
    return possibleConstructorReturn(this, _MultiGeometry.call(this, Marker, 'MultiPoint', data, opts));
  }

  return MultiPoint;
}(MultiGeometry);

MultiPoint.registerJSONType('MultiPoint');

/**
 * @classdesc
 * Represents a Geometry type of MultiLineString
 * @category geometry
 * @extends MultiGeometry
 * @example
 * var multiLineString = new MultiLineString(
 *      [
 *          [
 *              [121.5289450479131, 31.2420083925986],
 *              [121.52860172515919, 31.238926401171824]
 *          ],
 *          [
 *              [121.53091915374796, 31.241898323208233],
 *              [121.53104789978069, 31.23859618183896]
 *          ],
 *          [
 *               [121.5324641061405, 31.241898323208233],
 *               [121.53242119079626, 31.239146546752256]
 *           ]
 *       ],
 *       {
 *           symbol:{
 *               'lineColor' : '#000000',
 *               'lineWidth' : 5,
 *               'lineOpacity' : 1
 *           },
 *          draggable:true
 *      }
 * ).addTo(layer);
 */

var MultiLineString = function (_MultiGeometry) {
  inherits(MultiLineString, _MultiGeometry);

  /**
   * @param {Number[][][]|Coordinate[][]|LineString[]} data - construct data, coordinates or an array of linestrings
   * @param {Object} [options=null]           - options defined in [MultiLineString]{@link MultiLineString#options}
   */
  function MultiLineString(data, options) {
    classCallCheck(this, MultiLineString);
    return possibleConstructorReturn(this, _MultiGeometry.call(this, LineString, 'MultiLineString', data, options));
  }

  return MultiLineString;
}(MultiGeometry);

MultiLineString.registerJSONType('MultiLineString');

/**
 * @classdesc
 * Represents a Geometry type of MultiPolygon
 * @category geometry
 * @extends MultiGeometry
 * @example
 * var multiPolygon = new MultiPolygon(
 *       [
 *           [
 *               [
 *                   [121.55074604278596, 31.242008515751614],
 *                   [121.55074604278596, 31.23914637638951],
 *                   [121.55349262481711, 31.23914637638951],
 *                   [121.55349262481711, 31.24134802974913],
 *                   [121.5518618417361, 31.241384723537074],
 *                   [121.55074604278596, 31.242008515751614]
 *               ]
 *           ],
 *           [
 *               [
 *                   [121.5543080163576, 31.241054478932387],
 *                   [121.5543938470461, 31.240100432478293],
 *                   [121.55555256134048, 31.240173821009137],
 *                   [121.55542381530773, 31.240981091085693],
 *                   [121.5543080163576, 31.241054478932387]
 *               ]
 *           ]
 *
 *       ],
 *       {
 *           symbol:{
 *               'lineColor' : '#000000',
 *               'lineWidth' : 2,
 *               'lineDasharray' : null,//线形
 *               'lineOpacity' : 1,
 *               'polygonFill' : 'rgb(255, 0, 0)',
 *               'polygonOpacity' : 0.8
 *           },
 *           draggable:true
 * }).addTo(layer);
 */

var MultiPolygon = function (_MultiGeometry) {
  inherits(MultiPolygon, _MultiGeometry);

  /**
   * @param {Number[][][][]|Coordinate[][][]|Polygon[]} data - construct data, coordinates or an array of polygons
   * @param {Object} [options=null]           - options defined in [MultiPolygon]{@link MultiPolygon#options}
   */
  function MultiPolygon(data, opts) {
    classCallCheck(this, MultiPolygon);
    return possibleConstructorReturn(this, _MultiGeometry.call(this, Polygon, 'MultiPolygon', data, opts));
  }

  return MultiPolygon;
}(MultiGeometry);

MultiPolygon.registerJSONType('MultiPolygon');

var types$1 = {
    'Marker': Marker,
    'LineString': LineString,
    'Polygon': Polygon,
    'MultiPoint': MultiPoint,
    'MultiLineString': MultiLineString,
    'MultiPolygon': MultiPolygon
};

/**
 * GeoJSON utilities
 * @class
 * @category geometry
 * @name GeoJSON
 */
var GeoJSON = {

    /**
     * Convert one or more GeoJSON objects to geometry
     * @param  {String|Object|Object[]} geoJSON - GeoJSON objects or GeoJSON string
     * @return {Geometry|Geometry[]} a geometry array when input is a FeatureCollection
     * @example
     * var collection = {
     *      "type": "FeatureCollection",
     *      "features": [
     *          { "type": "Feature",
     *            "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
     *            "properties": {"prop0": "value0"}
     *           },
     *           { "type": "Feature",
     *             "geometry": {
     *                 "type": "LineString",
     *                 "coordinates": [
     *                     [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
     *                 ]
     *             },
     *             "properties": {
     *                 "prop0": "value0",
     *                 "prop1": 0.0
     *             }
     *           },
     *           { "type": "Feature",
     *             "geometry": {
     *                 "type": "Polygon",
     *                 "coordinates": [
     *                     [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
     *                       [100.0, 1.0], [100.0, 0.0] ]
     *                 ]
     *             },
     *             "properties": {
     *                 "prop0": "value0",
     *                 "prop1": {"this": "that"}
     *             }
     *          }
     *      ]
     *  }
     *  // A geometry array.
     *  var geometries = GeoJSON.toGeometry(collection);
     */
    toGeometry: function toGeometry(geoJSON) {
        if (isString(geoJSON)) {
            geoJSON = parseJSON(geoJSON);
        }
        if (Array.isArray(geoJSON)) {
            var resultGeos = [];
            for (var i = 0, len = geoJSON.length; i < len; i++) {
                var geo = this._convert(geoJSON[i]);
                if (Array.isArray(geo)) {
                    resultGeos = resultGeos.concat(geo);
                } else {
                    resultGeos.push(geo);
                }
            }
            return resultGeos;
        } else {
            var resultGeo = this._convert(geoJSON);
            return resultGeo;
        }
    },

    /**
     * Convert single GeoJSON object
     * @param  {Object} geoJSONObj - a GeoJSON object
     * @return {Geometry}
     * @private
     */
    _convert: function _convert(json) {
        if (!json || isNil(json['type'])) {
            return null;
        }

        var type = json['type'];
        if (type === 'Feature') {
            var g = json['geometry'];
            var geometry = this._convert(g);
            if (!geometry) {
                return null;
            }
            geometry.setId(json['id']);
            geometry.setProperties(json['properties']);
            return geometry;
        } else if (type === 'FeatureCollection') {
            var features = json['features'];
            if (!features) {
                return null;
            }
            //返回geometry数组
            var result = this.toGeometry(features);
            return result;
        } else if (['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].indexOf(type) >= 0) {
            var clazz = type === 'Point' ? 'Marker' : type;
            return new types$1[clazz](json['coordinates']);
        } else if (type === 'GeometryCollection') {
            var geometries = json['geometries'];
            if (!isArrayHasData(geometries)) {
                return new GeometryCollection();
            }
            var mGeos = [];
            var size = geometries.length;
            for (var i = 0; i < size; i++) {
                mGeos.push(this._convert(geometries[i]));
            }
            return new GeometryCollection(mGeos);
        }
        return null;
    }
};

/**
 * @property {Object} options
 * @property {Number} [options.numberOfShellPoints=60]   - number of shell points when converting the circle to a polygon.
 * @memberOf Circle
 * @instance
 */
var options$8 = {
    'numberOfShellPoints': 60
};

/**
 * @classdesc
 * Represents a Circle Geometry. <br>
 * @category geometry
 * @extends Polygon
 * @mixes Geometry.Center
 * @example
 * var circle = new Circle([100, 0], 1000, {
 *     id : 'circle0',
 *     properties : {
 *         foo : 'bar'
 *     }
 * });
 * @mixes CenterMixin
 */

var Circle = function (_CenterMixin) {
    inherits(Circle, _CenterMixin);

    Circle.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var circle = new Circle(json['coordinates'], json['radius'], json['options']);
        circle.setProperties(feature['properties']);
        return circle;
    };

    /**
     * @param {Coordinate} center - center of the circle
     * @param {Number} radius           - radius of the circle
     * @param {Object} [options=null]   - construct options defined in [Circle]{@link Circle#options}
     */


    function Circle(coordinates, radius, opts) {
        classCallCheck(this, Circle);

        var _this = possibleConstructorReturn(this, _CenterMixin.call(this, null, opts));

        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        _this._radius = radius;
        return _this;
    }

    /**
     * Get radius of the circle
     * @return {Number}
     */


    Circle.prototype.getRadius = function getRadius() {
        return this._radius;
    };

    /**
     * Set a new radius to the circle
     * @param {Number} radius - new radius
     * @return {Circle} this
     * @fires Circle#shapechange
     */


    Circle.prototype.setRadius = function setRadius(radius) {
        this._radius = radius;
        this.onShapeChanged();
        return this;
    };

    /**
     * Gets the shell of the circle as a polygon, number of the shell points is decided by [options.numberOfShellPoints]{@link Circle#options}
     * @return {Coordinate[]} - shell coordinates
     */


    Circle.prototype.getShell = function getShell() {
        var measurer = this._getMeasurer(),
            center = this.getCoordinates(),
            numberOfPoints = this.options['numberOfShellPoints'],
            radius = this.getRadius();
        var shell = [],
            rad,
            dx,
            dy;
        for (var i = 0; i < numberOfPoints; i++) {
            rad = 360 * i / numberOfPoints * Math.PI / 180;
            dx = radius * Math.cos(rad);
            dy = radius * Math.sin(rad);
            var vertex = measurer.locate(center, dx, dy);
            shell.push(vertex);
        }
        return shell;
    };

    /**
     * Circle won't have any holes, always returns null
     * @return {null}
     */


    Circle.prototype.getHoles = function getHoles() {
        return null;
    };

    Circle.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var center = this._getCenter2DPoint(),
            size = this.getSize(),
            t = isNil(tolerance) ? this._hitTestTolerance() : tolerance;
        return center.distanceTo(point) <= size.width / 2 + t;
    };

    Circle.prototype._computeExtent = function _computeExtent(measurer) {
        if (!measurer || !this._coordinates || isNil(this._radius)) {
            return null;
        }

        var radius = this._radius;
        var p1 = measurer.locate(this._coordinates, radius, radius);
        var p2 = measurer.locate(this._coordinates, -radius, -radius);
        return new Extent(p1, p2);
    };

    Circle.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        if (isNil(this._radius)) {
            return 0;
        }
        return Math.PI * 2 * this._radius;
    };

    Circle.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        if (isNil(this._radius)) {
            return 0;
        }
        return Math.PI * Math.pow(this._radius, 2);
    };

    Circle.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var coordinates = Coordinate.toNumberArrays([this.getShell()]);
        return {
            'type': 'Polygon',
            'coordinates': coordinates
        };
    };

    Circle.prototype._toJSON = function _toJSON(options) {
        var center = this.getCenter();
        var opts = extend({}, options);
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type': 'Polygon'
        };
        return {
            'feature': feature,
            'subType': 'Circle',
            'coordinates': [center.x, center.y],
            'radius': this.getRadius()
        };
    };

    return Circle;
}(CenterMixin(Polygon));

Circle.mergeOptions(options$8);

Circle.registerJSONType('Circle');

/**
 * @property {Object} [options=null]
 * @property {Number} [options.numberOfShellPoints=60]   - number of shell points when exporting the ellipse's shell coordinates as a polygon.
 * @memberOf Ellipse
 * @instance
 */
var options$9 = {
    'numberOfShellPoints': 60
};

/**
 * Represents a Ellipse Geometry. <br>
 * @category geometry
 * @extends Polygon
 * @mixes CenterMixin
 * @example
 * var ellipse = new Ellipse([100, 0], 1000, 500, {
 *     id : 'ellipse0'
 * });
 */

var Ellipse = function (_CenterMixin) {
    inherits(Ellipse, _CenterMixin);

    Ellipse.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var ellipse = new Ellipse(json['coordinates'], json['width'], json['height'], json['options']);
        ellipse.setProperties(feature['properties']);
        return ellipse;
    };

    /**
     * @param {Coordinate} center  - center of the ellipse
     * @param {Number} width  - width of the ellipse
     * @param {Number} height - height of the ellipse
     * @param {Object}  [options=null] - construct options defined in [Ellipse]{@link Ellipse#options}
     */


    function Ellipse(coordinates, width, height, opts) {
        classCallCheck(this, Ellipse);

        var _this = possibleConstructorReturn(this, _CenterMixin.call(this, null, opts));

        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        _this.width = width;
        _this.height = height;
        return _this;
    }

    /**
     * Get ellipse's width
     * @return {Number}
     */


    Ellipse.prototype.getWidth = function getWidth() {
        return this.width;
    };

    /**
     * Set new width to ellipse
     * @param {Number} width - new width
     * @fires Ellipse#shapechange
     * @return {Ellipse} this
     */


    Ellipse.prototype.setWidth = function setWidth(width) {
        this.width = width;
        this.onShapeChanged();
        return this;
    };

    /**
     * Get ellipse's height
     * @return {Number}
     */


    Ellipse.prototype.getHeight = function getHeight() {
        return this.height;
    };

    /**
     * Set new height to ellipse
     * @param {Number} height - new height
     * @fires Ellipse#shapechange
     * @return {Ellipse} this
     */


    Ellipse.prototype.setHeight = function setHeight(height) {
        this.height = height;
        this.onShapeChanged();
        return this;
    };

    /**
     * Gets the shell of the ellipse as a polygon, number of the shell points is decided by [options.numberOfShellPoints]{@link Circle#options}
     * @return {Coordinate[]} - shell coordinates
     */


    Ellipse.prototype.getShell = function getShell() {
        var measurer = this._getMeasurer(),
            center = this.getCoordinates(),
            numberOfPoints = this.options['numberOfShellPoints'],
            width = this.getWidth(),
            height = this.getHeight();
        var shell = [];
        var s = Math.pow(width / 2, 2) * Math.pow(height / 2, 2),
            sx = Math.pow(width / 2, 2),
            sy = Math.pow(height / 2, 2);
        var deg, rad, dx, dy;
        for (var i = 0; i < numberOfPoints; i++) {
            deg = 360 * i / numberOfPoints;
            rad = deg * Math.PI / 180;
            dx = Math.sqrt(s / (sx * Math.pow(Math.tan(rad), 2) + sy));
            dy = Math.sqrt(s / (sy * Math.pow(1 / Math.tan(rad), 2) + sx));
            if (deg > 90 && deg < 270) {
                dx *= -1;
            }
            if (deg > 180 && deg < 360) {
                dy *= -1;
            }
            var vertex = measurer.locate(center, dx, dy);
            shell.push(vertex);
        }
        return shell;
    };

    /**
     * Ellipse won't have any holes, always returns null
     * @return {null}
     */


    Ellipse.prototype.getHoles = function getHoles() {
        return null;
    };

    Ellipse.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var map = this.getMap(),
            t = isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            pa = map.distanceToPixel(this.width / 2, 0),
            pb = map.distanceToPixel(0, this.height / 2),
            a = pa.width,
            b = pb.height,
            c = Math.sqrt(Math.abs(a * a - b * b)),
            xfocus = a >= b;
        var center = this._getCenter2DPoint();
        var f1, f2, d;
        if (xfocus) {
            f1 = new Point(center.x - c, center.y);
            f2 = new Point(center.x + c, center.y);
            d = a * 2;
        } else {
            f1 = new Point(center.x, center.y - c);
            f2 = new Point(center.x, center.y + c);
            d = b * 2;
        }
        point = new Point(point.x, point.y);

        /*
         L1 + L2 = D
         L1 + t >= L1'
         L2 + t >= L2'
         D + 2t >= L1' + L2'
         */
        return point.distanceTo(f1) + point.distanceTo(f2) <= d + 2 * t;
    };

    Ellipse.prototype._computeExtent = function _computeExtent(measurer) {
        if (!measurer || !this._coordinates || isNil(this.width) || isNil(this.height)) {
            return null;
        }
        var width = this.getWidth(),
            height = this.getHeight();
        var p1 = measurer.locate(this._coordinates, width / 2, height / 2);
        var p2 = measurer.locate(this._coordinates, -width / 2, -height / 2);
        return new Extent(p1, p2);
    };

    Ellipse.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        if (isNil(this.width) || isNil(this.height)) {
            return 0;
        }
        //L=2πb+4(a-b)
        //近似值
        var longer = this.width > this.height ? this.width : this.height;
        return 2 * Math.PI * longer / 2 - 4 * Math.abs(this.width - this.height);
    };

    Ellipse.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        if (isNil(this.width) || isNil(this.height)) {
            return 0;
        }
        return Math.PI * this.width * this.height / 4;
    };

    Ellipse.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var coordinates = Coordinate.toNumberArrays([this.getShell()]);
        return {
            'type': 'Polygon',
            'coordinates': coordinates
        };
    };

    Ellipse.prototype._toJSON = function _toJSON(options) {
        var opts = extend({}, options);
        var center = this.getCenter();
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type': 'Polygon'
        };
        return {
            'feature': feature,
            'subType': 'Ellipse',
            'coordinates': [center.x, center.y],
            'width': this.getWidth(),
            'height': this.getHeight()
        };
    };

    return Ellipse;
}(CenterMixin(Polygon));

Ellipse.mergeOptions(options$9);

Ellipse.registerJSONType('Ellipse');

/**
 * @classdesc
 * Represents a Rectangle geometry.
 * @category geometry
 * @extends Polygon
 * @example
 * var rectangle = new Rectangle([100, 0], 1000, 500, {
 *     id : 'rectangle0'
 * });
 */

var Rectangle = function (_Polygon) {
    inherits(Rectangle, _Polygon);

    Rectangle.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var rect = new Rectangle(json['coordinates'], json['width'], json['height'], json['options']);
        rect.setProperties(feature['properties']);
        return rect;
    };

    /**
     * @param {Coordinate} coordinates  - northwest of the rectangle
     * @param {Number} width                     - width of the rectangle
     * @param {Number} height                    - height of the rectangle
     * @param {Object} [options=null]            - options defined in [Rectangle]{@link Rectangle#options}
     */


    function Rectangle(coordinates, width, height, opts) {
        classCallCheck(this, Rectangle);

        var _this = possibleConstructorReturn(this, _Polygon.call(this, null, opts));

        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        _this._width = width;
        _this._height = height;
        return _this;
    }

    /**
     * Get coordinates of rectangle's northwest
     * @return {Coordinate}
     */


    Rectangle.prototype.getCoordinates = function getCoordinates() {
        return this._coordinates;
    };

    /**
     * Set a new coordinate for northwest of the rectangle
     * @param {Coordinate} nw - coordinates of new northwest
     * @return {Rectangle} this
     * @fires Rectangle#positionchange
     */


    Rectangle.prototype.setCoordinates = function setCoordinates(nw) {
        this._coordinates = nw instanceof Coordinate ? nw : new Coordinate(nw);
        if (!this._coordinates || !this.getMap()) {
            this.onPositionChanged();
            return this;
        }
        var projection = this._getProjection();
        this._setPrjCoordinates(projection.project(this._coordinates));
        return this;
    };

    /**
     * Get rectangle's width
     * @return {Number}
     */


    Rectangle.prototype.getWidth = function getWidth() {
        return this._width;
    };

    /**
     * Set new width to the rectangle
     * @param {Number} width - new width
     * @fires Rectangle#shapechange
     * @return {Rectangle} this
     */


    Rectangle.prototype.setWidth = function setWidth(width) {
        this._width = width;
        this.onShapeChanged();
        return this;
    };

    /**
     * Get rectangle's height
     * @return {Number}
     */


    Rectangle.prototype.getHeight = function getHeight() {
        return this._height;
    };

    /**
     * Set new height to rectangle
     * @param {Number} height - new height
     * @fires Rectangle#shapechange
     * @return {Rectangle} this
     */


    Rectangle.prototype.setHeight = function setHeight(height) {
        this._height = height;
        this.onShapeChanged();
        return this;
    };

    /**
     * Gets the shell of the rectangle as a polygon
     * @return {Coordinate[]} - shell coordinates
     */


    Rectangle.prototype.getShell = function getShell() {
        var measurer = this._getMeasurer();
        var nw = this._coordinates;
        var map = this.getMap();
        var r = -1;
        if (map) {
            var fExt = map.getFullExtent();
            if (fExt['bottom'] > fExt['top']) {
                r = 1;
            }
        }
        var points = [];
        points.push(nw);
        points.push(measurer.locate(nw, this._width, 0));
        points.push(measurer.locate(nw, this._width, r * this._height));
        points.push(measurer.locate(nw, 0, r * this._height));
        points.push(nw);
        return points;
    };

    /**
     * Rectangle won't have any holes, always returns null
     * @return {null}
     */


    Rectangle.prototype.getHoles = function getHoles() {
        return null;
    };

    Rectangle.prototype._getPrjCoordinates = function _getPrjCoordinates() {
        var projection = this._getProjection();
        if (!projection) {
            return null;
        }
        if (!this._pnw) {
            if (this._coordinates) {
                this._pnw = projection.project(this._coordinates);
            }
        }
        return this._pnw;
    };

    Rectangle.prototype._setPrjCoordinates = function _setPrjCoordinates(pnw) {
        this._pnw = pnw;
        this.onPositionChanged();
    };

    //update cached variables if geometry is updated.


    Rectangle.prototype._updateCache = function _updateCache() {
        delete this._extent;
        var projection = this._getProjection();
        if (this._pnw && projection) {
            this._coordinates = projection.unproject(this._pnw);
        }
    };

    Rectangle.prototype._clearProjection = function _clearProjection() {
        this._pnw = null;
    };

    Rectangle.prototype._computeCenter = function _computeCenter(measurer) {
        return measurer.locate(this._coordinates, this._width / 2, -this._height / 2);
    };

    Rectangle.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var map = this.getMap(),
            t = isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            sp = map.coordinateToPoint(this._coordinates),
            pxSize = map.distanceToPixel(this._width, this._height);

        var pxMin = new Point(sp.x, sp.y),
            pxMax = new Point(sp.x + pxSize.width, sp.y + pxSize.height),
            pxExtent = new PointExtent(pxMin.x - t, pxMin.y - t, pxMax.x + t, pxMax.y + t);

        point = new Point(point.x, point.y);

        return pxExtent.contains(point);
    };

    Rectangle.prototype._computeExtent = function _computeExtent(measurer) {
        if (!measurer || !this._coordinates || isNil(this._width) || isNil(this._height)) {
            return null;
        }
        var width = this.getWidth(),
            height = this.getHeight();
        var p1 = measurer.locate(this._coordinates, width, -height);
        return new Extent(p1, this._coordinates);
    };

    Rectangle.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        if (isNil(this._width) || isNil(this._height)) {
            return 0;
        }
        return 2 * (this._width + this._height);
    };

    Rectangle.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        if (isNil(this._width) || isNil(this._height)) {
            return 0;
        }
        return this._width * this._height;
    };

    Rectangle.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var coordinates = Coordinate.toNumberArrays([this.getShell()]);
        return {
            'type': 'Polygon',
            'coordinates': coordinates
        };
    };

    Rectangle.prototype._toJSON = function _toJSON(options) {
        var opts = extend({}, options);
        var nw = this.getCoordinates();
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type': 'Polygon'
        };
        return {
            'feature': feature,
            'subType': 'Rectangle',
            'coordinates': [nw.x, nw.y],
            'width': this.getWidth(),
            'height': this.getHeight()
        };
    };

    return Rectangle;
}(Polygon);

Rectangle.registerJSONType('Rectangle');

/**
 * @property {Object} options -
 * @property {Number} [options.numberOfShellPoints=60]   - number of shell points when converting the sector to a polygon.
 * @memberOf Sector
 * @instance
 */
var options$10 = {
    'numberOfShellPoints': 60
};

/**
 * @classdesc
 * Represents a sector Geometry.
 * @category geometry
 * @extends Polygon
 * @mixes CenterMixin
 * @example
 * var sector = new Sector([100, 0], 1000, 30, 120, {
 *     id : 'sector0'
 * });
 */

var Sector = function (_CenterMixin) {
    inherits(Sector, _CenterMixin);

    Sector.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var sector = new Sector(json['coordinates'], json['radius'], json['startAngle'], json['endAngle'], json['options']);
        sector.setProperties(feature['properties']);
        return sector;
    };

    /**
     * @param {Coordinate} center - center of the sector
     * @param {Number} radius           - radius of the sector
     * @param {Number} startAngle       - start angle of the sector
     * @param {Number} endAngle         - end angle of the sector
     * @param {Object} [options=null]   - construct options defined in [Sector]{@link Sector#options}
     */


    function Sector(coordinates, radius, startAngle, endAngle, opts) {
        classCallCheck(this, Sector);

        var _this = possibleConstructorReturn(this, _CenterMixin.call(this, null, opts));

        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        _this._radius = radius;
        _this.startAngle = startAngle;
        _this.endAngle = endAngle;
        return _this;
    }

    /**
     * Get radius of the sector
     * @return {Number}
     */


    Sector.prototype.getRadius = function getRadius() {
        return this._radius;
    };

    /**
     * Set a new radius to the sector
     * @param {Number} radius - new radius
     * @return {Sector} this
     * @fires Sector#shapechange
     */


    Sector.prototype.setRadius = function setRadius(radius) {
        this._radius = radius;
        this.onShapeChanged();
        return this;
    };

    /**
     * Get the sector's start angle
     * @return {Number}
     */


    Sector.prototype.getStartAngle = function getStartAngle() {
        return this.startAngle;
    };

    /**
     * Set a new start angle to the sector
     * @param {Number} startAngle
     * @return {Sector} this
     * @fires Sector#shapechange
     */


    Sector.prototype.setStartAngle = function setStartAngle(startAngle) {
        this.startAngle = startAngle;
        this.onShapeChanged();
        return this;
    };

    /**
     * Get the sector's end angle
     * @return {Number}
     */


    Sector.prototype.getEndAngle = function getEndAngle() {
        return this.endAngle;
    };

    /**
     * Set a new end angle to the sector
     * @param {Number} endAngle
     * @return {Sector} this
     * @fires Sector#shapechange
     */


    Sector.prototype.setEndAngle = function setEndAngle(endAngle) {
        this.endAngle = endAngle;
        this.onShapeChanged();
        return this;
    };

    /**
     * Gets the shell of the sector as a polygon, number of the shell points is decided by [options.numberOfShellPoints]{@link Sector#options}
     * @return {Coordinate[]} - shell coordinates
     */


    Sector.prototype.getShell = function getShell() {
        var measurer = this._getMeasurer(),
            center = this.getCoordinates(),
            numberOfPoints = this.options['numberOfShellPoints'],
            radius = this.getRadius(),
            shell = [],
            angle = this.getEndAngle() - this.getStartAngle();
        var rad, dx, dy;
        for (var i = 0; i < numberOfPoints; i++) {
            rad = (angle * i / (numberOfPoints - 1) + this.getStartAngle()) * Math.PI / 180;
            dx = radius * Math.cos(rad);
            dy = radius * Math.sin(rad);
            var vertex = measurer.locate(center, dx, dy);
            shell.push(vertex);
        }
        return shell;
    };

    /**
     * Sector won't have any holes, always returns null
     * @return {null}
     */


    Sector.prototype.getHoles = function getHoles() {
        return null;
    };

    Sector.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var center = this._getCenter2DPoint(),
            t = isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            size = this.getSize(),
            pc = center,
            pp = point,
            x = pp.x - pc.x,
            y = pc.y - pp.y,
            atan2 = Math.atan2(y, x),

        // [0.0, 360.0)
        angle = atan2 < 0 ? (atan2 + 2 * Math.PI) * 360 / (2 * Math.PI) : atan2 * 360 / (2 * Math.PI);
        var sAngle = this.startAngle % 360,
            eAngle = this.endAngle % 360;
        var between = false;
        if (sAngle > eAngle) {
            between = !(angle > eAngle && angle < sAngle);
        } else {
            between = angle >= sAngle && angle <= eAngle;
        }

        // TODO: tolerance
        return pp.distanceTo(pc) <= size.width / 2 + t && between;
    };

    Sector.prototype._computeExtent = function _computeExtent(measurer) {
        if (!measurer || !this._coordinates || isNil(this._radius)) {
            return null;
        }

        var radius = this._radius;
        var p1 = measurer.locate(this._coordinates, radius, radius);
        var p2 = measurer.locate(this._coordinates, -radius, -radius);
        return new Extent(p1, p2);
    };

    Sector.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        if (isNil(this._radius)) {
            return 0;
        }
        return Math.PI * 2 * this._radius * Math.abs(this.startAngle - this.endAngle) / 360 + 2 * this._radius;
    };

    Sector.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        if (isNil(this._radius)) {
            return 0;
        }
        return Math.PI * Math.pow(this._radius, 2) * Math.abs(this.startAngle - this.endAngle) / 360;
    };

    Sector.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var coordinates = Coordinate.toNumberArrays([this.getShell()]);
        return {
            'type': 'Polygon',
            'coordinates': coordinates
        };
    };

    Sector.prototype._toJSON = function _toJSON(options) {
        var opts = extend({}, options);
        var center = this.getCenter();
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type': 'Polygon'
        };
        return {
            'feature': feature,
            'subType': 'Sector',
            'coordinates': [center.x, center.y],
            'radius': this.getRadius(),
            'startAngle': this.getStartAngle(),
            'endAngle': this.getEndAngle()
        };
    };

    return Sector;
}(CenterMixin(Polygon));

Sector.mergeOptions(options$10);

Sector.registerJSONType('Sector');

/**
 * Curve style LineString, an abstract parent class for all the curves.
 * @category geometry
 * @abstract
 * @extends LineString
 * @param {Coordinate[]|Number[][]} coordinates - coordinates of the line string
 * @param {Object} [options=null] - construct options defined in [LineString]{@link LineString#options}
 */

var Curve = function (_LineString) {
    inherits(Curve, _LineString);

    function Curve() {
        classCallCheck(this, Curve);
        return possibleConstructorReturn(this, _LineString.apply(this, arguments));
    }

    Curve.prototype._arc = function _arc(ctx, points, lineOpacity) {
        var degree = this.options['arcDegree'] * Math.PI / 180;
        for (var i = 1, l = points.length; i < l; i++) {
            Canvas._arcBetween(ctx, points[i - 1], points[i], degree);
            Canvas._stroke(ctx, lineOpacity);
        }
    };

    Curve.prototype._quadraticCurve = function _quadraticCurve(ctx, points) {
        if (points.length <= 2) {
            Canvas._path(ctx, points);
            return;
        }
        Canvas.quadraticCurve(ctx, points);
    };

    Curve.prototype._getCubicCurvePoints = function _getCubicCurvePoints(points) {
        var ctrlPts = [];
        var f = 0.3;
        var t = 0.6;

        var m = 0;
        var dx1 = 0;
        var dy1 = 0;
        var dx2, dy2;
        var curP, nexP;
        var preP = points[0];
        for (var i = 1, len = points.length; i < len; i++) {
            curP = points[i];
            nexP = points[i + 1];
            if (nexP) {
                m = (nexP.y - preP.y) / (nexP.x - preP.x);
                dx2 = (nexP.x - curP.x) * -f;
                dy2 = dx2 * m * t;
            } else {
                dx2 = 0;
                dy2 = 0;
            }
            // ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
            ctrlPts.push(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
            dx1 = dx2;
            dy1 = dy2;
            preP = curP;
        }
        return ctrlPts;
    };

    Curve.prototype._bezierCurve = function _bezierCurve(ctx, points) {

        if (points.length <= 2) {
            Canvas._path(ctx, points);
            return;
        }
        var ctrlPts = this._getCubicCurvePoints(points);
        var i,
            len = ctrlPts.length;
        for (i = 0; i < len; i += 6) {
            ctx.bezierCurveTo(ctrlPts[i], ctrlPts[i + 1], ctrlPts[i + 2], ctrlPts[i + 3], ctrlPts[i + 4], ctrlPts[i + 5]);
        }
    };

    return Curve;
}(LineString);

/**
 * @property {Object} options
 * @property {Number} [options.arcDegree=90]           - circle arc's degree.
 * @memberOf ArcCurve
 * @instance
 */
var options$11 = {
    'arcDegree': 90
};

/**
 * @classdesc
 * Circle Arc Curve
 * @category geometry
 * @extends Curve
 * @param {Coordinate[]|Number[][]} coordinates - coordinates of the curve
 * @param {Object} [options=null]   - construct options defined in [ArcCurve]{@link ArcCurve#options}
 * @example
 * var curve = new ArcCurve(
 *     [
 *         [121.47083767181408,31.214448123476995],
 *         [121.4751292062378,31.215475523000404],
 *         [121.47869117980943,31.211916269810335]
 *     ],
 *     {
 *         arcDegree : 120,
 *         symbol : {
 *             'lineWidth' : 5
 *         }
 *     }
 * ).addTo(layer);
 */

var ArcCurve = function (_Curve) {
    inherits(ArcCurve, _Curve);

    function ArcCurve() {
        classCallCheck(this, ArcCurve);
        return possibleConstructorReturn(this, _Curve.apply(this, arguments));
    }

    ArcCurve.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'subType': 'ArcCurve'
        };
    };

    // paint method on canvas


    ArcCurve.prototype._paintOn = function _paintOn(ctx, points, lineOpacity) {
        ctx.beginPath();
        this._arc(ctx, points, lineOpacity);
        Canvas._stroke(ctx, lineOpacity);
        this._paintArrow(ctx, points, lineOpacity);
    };

    ArcCurve.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var arc = new ArcCurve(feature['geometry']['coordinates'], json['options']);
        arc.setProperties(feature['properties']);
        return arc;
    };

    return ArcCurve;
}(Curve);

ArcCurve.registerJSONType('ArcCurve');

ArcCurve.mergeOptions(options$11);

/**
 * Cubic Bezier Curve
 * @category geometry
 * @extends Curve
 * @param {Coordinate[]|Number[][]} coordinates - coordinates of the curve
 * @param {Object} [options=null]   - construct options defined in [CubicBezierCurve]{@link CubicBezierCurve#options}
 * @example
 * var curve = new CubicBezierCurve(
 *     [
 *         [121.47083767181408,31.214448123476995],
 *         [121.4751292062378,31.215475523000404],
 *         [121.47869117980943,31.211916269810335]
 *     ],
 *     {
 *         symbol : {
 *             'lineWidth' : 5
 *         }
 *     }
 * ).addTo(layer);
 */

var CubicBezierCurve = function (_Curve) {
    inherits(CubicBezierCurve, _Curve);

    function CubicBezierCurve() {
        classCallCheck(this, CubicBezierCurve);
        return possibleConstructorReturn(this, _Curve.apply(this, arguments));
    }

    CubicBezierCurve.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var curve = new CubicBezierCurve(feature['geometry']['coordinates'], json['options']);
        curve.setProperties(feature['properties']);
        return curve;
    };

    CubicBezierCurve.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'subType': 'CubicBezierCurve'
        };
    };

    // paint method on canvas


    CubicBezierCurve.prototype._paintOn = function _paintOn(ctx, points, lineOpacity) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        this._bezierCurve(ctx, points, lineOpacity);
        Canvas._stroke(ctx, lineOpacity);
        this._paintArrow(ctx, points, lineOpacity);
    };

    return CubicBezierCurve;
}(Curve);

CubicBezierCurve.registerJSONType('CubicBezierCurve');

/**
 * @classdesc
 * Quadratic Bezier Curve
 * @category geometry
 * @extends Curve
 * @param {Coordinate[]|Number[][]} coordinates - coordinates of the curve
 * @example
 * var curve = new QuadBezierCurve(
 *     [
 *         [121.47083767181408,31.214448123476995],
 *         [121.4751292062378,31.215475523000404],
 *         [121.47869117980943,31.211916269810335]
 *     ],
 *     {
 *         symbol : {
 *             'lineWidth' : 5
 *         }
 *     }
 * ).addTo(layer);
 */

var QuadBezierCurve = function (_Curve) {
    inherits(QuadBezierCurve, _Curve);

    function QuadBezierCurve() {
        classCallCheck(this, QuadBezierCurve);
        return possibleConstructorReturn(this, _Curve.apply(this, arguments));
    }

    QuadBezierCurve.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var curve = new QuadBezierCurve(feature['geometry']['coordinates'], json['options']);
        curve.setProperties(feature['properties']);
        return curve;
    };

    QuadBezierCurve.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'subType': 'QuadBezierCurve'
        };
    };

    // paint method on canvas


    QuadBezierCurve.prototype._paintOn = function _paintOn(ctx, points, lineOpacity) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        this._quadraticCurve(ctx, points, lineOpacity);
        Canvas._stroke(ctx, lineOpacity);

        this._paintArrow(ctx, points, lineOpacity);
    };

    QuadBezierCurve.prototype._getArrowPlacement = function _getArrowPlacement() {
        var placement = this.options['arrowPlacement'];
        // bezier curves doesn't support point arrows.
        if (placement === 'point') {
            placement = 'vertex-last';
        }
        return placement;
    };

    return QuadBezierCurve;
}(Curve);

QuadBezierCurve.registerJSONType('QuadBezierCurve');

var defaultSymbol = {
    'textFaceName': 'monospace',
    'textSize': 12,
    'textWrapBefore': false,
    'textWrapCharacter': '\n',
    'textLineSpacing': 8,
    'textHorizontalAlignment': 'middle', //left middle right
    'textVerticalAlignment': 'middle', //top middle bottom
    'textOpacity': 1,
    'textDx': 0,
    'textDy': 0
};

var defaultBoxSymbol = {
    'markerType': 'square',
    'markerLineColor': '#000',
    'markerLineWidth': 2,
    'markerLineOpacity': 1,
    'markerFill': '#fff',
    'markerOpacity': 1
};

/**
 * @property {Boolean} [options.boxMinHeight=0]        - the minimum height of the box.
 * @memberOf TextMarker
 * @instance
 */
var options$12 = {
    'box': true
};

/**
 * @classdesc
 * Base class for  the Text marker classes, a marker which has text and background box. <br>
 * It is abstract and not intended to be instantiated.
 * @category geometry
 * @abstract
 * @extends Marker
 */

var TextMarker = function (_Marker) {
    inherits(TextMarker, _Marker);

    function TextMarker(content, coordinates, options) {
        classCallCheck(this, TextMarker);

        var _this = possibleConstructorReturn(this, _Marker.call(this, coordinates, options));

        _this._content = content;
        _this._refresh();
        return _this;
    }

    /**
     * Get text content of the label
     * @returns {String}
     */


    TextMarker.prototype.getContent = function getContent() {
        return this._content;
    };

    /**
     * Set a new text content to the label
     * @return {Label} this
     * @fires Label#contentchange
     */


    TextMarker.prototype.setContent = function setContent(content) {
        var old = this._content;
        this._content = content;
        this._refresh();
        /**
         * an event when changing label's text content
         * @event Label#contentchange
         * @type {Object}
         * @property {String} type - contentchange
         * @property {Label} target - label fires the event
         * @property {String} old - old content
         * @property {String} new - new content
         */
        this._fireEvent('contentchange', {
            'old': old,
            'new': content
        });
        return this;
    };

    TextMarker.prototype.getSymbol = function getSymbol() {
        if (this._textSymbolChanged) {
            return Geometry.prototype.getSymbol.call(this);
        }
        return null;
    };

    TextMarker.prototype.setSymbol = function setSymbol(symbol) {
        if (!symbol || symbol === this.options['symbol']) {
            this._textSymbolChanged = false;
            symbol = {};
        } else {
            this._textSymbolChanged = true;
        }
        var cooked = this._prepareSymbol(symbol);
        var s = this._getDefaultTextSymbol();
        extend(s, cooked);
        this._symbol = s;
        this._refresh();
        return this;
    };

    TextMarker.prototype.onConfig = function onConfig(conf) {
        var needRepaint = false;
        for (var p in conf) {
            if (conf.hasOwnProperty(p)) {
                if (p.slice(0, 3) === 'box') {
                    needRepaint = true;
                    break;
                }
            }
        }
        if (needRepaint) {
            this._refresh();
        }
        return _Marker.prototype.onConfig.call(this, conf);
    };

    TextMarker.prototype._getBoxSize = function _getBoxSize(symbol) {
        if (!symbol['markerType']) {
            symbol['markerType'] = 'square';
        }
        var size = splitTextToRow(this._content, symbol)['size'],
            width,
            height;
        if (this.options['boxAutoSize']) {
            var padding = this.options['boxPadding'];
            width = size['width'] + padding['width'] * 2;
            height = size['height'] + padding['height'] * 2;
        }
        if (this.options['boxMinWidth']) {
            if (!width || width < this.options['boxMinWidth']) {
                width = this.options['boxMinWidth'];
            }
        }
        if (this.options['boxMinHeight']) {
            if (!height || height < this.options['boxMinHeight']) {
                height = this.options['boxMinHeight'];
            }
        }
        return [width && height ? new Size(width, height) : null, size];
    };

    TextMarker.prototype._getInternalSymbol = function _getInternalSymbol() {
        return this._symbol;
    };

    TextMarker.prototype._getDefaultTextSymbol = function _getDefaultTextSymbol() {
        var s = {};
        extend(s, defaultSymbol);
        if (this.options['box']) {
            extend(s, defaultBoxSymbol);
        }
        return s;
    };

    TextMarker.prototype.onShapeChanged = function onShapeChanged() {
        this._refresh();
        _Marker.prototype.onShapeChanged.call(this);
    };

    return TextMarker;
}(Marker);

TextMarker.mergeOptions(options$12);

/**
 * @property {Object} [options=null]                   - textbox's options, also including options of [Marker]{@link Marker#options}
 * @property {Boolean} [options.boxAutoSize=false]     - whether to set the size of the box automatically to fit for the textbox's text.
 * @property {Boolean} [options.boxMinWidth=0]         - the minimum width of the box.
 * @property {Boolean} [options.boxMinHeight=0]        - the minimum height of the box.
 * @property {Boolean} [options.boxPadding={'width' : 12, 'height' : 8}] - padding of the text to the border of the box.
 * @memberOf TextBox
 * @instance
 */
var options$13 = {
    'boxAutoSize': false,
    'boxMinWidth': 0,
    'boxMinHeight': 0,
    'boxPadding': {
        'width': 12,
        'height': 8
    }
};

/**
 * @classdesc
 * Represents point type geometry for text boxes.<br>
 * A TextBox is used to draw a box with text inside on a particular coordinate.
 * @category geometry
 * @extends TextMarker
 * @mixes TextEditable
 * @param {String} content                          - TextBox's text content
 * @param {Coordinate} coordinates         - center
 * @param {Object} [options=null]                   - construct options defined in [TextBox]{@link TextBox#options}
 * @example
 * var textBox = new TextBox('This is a textBox',[100,0])
 *     .addTo(layer);
 */

var TextBox = function (_TextMarker) {
    inherits(TextBox, _TextMarker);

    function TextBox() {
        classCallCheck(this, TextBox);
        return possibleConstructorReturn(this, _TextMarker.apply(this, arguments));
    }

    TextBox.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var textBox = new TextBox(json['content'], feature['geometry']['coordinates'], json['options']);
        textBox.setProperties(feature['properties']);
        textBox.setId(feature['id']);
        return textBox;
    };

    TextBox.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'subType': 'TextBox',
            'content': this._content
        };
    };

    TextBox.prototype._refresh = function _refresh() {
        var symbol = this.getSymbol() || this._getDefaultTextSymbol();
        symbol['textName'] = this._content;

        var sizes = this._getBoxSize(symbol),
            boxSize = sizes[0],
            textSize = sizes[1];

        //if no boxSize then use text's size in default
        if (!boxSize && !symbol['markerWidth'] && !symbol['markerHeight']) {
            var padding = this.options['boxPadding'];
            var width = textSize['width'] + padding['width'] * 2,
                height = textSize['height'] + padding['height'] * 2;
            boxSize = new Size(width, height);
            symbol['markerWidth'] = boxSize['width'];
            symbol['markerHeight'] = boxSize['height'];
        } else if (boxSize) {
            symbol['markerWidth'] = boxSize['width'];
            symbol['markerHeight'] = boxSize['height'];
        }

        var textAlign = symbol['textHorizontalAlignment'];
        if (textAlign) {
            symbol['textDx'] = symbol['markerDx'] || 0;
            if (textAlign === 'left') {
                symbol['textDx'] -= symbol['markerWidth'] / 2;
            } else if (textAlign === 'right') {
                symbol['textDx'] += symbol['markerWidth'] / 2;
            }
        }

        var vAlign = symbol['textVerticalAlignment'];
        if (vAlign) {
            symbol['textDy'] = symbol['markerDy'] || 0;
            if (vAlign === 'top') {
                symbol['textDy'] -= symbol['markerHeight'] / 2;
            } else if (vAlign === 'bottom') {
                symbol['textDy'] += symbol['markerHeight'] / 2;
            }
        }

        this._symbol = symbol;
        this.onSymbolChanged();
    };

    TextBox.prototype._getInternalSymbol = function _getInternalSymbol() {
        //In TextBox, textHorizontalAlignment's meaning is textAlign in the box which is reversed from original textHorizontalAlignment.
        var textSymbol = extend({}, this._symbol);
        if (textSymbol['textHorizontalAlignment'] === 'left') {
            textSymbol['textHorizontalAlignment'] = 'right';
        } else if (textSymbol['textHorizontalAlignment'] === 'right') {
            textSymbol['textHorizontalAlignment'] = 'left';
        }
        if (textSymbol['textVerticalAlignment'] === 'top') {
            textSymbol['textVerticalAlignment'] = 'bottom';
        } else if (textSymbol['textVerticalAlignment'] === 'bottom') {
            textSymbol['textVerticalAlignment'] = 'top';
        }
        return textSymbol;
    };

    return TextBox;
}(TextMarker);

TextBox.mergeOptions(options$13);

TextBox.registerJSONType('TextBox');

/**
 * @property {Object} [options=null]                   - label's options, also including options of [Marker]{@link Marker#options}
 * @property {Boolean} [options.box=true]              - whether to display a background box wrapping the label text.
 * @property {Boolean} [options.boxAutoSize=true]      - whether to set the size of the background box automatically to fit for the label text.
 * @property {Boolean} [options.boxMinWidth=0]         - the minimum width of the background box.
 * @property {Boolean} [options.boxMinHeight=0]        - the minimum height of the background box.
 * @property {Boolean} [options.boxPadding={'width' : 12, 'height' : 8}] - padding of the label text to the border of the background box.
 * @property {Boolean} [options.boxTextAlign=middle]   - text align in the box, possible values:left, middle, right
 * @memberOf Label
 * @instance
 */
var options$14 = {
    'boxAutoSize': true,
    'boxMinWidth': 0,
    'boxMinHeight': 0,
    'boxPadding': {
        'width': 12,
        'height': 8
    },
    'boxTextAlign': 'middle'
};

/**
 * @classdesc
 * Represents point type geometry for text labels.<br>
 * A label is used to draw text (with a box background if specified) on a particular coordinate.
 * @category geometry
 * @extends TextMarker
 * @mixes TextEditable
 * @param {String} content                          - Label's text content
 * @param {Coordinate} coordinates         - center
 * @param {Object} [options=null]                   - construct options defined in [Label]{@link Label#options}
 * @example
 * var label = new Label('This is a label',[100,0])
 *     .addTo(layer);
 */

var Label = function (_TextMarker) {
    inherits(Label, _TextMarker);

    function Label() {
        classCallCheck(this, Label);
        return possibleConstructorReturn(this, _TextMarker.apply(this, arguments));
    }

    Label.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var label = new Label(json['content'], feature['geometry']['coordinates'], json['options']);
        label.setProperties(feature['properties']);
        label.setId(feature['id']);
        return label;
    };

    Label.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'subType': 'Label',
            'content': this._content
        };
    };

    Label.prototype._refresh = function _refresh() {
        var symbol = this.getSymbol() || this._getDefaultTextSymbol();
        symbol['textName'] = this._content;
        if (this.options['box']) {
            var sizes = this._getBoxSize(symbol),
                boxSize = sizes[0],
                textSize = sizes[1],
                padding = this.options['boxPadding'];

            //if no boxSize then use text's size in default
            if (!boxSize && !symbol['markerWidth'] && !symbol['markerHeight']) {
                var width = textSize['width'] + padding['width'] * 2,
                    height = textSize['height'] + padding['height'] * 2;
                boxSize = new Size(width, height);
                symbol['markerWidth'] = boxSize['width'];
                symbol['markerHeight'] = boxSize['height'];
            } else if (boxSize) {
                symbol['markerWidth'] = boxSize['width'];
                symbol['markerHeight'] = boxSize['height'];
            }

            var align = this.options['boxTextAlign'];
            if (align) {
                var textAlignPoint = getAlignPoint(textSize, symbol['textHorizontalAlignment'], symbol['textVerticalAlignment']),
                    dx = symbol['textDx'] || 0,
                    dy = symbol['textDy'] || 0;
                textAlignPoint = textAlignPoint._add(dx, dy);
                symbol['markerDx'] = textAlignPoint.x;
                symbol['markerDy'] = textAlignPoint.y + textSize['height'] / 2;
                if (align === 'left') {
                    symbol['markerDx'] += symbol['markerWidth'] / 2 - padding['width'];
                } else if (align === 'right') {
                    symbol['markerDx'] -= symbol['markerWidth'] / 2 - textSize['width'] - padding['width'];
                } else {
                    symbol['markerDx'] += textSize['width'] / 2;
                }
            }
        }
        this._symbol = symbol;
        this.onSymbolChanged();
    };

    return Label;
}(TextMarker);

Label.mergeOptions(options$14);

Label.registerJSONType('Label');

/**
 * Mixin of connector line methods.
 * @mixin Connectable
 * @private
 */
var Connectable = function Connectable(Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        _class._hasConnectors = function _hasConnectors(geometry) {
            return !isNil(geometry.__connectors) && geometry.__connectors.length > 0;
        };

        _class._getConnectors = function _getConnectors(geometry) {
            return geometry.__connectors;
        };

        /**
         * Gets the source of the connector line.
         * @return {Geometry|control.Control|UIComponent}
         * @function Connectable.getConnectSource
         */


        _class.prototype.getConnectSource = function getConnectSource() {
            return this._connSource;
        };

        /**
         * Sets the source to the connector line.
         * @param {Geometry|control.Control|UIComponent} src
         * @return {ConnectorLine} this
         * @function Connectable.setConnectSource
         */


        _class.prototype.setConnectSource = function setConnectSource(src) {
            var target = this._connTarget;
            this.onRemove();
            this._connSource = src;
            this._connTarget = target;
            this._updateCoordinates();
            this._registEvents();
            return this;
        };

        /**
         * Gets the target of the connector line.
         * @return {Geometry|control.Control|UIComponent}
         * @function Connectable.getConnectTarget
         */


        _class.prototype.getConnectTarget = function getConnectTarget() {
            return this._connTarget;
        };

        /**
         * Sets the target to the connector line.
         * @param {Geometry|control.Control|UIComponent} target
         * @return {ConnectorLine} this
         * @function Connectable.setConnectTarget
         */


        _class.prototype.setConnectTarget = function setConnectTarget(target) {
            var src = this._connSource;
            this.onRemove();
            this._connSource = src;
            this._connTarget = target;
            this._updateCoordinates();
            this._registEvents();
            return this;
        };

        _class.prototype._updateCoordinates = function _updateCoordinates() {
            var map = this.getMap();
            if (!map && this._connSource) {
                map = this._connSource.getMap();
            }
            if (!map && this._connTarget) {
                map = this._connTarget.getMap();
            }
            if (!map) {
                return;
            }
            if (!this._connSource || !this._connTarget) {
                return;
            }
            var srcPoints = this._connSource._getConnectPoints();
            var targetPoints = this._connTarget._getConnectPoints();
            var minDist = 0;
            var oldCoordinates = this.getCoordinates();
            var c1, c2;
            for (var i = 0, len = srcPoints.length; i < len; i++) {
                var p1 = srcPoints[i];
                for (var j = 0, length = targetPoints.length; j < length; j++) {
                    var p2 = targetPoints[j];
                    var dist = map.computeLength(p1, p2);
                    if (i === 0 && j === 0) {
                        c1 = p1;
                        c2 = p2;
                        minDist = dist;
                    } else if (dist < minDist) {
                        c1 = p1;
                        c2 = p2;
                    }
                }
            }
            if (!isArrayHasData(oldCoordinates) || !oldCoordinates[0].equals(c1) || !oldCoordinates[1].equals(c2)) {
                this.setCoordinates([c1, c2]);
            }
        };

        _class.prototype.onRemove = function onRemove() {
            if (this._connSource) {
                if (this._connSource.__connectors) {
                    removeFromArray(this, this._connSource.__connectors);
                }
                this._connSource.off('dragging positionchange', this._updateCoordinates, this).off('remove', this.onRemove, this);
                this._connSource.off('dragstart mousedown mouseover', this._showConnect, this);
                this._connSource.off('dragend mouseup mouseout', this.hide, this);
                this._connSource.off('show', this._showConnect, this).off('hide', this.hide, this);
                delete this._connSource;
            }
            if (this._connTarget) {
                removeFromArray(this, this._connTarget.__connectors);
                this._connTarget.off('dragging positionchange', this._updateCoordinates, this).off('remove', this.onRemove, this);
                this._connTarget.off('show', this._showConnect, this).off('hide', this.hide, this);
                delete this._connTarget;
            }
        };

        _class.prototype._showConnect = function _showConnect() {
            if (!this._connSource || !this._connTarget) {
                return;
            }
            if (this._connSource.isVisible() && this._connTarget.isVisible()) {
                this._updateCoordinates();
                this.show();
            }
        };

        _class.prototype._registEvents = function _registEvents() {
            if (!this._connSource || !this._connTarget) {
                return;
            }
            if (!this._connSource.__connectors) {
                this._connSource.__connectors = [];
            }
            if (!this._connTarget.__connectors) {
                this._connTarget.__connectors = [];
            }
            this._connSource.__connectors.push(this);
            this._connTarget.__connectors.push(this);
            this._connSource.on('dragging positionchange', this._updateCoordinates, this).on('remove', this.remove, this);
            this._connTarget.on('dragging positionchange', this._updateCoordinates, this).on('remove', this.remove, this);
            this._connSource.on('show', this._showConnect, this).on('hide', this.hide, this);
            this._connTarget.on('show', this._showConnect, this).on('hide', this.hide, this);
            var trigger = this.options['showOn'];
            this.hide();
            if (trigger === 'moving') {
                this._connSource.on('dragstart', this._showConnect, this).on('dragend', this.hide, this);
                this._connTarget.on('dragstart', this._showConnect, this).on('dragend', this.hide, this);
            } else if (trigger === 'click') {
                this._connSource.on('mousedown', this._showConnect, this).on('mouseup', this.hide, this);
                this._connTarget.on('mousedown', this._showConnect, this).on('mouseup', this.hide, this);
            } else if (trigger === 'mouseover') {
                this._connSource.on('mouseover', this._showConnect, this).on('mouseout', this.hide, this);
                this._connTarget.on('mouseover', this._showConnect, this).on('mouseout', this.hide, this);
            } else {
                this._showConnect();
            }
        };

        return _class;
    }(Base);
};

/**
 * @property {Object} options - ConnectorLine's options
 * @property {String} [options.showOn=always]  - when to show the connector line, possible values: 'moving', 'click', 'mouseover', 'always'
 * @memberOf ConnectorLine
 * @instance
 */
/**
 * @property {Object} options - ConnectorLine's options
 * @property {String} [options.showOn=always]  - when to show the connector line, possible values: 'moving', 'click', 'mouseover', 'always'
 * @memberOf ArcConnectorLine
 * @instance
 */
var options$15 = {
    showOn: 'always'
};

/**
 * A straight connector line geometry can connect geometries or ui components with each other. <br>
 *
 * @category geometry
 * @extends LineString
 * @example
 * var src = new Marker([0,0]).addTo(layer),
 *     dst = new Marker([1,0]).addTo(layer),
 *     line = new ConnectorLine(src, dst, {
 *         showOn : 'always', //'moving', 'click', 'mouseover', 'always'
 *         arrowStyle : 'classic',
 *         arrowPlacement : 'vertex-last', //vertex-first, vertex-last, vertex-firstlast, point
 *         symbol: {
 *           lineColor: '#34495e',
 *           lineWidth: 2
 *        }
 *     }).addTo(layer);
 * @mixes connectorLineMixin
 */

var ConnectorLine = function (_Connectable) {
    inherits(ConnectorLine, _Connectable);

    /**
     * @param {Geometry|control.Control|UIComponent} src     - source to connect
     * @param {Geometry|control.Control|UIComponent} target  - target to connect
     * @param {Object} [options=null]  - construct options defined in [ConnectorLine]{@link ConnectorLine#options}
     */
    function ConnectorLine(src, target, options) {
        classCallCheck(this, ConnectorLine);

        var _this2 = possibleConstructorReturn(this, _Connectable.call(this, null, options));

        if (arguments.length === 1) {
            options = src;
            src = null;
            target = null;
        }
        _this2._connSource = src;
        _this2._connTarget = target;
        _this2._registEvents();
        return _this2;
    }

    return ConnectorLine;
}(Connectable(LineString));

ConnectorLine.mergeOptions(options$15);

ConnectorLine.registerJSONType('ConnectorLine');

/**
 * An arc curve connector line geometry can connect geometries or ui components with each other. <br>
 *
 * @category geometry
 * @extends ArcCurve
 * @example
 * var src = new Marker([0,0]).addTo(layer),
 *     dst = new Marker([1,0]).addTo(layer),
 *     line = new ArcConnectorLine(src, dst, {
 *         arcDegree : 120,
 *         showOn : 'always', //'moving', 'click', 'mouseover', 'always'
 *         arrowStyle : 'classic',
 *         arrowPlacement : 'vertex-last', //vertex-first, vertex-last, vertex-firstlast, point
 *         symbol: {
 *           lineColor: '#34495e',
 *           lineWidth: 2
 *        }
 *     }).addTo(layer);
 * @mixes connectorLineMixin
 */

var ArcConnectorLine = function (_Connectable2) {
    inherits(ArcConnectorLine, _Connectable2);

    /**
     * @param {Geometry|control.Control|UIComponent} src     - source to connect
     * @param {Geometry|control.Control|UIComponent} target  - target to connect
     * @param {Object} [options=null]  - construct options defined in [ConnectorLine]{@link ConnectorLine#options}
     */
    function ArcConnectorLine(src, target, options) {
        classCallCheck(this, ArcConnectorLine);

        var _this3 = possibleConstructorReturn(this, _Connectable2.call(this, null, options));

        if (arguments.length === 1) {
            options = src;
            src = null;
            target = null;
        }
        _this3._connSource = src;
        _this3._connTarget = target;
        _this3._registEvents();
        return _this3;
    }

    return ArcConnectorLine;
}(Connectable(ArcCurve));

ArcConnectorLine.mergeOptions(options$15);

ArcConnectorLine.registerJSONType('ArcConnectorLine');

var EDIT_STAGE_LAYER_PREFIX = INTERNAL_LAYER_PREFIX + '_edit_stage_';

/**
 * Geometry editor used internally for geometry editing.
 * @category geometry
 * @protected
 * @extends Class
 * @mixes Eventable
 */

var GeometryEditor = function (_Eventable) {
    inherits(GeometryEditor, _Eventable);

    /**
     * @param {Geometry} geometry geometry to edit
     * @param {Object} [opts=null] options
     * @param {Object} [opts.symbol=null] symbol of being edited.
     */
    function GeometryEditor(geometry, opts) {
        classCallCheck(this, GeometryEditor);

        var _this = possibleConstructorReturn(this, _Eventable.call(this, opts));

        _this._geometry = geometry;
        if (!_this._geometry) {
            return possibleConstructorReturn(_this);
        }
        return _this;
    }

    /**
     * Get map
     * @return {Map} map
     */


    GeometryEditor.prototype.getMap = function getMap() {
        return this._geometry.getMap();
    };

    /**
     * Prepare to edit
     */


    GeometryEditor.prototype.prepare = function prepare() {
        var map = this.getMap();
        if (!map) {
            return;
        }
        /**
         * reserve the original symbol
         */
        if (this.options['symbol']) {
            this._originalSymbol = this._geometry.getSymbol();
            this._geometry.setSymbol(this.options['symbol']);
        }

        this._prepareEditStageLayer();
    };

    GeometryEditor.prototype._prepareEditStageLayer = function _prepareEditStageLayer() {
        var map = this.getMap();
        var uid = UID();
        this._editStageLayer = map.getLayer(EDIT_STAGE_LAYER_PREFIX + uid);
        if (!this._editStageLayer) {
            this._editStageLayer = new VectorLayer(EDIT_STAGE_LAYER_PREFIX + uid);
            map.addLayer(this._editStageLayer);
        }
    };

    /**
     * Start to edit
     */


    GeometryEditor.prototype.start = function start() {
        if (!this._geometry || !this._geometry.getMap() || this._geometry.editing) {
            return;
        }
        this.editing = true;
        var geometry = this._geometry;
        this._geometryDraggble = geometry.options['draggable'];
        geometry.config('draggable', false);
        this.prepare();
        //edits are applied to a shadow of geometry to improve performance.
        var shadow = geometry.copy();
        shadow.setSymbol(geometry._getInternalSymbol());
        //geometry copy没有将event复制到新建的geometry,对于编辑这个功能会存在一些问题
        //原geometry上可能绑定了其它监听其click/dragging的事件,在编辑时就无法响应了.
        shadow.copyEventListeners(geometry);
        if (geometry._getParent()) {
            shadow.copyEventListeners(geometry._getParent());
        }
        //drag shadow by center handle instead.
        shadow.setId(null).config({
            'draggable': false
        });

        this._shadow = shadow;

        this._switchGeometryEvents('on');

        geometry.hide();
        if (geometry instanceof Marker || geometry instanceof Circle || geometry instanceof Rectangle || geometry instanceof Ellipse) {
            //ouline has to be added before shadow to let shadow on top of it, otherwise shadow's events will be overrided by outline
            this._createOrRefreshOutline();
        }
        this._editStageLayer.bringToFront().addGeometry(shadow);
        if (!(geometry instanceof Marker)) {
            this._createCenterHandle();
        } else {
            shadow.config('draggable', true);
            shadow.on('dragend', this._onShadowDragEnd, this);
        }
        if (geometry instanceof Marker) {
            this.createMarkerEditor();
        } else if (geometry instanceof Circle) {
            this.createCircleEditor();
        } else if (geometry instanceof Rectangle) {
            this.createEllipseOrRectEditor();
        } else if (geometry instanceof Ellipse) {
            this.createEllipseOrRectEditor();
        } else if (geometry instanceof Sector) {
            // TODO: createSectorEditor
        } else if (geometry instanceof Polygon || geometry instanceof LineString) {
            this.createPolygonEditor();
        }
    };

    /**
     * Stop editing
     */


    GeometryEditor.prototype.stop = function stop() {
        this._switchGeometryEvents('off');
        var map = this.getMap();
        if (!map) {
            return;
        }
        if (this._shadow) {
            this._update();
            this._shadow._clearAllListeners();
            this._shadow.remove();
            delete this._shadow;
        }
        this._geometry.config('draggable', this._geometryDraggble);
        delete this._geometryDraggble;
        this._geometry.show();

        this._editStageLayer.remove();
        if (isArrayHasData(this._eventListeners)) {
            for (var i = this._eventListeners.length - 1; i >= 0; i--) {
                var listener = this._eventListeners[i];
                listener[0].off(listener[1], listener[2], this);
            }
            this._eventListeners = [];
        }
        this._refreshHooks = [];
        if (this.options['symbol']) {
            this._geometry.setSymbol(this._originalSymbol);
            delete this._originalSymbol;
        }
        this.editing = false;
    };

    /**
     * Whether the editor is editing
     * @return {Boolean}
     */


    GeometryEditor.prototype.isEditing = function isEditing() {
        if (isNil(this.editing)) {
            return false;
        }
        return this.editing;
    };

    GeometryEditor.prototype._getGeometryEvents = function _getGeometryEvents() {
        return {
            'symbolchange': this._onGeometrySymbolChange
        };
    };

    GeometryEditor.prototype._switchGeometryEvents = function _switchGeometryEvents(oper) {
        if (this._geometry) {
            var events = this._getGeometryEvents();
            for (var p in events) {
                this._geometry[oper](p, events[p], this);
            }
        }
    };

    GeometryEditor.prototype._onGeometrySymbolChange = function _onGeometrySymbolChange(param) {
        if (this._shadow) {
            this._shadow.setSymbol(param['target']._getInternalSymbol());
        }
    };

    GeometryEditor.prototype._onShadowDragEnd = function _onShadowDragEnd() {
        this._update();
        this._refresh();
    };

    GeometryEditor.prototype._update = function _update() {
        //update geographical properties from shadow to geometry
        this._geometry.setCoordinates(this._shadow.getCoordinates());
        if (this._geometry.getRadius) {
            this._geometry.setRadius(this._shadow.getRadius());
        }
        if (this._geometry.getWidth) {
            this._geometry.setWidth(this._shadow.getWidth());
        }
        if (this._geometry.getHeight) {
            this._geometry.setHeight(this._shadow.getHeight());
        }
        if (this._geometry.getStartAngle) {
            this._geometry.setStartAngle(this._shadow.getStartAngle());
        }
        if (this._geometry.getEndAngle) {
            this._geometry.setEndAngle(this._shadow.getEndAngle());
        }
    };

    GeometryEditor.prototype._updateAndFireEvent = function _updateAndFireEvent(eventName) {
        if (!this._shadow) {
            return;
        }
        this._update();
        this._geometry.fire(eventName);
    };

    /**
     * create rectangle outline of the geometry
     * @private
     */


    GeometryEditor.prototype._createOrRefreshOutline = function _createOrRefreshOutline() {
        var geometry = this._geometry,
            map = this.getMap(),
            outline = this._editOutline;
        var pixelExtent = geometry._getPainter().get2DExtent(),
            size = pixelExtent.getSize();
        var nw = map.pointToCoordinate(pixelExtent.getMin());
        var width = map.pixelToDistance(size['width'], 0),
            height = map.pixelToDistance(0, size['height']);
        if (!outline) {
            outline = new Rectangle(nw, width, height, {
                'symbol': {
                    'lineWidth': 1,
                    'lineColor': '6b707b'
                }
            });
            this._editStageLayer.addGeometry(outline);
            this._editOutline = outline;
            this._addRefreshHook(this._createOrRefreshOutline);
        } else {
            outline.setCoordinates(nw);
            outline.setWidth(width);
            outline.setHeight(height);
        }

        return outline;
    };

    GeometryEditor.prototype._createCenterHandle = function _createCenterHandle() {
        var _this2 = this;

        var center = this._shadow.getCenter();
        var shadow;
        var handle = this.createHandle(center, {
            'markerType': 'ellipse',
            'dxdy': new Point(0, 0),
            'cursor': 'move',
            onDown: function onDown() {
                shadow = _this2._shadow.copy();
                var symbol = lowerSymbolOpacity(shadow._getInternalSymbol(), 0.5);
                shadow.setSymbol(symbol).addTo(_this2._editStageLayer);
            },
            onMove: function onMove(v, param) {
                var dragOffset = param['dragOffset'];
                if (shadow) {
                    shadow.translate(dragOffset);
                    _this2._geometry.translate(dragOffset);
                }
            },
            onUp: function onUp() {
                if (shadow) {
                    _this2._shadow.setCoordinates(_this2._geometry.getCoordinates());
                    shadow.remove();
                    _this2._refresh();
                }
            }
        });
        this._addRefreshHook(function () {
            var center = _this2._shadow.getCenter();
            handle.setCoordinates(center);
        });
    };

    GeometryEditor.prototype._createHandleInstance = function _createHandleInstance(coordinate, opts) {
        var symbol = {
            'markerType': opts['markerType'],
            'markerFill': '#ffffff', //"#d0d2d6",
            'markerLineColor': '#000000',
            'markerLineWidth': 2,
            'markerWidth': 10,
            'markerHeight': 10,
            'markerDx': opts['dxdy'].x,
            'markerDy': opts['dxdy'].y
        };
        if (opts['symbol']) {
            extend(symbol, opts['symbol']);
        }
        var handle = new Marker(coordinate, {
            'draggable': true,
            'dragShadow': false,
            'dragOnAxis': opts['axis'],
            'cursor': opts['cursor'],
            'symbol': symbol
        });
        return handle;
    };

    GeometryEditor.prototype.createHandle = function createHandle(coordinate, opts) {
        if (!opts) {
            opts = {};
        }
        var map = this.getMap();
        var handle = this._createHandleInstance(coordinate, opts);
        var me = this;

        function onHandleDragstart(param) {
            if (opts.onDown) {
                opts.onDown.call(me, param['viewPoint'], param);
            }
        }

        function onHandleDragging(param) {
            me._hideContext();
            var viewPoint = map._prjToViewPoint(handle._getPrjCoordinates());
            if (opts.onMove) {
                opts.onMove.call(me, viewPoint, param);
            }
        }

        function onHandleDragEnd(ev) {
            if (opts.onUp) {
                opts.onUp.call(me, ev);
            }
        }
        handle.on('dragstart', onHandleDragstart, this);
        handle.on('dragging', onHandleDragging, this);
        handle.on('dragend', onHandleDragEnd, this);
        //拖动移图
        if (opts.onRefresh) {
            handle['maptalks--editor-refresh-fn'] = opts.onRefresh;
        }
        this._editStageLayer.addGeometry(handle);
        return handle;
    };

    /**
     * create resize handles for geometry that can resize.
     * @param {Array} blackList handle indexes that doesn't display, to prevent change a geometry's coordinates
     * @param {fn} onHandleMove callback
     * @private
     */


    GeometryEditor.prototype._createResizeHandles = function _createResizeHandles(blackList, onHandleMove) {
        var _this3 = this;

        //cursor styles.
        var cursors = ['nw-resize', 'n-resize', 'ne-resize', 'w-resize', 'e-resize', 'sw-resize', 's-resize', 'se-resize'];
        //defines dragOnAxis of resize handle
        var axis = [null, 'y', null, 'x', 'x', null, 'y', null];
        var geometry = this._geometry;

        function getResizeAnchors(ext) {
            return [ext.getMin(), new Point((ext['xmax'] + ext['xmin']) / 2, ext['ymin']), new Point(ext['xmax'], ext['ymin']), new Point(ext['xmin'], (ext['ymax'] + ext['ymin']) / 2), new Point(ext['xmax'], (ext['ymax'] + ext['ymin']) / 2), new Point(ext['xmin'], ext['ymax']), new Point((ext['xmax'] + ext['xmin']) / 2, ext['ymax']), ext.getMax()];
        }
        if (!blackList) {
            blackList = [];
        }
        var resizeHandles = [];
        var anchorIndexes = {};
        var map = this.getMap();
        var fnLocateHandles = function fnLocateHandles() {
            var pExt = geometry._getPainter().get2DExtent(),
                anchors = getResizeAnchors(pExt);

            var _loop = function _loop(i) {
                //ignore anchors in blacklist
                if (Array.isArray(blackList)) {
                    var isBlack = blackList.some(function (ele) {
                        return ele === i;
                    });
                    if (isBlack) {
                        return 'continue';
                    }
                }
                var anchor = anchors[i],
                    coordinate = map.pointToCoordinate(anchor);
                if (resizeHandles.length < anchors.length - blackList.length) {
                    var handle = _this3.createHandle(coordinate, {
                        'markerType': 'square',
                        'dxdy': new Point(0, 0),
                        'cursor': cursors[i],
                        'axis': axis[i],
                        onMove: function (_index) {
                            return function (handleViewPoint) {
                                onHandleMove(handleViewPoint, _index);
                            };
                        }(i),
                        onUp: function onUp() {
                            _this3._refresh();
                        }
                    });
                    handle.setId(i);
                    anchorIndexes[i] = resizeHandles.length;
                    resizeHandles.push(handle);
                } else {
                    resizeHandles[anchorIndexes[i]].setCoordinates(coordinate);
                }
            };

            for (var i = 0; i < anchors.length; i++) {
                var _ret = _loop(i);

                if (_ret === 'continue') continue;
            }
        };

        fnLocateHandles();
        //refresh hooks to refresh handles' coordinates
        this._addRefreshHook(fnLocateHandles);
        return resizeHandles;
    };

    /**
     * Create marker editor
     * @private
     */


    GeometryEditor.prototype.createMarkerEditor = function createMarkerEditor() {
        var marker = this._shadow,
            geometryToEdit = this._geometry,
            map = this.getMap();
        var resizeHandles;

        function onZoomStart() {
            if (Array.isArray(resizeHandles)) {
                for (var i = resizeHandles.length - 1; i >= 0; i--) {
                    resizeHandles[i].hide();
                }
            }
            if (this._editOutline) {
                this._editOutline.hide();
            }
        }

        function onZoomEnd() {
            this._refresh();
            if (Array.isArray(resizeHandles)) {
                for (var i = resizeHandles.length - 1; i >= 0; i--) {
                    resizeHandles[i].show();
                }
            }
            if (this._editOutline) {
                this._editOutline.show();
            }
        }
        if (!marker._canEdit()) {
            if (console) {
                console.warn('A marker can\'t be resized with symbol:', marker.getSymbol());
            }
            return;
        }
        //only image marker and vector marker can be edited now.

        var symbol = marker._getInternalSymbol();
        var dxdy = new Point(0, 0);
        if (isNumber(symbol['markerDx'])) {
            dxdy.x = symbol['markerDx'];
        }
        if (isNumber(symbol['markerDy'])) {
            dxdy.y = symbol['markerDy'];
        }

        var blackList = null;

        if (VectorMarkerSymbolizer.test(symbol)) {
            if (symbol['markerType'] === 'pin' || symbol['markerType'] === 'pie' || symbol['markerType'] === 'bar') {
                //as these types of markers' anchor stands on its bottom
                blackList = [5, 6, 7];
            }
        } else if (ImageMarkerSymbolizer.test(symbol) || VectorPathMarkerSymbolizer.test(symbol)) {
            blackList = [5, 6, 7];
        }

        //defines what can be resized by the handle
        //0: resize width; 1: resize height; 2: resize both width and height.
        var resizeAbilities = [2, 1, 2, 0, 0, 2, 1, 2];

        var aspectRatio;
        if (this.options['fixAspectRatio']) {
            var size = marker.getSize();
            aspectRatio = size.width / size.height;
        }

        resizeHandles = this._createResizeHandles(null, function (handleViewPoint, i) {
            if (blackList && blackList.indexOf(i) >= 0) {
                //need to change marker's coordinates
                var newCoordinates = map.viewPointToCoordinate(handleViewPoint.substract(dxdy));
                var coordinates = marker.getCoordinates();
                newCoordinates.x = coordinates.x;
                marker.setCoordinates(newCoordinates);
                geometryToEdit.setCoordinates(newCoordinates);
                //coordinates changed, and use mirror handle instead to caculate width and height
                var mirrorHandle = resizeHandles[resizeHandles.length - 1 - i];
                var mirrorViewPoint = map.coordinateToViewPoint(mirrorHandle.getCoordinates());
                handleViewPoint = mirrorViewPoint;
            }

            //caculate width and height
            var viewCenter = map._pointToViewPoint(marker._getCenter2DPoint()).add(dxdy),
                symbol = marker._getInternalSymbol();
            var wh = handleViewPoint.substract(viewCenter);
            if (blackList && handleViewPoint.y > viewCenter.y) {
                wh.y = 0;
            }

            //if this marker's anchor is on its bottom, height doesn't need to multiply by 2.
            var r = blackList ? 1 : 2;
            var width = Math.abs(wh.x) * 2,
                height = Math.abs(wh.y) * r;
            if (aspectRatio) {
                width = Math.max(width, height * aspectRatio);
                height = width / aspectRatio;
            }
            var ability = resizeAbilities[i];
            if (!(marker instanceof TextMarker)) {
                if (aspectRatio || ability === 0 || ability === 2) {
                    symbol['markerWidth'] = width;
                }
                if (aspectRatio || ability === 1 || ability === 2) {
                    symbol['markerHeight'] = height;
                }
                marker.setSymbol(symbol);
                geometryToEdit.setSymbol(symbol);
            } else {
                if (aspectRatio || ability === 0 || ability === 2) {
                    geometryToEdit.config('boxMinWidth', width);
                    marker.config('boxMinWidth', width);
                }
                if (aspectRatio || ability === 1 || ability === 2) {
                    geometryToEdit.config('boxMinHeight', height);
                    marker.config('boxMinHeight', height);
                }
            }
        });
        this._addListener([map, 'zoomstart', onZoomStart]);
        this._addListener([map, 'zoomend', onZoomEnd]);
    };

    /**
     * Create circle editor
     * @private
     */


    GeometryEditor.prototype.createCircleEditor = function createCircleEditor() {
        var shadow = this._shadow,
            circle = this._geometry;
        var map = this.getMap();
        this._createResizeHandles(null, function (handleViewPoint) {
            var viewCenter = map._pointToViewPoint(shadow._getCenter2DPoint());
            var wh = handleViewPoint.substract(viewCenter);
            var w = Math.abs(wh.x),
                h = Math.abs(wh.y);
            var r;
            if (w > h) {
                r = map.pixelToDistance(w, 0);
            } else {
                r = map.pixelToDistance(0, h);
            }
            shadow.setRadius(r);
            circle.setRadius(r);
        });
    };

    /**
     * editor of ellipse or rectangle
     * @private
     */


    GeometryEditor.prototype.createEllipseOrRectEditor = function createEllipseOrRectEditor() {
        //defines what can be resized by the handle
        //0: resize width; 1: resize height; 2: resize both width and height.
        var resizeAbilities = [2, 1, 2, 0, 0, 2, 1, 2];
        var shadow = this._shadow,
            geometryToEdit = this._geometry;
        var map = this.getMap();
        var isRect = this._geometry instanceof Rectangle;
        var aspectRatio;
        if (this.options['fixAspectRatio']) {
            aspectRatio = geometryToEdit.getWidth() / geometryToEdit.getHeight();
        }
        var resizeHandles = this._createResizeHandles(null, function (mouseViewPoint, i) {
            //ratio of width and height
            var r = isRect ? 1 : 2;
            var pointSub, w, h;
            var targetPoint = mouseViewPoint;
            var ability = resizeAbilities[i];
            if (isRect) {
                var mirror = resizeHandles[7 - i];
                var mirrorViewPoint = map.coordinateToViewPoint(mirror.getCoordinates());
                pointSub = targetPoint.substract(mirrorViewPoint);
                var absSub = pointSub.abs();
                w = map.pixelToDistance(absSub.x, 0);
                h = map.pixelToDistance(0, absSub.y);
                var size = geometryToEdit.getSize();
                if (ability === 0) {
                    // changing width
                    // -  -  -
                    // 0     0
                    // -  -  -
                    // Rectangle's northwest's y is (y - height / 2)
                    if (aspectRatio) {
                        // update rectangle's height with aspect ratio
                        absSub.y = absSub.x / aspectRatio;
                        size.height = Math.abs(absSub.y);
                        h = w / aspectRatio;
                    }
                    targetPoint.y = mirrorViewPoint.y - size.height / 2;
                } else if (ability === 1) {
                    // changing height
                    // -  1  -
                    // |     |
                    // -  1  -
                    // Rectangle's northwest's x is (x - width / 2)
                    if (aspectRatio) {
                        // update rectangle's width with aspect ratio
                        absSub.x = absSub.y * aspectRatio;
                        size.width = Math.abs(absSub.x);
                        w = h * aspectRatio;
                    }
                    targetPoint.x = mirrorViewPoint.x - size.width / 2;
                } else if (aspectRatio) {
                    // corner handles, relocate the target point according to aspect ratio.
                    if (w > h * aspectRatio) {
                        h = w / aspectRatio;
                        targetPoint.y = mirrorViewPoint.y + absSub.x * sign(pointSub.y) / aspectRatio;
                    } else {
                        w = h * aspectRatio;
                        targetPoint.x = mirrorViewPoint.x + absSub.y * sign(pointSub.x) * aspectRatio;
                    }
                }
                //change rectangle's coordinates
                var newCoordinates = map.viewPointToCoordinate(new Point(Math.min(targetPoint.x, mirrorViewPoint.x), Math.min(targetPoint.y, mirrorViewPoint.y)));
                shadow.setCoordinates(newCoordinates);
                geometryToEdit.setCoordinates(newCoordinates);
            } else {
                var viewCenter = map.coordinateToViewPoint(geometryToEdit.getCenter());
                pointSub = viewCenter.substract(targetPoint)._abs();
                w = map.pixelToDistance(pointSub.x, 0);
                h = map.pixelToDistance(0, pointSub.y);
                if (aspectRatio) {
                    w = Math.max(w, h * aspectRatio);
                    h = w / aspectRatio;
                }
            }

            if (aspectRatio || ability === 0 || ability === 2) {
                shadow.setWidth(w * r);
                geometryToEdit.setWidth(w * r);
            }
            if (aspectRatio || ability === 1 || ability === 2) {
                shadow.setHeight(h * r);
                geometryToEdit.setHeight(h * r);
            }
        });
    };

    /**
     * Editor for polygon
     * @private
     */


    GeometryEditor.prototype.createPolygonEditor = function createPolygonEditor() {

        var map = this.getMap(),
            shadow = this._shadow,
            me = this,
            projection = map.getProjection();
        var verticeLimit = shadow instanceof Polygon ? 3 : 2;
        var propertyOfVertexRefreshFn = 'maptalks--editor-refresh-fn',
            propertyOfVertexIndex = 'maptalks--editor-vertex-index';
        var vertexHandles = [],
            newVertexHandles = [];

        function getVertexCoordinates() {
            if (shadow instanceof Polygon) {
                var coordinates = shadow.getCoordinates()[0];
                return coordinates.slice(0, coordinates.length - 1);
            } else {
                return shadow.getCoordinates();
            }
        }

        function getVertexPrjCoordinates() {
            return shadow._getPrjCoordinates();
        }

        function onVertexAddOrRemove() {
            //restore index property of each handles.
            for (var i = vertexHandles.length - 1; i >= 0; i--) {
                vertexHandles[i][propertyOfVertexIndex] = i;
            }
            for (var _i = newVertexHandles.length - 1; _i >= 0; _i--) {
                newVertexHandles[_i][propertyOfVertexIndex] = _i;
            }
        }

        function removeVertex(param) {
            var handle = param['target'],
                index = handle[propertyOfVertexIndex];
            var prjCoordinates = getVertexPrjCoordinates();
            if (prjCoordinates.length <= verticeLimit) {
                return;
            }
            prjCoordinates.splice(index, 1);
            shadow._setPrjCoordinates(prjCoordinates);
            shadow._updateCache();
            //remove vertex handle
            vertexHandles.splice(index, 1)[0].remove();
            //remove two neighbor "new vertex" handles
            if (index < newVertexHandles.length) {
                newVertexHandles.splice(index, 1)[0].remove();
            }
            var nextIndex;
            if (index === 0) {
                nextIndex = newVertexHandles.length - 1;
            } else {
                nextIndex = index - 1;
            }
            newVertexHandles.splice(nextIndex, 1)[0].remove();
            //add a new "new vertex" handle.
            newVertexHandles.splice(nextIndex, 0, createNewVertexHandle.call(me, nextIndex));
            onVertexAddOrRemove();
        }

        function moveVertexHandle(handleViewPoint, index) {
            var vertice = getVertexPrjCoordinates();
            var nVertex = map._viewPointToPrj(handleViewPoint);
            var pVertex = vertice[index];
            pVertex.x = nVertex.x;
            pVertex.y = nVertex.y;
            shadow._updateCache();
            shadow.onShapeChanged();
            var nextIndex;
            if (index === 0) {
                nextIndex = newVertexHandles.length - 1;
            } else {
                nextIndex = index - 1;
            }
            //refresh two neighbor "new vertex" handles.
            if (newVertexHandles[index]) {
                newVertexHandles[index][propertyOfVertexRefreshFn]();
            }
            if (newVertexHandles[nextIndex]) {
                newVertexHandles[nextIndex][propertyOfVertexRefreshFn]();
            }

            me._updateAndFireEvent('shapechange');
        }

        function createVertexHandle(index) {
            var vertex = getVertexCoordinates()[index];
            var handle = me.createHandle(vertex, {
                'markerType': 'square',
                'dxdy': new Point(0, 0),
                'cursor': 'pointer',
                'axis': null,
                onMove: function onMove(handleViewPoint) {
                    moveVertexHandle(handleViewPoint, handle[propertyOfVertexIndex]);
                },
                onRefresh: function onRefresh() {
                    vertex = getVertexCoordinates()[handle[propertyOfVertexIndex]];
                    handle.setCoordinates(vertex);
                },
                onUp: function onUp() {
                    me._refresh();
                }
            });
            handle[propertyOfVertexIndex] = index;
            handle.on('contextmenu', removeVertex);
            return handle;
        }

        function createNewVertexHandle(index) {
            var vertexCoordinates = getVertexCoordinates();
            var nextVertex;
            if (index + 1 >= vertexCoordinates.length) {
                nextVertex = vertexCoordinates[0];
            } else {
                nextVertex = vertexCoordinates[index + 1];
            }
            var vertex = vertexCoordinates[index].add(nextVertex).multi(1 / 2);
            var handle = me.createHandle(vertex, {
                'markerType': 'square',
                'symbol': {
                    'opacity': 0.4
                },
                'dxdy': new Point(0, 0),
                'cursor': 'pointer',
                'axis': null,
                onDown: function onDown() {
                    var prjCoordinates = getVertexPrjCoordinates();
                    var vertexIndex = handle[propertyOfVertexIndex];
                    //add a new vertex
                    var pVertex = projection.project(handle.getCoordinates());
                    //update shadow's vertice
                    prjCoordinates.splice(vertexIndex + 1, 0, pVertex);
                    shadow._setPrjCoordinates(prjCoordinates);
                    shadow._updateCache();

                    var symbol = handle.getSymbol();
                    delete symbol['opacity'];
                    handle.setSymbol(symbol);

                    //add two "new vertex" handles
                    newVertexHandles.splice(vertexIndex, 0, createNewVertexHandle.call(me, vertexIndex), createNewVertexHandle.call(me, vertexIndex + 1));
                    me._updateAndFireEvent('shapechange');
                },
                onMove: function onMove(handleViewPoint) {
                    moveVertexHandle(handleViewPoint, handle[propertyOfVertexIndex] + 1);
                },
                onUp: function onUp() {
                    var vertexIndex = handle[propertyOfVertexIndex];
                    //remove this handle
                    removeFromArray(handle, newVertexHandles);
                    handle.remove();
                    //add a new vertex handle
                    vertexHandles.splice(vertexIndex + 1, 0, createVertexHandle.call(me, vertexIndex + 1));
                    onVertexAddOrRemove();
                },
                onRefresh: function onRefresh() {
                    vertexCoordinates = getVertexCoordinates();
                    var vertexIndex = handle[propertyOfVertexIndex];
                    var nextIndex;
                    if (vertexIndex === vertexCoordinates.length - 1) {
                        nextIndex = 0;
                    } else {
                        nextIndex = vertexIndex + 1;
                    }
                    var refreshVertex = vertexCoordinates[vertexIndex].add(vertexCoordinates[nextIndex]).multi(1 / 2);
                    handle.setCoordinates(refreshVertex);
                }
            });
            handle[propertyOfVertexIndex] = index;
            return handle;
        }
        var vertexCoordinates = getVertexCoordinates();
        for (var i = 0, len = vertexCoordinates.length; i < len; i++) {
            vertexHandles.push(createVertexHandle.call(this, i));
            if (i < len - 1) {
                newVertexHandles.push(createNewVertexHandle.call(this, i));
            }
        }
        if (shadow instanceof Polygon) {
            //1 more vertex handle for polygon
            newVertexHandles.push(createNewVertexHandle.call(this, vertexCoordinates.length - 1));
        }
        this._addRefreshHook(function () {
            for (var _i2 = newVertexHandles.length - 1; _i2 >= 0; _i2--) {
                newVertexHandles[_i2][propertyOfVertexRefreshFn]();
            }
            for (var _i3 = vertexHandles.length - 1; _i3 >= 0; _i3--) {
                vertexHandles[_i3][propertyOfVertexRefreshFn]();
            }
        });
    };

    GeometryEditor.prototype._refresh = function _refresh() {
        if (this._refreshHooks) {
            for (var i = this._refreshHooks.length - 1; i >= 0; i--) {
                this._refreshHooks[i].call(this);
            }
        }
    };

    GeometryEditor.prototype._hideContext = function _hideContext() {
        if (this._geometry) {
            this._geometry.closeMenu();
            this._geometry.closeInfoWindow();
        }
    };

    GeometryEditor.prototype._addListener = function _addListener(listener) {
        if (!this._eventListeners) {
            this._eventListeners = [];
        }
        this._eventListeners.push(listener);
        listener[0].on(listener[1], listener[2], this);
    };

    GeometryEditor.prototype._addRefreshHook = function _addRefreshHook(fn) {
        if (!fn) {
            return;
        }
        if (!this._refreshHooks) {
            this._refreshHooks = [];
        }
        this._refreshHooks.push(fn);
    };

    return GeometryEditor;
}(Eventable(Class));

/**
 * @property {Object} options
 * @property {Boolean} [options.eventsToStop='mousedown dblclick']  - UI's dom events to stop propagation.
 * @property {Number}  [options.dx=0]     - pixel offset on x axis
 * @property {Number}  [options.dy=0]     - pixel offset on y axis
 * @property {Boolean} [options.autoPan=false]  - set it to false if you don't want the map to do panning animation to fit the opened UI.
 * @property {Boolean} [options.autoPanDuration=600]    - duration for auto panning animation.
 * @property {Boolean} [options.single=true]    - whether the UI is a global single one, only one UI will be shown at the same time if set to true.
 * @property {Boolean} [options.animation=null]         - fade | scale | fade,scale, add animation effect when showing and hiding.
 * @property {Number}  [options.animationDuration=300]  - animation duration, in milliseconds.
 * @property {Number}  [options.animationDelay=0]       - time delay for animation, in milliseconds.
 * @memberOf ui.UIComponent
 * @instance
 */
var options$16 = {
    'eventsToStop': 'mousedown dblclick',
    'dx': 0,
    'dy': 0,
    'autoPan': false,
    'autoPanDuration': 600,
    'single': true,
    'animation': 'scale',
    'animationOnHide': true,
    'animationDuration': 500,
    'animationDelay': 0
};

/**
 * @classdesc
 * Base class for all the UI component classes, a UI component is a HTMLElement positioned with geographic coordinate. <br>
 * It is abstract and not intended to be instantiated.
 *
 * @category ui
 * @abstract
 * @mixes Eventable
 * @memberOf ui
 * @extends Class
 */

var UIComponent = function (_Eventable) {
    inherits(UIComponent, _Eventable);

    /**
     *  Some instance methods subclasses needs to implement:  <br>
     *  <br>
     * 1. Optional, returns the Dom element's position offset  <br>
     * function getOffset : Point  <br>
     *  <br>
     * 2. Method to create UI's Dom element  <br>
     * function buildOn : HTMLElement  <br>
     *  <br>
     * 3 Optional, to provide an event map to register event listeners.  <br>
     * function getEvents : void  <br>
     * 4 Optional, a callback when dom is removed.  <br>
     * function onDomRemove : void  <br>
     * 5 Optional, a callback when UI Component is removed.  <br>
     * function onRemove : void  <br>
     * @param  {Object} options configuration options
     */
    function UIComponent(options) {
        classCallCheck(this, UIComponent);
        return possibleConstructorReturn(this, _Eventable.call(this, options));
    }

    /**
     * Adds the UI Component to a geometry or a map
     * @param {Geometry|Map} owner - geometry or map to addto.
     * @returns {ui.UIComponent} this
     * @fires ui.UIComponent#add
     */


    UIComponent.prototype.addTo = function addTo(owner) {
        this._owner = owner;
        /**
         * add event.
         *
         * @event ui.UIComponent#add
         * @type {Object}
         * @property {String} type - add
         * @property {ui.UIComponent} target - UIComponent
         */
        this.fire('add');
        return this;
    };

    /**
     * Get the map it added to
     * @return {Map} map instance
     * @override
     */


    UIComponent.prototype.getMap = function getMap() {
        if (!this._owner) {
            return null;
        }
        // is a map
        if (this._owner.getBaseLayer) {
            return this._owner;
        }
        return this._owner.getMap();
    };

    /**
     * Show the UI Component, if it is a global single one, it will close previous one.
     * @param {Coordinate} [coordinate=null] - coordinate to show, default is owner's center
     * @return {ui.UIComponent} this
     * @fires ui.UIComponent#showstart
     * @fires ui.UIComponent#showend
     */


    UIComponent.prototype.show = function show(coordinate) {
        var map = this.getMap();
        if (!map) {
            return this;
        }
        coordinate = coordinate || this._coordinate || this._owner.getCenter();
        /**
         * showstart event.
         *
         * @event ui.UIComponent#showstart
         * @type {Object}
         * @property {String} type - showstart
         * @property {ui.UIComponent} target - UIComponent
         */
        this.fire('showstart');
        var container = this._getUIContainer();
        if (!this.__uiDOM) {
            // first time
            this._switchEvents('on');
        }
        this._coordinate = coordinate;
        this._removePrevDOM();
        var dom = this.__uiDOM = this.buildOn(map);

        if (!dom) {
            /**
             * showend event.
             *
             * @event ui.UIComponent#showend
             * @type {Object}
             * @property {String} type - showend
             * @property {ui.UIComponent} target - UIComponent
             */
            this.fire('showend');
            return this;
        }

        this._measureSize(dom);

        if (this._singleton()) {
            map[this._uiDomKey()] = dom;
        }

        var point = this.getPosition();

        dom.style.position = 'absolute';
        dom.style.left = point.x + 'px';
        dom.style.top = point.y + 'px';

        dom.style[TRANSITION] = null;

        container.appendChild(dom);

        var anim = this._getAnimation();

        if (anim.fade) {
            dom.style.opacity = 0;
        }
        if (anim.scale) {
            if (this.getTransformOrigin) {
                var origin = this.getTransformOrigin();
                dom.style[TRANSFORMORIGIN] = origin.x + 'px ' + origin.y + 'px';
            }
            dom.style[TRANSFORM] = 'scale(0)';
        }

        dom.style.display = '';

        if (this.options['eventsToStop']) {
            on(dom, this.options['eventsToStop'], stopPropagation);
        }

        //autoPan
        if (this.options['autoPan']) {
            this._autoPan();
        }

        var transition = anim.transition;
        if (transition) {
            var animFn = function animFn() {
                if (transition) {
                    dom.style[TRANSITION] = transition;
                }
                if (anim.fade) {
                    dom.style.opacity = 1;
                }
                if (anim.scale) {
                    dom.style[TRANSFORM] = 'scale(1)';
                }
            };
            setTimeout(animFn, this.options['animationDelay'] || 1);
        }

        this.fire('showend');
        return this;
    };

    /**
     * Hide the UI Component.
     * @return {ui.UIComponent} this
     * @fires ui.UIComponent#hide
     */


    UIComponent.prototype.hide = function hide() {
        if (!this.getDOM() || !this.getMap()) {
            return this;
        }

        var anim = this._getAnimation(),
            dom = this.getDOM();
        if (!this.options['animationOnHide']) {
            anim.anim = false;
        }
        if (anim.fade) {
            dom.style.opacity = 0;
        }
        if (anim.scale) {
            dom.style[TRANSFORM] = 'scale(0)';
        }

        if (!anim.anim) {
            dom.style.display = 'none';
        } else {
            setTimeout(function () {
                dom.style.display = 'none';
            }, this.options['animationDuration']);
        }

        /**
         * hide event.
         *
         * @event ui.UIComponent#hide
         * @type {Object}
         * @property {String} type - hide
         * @property {ui.UIComponent} target - UIComponent
         */
        this.fire('hide');
        return this;
    };

    /**
     * Decide whether the ui component is open
     * @returns {Boolean} true|false
     */


    UIComponent.prototype.isVisible = function isVisible() {
        return this.getDOM() && this.getDOM().style.display !== 'none';
    };

    /**
     * Remove the UI Component
     * @return {ui.UIComponent} this
     * @fires ui.UIComponent#hide
     * @fires ui.UIComponent#remove
     */


    UIComponent.prototype.remove = function remove() {
        if (!this._owner) {
            return this;
        }
        this.hide();
        this._switchEvents('off');
        if (this.onRemove) {
            this.onRemove();
        }
        if (!this._singleton() && this.__uiDOM) {
            this._removePrevDOM();
        }
        delete this._owner;
        /**
         * remove event.
         *
         * @event ui.UIComponent#remove
         * @type {Object}
         * @property {String} type - remove
         * @property {ui.UIComponent} target - UIComponent
         */
        this.fire('remove');
        return this;
    };

    /**
     * Get pixel size of the UI Component.
     * @return {Size} size
     */


    UIComponent.prototype.getSize = function getSize() {
        if (this._size) {
            return this._size.copy();
        } else {
            return null;
        }
    };

    UIComponent.prototype.getOwner = function getOwner() {
        return this._owner;
    };

    UIComponent.prototype.getDOM = function getDOM() {
        return this.__uiDOM;
    };

    UIComponent.prototype.getPosition = function getPosition() {
        if (!this.getMap()) {
            return null;
        }
        var p = this._getViewPoint();
        if (this.getOffset) {
            var o = this.getOffset();
            if (o) {
                p._add(o);
            }
        }
        return p;
    };

    UIComponent.prototype._getAnimation = function _getAnimation() {
        var anim = {
            'fade': false,
            'scale': false
        };
        var animations = this.options['animation'] ? this.options['animation'].split(',') : [];
        for (var i = 0; i < animations.length; i++) {
            var trimed = trim(animations[i]);
            if (trimed === 'fade') {
                anim.fade = true;
            } else if (trimed === 'scale') {
                anim.scale = true;
            }
        }
        var transition = null;
        if (anim.fade) {
            transition = 'opacity ' + this.options['animationDuration'] + 'ms';
        }
        if (anim.scale) {
            transition = transition ? transition + ',' : '';
            transition += TRANSFORM + ' ' + this.options['animationDuration'] + 'ms';
        }
        anim.transition = transition;
        anim.anim = transition !== null;
        return anim;
    };

    UIComponent.prototype._getViewPoint = function _getViewPoint() {
        return this.getMap().coordinateToViewPoint(this._coordinate)._add(this.options['dx'], this.options['dy']);
    };

    UIComponent.prototype._autoPan = function _autoPan() {
        var map = this.getMap(),
            dom = this.getDOM();
        if (map.isMoving() || map._panAnimating) {
            return;
        }
        var point = new Point(parseInt(dom.style.left), parseInt(dom.style.top));
        var mapSize = map.getSize(),
            mapWidth = mapSize['width'],
            mapHeight = mapSize['height'];

        var containerPoint = map.viewPointToContainerPoint(point);
        var clientWidth = parseInt(dom.clientWidth),
            clientHeight = parseInt(dom.clientHeight);
        var left = 0,
            top = 0;
        if (containerPoint.x < 0) {
            left = -(containerPoint.x - clientWidth / 2);
        } else if (containerPoint.x + clientWidth - 35 > mapWidth) {
            left = mapWidth - (containerPoint.x + clientWidth * 3 / 2);
        }
        if (containerPoint.y < 0) {
            top = -containerPoint.y + 50;
        } else if (containerPoint.y > mapHeight) {
            top = mapHeight - containerPoint.y - clientHeight - 30;
        }
        if (top !== 0 || left !== 0) {
            map._panAnimation(new Point(left, top), this.options['autoPanDuration']);
        }
    };

    /**
     * Measure dom's size
     * @param  {HTMLElement} dom - element to measure
     * @return {Size} size
     * @private
     */


    UIComponent.prototype._measureSize = function _measureSize(dom) {
        var container = this._getUIContainer();
        dom.style.position = 'absolute';
        dom.style.left = -99999 + 'px';
        dom.style.top = -99999 + 'px';
        dom.style.display = '';
        container.appendChild(dom);
        this._size = new Size(dom.clientWidth, dom.clientHeight);
        dom.style.display = 'none';
        return this._size;
    };

    /**
     * Remove previous UI DOM if it has.
     *
     * @private
     */


    UIComponent.prototype._removePrevDOM = function _removePrevDOM() {
        if (this.onDomRemove) {
            this.onDomRemove();
        }
        if (this._singleton()) {
            var map = this.getMap(),
                key = this._uiDomKey();
            if (map[key]) {
                removeDomNode(map[key]);
                delete map[key];
            }
            delete this.__uiDOM;
        } else if (this.__uiDOM) {
            removeDomNode(this.__uiDOM);
            delete this.__uiDOM;
        }
    };

    /**
     * generate the cache key to store the singletong UI DOM
     * @private
     * @return {String} cache key
     */


    UIComponent.prototype._uiDomKey = function _uiDomKey() {
        return '__ui_' + this._getClassName();
    };

    UIComponent.prototype._singleton = function _singleton() {
        return this.options['single'];
    };

    UIComponent.prototype._getUIContainer = function _getUIContainer() {
        return this.getMap()._panels['ui'];
    };

    UIComponent.prototype._getClassName = function _getClassName() {
        /*
        for (var p in ui) {
            if (ui.hasOwnProperty(p)) {
                if (p === 'UIComponent') {
                    continue;
                }
                if (this instanceof (ui[p])) {
                    return p;
                }
            }
        }
        return null;
        */
        return 'UIComponent';
    };

    UIComponent.prototype._switchEvents = function _switchEvents(to) {
        var events = this._getDefaultEvents();
        if (this.getEvents) {
            extend(events, this.getEvents());
        }
        var p;
        if (events) {
            var map = this.getMap();
            for (p in events) {
                if (events.hasOwnProperty(p)) {
                    map[to](p, events[p], this);
                }
            }
        }
        var ownerEvents = this._getOwnerEvents();
        if (this._owner && ownerEvents) {
            for (p in ownerEvents) {
                if (ownerEvents.hasOwnProperty(p)) {
                    this._owner[to](p, ownerEvents[p], this);
                }
            }
        }
    };

    UIComponent.prototype._getDefaultEvents = function _getDefaultEvents() {
        return {
            'zooming': this.onZooming,
            'zoomend': this.onZoomEnd
        };
    };

    UIComponent.prototype._getOwnerEvents = function _getOwnerEvents() {
        if (this._owner && this._owner instanceof Geometry) {
            return {
                'positionchange': this.onGeometryPositionChange
            };
        }
        return null;
    };

    UIComponent.prototype.onGeometryPositionChange = function onGeometryPositionChange(param) {
        if (this._owner && this.getDOM() && this.isVisible()) {
            this.show(param['target'].getCenter());
        }
    };

    UIComponent.prototype.onZooming = function onZooming() {
        if (!this.isVisible() || !this.getDOM() || !this.getMap()) {
            return;
        }
        var dom = this.getDOM(),
            point = this.getMap().coordinateToViewPoint(this._coordinate);
        var p = point._add(this.options['dx'], this.options['dy']);
        if (this.getOffset) {
            var o = this.getOffset();
            if (o) {
                p._add(o);
            }
        }
        dom.style.left = p.x + 'px';
        dom.style.top = p.y + 'px';
    };

    UIComponent.prototype.onZoomEnd = function onZoomEnd() {
        if (!this.isVisible() || !this.getDOM() || !this.getMap()) {
            return;
        }
        var dom = this.getDOM(),
            p = this.getPosition();
        dom.style.left = p.x + 'px';
        dom.style.top = p.y + 'px';
    };

    return UIComponent;
}(Eventable(Class));

UIComponent.mergeOptions(options$16);

/**
 * @property {Object} options - construct options
 * @property {Boolean} [options.draggable=false]  - if the marker can be dragged.
 * @property {Number}  [options.single=false]     - if the marker is a global single one.
 * @property {String|HTMLElement}  options.content - content of the marker, can be a string type HTML code or a HTMLElement.
 * @memberOf ui.UIMarker
 * @instance
 */
var options$17 = {
    'draggable': false,
    'single': false,
    'content': null
};

var domEvents =
/**
 * mousedown event
 * @event ui.UIMarker#mousedown
 * @type {Object}
 * @property {String} type                    - mousedown
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'mousedown ' +
/**
 * mouseup event
 * @event ui.UIMarker#mouseup
 * @type {Object}
 * @property {String} type                    - mouseup
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'mouseup ' +
/**
 * mouseenter event
 * @event ui.UIMarker#mouseenter
 * @type {Object}
 * @property {String} type                    - mouseenter
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'mouseenter ' +
/**
 * mouseover event
 * @event ui.UIMarker#mouseover
 * @type {Object}
 * @property {String} type                    - mouseover
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'mouseover ' +
/**
 * mouseout event
 * @event ui.UIMarker#mouseout
 * @type {Object}
 * @property {String} type                    - mouseout
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'mouseout ' +
/**
 * mousemove event
 * @event ui.UIMarker#mousemove
 * @type {Object}
 * @property {String} type                    - mousemove
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'mousemove ' +
/**
 * click event
 * @event ui.UIMarker#click
 * @type {Object}
 * @property {String} type                    - click
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'click ' +
/**
 * dblclick event
 * @event ui.UIMarker#dblclick
 * @type {Object}
 * @property {String} type                    - dblclick
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'dblclick ' +
/**
 * contextmenu event
 * @event ui.UIMarker#contextmenu
 * @type {Object}
 * @property {String} type                    - contextmenu
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'contextmenu ' +
/**
 * keypress event
 * @event ui.UIMarker#keypress
 * @type {Object}
 * @property {String} type                    - keypress
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'keypress ' +
/**
 * touchstart event
 * @event ui.UIMarker#touchstart
 * @type {Object}
 * @property {String} type                    - touchstart
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'touchstart ' +
/**
 * touchmove event
 * @event ui.UIMarker#touchmove
 * @type {Object}
 * @property {String} type                    - touchmove
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'touchmove ' +
/**
 * touchend event
 * @event ui.UIMarker#touchend
 * @type {Object}
 * @property {String} type                    - touchend
 * @property {UIMarker} target    - the uimarker fires event
 * @property {Coordinate} coordinate - coordinate of the event
 * @property {Point} containerPoint  - container point of the event
 * @property {Point} viewPoint       - view point of the event
 * @property {Event} domEvent                 - dom event
 */
'touchend';

/**
 *
 * @classdesc
 * Class for UI Marker, a html based marker positioned by geographic coordinate. <br>
 *
 * @category ui
 * @extends ui.UIComponent
 * @mixes Handlerable
 * @memberOf ui
 * @example
 * const dom = document.createElement('div');
 * dom.innerHTML = 'hello ui marker';
 * const marker = new maptalks.UIMarker([0, 0], {
 *      draggable : true,
 *      content : dom
 *  }).addTo(map);
 */

var UIMarker = function (_Handlerable) {
    inherits(UIMarker, _Handlerable);

    /**
     * As it's renderered by HTMLElement such as a DIV, it: <br>
     * 1. always on the top of all the map layers <br>
     * 2. can't be snapped as it's not drawn on the canvas. <br>
     * @param  {Coordinate} coordinate - UIMarker's coordinates
     * @param {Object} options - options defined in [UIMarker]{@link UIMarker#options}
     */
    function UIMarker(coordinate, options) {
        classCallCheck(this, UIMarker);

        var _this = possibleConstructorReturn(this, _Handlerable.call(this, options));

        _this._markerCoord = new Coordinate(coordinate);
        return _this;
    }

    // TODO: obtain class in super


    UIMarker.prototype._getClassName = function _getClassName() {
        return 'UIMarker';
    };

    /**
     * Sets the coordinates
     * @param {Coordinate} coordinates - UIMarker's coordinate
     * @returns {UIMarker} this
     * @fires UIMarker#positionchange
     */


    UIMarker.prototype.setCoordinates = function setCoordinates(coordinates) {
        this._markerCoord = coordinates;
        /**
         * positionchange event.
         *
         * @event ui.UIMarker#positionchange
         * @type {Object}
         * @property {String} type - positionchange
         * @property {UIMarker} target - ui marker
         */
        this.fire('positionchange');
        if (this.isVisible()) {
            this.show();
        }
        return this;
    };

    /**
     * Gets the coordinates
     * @return {Coordinate} coordinates
     */


    UIMarker.prototype.getCoordinates = function getCoordinates() {
        return this._markerCoord;
    };

    /**
     * Sets the content of the UIMarker
     * @param {String|HTMLElement} content - UIMarker's content
     * @returns {UIMarker} this
     * @fires UIMarker#contentchange
     */


    UIMarker.prototype.setContent = function setContent(content) {
        var old = this.options['content'];
        this.options['content'] = content;
        /**
         * contentchange event.
         *
         * @event ui.UIMarker#contentchange
         * @type {Object}
         * @property {String} type - contentchange
         * @property {UIMarker} target - ui marker
         * @property {String|HTMLElement} old      - old content
         * @property {String|HTMLElement} new      - new content
         */
        this.fire('contentchange', {
            'old': old,
            'new': content
        });
        if (this.isVisible()) {
            this.show();
        }
        return this;
    };

    /**
     * Gets the content of the UIMarker
     * @return {String|HTMLElement} content
     */


    UIMarker.prototype.getContent = function getContent() {
        return this.options['content'];
    };

    /**
     * Show the UIMarker
     * @returns {UIMarker} this
     * @fires UIMarker#showstart
     * @fires UIMarker#showend
     */


    UIMarker.prototype.show = function show() {
        return UIComponent.prototype.show.call(this, this._markerCoord);
    };

    /**
     * A callback method to build UIMarker's HTMLElement
     * @protected
     * @param {Map} map - map to be built on
     * @return {HTMLElement} UIMarker's HTMLElement
     */


    UIMarker.prototype.buildOn = function buildOn() {
        var dom;
        if (isString(this.options['content'])) {
            dom = createEl('div');
            dom.innerHTML = this.options['content'];
        } else {
            dom = this.options['content'];
        }
        this._registerDOMEvents(dom);
        return dom;
    };

    /**
     * Gets UIMarker's HTMLElement's position offset, it's caculated dynamically accordiing to its actual size.
     * @protected
     * @return {Point} offset
     */


    UIMarker.prototype.getOffset = function getOffset() {
        var size = this.getSize();
        return new Point(-size['width'] / 2, -size['height'] / 2);
    };

    /**
     * Gets UIMarker's transform origin for animation transform
     * @protected
     * @return {Point} transform origin
     */


    UIMarker.prototype.getTransformOrigin = function getTransformOrigin() {
        var size = this.getSize();
        return new Point(size['width'] / 2, size['height'] / 2);
    };

    UIMarker.prototype.onDomRemove = function onDomRemove() {
        var dom = this.getDOM();
        this._removeDOMEvents(dom);
    };

    /**
     * Whether the uimarker is being dragged.
     * @returns {Boolean}
     */


    UIMarker.prototype.isDragging = function isDragging() {
        if (this['draggable']) {
            return this['draggable'].isDragging();
        }
        return false;
    };

    UIMarker.prototype._registerDOMEvents = function _registerDOMEvents(dom) {
        on(dom, domEvents, this._onDomEvents, this);
    };

    UIMarker.prototype._onDomEvents = function _onDomEvents(e) {
        var event = this.getMap()._parseEvent(e, e.type);
        this.fire(e.type, event);
    };

    UIMarker.prototype._removeDOMEvents = function _removeDOMEvents(dom) {
        off(dom, domEvents, this._onDomEvents, this);
    };

    return UIMarker;
}(Handlerable(UIComponent));

UIMarker.mergeOptions(options$17);

var EVENTS$1 = Browser$1.touch ? 'touchstart mousedown' : 'mousedown';

var UIMarkerDragHandler = function (_Handler) {
    inherits(UIMarkerDragHandler, _Handler);

    function UIMarkerDragHandler(target) {
        classCallCheck(this, UIMarkerDragHandler);
        return possibleConstructorReturn(this, _Handler.call(this, target));
    }

    UIMarkerDragHandler.prototype.addHooks = function addHooks() {
        this.target.on(EVENTS$1, this._startDrag, this);
    };

    UIMarkerDragHandler.prototype.removeHooks = function removeHooks() {
        this.target.off(EVENTS$1, this._startDrag, this);
    };

    UIMarkerDragHandler.prototype._startDrag = function _startDrag(param) {
        var domEvent = param['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }
        if (this.isDragging()) {
            return;
        }
        this.target.on('click', this._endDrag, this);
        this._lastPos = param['coordinate'];

        this._prepareDragHandler();
        this._dragHandler.onMouseDown(param['domEvent']);
        /**
         * drag start event
         * @event ui.UIMarker#dragstart
         * @type {Object}
         * @property {String} type                    - dragstart
         * @property {UIMarker} target    - the uimarker fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this.target.fire('dragstart', param);
    };

    UIMarkerDragHandler.prototype._prepareDragHandler = function _prepareDragHandler() {
        this._dragHandler = new DragHandler(this.target.getDOM(), {
            'cancelOn': this._cancelOn.bind(this)
        });
        this._dragHandler.on('mousedown', this._onMouseDown, this);
        this._dragHandler.on('dragging', this._dragging, this);
        this._dragHandler.on('mouseup', this._endDrag, this);
        this._dragHandler.enable();
    };

    UIMarkerDragHandler.prototype._cancelOn = function _cancelOn(domEvent) {
        var target = domEvent.srcElement || domEvent.target,
            tagName = target.tagName.toLowerCase();
        if (tagName === 'button' || tagName === 'input' || tagName === 'select' || tagName === 'option' || tagName === 'textarea') {
            return true;
        }
        return false;
    };

    UIMarkerDragHandler.prototype._onMouseDown = function _onMouseDown(param) {
        stopPropagation(param['domEvent']);
    };

    UIMarkerDragHandler.prototype._dragging = function _dragging(param) {
        var target = this.target,
            map = target.getMap(),
            eventParam = map._parseEvent(param['domEvent']),
            domEvent = eventParam['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }
        if (!this._isDragging) {
            this._isDragging = true;
            return;
        }
        var currentPos = eventParam['coordinate'];
        if (!this._lastPos) {
            this._lastPos = currentPos;
        }
        var dragOffset = currentPos.substract(this._lastPos);
        this._lastPos = currentPos;
        this.target.setCoordinates(this.target.getCoordinates().add(dragOffset));
        eventParam['dragOffset'] = dragOffset;

        /**
         * dragging event
         * @event ui.UIMarker#dragging
         * @type {Object}
         * @property {String} type                    - dragging
         * @property {UIMarker} target    - the uimarker fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        target.fire('dragging', eventParam);
    };

    UIMarkerDragHandler.prototype._endDrag = function _endDrag(param) {
        var target = this.target,
            map = target.getMap();
        if (this._dragHandler) {
            target.off('click', this._endDrag, this);
            this._dragHandler.disable();
            delete this._dragHandler;
        }
        delete this._lastPos;
        this._isDragging = false;
        if (!map) {
            return;
        }
        var eventParam = map._parseEvent(param['domEvent']);
        /**
         * dragend event
         * @event ui.UIMarker#dragend
         * @type {Object}
         * @property {String} type                    - dragend
         * @property {UIMarker} target    - the uimarker fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        target.fire('dragend', eventParam);
    };

    UIMarkerDragHandler.prototype.isDragging = function isDragging() {
        if (!this._isDragging) {
            return false;
        }
        return true;
    };

    return UIMarkerDragHandler;
}(Handler$1);

UIMarker.addInitHook('addHandler', 'draggable', UIMarkerDragHandler);

/**
 * @property {Object} options
 * @property {Boolean} [options.autoPan=true]  - set it to false if you don't want the map to do panning animation to fit the opened window.
 * @property {Number}  [options.width=300]     - default width
 * @property {Number}  [options.minHeight=120] - minimun height
 * @property {Boolean} [options.custom=false]  - set it to true if you want a customized infowindow, customized html codes or a HTMLElement is set to content.
 * @property {String}  [options.title=null]    - title of the infowindow.
 * @property {String|HTMLElement}  options.content - content of the infowindow.
 * @memberOf ui.InfoWindow
 * @instance
 */
var options$18 = {
    'autoPan': true,
    'width': 300,
    'minHeight': 120,
    'custom': false,
    'title': null,
    'content': null
};

/**
 * @classdesc
 * Class for info window, a popup on the map to display any useful infomation you wanted.
 * @category ui
 * @extends ui.UIComponent
 * @param {Object} options - options defined in [InfoWindow]{@link InfoWindow#options}
 * @memberOf ui
 */

var InfoWindow = function (_UIComponent) {
    inherits(InfoWindow, _UIComponent);

    function InfoWindow() {
        classCallCheck(this, InfoWindow);
        return possibleConstructorReturn(this, _UIComponent.apply(this, arguments));
    }

    // TODO: obtain class in super
    InfoWindow.prototype._getClassName = function _getClassName() {
        return 'InfoWindow';
    };

    /**
     * Adds the UI Component to a geometry or a map
     * @param {Geometry|Map} owner - geometry or map to addto.
     * @returns {UIComponent} this
     * @fires UIComponent#add
     */


    InfoWindow.prototype.addTo = function addTo(owner) {
        if (owner instanceof Geometry) {
            if (owner.getInfoWindow() && owner.getInfoWindow() !== this) {
                owner.removeInfoWindow();
            }
            owner._infoWindow = this;
        }
        return UIComponent.prototype.addTo.apply(this, arguments);
    };

    /**
     * Set the content of the infowindow.
     * @param {String|HTMLElement} content - content of the infowindow.
     * return {InfoWindow} this
     * @fires InfoWindow#contentchange
     */


    InfoWindow.prototype.setContent = function setContent(content) {
        var old = this.options['content'];
        this.options['content'] = content;
        /**
         * contentchange event.
         *
         * @event InfoWindow#contentchange
         * @type {Object}
         * @property {String} type - contentchange
         * @property {InfoWindow} target - InfoWindow
         * @property {String|HTMLElement} old      - old content
         * @property {String|HTMLElement} new      - new content
         */
        this.fire('contentchange', {
            'old': old,
            'new': content
        });
        if (this.isVisible()) {
            this.show(this._coordinate);
        }
        return this;
    };

    /**
     * Get content of  the infowindow.
     * @return {String|HTMLElement} - content of the infowindow
     */


    InfoWindow.prototype.getContent = function getContent() {
        return this.options['content'];
    };

    /**
     * Set the title of the infowindow.
     * @param {String|HTMLElement} title - title of the infowindow.
     * return {InfoWindow} this
     * @fires InfoWindow#titlechange
     */


    InfoWindow.prototype.setTitle = function setTitle(title) {
        var old = title;
        this.options['title'] = title;
        /**
         * titlechange event.
         *
         * @event InfoWindow#titlechange
         * @type {Object}
         * @property {String} type - titlechange
         * @property {InfoWindow} target - InfoWindow
         * @property {String} old      - old content
         * @property {String} new      - new content
         */
        this.fire('contentchange', {
            'old': old,
            'new': title
        });
        if (this.isVisible()) {
            this.show(this._coordinate);
        }
        return this;
    };

    /**
     * Get title of  the infowindow.
     * @return {String|HTMLElement} - content of the infowindow
     */


    InfoWindow.prototype.getTitle = function getTitle() {
        return this.options['title'];
    };

    InfoWindow.prototype.buildOn = function buildOn() {
        var dom;
        if (this.options['custom']) {
            if (isString(this.options['content'])) {
                dom = createEl('div');
                dom.innerHTML = this.options['content'];
                return dom;
            } else {
                return this.options['content'];
            }
        } else {
            dom = createEl('div');
            dom.className = 'maptalks-msgBox';
            dom.style.width = this._getWindowWidth() + 'px';
            var content = '<em class="maptalks-ico"></em>';
            if (this.options['title']) {
                content += '<h2>' + this.options['title'] + '</h2>';
            }
            content += '<a href="javascript:void(0);" onclick="this.parentNode.style.display=\'none\';return false;" ' + ' class="maptalks-close"></a><div class="maptalks-msgContent">' + this.options['content'] + '</div>';
            dom.innerHTML = content;
            return dom;
        }
    };

    /**
     * Gets InfoWindow's transform origin for animation transform
     * @protected
     * @return {Point} transform origin
     */


    InfoWindow.prototype.getTransformOrigin = function getTransformOrigin() {
        var size = this.getSize();
        var o = new Point(size['width'] / 2, size['height']);
        if (!this.options['custom']) {
            o._add(4, 12);
        }
        return o;
    };

    InfoWindow.prototype.getOffset = function getOffset() {
        var size = this.getSize();
        var o = new Point(-size['width'] / 2, -size['height']);
        if (!this.options['custom']) {
            o._substract(4, 12);
        }
        if (this.getOwner() instanceof Marker) {
            var markerSize = this.getOwner().getSize();
            if (markerSize) {
                o._add(0, -markerSize['height']);
            }
        }
        return o;
    };

    InfoWindow.prototype.show = function show() {
        if (!this.getMap()) {
            return this;
        }
        if (!this.getMap().options['enableInfoWindow']) {
            return this;
        }
        return UIComponent.prototype.show.apply(this, arguments);
    };

    InfoWindow.prototype._getWindowWidth = function _getWindowWidth() {
        var defaultWidth = 300;
        var width = this.options['width'];
        if (!width) {
            width = defaultWidth;
        }
        return width;
    };

    return InfoWindow;
}(UIComponent);

InfoWindow.mergeOptions(options$18);

/**
 * @property {Object} options
 * @property {Boolean} [options.autoPan=false]  - set it to false if you don't want the map to do panning animation to fit the opened menu.
 * @property {Number}  [options.width=160]      - default width
 * @property {String|HTMLElement} [options.custom=false]  - set it to true if you want a customized menu, customized html codes or a HTMLElement is set to items.
 * @property {Object[]|String|HTMLElement}  options.items   - html code or a html element is options.custom is true. Or a menu items array, containing: item objects, "-" as a splitor line
 * @memberOf ui.Menu
 * @instance
 */
var defaultOptions = {
    'animation': null,
    'animationDelay': 10,
    'animationOnHide': false,
    'eventsToStop': 'mousedown dblclick click',
    'autoPan': false,
    'width': 160,
    'custom': false,
    'items': []
};

/**
 * @classdesc
 * Class for context menu, useful for interactions with right clicks on the map.
 * @category ui
 * @extends ui.UIComponent
 * @memberOf ui
 */

var Menu = function (_UIComponent) {
    inherits(Menu, _UIComponent);

    /**
     * Menu items is set to options.items or by setItems method. <br>
     * <br>
     * Normally items is a object array, containing: <br>
     * 1. item object: {'item': 'This is a menu text', 'click': function() {alert('oops! You clicked!');)}} <br>
     * 2. minus string "-", which will draw a splitor line on the menu. <br>
     * <br>
     * If options.custom is set to true, the menu is considered as a customized one. Then items is the customized html codes or HTMLElement. <br>
     * @param {Object} options - options defined in [ui.Menu]{@link ui.Menu#options}
     */
    function Menu(options) {
        classCallCheck(this, Menu);
        return possibleConstructorReturn(this, _UIComponent.call(this, options));
    }

    // TODO: obtain class in super


    Menu.prototype._getClassName = function _getClassName() {
        return 'Menu';
    };

    Menu.prototype.addTo = function addTo(owner) {
        if (owner._menu && owner._menu !== this) {
            owner.removeMenu();
        }
        owner._menu = this;
        return UIComponent.prototype.addTo.apply(this, arguments);
    };

    /**
     * Set the items of the menu.
     * @param {Object[]|String|HTMLElement} items - items of the menu
     * return {ui.Menu} this
     * @example
     * menu.setItems([
     *      //return false to prevent event propagation
     *     {'item': 'Query', 'click': function() {alert('Query Clicked!'); return false;}},
     *     '-',
     *     {'item': 'Edit', 'click': function() {alert('Edit Clicked!')}},
     *     {'item': 'About', 'click': function() {alert('About Clicked!')}}
     * ]);
     */


    Menu.prototype.setItems = function setItems(items) {
        this.options['items'] = items;
        return this;
    };

    /**
     * Get items of  the menu.
     * @return {Object[]|String|HTMLElement} - items of the menu
     */


    Menu.prototype.getItems = function getItems() {
        return this.options['items'];
    };

    /**
     * Create the menu DOM.
     * @protected
     * @return {HTMLElement} menu's DOM
     */


    Menu.prototype.buildOn = function buildOn() {
        if (this.options['custom']) {
            if (isString(this.options['items'])) {
                var container = createEl('div');
                container.innerHTML = this.options['items'];
                return container;
            } else {
                return this.options['items'];
            }
        } else {
            var dom = createEl('div');
            addClass(dom, 'maptalks-menu');
            dom.style.width = this._getMenuWidth() + 'px';
            /*var arrow = createEl('em');
            addClass(arrow, 'maptalks-ico');*/
            var menuItems = this._createMenuItemDom();
            // dom.appendChild(arrow);
            dom.appendChild(menuItems);
            return dom;
        }
    };

    /**
     * Offset of the menu DOM to fit the click position.
     * @return {Point} offset
     * @private
     */


    Menu.prototype.getOffset = function getOffset() {
        if (!this.getMap()) {
            return null;
        }
        var mapSize = this.getMap().getSize(),
            p = this.getMap().viewPointToContainerPoint(this._getViewPoint()),
            size = this.getSize();
        var dx = 0,
            dy = 0;
        if (p.x + size['width'] > mapSize['width']) {
            dx = -size['width'];
        }
        if (p.y + size['height'] > mapSize['height']) {
            dy = -size['height'];
        }
        return new Point(dx, dy);
    };

    Menu.prototype.getTransformOrigin = function getTransformOrigin() {
        return this.getOffset()._multi(-1);
    };

    Menu.prototype.getEvents = function getEvents() {
        return {
            '_zoomstart _zoomend _movestart _dblclick _click': this.hide
        };
    };

    Menu.prototype._createMenuItemDom = function _createMenuItemDom() {
        var me = this;
        var map = this.getMap();
        var ul = createEl('ul');
        addClass(ul, 'maptalks-menu-items');
        var items = this.getItems();

        function onMenuClick(index) {
            return function (e) {
                var param = map._parseEvent(e, 'click');
                param['target'] = me;
                param['owner'] = me._owner;
                param['index'] = index;
                var result = this._callback(param);
                if (result === false) {
                    return;
                }
                me.hide();
            };
        }
        var item, itemDOM;
        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if (item === '-' || item === '_') {
                itemDOM = createEl('li');
                addClass(itemDOM, 'maptalks-menu-splitter');
            } else {
                itemDOM = createEl('li');
                var itemTitle = item['item'];
                if (isFunction(itemTitle)) {
                    itemTitle = itemTitle({
                        'owner': this._owner,
                        'index': i
                    });
                }
                itemDOM.innerHTML = itemTitle;
                itemDOM._callback = item['click'];
                on(itemDOM, 'click', onMenuClick(i));
            }
            ul.appendChild(itemDOM);
        }
        return ul;
    };

    Menu.prototype._getMenuWidth = function _getMenuWidth() {
        var defaultWidth = 160;
        var width = this.options['width'];
        if (!width) {
            width = defaultWidth;
        }
        return width;
    };

    return Menu;
}(UIComponent);

Menu.mergeOptions(defaultOptions);

var defaultOptions$1 = {
    'animation': null,
    'animationDelay': 10,
    'animationOnHide': false,
    'eventsToStop': 'mousedown dblclick click',
    'autoPan': false,
    'width': 160,
    'custom': false,
    'items': []
};

/**
 * Mixin of the context menu methods.
 * @mixin ui.Menuable
 */
var Menuable = {
    /**
     * Set a context menu
     * @param {Object} options - menu options
     * @return {*} this
     * @example
     * foo.setMenu({
     *  'width'  : 160,
     *  'custom' : false,
     *  'items' : [
     *      //return false to prevent event propagation
     *     {'item': 'Query', 'click': function() {alert('Query Clicked!'); return false;}},
     *     '-',
     *     {'item': 'Edit', 'click': function() {alert('Edit Clicked!')}},
     *     {'item': 'About', 'click': function() {alert('About Clicked!')}}
     *    ]
     * });
     * @function ui.Menuable.setMenu
     */
    setMenu: function setMenu(options) {
        this._menuOptions = options;

        if (this._menu) {
            setOptions(this._menu, extend(defaultOptions$1, options));
        } else {
            this.on('contextmenu', this._defaultOpenMenu, this);
        }
        return this;
    },


    /**
     * Open the context menu, default on the center of the geometry or map.
     * @param {Coordinate} [coordinate=null] - coordinate to open the context menu
     * @return {*} this
     * @function ui.Menuable.openMenu
     */
    openMenu: function openMenu(coordinate) {
        var map = this instanceof Map ? this : this.getMap();
        if (!coordinate) {
            coordinate = this.getCenter();
        }
        if (!this._menu) {
            if (this._menuOptions && map) {
                this._bindMenu(this._menuOptions);
                this._menu.show(coordinate);
            }
        } else {
            this._menu.show(coordinate);
        }
        return this;
    },


    /**
     * Set menu items to the context menu
     * @param {Object[]} items - menu items
     * @return {*} this
     * @function ui.Menuable.setMenuItems
     */
    setMenuItems: function setMenuItems(items) {
        if (!this._menuOptions) {
            this._menuOptions = {};
        }
        if (Array.isArray(items)) {
            this._menuOptions['custom'] = false;
        }
        this._menuOptions['items'] = items;
        this.setMenu(this._menuOptions);
        return this;
    },


    /**
     * Get the context menu items
     * @return {Object[]}
     * @function ui.Menuable.getMenuItems
     */
    getMenuItems: function getMenuItems() {
        if (this._menu) {
            return this._menu.getItems();
        } else if (this._menuOptions) {
            return this._menuOptions['items'];
        }
        return null;
    },


    /**
     * Close the contexnt menu
     * @return {*} this
     * @function ui.Menuable.closeMenu
     */
    closeMenu: function closeMenu() {
        if (this._menu) {
            this._menu.hide();
        }
        return this;
    },


    /**
     * Remove the context menu
     * @return {*} this
     * @function ui.Menuable.removeMenu
     */
    removeMenu: function removeMenu() {
        this.off('contextmenu', this._defaultOpenMenu, this);
        this._unbindMenu();
        delete this._menuOptions;
        return this;
    },
    _bindMenu: function _bindMenu(options) {
        this._menu = new Menu(options);
        this._menu.addTo(this);

        return this;
    },
    _unbindMenu: function _unbindMenu() {
        if (this._menu) {
            this.closeMenu();
            this._menu.remove();
            delete this._menu;
        }
        return this;
    },


    /**
     * If contextmenu is not listened, open the menu in default.<br>
     * Otherwise, do nothing here.
     * @param  {Object} param - event parameter
     * @return {Boolean} true | false to stop event propagation
     * @private
     */
    _defaultOpenMenu: function _defaultOpenMenu(param) {
        if (this.listens('contextmenu') > 1) {
            return true;
        } else {
            this.openMenu(param['coordinate']);
            return false;
        }
    }
};

Map.include(Menuable);
Geometry.include(Menuable);

/** @namespace ui */



var index$4 = Object.freeze({
	UIComponent: UIComponent,
	UIMarker: UIMarker,
	InfoWindow: InfoWindow,
	Menuable: Menuable,
	Menu: Menu
});

/**
 * Mixin methods for text editing.
 * @mixin TextEditable
 */
var TextEditable = {
    /**
     * Start to edit the text, editing will be ended automatically whenever map is clicked.
     *
     * @return {TextMarker} this
     * @fires TextMarker#edittextstart
     */
    startEditText: function startEditText() {
        if (!this.getMap()) {
            return this;
        }
        this.hide();
        this.endEditText();
        this._prepareEditor();
        /**
         * edittextstart when starting to edit text content
         * @event TextMarker#edittextstart
         * @type {Object}
         * @property {String} type - edittextstart
         * @property {TextMarker} target - fires the event
         */
        this._fireEvent('edittextstart');
        return this;
    },


    /**
     * End text edit.
     *
     * @return {TextMarker} this
     * @fires TextMarker#edittextend
     */
    endEditText: function endEditText() {
        if (this._textEditor) {
            var content = this._textEditor.innerText;
            content = this._filterContent(content);
            this.setContent(content);
            this.show();
            off(this._textEditor, 'mousedown dblclick', stopPropagation);
            this.getMap().off('mousedown', this.endEditText, this);
            this._editUIMarker.remove();
            delete this._editUIMarker;
            this._textEditor.onkeyup = null;
            delete this._textEditor;
            /**
             * edittextend when ended editing text content
             * @event TextMarker#edittextend
             * @type {Object}
             * @property {String} type - edittextend
             * @property {TextMarker} target - textMarker fires the event
             */
            this._fireEvent('edittextend');
        }
        return this;
    },


    /**
     * Whether the text is being edited.
     *
     * @return {Boolean}
     */
    isEditingText: function isEditingText() {
        if (this._textEditor) {
            return true;
        }
        return false;
    },


    /**
     * Get the text editor which is an [ui.UIMarker]{@link ui.UIMarker}
     * @return {ui.UIMarker} text editor
     */
    getTextEditor: function getTextEditor() {
        return this._editUIMarker;
    },
    _prepareEditor: function _prepareEditor() {
        var map = this.getMap();
        var editContainer = this._createEditor();
        this._textEditor = editContainer;
        map.on('mousedown', this.endEditText, this);
        var offset = this._getEditorOffset();
        this._editUIMarker = new UIMarker(this.getCoordinates(), {
            'content': editContainer,
            'dx': offset.dx,
            'dy': offset.dy
        }).addTo(map).show();
        this._setCursorToLast(this._textEditor);
    },
    _getEditorOffset: function _getEditorOffset() {
        var symbol = this._getInternalSymbol() || {},
            dx = 0,
            dy = 0;
        var textAlign = symbol['textHorizontalAlignment'];
        if (textAlign === 'middle') {
            dx = symbol['textDx'] - 2 || 0;
            dy = symbol['textDy'] - 2 || 0;
        } else if (textAlign === 'left') {
            dx = symbol['markerDx'] - 2 || 0;
            dy = symbol['markerDy'] - 2 || 0;
        } else {
            dx = symbol['markerDx'] - 2 || 0;
            dy = symbol['markerDy'] - 2 || 0;
        }
        return {
            'dx': dx,
            'dy': dy
        };
    },
    _createEditor: function _createEditor() {
        var content = this.getContent();
        var labelSize = this.getSize(),
            symbol = this._getInternalSymbol() || {},
            width = content && content.length > 0 ? Math.max(labelSize['width'], this.options['boxMinWidth']) || 100 : 100,
            textColor = symbol['textFill'] || '#000000',
            textSize = symbol['textSize'] || 12,
            height = Math.max(labelSize['height'], this.options['boxMinHeight']) || textSize * 1.5,
            lineColor = symbol['markerLineColor'] || '#000',
            fill = symbol['markerFill'] || '#3398CC',
            spacing = symbol['textLineSpacing'] || 0;
        // opacity = symbol['markerFillOpacity'];
        var editor = createEl('div');
        editor.contentEditable = true;
        editor.style.cssText = 'background: ' + fill + ';' + 'border: 1px solid ' + lineColor + ';' + 'color: ' + textColor + ';' + 'font-size: ' + textSize + 'px;' + 'width: ' + (width - 2) + 'px;' + 'height: ' + (height - 2) + 'px;' + 'margin-left: auto;' + 'margin-right: auto;' + 'line-height: ' + (textSize + spacing) + 'px;' + 'outline: 0;' + 'word-wrap: break-word;' + 'overflow-x: hidden;' + 'overflow-y: hidden;' + '-webkit-user-modify: read-write-plaintext-only;';

        editor.innerText = content;
        on(editor, 'mousedown dblclick', stopPropagation);
        editor.onkeyup = function (event) {
            var h = editor.style.height;
            if (!h) {
                h = 0;
            }
            if (event.keyCode === 13) {
                editor.style.height = parseInt(h) + textSize / 2 + 'px';
            }
        };
        return editor;
    },
    _setCursorToLast: function _setCursorToLast(obj) {
        var range;
        if (window.getSelection) {
            obj.focus();
            range = window.getSelection();
            range.selectAllChildren(obj);
            range.collapseToEnd();
        } else if (document.selection) {
            range = document.selection.createRange();
            range.moveToElementText(obj);
            range.collapse(false);
            range.select();
        }
    },
    _filterContent: function _filterContent(content) {
        var pattern = /\\[v f t b]{1}/gi;
        var enterPattern = /[\r\n]+$/gi;
        var result = content.replace(pattern, '');
        result = result.replace(enterPattern, '');
        return result;
    }
};

TextBox.include(TextEditable);
Label.include(TextEditable);

Geometry.include( /** @lends Geometry.prototype */{
    /**
     * Animate the geometry
     *
     * @param  {Object}   styles          - styles to animate
     * @param  {Object}   [options=null]  - animation options
     * @param  {Object}   [options.duration=1000]      - duration
     * @param  {Object}   [options.startTime=null]  - time to start animation in ms
     * @param  {Object}   [options.easing=linear]   - animation easing: in, out, inAndOut, linear, upAndDown
     * @param  {Function} [step=null]               - step function when animating
     * @return {animation.Player} animation player
     * @example
     * var player = marker.animate({
     *     'symbol': {
     *         'markerHeight': 82
     *      }
     * }, {
     *     'duration': 2000
     * }, function (frame) {
     *     console.log(frame);
     * });
     * player.pause();
     */
    animate: function animate(styles, options, step) {
        var _this = this;

        if (this._animPlayer) {
            this._animPlayer.finish();
        }
        if (isFunction(options)) {
            step = options;
            options = null;
        }
        var map = this.getMap(),
            projection = this._getProjection(),
            symbol = this._getInternalSymbol(),
            stylesToAnimate = this._prepareAnimationStyles(styles),
            preTranslate,
            isFocusing;

        if (options) {
            isFocusing = options['focus'];
        }
        delete this._animationStarted;

        var player = Animation.animate(stylesToAnimate, options, function (frame) {
            if (!_this._animationStarted && isFocusing) {
                map.onMoveStart();
            }
            var styles = frame.styles;
            for (var p in styles) {
                if (p !== 'symbol' && p !== 'translate' && styles.hasOwnProperty(p)) {
                    var fnName = 'set' + p[0].toUpperCase() + p.slice(1);
                    _this[fnName](styles[p]);
                }
            }
            var translate = styles['translate'];
            if (translate) {
                var toTranslate = translate;
                if (preTranslate) {
                    toTranslate = translate.substract(preTranslate);
                }
                preTranslate = translate;
                _this.translate(toTranslate);
            }
            var dSymbol = styles['symbol'];
            if (dSymbol) {
                _this.setSymbol(extendSymbol(symbol, dSymbol));
            }
            if (isFocusing) {
                var pcenter = projection.project(_this.getCenter());
                map._setPrjCenterAndMove(pcenter);
                if (player.playState !== 'running') {
                    map.onMoveEnd();
                } else {
                    map.onMoving();
                }
            }
            _this._fireAnimateEvent(player.playState);
            if (step) {
                step(frame);
            }
        });
        this._animPlayer = player;
        return this._animPlayer.play();
    },
    /**
     * Prepare styles for animation
     * @return {Object} styles
     * @private
     */
    _prepareAnimationStyles: function _prepareAnimationStyles(styles) {
        var symbol = this._getInternalSymbol();
        var stylesToAnimate = {};
        for (var p in styles) {
            if (styles.hasOwnProperty(p)) {
                var v = styles[p],
                    sp;
                if (p !== 'translate' && p !== 'symbol') {
                    //this.getRadius() / this.getWidth(), etc.
                    var fnName = 'get' + p[0].toUpperCase() + p.substring(1);
                    var current = this[fnName]();
                    stylesToAnimate[p] = [current, v];
                } else if (p === 'symbol') {
                    var symbolToAnimate;
                    if (Array.isArray(styles['symbol'])) {
                        if (!Array.isArray(symbol)) {
                            throw new Error('geometry\'symbol isn\'t a composite symbol, while the symbol in styles is.');
                        }
                        symbolToAnimate = [];
                        var symbolInStyles = styles['symbol'];
                        for (var i = 0; i < symbolInStyles.length; i++) {
                            if (!symbolInStyles[i]) {
                                symbolToAnimate.push(null);
                                continue;
                            }
                            var a = {};
                            for (sp in symbolInStyles[i]) {
                                if (symbolInStyles[i].hasOwnProperty(sp)) {
                                    a[sp] = [symbol[i][sp], symbolInStyles[i][sp]];
                                }
                            }
                            symbolToAnimate.push(a);
                        }
                    } else {
                        if (Array.isArray(symbol)) {
                            throw new Error('geometry\'symbol is a composite symbol, while the symbol in styles isn\'t.');
                        }
                        symbolToAnimate = {};
                        for (sp in v) {
                            if (v.hasOwnProperty(sp)) {
                                symbolToAnimate[sp] = [symbol[sp], v[sp]];
                            }
                        }
                    }
                    stylesToAnimate['symbol'] = symbolToAnimate;
                } else if (p === 'translate') {
                    stylesToAnimate['translate'] = new Coordinate(v);
                }
            }
        }
        return stylesToAnimate;
    },

    _fireAnimateEvent: function _fireAnimateEvent(playState) {
        if (playState === 'finished') {
            delete this._animationStarted;
            this._fireEvent('animateend');
        } else if (playState === 'running') {
            if (this._animationStarted) {
                this._fireEvent('animating');
            } else {
                this._fireEvent('animatestart');
                this._animationStarted = true;
            }
        }
    }
});

var zousanMin = createCommonjsModule(function (module) {
  !function (t) {
    "use strict";
    function e(t) {
      if (t) {
        var e = this;t(function (t) {
          e.resolve(t);
        }, function (t) {
          e.reject(t);
        });
      }
    }function n(t, e) {
      if ("function" == typeof t.y) try {
        var n = t.y.call(i, e);t.p.resolve(n);
      } catch (o) {
        t.p.reject(o);
      } else t.p.resolve(e);
    }function o(t, e) {
      if ("function" == typeof t.n) try {
        var n = t.n.call(i, e);t.p.resolve(n);
      } catch (o) {
        t.p.reject(o);
      } else t.p.reject(e);
    }var r,
        i,
        c = "fulfilled",
        u = "rejected",
        s = "undefined",
        f = function () {
      function e() {
        for (; n.length - o;) {
          try {
            n[o]();
          } catch (e) {
            t.console && t.console.error(e);
          }n[o++] = i, o == r && (n.splice(0, r), o = 0);
        }
      }var n = [],
          o = 0,
          r = 1024,
          c = function () {
        if ((typeof MutationObserver === "undefined" ? "undefined" : _typeof(MutationObserver)) !== s) {
          var t = document.createElement("div"),
              n = new MutationObserver(e);return n.observe(t, { attributes: !0 }), function () {
            t.setAttribute("a", 0);
          };
        }return (typeof setImmediate === "undefined" ? "undefined" : _typeof(setImmediate)) !== s ? function () {
          setImmediate(e);
        } : function () {
          setTimeout(e, 0);
        };
      }();return function (t) {
        n.push(t), n.length - o == 1 && c();
      };
    }();e.prototype = { resolve: function resolve(t) {
        if (this.state === r) {
          if (t === this) return this.reject(new TypeError("Attempt to resolve promise with self"));var e = this;if (t && ("function" == typeof t || "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)))) try {
            var o = !0,
                i = t.then;if ("function" == typeof i) return void i.call(t, function (t) {
              o && (o = !1, e.resolve(t));
            }, function (t) {
              o && (o = !1, e.reject(t));
            });
          } catch (u) {
            return void (o && this.reject(u));
          }this.state = c, this.v = t, e.c && f(function () {
            for (var o = 0, r = e.c.length; r > o; o++) {
              n(e.c[o], t);
            }
          });
        }
      }, reject: function reject(n) {
        if (this.state === r) {
          this.state = u, this.v = n;var i = this.c;i ? f(function () {
            for (var t = 0, e = i.length; e > t; t++) {
              o(i[t], n);
            }
          }) : !e.suppressUncaughtRejectionError && t.console && t.console.log("You upset Zousan. Please catch rejections: ", n, n ? n.stack : null);
        }
      }, then: function then(t, i) {
        var u = new e(),
            s = { y: t, n: i, p: u };if (this.state === r) this.c ? this.c.push(s) : this.c = [s];else {
          var l = this.state,
              a = this.v;f(function () {
            l === c ? n(s, a) : o(s, a);
          });
        }return u;
      }, "catch": function _catch(t) {
        return this.then(null, t);
      }, "finally": function _finally(t) {
        return this.then(t, t);
      }, timeout: function timeout(t, n) {
        n = n || "Timeout";var o = this;return new e(function (e, r) {
          setTimeout(function () {
            r(Error(n));
          }, t), o.then(function (t) {
            e(t);
          }, function (t) {
            r(t);
          });
        });
      } }, e.resolve = function (t) {
      var n = new e();return n.resolve(t), n;
    }, e.reject = function (t) {
      var n = new e();return n.reject(t), n;
    }, e.all = function (t) {
      function n(n, c) {
        n && "function" == typeof n.then || (n = e.resolve(n)), n.then(function (e) {
          o[c] = e, r++, r == t.length && i.resolve(o);
        }, function (t) {
          i.reject(t);
        });
      }for (var o = [], r = 0, i = new e(), c = 0; c < t.length; c++) {
        n(t[c], c);
      }return t.length || i.resolve(o), i;
    }, 'object' != s && module.exports && (module.exports = e), t.define && t.define.amd && t.define([], function () {
      return e;
    }), t.Zousan = e, e.soon = f;
  }("undefined" != typeof commonjsGlobal ? commonjsGlobal : commonjsGlobal);
});

var promise;

if (typeof Promise !== 'undefined') {
    // built-in Promise
    promise = Promise;
} else {
    promise = zousanMin;
}

var Promise$1 = promise;

var ResourceCache = function () {
    function ResourceCache() {
        classCallCheck(this, ResourceCache);

        this.resources = {};
        this._errors = {};
    }

    ResourceCache.prototype.addResource = function addResource(url, img) {
        this.resources[url[0]] = {
            image: img,
            width: +url[1],
            height: +url[2]
        };
    };

    ResourceCache.prototype.isResourceLoaded = function isResourceLoaded(url, checkSVG) {
        if (!url) {
            return false;
        }
        if (this._errors[this._getImgUrl(url)]) {
            return true;
        }
        var img = this.resources[this._getImgUrl(url)];
        if (!img) {
            return false;
        }
        if (checkSVG && isSVG(url[0]) && (+url[1] > img.width || +url[2] > img.height)) {
            return false;
        }
        return true;
    };

    ResourceCache.prototype.getImage = function getImage(url) {
        if (!this.isResourceLoaded(url) || this._errors[this._getImgUrl(url)]) {
            return null;
        }
        return this.resources[this._getImgUrl(url)].image;
    };

    ResourceCache.prototype.markErrorResource = function markErrorResource(url) {
        this._errors[this._getImgUrl(url)] = 1;
    };

    ResourceCache.prototype.merge = function merge(res) {
        if (!res) {
            return this;
        }
        for (var p in res.resources) {
            var img = res.resources[p];
            this.addResource([p, img.width, img.height], img.image);
        }
        return this;
    };

    ResourceCache.prototype._getImgUrl = function _getImgUrl(url) {
        if (!Array.isArray(url)) {
            return url;
        }
        return url[0];
    };

    return ResourceCache;
}();

/**
 * @classdesc
 * Base Class to render layer on HTMLCanvasElement
 * @abstract
 * @protected
 * @memberOf renderer
 * @extends Class
 */

var CanvasRenderer = function (_Class) {
    inherits(CanvasRenderer, _Class);

    /**
     * @param  {Layer} layer the layer to render
     */
    function CanvasRenderer(layer) {
        classCallCheck(this, CanvasRenderer);

        var _this = possibleConstructorReturn(this, _Class.call(this));

        _this.layer = layer;
        return _this;
    }

    /**
     * Whether it's a renderer based on Canvas
     * @return {Boolean}
     */


    CanvasRenderer.prototype.isCanvasRender = function isCanvasRender() {
        return true;
    };

    /**
     * Render the layer
     * @param  {Boolean} isCheckRes whether to check and load external resources in the layer
     */


    CanvasRenderer.prototype.render = function render(isCheckRes) {
        this.prepareRender();
        if (!this.getMap()) {
            return;
        }
        if (!this.layer.isVisible()) {
            this.completeRender();
            return;
        }
        if (!this.resources) {
            this.resources = new ResourceCache();
        }
        if (this.checkResources && isCheckRes) {
            var me = this,
                args = arguments;
            var resources = this.checkResources.apply(this, args);
            if (isArrayHasData(resources)) {
                this.loadResources(resources).then(function () {
                    if (me.layer) {
                        /**
                         * resourceload event, fired when external resources of the layer complete loading.
                         *
                         * @event Layer#resourceload
                         * @type {Object}
                         * @property {String} type              - resourceload
                         * @property {Layer} target    - layer
                         */
                        me.layer.fire('resourceload');
                        me._tryToDraw.apply(me, args);
                    }
                });
            } else {
                this._tryToDraw.apply(this, args);
            }
        } else {
            this._tryToDraw.apply(this, arguments);
        }
    };

    /**
     * Remove the renderer, will be called when layer is removed
     */


    CanvasRenderer.prototype.remove = function remove() {
        this._clearTimeout();
        if (this.onRemove) {
            this.onRemove();
        }
        delete this._northWest;
        delete this.canvas;
        delete this.context;
        delete this._extent2D;
        delete this.resources;
        // requestMapToRender may be overrided, e.g. renderer.TileLayer.Canvas
        CanvasRenderer.prototype.requestMapToRender.call(this);
        delete this.layer;
    };

    /**
     * Get map
     * @return {Map}
     */


    CanvasRenderer.prototype.getMap = function getMap() {
        if (!this.layer) {
            return null;
        }
        return this.layer.getMap();
    };

    /**
     * Get renderer's Canvas image object
     * @return {HTMLCanvasElement}
     */


    CanvasRenderer.prototype.getCanvasImage = function getCanvasImage() {
        if (this._renderZoom !== this.getMap().getZoom() || !this.canvas || !this._extent2D) {
            return null;
        }
        if (this.layer.isEmpty && this.layer.isEmpty()) {
            return null;
        }
        if (this.isBlank && this.isBlank()) {
            return null;
        }
        var map = this.getMap(),
            size = this._extent2D.getSize(),

        // point = this._extent2D.getMin(),
        containerPoint = map._pointToContainerPoint(this._northWest);
        return {
            'image': this.canvas,
            'layer': this.layer,
            'point': containerPoint,
            'size': size,
            'transform': this._transform
        };
    };

    /**
     * Check if the renderer is loaded
     * @return {Boolean}
     */


    CanvasRenderer.prototype.isLoaded = function isLoaded() {
        if (this._loaded) {
            return true;
        }
        return false;
    };

    /**
     * Show the layer
     */


    CanvasRenderer.prototype.show = function show() {
        var mask = this.layer.getMask();
        if (mask) {
            mask._removeZoomCache();
        }
        this.render(true);
    };

    /**
     * Hide the layer
     */


    CanvasRenderer.prototype.hide = function hide() {
        this.clearCanvas();
        this.requestMapToRender();
    };

    CanvasRenderer.prototype.setZIndex = function setZIndex() {
        this.requestMapToRender();
    };

    /**
     * Detect if there is anything painted on the given point
     * @param  {Point} point a 2d point on current zoom
     * @return {Boolean}
     */


    CanvasRenderer.prototype.hitDetect = function hitDetect(point) {
        if (!this.context || this.layer.isEmpty && this.layer.isEmpty() || this._errorThrown) {
            return false;
        }
        var extent2D = this.getMap()._get2DExtent();
        var size = extent2D.getSize();
        var leftTop = extent2D.getMin();
        var detectPoint = point.substract(leftTop);
        if (detectPoint.x < 0 || detectPoint.x > size['width'] || detectPoint.y < 0 || detectPoint.y > size['height']) {
            return false;
        }
        try {
            var imgData = this.context.getImageData(detectPoint.x, detectPoint.y, 1, 1).data;
            if (imgData[3] > 0) {
                return true;
            }
        } catch (error) {
            if (!this._errorThrown) {
                if (console) {
                    console.warn('hit detect failed with tainted canvas, some geometries have external resources in another domain:\n', error);
                }
                this._errorThrown = true;
            }
            //usually a CORS error will be thrown if the canvas uses resources from other domain.
            //this may happen when a geometry is filled with pattern file.
            return false;
        }
        return false;
    };

    /**
     * loadResource from resourceUrls
     * @param  {String[]} resourceUrls    - Array of urls to load
     * @param  {Function} onComplete          - callback after loading complete
     * @param  {Object} context         - callback's context
     * @returns {Promise[]}
     */


    CanvasRenderer.prototype.loadResources = function loadResources(resourceUrls) {
        var resources = this.resources,
            promises = [];
        if (isArrayHasData(resourceUrls)) {
            var cache = {},
                url;
            for (var i = resourceUrls.length - 1; i >= 0; i--) {
                url = resourceUrls[i];
                if (!url || cache[url.join('-')]) {
                    continue;
                }
                cache[url.join('-')] = 1;
                if (!resources.isResourceLoaded(url, true)) {
                    //closure it to preserve url's value
                    promises.push(new Promise$1(this._promiseResource(url)));
                }
            }
        }
        return Promise$1.all(promises);
    };

    /**
     * Prepare rendering,
     */


    CanvasRenderer.prototype.prepareRender = function prepareRender() {
        var map = this.getMap();
        this._renderZoom = map.getZoom();
        this._extent2D = map._get2DExtent();
        this._northWest = map._containerPointToPoint(new Point(0, 0));
        this._loaded = false;
    };

    /**
     * Create renderer's Canvas
     */


    CanvasRenderer.prototype.createCanvas = function createCanvas() {
        if (this.canvas) {
            return;
        }
        var map = this.getMap();
        var size = map.getSize();
        var r = Browser$1.retina ? 2 : 1;
        this.canvas = Canvas.createCanvas(r * size['width'], r * size['height'], map.CanvasClass);
        this.context = this.canvas.getContext('2d');
        if (this.layer.options['globalCompositeOperation']) {
            this.context.globalCompositeOperation = this.layer.options['globalCompositeOperation'];
        }
        if (Browser$1.retina) {
            this.context.scale(2, 2);
        }
        Canvas.setDefaultCanvasSetting(this.context);
        if (this.onCanvasCreate) {
            this.onCanvasCreate();
        }
    };

    /**
     * Resize the canvas
     * @param  {Size} canvasSize the size resizing to
     */


    CanvasRenderer.prototype.resizeCanvas = function resizeCanvas(canvasSize) {
        if (!this.canvas) {
            return;
        }
        var size;
        if (!canvasSize) {
            var map = this.getMap();
            size = map.getSize();
        } else {
            size = canvasSize;
        }
        var r = Browser$1.retina ? 2 : 1;
        //only make canvas bigger, never smaller
        if (this.canvas.width >= r * size['width'] && this.canvas.height >= r * size['height']) {
            return;
        }
        //retina support
        this.canvas.height = r * size['height'];
        this.canvas.width = r * size['width'];
        if (Browser$1.retina) {
            this.context.scale(2, 2);
        }
    };

    /**
     * Clear the canvas to blank
     */


    CanvasRenderer.prototype.clearCanvas = function clearCanvas() {
        if (!this.canvas) {
            return;
        }
        Canvas.clearRect(this.context, 0, 0, this.canvas.width, this.canvas.height);
    };

    /**
     * Prepare the canvas for rendering. <br>
     * 1. Clear the canvas to blank. <br>
     * 2. Clip the canvas by mask if there is any and return the mask's extent
     * @return {PointExtent} mask's extent of current zoom's 2d point.
     */


    CanvasRenderer.prototype.prepareCanvas = function prepareCanvas() {
        if (this._clipped) {
            this.context.restore();
            this._clipped = false;
        }
        if (!this.canvas) {
            this.createCanvas();
        } else {
            this.clearCanvas();
        }
        var mask = this.layer.getMask();
        if (!mask) {
            this.layer.fire('renderstart', {
                'context': this.context
            });
            return null;
        }
        var maskExtent2D = mask._getPainter().get2DExtent();
        if (!maskExtent2D.intersects(this._extent2D)) {
            this.layer.fire('renderstart', {
                'context': this.context
            });
            return maskExtent2D;
        }
        this.context.save();
        mask._paint();
        this.context.clip();
        this._clipped = true;
        /**
         * renderstart event, fired when layer starts to render.
         *
         * @event Layer#renderstart
         * @type {Object}
         * @property {String} type              - renderstart
         * @property {Layer} target    - layer
         * @property {CanvasRenderingContext2D} context - canvas's context
         */
        this.layer.fire('renderstart', {
            'context': this.context
        });
        return maskExtent2D;
    };

    /**
     * Get renderer's extent of 2d points in current zoom
     * @return {PointExtent} 2d extent
     */


    CanvasRenderer.prototype.get2DExtent = function get2DExtent() {
        return this._extent2D;
    };

    /**
     * Request map to render, to redraw all layer's canvas on map's canvas.<br>
     * This should be called once any canvas layer is updated
     */


    CanvasRenderer.prototype.requestMapToRender = function requestMapToRender() {
        if (this.getMap() && !this._suppressMapRender) {
            if (this.context) {
                /**
                 * renderend event, fired when layer ends rendering.
                 *
                 * @event Layer#renderend
                 * @type {Object}
                 * @property {String} type              - renderend
                 * @property {Layer} target    - layer
                 * @property {CanvasRenderingContext2D} context - canvas's context
                 */
                this.layer.fire('renderend', {
                    'context': this.context
                });
            }
            this.getMap()._getRenderer().render();
        }
    };

    /**
     * Ask the layer to fire the layerload event
     */


    CanvasRenderer.prototype.fireLoadedEvent = function fireLoadedEvent() {
        this._loaded = true;
        if (this.layer && !this._suppressMapRender) {
            /**
             * layerload event, fired when layer is loaded.
             *
             * @event Layer#layerload
             * @type {Object}
             * @property {String} type - layerload
             * @property {Layer} target - layer
             */
            this.layer.fire('layerload');
        }
    };

    /**
     * requestMapToRender and fireLoadedEvent
     */


    CanvasRenderer.prototype.completeRender = function completeRender() {
        this.requestMapToRender();
        this.fireLoadedEvent();
    };

    /**
     * Get painter context for painters
     * @return {Object[]} the Canvas2dContext and the resources
     */


    CanvasRenderer.prototype.getPaintContext = function getPaintContext() {
        if (!this.context) {
            return null;
        }
        return [this.context, this.resources];
    };

    /**
     * Get renderer's events registered on the map
     * @return {Object} events
     */


    CanvasRenderer.prototype.getEvents = function getEvents() {
        return {
            '_zoomstart': this.onZoomStart,
            '_zoomend': this.onZoomEnd,
            '_zooming': this.onZooming,
            '_resize': this.onResize,
            '_movestart': this.onMoveStart,
            '_moving': this.onMoving,
            '_moveend': this.onMoveEnd
        };
    };

    /**
     * Should update the layer when zooming? <br>
     * If enabled, renderer's drawOnZooming will be called when map is zooming. <br>
     * Can be disabled to improve performance if not necessary.
     * @return {Boolean}
     */


    CanvasRenderer.prototype.isUpdateWhenZooming = function isUpdateWhenZooming() {
        return false;
    };

    /**
     * onZooming
     * @param  {Object} param event parameters
     */


    CanvasRenderer.prototype.onZooming = function onZooming(param) {
        var map = this.getMap();
        if (!map || !this.layer.isVisible()) {
            return;
        }
        this._suppressMapRender = true;
        this.prepareRender();
        if (this.drawOnZooming && this.isUpdateWhenZooming()) {
            this.prepareCanvas();
            this.drawOnZooming(param);
        } else if (!map._pitch) {
            this._transform = param['matrix']['container'];
        } else if (map._pitch) {
            // leave the layer to blank when map is pitching
            this.prepareCanvas();
        }
        this._suppressMapRender = false;
    };

    /**
     * onZoomStart
     * @param  {Object} param event parameters
     */


    CanvasRenderer.prototype.onZoomStart = function onZoomStart() {
        delete this._transform;
    };

    /**
    * onZoomEnd
    * @param  {Object} param event parameters
    */


    CanvasRenderer.prototype.onZoomEnd = function onZoomEnd() {
        delete this._transform;
        this._drawOnEvent();
    };

    /**
    * onMoveStart
    * @param  {Object} param event parameters
    */


    CanvasRenderer.prototype.onMoveStart = function onMoveStart() {};

    /**
    * onMoving
    * @param  {Object} param event parameters
    */


    CanvasRenderer.prototype.onMoving = function onMoving() {
        if (this.getMap()._pitch) {
            this._drawOnEvent();
        }
    };

    /**
    * onMoveEnd
    * @param  {Object} param event parameters
    */


    CanvasRenderer.prototype.onMoveEnd = function onMoveEnd() {
        this._drawOnEvent();
    };

    /**
    * onResize
    * @param  {Object} param event parameters
    */


    CanvasRenderer.prototype.onResize = function onResize() {
        delete this._extent2D;
        this.resizeCanvas();
        this._drawOnEvent();
    };

    CanvasRenderer.prototype._tryToDraw = function _tryToDraw() {
        this._clearTimeout();
        if (!this.canvas && this.layer.isEmpty && this.layer.isEmpty()) {
            this.completeRender();
            return;
        }
        var me = this,
            args = arguments;
        if (this.layer.options['drawImmediate']) {
            this._painted = true;
            this.draw.apply(this, args);
        } else {
            this._currentFrameId = requestAnimFrame(function () {
                if (me.layer) {
                    me._painted = true;
                    me.draw.apply(me, args);
                }
            });
        }
    };

    CanvasRenderer.prototype._promiseResource = function _promiseResource(url) {
        var me = this,
            resources = this.resources,
            crossOrigin = this.layer.options['crossOrigin'];
        return function (resolve) {
            if (resources.isResourceLoaded(url, true)) {
                resolve(url);
                return;
            }
            var img = new Image();
            if (crossOrigin) {
                img['crossOrigin'] = crossOrigin;
            }
            if (isSVG(url[0]) && !isNode) {
                //amplify the svg image to reduce loading.
                if (url[1]) {
                    url[1] *= 2;
                }
                if (url[2]) {
                    url[2] *= 2;
                }
            }
            img.onload = function () {
                me._cacheResource(url, img);
                resolve(url);
            };
            img.onabort = function (err) {
                if (console) {
                    console.warn('image loading aborted: ' + url[0]);
                }
                if (err) {
                    if (console) {
                        console.warn(err);
                    }
                }
                resolve(url);
            };
            img.onerror = function (err) {
                // if (console) { console.warn('image loading failed: ' + url[0]); }
                if (err && !Browser$1.phantomjs) {
                    if (console) {
                        console.warn(err);
                    }
                }
                resources.markErrorResource(url);
                resolve(url);
            };
            loadImage(img, url);
        };
    };

    CanvasRenderer.prototype._cacheResource = function _cacheResource(url, img) {
        if (!this.layer || !this.resources) {
            return;
        }
        var w = url[1],
            h = url[2];
        if (this.layer.options['cacheSvgOnCanvas'] && isSVG(url[0]) === 1 && (Browser$1.edge || Browser$1.ie)) {
            //opacity of svg img painted on canvas is always 1, so we paint svg on a canvas at first.
            if (isNil(w)) {
                w = img.width || this.layer.options['defaultIconSize'][0];
            }
            if (isNil(h)) {
                h = img.height || this.layer.options['defaultIconSize'][1];
            }
            var canvas = Canvas.createCanvas(w, h);
            Canvas.image(canvas.getContext('2d'), img, 0, 0, w, h);
            img = canvas;
        }
        this.resources.addResource(url, img);
    };

    CanvasRenderer.prototype._drawOnEvent = function _drawOnEvent() {
        if (!this._painted) {
            this.render(true);
        } else {
            //prepareRender is called in render not in draw.
            //Thus prepareRender needs to be called here
            this.prepareRender();
            if (this.layer.isVisible()) {
                this.draw();
            }
        }
    };

    CanvasRenderer.prototype._clearTimeout = function _clearTimeout() {
        if (this._currentFrameId) {
            //clearTimeout(this._currentFrameId);
            cancelAnimFrame(this._currentFrameId);
        }
    };

    return CanvasRenderer;
}(Class);

var DRAG_STAGE_LAYER_ID = INTERNAL_LAYER_PREFIX + '_drag_stage';

var EVENTS$2 = Browser$1.touch ? 'touchstart mousedown' : 'mousedown';

/**
 * Drag handler for geometries.
 * @category handler
 * @extends Handler
 * @ignore
 */

var GeometryDragHandler = function (_Handler) {
    inherits(GeometryDragHandler, _Handler);

    /**
     * @param  {Geometry} target geometry target to drag
     */
    function GeometryDragHandler(target) {
        classCallCheck(this, GeometryDragHandler);
        return possibleConstructorReturn(this, _Handler.call(this, target));
    }

    GeometryDragHandler.prototype.addHooks = function addHooks() {
        this.target.on(EVENTS$2, this._startDrag, this);
    };

    GeometryDragHandler.prototype.removeHooks = function removeHooks() {
        this.target.off(EVENTS$2, this._startDrag, this);
    };

    GeometryDragHandler.prototype._startDrag = function _startDrag(param) {
        var map = this.target.getMap();
        if (!map) {
            return;
        }
        var parent = this.target._getParent();
        if (parent) {
            return;
        }
        if (this.isDragging()) {
            return;
        }
        var domEvent = param['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }
        this.target.on('click', this._endDrag, this);
        this._lastPos = param['coordinate'];
        this._prepareMap();
        this._prepareDragHandler();
        this._dragHandler.onMouseDown(param['domEvent']);
        this._moved = false;
        /**
         * drag start event
         * @event Geometry#dragstart
         * @type {Object}
         * @property {String} type                    - dragstart
         * @property {Geometry} target       - the geometry fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this.target._fireEvent('dragstart', param);
    };

    GeometryDragHandler.prototype._prepareMap = function _prepareMap() {
        var map = this.target.getMap();
        this._mapDraggable = map.options['draggable'];
        this._mapHitDetect = map.options['hitDetect'];
        map._trySetCursor('move');
        map.config({
            'hitDetect': false,
            'draggable': false
        });
    };

    GeometryDragHandler.prototype._prepareDragHandler = function _prepareDragHandler() {
        var map = this.target.getMap();
        this._dragHandler = new DragHandler(map._panels.mapWrapper || map._containerDOM);
        this._dragHandler.on('dragging', this._dragging, this);
        this._dragHandler.on('mouseup', this._endDrag, this);
        this._dragHandler.enable();
    };

    GeometryDragHandler.prototype._prepareShadow = function _prepareShadow() {
        var target = this.target;
        this._prepareDragStageLayer();
        var resources = this._dragStageLayer._getRenderer().resources;
        if (this._shadow) {
            this._shadow.remove();
        }

        this._shadow = target.copy();
        this._shadow.setSymbol(target._getInternalSymbol());
        var shadow = this._shadow;
        if (target.options['dragShadow']) {
            var symbol = lowerSymbolOpacity(shadow._getInternalSymbol(), 0.5);
            shadow.setSymbol(symbol);
        }
        shadow.setId(null);
        //copy connectors
        var shadowConnectors = [];
        if (ConnectorLine._hasConnectors(target)) {
            var connectors = ConnectorLine._getConnectors(target);

            for (var i = 0; i < connectors.length; i++) {
                var targetConn = connectors[i];
                var connOptions = targetConn.config(),
                    connSymbol = targetConn._getInternalSymbol();
                connOptions['symbol'] = lowerSymbolOpacity(connSymbol, 0.5);
                var conn;
                if (targetConn.getConnectSource() === target) {
                    conn = new ConnectorLine(shadow, targetConn.getConnectTarget(), connOptions);
                } else {
                    conn = new ConnectorLine(targetConn.getConnectSource(), shadow, connOptions);
                }
                shadowConnectors.push(conn);
                if (targetConn.getLayer() && targetConn.getLayer()._getRenderer()) {
                    resources.merge(targetConn.getLayer()._getRenderer().resources);
                }
            }
        }
        this._shadowConnectors = shadowConnectors;
        shadowConnectors.push(shadow);
        this._dragStageLayer.bringToFront().addGeometry(shadowConnectors);
    };

    GeometryDragHandler.prototype._onTargetUpdated = function _onTargetUpdated() {
        if (this._shadow) {
            this._shadow.setSymbol(this.target.getSymbol());
        }
    };

    GeometryDragHandler.prototype._prepareDragStageLayer = function _prepareDragStageLayer() {
        var map = this.target.getMap(),
            layer = this.target.getLayer();
        this._dragStageLayer = map.getLayer(DRAG_STAGE_LAYER_ID);
        if (!this._dragStageLayer) {
            this._dragStageLayer = new VectorLayer(DRAG_STAGE_LAYER_ID, {
                'drawImmediate': true
            });
            map.addLayer(this._dragStageLayer);
        }
        //copy resources to avoid repeat resource loading.
        var resources = new ResourceCache();
        resources.merge(layer._getRenderer().resources);
        this._dragStageLayer._getRenderer().resources = resources;
    };

    GeometryDragHandler.prototype._dragging = function _dragging(param) {
        var target = this.target;
        var map = target.getMap(),
            eventParam = map._parseEvent(param['domEvent']);

        var domEvent = eventParam['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }

        if (!this._moved) {
            this._moved = true;
            target.on('symbolchange', this._onTargetUpdated, this);
            // this._prepareMap();
            this._isDragging = true;
            this._prepareShadow();
            if (!target.options['dragShadow']) {
                target.hide();
            }
            this._shadow._fireEvent('dragstart', eventParam);
            return;
        }
        if (!this._shadow) {
            return;
        }
        var axis = this._shadow.options['dragOnAxis'];
        var currentPos = eventParam['coordinate'];
        if (!this._lastPos) {
            this._lastPos = currentPos;
        }
        var dragOffset = currentPos.substract(this._lastPos);
        if (axis === 'x') {
            dragOffset.y = 0;
        } else if (axis === 'y') {
            dragOffset.x = 0;
        }
        this._lastPos = currentPos;
        this._shadow.translate(dragOffset);
        if (!target.options['dragShadow']) {
            target.translate(dragOffset);
        }
        eventParam['dragOffset'] = dragOffset;
        this._shadow._fireEvent('dragging', eventParam);

        /**
         * dragging event
         * @event Geometry#dragging
         * @type {Object}
         * @property {String} type                    - dragging
         * @property {Geometry} target       - the geometry fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        target._fireEvent('dragging', eventParam);
    };

    GeometryDragHandler.prototype._endDrag = function _endDrag(param) {
        var target = this.target,
            map = target.getMap();
        if (this._dragHandler) {
            target.off('click', this._endDrag, this);
            this._dragHandler.disable();
            delete this._dragHandler;
        }
        if (!map) {
            return;
        }
        var eventParam;
        if (map) {
            eventParam = map._parseEvent(param['domEvent']);
        }
        target.off('symbolchange', this._onTargetUpdated, this);

        if (!target.options['dragShadow']) {
            target.show();
        }
        var shadow = this._shadow;
        if (shadow) {
            if (target.options['dragShadow']) {
                target.setCoordinates(shadow.getCoordinates());
            }
            shadow._fireEvent('dragend', eventParam);
            shadow.remove();
            delete this._shadow;
        }
        if (this._shadowConnectors) {
            map.getLayer(DRAG_STAGE_LAYER_ID).removeGeometry(this._shadowConnectors);
            delete this._shadowConnectors;
        }
        delete this._lastPos;

        //restore map status
        map._trySetCursor('default');
        if (isNil(this._mapDraggable)) {
            this._mapDraggable = true;
        }
        map.config({
            'hitDetect': this._mapHitDetect,
            'draggable': this._mapDraggable
        });

        delete this._mapDraggable;
        delete this._mapHitDetect;
        if (this._dragStageLayer) {
            this._dragStageLayer.remove();
        }
        this._isDragging = false;
        /**
         * dragend event
         * @event Geometry#dragend
         * @type {Object}
         * @property {String} type                    - dragend
         * @property {Geometry} target       - the geometry fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        target._fireEvent('dragend', eventParam);
    };

    GeometryDragHandler.prototype.isDragging = function isDragging() {
        if (!this._isDragging) {
            return false;
        }
        return true;
    };

    return GeometryDragHandler;
}(Handler$1);

Geometry.mergeOptions({
    'draggable': false,
    'dragShadow': true,
    'dragOnAxis': null
});

Geometry.addInitHook('addHandler', 'draggable', GeometryDragHandler);

Geometry.include( /** @lends Geometry.prototype */{
    /**
     * Whether the geometry is being dragged.
     * @reutrn {Boolean}
     */
    isDragging: function isDragging() {
        if (this._getParent()) {
            return this._getParent().isDragging();
        }
        if (this['draggable']) {
            return this['draggable'].isDragging();
        }
        return false;
    }
});

Geometry.include( /** @lends Geometry.prototype */{
    /**
     * Start to edit
     * @param {Object} [options=null]        - edit options
     * @param {Object} [options.symbol=null] - symbol for the geometry during editing
     * @return {Geometry} this
     */
    startEdit: function startEdit(opts) {
        if (!this.getMap() || !this.options['editable']) {
            return this;
        }
        this.endEdit();
        this._editor = new GeometryEditor(this, opts);
        this._editor.start();
        this.fire('editstart');
        return this;
    },


    /**
     * End editing.
     * @return {Geometry} this
     */
    endEdit: function endEdit() {
        if (this._editor) {
            this._editor.stop();
            delete this._editor;
            this.fire('editend');
        }
        return this;
    },


    /**
     * Whether the geometry is being edited.
     * @return {Boolean}
     */
    isEditing: function isEditing() {
        if (this._editor) {
            return this._editor.isEditing();
        }
        return false;
    }
});

Geometry.include( /** @lends Geometry.prototype */{
    /**
     * The event handler for all the events.
     * @param  {Event} event - dom event
     * @private
     */
    _onEvent: function _onEvent(event) {
        if (!this.getMap()) {
            return;
        }
        var eventType = this._getEventTypeToFire(event);
        if (eventType === 'contextmenu' && this.listens('contextmenu')) {
            stopPropagation(event);
            preventDefault(event);
        }
        var params = this._getEventParams(event);
        this._fireEvent(eventType, params);
    },

    _getEventTypeToFire: function _getEventTypeToFire(originalEvent) {
        var eventType = originalEvent.type;
        //change event type to contextmenu
        if (eventType === 'click' || eventType === 'mousedown') {
            if (originalEvent.button === 2) {
                eventType = 'contextmenu';
            }
        }
        return eventType;
    },

    /**
     * Generate event parameters
     * @param  {Event} event - dom event
     * @return {Object}
     * @private
     */
    _getEventParams: function _getEventParams(e) {
        var map = this.getMap();
        var eventParam = {
            'domEvent': e
        };
        var actual = e.touches ? e.touches[0] : e;
        if (actual) {
            var containerPoint = getEventContainerPoint(actual, map._containerDOM);
            eventParam['coordinate'] = map.containerPointToCoordinate(containerPoint);
            eventParam['containerPoint'] = containerPoint;
            eventParam['viewPoint'] = map.containerPointToViewPoint(containerPoint);
            eventParam['pont2d'] = map._containerPointToPoint(containerPoint);
        }
        return eventParam;
    },

    /**
     * mouse over event handler
     * @param  {Event} event - mouseover dom event
     * @private
     */
    _onMouseOver: function _onMouseOver(event) {
        if (!this.getMap()) {
            return;
        }
        var originalEvent = event;
        var params = this._getEventParams(originalEvent);
        /**
         * mouseover event for geometry
         * @event Geometry#mouseover
         * @type {Object}
         * @property {String} type                    - mouseover
         * @property {Geometry} target       - the geometry fires mouseover
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this._fireEvent('mouseover', params);
    },

    /**
     * mouse out event handler
     * @param  {Event} event - mouseout dom event
     * @private
     */
    _onMouseOut: function _onMouseOut(event) {
        if (!this.getMap()) {
            return;
        }
        var originalEvent = event;
        var params = this._getEventParams(originalEvent);
        /**
         * mouseout event for geometry
         * @event Geometry#mouseout
         * @type {Object}
         * @property {String} type                    - mouseout
         * @property {Geometry} target       - the geometry fires mouseout
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this._fireEvent('mouseout', params);
    }
});

Geometry.include( /** @lends Geometry.prototype */{
    /**
     * Set an InfoWindow to the geometry
     * @param {Object} options - construct [options]{@link ui.InfoWindow#options} for the InfoWindow
     * @return {Geometry} this
     * @example
     * geometry.setInfoWindow({
     *     title    : 'This is a title',
     *     content  : '<div style="color:#f00">This is content of the InfoWindow</div>'
     * });
     */
    setInfoWindow: function setInfoWindow(options) {
        this._infoWinOptions = extend({}, options);
        if (this._infoWindow) {
            setOptions(this._infoWindow, options);
        } else if (this.getMap()) {
            this._bindInfoWindow(this._infoWinOptions);
        }

        return this;
    },


    /**
     * Get the InfoWindow instance.
     * @return {ui.InfoWindow}
     */
    getInfoWindow: function getInfoWindow() {
        if (!this._infoWindow) {
            return null;
        }
        return this._infoWindow;
    },


    /**
     * Open the InfoWindow, default on the center of the geometry.
     * @param  {Coordinate} [coordinate=null] - coordinate to open the InfoWindow
     * @return {Geometry} this
     */
    openInfoWindow: function openInfoWindow(coordinate) {
        if (!this.getMap()) {
            return this;
        }
        if (!coordinate) {
            coordinate = this.getCenter();
        }
        if (!this._infoWindow) {
            if (this._infoWinOptions && this.getMap()) {
                this._bindInfoWindow(this._infoWinOptions);
                this._infoWindow.show(coordinate);
            }
        } else {
            this._infoWindow.show(coordinate);
        }
        return this;
    },


    /**
     * Close the InfoWindow
     * @return {Geometry} this
     */
    closeInfoWindow: function closeInfoWindow() {
        if (this._infoWindow) {
            this._infoWindow.hide();
        }
        return this;
    },


    /**
     * Remove the InfoWindow
     * @return {Geometry} this
     */
    removeInfoWindow: function removeInfoWindow() {
        this._unbindInfoWindow();
        delete this._infoWinOptions;
        delete this._infoWindow;
        return this;
    },
    _bindInfoWindow: function _bindInfoWindow(options) {
        this._infoWindow = new InfoWindow(options);
        this._infoWindow.addTo(this);

        return this;
    },
    _unbindInfoWindow: function _unbindInfoWindow() {
        if (this._infoWindow) {
            this.closeInfoWindow();
            this._infoWindow.remove();
            delete this._infoWindow;
        }
        return this;
    }
});

/**
 * @classdesc
 * Base class of all the layers that can add/remove geometries. <br>
 * It is abstract and not intended to be instantiated.
 * @category layer
 * @abstract
 * @extends Layer
 */

var OverlayLayer = function (_Layer) {
    inherits(OverlayLayer, _Layer);

    function OverlayLayer(id, geometries, options) {
        classCallCheck(this, OverlayLayer);

        if (geometries && !(geometries instanceof Geometry) && !Array.isArray(geometries) && GEOJSON_TYPES.indexOf(geometries.type) < 0) {
            options = geometries;
            geometries = null;
        }

        var _this = possibleConstructorReturn(this, _Layer.call(this, id, options));

        _this._initCache();
        if (geometries) {
            _this.addGeometry(geometries);
        }
        return _this;
    }

    /**
     * Get a geometry by its id
     * @param  {String|Number} id   - id of the geometry
     * @return {Geometry}
     */


    OverlayLayer.prototype.getGeometryById = function getGeometryById(id) {
        if (isNil(id) || id === '') {
            return null;
        }
        if (!this._geoMap[id]) {
            return null;
        }
        return this._geoMap[id];
    };

    /**
     * Get all the geometries or the ones filtered if a filter function is provided.
     * @param {Function} [filter=undefined]  - a function to filter the geometries
     * @param {Object} [context=undefined]   - context of the filter function, value to use as this when executing filter.
     * @return {Geometry[]}
     */


    OverlayLayer.prototype.getGeometries = function getGeometries(filter, context) {
        if (!filter) {
            return this._geoList.slice(0);
        }
        var result = [],
            geometry,
            filtered;
        for (var i = 0, l = this._geoList.length; i < l; i++) {
            geometry = this._geoList[i];
            if (context) {
                filtered = filter.call(context, geometry);
            } else {
                filtered = filter(geometry);
            }
            if (filtered) {
                result.push(geometry);
            }
        }
        return result;
    };

    /**
     * Get the first geometry, the geometry at the bottom.
     * @return {Geometry} first geometry
     */


    OverlayLayer.prototype.getFirstGeometry = function getFirstGeometry() {
        if (this._geoList.length === 0) {
            return null;
        }
        return this._geoList[0];
    };

    /**
     * Get the last geometry, the geometry on the top
     * @return {Geometry} last geometry
     */


    OverlayLayer.prototype.getLastGeometry = function getLastGeometry() {
        var len = this._geoList.length;
        if (len === 0) {
            return null;
        }
        return this._geoList[len - 1];
    };

    /**
     * Get count of the geometries
     * @return {Number} count
     */


    OverlayLayer.prototype.getCount = function getCount() {
        return this._geoList.length;
    };

    /**
     * Get extent of all the geometries in the layer, return null if the layer is empty.
     * @return {Extent} - extent of the layer
     */


    OverlayLayer.prototype.getExtent = function getExtent() {
        if (this.getCount() === 0) {
            return null;
        }
        var extent = new Extent();
        this.forEach(function (g) {
            extent._combine(g.getExtent());
        });
        return extent;
    };

    /**
     * Executes the provided callback once for each geometry present in the layer in order.
     * @param  {Function} fn - a callback function
     * @param  {*} [context=undefined]   - callback's context, value to use as this when executing callback.
     * @return {OverlayLayer} this
     */


    OverlayLayer.prototype.forEach = function forEach(fn, context) {
        var copyOnWrite = this._geoList.slice(0);
        for (var i = 0, l = copyOnWrite.length; i < l; i++) {
            if (!context) {
                fn(copyOnWrite[i], i);
            } else {
                fn.call(context, copyOnWrite[i], i);
            }
        }
        return this;
    };

    /**
     * Creates a GeometryCollection with all the geometries that pass the test implemented by the provided function.
     * @param  {Function} fn      - Function to test each geometry
     * @param  {*} [context=undefined]  - Function's context, value to use as this when executing function.
     * @return {GeometryCollection} A GeometryCollection with all the geometries that pass the test
     */


    OverlayLayer.prototype.filter = function filter() {
        return GeometryCollection.prototype.filter.apply(this, arguments);
    };

    /**
     * Whether the layer is empty.
     * @return {Boolean}
     */


    OverlayLayer.prototype.isEmpty = function isEmpty() {
        return this._geoList.length === 0;
    };

    /**
     * Adds one or more geometries to the layer
     * @param {Geometry|Geometry[]} geometries - one or more geometries
     * @param {Boolean} [fitView=false]  - automatically set the map to a fit center and zoom for the geometries
     * @return {OverlayLayer} this
     */


    OverlayLayer.prototype.addGeometry = function addGeometry(geometries, fitView) {
        if (!geometries) {
            return this;
        }
        if (geometries.type === 'FeatureCollection') {
            return this.addGeometry(GeoJSON.toGeometry(geometries), fitView);
        } else if (!Array.isArray(geometries)) {
            var count = arguments.length;
            var last = arguments[count - 1];
            geometries = Array.prototype.slice.call(arguments, 0, count - 1);
            fitView = last;
            if (last instanceof Geometry) {
                geometries.push(last);
                fitView = false;
            }
            return this.addGeometry(geometries, fitView);
        } else if (!isArrayHasData(geometries)) {
            return this;
        }
        this._initCache();
        var fitCounter = 0;
        var centerSum = new Coordinate(0, 0);
        var extent = null,
            geo,
            geoId,
            internalId,
            geoCenter,
            geoExtent;
        for (var i = 0, len = geometries.length; i < len; i++) {
            geo = geometries[i];
            if (!geo) {
                throw new Error('Invalid geometry to add to layer(' + this.getId() + ') at index:' + i);
            }
            if (!(geo instanceof Geometry)) {
                geo = Geometry.fromJSON(geo);
            }
            geoId = geo.getId();
            if (!isNil(geoId)) {
                if (!isNil(this._geoMap[geoId])) {
                    throw new Error('Duplicate geometry id in layer(' + this.getId() + '):' + geoId + ', at index:' + i);
                }
                this._geoMap[geoId] = geo;
            }
            internalId = UID();
            //内部全局唯一的id
            geo._setInternalId(internalId);
            this._geoList.push(geo);

            if (fitView === true) {
                geoCenter = geo.getCenter();
                geoExtent = geo.getExtent();
                if (geoCenter && geoExtent) {
                    centerSum._add(geoCenter);
                    if (extent == null) {
                        extent = geoExtent;
                    } else {
                        extent = extent._combine(geoExtent);
                    }
                    fitCounter++;
                }
            }
            if (this.onAddGeometry) {
                this.onAddGeometry(geo);
            }
            geo._bindLayer(this);
            /**
             * add event.
             *
             * @event Geometry#add
             * @type {Object}
             * @property {String} type - add
             * @property {Geometry} target - geometry
             * @property {Layer} layer - the layer added to.
             */
            geo._fireEvent('add', {
                'layer': this
            });
        }
        this._sortGeometries();
        var map = this.getMap();
        if (map) {
            this._getRenderer().onGeometryAdd(geometries);
            if (fitView && extent) {
                var z = map.getFitZoom(extent);
                var center = centerSum._multi(1 / fitCounter);
                map.setCenterAndZoom(center, z);
            }
        }
        /**
         * addgeo event.
         *
         * @event OverlayLayer#addgeo
         * @type {Object}
         * @property {String} type - addgeo
         * @property {OverlayLayer} target - layer
         * @property {Geometry[]} geometries - the geometries to add
         */
        this.fire('addgeo', {
            'geometries': geometries
        });
        return this;
    };

    /**
     * Removes one or more geometries from the layer
     * @param  {String|String[]|Geometry|Geometry[]} geometries - geometry ids or geometries to remove
     * @returns {OverlayLayer} this
     */


    OverlayLayer.prototype.removeGeometry = function removeGeometry(geometries) {
        if (!Array.isArray(geometries)) {
            return this.removeGeometry([geometries]);
        }
        for (var i = geometries.length - 1; i >= 0; i--) {
            if (!(geometries[i] instanceof Geometry)) {
                geometries[i] = this.getGeometryById(geometries[i]);
            }
            if (!geometries[i] || this !== geometries[i].getLayer()) continue;
            geometries[i].remove();
        }
        /**
         * removegeo event.
         *
         * @event OverlayLayer#removegeo
         * @type {Object}
         * @property {String} type - removegeo
         * @property {OverlayLayer} target - layer
         * @property {Geometry[]} geometries - the geometries to remove
         */
        this.fire('removegeo', {
            'geometries': geometries
        });
        return this;
    };

    /**
     * Clear all geometries in this layer
     * @returns {OverlayLayer} this
     */


    OverlayLayer.prototype.clear = function clear() {
        this._clearing = true;
        this.forEach(function (geo) {
            geo.remove();
        });
        this._geoMap = {};
        var old = this._geoList;
        this._geoList = [];
        if (this._getRenderer()) {
            this._getRenderer().onGeometryRemove(old);
        }
        this._clearing = false;
        /**
         * clear event.
         *
         * @event OverlayLayer#clear
         * @type {Object}
         * @property {String} type - clear
         * @property {OverlayLayer} target - layer
         */
        this.fire('clear');
        return this;
    };

    /**
     * Called when geometry is being removed to clear the context concerned.
     * @param  {Geometry} geometry - the geometry instance to remove
     * @protected
     */


    OverlayLayer.prototype.onRemoveGeometry = function onRemoveGeometry(geometry) {
        if (!geometry || this._clearing) {
            return;
        }
        //考察geometry是否属于该图层
        if (this !== geometry.getLayer()) {
            return;
        }
        var internalId = geometry._getInternalId();
        if (isNil(internalId)) {
            return;
        }
        var geoId = geometry.getId();
        if (!isNil(geoId)) {
            delete this._geoMap[geoId];
        }
        var idx = this._findInList(geometry);
        if (idx >= 0) {
            this._geoList.splice(idx, 1);
        }
        if (this._getRenderer()) {
            this._getRenderer().onGeometryRemove([geometry]);
        }
    };

    OverlayLayer.prototype.hide = function hide() {
        for (var i = 0, l = this._geoList.length; i < l; i++) {
            this._geoList[i].onHide();
        }
        return Layer.prototype.hide.call(this);
    };

    /**
     * Identify the geometries on the given coordinate
     * @param  {maptalks.Coordinate} coordinate   - coordinate to identify
     * @param  {Object} [options=null]  - options
     * @param  {Object} [options.count=null] - result count
     * @return {Geometry[]} geometries identified
     */


    OverlayLayer.prototype.identify = function identify(coordinate, options) {
        var geometries = this._geoList,
            filter = options ? options.filter : null,
            hits = [];
        var extent2d;
        var point = this.getMap().coordinateToPoint(coordinate);
        for (var i = geometries.length - 1; i >= 0; i--) {
            var geo = geometries[i];
            if (!geo || !geo.isVisible() || !geo._getPainter()) {
                continue;
            }
            if (!(geo instanceof LineString) || !geo._getArrowStyle()) {
                // Except for LineString with arrows
                extent2d = geo._getPainter().get2DExtent();
                if (!extent2d || !extent2d.contains(point)) {
                    continue;
                }
            }
            if (geo._containsPoint(point) && (!filter || filter(geo))) {
                hits.push(geo);
                if (options['count']) {
                    if (hits.length >= options['count']) {
                        break;
                    }
                }
            }
        }
        return hits;
    };

    OverlayLayer.prototype._initCache = function _initCache() {
        if (!this._geoList) {
            this._geoList = [];
            this._geoMap = {};
        }
    };

    OverlayLayer.prototype._sortGeometries = function _sortGeometries() {
        var _this2 = this;

        this._geoList.sort(function (a, b) {
            return _this2._compare(a, b);
        });
    };

    OverlayLayer.prototype._compare = function _compare(a, b) {
        if (a._zIndex === b._zIndex) {
            return a._getInternalId() - b._getInternalId();
        }
        return a._zIndex - b._zIndex;
    };

    //binarySearch


    OverlayLayer.prototype._findInList = function _findInList(geo) {
        var len = this._geoList.length;
        if (len === 0) {
            return -1;
        }
        var low = 0,
            high = len - 1,
            middle;
        while (low <= high) {
            middle = Math.floor((low + high) / 2);
            if (this._geoList[middle] === geo) {
                return middle;
            } else if (this._compare(this._geoList[middle], geo) > 0) {
                high = middle - 1;
            } else {
                low = middle + 1;
            }
        }
        return -1;
    };

    OverlayLayer.prototype._onGeometryEvent = function _onGeometryEvent(param) {
        if (!param || !param['target']) {
            return;
        }
        var type = param['type'];
        if (type === 'idchange') {
            this._onGeometryIdChange(param);
        } else if (type === 'zindexchange') {
            this._onGeometryZIndexChange(param);
        } else if (type === 'positionchange') {
            this._onGeometryPositionChange(param);
        } else if (type === 'shapechange') {
            this._onGeometryShapeChange(param);
        } else if (type === 'symbolchange') {
            this._onGeometrySymbolChange(param);
        } else if (type === 'show') {
            this._onGeometryShow(param);
        } else if (type === 'hide') {
            this._onGeometryHide(param);
        } else if (type === 'propertieschange') {
            this._onGeometryPropertiesChange(param);
        }
    };

    OverlayLayer.prototype._onGeometryIdChange = function _onGeometryIdChange(param) {
        if (param['new'] === param['old']) {
            if (this._geoMap[param['old']] && this._geoMap[param['old']] === param['target']) {
                return;
            }
        }
        if (!isNil(param['new'])) {
            if (this._geoMap[param['new']]) {
                throw new Error('Duplicate geometry id in layer(' + this.getId() + '):' + param['new']);
            }
            this._geoMap[param['new']] = param['target'];
        }
        if (!isNil(param['old']) && param['new'] !== param['old']) {
            delete this._geoMap[param['old']];
        }
    };

    OverlayLayer.prototype._onGeometryZIndexChange = function _onGeometryZIndexChange(param) {
        if (param['old'] !== param['new']) {
            this._sortGeometries();
            if (this._getRenderer()) {
                this._getRenderer().onGeometryZIndexChange(param);
            }
        }
    };

    OverlayLayer.prototype._onGeometryPositionChange = function _onGeometryPositionChange(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryPositionChange(param);
        }
    };

    OverlayLayer.prototype._onGeometryShapeChange = function _onGeometryShapeChange(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryShapeChange(param);
        }
    };

    OverlayLayer.prototype._onGeometrySymbolChange = function _onGeometrySymbolChange(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometrySymbolChange(param);
        }
    };

    OverlayLayer.prototype._onGeometryShow = function _onGeometryShow(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryShow(param);
        }
    };

    OverlayLayer.prototype._onGeometryHide = function _onGeometryHide(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryHide(param);
        }
    };

    OverlayLayer.prototype._onGeometryPropertiesChange = function _onGeometryPropertiesChange(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryPropertiesChange(param);
        }
    };

    return OverlayLayer;
}(Layer);

/**
 * @property {Object}  options - VectorLayer's options
 * @property {Boolean} options.debug=false           - whether the geometries on the layer is in debug mode.
 * @property {Boolean} options.enableSimplify=true   - whether to simplify geometries before rendering.
 * @property {String}  options.cursor=default        - the cursor style of the layer
 * @property {Boolean} options.geometryEvents=true   - enable/disable firing geometry events, disable it to improve performance.
 * @property {Boolean} options.defaultIconSize=[20,20] - default size of a marker's icon
 * @property {Boolean} [options.cacheVectorOnCanvas=true] - whether to cache vector markers on a canvas, this will improve performance.
 * @memberOf VectorLayer
 * @instance
 */
var options$4 = {
    'debug': false,
    'enableSimplify': true,
    'cursor': 'pointer',
    'geometryEvents': true,
    'defaultIconSize': [20, 20],
    'cacheVectorOnCanvas': true,
    'cacheSvgOnCanvas': false
};

/**
 * @classdesc
 * A layer for managing and rendering geometries.
 * @category layer
 * @extends OverlayLayer
 */

var VectorLayer = function (_OverlayLayer) {
    inherits(VectorLayer, _OverlayLayer);

    /**
     * @param {String|Number} id - layer's id
     * @param {Geometry|Geometry[]} [geometries=null] - geometries to add
     * @param {Object}  [options=null]          - construct options
     * @param {Object}  [options.style=null]    - vectorlayer's style
     * @param {*}  [options.*=null]             - options defined in [VectorLayer]{@link VectorLayer#options}
     */
    function VectorLayer(id, geometries, options) {
        classCallCheck(this, VectorLayer);

        var opts = options || geometries || {};
        var style = opts['style'];
        if (style) {
            opts = extend({}, opts);
        }
        delete opts['style'];

        var _this = possibleConstructorReturn(this, _OverlayLayer.call(this, id, geometries, opts));

        if (style) {
            _this.setStyle(style);
        }
        return _this;
    }

    /**
     * Gets layer's style.
     * @return {Object|Object[]} layer's style
     */


    VectorLayer.prototype.getStyle = function getStyle() {
        if (!this._style) {
            return null;
        }
        return this._style;
    };

    /**
     * Sets style to the layer, styling the geometries satisfying the condition with style's symbol. <br>
     * Based on filter type in [mapbox-gl-js's style specification]{https://www.mapbox.com/mapbox-gl-js/style-spec/#types-filter}.
     * @param {Object|Object[]} style - layer's style
     * @returns {VectorLayer} this
     * @fires VectorLayer#setstyle
     * @example
     * layer.setStyle([
        {
          'filter': ['==', 'count', 100],
          'symbol': {'markerFile' : 'foo1.png'}
        },
        {
          'filter': ['==', 'count', 200],
          'symbol': {'markerFile' : 'foo2.png'}
        }
      ]);
     */


    VectorLayer.prototype.setStyle = function setStyle(style) {
        this._style = style;
        this._cookedStyles = compileStyle(style);
        this.forEach(function (geometry) {
            this._styleGeometry(geometry);
        }, this);
        /**
         * setstyle event.
         *
         * @event VectorLayer#setstyle
         * @type {Object}
         * @property {String} type - setstyle
         * @property {VectorLayer} target - layer
         * @property {Object|Object[]}       style - style to set
         */
        this.fire('setstyle', {
            'style': style
        });
        return this;
    };

    /**
     * Removes layers' style
     * @returns {VectorLayer} this
     * @fires VectorLayer#removestyle
     */


    VectorLayer.prototype.removeStyle = function removeStyle() {
        if (!this._style) {
            return this;
        }
        delete this._style;
        delete this._cookedStyles;
        this.forEach(function (geometry) {
            geometry._setExternSymbol(null);
        }, this);
        /**
         * removestyle event.
         *
         * @event VectorLayer#removestyle
         * @type {Object}
         * @property {String} type - removestyle
         * @property {VectorLayer} target - layer
         */
        this.fire('removestyle');
        return this;
    };

    VectorLayer.prototype.onAddGeometry = function onAddGeometry(geo) {
        var style = this.getStyle();
        if (style) {
            this._styleGeometry(geo);
        }
    };

    VectorLayer.prototype._styleGeometry = function _styleGeometry(geometry) {
        if (!this._cookedStyles) {
            return false;
        }
        var g = getFilterFeature(geometry);
        for (var i = 0, len = this._cookedStyles.length; i < len; i++) {
            if (this._cookedStyles[i]['filter'](g) === true) {
                geometry._setExternSymbol(this._cookedStyles[i]['symbol']);
                return true;
            }
        }
        return false;
    };

    /**
     * Export the VectorLayer's JSON. <br>
     * @param  {Object} [options=null] - export options
     * @param  {Object} [options.geometries=null] - If not null and the layer is a [OverlayerLayer]{@link OverlayLayer},
     *                                            the layer's geometries will be exported with the given "options.geometries" as a parameter of geometry's toJSON.
     * @param  {Extent} [options.clipExtent=null] - if set, only the geometries intersectes with the extent will be exported.
     * @return {Object} layer's JSON
     */


    VectorLayer.prototype.toJSON = function toJSON(options) {
        if (!options) {
            options = {};
        }
        var profile = {
            'type': this.getJSONType(),
            'id': this.getId(),
            'options': this.config()
        };
        if ((isNil(options['style']) || options['style']) && this.getStyle()) {
            profile['style'] = this.getStyle();
        }
        if (isNil(options['geometries']) || options['geometries']) {
            var clipExtent;
            if (options['clipExtent']) {
                clipExtent = new Extent(options['clipExtent']);
            }
            var geoJSONs = [];
            var geometries = this.getGeometries(),
                geoExt,
                json;
            for (var i = 0, len = geometries.length; i < len; i++) {
                geoExt = geometries[i].getExtent();
                if (!geoExt || clipExtent && !clipExtent.intersects(geoExt)) {
                    continue;
                }
                json = geometries[i].toJSON(options['geometries']);
                if (json['symbol'] && this.getStyle()) {
                    json['symbol'] = geometries[i]._symbolBeforeStyle ? extend({}, geometries[i]._symbolBeforeStyle) : null;
                }
                geoJSONs.push(json);
            }
            profile['geometries'] = geoJSONs;
        }
        return profile;
    };

    /**
     * Reproduce a VectorLayer from layer's JSON.
     * @param  {Object} layerJSON - layer's JSON
     * @return {VectorLayer}
     * @static
     * @private
     * @function
     */


    VectorLayer.fromJSON = function fromJSON(json) {
        if (!json || json['type'] !== 'VectorLayer') {
            return null;
        }
        var layer = new VectorLayer(json['id'], json['options']);
        var geoJSONs = json['geometries'];
        var geometries = [];
        for (var i = 0; i < geoJSONs.length; i++) {
            var geo = Geometry.fromJSON(geoJSONs[i]);
            if (geo) {
                geometries.push(geo);
            }
        }
        layer.addGeometry(geometries);
        if (json['style']) {
            layer.setStyle(json['style']);
        }
        return layer;
    };

    return VectorLayer;
}(OverlayLayer);

VectorLayer.mergeOptions(options$4);

VectorLayer.registerJSONType('VectorLayer');

var EVENTS = 'mousedown mouseup mousemove click dblclick contextmenu touchstart touchmove touchend';

var MapGeometryEventsHandler = function (_Handler) {
    inherits(MapGeometryEventsHandler, _Handler);

    function MapGeometryEventsHandler() {
        classCallCheck(this, MapGeometryEventsHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapGeometryEventsHandler.prototype.addHooks = function addHooks() {
        var map = this.target;
        var dom = map._panels.allLayers || map._containerDOM;
        if (dom) {
            on(dom, EVENTS, this._identifyGeometryEvents, this);
        }
    };

    MapGeometryEventsHandler.prototype.removeHooks = function removeHooks() {
        var map = this.target;
        var dom = map._panels.allLayers || map._containerDOM;
        if (dom) {
            off(dom, EVENTS, this._identifyGeometryEvents, this);
        }
    };

    MapGeometryEventsHandler.prototype._identifyGeometryEvents = function _identifyGeometryEvents(domEvent) {
        var map = this.target;
        var vectorLayers = map._getLayers(function (layer) {
            if (layer instanceof VectorLayer) {
                return true;
            }
            return false;
        });
        if (map.isZooming() || map.isMoving() || !vectorLayers || vectorLayers.length === 0) {
            return;
        }
        var eventType = domEvent.type;
        // ignore click lasted for more than 300ms.
        if (eventType === 'mousedown') {
            this._mouseDownTime = now();
        } else if (eventType === 'click' && this._mouseDownTime) {
            var time = now();
            if (time - this._mouseDownTime > 300) {
                return;
            }
        }
        var layers = [];
        for (var i = 0; i < vectorLayers.length; i++) {
            if (vectorLayers[i].options['geometryEvents']) {
                layers.push(vectorLayers[i]);
            }
        }
        if (layers.length === 0) {
            return;
        }

        var actual = domEvent.touches && domEvent.touches.length > 0 ? domEvent.touches[0] : domEvent.changedTouches && domEvent.changedTouches.length > 0 ? domEvent.changedTouches[0] : domEvent;
        if (!actual) {
            return;
        }
        var containerPoint = getEventContainerPoint(actual, map._containerDOM),
            coordinate = map.containerPointToCoordinate(containerPoint);
        if (eventType === 'touchstart') {
            preventDefault(domEvent);
        }
        var geometryCursorStyle = null;
        var identifyOptions = {
            'includeInternals': true,
            //return only one geometry on top,
            'filter': function filter(geometry) {
                var eventToFire = geometry._getEventTypeToFire(domEvent);
                if (eventType === 'mousemove') {
                    if (!geometryCursorStyle && geometry.options['cursor']) {
                        geometryCursorStyle = geometry.options['cursor'];
                    }
                    if (!geometry.listens('mousemove') && !geometry.listens('mouseover')) {
                        return false;
                    }
                } else if (!geometry.listens(eventToFire)) {
                    return false;
                }

                return true;
            },
            'count': 1,
            'coordinate': coordinate,
            'layers': layers
        };
        var callback = fireGeometryEvent.bind(this);

        if (this._queryIdentifyTimeout) {
            cancelAnimFrame(this._queryIdentifyTimeout);
        }
        if (eventType === 'mousemove' || eventType === 'touchmove') {
            this._queryIdentifyTimeout = requestAnimFrame(function () {
                map.identify(identifyOptions, callback);
            });
        } else {
            map.identify(identifyOptions, callback);
        }

        function fireGeometryEvent(geometries) {
            var propagation = true;
            if (eventType === 'mousemove') {
                var geoMap = {};
                if (isArrayHasData(geometries)) {
                    for (var _i = geometries.length - 1; _i >= 0; _i--) {
                        if (!(geometries[_i] instanceof Geometry)) {
                            continue;
                        }
                        geoMap[geometries[_i]._getInternalId()] = geometries[_i];
                        geometries[_i]._onEvent(domEvent);
                        //the first geometry is on the top, so ignore the latter cursors.
                        propagation = geometries[_i]._onMouseOver(domEvent);
                    }
                }

                map._setPriorityCursor(geometryCursorStyle);

                var oldTargets = this._prevMouseOverTargets;
                this._prevMouseOverTargets = geometries;
                if (isArrayHasData(oldTargets)) {
                    for (var _i2 = oldTargets.length - 1; _i2 >= 0; _i2--) {
                        var oldTarget = oldTargets[_i2];
                        if (!(oldTarget instanceof Geometry)) {
                            continue;
                        }
                        var oldTargetId = oldTargets[_i2]._getInternalId();
                        if (geometries && geometries.length > 0) {
                            var mouseout = true;
                            /**
                             * 鼠标经过的新位置中不包含老的目标geometry
                             */
                            if (geoMap[oldTargetId]) {
                                mouseout = false;
                            }
                            if (mouseout) {
                                oldTarget._onMouseOut(domEvent);
                            }
                        } else {
                            //鼠标新的位置不包含任何geometry，将触发之前target的mouseOut事件
                            oldTarget._onMouseOut(domEvent);
                        }
                    }
                }
            } else {
                if (!geometries || geometries.length === 0) {
                    return;
                }
                for (var _i3 = geometries.length - 1; _i3 >= 0; _i3--) {
                    if (!(geometries[_i3] instanceof Geometry)) {
                        continue;
                    }
                    propagation = geometries[_i3]._onEvent(domEvent);
                    break;
                }
            }
            if (propagation === false) {
                stopPropagation(domEvent);
            }
        }
    };

    return MapGeometryEventsHandler;
}(Handler$1);

Map.mergeOptions({
    'geometryEvents': true
});

Map.addOnLoadHook('addHandler', 'geometryEvents', MapGeometryEventsHandler);

var MapScrollWheelZoomHandler = function (_Handler) {
    inherits(MapScrollWheelZoomHandler, _Handler);

    function MapScrollWheelZoomHandler() {
        classCallCheck(this, MapScrollWheelZoomHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapScrollWheelZoomHandler.prototype.addHooks = function addHooks() {
        addDomEvent(this.target._containerDOM, 'mousewheel', this._onWheelScroll, this);
    };

    MapScrollWheelZoomHandler.prototype.removeHooks = function removeHooks() {
        removeDomEvent(this.target._containerDOM, 'mousewheel', this._onWheelScroll);
    };

    MapScrollWheelZoomHandler.prototype._onWheelScroll = function _onWheelScroll(evt) {
        var map = this.target;
        var container = map._containerDOM;
        preventDefault(evt);
        stopPropagation(evt);
        if (map.isZooming()) {
            return false;
        }
        var levelValue = (evt.wheelDelta ? evt.wheelDelta : evt.detail) > 0 ? 1 : -1;
        if (evt.detail) {
            levelValue *= -1;
        }
        var mouseOffset = getEventContainerPoint(evt, container);
        if (this._scrollZoomFrame) {
            cancelAnimFrame(this._scrollZoomFrame);
        }
        this._scrollZoomFrame = requestAnimFrame(function () {
            map._zoomAnimation(map.getZoom() + levelValue, mouseOffset);
        });

        return false;
    };

    return MapScrollWheelZoomHandler;
}(Handler$1);

Map.mergeOptions({
    'scrollWheelZoom': true
});

Map.addOnLoadHook('addHandler', 'scrollWheelZoom', MapScrollWheelZoomHandler);

//handler to zoom map by pinching

var MapTouchZoomHandler = function (_Handler) {
    inherits(MapTouchZoomHandler, _Handler);

    function MapTouchZoomHandler() {
        classCallCheck(this, MapTouchZoomHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapTouchZoomHandler.prototype.addHooks = function addHooks() {
        addDomEvent(this.target._containerDOM, 'touchstart', this._onTouchStart, this);
    };

    MapTouchZoomHandler.prototype.removeHooks = function removeHooks() {
        removeDomEvent(this.target._containerDOM, 'touchstart', this._onTouchStart);
    };

    MapTouchZoomHandler.prototype._onTouchStart = function _onTouchStart(event) {
        var map = this.target;
        if (!event.touches || event.touches.length !== 2 || map.isZooming()) {
            return;
        }
        var container = map._containerDOM;
        var p1 = getEventContainerPoint(event.touches[0], container),
            p2 = getEventContainerPoint(event.touches[1], container);

        this._startDist = p1.distanceTo(p2);
        this._startZoom = map.getZoom();

        var size = map.getSize();
        this._Origin = new Point(size['width'] / 2, size['height'] / 2);
        addDomEvent(document, 'touchmove', this._onTouchMove, this);
        addDomEvent(document, 'touchend', this._onTouchEnd, this);
        preventDefault(event);

        map.onZoomStart.apply(map);
        /**
          * touchzoomstart event
          * @event Map#touchzoomstart
          * @type {Object}
          * @property {String} type                    - touchzoomstart
          * @property {Map} target                     - the map fires event
          * @property {Number} from                    - zoom level zooming from
          */
        map._fireEvent('touchzoomstart', { 'from': this._startZoom });
    };

    MapTouchZoomHandler.prototype._onTouchMove = function _onTouchMove(event) {
        var map = this.target;
        if (!event.touches || event.touches.length !== 2 || !map.isZooming()) {
            return;
        }
        var container = map._containerDOM,
            p1 = getEventContainerPoint(event.touches[0], container),
            p2 = getEventContainerPoint(event.touches[1], container),
            scale = p1.distanceTo(p2) / this._startDist;

        this._scale = scale;
        var res = map._getResolution(this._startZoom) / scale;
        var zoom = map.getZoomFromRes(res);
        map.onZooming(zoom, this._Origin);
        /**
          * touchzooming event
          * @event Map#touchzooming
          * @type {Object}
          * @property {String} type                    - touchzooming
          * @property {Map} target                     - the map fires event
          */
        map._fireEvent('touchzooming');
    };

    MapTouchZoomHandler.prototype._onTouchEnd = function _onTouchEnd() {
        var map = this.target;
        if (!map._zooming) {
            map._zooming = false;
            return;
        }
        map._zooming = false;

        off(document, 'touchmove', this._onTouchMove, this);
        off(document, 'touchend', this._onTouchEnd, this);

        var scale = this._scale;
        var zoom = map.getZoomForScale(scale);
        if (zoom === -1) {
            zoom = map.getZoom();
        }

        if (zoom !== map.getZoom()) {
            map._zoomAnimation(zoom, this._Origin, this._scale);
        } else {
            map.onZoomEnd(zoom);
        }
        /**
         * touchzoomend event
         * @event Map#touchzoomend
         * @type {Object}
         * @property {String} type                    - touchzoomend
         * @property {Map} target            - the map fires event
         */
        map._fireEvent('touchzoomend');
    };

    return MapTouchZoomHandler;
}(Handler$1);

Map.mergeOptions({
    'touchZoom': true
});

Map.addOnLoadHook('addHandler', 'touchZoom', MapTouchZoomHandler);

Map.include( /** @lends Map.prototype */{
    _registerDomEvents: function _registerDomEvents(remove) {
        var events =
        /**
         * mousedown event
         * @event Map#mousedown
         * @type {Object}
         * @property {String} type                    - mousedown
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'mousedown ' +
        /**
         * mouseup event
         * @event Map#mouseup
         * @type {Object}
         * @property {String} type                    - mouseup
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'mouseup ' +
        /**
         * mouseover event
         * @event Map#mouseover
         * @type {Object}
         * @property {String} type                    - mouseover
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'mouseover ' +
        /**
         * mouseout event
         * @event Map#mouseout
         * @type {Object}
         * @property {String} type                    - mouseout
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'mouseout ' +
        /**
         * mousemove event
         * @event Map#mousemove
         * @type {Object}
         * @property {String} type                    - mousemove
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'mousemove ' +
        /**
         * click event
         * @event Map#click
         * @type {Object}
         * @property {String} type                    - click
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'click ' +
        /**
         * dblclick event
         * @event Map#dblclick
         * @type {Object}
         * @property {String} type                    - dblclick
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'dblclick ' +
        /**
         * contextmenu event
         * @event Map#contextmenu
         * @type {Object}
         * @property {String} type                    - contextmenu
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'contextmenu ' +
        /**
         * keypress event
         * @event Map#keypress
         * @type {Object}
         * @property {String} type                    - keypress
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'keypress ' +
        /**
         * touchstart event
         * @event Map#touchstart
         * @type {Object}
         * @property {String} type                    - touchstart
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'touchstart ' +
        /**
         * touchmove event
         * @event Map#touchmove
         * @type {Object}
         * @property {String} type                    - touchmove
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'touchmove ' +
        /**
         * touchend event
         * @event Map#touchend
         * @type {Object}
         * @property {String} type                    - touchend
         * @property {Map} target            - the map fires event
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        'touchend ';
        //phantomjs will crash when registering events on canvasContainer
        var dom = this._panels.mapWrapper || this._containerDOM;
        if (remove) {
            removeDomEvent(dom, events, this._handleDOMEvent, this);
        } else {
            addDomEvent(dom, events, this._handleDOMEvent, this);
        }
    },

    _handleDOMEvent: function _handleDOMEvent(e) {
        var type = e.type;
        if (type === 'click') {
            var button = e.button;
            if (button === 2) {
                type = 'contextmenu';
            }
        }
        // prevent default contextmenu
        if (type === 'contextmenu') {
            preventDefault(e);
        }
        if (this._ignoreEvent(e)) {
            return;
        }
        // ignore click lasted for more than 300ms.
        if (type === 'mousedown') {
            this._mouseDownTime = now();
        } else if (type === 'click' && this._mouseDownTime) {
            var time = now();
            if (time - this._mouseDownTime > 300) {
                return;
            }
        }
        this._fireDOMEvent(this, e, type);
    },

    _ignoreEvent: function _ignoreEvent(domEvent) {
        //ignore events originated from control and ui doms.
        if (!domEvent || !this._panels.control) {
            return false;
        }
        var target = domEvent.srcElement || domEvent.target;
        if (target) {
            while (target && target !== this._containerDOM) {
                if (target.className && target.className.indexOf && (target.className.indexOf('maptalks-control') >= 0 || target.className.indexOf('maptalks-ui') >= 0)) {
                    return true;
                }
                target = target.parentNode;
            }
        }
        return false;
    },

    _parseEvent: function _parseEvent(e, type) {
        if (!e) {
            return null;
        }
        var eventParam = {
            'domEvent': e
        };
        if (type !== 'keypress') {
            var actual = e.touches && e.touches.length > 0 ? e.touches[0] : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : e;
            if (actual) {
                var containerPoint = getEventContainerPoint(actual, this._containerDOM);
                eventParam['coordinate'] = this.containerPointToCoordinate(containerPoint);
                eventParam['containerPoint'] = containerPoint;
                eventParam['viewPoint'] = this.containerPointToViewPoint(containerPoint);
                eventParam['point2d'] = this._containerPointToPoint(containerPoint);
            }
        }
        return eventParam;
    },

    _fireDOMEvent: function _fireDOMEvent(target, e, type) {
        var eventParam = this._parseEvent(e, type);
        this._fireEvent(type, eventParam);
    }
});

Map.include( /** @lends Map.prototype */{
    /**
     * Request for the full screen
     * @return {Map} this
     */
    requestFullScreen: function requestFullScreen() {
        /**
         * fullscreenstart event
         * @event Map#fullscreenstart
         * @type {Object}
         * @property {String} type                    - fullscreenstart
         * @property {Map} target            - the map fires event
         */
        this._fireEvent('fullscreenstart');
        this._requestFullScreen(this._containerDOM);
        /**
         * fullscreenend event
         * @event Map#fullscreenend
         * @type {Object}
         * @property {String} type                    - fullscreenend
         * @property {Map} target            - the map fires event
         */
        this._fireEvent('fullscreenend');
        return this;
    },


    /**
     * Cancel full screen
     * @return {Map} this
     */
    cancelFullScreen: function cancelFullScreen() {
        this._cancelFullScreen(this._containerDOM);
        /**
         * cancelfullscreen event
         * @event Map#cancelfullscreen
         * @type {Object}
         * @property {String} type                    - cancelfullscreen
         * @property {Map} target            - the map fires event
         */
        this._fireEvent('cancelfullscreen');
        return this;
    },
    _requestFullScreen: function _requestFullScreen(dom) {
        if (dom.requestFullScreen) {
            dom.requestFullScreen();
        } else if (dom.mozRequestFullScreen) {
            dom.mozRequestFullScreen();
        } else if (dom.webkitRequestFullScreen) {
            dom.webkitRequestFullScreen();
        } else if (dom.msRequestFullScreen) {
            dom.msRequestFullScreen();
        } else {
            var features = 'fullscreen=1,status=no,resizable=yes,top=0,left=0,scrollbars=no,' + 'titlebar=no,menubar=no,location=no,toolbar=no,z-look=yes,' + 'width=' + (screen.availWidth - 8) + ',height=' + (screen.availHeight - 45);
            var newWin = window.open(location.href, '_blank', features);
            if (newWin !== null) {
                window.opener = null;
                //close parent window
                window.close();
            }
        }
    },
    _cancelFullScreen: function _cancelFullScreen() {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else {
            var features = 'fullscreen=no,status=yes,resizable=yes,scrollbars=no,' + 'titlebar=no,menubar=yes,location=yes,toolbar=yes,z-look=yes';
            var newWin = window.open(location.href, '_blank', features);
            if (newWin !== null) {
                window.opener = null;
                //close parent window
                window.close();
            }
        }
    }
});

Map.include( /** @lends Map.prototype */{
    /**
     * Pan to the given coordinate
     * @param {Coordinate} coordinate - coordinate to pan to
     * @param {Object} [options=null] - pan options
     * @param {Boolean} [options.animation=null] - whether pan with animation
     * @param {Boolean} [options.duration=600] - pan animation duration
     * @return {Map} this
     */
    panTo: function panTo(coordinate, options) {
        if (!coordinate) {
            return this;
        }
        var map = this;
        coordinate = new Coordinate(coordinate);
        var dest = this.coordinateToContainerPoint(coordinate),
            current = this.coordinateToContainerPoint(this.getCenter());
        return this._panBy(dest.substract(current), options, function () {
            var c = map.getProjection().project(coordinate);
            map._setPrjCenterAndMove(c);
        });
    },

    /**
     * Pan the map by the give point
     * @param  {Point} point - distance to pan, in pixel
     * @param {Object} [options=null] - pan options
     * @param {Boolean} [options.animation=null] - whether pan with animation
     * @param {Boolean} [options.duration=600] - pan animation duration
     * @return {Map} this
     */
    panBy: function panBy(offset, options) {
        return this._panBy(offset, options);
    },

    _panBy: function _panBy(offset, options, cb) {
        if (!offset) {
            return this;
        }
        offset = new Point(offset).multi(-1);
        this.onMoveStart();
        if (!options) {
            options = {};
        }
        if (typeof options['animation'] === 'undefined' || options['animation']) {
            this._panAnimation(offset, options['duration'], cb);
        } else {
            this.offsetPlatform(offset);
            this._offsetCenterByPixel(offset);
            this.onMoving();
            if (cb) {
                cb();
            }
            this.onMoveEnd();
        }
        return this;
    },

    _panAnimation: function _panAnimation(offset, t, onFinish) {
        this._getRenderer().panAnimation(offset, t, onFinish);
    }

});

/** Profile **/
/**
 * Produce a geometry from one or more [JSON]{@link Geometry#toJSON} or GeoJSON.
 * @param  {Object} json - a geometry's JSON or a geojson
 * @return {Geometry} geometry
 * @example
 * var profile = {
        "feature": {
              "type": "Feature",
              "id" : "point1",
              "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
              "properties": {"prop0": "value0"}
        },
        //construct options.
        "options":{
            "draggable" : true
        },
        //symbol
        "symbol":{
            "markerFile"  : "http://foo.com/icon.png",
            "markerWidth" : 20,
            "markerHeight": 20
        }
    };
    var marker = Geometry.fromJSON(profile);
 */
Geometry.fromJSON = function (json) {
    if (Array.isArray(json)) {
        var result = [],
            c;
        for (var i = 0, len = json.length; i < len; i++) {
            c = Geometry.fromJSON(json[i]);
            if (Array.isArray(json)) {
                result = result.concat(c);
            } else {
                result.push(c);
            }
        }
        return result;
    }

    if (json && !json['feature']) {
        return GeoJSON.toGeometry(json);
    }
    var geometry;
    if (json['subType']) {
        geometry = Geometry.getClass(json['subType']).fromJSON(json);
        if (!isNil(json['feature']['id'])) {
            geometry.setId(json['feature']['id']);
        }
    } else {
        geometry = GeoJSON.toGeometry(json['feature']);
        if (json['options']) {
            geometry.config(json['options']);
        }
    }
    if (json['symbol']) {
        geometry.setSymbol(json['symbol']);
    }
    if (json['infoWindow']) {
        geometry.setInfoWindow(json['infoWindow']);
    }
    return geometry;
};

/**
 * Reproduce a Layer from layer's JSON.
 * @param  {Object} layerJSON - layer's JSON
 * @return {Layer}
 */
Layer.fromJSON = function (layerJSON) {
    if (!layerJSON) {
        return null;
    }
    var layerType = layerJSON['type'];
    var clazz = Layer.getClass(layerType);
    if (!clazz || !clazz.fromJSON) {
        throw new Error('unsupported layer type:' + layerType);
    }
    return clazz.fromJSON(layerJSON);
};

Map.include( /** @lends Map.prototype */{
    /**
     * @property {String}  - Version of the [JSON]{@link Map#toJSON} schema.
     * @constant
     * @static
     */
    'JSON_VERSION': '1.0',
    /**
     * Export the map's json, a snapshot of the map in JSON format.<br>
     * It can be used to reproduce the instance by [fromJSON]{@link Map#fromJSON} method
     * @param  {Object} [options=null] - export options
     * @param  {Boolean|Object} [options.baseLayer=null] - whether to export base layer's JSON, if yes, it will be used as layer's toJSON options.
     * @param  {Boolean|Extent} [options.clipExtent=null] - if set with an extent instance, only the geometries intersectes with the extent will be exported.
     *                                                             If set to true, map's current extent will be used.
     * @param  {Boolean|Object|Object[]} [options.layers=null] - whether to export other layers' JSON, if yes, it will be used as layer's toJSON options.
     *                                                        It can also be an array of layer export options with a "id" attribute to filter the layers to export.
     * @return {Object} layer's JSON
     */
    toJSON: function toJSON(options) {
        if (!options) {
            options = {};
        }
        var json = {
            'version': this['JSON_VERSION'],
            'extent': this.getExtent().toJSON()
        };
        json['options'] = this.config();
        json['options']['center'] = this.getCenter();
        json['options']['zoom'] = this.getZoom();

        var baseLayer = this.getBaseLayer();
        if ((isNil(options['baseLayer']) || options['baseLayer']) && baseLayer) {
            json['baseLayer'] = baseLayer.toJSON(options['baseLayer']);
        }
        var extraLayerOptions = {};
        if (options['clipExtent']) {
            //if clipExtent is set, only geometries intersecting with extent will be exported.
            //clipExtent's value can be an extent or true (map's current extent)
            if (options['clipExtent'] === true) {
                extraLayerOptions['clipExtent'] = this.getExtent();
            } else {
                extraLayerOptions['clipExtent'] = options['clipExtent'];
            }
        }
        var i,
            len,
            layers,
            opts,
            layersJSON = [];
        if (isNil(options['layers']) || options['layers'] && !Array.isArray(options['layers'])) {
            layers = this.getLayers();
            for (i = 0, len = layers.length; i < len; i++) {
                if (!layers[i].toJSON) {
                    continue;
                }
                opts = extend({}, isObject(options['layers']) ? options['layers'] : {}, extraLayerOptions);
                layersJSON.push(layers[i].toJSON(opts));
            }
            json['layers'] = layersJSON;
        } else if (isArrayHasData(options['layers'])) {
            layers = options['layers'];
            for (i = 0; i < layers.length; i++) {
                var exportOption = layers[i];
                var layer = this.getLayer(exportOption['id']);
                if (!layer.toJSON) {
                    continue;
                }
                opts = extend({}, exportOption['options'], extraLayerOptions);
                layersJSON.push(layer.toJSON(opts));
            }
            json['layers'] = layersJSON;
        } else {
            json['layers'] = [];
        }
        return json;
    }
});

/**
 * Reproduce a map from map's profile JSON.
 * @param {(string|HTMLElement|object)} container - The container to create the map on, can be:<br>
 *                                          1. A HTMLElement container.<br/>
 *                                          2. ID of a HTMLElement container.<br/>
 *                                          3. A canvas compatible container in node,
 *                                          e.g. [node-canvas]{@link https://github.com/Automattic/node-canvas},
 *                                              [canvas2svg]{@link https://github.com/gliffy/canvas2svg}
 * @param  {Object} mapJSON - map's profile JSON
 * @param  {Object} [options=null] - options
 * @param  {Object} [options.baseLayer=null] - whether to import the baseLayer
 * @param  {Object} [options.layers=null]    - whether to import the layers
 * @return {Map}
 * @static
 * @function
 * @example
 * var map = Map.fromJSON('map', mapProfile);
 */
Map.fromJSON = function (container, profile, options) {
    if (!container || !profile) {
        return null;
    }
    if (!options) {
        options = {};
    }
    var map = new Map(container, profile['options']);
    if (isNil(options['baseLayer']) || options['baseLayer']) {
        var baseLayer = Layer.fromJSON(profile['baseLayer']);
        if (baseLayer) {
            map.setBaseLayer(baseLayer);
        }
    }
    if (isNil(options['layers']) || options['layers']) {
        var layers = [];
        var layerJSONs = profile['layers'];
        for (var i = 0; i < layerJSONs.length; i++) {
            var layer = Layer.fromJSON(layerJSONs[i]);
            layers.push(layer);
        }
        map.addLayer(layers);
    }

    return map;
};

/**
 * Methods of topo computations
 */
Map.include( /** @lends Map.prototype */{
    /**
     * Caculate distance of two coordinates.
     * @param {Number[]|Coordinate} coord1 - coordinate 1
     * @param {Number[]|Coordinate} coord2 - coordinate 2
     * @return {Number} distance, unit is meter
     * @example
     * var distance = map.computeLength([0, 0], [0, 20]);
     */
    computeLength: function computeLength(coord1, coord2) {
        if (!this.getProjection()) {
            return null;
        }
        var p1 = new Coordinate(coord1),
            p2 = new Coordinate(coord2);
        if (p1.equals(p2)) {
            return 0;
        }
        return this.getProjection().measureLength(p1, p2);
    },

    /**
     * Caculate a geometry's length.
     * @param {Geometry} geometry - geometry to caculate
     * @return {Number} length, unit is meter
     */
    computeGeometryLength: function computeGeometryLength(geometry) {
        return geometry._computeGeodesicLength(this.getProjection());
    },

    /**
     * Caculate a geometry's area.
     * @param  {Geometry} geometry - geometry to caculate
     * @return {Number} area, unit is sq.meter
     */
    computeGeometryArea: function computeGeometryArea(geometry) {
        return geometry._computeGeodesicArea(this.getProjection());
    },

    /**
     * Identify the geometries on the given coordinate.
     * @param {Object} opts - the identify options
     * @param {Coordinate} opts.coordinate - coordinate to identify
     * @param {Object}   opts.layers        - the layers to perform identify on.
     * @param {Function} [opts.filter=null] - filter function of the result geometries, return false to exclude.
     * @param {Number}   [opts.count=null]  - limit of the result count.
     * @param {Boolean}  [opts.includeInternals=false] - whether to identify internal layers.
     * @param {Boolean}  [opts.includeInvisible=false] - whether to identify invisible layers.
     * @param {Function} callback           - the callback function using the result geometries as the parameter.
     * @return {Map} this
     * @example
     * map.identify({
     *      coordinate: [0, 0],
     *      layers: [layer]
     *  },
     *  geos => {
     *      console.log(geos);
     *  });
     */
    identify: function identify(opts, callback) {
        if (!opts) {
            return this;
        }
        var reqLayers = opts['layers'];
        if (!isArrayHasData(reqLayers)) {
            return this;
        }
        var layers = [];
        for (var i = 0, len = reqLayers.length; i < len; i++) {
            if (isString(reqLayers[i])) {
                layers.push(this.getLayer(reqLayers[i]));
            } else {
                layers.push(reqLayers[i]);
            }
        }
        var coordinate = new Coordinate(opts['coordinate']);
        var options = extend({}, opts);
        var hits = [];
        for (var _i = layers.length - 1; _i >= 0; _i--) {
            if (opts['count'] && hits.length >= opts['count']) {
                break;
            }
            var layer = layers[_i];
            if (!layer || !layer.getMap() || !opts['includeInvisible'] && !layer.isVisible() || !opts['includeInternals'] && layer.getId().indexOf(INTERNAL_LAYER_PREFIX) >= 0) {
                continue;
            }
            var layerHits = layer.identify(coordinate, options);
            if (layerHits) {
                if (Array.isArray(layerHits)) {
                    hits.push.apply(hits, layerHits);
                } else {
                    hits.push(layerHits);
                }
            }
        }
        callback.call(this, hits);
        return this;
    }

});

Map.include( /** @lends Map.prototype */{
    _zoom: function _zoom(nextZoom, origin, startScale) {
        if (!this.options['zoomable'] || this.isZooming()) {
            return;
        }
        nextZoom = this._checkZoom(nextZoom);
        this.onZoomStart(nextZoom);
        this._frameZoom = this.getZoom();
        this.onZoomEnd(nextZoom, origin, startScale);
    },
    _isSeamlessZoom: function _isSeamlessZoom() {
        return !isInteger(this._zoomLevel);
    },
    _zoomAnimation: function _zoomAnimation(nextZoom, origin, startScale) {
        if (!this.options['zoomable'] || this.isZooming()) {
            return;
        }

        nextZoom = this._checkZoom(nextZoom);
        if (this.getZoom() === nextZoom) {
            return;
        }

        this.onZoomStart(nextZoom);
        if (!origin) {
            origin = new Point(this.width / 2, this.height / 2);
        }
        this._startZoomAnimation(nextZoom, origin, startScale);
    },
    _startZoomAnimation: function _startZoomAnimation(nextZoom, origin, startScale) {
        var _this = this;

        if (isNil(startScale)) {
            startScale = 1;
        }
        var endScale = this._getResolution(this._startZoomVal) / this._getResolution(nextZoom);
        var duration = this.options['zoomAnimationDuration'] * Math.abs(endScale - startScale) / Math.abs(endScale - 1);
        this._frameZoom = this._startZoomVal;
        Animation.animate({
            'zoom': [this._startZoomVal, nextZoom]
        }, {
            'easing': 'out',
            'duration': duration
        }, function (frame) {
            if (frame.state.playState === 'finished') {
                _this.onZoomEnd(frame.styles['zoom'], origin);
            } else {
                _this.onZooming(frame.styles['zoom'], origin, startScale);
            }
        }).play();
    },
    onZoomStart: function onZoomStart(nextZoom) {
        this._zooming = true;
        this._enablePanAnimation = false;
        this._startZoomVal = this.getZoom();
        /**
          * zoomstart event
          * @event Map#zoomstart
          * @type {Object}
          * @property {String} type                    - zoomstart
          * @property {Map} target                     - the map fires event
          * @property {Number} from                    - zoom level zooming from
          * @property {Number} to                      - zoom level zooming to
          */
        this._fireEvent('zoomstart', { 'from': this._startZoomVal, 'to': nextZoom });
    },
    onZooming: function onZooming(nextZoom, origin, startScale) {
        var frameZoom = this._frameZoom;
        if (frameZoom === nextZoom) {
            return;
        }
        if (isNil(startScale)) {
            startScale = 1;
        }
        var zoomOffset = this._zoomTo(nextZoom, origin, startScale);
        var res = this.getResolution(nextZoom);
        var fromRes = this.getResolution(this._startZoomVal);
        var scale = fromRes / res / startScale;
        var pos = this.offsetPlatform();
        var matrix = {
            'view': [scale, 0, 0, scale, (origin.x - pos.x) * (1 - scale), (origin.y - pos.y) * (1 - scale)]
        };
        if (Browser$1.retina) {
            origin = origin.multi(2);
        }
        matrix['container'] = [scale, 0, 0, scale, origin.x * (1 - scale), origin.y * (1 - scale)];
        /**
          * zooming event
          * @event Map#zooming
          * @type {Object}
          * @property {String} type                    - zooming
          * @property {Map} target                     - the map fires event
          * @property {Number} from                    - zoom level zooming from
          * @property {Number} to                      - zoom level zooming to
          */
        this._fireEvent('zooming', { 'from': this._startZoomVal, 'to': nextZoom, 'origin': zoomOffset, 'matrix': matrix });
        this._frameZoom = nextZoom;
        var renderer = this._getRenderer();
        if (renderer) {
            renderer.render();
        }
    },
    onZoomEnd: function onZoomEnd(nextZoom, origin) {
        var startZoomVal = this._startZoomVal;
        this._zoomTo(nextZoom, origin);
        this._zooming = false;
        this._getRenderer().onZoomEnd();

        /**
          * zoomend event
          * @event Map#zoomend
          * @type {Object}
          * @property {String} type                    - zoomend
          * @property {Map} target                     - the map fires event
          * @property {Number} from                    - zoom level zooming from
          * @property {Number} to                      - zoom level zooming to
          */
        this._fireEvent('zoomend', { 'from': startZoomVal, 'to': nextZoom });
    },
    _zoomTo: function _zoomTo(nextZoom, origin, startScale) {
        var zScale = this._getResolution(this._frameZoom) / this._getResolution(nextZoom);
        var zoomOffset = this._getZoomCenterOffset(nextZoom, origin, startScale, zScale);
        this._zoomLevel = nextZoom;
        if (zoomOffset && (zoomOffset.x !== 0 || zoomOffset.y !== 0)) {
            this._offsetCenterByPixel(zoomOffset._multi(-1));
        }
        return zoomOffset;
    },
    _checkZoom: function _checkZoom(nextZoom) {
        var maxZoom = this.getMaxZoom(),
            minZoom = this.getMinZoom();
        if (nextZoom < minZoom) {
            nextZoom = minZoom;
        }
        if (nextZoom > maxZoom) {
            nextZoom = maxZoom;
        }
        return nextZoom;
    },
    _getZoomCenterOffset: function _getZoomCenterOffset(nextZoom, origin, startScale, zScale) {
        if (!origin) {
            return null;
        }
        if (isNil(startScale)) {
            startScale = 1;
        }
        var zoomOffset = new Point((origin.x - this.width / 2) * (zScale - startScale), (origin.y - this.height / 2) * (zScale - startScale));

        var newCenter = this.containerPointToCoordinate(zoomOffset.add(this.width / 2, this.height / 2));
        if (!this._verifyExtent(newCenter)) {
            return new Point(0, 0);
        }

        return zoomOffset;
    },
    _getZoomMillisecs: function _getZoomMillisecs() {
        return 600;
    }
});

/**
 * @classdesc
 * <pre>
 * The parent class for all the map tools.
 * It is abstract and not intended to be instantiated.
 * Some interface methods to implement:
 * 1. onAdd: optional, a callback method to do some prepares before enabled when the map tool is added to a map
 * 2. onEnable: optional, called when the map tool is enabled, used to setup the context such as adding more event listeners other than the map, disabling map's default handlers (draggable, scrollWheelZoom, etc) and creating temporary layers.
 * 3. getEvents: required, provide an event map to register event listeners on the map.
 * 4. onDisable: optional, called when the map tool is disabled, used to cleanup such as unregistering event listeners, enable map's original handlers and remove temporary layers.
 * </pre>
 * @abstract
 * @category maptool
 * @extends Class
 * @mixes Eventable
 */

var MapTool = function (_Eventable) {
    inherits(MapTool, _Eventable);

    function MapTool() {
        classCallCheck(this, MapTool);
        return possibleConstructorReturn(this, _Eventable.apply(this, arguments));
    }

    /**
     * Adds the map tool to a map.
     * @param {Map} map
     * @return {MapTool} this
     * @fires MapTool#add
     */
    MapTool.prototype.addTo = function addTo(map) {
        if (!map) {
            return this;
        }
        this._map = map;
        var key = '_tool' + this.name;
        if (map[key]) {
            map[key].disable();
        }
        if (this.onAdd) {
            this.onAdd();
        }
        this.enable();
        map[key] = this;

        /**
         * add event.
         *
         * @event MapTool#add
         * @type {Object}
         * @property {String} type - add
         * @property {MapTool} target - map tool
         */
        this._fireEvent('add');
        return this;
    };

    /**
     * Gets the map it added to.
     * @return {Map} map
     */


    MapTool.prototype.getMap = function getMap() {
        return this._map;
    };

    /**
     * Enable the map tool.
     * @return {MapTool} this
     * @fires MapTool#enable
     */


    MapTool.prototype.enable = function enable() {
        var map = this._map;
        if (!map || this._enabled) {
            return this;
        }
        this._enabled = true;
        this._switchEvents('off');

        this._registerEvents();
        if (this.onEnable) {
            this.onEnable();
        }
        /**
         * enable event.
         *
         * @event MapTool#enable
         * @type {Object}
         * @property {String} type - enable
         * @property {MapTool} target - map tool
         */
        this._fireEvent('enable');
        return this;
    };

    /**
     * Disable the map tool
     * @return {MapTool} this
     * @fires MapTool#disable
     */


    MapTool.prototype.disable = function disable() {
        if (!this._enabled || !this._map) {
            return this;
        }
        this._enabled = false;
        this._switchEvents('off');
        if (this.onDisable) {
            this.onDisable();
        }
        /**
         * disable event.
         *
         * @event MapTool#disable
         * @type {Object}
         * @property {String} type - disable
         * @property {MapTool} target - map tool
         */
        this._fireEvent('disable');
        return this;
    };

    /**
     * Returns whether the tool is enabled
     * @return {Boolean} true | false
     */


    MapTool.prototype.isEnabled = function isEnabled() {
        if (!this._enabled) {
            return false;
        }
        return true;
    };

    MapTool.prototype._registerEvents = function _registerEvents() {
        this._switchEvents('on');
    };

    MapTool.prototype._switchEvents = function _switchEvents(to) {
        var events = this.getEvents();
        if (events) {
            this._map[to](events, this);
        }
    };

    MapTool.prototype._fireEvent = function _fireEvent(eventName, param) {
        if (!param) {
            param = {};
        }
        this.fire(eventName, param);
    };

    return MapTool;
}(Eventable(Class));

/**
 * @property {Object} [options=null] - construct options
 * @property {String} [options.mode=null]   - mode of the draw tool
 * @property {Object} [options.symbol=null] - symbol of the geometries drawn
 * @property {Boolean} [options.once=null]  - whether disable immediately once drawn a geometry.
 * @memberOf DrawTool
 * @instance
 */
var options$19 = {
    'symbol': {
        'lineColor': '#000',
        'lineWidth': 2,
        'lineOpacity': 1,
        'polygonFill': '#fff',
        'polygonOpacity': 0.3
    },
    'mode': null,
    'once': false
};

var registeredMode = {};

/**
 * A map tool to help draw geometries.
 * @category maptool
 * @extends MapTool
 * @example
 * var drawTool = new DrawTool({
 *     mode : 'Polygon',
 *     symbol : {
 *         'lineColor' : '#000',
 *         'lineWidth' : 5
 *     },
 *     once : true
 * }).addTo(map);
 */

var DrawTool = function (_MapTool) {
    inherits(DrawTool, _MapTool);

    /**
     * Register a new mode for DrawTool
     * @param  {String} name       mode name
     * @param  {Object} modeAction modeActions
     * @param  {Object} modeAction.action the action of DrawTool: click, drag, clickDblclick
     * @param  {Object} modeAction.create the create method of drawn geometry
     * @param  {Object} modeAction.update the update method of drawn geometry
     * @param  {Object} modeAction.generate the method to generate geometry at the end of drawing.
     * @example
     * //Register "CubicBezierCurve" mode to draw Cubic Bezier Curves.
     * DrawTool.registerMode('CubicBezierCurve', {
        'action': 'clickDblclick',
        'create': path => new CubicBezierCurve(path),
        'update': (path, geometry) => {
            geometry.setCoordinates(path);
        },
        'generate': geometry => geometry
       }
    });
     */
    DrawTool.registerMode = function registerMode(name, modeAction) {
        registeredMode[name.toLowerCase()] = modeAction;
    };

    /**
     * Get mode actions by mode name
     * @param  {String} name DrawTool mode name
     * @return {Object}      mode actions
     */


    DrawTool.getRegisterMode = function getRegisterMode(name) {
        return registeredMode[name.toLowerCase()];
    };

    /**
     * In default, DrawTool supports the following modes: <br>
     * [Point, LineString, Polygon, Circle, Ellipse, Rectangle, ArcCurve, QuadBezierCurve, CubicBezierCurve] <br>
     * You can easily add new mode to DrawTool by calling [registerMode]{@link DrawTool.registerMode}
     * @param {Object} [options=null] - construct options
     * @param {String} [options.mode=null]   - mode of the draw tool
     * @param {Object} [options.symbol=null] - symbol of the geometries drawn
     * @param {Boolean} [options.once=null]  - whether disable immediately once drawn a geometry.
     */


    function DrawTool(options) {
        classCallCheck(this, DrawTool);

        var _this = possibleConstructorReturn(this, _MapTool.call(this, options));

        _this._checkMode();
        return _this;
    }

    /**
     * Get current mode of draw tool
     * @return {String} mode
     */


    DrawTool.prototype.getMode = function getMode() {
        if (this.options['mode']) {
            return this.options['mode'].toLowerCase();
        }
        return null;
    };

    /**
     * Set mode of the draw tool
     * @param {String} mode - mode of the draw tool
     * @expose
     */


    DrawTool.prototype.setMode = function setMode(mode) {
        if (this._geometry) {
            this._geometry.remove();
            delete this._geometry;
        }
        this._clearStage();
        this._switchEvents('off');
        this.options['mode'] = mode;
        this._checkMode();
        if (this.isEnabled()) {
            this._switchEvents('on');
        }
        return this;
    };

    /**
     * Get symbol of the draw tool
     * @return {Object} symbol
     */


    DrawTool.prototype.getSymbol = function getSymbol() {
        var symbol = this.options['symbol'];
        if (symbol) {
            return extendSymbol(symbol);
        } else {
            return extendSymbol(this.options['symbol']);
        }
    };

    /**
     * Set draw tool's symbol
     * @param {Object} symbol - symbol set
     * @returns {DrawTool} this
     */


    DrawTool.prototype.setSymbol = function setSymbol(symbol) {
        if (!symbol) {
            return this;
        }
        this.options['symbol'] = symbol;
        if (this._geometry) {
            this._geometry.setSymbol(symbol);
        }
        return this;
    };

    DrawTool.prototype.onAdd = function onAdd() {
        this._checkMode();
    };

    DrawTool.prototype.onEnable = function onEnable() {
        var map = this.getMap();
        this._mapDraggable = map.options['draggable'];
        this._mapDoubleClickZoom = map.options['doubleClickZoom'];
        this._autoBorderPanning = map.options['autoBorderPanning'];
        map.config({
            'autoBorderPanning': true,
            'draggable': false,
            'doubleClickZoom': false
        });
        this._drawToolLayer = this._getDrawLayer();
        this._clearStage();
        this._loadResources();
        return this;
    };

    DrawTool.prototype._checkMode = function _checkMode() {
        this._getRegisterMode();
    };

    DrawTool.prototype.onDisable = function onDisable() {
        var map = this.getMap();
        map.config({
            'autoBorderPanning': this._autoBorderPanning,
            'draggable': this._mapDraggable,
            'doubleClickZoom': this._mapDoubleClickZoom
        });
        delete this._autoBorderPanning;
        delete this._mapDraggable;
        delete this._mapDoubleClickZoom;
        this._endDraw();
        map.removeLayer(this._getDrawLayer());
        return this;
    };

    DrawTool.prototype._loadResources = function _loadResources() {
        var symbol = this.getSymbol();
        var resources = getExternalResources(symbol);
        if (isArrayHasData(resources)) {
            //load external resources at first
            this._drawToolLayer._getRenderer().loadResources(resources);
        }
    };

    DrawTool.prototype._getProjection = function _getProjection() {
        return this._map.getProjection();
    };

    DrawTool.prototype._getRegisterMode = function _getRegisterMode() {
        var mode = this.getMode();
        var registerMode = DrawTool.getRegisterMode(mode);
        if (!registerMode) {
            throw new Error(mode + ' is not a valid mode of DrawTool.');
        }
        return registerMode;
    };

    DrawTool.prototype.getEvents = function getEvents() {
        var action = this._getRegisterMode()['action'];
        if (action === 'clickDblclick') {
            return {
                'click': this._clickForPath,
                'mousemove': this._mousemoveForPath,
                'dblclick': this._dblclickForPath
            };
        } else if (action === 'click') {
            return {
                'click': this._clickForPoint
            };
        } else if (action === 'drag') {
            return {
                'mousedown': this._mousedownToDraw
            };
        }
        return null;
    };

    DrawTool.prototype._addGeometryToStage = function _addGeometryToStage(geometry) {
        var drawLayer = this._getDrawLayer();
        drawLayer.addGeometry(geometry);
    };

    DrawTool.prototype._clickForPoint = function _clickForPoint(param) {
        var registerMode = this._getRegisterMode();
        this._geometry = registerMode['create'](param['coordinate']);
        if (this.options['symbol'] && this.options.hasOwnProperty('symbol')) {
            this._geometry.setSymbol(this.options['symbol']);
        }
        this._endDraw();
    };

    DrawTool.prototype._clickForPath = function _clickForPath(param) {
        var registerMode = this._getRegisterMode();
        var coordinate = param['coordinate'];
        var symbol = this.getSymbol();
        if (!this._geometry) {
            this._clickCoords = [coordinate];
            this._geometry = registerMode['create'](this._clickCoords);
            if (symbol) {
                this._geometry.setSymbol(symbol);
            }
            this._addGeometryToStage(this._geometry);
            /**
             * drawstart event.
             *
             * @event DrawTool#drawstart
             * @type {Object}
             * @property {String} type - drawstart
             * @property {DrawTool} target - draw tool
             * @property {Coordinate} coordinate - coordinate of the event
             * @property {Point} containerPoint  - container point of the event
             * @property {Point} viewPoint       - view point of the event
             * @property {Event} domEvent                 - dom event
             */
            this._fireEvent('drawstart', param);
        } else {
            this._clickCoords.push(coordinate);
            registerMode['update'](this._clickCoords, this._geometry);
            /**
             * drawvertex event.
             *
             * @event DrawTool#drawvertex
             * @type {Object}
             * @property {String} type - drawvertex
             * @property {DrawTool} target - draw tool
             * @property {Geometry} geometry - geometry drawn
             * @property {Coordinate} coordinate - coordinate of the event
             * @property {Point} containerPoint  - container point of the event
             * @property {Point} viewPoint       - view point of the event
             * @property {Event} domEvent                 - dom event
             */
            this._fireEvent('drawvertex', param);
        }
    };

    DrawTool.prototype._mousemoveForPath = function _mousemoveForPath(param) {
        if (!this._geometry) {
            return;
        }
        var containerPoint = this._getMouseContainerPoint(param);
        if (!this._isValidContainerPoint(containerPoint)) {
            return;
        }
        var coordinate = param['coordinate'];
        var registerMode = this._getRegisterMode();
        var path = this._clickCoords;
        if (path && path.length > 0 && coordinate.equals(path[path.length - 1])) {
            return;
        }
        registerMode['update'](path.concat([coordinate]), this._geometry);
        /**
         * mousemove event.
         *
         * @event DrawTool#mousemove
         * @type {Object}
         * @property {String} type - mousemove
         * @property {DrawTool} target - draw tool
         * @property {Geometry} geometry - geometry drawn
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this._fireEvent('mousemove', param);
    };

    DrawTool.prototype._dblclickForPath = function _dblclickForPath(param) {
        if (!this._geometry) {
            return;
        }
        var containerPoint = this._getMouseContainerPoint(param);
        if (!this._isValidContainerPoint(containerPoint)) {
            return;
        }
        var registerMode = this._getRegisterMode();
        var coordinate = param['coordinate'];
        var path = this._clickCoords;
        path.push(coordinate);
        if (path.length < 2) {
            return;
        }
        //去除重复的端点
        var nIndexes = [];
        var i, len;
        for (i = 1, len = path.length; i < len; i++) {
            if (path[i].x === path[i - 1].x && path[i].y === path[i - 1].y) {
                nIndexes.push(i);
            }
        }
        for (i = nIndexes.length - 1; i >= 0; i--) {
            path.splice(nIndexes[i], 1);
        }

        if (path.length < 2 || this._geometry && this._geometry instanceof Polygon && path.length < 3) {
            return;
        }
        registerMode['update'](path, this._geometry);
        this._endDraw(param);
    };

    DrawTool.prototype._mousedownToDraw = function _mousedownToDraw(param) {
        var registerMode = this._getRegisterMode();
        var me = this,
            firstPoint = this._getMouseContainerPoint(param);
        if (!this._isValidContainerPoint(firstPoint)) {
            return false;
        }
        var firstCoord = param['coordinate'];

        function genGeometry(coordinate) {
            var symbol = me.getSymbol(),
                geometry = me._geometry;
            if (!geometry) {
                geometry = registerMode['create'](coordinate);
                geometry.setSymbol(symbol);
                me._addGeometryToStage(geometry);
                me._geometry = geometry;
            } else {
                registerMode['update'](coordinate, geometry);
            }
        }

        function onMouseMove(_event) {
            if (!this._geometry) {
                return false;
            }
            var current = this._getMouseContainerPoint(_event);
            if (!this._isValidContainerPoint(current)) {
                return false;
            }
            var coordinate = _event['coordinate'];
            genGeometry(coordinate);
            this._fireEvent('mousemove', param);
            return false;
        }
        var onMouseUp = function onMouseUp(_event) {
            if (!this._geometry) {
                return false;
            }
            var current = this._getMouseContainerPoint(_event);
            if (this._isValidContainerPoint(current)) {
                var coordinate = _event['coordinate'];
                genGeometry(coordinate);
            }
            this._map.off('mousemove', onMouseMove, this);
            this._map.off('mouseup', onMouseUp, this);
            this._endDraw(param);
            return false;
        };

        this._fireEvent('drawstart', param);
        genGeometry(firstCoord);
        this._map.on('mousemove', onMouseMove, this);
        this._map.on('mouseup', onMouseUp, this);
        return false;
    };

    DrawTool.prototype._endDraw = function _endDraw(param) {
        if (!this._geometry || this._ending) {
            return;
        }
        this._ending = true;
        var geometry = this._geometry;
        this._clearStage();
        if (!param) {
            param = {};
        }
        this._geometry = geometry;
        /**
         * drawend event.
         *
         * @event DrawTool#drawend
         * @type {Object}
         * @property {String} type - drawend
         * @property {DrawTool} target - draw tool
         * @property {Geometry} geometry - geometry drawn
         * @property {Coordinate} coordinate - coordinate of the event
         * @property {Point} containerPoint  - container point of the event
         * @property {Point} viewPoint       - view point of the event
         * @property {Event} domEvent                 - dom event
         */
        this._fireEvent('drawend', param);
        delete this._geometry;
        if (this.options['once']) {
            this.disable();
        }
        delete this._ending;
    };

    DrawTool.prototype._clearStage = function _clearStage() {
        this._getDrawLayer().clear();
        delete this._geometry;
        delete this._clickCoords;
    };

    /**
     * Get container point of the mouse event
     * @param  {Event} event -  mouse event
     * @return {Point}
     * @private
     */


    DrawTool.prototype._getMouseContainerPoint = function _getMouseContainerPoint(event) {
        stopPropagation(event['domEvent']);
        var result = event['containerPoint'];
        return result;
    };

    DrawTool.prototype._isValidContainerPoint = function _isValidContainerPoint(containerPoint) {
        var mapSize = this._map.getSize();
        var w = mapSize['width'],
            h = mapSize['height'];
        if (containerPoint.x < 0 || containerPoint.y < 0) {
            return false;
        } else if (containerPoint.x > w || containerPoint.y > h) {
            return false;
        }
        return true;
    };

    DrawTool.prototype._getDrawLayer = function _getDrawLayer() {
        var drawLayerId = INTERNAL_LAYER_PREFIX + 'drawtool';
        var drawToolLayer = this._map.getLayer(drawLayerId);
        if (!drawToolLayer) {
            drawToolLayer = new VectorLayer(drawLayerId, {
                'enableSimplify': false
            });
            this._map.addLayer(drawToolLayer);
        }
        return drawToolLayer;
    };

    DrawTool.prototype._fireEvent = function _fireEvent(eventName, param) {
        if (!param) {
            param = {};
        }
        if (this._geometry) {
            param['geometry'] = this._getRegisterMode()['generate'](this._geometry).copy();
        }
        MapTool.prototype._fireEvent.call(this, eventName, param);
    };

    return DrawTool;
}(MapTool);

DrawTool.mergeOptions(options$19);

DrawTool.registerMode('circle', {
    'action': 'drag',
    'create': function create(coordinate) {
        return new Circle(coordinate, 0);
    },
    'update': function update(coordinate, geometry) {
        var map = geometry.getMap();
        var center = geometry.getCenter();
        var radius = map.computeLength(center, coordinate);
        geometry.setRadius(radius);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('ellipse', {
    'action': 'drag',
    'create': function create(coordinate) {
        return new Ellipse(coordinate, 0, 0);
    },
    'update': function update(coordinate, geometry) {
        var map = geometry.getMap();
        var center = geometry.getCenter();
        var rx = map.computeLength(center, new Coordinate({
            x: coordinate.x,
            y: center.y
        }));
        var ry = map.computeLength(center, new Coordinate({
            x: center.x,
            y: coordinate.y
        }));
        geometry.setWidth(rx * 2);
        geometry.setHeight(ry * 2);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('rectangle', {
    'action': 'drag',
    'create': function create(coordinate) {
        var rect = new Rectangle(coordinate, 0, 0);
        rect._firstClick = coordinate;
        return rect;
    },
    'update': function update(coordinate, geometry) {
        var firstCoord = geometry._firstClick;
        var map = geometry.getMap();
        var width = map.computeLength(firstCoord, new Coordinate(coordinate.x, firstCoord.y)),
            height = map.computeLength(firstCoord, new Coordinate(firstCoord.x, coordinate.y));
        var cnw = map.coordinateToContainerPoint(firstCoord),
            cc = map.coordinateToContainerPoint(coordinate);
        var x = Math.min(cnw.x, cc.x),
            y = Math.min(cnw.y, cc.y);
        geometry.setCoordinates(map.containerPointToCoordinate(new Point(x, y)));
        geometry.setWidth(width);
        geometry.setHeight(height);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('point', {
    'action': 'click',
    'create': function create(coordinate) {
        return new Marker(coordinate);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('polygon', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new LineString(path);
    },
    'update': function update(path, geometry) {
        var symbol = geometry.getSymbol();
        geometry.setCoordinates(path);
        if (path.length >= 3) {
            var layer = geometry.getLayer();
            if (layer) {
                var polygon = layer.getGeometryById('polygon');
                if (!polygon) {
                    polygon = new Polygon([path], {
                        'id': 'polygon'
                    });
                    if (symbol) {
                        var pSymbol = extendSymbol(symbol, {
                            'lineOpacity': 0
                        });
                        polygon.setSymbol(pSymbol);
                    }
                    polygon.addTo(layer);
                }
                polygon.setCoordinates(path);
            }
        }
    },
    'generate': function generate(geometry) {
        return new Polygon(geometry.getCoordinates(), {
            'symbol': geometry.getSymbol()
        });
    }
});

DrawTool.registerMode('linestring', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new LineString(path);
    },
    'update': function update(path, geometry) {
        geometry.setCoordinates(path);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('arccurve', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new ArcCurve(path);
    },
    'update': function update(path, geometry) {
        geometry.setCoordinates(path);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('quadbeziercurve', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new QuadBezierCurve(path);
    },
    'update': function update(path, geometry) {
        geometry.setCoordinates(path);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('cubicbeziercurve', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new CubicBezierCurve(path);
    },
    'update': function update(path, geometry) {
        geometry.setCoordinates(path);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

/**
 * @property {options} options
 * @property {String}  options.language         - language of the distance tool, zh-CN or en-US
 * @property {Boolean} options.metric           - display result in metric system
 * @property {Boolean} options.imperial         - display result in imperial system.
 * @property {Object}  options.symbol           - symbol of the line
 * @property {Object}  options.vertexSymbol     - symbol of the vertice
 * @property {Object}  options.labelOptions     - construct options of the vertice labels.
 * @memberOf DistanceTool
 * @instance
 */
var options$20 = {
    'mode': 'LineString',
    'language': 'zh-CN', //'en-US'
    'metric': true,
    'imperial': false,
    'symbol': {
        'lineColor': '#000', //'#3388ff',
        'lineWidth': 3,
        'lineOpacity': 1
    },
    'vertexSymbol': {
        'markerType': 'ellipse',
        'markerFill': '#fff', //"#d0d2d6",
        'markerLineColor': '#000',
        'markerLineWidth': 3,
        'markerWidth': 10,
        'markerHeight': 10
    },
    'labelOptions': {
        'symbol': {
            'textWrapCharacter': '\n',
            'textFaceName': 'monospace',
            'textLineSpacing': 1,
            'textHorizontalAlignment': 'right',
            'markerLineColor': '#b4b3b3',
            'textDx': 15
        },
        'boxPadding': {
            'width': 6,
            'height': 4
        }
    }
};

/**
 * A map tool to help measure distance on the map
 * @category maptool
 * @extends DrawTool
 * @example
 * var distanceTool = new DistanceTool({
 *     'once' : true,
 *     'symbol': {
 *       'lineColor' : '#34495e',
 *       'lineWidth' : 2
 *     },
 *     'vertexSymbol' : {
 *       'markerType'        : 'ellipse',
 *       'markerFill'        : '#1bbc9b',
 *       'markerLineColor'   : '#000',
 *       'markerLineWidth'   : 3,
 *       'markerWidth'       : 10,
 *      'markerHeight'      : 10
 *    },
 *    'language' : 'en-US'
 *  }).addTo(map);
 *
 */

var DistanceTool = function (_DrawTool) {
    inherits(DistanceTool, _DrawTool);

    /**
     * @param {options} [options=null] - construct options
     * @param {String} [options.language=zh-CN]         - language of the distance tool, zh-CN or en-US
     * @param {Boolean} [options.metric=true]           - display result in metric system
     * @param {Boolean} [options.imperial=false]        - display result in imperial system.
     * @param {Object}  [options.symbol=null]           - symbol of the line
     * @param {Object}  [options.vertexSymbol=null]     - symbol of the vertice
     * @param {Object}  [options.labelOptions=null]     - construct options of the vertice labels.
     */
    function DistanceTool(options) {
        classCallCheck(this, DistanceTool);

        var _this = possibleConstructorReturn(this, _DrawTool.call(this, options));

        _this.on('enable', _this._afterEnable, _this).on('disable', _this._afterDisable, _this);
        _this._measureLayers = [];
        return _this;
    }

    /**
     * Clear the measurements
     * @return {DistanceTool} this
     */


    DistanceTool.prototype.clear = function clear() {
        if (isArrayHasData(this._measureLayers)) {
            for (var i = 0; i < this._measureLayers.length; i++) {
                this._measureLayers[i].remove();
            }
        }
        delete this._lastMeasure;
        delete this._lastVertex;
        this._measureLayers = [];
        return this;
    };

    /**
     * Get the VectorLayers with the geometries drawn on the map during measuring.
     * @return {Layer[]}
     */


    DistanceTool.prototype.getMeasureLayers = function getMeasureLayers() {
        return this._measureLayers;
    };

    /**
     * Get last measuring result
     * @return {Number}
     */


    DistanceTool.prototype.getLastMeasure = function getLastMeasure() {
        if (!this._lastMeasure) {
            return 0;
        }
        return this._lastMeasure;
    };

    DistanceTool.prototype._measure = function _measure(toMeasure) {
        var map = this.getMap();
        var length;
        if (toMeasure instanceof Geometry) {
            length = map.computeGeometryLength(toMeasure);
        } else if (Array.isArray(toMeasure)) {
            length = map.getProjection().measureLength(toMeasure);
        }
        this._lastMeasure = length;
        var units;
        if (this.options['language'] === 'zh-CN') {
            units = [' 米', ' 公里', ' 英尺', ' 英里'];
        } else {
            units = [' m', ' km', ' feet', ' mile'];
        }
        var content = '';
        if (this.options['metric']) {
            content += length < 1000 ? length.toFixed(0) + units[0] : (length / 1000).toFixed(2) + units[1];
        }
        if (this.options['imperial']) {
            length *= 3.2808399;
            if (content.length > 0) {
                content += '\n';
            }
            content += length < 5280 ? length.toFixed(0) + units[2] : (length / 5280).toFixed(2) + units[3];
        }
        return content;
    };

    DistanceTool.prototype._registerMeasureEvents = function _registerMeasureEvents() {
        this.on('drawstart', this._msOnDrawStart, this).on('drawvertex', this._msOnDrawVertex, this).on('mousemove', this._msOnMouseMove, this).on('drawend', this._msOnDrawEnd, this);
    };

    DistanceTool.prototype._afterEnable = function _afterEnable() {
        this._registerMeasureEvents();
    };

    DistanceTool.prototype._afterDisable = function _afterDisable() {
        this.off('drawstart', this._msOnDrawStart, this).off('drawvertex', this._msOnDrawVertex, this).off('mousemove', this._msOnMouseMove, this).off('drawend', this._msOnDrawEnd, this);
    };

    DistanceTool.prototype._msOnDrawStart = function _msOnDrawStart(param) {
        var map = this.getMap();
        var uid = UID();
        var layerId = 'distancetool_' + uid;
        var markerLayerId = 'distancetool_markers_' + uid;
        if (!map.getLayer(layerId)) {
            this._measureLineLayer = new VectorLayer(layerId, {
                'drawImmediate': true
            }).addTo(map);
            this._measureMarkerLayer = new VectorLayer(markerLayerId, {
                'drawImmediate': true
            }).addTo(map);
        } else {
            this._measureLineLayer = map.getLayer(layerId);
            this._measureMarkerLayer = map.getLayer(markerLayerId);
        }
        this._measureLayers.push(this._measureLineLayer);
        this._measureLayers.push(this._measureMarkerLayer);
        //start marker
        new Marker(param['coordinate'], {
            'symbol': this.options['vertexSymbol']
        }).addTo(this._measureMarkerLayer);
        var content = this.options['language'] === 'zh-CN' ? '起点' : 'start';
        var startLabel = new Label(content, param['coordinate'], this.options['labelOptions']);
        this._measureMarkerLayer.addGeometry(startLabel);
    };

    DistanceTool.prototype._msOnMouseMove = function _msOnMouseMove(param) {
        var ms = this._measure(param['geometry'].getCoordinates().concat([param['coordinate']]));
        if (!this._tailMarker) {
            var symbol = extendSymbol(this.options['vertexSymbol']);
            symbol['markerWidth'] /= 2;
            symbol['markerHeight'] /= 2;
            this._tailMarker = new Marker(param['coordinate'], {
                'symbol': symbol
            }).addTo(this._measureMarkerLayer);
            this._tailLabel = new Label(ms, param['coordinate'], this.options['labelOptions']).addTo(this._measureMarkerLayer);
        }
        this._tailMarker.setCoordinates(param['coordinate']);
        this._tailLabel.setContent(ms);
        this._tailLabel.setCoordinates(param['coordinate']);
    };

    DistanceTool.prototype._msOnDrawVertex = function _msOnDrawVertex(param) {
        var geometry = param['geometry'];
        //vertex marker
        new Marker(param['coordinate'], {
            'symbol': this.options['vertexSymbol']
        }).addTo(this._measureMarkerLayer);
        var length = this._measure(geometry);
        var vertexLabel = new Label(length, param['coordinate'], this.options['labelOptions']);
        this._measureMarkerLayer.addGeometry(vertexLabel);
        this._lastVertex = vertexLabel;
    };

    DistanceTool.prototype._msOnDrawEnd = function _msOnDrawEnd(param) {
        this._clearTailMarker();
        var size = this._lastVertex.getSize();
        if (!size) {
            size = new Size(10, 10);
        }
        this._addClearMarker(this._lastVertex.getCoordinates(), size['width']);
        var geo = param['geometry'].copy();
        geo.addTo(this._measureLineLayer);
        this._lastMeasure = geo.getLength();
    };

    DistanceTool.prototype._addClearMarker = function _addClearMarker(coordinates, dx) {
        var endMarker = new Marker(coordinates, {
            'symbol': [{
                'markerType': 'square',
                'markerFill': '#ffffff',
                'markerLineColor': '#b4b3b3',
                'markerLineWidth': 2,
                'markerWidth': 15,
                'markerHeight': 15,
                'markerDx': 20 + dx
            }, {
                'markerType': 'x',
                'markerWidth': 10,
                'markerHeight': 10,
                'markerDx': 20 + dx
            }]
        });
        var measureLineLayer = this._measureLineLayer,
            measureMarkerLayer = this._measureMarkerLayer;
        endMarker.on('click', function () {
            measureLineLayer.remove();
            measureMarkerLayer.remove();
            //return false to stop propagation of event.
            return false;
        }, this);
        endMarker.addTo(this._measureMarkerLayer);
    };

    DistanceTool.prototype._clearTailMarker = function _clearTailMarker() {
        if (this._tailMarker) {
            this._tailMarker.remove();
            delete this._tailMarker;
        }
        if (this._tailLabel) {
            this._tailLabel.remove();
            delete this._tailLabel;
        }
    };

    return DistanceTool;
}(DrawTool);

DistanceTool.mergeOptions(options$20);

/**
 * @property {options} options
 * @property {String}  options.language         - language of the distance tool, zh-CN or en-US
 * @property {Boolean} options.metric           - display result in metric system
 * @property {Boolean} options.imperial         - display result in imperial system.
 * @property {Object}  options.symbol           - symbol of the line
 * @property {Object}  options.vertexSymbol     - symbol of the vertice
 * @property {Object}  options.labelOptions     - construct options of the vertice labels.
 * @memberOf AreaTool
 * @instance
 */
var options$21 = {
    'mode': 'Polygon',
    'symbol': {
        'lineColor': '#000000',
        'lineWidth': 2,
        'lineOpacity': 1,
        'lineDasharray': '',
        'polygonFill': '#ffffff',
        'polygonOpacity': 0.5
    }
};

/**
 * A map tool to help measure area on the map
 * @category maptool
 * @extends DistanceTool
 * @example
 * var areaTool = new AreaTool({
 *     'once' : true,
 *     'symbol': {
 *       'lineColor' : '#34495e',
 *       'lineWidth' : 2
 *     },
 *     'vertexSymbol' : {
 *       'markerType'        : 'ellipse',
 *       'markerFill'        : '#1bbc9b',
 *       'markerLineColor'   : '#000',
 *       'markerLineWidth'   : 3,
 *       'markerWidth'       : 10,
 *      'markerHeight'      : 10
 *    },
 *    'language' : 'en-US'
 *  }).addTo(map);
 */

var AreaTool = function (_DistanceTool) {
    inherits(AreaTool, _DistanceTool);

    /**
     * @param {options} [options=null] - construct options
     * @param {String} [options.language=zh-CN]         - language of the distance tool, zh-CN or en-US
     * @param {Boolean} [options.metric=true]           - display result in metric system
     * @param {Boolean} [options.imperial=false]        - display result in imperial system.
     * @param {Object}  [options.symbol=null]           - symbol of the line
     * @param {Object}  [options.vertexSymbol=null]     - symbol of the vertice
     * @param {Object}  [options.labelOptions=null]     - construct options of the vertice labels.
     */
    function AreaTool(options) {
        classCallCheck(this, AreaTool);

        var _this = possibleConstructorReturn(this, _DistanceTool.call(this, options));

        _this.on('enable', _this._afterEnable, _this).on('disable', _this._afterDisable, _this);
        _this._measureLayers = [];
        return _this;
    }

    AreaTool.prototype._measure = function _measure(toMeasure) {
        var map = this.getMap();
        var area;
        if (toMeasure instanceof Geometry) {
            area = map.computeGeometryArea(toMeasure);
        } else if (Array.isArray(toMeasure)) {
            area = map.getProjection().measureArea(toMeasure);
        }
        this._lastMeasure = area;
        var units;
        if (this.options['language'] === 'zh-CN') {
            units = [' 平方米', ' 平方公里', ' 平方英尺', ' 平方英里'];
        } else {
            units = [' sq.m', ' sq.km', ' sq.ft', ' sq.mi'];
        }
        var content = '';
        if (this.options['metric']) {
            content += area < 1E6 ? area.toFixed(0) + units[0] : (area / 1E6).toFixed(2) + units[1];
        }
        if (this.options['imperial']) {
            area *= 3.2808399;
            if (content.length > 0) {
                content += '\n';
            }
            var sqmi = 5280 * 5280;
            content += area < sqmi ? area.toFixed(0) + units[2] : (area / sqmi).toFixed(2) + units[3];
        }
        return content;
    };

    AreaTool.prototype._msOnDrawVertex = function _msOnDrawVertex(param) {
        var vertexMarker = new Marker(param['coordinate'], {
            'symbol': this.options['vertexSymbol']
        }).addTo(this._measureMarkerLayer);

        this._lastVertex = vertexMarker;
    };

    AreaTool.prototype._msOnDrawEnd = function _msOnDrawEnd(param) {
        this._clearTailMarker();

        var ms = this._measure(param['geometry']);
        var endLabel = new Label(ms, param['coordinate'], this.options['labelOptions']).addTo(this._measureMarkerLayer);
        var size = endLabel.getSize();
        if (!size) {
            size = new Size(10, 10);
        }
        this._addClearMarker(param['coordinate'], size['width']);
        var geo = param['geometry'].copy();
        geo.addTo(this._measureLineLayer);
        this._lastMeasure = geo.getArea();
    };

    return AreaTool;
}(DistanceTool);

AreaTool.mergeOptions(options$21);

/**
 * Base class for all the map controls, you can extend it to build your own customized Control.
 * It is abstract and not intended to be instantiated.
 * @category control
 * @memberOf control
 * @abstract
 * @extends Class
 * @mixes Eventable
 */

var Control = function (_Eventable) {
    inherits(Control, _Eventable);

    /**
     * @param  {Object} [options=null] configuration options
     */
    function Control(options) {
        classCallCheck(this, Control);

        if (options && options['position'] && !isString(options['position'])) {
            options['position'] = extend({}, options['position']);
        }
        return possibleConstructorReturn(this, _Eventable.call(this, options));
    }

    /**
     * Adds the control to a map.
     * @param {Map} map
     * @returns {control.Control} this
     * @fires control.Control#add
     */


    Control.prototype.addTo = function addTo(map) {
        this.remove();
        if (!map.options['control']) {
            return this;
        }
        this._map = map;
        var controlContainer = map._panels.control;
        this.__ctrlContainer = createEl('div');
        setStyle(this.__ctrlContainer, 'position:absolute');
        addStyle(this.__ctrlContainer, 'z-index', controlContainer.style.zIndex);
        // on(this.__ctrlContainer, 'mousedown mousemove click dblclick contextmenu', stopPropagation)
        this.update();
        controlContainer.appendChild(this.__ctrlContainer);
        /**
         * add event.
         *
         * @event control.Control#add
         * @type {Object}
         * @property {String} type - add
         * @property {control.Control} target - the control instance
         */
        this.fire('add', {
            'dom': controlContainer
        });
        return this;
    };

    /**
     * update control container
     * @return {control.Control} this
     */


    Control.prototype.update = function update() {
        this.__ctrlContainer.innerHTML = '';
        this._controlDom = this.buildOn(this.getMap());
        if (this._controlDom) {
            this._updatePosition();
            this.__ctrlContainer.appendChild(this._controlDom);
        }
        return this;
    };

    /**
     * Get the map that the control is added to.
     * @return {Map}
     */


    Control.prototype.getMap = function getMap() {
        return this._map;
    };

    /**
     * Get the position of the control
     * @return {Object}
     */


    Control.prototype.getPosition = function getPosition() {
        return extend({}, this._parse(this.options['position']));
    };

    /**
     * update the control's position
     * @param {String|Object} position - can be one of 'top-left', 'top-right', 'bottom-left', 'bottom-right' or a position object like {'top': 40,'left': 60}
     * @return {control.Control} this
     * @fires control.Control#positionchange
     */


    Control.prototype.setPosition = function setPosition(position) {
        if (isString(position)) {
            this.options['position'] = position;
        } else {
            this.options['position'] = extend({}, position);
        }
        this._updatePosition();
        return this;
    };

    /**
     * Get the container point of the control.
     * @return {Point}
     */


    Control.prototype.getContainerPoint = function getContainerPoint() {
        var position = this.getPosition();

        var size = this.getMap().getSize();
        var x, y;
        if (!isNil(position['top'])) {
            x = position['top'];
        } else if (!isNil(position['bottom'])) {
            x = size['height'] - position['bottom'];
        }
        if (!isNil(position['left'])) {
            y = position['left'];
        } else if (!isNil(position['right'])) {
            y = size['width'] - position['right'];
        }
        return new Point(x, y);
    };

    /**
     * Get the control's container.
     * Container is a div element wrapping the control's dom and decides the control's position and display.
     * @return {HTMLElement}
     */


    Control.prototype.getContainer = function getContainer() {
        return this.__ctrlContainer;
    };

    /**
     * Get html dom element of the control
     * @return {HTMLElement}
     */


    Control.prototype.getDOM = function getDOM() {
        return this._controlDom;
    };

    /**
     * Show
     * @return {control.Control} this
     */


    Control.prototype.show = function show() {
        this.__ctrlContainer.style.display = '';
        return this;
    };

    /**
     * Hide
     * @return {control.Control} this
     */


    Control.prototype.hide = function hide() {
        this.__ctrlContainer.style.display = 'none';
        return this;
    };

    /**
     * Whether the control is visible
     * @return {Boolean}
     */


    Control.prototype.isVisible = function isVisible() {
        return this.__ctrlContainer && this.__ctrlContainer.style.display === '';
    };

    /**
     * Remove itself from the map
     * @return {control.Control} this
     * @fires control.Control#remove
     */


    Control.prototype.remove = function remove() {
        if (!this._map) {
            return this;
        }
        removeDomNode(this.__ctrlContainer);
        if (this.onRemove) {
            this.onRemove();
        }
        delete this._map;
        delete this.__ctrlContainer;
        delete this._controlDom;
        /**
         * remove event.
         *
         * @event control.Control#remove
         * @type {Object}
         * @property {String} type - remove
         * @property {control.Control} target - the control instance
         */
        this.fire('remove');
        return this;
    };

    Control.prototype._parse = function _parse(position) {
        var p = position;
        if (isString(position)) {
            p = Control['positions'][p];
        }
        return p;
    };

    Control.prototype._updatePosition = function _updatePosition() {
        var position = this.getPosition();
        if (!position) {
            //default one
            position = {
                'top': 20,
                'left': 20
            };
        }
        for (var p in position) {
            if (position.hasOwnProperty(p)) {
                position[p] = parseInt(position[p]);
                this.__ctrlContainer.style[p] = position[p] + 'px';
            }
        }
        /**
         * Control's position update event.
         *
         * @event control.Control#positionchange
         * @type {Object}
         * @property {String} type - positionchange
         * @property {control.Control} target - the control instance
         * @property {Object} position - Position of the control, eg:{"top" : 100, "left" : 50}
         */
        this.fire('positionchange', {
            'position': extend({}, position)
        });
    };

    return Control;
}(Eventable(Class));

Control.positions = {
    'top-left': {
        'top': 20,
        'left': 20
    },
    'top-right': {
        'top': 40,
        'right': 60
    },
    'bottom-left': {
        'bottom': 20,
        'left': 60
    },
    'bottom-right': {
        'bottom': 20,
        'right': 60
    }
};

Map.mergeOptions({
    'control': true
});

Map.include( /** @lends Map.prototype */{
    /**
     * Add a control on the map.
     * @param {control.Control} control - contorl to add
     * @return {Map} this
     */
    addControl: function addControl(control) {
        // if map container is a canvas, can't add control on it.
        if (this._containerDOM.getContext) {
            return this;
        }
        control.addTo(this);
        return this;
    },

    /**
     * Remove a control from the map.
     * @param {control.Control} control - control to remove
     * @return {Map} this
     */
    removeControl: function removeControl(control) {
        if (!control || control.getMap() !== this) {
            return this;
        }
        control.remove();
        return this;
    }

});

/**
 * @property {Object} options - options
 * @property {Object} [options.position='bottom-left'] - position of the control
 * @property {String} [options.content='Powered By <a href="http://www.org" target="_blank">maptalks</a>']  - content of the attribution control, HTML format
 * @memberOf control.Attribution
 * @instance
 */
var options$22 = {
    'position': 'bottom-left',
    'content': 'Powered By <a href="http://www.maptalks.org" target="_blank">maptalks</a>'
};

/**
 * @classdesc
 * A control to allows to display attribution content in a small text box on the map.
 * @category control
 * @extends control.Control
 * @memberOf control
 * @example
 * var attribution = new maptalks.control.Attribution({
 *     position : 'bottom-left',
 *     content : 'hello maptalks'
 * }).addTo(map);
 */

var Attribution = function (_Control) {
    inherits(Attribution, _Control);

    function Attribution() {
        classCallCheck(this, Attribution);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    Attribution.prototype.buildOn = function buildOn() {
        this._attributionContainer = createEl('div', 'maptalks-attribution');
        this._update();
        return this._attributionContainer;
    };

    /**
     * Set content of the attribution
     * @param {String} content - attribution content
     * @return {Attribution} this
     */


    Attribution.prototype.setContent = function setContent(content) {
        this.options['content'] = content;
        this._update();
        return this;
    };

    Attribution.prototype._update = function _update() {
        if (!this.getMap()) {
            return;
        }
        this._attributionContainer.innerHTML = this.options['content'];
    };

    return Attribution;
}(Control);

Attribution.mergeOptions(options$22);

Map.mergeOptions({
    'attributionControl': false
});

Map.addOnLoadHook(function () {
    if (this.options['attributionControl']) {
        this.attributionControl = new Attribution(this.options['attributionControl']);
        this.addControl(this.attributionControl);
    }
});

/**
* @property {Object} options - options
* @property {Object} [options.position='bottom-right'] - position of the control
* @property {Number} [options.level=4]  - the zoom level of the overview
* @property {Object} [options.size={"width":300, "height":200}  - size of the Control
* @property {Object} [options.style={"color":"#1bbc9b"}] - style of the control, color is the overview rectangle's color
* @memberOf control.Overview
* @instance
*/
var options$23 = {
    'loadDelay': 1600,
    'level': 4,
    'position': 'bottom-right',
    'size': {
        'width': 300,
        'height': 200
    },
    'style': {
        'color': '#1bbc9b'
    }
};

/**
 * @classdesc
 * An overview control for the map.
 * @category control
 * @extends control.Control
 * @memberOf control
 * @example
 * var overview = new Overview({
 *     position : {'bottom': '0', 'right': '0'},
 *     size : {'width' : 300,'height' : 200}
 * }).addTo(map);
 */

var Overview = function (_Control) {
    inherits(Overview, _Control);

    function Overview() {
        classCallCheck(this, Overview);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    /**
     * method to build DOM of the control
     * @param  {Map} map map to build on
     * @return {HTMLDOMElement}
     */
    Overview.prototype.buildOn = function buildOn(map) {
        var container = createEl('div');
        container.style.cssText = 'border:1px solid #000;width:' + this.options['size']['width'] + 'px;height:' + this.options['size']['height'] + 'px;';
        if (map.isLoaded()) {
            this._initOverview();
        } else {
            map.on('load', this._initOverview, this);
        }
        return container;
    };

    Overview.prototype._initOverview = function _initOverview() {
        var me = this;
        setTimeout(function () {
            me._createOverview();
        }, this.options['loadDelay']);
    };

    Overview.prototype._createOverview = function _createOverview(container) {
        var map = this.getMap(),
            dom = container || this.getDOM(),
            extent = map.getExtent();
        var options = map.config();
        extend(options, {
            'center': map.getCenter(),
            'zoom': this._getOverviewZoom(),
            'scrollWheelZoom': false,
            'checkSize': false,
            'doubleClickZoom': false,
            'touchZoom': false,
            'control': false
        });
        this._overview = new Map(dom, options);
        this._updateBaseLayer();
        this._perspective = new Polygon(extent.toArray(), {
            'draggable': true,
            'cursor': 'move',
            'symbol': {
                'lineWidth': 3,
                'lineColor': this.options['style']['color'],
                'polygonFill': this.options['style']['color'],
                'polygonOpacity': 0.4
            }
        }).on('dragstart', this._onDragStart, this).on('dragend', this._onDragEnd, this);
        map.on('resize moveend zoomend', this._update, this).on('setbaselayer', this._updateBaseLayer, this);
        new VectorLayer('v').addGeometry(this._perspective).addTo(this._overview);
        this.fire('load');
    };

    Overview.prototype.onRemove = function onRemove() {
        this.getMap().off('load', this._initOverview, this).off('resize moveend zoomend', this._update, this).off('setbaselayer', this._updateBaseLayer, this);
    };

    Overview.prototype._getOverviewZoom = function _getOverviewZoom() {
        var map = this.getMap(),
            zoom = map.getZoom(),
            minZoom = map.getMinZoom(),
            level = this.options['level'];
        var i;
        if (level > 0) {
            for (i = level; i > 0; i--) {
                if (zoom - i >= minZoom) {
                    return zoom - i;
                }
            }
        } else {
            for (i = level; i < 0; i++) {
                if (zoom - i >= minZoom) {
                    return zoom - i;
                }
            }
        }

        return zoom;
    };

    Overview.prototype._onDragStart = function _onDragStart() {
        this._origDraggable = this.getMap().options['draggable'];
        this.getMap().config('draggable', false);
    };

    Overview.prototype._onDragEnd = function _onDragEnd() {
        var center = this._perspective.getCenter();
        this._overview.setCenter(center);
        this.getMap().panTo(center);
        this.getMap().config('draggable', this._origDraggable);
    };

    Overview.prototype._update = function _update() {
        this._perspective.setCoordinates(this.getMap().getExtent().toArray());
        this._overview.setCenterAndZoom(this.getMap().getCenter(), this._getOverviewZoom());
    };

    Overview.prototype._updateBaseLayer = function _updateBaseLayer() {
        var map = this.getMap();
        if (map.getBaseLayer()) {
            this._overview.setBaseLayer(Layer.fromJSON(map.getBaseLayer().toJSON()));
        } else {
            this._overview.setBaseLayer(null);
        }
    };

    return Overview;
}(Control);

Overview.mergeOptions(options$23);

Map.mergeOptions({
    'overviewControl': false
});

Map.addOnLoadHook(function () {
    if (this.options['overviewControl']) {
        this.overviewControl = new Overview(this.options['overviewControl']);
        this.addControl(this.overviewControl);
    }
});

/**
 * @property {Object} options - options
 * @property {Object} [options.position='top-right']       - position of the control
 * @property {Boolean} [options.draggable=true]            - whether the panel can be dragged
 * @property {Boolean} [options.custom=false]              - whether the panel's content is customized .
 * @property {String|HTMLElement} options.content          - panel's content, can be a dom element or a string.
 * @property {Boolean} [options.closeButton=true]          - whether to display the close button on the panel.
 * @memberOf control.Panel
 * @instance
 */
var options$24 = {
    'position': 'top-right',
    'draggable': true,
    'custom': false,
    'content': '',
    'closeButton': true
};

/**
 * @classdesc
 * Class for panel controls.
 * @category control
 * @extends control.Control
 * @memberOf control
 * @example
 * var panel = new Panel({
 *     position : {'bottom': '0', 'right': '0'},
 *     draggable : true,
 *     custom : false,
 *     content : '<div class="map-panel">hello </div>',
 *     closeButton : true
 * }).addTo(map);
 */

var Panel = function (_Control) {
    inherits(Panel, _Control);

    function Panel() {
        classCallCheck(this, Panel);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    /**
     * method to build DOM of the control
     * @param  {Map} map map to build on
     * @return {HTMLDOMElement}
     */
    Panel.prototype.buildOn = function buildOn() {
        var dom;
        if (this.options['custom']) {
            if (isString(this.options['content'])) {
                dom = createEl('div');
                dom.innerHTML = this.options['content'];
            } else {
                dom = this.options['content'];
            }
        } else {
            dom = createEl('div', 'maptalks-panel');
            if (this.options['closeButton']) {
                var closeButton = createEl('a', 'maptalks-close');
                closeButton.href = 'javascript:;';
                closeButton.onclick = function () {
                    dom.style.display = 'none';
                };
                dom.appendChild(closeButton);
            }

            var panelContent = createEl('div', 'maptalks-panel-content');
            panelContent.innerHTML = this.options['content'];
            dom.appendChild(panelContent);
        }

        this.draggable = new DragHandler(dom, {
            'cancelOn': this._cancelOn.bind(this)
        });

        this.draggable.on('dragstart', this._onDragStart, this).on('dragging', this._onDragging, this).on('dragend', this._onDragEnd, this);

        if (this.options['draggable']) {
            this.draggable.enable();
        }

        return dom;
    };

    /**
     * update control container
     * @return {control.Panel} this
     */


    Panel.prototype.update = function update() {
        if (this.draggable) {
            this.draggable.disable();
            delete this.draggable;
        }
        return Control.prototype.update.call(this);
    };

    /**
     * Set the content of the Panel.
     * @param {String|HTMLElement} content - content of the infowindow.
     * return {control.Panel} this
     * @fires Panel#contentchange
     */


    Panel.prototype.setContent = function setContent(content) {
        var old = this.options['content'];
        this.options['content'] = content;
        /**
         * contentchange event.
         *
         * @event Panel#contentchange
         * @type {Object}
         * @property {String} type - contentchange
         * @property {control.Panel} target - Panel
         * @property {String|HTMLElement} old      - old content
         * @property {String|HTMLElement} new      - new content
         */
        this.fire('contentchange', {
            'old': old,
            'new': content
        });
        if (this.isVisible()) {
            this.update();
        }
        return this;
    };

    /**
     * Get content of  the infowindow.
     * @return {String|HTMLElement} - content of the infowindow
     */


    Panel.prototype.getContent = function getContent() {
        return this.options['content'];
    };

    Panel.prototype._cancelOn = function _cancelOn(domEvent) {
        var target = domEvent.srcElement || domEvent.target,
            tagName = target.tagName.toLowerCase();
        if (tagName === 'button' || tagName === 'input' || tagName === 'select' || tagName === 'option' || tagName === 'textarea') {
            return true;
        }
        return false;
    };

    Panel.prototype._onDragStart = function _onDragStart(param) {
        this._startPos = param['mousePos'];
        this._startPosition = extend({}, this.getPosition());
    };

    Panel.prototype._onDragging = function _onDragging(param) {
        var pos = param['mousePos'];
        var offset = pos.substract(this._startPos);

        var startPosition = this._startPosition;
        var position = this.getPosition();
        if (!isNil(position['top'])) {
            position['top'] = +startPosition['top'] + offset.y;
        }
        if (!isNil(position['bottom'])) {
            position['bottom'] = +startPosition['bottom'] - offset.y;
        }
        if (!isNil(position['left'])) {
            position['left'] = +startPosition['left'] + offset.x;
        }
        if (!isNil(position['right'])) {
            position['right'] = +startPosition['right'] - offset.x;
        }
        this.setPosition(position);
    };

    Panel.prototype._onDragEnd = function _onDragEnd() {
        delete this._startPos;
        delete this._startPosition;
    };

    /**
     * Get the connect points of panel for connector lines.
     * @private
     */


    Panel.prototype._getConnectPoints = function _getConnectPoints() {
        var map = this._map;
        var containerPoint = this.getContainerPoint();
        var dom = this.getDOM(),
            width = dom.clientWidth,
            height = dom.clientHeight;

        var anchors = [
        //top center
        map.containerPointToCoordinate(containerPoint.add(new Point(Math.round(width / 2), 0))),
        //middle right
        map.containerPointToCoordinate(containerPoint.add(new Point(width, Math.round(height / 2)))),
        //bottom center
        map.containerPointToCoordinate(containerPoint.add(new Point(Math.round(width / 2), height))),
        //middle left
        map.containerPointToCoordinate(containerPoint.add(new Point(0, Math.round(height / 2))))];
        return anchors;
    };

    return Panel;
}(Control);

Panel.mergeOptions(options$24);

/**
* @property {Object} [options=null] - options
* @property {String|Object}   [options.position="bottom-left"]  - position of the scale control.
* @property {Number} [options.maxWidth=100]               - max width of the scale control.
* @property {Boolean} [options.metric=true]               - Whether to show the metric scale line (m/km).
* @property {Boolean} [options.imperial=false]            - Whether to show the imperial scale line (mi/ft).
* @instance
* @memberOf control.Scale
*/
var options$25 = {
    'position': 'bottom-left',
    'maxWidth': 100,
    'metric': true,
    'imperial': false
};

/**
 * @classdesc
 * Based on the implementation in Leaflet, a simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems.
 * @category control
 * @extends control.Control
 * @memberOf control
 * @example
 * var scale = new Scale({
 *     position : 'bottom-left',
 *     maxWidth : 160,
 *     metric : true,
 *     imperial : true
 * }).addTo(map);
 */

var Scale = function (_Control) {
    inherits(Scale, _Control);

    function Scale() {
        classCallCheck(this, Scale);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    /**
     * method to build DOM of the control
     * @param  {Map} map map to build on
     * @return {HTMLDOMElement}
     */
    Scale.prototype.buildOn = function buildOn(map) {
        this._map = map;
        this._scaleContainer = createEl('div');
        this._addScales();
        map.on('zoomend', this._update, this);
        if (this._map._loaded) {
            this._update();
        }
        return this._scaleContainer;
    };

    Scale.prototype.onRemove = function onRemove() {
        this.getMap().off('zoomend', this._update, this);
    };

    Scale.prototype._addScales = function _addScales() {
        var css = 'border: 2px solid #000000;border-top: none;line-height: 1.1;padding: 2px 5px 1px;' + 'color: #000000;font-size: 11px;text-align:center;white-space: nowrap;overflow: hidden' + ';-moz-box-sizing: content-box;box-sizing: content-box;background: #fff; background: rgba(255, 255, 255, 0);';
        if (this.options['metric']) {
            this._mScale = createElOn('div', css, this._scaleContainer);
        }
        if (this.options['imperial']) {
            this._iScale = createElOn('div', css, this._scaleContainer);
        }
    };

    Scale.prototype._update = function _update() {
        var map = this._map;
        var maxMeters = map.pixelToDistance(this.options['maxWidth'], 0);
        this._updateScales(maxMeters);
    };

    Scale.prototype._updateScales = function _updateScales(maxMeters) {
        if (this.options['metric'] && maxMeters) {
            this._updateMetric(maxMeters);
        }
        if (this.options['imperial'] && maxMeters) {
            this._updateImperial(maxMeters);
        }
    };

    Scale.prototype._updateMetric = function _updateMetric(maxMeters) {
        var meters = this._getRoundNum(maxMeters),
            label = meters < 1000 ? meters + ' m' : meters / 1000 + ' km';

        this._updateScale(this._mScale, label, meters / maxMeters);
    };

    Scale.prototype._updateImperial = function _updateImperial(maxMeters) {
        var maxFeet = maxMeters * 3.2808399,
            maxMiles,
            miles,
            feet;

        if (maxFeet > 5280) {
            maxMiles = maxFeet / 5280;
            miles = this._getRoundNum(maxMiles);
            this._updateScale(this._iScale, miles + ' mile', miles / maxMiles);
        } else {
            feet = this._getRoundNum(maxFeet);
            this._updateScale(this._iScale, feet + ' feet', feet / maxFeet);
        }
    };

    Scale.prototype._updateScale = function _updateScale(scale, text, ratio) {
        scale['style']['width'] = Math.round(this.options['maxWidth'] * ratio) + 'px';
        scale['innerHTML'] = text;
    };

    Scale.prototype._getRoundNum = function _getRoundNum(num) {
        var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
            d = num / pow10;

        d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

        return pow10 * d;
    };

    return Scale;
}(Control);

Scale.mergeOptions(options$25);

Map.mergeOptions({
    'scaleControl': false
});

Map.addOnLoadHook(function () {
    if (this.options['scaleControl']) {
        this.scaleControl = new Scale(this.options['scaleControl']);
        this.addControl(this.scaleControl);
    }
});

/**
 * @property {Object}   options - options
 * @property {String|Object}   [options.position="top-right"]          - position of the toolbar control.
 * @property {Boolean}  [options.vertical=true]                        - Whether the toolbar is a vertical one.
 * @property {Object[]} options.items                                  - items on the toolbar
 * @memberOf control.Toolbar
 * @instance
 */
var options$26 = {
    'height': 28,
    'vertical': false,
    'position': 'top-right',
    'items': {
        //default buttons
    }
};

/**
 * @classdesc
 * A toolbar control of the map.
 * @category control
 * @extends control.Control
 * @memberOf control
 * @example
 * var toolbar = new Toolbar({
 *     position : 'top-right',
 *     items: [
 *          {
 *            item: 'item1',
 *            click: function () {
 *              alert('item1 clicked');
 *            }
 *          },
 *          {
 *            item: 'item2',
 *            click: function () {
 *              alert('item2 clicked');
 *            }
 *          }
 *      ]
 * }).addTo(map);
 */

var Toolbar = function (_Control) {
    inherits(Toolbar, _Control);

    function Toolbar() {
        classCallCheck(this, Toolbar);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    /**
     * method to build DOM of the control
     * @param  {Map} map map to build on
     * @return {HTMLDOMElement}
     */
    Toolbar.prototype.buildOn = function buildOn(map) {
        this._map = map;
        var dom = createEl('div');
        var ul = createEl('ul', 'maptalks-toolbar-hx');
        dom.appendChild(ul);

        if (this.options['vertical']) {
            addClass(dom, 'maptalks-toolbar-vertical');
        } else {
            addClass(dom, 'maptalks-toolbar-horizonal');
        }
        var me = this;

        function onButtonClick(fn, index, childIndex, targetDom) {
            var item = me._getItems()[index];
            return function (e) {
                stopPropagation(e);
                return fn({
                    'target': item,
                    'index': index,
                    'childIndex': childIndex,
                    'dom': targetDom
                });
            };
        }

        var items = this.options['items'];
        if (isArrayHasData(items)) {
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                var li = createEl('li');
                if (this.options['height'] !== 28) {
                    li.style.lineHeight = this.options['height'] + 'px';
                }
                li.style.height = this.options['height'] + 'px';
                li.style.cursor = 'pointer';
                if (isHTML(item['item'])) {
                    li.style.textAlign = 'center';
                    var itemSize = measureDom('div', item['item']);
                    //vertical-middle
                    li.innerHTML = '<div style="margin-top:' + (this.options['height'] - itemSize['height']) / 2 + 'px;">' + item['item'] + '</div>';
                } else {
                    li.innerHTML = item['item'];
                }
                if (item['click']) {
                    on(li, 'click', onButtonClick(item['click'], i, null, li));
                }
                if (isArrayHasData(item['children'])) {
                    var dropMenu = this._createDropMenu(i);
                    li.appendChild(dropMenu);
                    li._menu = dropMenu;
                    on(li, 'mouseover', function () {
                        this._menu.style.display = '';
                    });
                    on(li, 'mouseout', function () {
                        this._menu.style.display = 'none';
                    });
                }
                ul.appendChild(li);
            }
        }
        return dom;
    };

    Toolbar.prototype._createDropMenu = function _createDropMenu(index) {
        var me = this;

        function onButtonClick(fn, index, childIndex) {
            var item = me._getItems()[index]['children'][childIndex];
            return function (e) {
                stopPropagation(e);
                return fn({
                    'target': item,
                    'index': index,
                    'childIndex': childIndex
                });
            };
        }
        var menuDom = createEl('div', 'maptalks-dropMenu');
        menuDom.style.display = 'none';
        menuDom.appendChild(createEl('em', 'maptalks-ico'));
        var menuUL = createEl('ul');
        menuDom.appendChild(menuUL);
        var children = this._getItems()[index]['children'];
        var liWidth = 0,
            i,
            len;
        for (i = 0, len = children.length; i < len; i++) {
            var size = stringLength(children[i]['item'], '12px');
            if (size.width > liWidth) {
                liWidth = size.width;
            }
        }
        for (i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            var li = createEl('li');
            li.innerHTML = '<a href="javascript:;">' + child['item'] + '</a>';
            li.style.cursor = 'pointer';
            li.style.width = liWidth + 24 + 'px'; // 20 for text-intent
            on(li.childNodes[0], 'click', onButtonClick(child['click'], index, i));
            menuUL.appendChild(li);
        }
        return menuDom;
    };

    Toolbar.prototype._getItems = function _getItems() {
        return this.options['items'];
    };

    return Toolbar;
}(Control);

Toolbar.mergeOptions(options$26);

/**
 * @property {Object}   options - options
 * @property {String|Object}   [options.position="top-left"]  - position of the zoom control.
 * @property {Boolean}  [options.slider=true]                         - Whether to display the slider
 * @property {Boolean}  [options.zoomLevel=true]                      - Whether to display the text box of zoom level
 * @memberOf control.Zoom
 * @instance
 */
var options$27 = {
    'position': 'top-left',
    'slider': true,
    'zoomLevel': true
};

/**
 * @classdesc
 * A zoom control with buttons to zoomin/zoomout and a slider indicator for the zoom level.
 * @category control
 * @extends control.Control
 * @memberOf control
 * @example
 * var zoomControl = new Zoom({
 *     position : 'top-left',
 *     slider : true,
 *     zoomLevel : false
 * }).addTo(map);
 */

var Zoom = function (_Control) {
    inherits(Zoom, _Control);

    function Zoom() {
        classCallCheck(this, Zoom);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    /**
     * method to build DOM of the control
     * @param  {Map} map map to build on
     * @return {HTMLDOMElement}
     */
    Zoom.prototype.buildOn = function buildOn(map) {
        this._map = map;
        var options = this.options;

        var dom = createEl('div', 'maptalks-zoom');

        if (options['zoomLevel']) {
            var levelDOM = createEl('span', 'maptalks-zoom-zoomlevel');
            dom.appendChild(levelDOM);
            this._levelDOM = levelDOM;
        }

        var zoomDOM = createEl('div', 'maptalks-zoom-slider');

        var zoomInButton = createEl('a', 'maptalks-zoom-zoomin');
        zoomInButton.href = 'javascript:;';
        zoomInButton.innerHTML = '+';
        zoomDOM.appendChild(zoomInButton);
        this._zoomInButton = zoomInButton;

        if (options['slider']) {
            var sliderDOM = createEl('div', 'maptalks-zoom-slider-box');
            var ruler = createEl('div', 'maptalks-zoom-slider-ruler');
            var reading = createEl('span', 'maptalks-zoom-slider-reading');
            var dot = createEl('span', 'maptalks-zoom-slider-dot');
            ruler.appendChild(reading);
            ruler.appendChild(dot);
            sliderDOM.appendChild(ruler);
            zoomDOM.appendChild(sliderDOM);
            this._sliderBox = sliderDOM;
            this._sliderRuler = ruler;
            this._sliderReading = reading;
            this._sliderDot = dot;
        }

        var zoomOutButton = createEl('a', 'maptalks-zoom-zoomout');
        zoomOutButton.href = 'javascript:;';
        zoomOutButton.innerHTML = '-';
        zoomDOM.appendChild(zoomOutButton);
        this._zoomOutButton = zoomOutButton;

        dom.appendChild(zoomDOM);

        map.on('_zoomend _zoomstart _viewchange', this._update, this);

        this._update();
        this._registerDomEvents();

        return dom;
    };

    Zoom.prototype._update = function _update() {
        var map = this.getMap();
        if (this._sliderBox) {
            var pxUnit = 10;
            var totalRange = (map.getMaxZoom() - map.getMinZoom()) * pxUnit;
            this._sliderBox.style.height = totalRange + 6 + 'px';
            this._sliderRuler.style.height = totalRange + 'px';
            var zoomRange = (map.getZoom() - map.getMinZoom()) * pxUnit;
            this._sliderReading.style.height = zoomRange + 'px';
            this._sliderDot.style.bottom = zoomRange + 'px';
        }
        if (this._levelDOM) {
            this._levelDOM.innerHTML = map.getZoom();
        }
    };

    Zoom.prototype._registerDomEvents = function _registerDomEvents() {
        var map = this.getMap();
        if (this._zoomInButton) {
            on(this._zoomInButton, 'click', map.zoomIn, map);
        }
        if (this._zoomOutButton) {
            on(this._zoomOutButton, 'click', map.zoomOut, map);
        }
        //TODO slider dot拖放缩放逻辑还没有实现
    };

    Zoom.prototype.onRemove = function onRemove() {
        var map = this.getMap();
        if (this._zoomInButton) {
            off(this._zoomInButton, 'click', map.zoomIn, map);
        }
        if (this._zoomOutButton) {
            off(this._zoomOutButton, 'click', map.zoomOut, map);
        }
    };

    return Zoom;
}(Control);

Zoom.mergeOptions(options$27);

Map.mergeOptions({
    'zoomControl': false
});

Map.addOnLoadHook(function () {
    if (this.options['zoomControl']) {
        this.zoomControl = new Zoom(this.options['zoomControl']);
        this.addControl(this.zoomControl);
    }
});

/** @namespace control */

// import './Control.Nav';


var index$5 = Object.freeze({
	Control: Control,
	Attribution: Attribution,
	Overview: Overview,
	Panel: Panel,
	Scale: Scale,
	Toolbar: Toolbar,
	Zoom: Zoom
});

var options$28 = {
    'renderer': 'canvas',
    'baseLayerRenderer': 'canvas'
};

/**
 * @classdesc
 * @ignore
 * @category layer
 * @extends TileLayer
 * @param {String|Number} id - tile layer's id
 * @param {Object} [options=null] - options defined in [CanvasTileLayer]{@link TileLayer#options}
 * @example
 * var layer = new CanvasTileLayer("tile");
 * layer.drawTile = ()
 */

var CanvasTileLayer = function (_TileLayer) {
    inherits(CanvasTileLayer, _TileLayer);

    function CanvasTileLayer() {
        classCallCheck(this, CanvasTileLayer);
        return possibleConstructorReturn(this, _TileLayer.apply(this, arguments));
    }

    /**
     * The interface method to draw on canvsa tile
     * @param  {HTMLCanvasElement} canvas  canvas to draw on
     * @param  {Object} options current options
     * @param  {Object} options current options
     */
    CanvasTileLayer.prototype.drawTile = function drawTile() /*canvas, options*/{};

    /**
     * Export the CanvasTileLayer's json. <br>
     * It can be used to reproduce the instance by [fromJSON]{@link Layer#fromJSON} method
     * @return {Object} layer's JSON
     */


    CanvasTileLayer.prototype.toJSON = function toJSON() {
        return {
            'type': 'CanvasTileLayer',
            'id': this.getId(),
            'options': this.config()
        };
    };

    /**
     * Reproduce a CanvasTileLayer from layer's JSON.
     * @param  {Object} layerJSON - layer's JSON
     * @return {CanvasTileLayer}
     * @static
     * @private
     * @function
     */


    CanvasTileLayer.fromJSON = function fromJSON(layerJSON) {
        if (!layerJSON || layerJSON['type'] !== 'CanvasTileLayer') {
            return null;
        }
        return new CanvasTileLayer(layerJSON['id'], layerJSON['options']);
    };

    return CanvasTileLayer;
}(TileLayer);

CanvasTileLayer.registerJSONType('CanvasTileLayer');

CanvasTileLayer.mergeOptions(options$28);

/**
 * @classdesc
 * A sub class of VectorLayer supports GeoJSON.
 * @category layer
 * @extends VectorLayer
 */

var GeoJSONLayer = function (_VectorLayer) {
    inherits(GeoJSONLayer, _VectorLayer);

    /**
     * Reproduce a GeoJSONLayer from layer's profile JSON.
     * @param  {Object} layerJSON - layer's profile JSON
     * @return {GeoJSONLayer}
     * @private
     */
    GeoJSONLayer.fromJSON = function fromJSON(profile) {
        if (!profile || profile['type'] !== 'GeoJSONLayer') {
            return null;
        }
        var layer = new GeoJSONLayer(profile['id'], profile['geojson'], profile['options']);
        if (profile['style']) {
            layer.setStyle(profile['style']);
        }
        return layer;
    };

    /**
     * @param {String|Number} id        - layer's id
     * @param {Object}        json      - GeoJSON objects
     * @param {Object} [options=null]   - construct options defined in [GeoJSONLayer]{@link GeoJSONLayer#options}
     */


    function GeoJSONLayer(id, json, options) {
        classCallCheck(this, GeoJSONLayer);

        if (json && !Array.isArray(json)) {
            if (!json['type']) {
                //is options
                options = json;
                json = null;
            }
        }

        var _this = possibleConstructorReturn(this, _VectorLayer.call(this, id, options));

        if (json) {
            var geometries = _this._parse(json);
            _this.addGeometry(geometries);
        }
        return _this;
    }

    /**
     * Add geojson data to the layer
     * @param {Object|Object[]} json - GeoJSON data
     * @return {GeoJSONLayer} this
     */


    GeoJSONLayer.prototype.addData = function addData(json) {
        var geometries = this._parse(json);
        this.addGeometry(geometries);
        return this;
    };

    GeoJSONLayer.prototype._parse = function _parse(json) {
        json = parseJSON(json);
        return Geometry.fromJSON(json);
    };

    /**
     * Export the GeoJSONLayer's profile json. <br>
     * @param  {Object} [options=null] - export options
     * @param  {Object} [options.geometries=null] - If not null and the layer is a [OverlayerLayer]{@link OverlayLayer},
     *                                            the layer's geometries will be exported with the given "options.geometries" as a parameter of geometry's toJSON.
     * @param  {Extent} [options.clipExtent=null] - if set, only the geometries intersectes with the extent will be exported.
     * @return {Object} layer's profile JSON
     */


    GeoJSONLayer.prototype.toJSON = function toJSON(options) {
        var profile = VectorLayer.prototype.toJSON.call(this, options);
        profile['type'] = 'GeoJSONLayer';
        var json = [];
        if (profile['geometries']) {
            var g;
            for (var i = 0, len = profile['geometries'].length; i < len; i++) {
                g = profile['geometries'][i]['feature'];
                if (!g['id'] && !g['properties']) {
                    g = g['geometry'];
                }
                json.push(g);
            }
            delete profile['geometries'];
        }
        profile['geojson'] = json;
        return profile;
    };

    return GeoJSONLayer;
}(VectorLayer);

GeoJSONLayer.registerJSONType('GeoJSONLayer');

var CanvasLayerRenderer = function (_CanvasRenderer) {
    inherits(CanvasLayerRenderer, _CanvasRenderer);

    function CanvasLayerRenderer() {
        classCallCheck(this, CanvasLayerRenderer);
        return possibleConstructorReturn(this, _CanvasRenderer.apply(this, arguments));
    }

    CanvasLayerRenderer.prototype.onCanvasCreate = function onCanvasCreate() {
        if (this.canvas && this.layer.options['doubleBuffer']) {
            this.buffer = Canvas.createCanvas(this.canvas.width, this.canvas.height, this.getMap().CanvasClass);
        }
    };

    CanvasLayerRenderer.prototype.draw = function draw() {
        this.prepareCanvas();
        if (!this._predrawed) {
            this._drawContext = this.layer.prepareToDraw(this.context);
            if (!this._drawContext) {
                this._drawContext = [];
            }
            if (!Array.isArray(this._drawContext)) {
                this._drawContext = [this._drawContext];
            }
            this._predrawed = true;
        }
        this._drawLayer();
    };

    CanvasLayerRenderer.prototype.getCanvasImage = function getCanvasImage() {
        var canvasImg = _CanvasRenderer.prototype.getCanvasImage.call(this);
        if (canvasImg && canvasImg.image && this.layer.options['doubleBuffer']) {
            var canvas = canvasImg.image;
            if (this.buffer.width !== canvas.width || this.buffer.height !== canvas.height) {
                this.buffer.width = canvas.width;
                this.buffer.height = canvas.height;
            }
            var bufferContext = this.buffer.getContext('2d');
            var prevent = this.layer.doubleBuffer(bufferContext, this.context);
            if (prevent === undefined || prevent) {
                bufferContext.drawImage(canvas, 0, 0);
                canvasImg.image = this.buffer;
            }
        }
        return canvasImg;
    };

    CanvasLayerRenderer.prototype.startAnim = function startAnim() {
        this._paused = false;
        this.play();
    };

    CanvasLayerRenderer.prototype.pauseAnim = function pauseAnim() {
        this.pause();
        this._paused = true;
    };

    CanvasLayerRenderer.prototype.isPlaying = function isPlaying() {
        return !isNil(this._animFrame);
    };

    CanvasLayerRenderer.prototype.hide = function hide() {
        this.pause();
        return _CanvasRenderer.prototype.hide.call(this);
    };

    CanvasLayerRenderer.prototype.show = function show() {
        return _CanvasRenderer.prototype.show.call(this);
    };

    CanvasLayerRenderer.prototype.remove = function remove() {
        this.pause();
        delete this._drawContext;
        return _CanvasRenderer.prototype.remove.call(this);
    };

    CanvasLayerRenderer.prototype.onZoomStart = function onZoomStart(param) {
        this.pause();
        this.layer.onZoomStart(param);
        _CanvasRenderer.prototype.onZoomStart.call(this, param);
    };

    CanvasLayerRenderer.prototype.onZoomEnd = function onZoomEnd(param) {
        this.layer.onZoomEnd(param);
        _CanvasRenderer.prototype.onZoomEnd.call(this, param);
    };

    CanvasLayerRenderer.prototype.onMoveStart = function onMoveStart(param) {
        this.pause();
        this.layer.onMoveStart(param);
        _CanvasRenderer.prototype.onMoveStart.call(this, param);
    };

    CanvasLayerRenderer.prototype.onMoveEnd = function onMoveEnd(param) {
        this.layer.onMoveEnd(param);
        _CanvasRenderer.prototype.onMoveEnd.call(this, param);
    };

    CanvasLayerRenderer.prototype.onResize = function onResize(param) {
        this.layer.onResize(param);
        _CanvasRenderer.prototype.onResize.call(this, param);
    };

    CanvasLayerRenderer.prototype._drawLayer = function _drawLayer() {
        var args = [this.context];
        args.push.apply(args, this._drawContext);
        this.layer.draw.apply(this.layer, args);
        this.completeRender();
        this.play();
    };

    CanvasLayerRenderer.prototype.pause = function pause() {
        if (this._animFrame) {
            cancelAnimFrame(this._animFrame);
            delete this._animFrame;
        }
        if (this._fpsFrame) {
            clearTimeout(this._fpsFrame);
            delete this._fpsFrame;
        }
    };

    CanvasLayerRenderer.prototype.play = function play() {
        var _this2 = this;

        if (this._paused || !this.layer || !this.layer.options['animation']) {
            return;
        }
        if (!this._bindDrawLayer) {
            this._bindDrawLayer = this._drawLayer.bind(this);
        }
        this.pause();
        var fps = this.layer.options['fps'];
        if (fps >= 1000 / 16) {
            this._animFrame = requestAnimFrame(this._bindDrawLayer);
        } else {
            this._fpsFrame = setTimeout(function () {
                if (Browser$1.ie9) {
                    // ie9 doesn't support RAF
                    _this2._bindDrawLayer();
                    _this2._animFrame = 1;
                } else {
                    _this2._animFrame = requestAnimFrame(_this2._bindDrawLayer);
                }
            }, 1000 / fps);
        }
    };

    return CanvasLayerRenderer;
}(CanvasRenderer);

/**
 * @property {Object} options                  - configuration options
 * @property {Boolean} [options.doubleBuffer=false]    - layer is rendered with doubleBuffer
 * @property {Boolean} [options.animation=false]       - if the layer is an animated layer
 * @property {Boolean} [fps=1000 / 16]                 - animation fps
 * @memberOf CanvasLayer
 * @instance
 */
var options$29 = {
    'doubleBuffer': false,
    'animation': false,
    'fps': 1000 / 16
};

/**
 * A layer with a HTML5 2D canvas context.<br>
 * CanvasLayer provides some interface methods for canvas context operations. <br>
 * You can use it directly, but can't serialize/deserialize a CanvasLayer with JSON in this way. <br>
 * It is more recommended to extend it with a subclass and implement canvas paintings inside the subclass.
 * @example
 *  var layer = new CanvasLayer('canvas');
 *
 *  layer.prepareToDraw = function (context) {
 *      var size = map.getSize();
 *      return [size.width, size.height]
 *  };
 *
 *  layer.draw = function (context, width, height) {
 *      context.fillStyle = "#f00";
 *      context.fillRect(0, 0, w, h);
 *  };
 *  layer.addTo(map);
 * @category layer
 * @extends Layer
 * @param {String|Number} id - layer's id
 * @param {Object} options - options defined in [options]{@link CanvasLayer#options}
 */

var CanvasLayer = function (_Layer) {
    inherits(CanvasLayer, _Layer);

    function CanvasLayer() {
        classCallCheck(this, CanvasLayer);
        return possibleConstructorReturn(this, _Layer.apply(this, arguments));
    }

    /**
     * An optional interface function called only once before the first draw, useful for preparing your canvas operations.
     * @param  {CanvasRenderingContext2D } context - CanvasRenderingContext2D of the layer canvas.
     * @return {Object[]} objects that will be passed to function draw(context, ..) as parameters.
     */
    CanvasLayer.prototype.prepareToDraw = function prepareToDraw() {};

    /**
     * The required interface function to draw things on the layer canvas.
     * @param  {CanvasRenderingContext2D} context - CanvasRenderingContext2D of the layer canvas.
     * @param  {*} params.. - parameters returned by function prepareToDraw(context).
     */


    CanvasLayer.prototype.draw = function draw() {};

    /**
     * Redraw the layer
     * @return {CanvasLayer} this
     */


    CanvasLayer.prototype.redraw = function redraw() {
        if (this._getRenderer()) {
            this._getRenderer().draw();
        }
        return this;
    };

    /**
     * Start animation
     * @return {CanvasLayer} this
     */


    CanvasLayer.prototype.play = function play() {
        if (this._getRenderer()) {
            this._getRenderer().startAnim();
        }
        return this;
    };

    /**
     * Pause the animation
     * @return {CanvasLayer} this
     */


    CanvasLayer.prototype.pause = function pause() {
        if (this._getRenderer()) {
            this._getRenderer().pauseAnim();
        }
        return this;
    };

    /**
     * If the animation is playing
     * @return {Boolean}
     */


    CanvasLayer.prototype.isPlaying = function isPlaying() {
        if (this._getRenderer()) {
            return this._getRenderer().isPlaying();
        }
        return false;
    };

    /**
     * Clear layer's canvas
     * @return {CanvasLayer} this
     */


    CanvasLayer.prototype.clearCanvas = function clearCanvas() {
        if (this._getRenderer()) {
            this._getRenderer().clearCanvas();
        }
        return this;
    };

    /**
     * Ask the map to redraw the layer canvas without firing any event.
     * @return {CanvasLayer} this
     */


    CanvasLayer.prototype.requestMapToRender = function requestMapToRender() {
        if (this._getRenderer()) {
            this._getRenderer().requestMapToRender();
        }
        return this;
    };

    /**
     * Ask the map to redraw the layer canvas and fire layerload event
     * @return {CanvasLayer} this
     */


    CanvasLayer.prototype.completeRender = function completeRender() {
        if (this._getRenderer()) {
            this._getRenderer().completeRender();
        }
        return this;
    };

    /**
     * Callback function when layer's canvas is created. <br>
     * Override it to do anything needed.
     */


    CanvasLayer.prototype.onCanvasCreate = function onCanvasCreate() {
        return this;
    };

    /**
     * The event callback for map's zoomstart event.
     * @param  {Object} param - event parameter
     */


    CanvasLayer.prototype.onZoomStart = function onZoomStart() {};

    /**
     * The event callback for map's zoomend event.
     * @param  {Object} param - event parameter
     */


    CanvasLayer.prototype.onZoomEnd = function onZoomEnd() {};

    /**
     * The event callback for map's movestart event.
     * @param  {Object} param - event parameter
     */


    CanvasLayer.prototype.onMoveStart = function onMoveStart() {};

    /**
     * The event callback for map's moveend event.
     * @param  {Object} param - event parameter
     */


    CanvasLayer.prototype.onMoveEnd = function onMoveEnd() {};

    /**
     * The event callback for map's resize event.
     * @param  {Object} param - event parameter
     */


    CanvasLayer.prototype.onResize = function onResize() {};

    /**
     * The callback function to double buffer. <br>
     * In default, it just draws and return, and you can override it if you need to process the canvas image before drawn.
     * @param  {CanvasRenderingContext2D} bufferContext CanvasRenderingContext2D of double buffer of the layer canvas.
     * @param  {CanvasRenderingContext2D} context CanvasRenderingContext2D of the layer canvas.
     */


    CanvasLayer.prototype.doubleBuffer = function doubleBuffer(bufferContext /*, context*/) {
        bufferContext.clearRect(0, 0, bufferContext.canvas.width, bufferContext.canvas.height);
        return this;
    };

    return CanvasLayer;
}(Layer);

CanvasLayer.mergeOptions(options$29);

CanvasLayer.registerRenderer('canvas', CanvasLayerRenderer);

/**
 * @property {Object} options                  - configuration options
 * @property {Boolean} [options.animation=true]       - if the layer is an animated layer
 * @memberOf ParticleLayer
 * @instance
 */
var options$30 = {
    'animation': true
};

/**
 * @classdesc
 * A layer to draw particles. <br>
 * ParticleLayer provides some interface methods to render particles. <br>
 * You can use it directly, but can't serialize/dserialize a ParticleLayer with JSON in this way. <br>
 * It is more recommended to extend it with a subclass.
 * @example
 * import { ParticleLayer } from 'maptalks';
 * var layer = new ParticleLayer('particle');
 *
 * layer.getParticles = function (t) {
 *     return particles[t];
 * };
 * layer.addTo(map);
 * @category layer
 * @extends CanvasLayer
 * @param {String} id - layer's id
 * @param {Object} [options=null] - options defined in [options]{@link ParticleLayer#options}
 */

var ParticleLayer = function (_CanvasLayer) {
    inherits(ParticleLayer, _CanvasLayer);

    function ParticleLayer() {
        classCallCheck(this, ParticleLayer);
        return possibleConstructorReturn(this, _CanvasLayer.apply(this, arguments));
    }

    /**
     * Interface method to get particles's position at time t.
     * @param  {Number} t - current time in milliseconds
     */
    ParticleLayer.prototype.getParticles = function getParticles() {};

    ParticleLayer.prototype.draw = function draw(context) {
        var map = this.getMap(),
            extent = map.getContainerExtent();
        var points = this.getParticles(now());
        if (!points) {
            return;
        }
        var pos;
        for (var i = 0, l = points.length; i < l; i++) {
            pos = points[i].point;
            if (extent.contains(pos)) {
                if (context.fillStyle !== points[i].color) {
                    context.fillStyle = points[i].color || this.options['lineColor'] || '#fff';
                }
                context.fillRect(pos.x - points[i].r / 2, pos.y - points[i].r / 2, points[i].r, points[i].r);
            }
        }
        this._fillCanvas(context);
    };

    ParticleLayer.prototype._fillCanvas = function _fillCanvas(context) {
        var g = context.globalCompositeOperation;
        context.globalCompositeOperation = 'destination-out';
        var trail = this.options['trail'] || 30;
        context.fillStyle = 'rgba(0, 0, 0, ' + 1 / trail + ')';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalCompositeOperation = g;
    };

    return ParticleLayer;
}(CanvasLayer);

ParticleLayer.mergeOptions(options$30);

/**
 * @classdesc
 * A renderer based on HTML Doms for TileLayers.
 * It is implemented based on Leaflet's GridLayer, and all the credits belongs to Leaflet.
 * @class
 * @protected
 * @memberOf tilelayer
 * @name Dom
 * @extends {Class}
 * @param {TileLayer} layer - layer of the renderer
 */

var TileLayerDomRenderer = function (_Class) {
    inherits(TileLayerDomRenderer, _Class);

    function TileLayerDomRenderer(layer) {
        classCallCheck(this, TileLayerDomRenderer);

        var _this = possibleConstructorReturn(this, _Class.call(this));

        _this.layer = layer;
        _this._tiles = {};
        _this._fadeAnimated = !Browser$1.mobile && true;
        return _this;
    }

    TileLayerDomRenderer.prototype.getMap = function getMap() {
        if (!this.layer) {
            return null;
        }
        return this.layer.getMap();
    };

    TileLayerDomRenderer.prototype.show = function show() {
        if (this._container) {
            this.render();
            this._container.style.display = '';
        }
    };

    TileLayerDomRenderer.prototype.hide = function hide() {
        if (this._container) {
            this._container.style.display = 'none';
            this.clear();
        }
    };

    TileLayerDomRenderer.prototype.remove = function remove() {
        delete this._tiles;
        delete this.layer;
        this._removeLayerContainer();
    };

    TileLayerDomRenderer.prototype.clear = function clear() {
        this._removeAllTiles();
        this._clearLayerContainer();
    };

    TileLayerDomRenderer.prototype.setZIndex = function setZIndex(z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;
        }
    };

    TileLayerDomRenderer.prototype.isCanvasRender = function isCanvasRender() {
        return false;
    };

    TileLayerDomRenderer.prototype.render = function render() {
        var layer = this.layer;
        if (!this._container) {
            this._createLayerContainer();
        }
        var tileGrid = layer._getTiles();
        if (!tileGrid) {
            return;
        }
        this._currentTileZoom = this.getMap().getZoom();
        var tiles = tileGrid['tiles'],
            queue = [];

        if (this._tiles) {
            for (var p in this._tiles) {
                this._tiles[p].current = false;
            }
        }

        var tile;
        for (var i = tiles.length - 1; i >= 0; i--) {
            tile = tiles[i];
            if (this._tiles[tile['id']]) {
                //tile is already added
                this._tiles[tile['id']].current = true;
                continue;
            }
            tile.current = true;
            queue.push(tile);
        }
        var container = this._getTileContainer();
        removeTransform(container);
        if (queue.length > 0) {
            var fragment = document.createDocumentFragment();
            for (var _i = 0, l = queue.length; _i < l; _i++) {
                fragment.appendChild(this._loadTile(queue[_i]));
            }
            container.appendChild(fragment);
        }
    };

    TileLayerDomRenderer.prototype.onZooming = function onZooming(param) {
        var zoom = Math.floor(param['from']);

        if (this._levelContainers && this._levelContainers[zoom]) {
            setTransformMatrix(this._levelContainers[zoom], param.matrix['view']);
        }
    };

    TileLayerDomRenderer.prototype._loadTile = function _loadTile(tile) {
        this._tiles[tile['id']] = tile;
        return this._createTile(tile, this._tileReady.bind(this));
    };

    TileLayerDomRenderer.prototype._createTile = function _createTile(tile, done) {
        var tileSize = this.layer.getTileSize();
        var tileImage = createEl('img');

        tile['el'] = tileImage;

        on(tileImage, 'load', this._tileOnLoad.bind(this, done, tile));
        on(tileImage, 'error', this._tileOnError.bind(this, done, tile));

        if (this.layer.options['crossOrigin']) {
            tile.crossOrigin = this.layer.options['crossOrigin'];
        }

        tileImage.style.position = 'absolute';
        var viewPoint = this.getMap()._pointToViewPoint(tile['point']);
        tileImage.style.left = Math.floor(viewPoint.x) + 'px';
        tileImage.style.top = Math.floor(viewPoint.y) + 'px';

        tileImage.alt = '';
        tileImage.width = tileSize['width'];
        tileImage.height = tileSize['height'];

        setOpacity(tileImage, 0);

        if (this.layer.options['cssFilter']) {
            tileImage.style[CSSFILTER] = this.layer.options['cssFilter'];
        }

        tileImage.src = tile['url'];

        return tileImage;
    };

    TileLayerDomRenderer.prototype._tileReady = function _tileReady(err, tile) {
        if (!this.layer) {
            return;
        }
        if (err) {
            /**
             * tileerror event, fired when layer is 'dom' rendered and a tile errors
             *
             * @event TileLayer#tileerror
             * @type {Object}
             * @property {String} type - tileerror
             * @property {TileLayer} target - tile layer
             * @property {String} err  - error message
             * @property {Object} tile - tile
             */
            this.layer.fire('tileerror', {
                error: err,
                tile: tile
            });
        }

        tile.loaded = Date.now();

        var map = this.getMap();

        if (this._fadeAnimated) {
            tile['el'].style[TRANSITION] = 'opacity 250ms';
        }

        setOpacity(tile['el'], 1);
        tile.active = true;

        /**
         * tileload event, fired when layer is 'dom' rendered and a tile is loaded
         *
         * @event TileLayer#tileload
         * @type {Object}
         * @property {String} type - tileload
         * @property {TileLayer} target - tile layer
         * @property {Object} tile - tile
         */
        this.layer.fire('tileload', {
            tile: tile
        });

        if (this._noTilesToLoad()) {
            this.layer.fire('layerload');

            if (Browser$1.ielt9) {
                requestAnimFrame(this._pruneTiles, this);
            } else {
                if (this._pruneTimeout) {
                    clearTimeout(this._pruneTimeout);
                }
                var timeout = map ? map.options['zoomAnimationDuration'] : 250,
                    pruneLevels = map && this.layer === map.getBaseLayer() ? !map.options['zoomBackground'] : true;
                // Wait a bit more than 0.2 secs (the duration of the tile fade-in)
                // to trigger a pruning.
                this._pruneTimeout = setTimeout(this._pruneTiles.bind(this, pruneLevels), timeout + 100);
            }
        }
    };

    TileLayerDomRenderer.prototype._tileOnLoad = function _tileOnLoad(done, tile) {
        // For https://github.com/Leaflet/Leaflet/issues/3332
        if (Browser$1.ielt9) {
            setTimeout(done.bind(this, null, tile), 0);
        } else {
            done.call(this, null, tile);
        }
    };

    TileLayerDomRenderer.prototype._tileOnError = function _tileOnError(done, tile) {
        if (!this.layer) {
            return;
        }
        var errorUrl = this.layer.options['errorTileUrl'];
        if (errorUrl) {
            tile['el'].src = errorUrl;
        } else {
            tile['el'].style.display = 'none';
        }
        done.call(this, 'error', tile);
    };

    TileLayerDomRenderer.prototype._noTilesToLoad = function _noTilesToLoad() {
        for (var key in this._tiles) {
            if (!this._tiles[key].loaded) {
                return false;
            }
        }
        return true;
    };

    TileLayerDomRenderer.prototype._pruneTiles = function _pruneTiles(pruneLevels) {
        var map = this.getMap();
        if (!map || map.isMoving()) {
            return;
        }

        var key,
            zoom = this._currentTileZoom;

        if (!this.layer.isVisible()) {
            this._removeAllTiles();
            return;
        }

        for (key in this._tiles) {
            if (this._tiles[key]['z'] === zoom && !this._tiles[key].current) {
                this._removeTile(key);
            }
        }

        if (pruneLevels) {
            for (key in this._tiles) {
                if (this._tiles[key]['z'] !== zoom) {
                    this._removeTile(key);
                }
            }
            for (var z in this._levelContainers) {
                if (+z !== zoom) {
                    removeDomNode(this._levelContainers[z]);
                    this._removeTilesAtZoom(z);
                    delete this._levelContainers[z];
                }
            }
        }
    };

    TileLayerDomRenderer.prototype._removeTile = function _removeTile(key) {
        var tile = this._tiles[key];
        if (!tile) {
            return;
        }

        removeDomNode(tile.el);

        delete this._tiles[key];

        /**
         * tileunload event, fired when layer is 'dom' rendered and a tile is removed
         *
         * @event TileLayer#tileunload
         * @type {Object}
         * @property {String} type - tileunload
         * @property {TileLayer} target - tile layer
         * @property {Object} tile - tile
         */
        this.layer.fire('tileunload', {
            tile: tile
        });
    };

    TileLayerDomRenderer.prototype._removeTilesAtZoom = function _removeTilesAtZoom(zoom) {
        for (var key in this._tiles) {
            if (+this._tiles[key]['z'] !== +zoom) {
                continue;
            }
            this._removeTile(key);
        }
    };

    TileLayerDomRenderer.prototype._removeAllTiles = function _removeAllTiles() {
        for (var key in this._tiles) {
            this._removeTile(key);
        }
    };

    TileLayerDomRenderer.prototype._getTileContainer = function _getTileContainer() {
        if (!this._levelContainers) {
            this._levelContainers = {};
        }
        var zoom = this.getMap().getZoom();
        if (!this._levelContainers[zoom]) {
            var container = this._levelContainers[zoom] = createEl('div', 'maptalks-tilelayer-level');
            container.style.cssText = 'position:absolute;left:0px;top:0px;';
            container.style.willChange = 'transform';
            this._container.appendChild(container);
        }
        return this._levelContainers[zoom];
    };

    TileLayerDomRenderer.prototype._createLayerContainer = function _createLayerContainer() {
        var container = this._container = createEl('div', 'maptalks-tilelayer');
        container.style.cssText = 'position:absolute;left:0px;top:0px;';
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        var parentContainer = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontLayer'] : this.getMap()._panels['backLayer'];
        parentContainer.appendChild(container);
    };

    TileLayerDomRenderer.prototype._clearLayerContainer = function _clearLayerContainer() {
        if (this._container) {
            this._container.innerHTML = '';
        }
        delete this._levelContainers;
    };

    TileLayerDomRenderer.prototype._removeLayerContainer = function _removeLayerContainer() {
        if (this._container) {
            removeDomNode(this._container);
        }
        delete this._container;
        delete this._levelContainers;
    };

    TileLayerDomRenderer.prototype.getEvents = function getEvents() {
        var events = {
            '_zoomstart': this.onZoomStart,
            '_touchzoomstart': this._onTouchZoomStart,
            '_zooming': this.onZooming,
            '_zoomend': this.onZoomEnd,
            '_moveend _resize': this.render,
            '_movestart': this.onMoveStart
        };
        if (!this._onMapMoving && this.layer.options['renderWhenPanning']) {
            var interval = this.layer.options['updateInterval'];
            if (isNumber(interval) && interval >= 0) {
                if (interval > 0) {
                    this._onMapMoving = throttle(function () {
                        this.render();
                    }, interval, this);
                } else {
                    this._onMapMoving = function () {
                        this.render();
                    };
                }
            }
        }
        if (this._onMapMoving) {
            events['_moving'] = this._onMapMoving;
        }
        return events;
    };

    TileLayerDomRenderer.prototype._canTransform = function _canTransform() {
        return Browser$1.any3d || Browser$1.ie9;
    };

    TileLayerDomRenderer.prototype.onMoveStart = function onMoveStart() {
        // this._fadeAnimated = false;
    };

    TileLayerDomRenderer.prototype._onTouchZoomStart = function _onTouchZoomStart() {
        this._pruneTiles(true);
    };

    TileLayerDomRenderer.prototype.onZoomStart = function onZoomStart() {
        this._fadeAnimated = !Browser$1.mobile && true;
        this._pruneTiles(true);
        this._zoomStartPos = this.getMap().offsetPlatform();
        if (!this._canTransform() && this._container) {
            this._container.style.display = 'none';
        }
    };

    TileLayerDomRenderer.prototype.onZoomEnd = function onZoomEnd(param) {
        if (this._pruneTimeout) {
            clearTimeout(this._pruneTimeout);
        }
        this.render();
        if (this._levelContainers) {
            if (this._canTransform()) {
                if (this._levelContainers[param.from] && this._zoomStartPos) {
                    this._levelContainers[param.from].style.left = this._zoomStartPos.x + 'px';
                    this._levelContainers[param.from].style.top = this._zoomStartPos.y + 'px';
                }
            } else {
                if (this._levelContainers[param.from]) {
                    this._levelContainers[param.from].style.display = 'none';
                }
                this._container.style.display = '';
            }
        }
    };

    return TileLayerDomRenderer;
}(Class);

TileLayer.registerRenderer('dom', TileLayerDomRenderer);

var TileCache = function () {
    function TileCache(capacity) {
        classCallCheck(this, TileCache);

        this._queue = [];
        this._cache = {};
        if (!capacity) {
            capacity = 128;
        }
        this.capacity = capacity;
    }

    TileCache.prototype.add = function add(key, tile) {
        this._cache[key] = tile;
        this._queue.push(key);
        this._expireCache();
    };

    TileCache.prototype.get = function get$$1(key) {
        return this._cache[key];
    };

    TileCache.prototype.remove = function remove(key) {
        delete this._cache[key];
    };

    TileCache.prototype._expireCache = function _expireCache() {
        var _this = this;

        if (this._expTimeout) {
            clearTimeout(this._expTimeout);
        }
        this._expTimeout = setTimeout(function () {
            var len = _this._queue.length;
            if (len > _this.capacity) {
                var expir = _this._queue.splice(0, len - _this.capacity);
                for (var i = expir.length - 1; i >= 0; i--) {
                    delete _this._cache[expir[i]];
                }
            }
        }, 1000);
    };

    return TileCache;
}();

/**
 * @classdesc
 * Renderer class based on HTML5 Canvas2D for TileLayers
 * @class
 * @protected
 * @memberOf maptalks.renderer
 * @extends {renderer.CanvasRenderer}
 * @param {maptalks.TileLayer} layer - TileLayer to render
 */

var TileLayerRenderer = function (_CanvasRenderer) {
    inherits(TileLayerRenderer, _CanvasRenderer);

    function TileLayerRenderer(layer) {
        classCallCheck(this, TileLayerRenderer);

        var _this = possibleConstructorReturn(this, _CanvasRenderer.call(this, layer));

        _this.propertyOfPointOnTile = '--maptalks-tile-point';
        _this.propertyOfTileId = '--maptalks-tile-id';
        _this.propertyOfTileZoom = '--maptalks-tile-zoom';
        _this._mapRender = layer.getMap()._getRenderer();
        if (!isNode && _this.layer.options['cacheTiles']) {
            _this._tileCache = new TileCache();
        }
        _this._tileQueue = {};
        return _this;
    }

    TileLayerRenderer.prototype.clear = function clear() {
        this.clearCanvas();
        this.requestMapToRender();
    };

    TileLayerRenderer.prototype.draw = function draw() {
        var layer = this.layer;
        var tileGrid = layer._getTiles();
        if (!tileGrid) {
            this.completeRender();
            return;
        }
        if (!this._tileRended) {
            this._tileRended = {};
        }
        var tileRended = this._tileRended;
        this._tileRended = {};

        var tiles = tileGrid['tiles'],
            tileCache = this._tileCache,
            tileSize = layer.getTileSize();

        // this._extent2D = tileGrid['fullExtent'];
        // this._northWest = tileGrid['northWest'];
        if (!this.canvas) {
            this.createCanvas();
        }
        // this.resizeCanvas(tileGrid['fullExtent'].getSize());
        var mask2DExtent = this.prepareCanvas();
        if (mask2DExtent && !mask2DExtent.intersects(this._extent2D)) {
            this.completeRender();
            return;
        }

        //visit all the tiles
        this._totalTileToLoad = this._tileToLoadCounter = 0;
        var tile, tileId, cached, tile2DExtent;
        for (var i = tiles.length - 1; i >= 0; i--) {
            tile = tiles[i];
            tileId = tiles[i]['id'];
            //load tile in cache at first if it has.
            cached = tileRended[tileId] || (tileCache ? tileCache.get(tileId) : null);
            tile2DExtent = new PointExtent(tile['point'], tile['point'].add(tileSize.toPoint()));
            if (!this._extent2D.intersects(tile2DExtent) || mask2DExtent && !mask2DExtent.intersects(tile2DExtent)) {
                continue;
            }
            this._totalTileToLoad++;
            if (cached) {
                this._drawTile(tile['point'], cached);
                this._tileRended[tileId] = cached;
            } else {

                this._tileToLoadCounter++;
                this._tileQueue[tileId + '@' + tile['point'].toString()] = tile;
            }
        }

        if (this._tileToLoadCounter === 0) {
            this.completeRender();
        } else {
            if (this._tileToLoadCounter < this._totalTileToLoad) {
                this.requestMapToRender();
            }
            this._scheduleLoadTileQueue();
        }
    };

    TileLayerRenderer.prototype.hitDetect = function hitDetect() {
        return false;
    };

    TileLayerRenderer.prototype._scheduleLoadTileQueue = function _scheduleLoadTileQueue() {
        var _this2 = this;

        if (this._loadQueueTimeout) {
            cancelAnimFrame(this._loadQueueTimeout);
        }

        this._loadQueueTimeout = requestAnimFrame(function () {
            _this2._loadTileQueue();
        });
    };

    TileLayerRenderer.prototype._loadTileQueue = function _loadTileQueue() {
        var me = this;

        function onTileLoad() {
            if (!isNode) {
                if (me._tileCache) {
                    me._tileCache.add(this[me.propertyOfTileId], this);
                }
                me._tileRended[this[me.propertyOfTileId]] = this;
            }
            me._drawTileAndRequest(this);
        }

        function onTileError() {
            me._clearTileRectAndRequest(this);
        }
        var tileId, tile;
        for (var p in this._tileQueue) {
            if (this._tileQueue.hasOwnProperty(p)) {
                tileId = p.split('@')[0];
                tile = this._tileQueue[p];
                delete this._tileQueue[p];
                if (!this._tileCache || !this._tileCache[tileId]) {
                    this._loadTile(tileId, tile, onTileLoad, onTileError);
                } else {
                    this._drawTileAndRequest(this._tileCache[tileId]);
                }
            }
        }
    };

    TileLayerRenderer.prototype._loadTile = function _loadTile(tileId, tile, onTileLoad, onTileError) {
        var crossOrigin = this.layer.options['crossOrigin'];
        var tileSize = this.layer.getTileSize();
        var tileImage = new Image();
        tileImage.width = tileSize['width'];
        tileImage.height = tileSize['height'];
        tileImage[this.propertyOfTileId] = tileId;
        tileImage[this.propertyOfPointOnTile] = tile['point'];
        tileImage[this.propertyOfTileZoom] = tile['z'];
        tileImage.onload = onTileLoad;
        tileImage.onabort = onTileError;
        tileImage.onerror = onTileError;
        if (crossOrigin) {
            tileImage.crossOrigin = crossOrigin;
        }
        loadImage(tileImage, [tile['url']]);
    };

    TileLayerRenderer.prototype._drawTile = function _drawTile(point, tileImage) {
        if (!point) {
            return;
        }
        var tileSize = this.layer.getTileSize();
        var ctx = this.context;
        Canvas.image(ctx, tileImage, Math.floor(point.x - this._northWest.x), Math.floor(point.y - this._northWest.y), tileSize['width'], tileSize['height']);
        if (this.layer.options['debug']) {
            var p = point.substract(this._northWest);
            ctx.save();
            var color = '#0f0';
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.strokeWidth = 10;
            ctx.font = '15px monospace';
            Canvas.rectangle(ctx, p, tileSize, 1, 0);
            var xyz = tileImage[this.propertyOfTileId].split('__');
            Canvas.fillText(ctx, 'x:' + xyz[1] + ', y:' + xyz[0] + ', z:' + xyz[2], p.add(10, 20), color);
            Canvas.drawCross(ctx, p.add(tileSize['width'] / 2, tileSize['height'] / 2), 2, color);
            this.context.restore();
        }
        tileImage = null;
    };

    /**
     * draw tiles and request map to render
     * @param  {Image} tileImage
     */


    TileLayerRenderer.prototype._drawTileAndRequest = function _drawTileAndRequest(tileImage) {
        //sometimes, layer may be removed from map here.
        if (!this.getMap()) {
            return;
        }
        var zoom = this.getMap().getZoom();
        if (zoom !== tileImage[this.propertyOfTileZoom]) {
            return;
        }
        this._tileToLoadCounter--;
        var point = tileImage[this.propertyOfPointOnTile];
        this._drawTile(point, tileImage);

        if (!isNode) {
            var tileSize = this.layer.getTileSize();
            var mapExtent = this.getMap()._get2DExtent();
            if (mapExtent.intersects(new PointExtent(point, point.add(tileSize['width'], tileSize['height'])))) {
                this.requestMapToRender();
            }
        }
        if (this._tileToLoadCounter === 0) {
            this._onTileLoadComplete();
        }
    };

    TileLayerRenderer.prototype._onTileLoadComplete = function _onTileLoadComplete() {
        //In browser, map will be requested to render once a tile was loaded.
        //but in node, map will be requested to render when the layer is loaded.
        if (isNode) {
            this.requestMapToRender();
        }
        this.fireLoadedEvent();
    };

    /**
     * Clear tiles and request map to render
     * @param  {Image} tileImage
     */


    TileLayerRenderer.prototype._clearTileRectAndRequest = function _clearTileRectAndRequest(tileImage) {
        if (!this.getMap()) {
            return;
        }
        var zoom = this.getMap().getZoom();
        if (zoom !== tileImage[this.propertyOfTileZoom]) {
            return;
        }
        if (!isNode) {
            this.requestMapToRender();
        }
        this._tileToLoadCounter--;
        if (this._tileToLoadCounter === 0) {
            this._onTileLoadComplete();
        }
    };

    /**
     * @override
     */


    TileLayerRenderer.prototype.requestMapToRender = function requestMapToRender() {
        var _this3 = this;

        if (isNode) {
            if (this.getMap() && !this.getMap().isZooming()) {
                this._mapRender.render();
            }
            return;
        }
        if (this._mapRenderRequest) {
            cancelAnimFrame(this._mapRenderRequest);
        }
        this._mapRenderRequest = requestAnimFrame(function () {
            if (_this3.getMap() && !_this3.getMap().isZooming()) {
                _this3._mapRender.render();
            }
        });
    };

    TileLayerRenderer.prototype.onRemove = function onRemove() {
        cancelAnimFrame(this._loadQueueTimeout);
        cancelAnimFrame(this._mapRenderRequest);
        delete this._mapRender;
        delete this._tileCache;
        delete this._tileRended;
        delete this._tileQueue;
    };

    return TileLayerRenderer;
}(CanvasRenderer);

TileLayer.registerRenderer('canvas', TileLayerRenderer);

var CanvasTileLayerRenderer = function (_TileLayerCanvasRende) {
    inherits(CanvasTileLayerRenderer, _TileLayerCanvasRende);

    function CanvasTileLayerRenderer() {
        classCallCheck(this, CanvasTileLayerRenderer);
        return possibleConstructorReturn(this, _TileLayerCanvasRende.apply(this, arguments));
    }

    CanvasTileLayerRenderer.prototype._loadTile = function _loadTile(tileId, tile, onTileLoad, onTileError) {
        var tileSize = this.layer.getTileSize(),
            canvasClass = this.canvas.constructor,
            map = this.getMap();
        var r = Browser$1.retina ? 2 : 1;
        var tileCanvas = Canvas.createCanvas(tileSize['width'] * r, tileSize['height'] * r, canvasClass);
        tileCanvas['layer'] = this.layer;
        tileCanvas[this.propertyOfTileId] = tileId;
        tileCanvas[this.propertyOfPointOnTile] = tile['point'];
        tileCanvas[this.propertyOfTileZoom] = tile['z'];
        this.layer.drawTile(tileCanvas, {
            'url': tile['url'],
            'point': tile['point'],
            'center': map.pointToCoordinate(tile['point'].add(tileSize['width'] / 2, tileSize['height'] / 2)),
            'z': tile['z'],
            'x': tile['x'],
            'y': tile['y']
        }, function (error) {
            if (error) {
                onTileError.call(tileCanvas);
                return;
            }
            onTileLoad.call(tileCanvas);
        });
    };

    return CanvasTileLayerRenderer;
}(TileLayerRenderer);

CanvasTileLayer.registerRenderer('canvas', CanvasTileLayerRenderer);

/**
 * @classdesc
 * A parent renderer class for OverlayLayer to inherit by OverlayLayer's subclasses.
 * @protected
 * @memberOf renderer
 * @name OverlayLayerCanvasRenderer
 * @extends renderer.CanvasRenderer
 */

var OverlayLayerRenderer = function (_CanvasRenderer) {
    inherits(OverlayLayerRenderer, _CanvasRenderer);

    function OverlayLayerRenderer() {
        classCallCheck(this, OverlayLayerRenderer);
        return possibleConstructorReturn(this, _CanvasRenderer.apply(this, arguments));
    }

    // geometries can be: true | [geometries] | null
    // true: check layer's all geometries if the checking is the first time.
    // [geometries] : the additional geometries needs to be checked.
    // null : no checking.
    //
    // possible memory leaks:
    // 1. if geometries' symbols with external resources change frequently,
    // resources of old symbols will still be stored.
    // 2. removed geometries' resources won't be removed.
    OverlayLayerRenderer.prototype.checkResources = function checkResources(geometries) {
        if (!this._resourceChecked && !Array.isArray(geometries)) {
            geometries = this.layer._geoList;
        }
        if (!geometries || !isArrayHasData(geometries)) {
            return [];
        }
        var me = this,
            resources = [];
        var res;

        function checkGeo(geo) {
            res = geo._getExternalResources();
            if (!isArrayHasData(res)) {
                return;
            }
            if (!me.resources) {
                resources = resources.concat(res);
            } else {
                for (var ii = 0; ii < res.length; ii++) {
                    if (!me.resources.isResourceLoaded(res[ii])) {
                        resources.push(res[ii]);
                    }
                }
            }
        }

        for (var i = geometries.length - 1; i >= 0; i--) {
            checkGeo(geometries[i]);
        }
        this._resourceChecked = true;
        return resources;
    };

    OverlayLayerRenderer.prototype.onGeometryAdd = function onGeometryAdd(geometries) {
        this.render(geometries);
    };

    OverlayLayerRenderer.prototype.onGeometryRemove = function onGeometryRemove() {
        this.render();
    };

    OverlayLayerRenderer.prototype.onGeometrySymbolChange = function onGeometrySymbolChange(e) {
        this.render([e.target]);
    };

    OverlayLayerRenderer.prototype.onGeometryShapeChange = function onGeometryShapeChange() {
        this.render();
    };

    OverlayLayerRenderer.prototype.onGeometryPositionChange = function onGeometryPositionChange() {
        this.render();
    };

    OverlayLayerRenderer.prototype.onGeometryZIndexChange = function onGeometryZIndexChange() {
        this.render();
    };

    OverlayLayerRenderer.prototype.onGeometryShow = function onGeometryShow() {
        this.render();
    };

    OverlayLayerRenderer.prototype.onGeometryHide = function onGeometryHide() {
        this.render();
    };

    OverlayLayerRenderer.prototype.onGeometryPropertiesChange = function onGeometryPropertiesChange() {
        this.render();
    };

    return OverlayLayerRenderer;
}(CanvasRenderer);

/**
 * @classdesc
 * Renderer class based on HTML5 Canvas2D for VectorLayers
 * @protected
 * @memberOf renderer
 * @name VectorLayerCanvasRenderer
 * @extends renderer.OverlaylayerCanvasRenderer
 * @param {VectorLayer} layer - layer to render
 */

var VectorLayerRenderer = function (_OverlayLayerCanvasRe) {
    inherits(VectorLayerRenderer, _OverlayLayerCanvasRe);

    function VectorLayerRenderer() {
        classCallCheck(this, VectorLayerRenderer);
        return possibleConstructorReturn(this, _OverlayLayerCanvasRe.apply(this, arguments));
    }

    VectorLayerRenderer.prototype.checkResources = function checkResources() {
        var me = this;
        var resources = OverlayLayerRenderer.prototype.checkResources.apply(this, arguments);
        var style = this.layer.getStyle();
        if (style) {
            if (!Array.isArray(style)) {
                style = [style];
            }
            style.forEach(function (s) {
                var res = getExternalResources(s['symbol'], true);
                if (res) {
                    for (var ii = 0; ii < res.length; ii++) {
                        if (!me.resources.isResourceLoaded(res[ii])) {
                            resources.push(res[ii]);
                        }
                    }
                }
            });
        }
        return resources;
    };

    /**
     * render layer
     * @param  {Geometry[]} geometries   geometries to render
     * @param  {Boolean} ignorePromise   whether escape step of promise
     */


    VectorLayerRenderer.prototype.draw = function draw() {
        if (!this.getMap()) {
            return;
        }
        if (!this.layer.isVisible() || this.layer.isEmpty()) {
            this.clearCanvas();
            this.completeRender();
            return;
        }

        var maskExtent2D = this.prepareCanvas();

        this._drawGeos(maskExtent2D);

        this.completeRender();
    };

    VectorLayerRenderer.prototype.drawOnZooming = function drawOnZooming() {
        for (var i = 0, len = this._geosToDraw.length; i < len; i++) {
            this._geosToDraw[i]._paint();
        }
    };

    VectorLayerRenderer.prototype.isBlank = function isBlank() {
        return this._isBlank;
    };

    /**
     * Show and render
     * @override
     */


    VectorLayerRenderer.prototype.show = function show() {
        this.layer.forEach(function (geo) {
            geo._repaint();
        });
        CanvasRenderer.prototype.show.apply(this, arguments);
    };

    VectorLayerRenderer.prototype.isUpdateWhenZooming = function isUpdateWhenZooming() {
        var map = this.getMap();
        var count = map._getRenderer()._getCountOfGeosToDraw();
        return this._hasPointSymbolizer && count > 0 && count <= map.options['pointThresholdOfZoomAnimation'];
    };

    VectorLayerRenderer.prototype._drawGeos = function _drawGeos(maskExtent2D) {
        var extent2D = this._extent2D;
        if (maskExtent2D) {
            if (!maskExtent2D.intersects(extent2D)) {
                this.fireLoadedEvent();
                return;
            }
            extent2D = extent2D.intersection(maskExtent2D);
        }
        this._prepareToDraw();
        this._displayExtent = extent2D;
        this._forEachGeo(this._checkGeo, this);
        for (var i = 0, len = this._geosToDraw.length; i < len; i++) {
            this._geosToDraw[i]._paint();
        }
    };

    VectorLayerRenderer.prototype._prepareToDraw = function _prepareToDraw() {
        this._isBlank = true;
        this._hasPointSymbolizer = false;
        this._geosToDraw = [];
    };

    VectorLayerRenderer.prototype._checkGeo = function _checkGeo(geo) {
        if (!geo || !geo.isVisible() || !geo.getMap() || !geo.getLayer() || !geo.getLayer().isCanvasRender()) {
            return;
        }
        var painter = geo._getPainter(),
            extent2D = painter.get2DExtent(this.resources);
        if (!extent2D || !extent2D.intersects(this._displayExtent)) {
            return;
        }
        this._isBlank = false;
        if (painter.hasPointSymbolizer()) {
            this._hasPointSymbolizer = true;
        }
        this._geosToDraw.push(geo);
    };

    VectorLayerRenderer.prototype._forEachGeo = function _forEachGeo(fn, context) {
        this.layer.forEach(fn, context);
    };

    VectorLayerRenderer.prototype.onZooming = function onZooming() {
        var map = this.getMap();
        if (this.layer.isVisible() && (map._pitch || this.isUpdateWhenZooming())) {
            this._geosToDraw.forEach(function (geo) {
                geo._removeZoomCache();
            });
        }
        CanvasRenderer.prototype.onZooming.apply(this, arguments);
    };

    VectorLayerRenderer.prototype.onZoomEnd = function onZoomEnd() {
        delete this._extent2D;
        if (this.layer.isVisible()) {
            this.layer.forEach(function (geo) {
                geo._removeZoomCache();
            });
        }
        CanvasRenderer.prototype.onZoomEnd.apply(this, arguments);
    };

    VectorLayerRenderer.prototype.onRemove = function onRemove() {
        this._forEachGeo(function (g) {
            g.onHide();
        });
        delete this._geosToDraw;
    };

    VectorLayerRenderer.prototype.onGeometryPropertiesChange = function onGeometryPropertiesChange(param) {
        if (param) {
            this.layer._styleGeometry(param['target']);
        }
    };

    return VectorLayerRenderer;
}(OverlayLayerRenderer);

VectorLayer.registerRenderer('canvas', VectorLayerRenderer);

/**
 * @classdesc
 * Base class for all the map renderers.
 * @class
 * @abstract
 * @protected
 * @memberOf renderer.map
 * @name Renderer
 * @extends {Class}
 */

var MapRenderer = function (_Class) {
    inherits(MapRenderer, _Class);

    function MapRenderer() {
        classCallCheck(this, MapRenderer);
        return possibleConstructorReturn(this, _Class.apply(this, arguments));
    }

    MapRenderer.prototype.panAnimation = function panAnimation(distance, t, onFinish) {
        distance = new Point(distance);
        var map = this.map;
        if (map.options['panAnimation']) {
            var duration;
            if (!t) {
                duration = map.options['panAnimationDuration'];
            } else {
                duration = t;
            }
            map._enablePanAnimation = true;
            map._panAnimating = true;
            var preDist = null;
            var player = Animation.animate({
                'distance': distance
            }, {
                'easing': 'out',
                'duration': duration
            }, function (frame) {
                if (!map._enablePanAnimation) {
                    player.finish();
                    map._panAnimating = false;
                    map.onMoveEnd();
                    return;
                }

                if (player.playState === 'running' && frame.styles['distance']) {
                    var dist = frame.styles['distance'];
                    if (!preDist) {
                        preDist = dist;
                    }
                    var offset = dist.substract(preDist);
                    map.offsetPlatform(offset);
                    map._offsetCenterByPixel(offset);
                    preDist = dist;
                    map.onMoving();
                } else if (player.playState === 'finished') {
                    map._panAnimating = false;
                    if (onFinish) {
                        onFinish();
                    }
                    map.onMoveEnd();
                }
            });
            player.play();
        } else {
            map.onMoveEnd();
        }
    };

    /**
     * 获取地图容器偏移量或更新地图容器偏移量
     * @param  {Point} offset 偏移量
     * @return {this | Point}
     */


    MapRenderer.prototype.offsetPlatform = function offsetPlatform(offset) {
        if (!this.map._panels.front) {
            return this;
        }
        var pos = this.map.offsetPlatform().add(offset)._round();
        offsetDom(this.map._panels.back, pos);
        offsetDom(this.map._panels.front, pos);
        return this;
    };

    MapRenderer.prototype.resetContainer = function resetContainer() {
        this.map._resetMapViewPoint();
        if (this.map._panels.front) {
            var pos = new Point(0, 0);
            offsetDom(this.map._panels.back, pos);
            offsetDom(this.map._panels.front, pos);
        }
    };

    MapRenderer.prototype.onZoomEnd = function onZoomEnd() {
        this.resetContainer();
    };

    MapRenderer.prototype.onLoad = function onLoad() {
        this.render();
    };

    return MapRenderer;
}(Class);

/**
 * @classdesc
 * Renderer class based on HTML5 Canvas2d for maps.
 * @class
 * @protected
 * @memberOf renderer.map
 * @name Canvas
 * @extends {renderer.map.Renderer}
 * @param {Map} map - map for the renderer
 */

var MapCanvasRenderer = function (_MapRenderer) {
    inherits(MapCanvasRenderer, _MapRenderer);

    function MapCanvasRenderer(map) {
        classCallCheck(this, MapCanvasRenderer);

        var _this = possibleConstructorReturn(this, _MapRenderer.call(this));

        _this.map = map;
        //container is a <canvas> element
        _this._isCanvasContainer = !!map._containerDOM.getContext;
        _this._registerEvents();
        return _this;
    }

    MapCanvasRenderer.prototype.isCanvasRender = function isCanvasRender() {
        return true;
    };

    /**
     * Renders the layers
     */


    MapCanvasRenderer.prototype.render = function render() {
        /**
         * renderstart event, an event fired when map starts to render.
         * @event Map#renderstart
         * @type {Object}
         * @property {String} type                    - renderstart
         * @property {Map} target            - the map fires event
         * @property {CanvasRenderingContext2D} context  - canvas context
         */
        this.map._fireEvent('renderstart', {
            'context': this.context
        });
        if (!this.canvas) {
            this.createCanvas();
        }
        var layers = this._getAllLayerToRender();

        if (!this._updateCanvasSize()) {
            this.clearCanvas();
        }

        this._drawBackground();

        for (var i = 0, len = layers.length; i < len; i++) {
            if (!layers[i].isVisible() || !layers[i].isCanvasRender()) {
                continue;
            }
            var renderer = layers[i]._getRenderer();
            if (renderer) {
                var layerImage = this._getLayerImage(layers[i]);
                if (layerImage && layerImage['image']) {
                    this._drawLayerCanvasImage(layers[i], layerImage);
                }
            }
        }

        this._drawCenterCross();
        /**
         * renderend event, an event fired when map ends rendering.
         * @event Map#renderend
         * @type {Object}
         * @property {String} type                      - renderend
         * @property {Map} target              - the map fires event
         * @property {CanvasRenderingContext2D} context - canvas context
         */
        this.map._fireEvent('renderend', {
            'context': this.context
        });
    };

    MapCanvasRenderer.prototype.updateMapSize = function updateMapSize(mSize) {
        if (!mSize || this._isCanvasContainer) {
            return;
        }
        var width = mSize['width'] + 'px',
            height = mSize['height'] + 'px';
        var panels = this.map._panels;
        panels.mapWrapper.style.width = width;
        panels.mapWrapper.style.height = height;
        panels.front.style.width = panels.frontLayer.style.width = width;
        panels.front.style.height = panels.frontLayer.style.height = height;
        panels.back.style.width = panels.backLayer.style.width = width;
        panels.back.style.height = panels.backLayer.style.height = height;
        panels.front.style.perspective = panels.back.style.perspective = height;
        this._updateCanvasSize();
    };

    MapCanvasRenderer.prototype.getMainPanel = function getMainPanel() {
        if (!this.map) {
            return null;
        }
        if (this._isCanvasContainer) {
            return this.map._containerDOM;
        }
        if (this.map._panels) {
            return this.map._panels.mapWrapper;
        }
        return null;
    };

    MapCanvasRenderer.prototype.toDataURL = function toDataURL(mimeType) {
        if (!this.canvas) {
            return null;
        }
        return this.canvas.toDataURL(mimeType);
    };

    MapCanvasRenderer.prototype.remove = function remove() {
        if (this._resizeInterval) {
            clearInterval(this._resizeInterval);
        }
        if (this._resizeFrame) {
            cancelAnimFrame(this._resizeFrame);
        }
        delete this.context;
        delete this.canvas;
        delete this.map;
        delete this._canvasBgRes;
        delete this._canvasBgCoord;
        delete this._canvasBg;
    };

    MapCanvasRenderer.prototype._getLayerImage = function _getLayerImage(layer) {
        if (layer && layer._getRenderer() && layer._getRenderer().getCanvasImage) {
            return layer._getRenderer().getCanvasImage();
        }
        return null;
    };

    MapCanvasRenderer.prototype._getCountOfGeosToDraw = function _getCountOfGeosToDraw() {
        var layers = this._getAllLayerToRender(),
            geos,
            renderer,
            total = 0;
        for (var i = layers.length - 1; i >= 0; i--) {
            renderer = layers[i]._getRenderer();
            if (layers[i] instanceof OverlayLayer && layers[i].isVisible() && !layers[i].isEmpty() && renderer._hasPointSymbolizer) {
                geos = renderer._geosToDraw;
                if (geos) {
                    total += renderer._geosToDraw.length;
                }
            }
        }
        return total;
    };

    /**
     * initialize container DOM of panels
     */


    MapCanvasRenderer.prototype.initContainer = function initContainer() {
        var panels = this.map._panels;

        function createContainer(name, className, cssText, enableSelect) {
            var c = createEl('div', className);
            if (cssText) {
                c.style.cssText = cssText;
            }
            panels[name] = c;
            if (!enableSelect) {
                preventSelection(c);
            }
            return c;
        }
        var containerDOM = this.map._containerDOM;

        if (this._isCanvasContainer) {
            //container is a <canvas> element.
            return;
        }

        containerDOM.innerHTML = '';

        var control = createContainer('control', 'maptalks-control', null, true);
        var mapWrapper = createContainer('mapWrapper', 'maptalks-wrapper', 'position:absolute;overflow:hidden;', true);
        var mapAllLayers = createContainer('allLayers', 'maptalks-all-layers', 'position:absolute;', true);
        var front = createContainer('front', 'maptalks-front', 'position:absolute;top:0px;left:0px;will-change:transform;', true);
        var frontLayer = createContainer('frontLayer', 'maptalks-front-layer', 'position:absolute;left:0px;top:0px;');
        // children's zIndex in frontLayer will be set by map.addLayer, ui container's z-index is set to 10000 to make sure it's always on the top.
        var ui = createContainer('ui', 'maptalks-ui', 'position:absolute;top:0px;left:0px;border:none;z-index:10000;', true);
        var back = createContainer('back', 'maptalks-back', 'position:absolute;left:0px;top:0px;will-change:transform;');
        var backLayer = createContainer('backLayer', 'maptalks-back-layer', 'position:absolute;left:0px;top:0px;');
        var canvasContainer = createContainer('canvasContainer', 'maptalks-canvas-layer', 'position:relative;border:none;');

        containerDOM.appendChild(mapWrapper);

        back.appendChild(backLayer);
        mapAllLayers.appendChild(back);
        mapAllLayers.appendChild(canvasContainer);
        front.appendChild(frontLayer);
        mapAllLayers.appendChild(front);
        front.appendChild(ui);

        mapWrapper.appendChild(mapAllLayers);
        mapWrapper.appendChild(control);

        this.createCanvas();

        this.resetContainer();
        var mapSize = this.map._getContainerDomSize();
        this.updateMapSize(mapSize);
    };

    MapCanvasRenderer.prototype._drawLayerCanvasImage = function _drawLayerCanvasImage(layer, layerImage) {
        if (!layer || !layerImage) {
            return;
        }
        var ctx = this.context;
        var point = layerImage['point'].multi(Browser$1.retina ? 2 : 1);
        var canvasImage = layerImage['image'];
        if (point.x + canvasImage.width <= 0 || point.y + canvasImage.height <= 0) {
            return;
        }
        //opacity of the layer image
        var op = layer.options['opacity'];
        if (!isNumber(op)) {
            op = 1;
        }
        if (op <= 0) {
            return;
        }
        var imgOp = layerImage['opacity'];
        if (!isNumber(imgOp)) {
            imgOp = 1;
        }
        if (imgOp <= 0) {
            return;
        }
        var alpha = ctx.globalAlpha;

        if (op < 1) {
            ctx.globalAlpha *= op;
        }
        if (imgOp < 1) {
            ctx.globalAlpha *= imgOp;
        }
        if (layer.options['cssFilter']) {
            ctx.filter = layer.options['cssFilter'];
        }

        if (layerImage['transform']) {
            ctx.save();
            ctx.setTransform.apply(ctx, layerImage['transform']);
        }

        if (isNode) {
            var context = canvasImage.getContext('2d');
            if (context.getSvg) {
                //canvas2svg
                canvasImage = context;
            }
        }

        if (layer.options['debugOutline']) {
            this.context.strokeStyle = '#0f0';
            this.context.fillStyle = '#0f0';
            this.context.lineWidth = 10;
            Canvas.rectangle(ctx, point, layerImage.size, 1, 0);
            ctx.fillText([layer.getId(), point.toArray().join(), layerImage.size.toArray().join(), canvasImage.width + ',' + canvasImage.height].join(' '), point.x + 18, point.y + 18);
        }
        // console.log(layer.getId(), point);

        ctx.drawImage(canvasImage, point.x, point.y);
        if (layerImage['transform']) {
            ctx.restore();
        }
        if (ctx.filter !== 'none') {
            ctx.filter = 'none';
        }
        ctx.globalAlpha = alpha;
    };

    MapCanvasRenderer.prototype._storeBackground = function _storeBackground(baseLayerImage) {
        if (baseLayerImage) {
            var map = this.map;
            this._canvasBg = copyCanvas(baseLayerImage['image']);
            this._canvasBgRes = map._getResolution();
            this._canvasBgCoord = map.containerPointToCoordinate(baseLayerImage['point']);
        }
    };

    MapCanvasRenderer.prototype._drawBackground = function _drawBackground() {
        var map = this.map;
        if (this._canvasBg) {
            var baseLayer = this.map.getBaseLayer();
            if (baseLayer.options['cssFilter']) {
                this.context.filter = baseLayer.options['cssFilter'];
            }
            var scale = this._canvasBgRes / map._getResolution();
            var p = map.coordinateToContainerPoint(this._canvasBgCoord)._multi(Browser$1.retina ? 2 : 1);
            Canvas.image(this.context, this._canvasBg, p.x, p.y, this._canvasBg.width * scale, this._canvasBg.height * scale);
            if (this.context.filter !== 'none') {
                this.context.filter = 'none';
            }
        }
    };

    MapCanvasRenderer.prototype._drawCenterCross = function _drawCenterCross() {
        var cross = this.map.options['centerCross'];
        if (cross) {
            var ctx = this.context;
            var p = new Point(this.canvas.width / 2, this.canvas.height / 2);
            if (isFunction(cross)) {
                cross(ctx, p);
            } else {
                Canvas.drawCross(this.context, p, 2, '#f00');
            }
        }
    };

    MapCanvasRenderer.prototype._getAllLayerToRender = function _getAllLayerToRender() {
        return this.map._getLayers();
    };

    MapCanvasRenderer.prototype.clearCanvas = function clearCanvas() {
        if (!this.canvas) {
            return;
        }
        Canvas.clearRect(this.context, 0, 0, this.canvas.width, this.canvas.height);
    };

    MapCanvasRenderer.prototype._updateCanvasSize = function _updateCanvasSize() {
        if (!this.canvas || this._isCanvasContainer) {
            return false;
        }
        var map = this.map;
        var mapSize = map.getSize();
        var canvas = this.canvas;
        var r = Browser$1.retina ? 2 : 1;
        if (mapSize['width'] * r === canvas.width && mapSize['height'] * r === canvas.height) {
            return false;
        }
        //retina屏支持

        canvas.height = r * mapSize['height'];
        canvas.width = r * mapSize['width'];
        if (canvas.style) {
            canvas.style.width = mapSize['width'] + 'px';
            canvas.style.height = mapSize['height'] + 'px';
        }

        return true;
    };

    MapCanvasRenderer.prototype.createCanvas = function createCanvas() {
        if (this._isCanvasContainer) {
            this.canvas = this.map._containerDOM;
        } else {
            this.canvas = createEl('canvas');
            this._updateCanvasSize();
            this.map._panels.canvasContainer.appendChild(this.canvas);
        }
        this.context = this.canvas.getContext('2d');
    };

    MapCanvasRenderer.prototype._checkSize = function _checkSize() {
        var _this2 = this;

        cancelAnimFrame(this._resizeFrame);
        if (this.map.isZooming() || this.map.isMoving() || this.map._panAnimating) {
            return;
        }
        this._resizeFrame = requestAnimFrame(function () {
            if (_this2.map.isMoving() || _this2.map.isZooming()) {
                return;
            }
            _this2.map.checkSize();
        });
    };

    MapCanvasRenderer.prototype._registerEvents = function _registerEvents() {
        var _this3 = this;

        var map = this.map;
        map.on('_baselayerchangestart', function () {
            delete _this3._canvasBg;
        });
        map.on('_baselayerload', function () {
            var baseLayer = map.getBaseLayer();
            if (!map.options['zoomBackground'] || baseLayer.getMask()) {
                delete _this3._canvasBg;
            }
        });
        map.on('_resize', function () {
            delete _this3._canvasBg;
        });
        map.on('_zoomstart', function () {
            delete _this3._canvasBg;
            // this.clearCanvas();
        });
        if (map.options['checkSize'] && !isNode && typeof window !== 'undefined') {
            this._checkSizeInterval = 1000;
            // on(window, 'resize', this._checkSize, this);
            this._resizeInterval = setInterval(function () {
                if (!map._containerDOM.parentNode) {
                    //is deleted
                    clearInterval(_this3._resizeInterval);
                } else {
                    _this3._checkSize();
                }
            }, this._checkSizeInterval);
        }
        if (!Browser$1.mobile && Browser$1.canvas) {
            this._onMapMouseMove = function (param) {
                if (map.isZooming() || map.isMoving() || !map.options['hitDetect']) {
                    return;
                }
                if (this._hitDetectFrame) {
                    cancelAnimFrame(this._hitDetectFrame);
                }
                this._hitDetectFrame = requestAnimFrame(function () {
                    if (map.isZooming() || map.isMoving() || !map.options['hitDetect']) {
                        return;
                    }
                    var point = param['point2d'];
                    var layers = map._getLayers();
                    var hit = false,
                        cursor;
                    for (var i = layers.length - 1; i >= 0; i--) {
                        var layer = layers[i];
                        if (layer._getRenderer() && layer._getRenderer().hitDetect) {
                            if (layer.options['cursor'] !== 'default' && layer._getRenderer().hitDetect(point)) {
                                cursor = layer.options['cursor'];
                                hit = true;
                                break;
                            }
                        }
                    }
                    if (hit) {
                        map._trySetCursor(cursor);
                    } else {
                        map._trySetCursor('default');
                    }
                });
            };
            map.on('_mousemove', this._onMapMouseMove, this);
        }
        map.on('_moving _moveend', function () {
            if (!map._pitch) {
                _this3.render();
            }
        });
    };

    return MapCanvasRenderer;
}(MapRenderer);

Map.registerRenderer('canvas', MapCanvasRenderer);

/** @namespace renderer */



var index$6 = Object.freeze({
	ResourceCache: ResourceCache,
	CanvasRenderer: CanvasRenderer,
	MapRenderer: MapRenderer,
	MapCanvasRenderer: MapCanvasRenderer,
	Renderable: Renderable,
	TileLayerDomRenderer: TileLayerDomRenderer,
	TileLayerCanvasRenderer: TileLayerRenderer,
	CanvasTileLayerRenderer: CanvasTileLayerRenderer,
	OverlayLayerCanvasRenderer: OverlayLayerRenderer,
	VectorLayerCanvasRenderer: VectorLayerRenderer,
	CanvasLayerRenderer: CanvasLayerRenderer
});

// 有中心点的图形的共同方法
var CenterPointRenderer = {
    _getRenderPoints: function _getRenderPoints() {
        return [[this._getCenter2DPoint(this.getMap().getMaxZoom())], null];
    }
};

/**
 * 获取symbolizer所需的数据
 */
Marker.include(CenterPointRenderer);

Ellipse.include(CenterPointRenderer, {
    _getRenderSize: function _getRenderSize() {
        var w = this.getWidth(),
            h = this.getHeight();
        var map = this.getMap();
        return map.distanceToPixel(w / 2, h / 2, map.getMaxZoom());
    }
});

Circle.include(CenterPointRenderer, {
    _getRenderSize: function _getRenderSize() {
        var radius = this.getRadius();
        var map = this.getMap();
        return map.distanceToPixel(radius, radius, map.getMaxZoom());
    }
});
//----------------------------------------------------
Sector.include(CenterPointRenderer, {
    _getRenderSize: function _getRenderSize() {
        var radius = this.getRadius();
        var map = this.getMap();
        return map.distanceToPixel(radius, radius, map.getMaxZoom());
    }
});
//----------------------------------------------------
Rectangle.include({
    _getRenderPoints: function _getRenderPoints(placement) {
        var map = this.getMap();
        if (placement === 'vertex') {
            var shell = this.getShell();
            var points = [];
            for (var i = 0, len = shell.length; i < len; i++) {
                points.push(this.getMap().coordinateToPoint(shell[i]), map.getMaxZoom());
            }
            return [points, null];
        } else {
            var c = this.getMap().coordinateToPoint(this.getCenter(), map.getMaxZoom());
            return [[c], null];
        }
    },
    _getRenderSize: function _getRenderSize() {
        var w = this.getWidth(),
            h = this.getHeight();
        var map = this.getMap();
        return map.distanceToPixel(w, h, map.getMaxZoom());
    }
});

//----------------------------------------------------
var PolyRenderer = {
    _getRenderPoints: function _getRenderPoints(placement) {
        var map = this.getMap();
        var maxZoom = map.getMaxZoom();
        var points,
            rotations = null;
        if (placement === 'vertex') {
            points = this._getPath2DPoints(this._getPrjCoordinates(), false, maxZoom);
            if (points && points.length > 0 && Array.isArray(points[0])) {
                //anti-meridian
                points = points[0].concat(points[1]);
            }
        } else if (placement === 'line') {
            points = [];
            rotations = [];
            var vertice = this._getPath2DPoints(this._getPrjCoordinates(), false, maxZoom),
                isSplitted = vertice.length > 0 && Array.isArray(vertice[0]);
            var i, len;
            if (isSplitted) {
                //anti-meridian splitted
                var ring, ii, ilen;
                for (i = 1, len = vertice.length; i < len; i++) {
                    ring = vertice[i];
                    if (this instanceof Polygon && ring.length > 0 && !ring[0].equals(ring[ring.length - 1])) {
                        ring.push(ring[0]);
                    }
                    for (ii = 1, ilen = ring.length; ii < ilen; ii++) {
                        points.push(ring[ii].add(ring[ii - 1])._multi(0.5));
                        rotations.push(computeDegree(ring[ii - 1], ring[ii]));
                    }
                }
            } else {
                if (this instanceof Polygon && vertice.length > 0 && !vertice[0].equals(vertice[vertice.length - 1])) {
                    vertice.push(vertice[0]);
                }
                for (i = 1, len = vertice.length; i < len; i++) {
                    points.push(vertice[i].add(vertice[i - 1])._multi(0.5));
                    rotations.push(computeDegree(vertice[i - 1], vertice[i]));
                }
            }
        } else if (placement === 'vertex-first') {
            var first = this._getPrjCoordinates()[0];
            points = [map._prjToPoint(first, maxZoom)];
        } else if (placement === 'vertex-last') {
            var last = this._getPrjCoordinates()[this._getPrjCoordinates().length - 1];
            points = [map._prjToPoint(last, maxZoom)];
        } else {
            var pcenter = this._getProjection().project(this.getCenter());
            points = [map._prjToPoint(pcenter, maxZoom)];
        }
        return [points, rotations];
    }
};

LineString.include(PolyRenderer);

Polygon.include(PolyRenderer);

var ellipseReources = {
    _getPaintParams: function _getPaintParams() {
        var map = this.getMap();
        var pcenter = this._getPrjCoordinates();
        var pt = map._prjToPoint(pcenter, map.getMaxZoom());
        var size = this._getRenderSize();
        return [pt, size['width'], size['height']];
    },


    _paintOn: Canvas.ellipse
};

Ellipse.include(ellipseReources);

Circle.include(ellipseReources);
//----------------------------------------------------
Rectangle.include({
    _getPaintParams: function _getPaintParams() {
        var map = this.getMap();
        var pt = map._prjToPoint(this._getPrjCoordinates(), map.getMaxZoom());
        var size = this._getRenderSize();
        return [pt, size];
    },

    _paintOn: Canvas.rectangle
});
//----------------------------------------------------
Sector.include({
    _getPaintParams: function _getPaintParams() {
        var map = this.getMap();
        var pt = map._prjToPoint(this._getPrjCoordinates(), map.getMaxZoom());
        var size = this._getRenderSize();
        return [pt, size['width'], [this.getStartAngle(), this.getEndAngle()]];
    },

    _paintOn: Canvas.sector

});
//----------------------------------------------------

LineString.include({
    arrowStyles: {
        'classic': [3, 4]
    },

    _getArrowPoints: function _getArrowPoints(prePoint, point, lineWidth, arrowStyle, tolerance) {
        if (!tolerance) {
            tolerance = 0;
        }
        var width = lineWidth * arrowStyle[0],
            height = lineWidth * arrowStyle[1] + tolerance,
            hw = width / 2 + tolerance;

        var normal = point.substract(prePoint)._unit();
        var p1 = point.substract(normal.multi(height));
        normal._perp();
        var p0 = p1.add(normal.multi(hw));
        normal._multi(-1);
        var p2 = p1.add(normal.multi(hw));
        return [p0, point, p2, p0];
    },
    _getPaintParams: function _getPaintParams() {
        var prjVertexes = this._getPrjCoordinates();
        var points = this._getPath2DPoints(prjVertexes, false, this.getMap().getMaxZoom());
        return [points];
    },
    _paintOn: function _paintOn(ctx, points, lineOpacity, fillOpacity, dasharray) {
        Canvas.path(ctx, points, lineOpacity, null, dasharray);
        this._paintArrow(ctx, points, lineOpacity);
    },
    _getArrowPlacement: function _getArrowPlacement() {
        return this.options['arrowPlacement'];
    },
    _getArrowStyle: function _getArrowStyle() {
        var arrowStyle = this.options['arrowStyle'];
        if (arrowStyle) {
            return Array.isArray(arrowStyle) ? arrowStyle : this.arrowStyles[arrowStyle];
        }
        return null;
    },
    _getArrows: function _getArrows(points, lineWidth, tolerance) {
        var arrowStyle = this._getArrowStyle();
        if (!arrowStyle || points.length < 2) {
            return null;
        }
        var isSplitted = points.length > 0 && Array.isArray(points[0]);
        var segments = isSplitted ? points : [points];
        var placement = this._getArrowPlacement();
        var arrows = [];
        for (var i = segments.length - 1; i >= 0; i--) {
            if (placement === 'vertex-first' || placement === 'vertex-firstlast') {
                arrows.push(this._getArrowPoints(segments[i][1], segments[i][0], lineWidth, arrowStyle, tolerance));
            }
            if (placement === 'vertex-last' || placement === 'vertex-firstlast') {
                arrows.push(this._getArrowPoints(segments[i][segments[i].length - 2], segments[i][segments[i].length - 1], lineWidth, arrowStyle, tolerance));
            } else if (placement === 'point') {
                for (var ii = 0, ll = segments[i].length - 1; ii < ll; ii++) {
                    arrows.push(this._getArrowPoints(segments[i][ii], segments[i][ii + 1], lineWidth, arrowStyle, tolerance));
                }
            }
        }
        return arrows.length > 0 ? arrows : null;
    },
    _paintArrow: function _paintArrow(ctx, points, lineOpacity) {
        var lineWidth = this._getInternalSymbol()['lineWidth'];
        if (!lineWidth || lineWidth < 3) {
            lineWidth = 3;
        }
        var arrows = this._getArrows(points, lineWidth);
        if (!arrows) {
            return;
        }
        if (arrows) {
            if (ctx.setLineDash) {
                //remove line dash effect if any
                ctx.setLineDash([]);
            }
            for (var i = arrows.length - 1; i >= 0; i--) {
                ctx.fillStyle = ctx.strokeStyle;
                Canvas.polygon(ctx, arrows[i], lineOpacity, lineOpacity);
            }
        }
    }
});

Polygon.include({
    _getPaintParams: function _getPaintParams() {
        var maxZoom = this.getMap().getMaxZoom();
        var prjVertexes = this._getPrjCoordinates();
        var points = this._getPath2DPoints(prjVertexes, false, maxZoom);
        //splitted by anti-meridian
        var isSplitted = points.length > 0 && Array.isArray(points[0]);
        if (isSplitted) {
            points = [[points[0]], [points[1]]];
        }
        var prjHoles = this._getPrjHoles();
        var holePoints = [];
        if (isArrayHasData(prjHoles)) {
            for (var i = 0; i < prjHoles.length; i++) {
                var hole = this._getPath2DPoints(prjHoles[i], false, maxZoom);
                if (isSplitted) {
                    if (Array.isArray(hole)) {
                        points[0].push(hole[0]);
                        points[1].push(hole[1]);
                    } else {
                        points[0].push(hole);
                    }
                } else {
                    holePoints.push(hole);
                }
            }
        }
        return [isSplitted ? points : [points].concat(holePoints)];
    },

    _paintOn: Canvas.polygon
});

// maptalks.ui.*
// maptalks.control.*
/**
 * @namespace
 */
// import layer renderers
// import geometry renderers

exports.Util = index;
exports.DomUtil = dom;
exports.StringUtil = strings;
exports.MapboxUtil = index$1;
exports.ui = index$4;
exports.control = index$5;
exports.renderer = index$6;
exports.symbolizer = index$2;
exports.animation = Animation$1;
exports.Browser = Browser$1;
exports.Ajax = Ajax$1;
exports.Canvas = Canvas;
exports.Class = Class;
exports.Eventable = Eventable;
exports.JSONAble = JSONAble;
exports.Handlerable = Handlerable;
exports.Handler = Handler$1;
exports.INTERNAL_LAYER_PREFIX = INTERNAL_LAYER_PREFIX;
exports.GEOMETRY_COLLECTION_TYPES = GEOMETRY_COLLECTION_TYPES;
exports.GEOJSON_TYPES = GEOJSON_TYPES;
exports.projection = projections;
exports.measurer = index$3;
exports.Coordinate = Coordinate;
exports.CRS = CRS;
exports.Extent = Extent;
exports.Point = Point;
exports.PointExtent = PointExtent;
exports.Size = Size;
exports.Transformation = Transformation;
exports.Map = Map;
exports.MapTool = MapTool;
exports.DrawTool = DrawTool;
exports.AreaTool = AreaTool;
exports.DistanceTool = DistanceTool;
exports.View = View;
exports.Layer = Layer;
exports.TileLayer = TileLayer;
exports.CanvasTileLayer = CanvasTileLayer;
exports.OverlayLayer = OverlayLayer;
exports.VectorLayer = VectorLayer;
exports.GeoJSONLayer = GeoJSONLayer;
exports.CanvasLayer = CanvasLayer;
exports.ParticleLayer = ParticleLayer;
exports.ArcCurve = ArcCurve;
exports.Circle = Circle;
exports.ConnectorLine = ConnectorLine;
exports.ArcConnectorLine = ArcConnectorLine;
exports.CubicBezierCurve = CubicBezierCurve;
exports.Curve = Curve;
exports.Ellipse = Ellipse;
exports.GeoJSON = GeoJSON;
exports.Geometry = Geometry;
exports.GeometryCollection = GeometryCollection;
exports.Label = Label;
exports.LineString = LineString;
exports.Marker = Marker;
exports.MultiLineString = MultiLineString;
exports.MultiPoint = MultiPoint;
exports.MultiPolygon = MultiPolygon;
exports.Polygon = Polygon;
exports.QuadBezierCurve = QuadBezierCurve;
exports.Rectangle = Rectangle;
exports.Sector = Sector;
exports.TextBox = TextBox;
exports.TextMarker = TextMarker;

Object.defineProperty(exports, '__esModule', { value: true });

})));
