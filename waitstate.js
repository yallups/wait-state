(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var template = [
  '<div class="wait-state-inner">',
    '<div class="wait-state-message"></div>',
    '<div class="wait-state-symbol"></div>',
  '</div>'
].join('');

var WAIT_STATE_CLASS = 'wait-state';
var WAIT_STATE_QUERY_SELECTOR = '.'+WAIT_STATE_CLASS;
var WAIT_STATE_PARENT_CLASS = 'has-'+WAIT_STATE_CLASS;
var WAIT_STATE_PARENT_POS_CLASS = WAIT_STATE_PARENT_CLASS+'-position';
var WAIT_STATE_PARENT_QUERY_SELECTOR = '.'+WAIT_STATE_PARENT_CLASS;

var isElement = require('isElement');
var isObject = require('amp-is-object');
//var domify =  require('domify');
var addClass = require('amp-add-class');
var removeClass = require('amp-remove-class');
var cssHelper = require('css-sheet-injector');

var defaults = {
  message: 'Loading...',
  body   : document.querySelector('body'),
  template: template
};

var waitstate = window.ws = module.exports;

var hasInitialized = false;

waitstate.setDefault = function (name, value) {
  if (name === void 0 || value === void 0) return;
  if (!defaults.hasOwnProperty(name)) return;
  defaults[name] = value;
};

waitstate.setDefaults = function (opts) {
  if (!isObject(opts)) return;

  for (var k in opts) {
    this.setDefault(k, opts[k]);
  }
};

/**
 * Starts wait state.
 * if container is given, append to container.
 * If no container specified then enable on entire body.
 * @param {HTMLElement|String} container can be element, query selector or message
 * @param {String} message defaults to "Loading..." or default message
 */
waitstate.start = function (container, message) {
  var element, messageNode;
  init();

  message = message || defaults.message;

  if (!(isElement(container))) {
    container = document.querySelector(container) || container;
  }
  if (!(isElement(container))) {
    message = container || defaults.message;
    container = defaults.body;
  }

  element = document.createElement('div'); // This should be the appropriate child node of the container... li, td etc
  element.innerHTML = defaults.template;
  addClass(element, WAIT_STATE_CLASS);
  if (messageNode = element.querySelector('.'+WAIT_STATE_CLASS+'-message')) messageNode.innerText = message;

  if (isFixedPosition(container) &&  container !== defaults.body) {
    addClass(container, WAIT_STATE_PARENT_POS_CLASS);
  }
  addClass(container, WAIT_STATE_PARENT_CLASS);

  container.appendChild(element);

  return stop.bind(this, container, element);
};

/**
 * removes waitstate or all waitstates
 * @param {HTMLElement|String} [container] - Specifies by element or query which container to remove wait state on. If not supplied then all wait-states will be removed.
 */
waitstate.stop = function (container) {
  var containers;
  if (!(isElement(container))) {
    container = document.querySelector(container) || container;
  }
  if ((isElement(container))) {
    return stop(container)
  } else {
    containers = document.querySelectorAll(WAIT_STATE_PARENT_QUERY_SELECTOR);
  }

  for (var i = 0; i < containers.length; i++) {
    stop(containers.item(i));
  }
};

function init() {
  if (hasInitialized) return;

  var sheet = cssHelper.injectSheet();
  // TODO: put style in sheet

  hasInitialized = true;
}

function stop (container, childEl) {
  childEl = childEl || container.querySelector(WAIT_STATE_QUERY_SELECTOR);
  removeClass(container, WAIT_STATE_PARENT_CLASS, WAIT_STATE_PARENT_POS_CLASS);
  childEl && container.removeChild(childEl);
}

function getStyle (el, prop) {
  if (el.currentStyle) return el.currentStyle[prop];

  return getComputedStyle(el, null)[prop];
}

function isFixedPosition (el) {
  if (!isElement(el)) return false;
  return getStyle(el, 'position') !== 'fixed'
}
},{"amp-add-class":2,"amp-is-object":7,"amp-remove-class":11,"css-sheet-injector":12,"isElement":13}],2:[function(require,module,exports){
var hasClass = require('amp-has-class');
var isString = require('amp-is-string');
var isArray = require('amp-is-array');
var trim = require('amp-trim');
var slice = Array.prototype.slice;
var cleanup = /\s{2,}/g;
var ws = /\s+/;


module.exports = function addClass(el, cls) {
    if (arguments.length === 2 && isString(cls)) {
        cls = trim(cls).split(ws);
    } else {
        cls = isArray(cls) ? cls : slice.call(arguments, 1);    
    }
    // optimize for best, most common case
    if (cls.length === 1 && el.classList) {
        if (cls[0]) el.classList.add(cls[0]);
        return el;
    }
    var toAdd = [];
    var i = 0;
    var l = cls.length;
    var item;
    var clsName = el.className;
    // see if we have anything to add
    for (; i < l; i++) {
        item = cls[i];
        if (item && !hasClass(clsName, item)) {
            toAdd.push(item);
        }
    }
    if (toAdd.length) {
        el.className = trim((clsName + ' ' + toAdd.join(' ')).replace(cleanup, ' '));
    }
    return el;
};

},{"amp-has-class":3,"amp-is-array":4,"amp-is-string":5,"amp-trim":6}],3:[function(require,module,exports){
var isString = require('amp-is-string');
var whitespaceRE = /[\t\r\n\f]/g;


// note: this is jQuery's approach
module.exports = function hasClass(el, cls) {
    var cName = (isString(el) ? el : el.className).replace(whitespaceRE, ' ');
    return (' ' + cName + ' ').indexOf(' ' + cls + ' ') !== -1;
};

},{"amp-is-string":5}],4:[function(require,module,exports){
var toString = Object.prototype.toString;
var nativeIsArray = Array.isArray;


module.exports = nativeIsArray || function isArray(obj) {
    return toString.call(obj) === '[object Array]';
};

},{}],5:[function(require,module,exports){
var toString = Object.prototype.toString;


module.exports = function isString(obj) {
    return toString.call(obj) === '[object String]';
};

},{}],6:[function(require,module,exports){
var trimRE = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;


module.exports = function trim(string) {
    return string.replace(trimRE, '');
};

},{}],7:[function(require,module,exports){
module.exports = function isObject(obj) {
    var type = typeof obj;
    return !!obj && (type === 'function' || type === 'object');
};

},{}],8:[function(require,module,exports){
module.exports=require(4)
},{}],9:[function(require,module,exports){
module.exports=require(5)
},{}],10:[function(require,module,exports){
module.exports=require(6)
},{}],11:[function(require,module,exports){
var isString = require('amp-is-string');
var isArray = require('amp-is-array');
var trim = require('amp-trim');
var slice = Array.prototype.slice;
var cleanup = /\s{2,}/g;
var ws = /\s+/;


module.exports = function removeClass(el, cls) {
    if (arguments.length === 2 && isString(cls)) {
        cls = trim(cls).split(ws);
    } else {
        cls = isArray(cls) ? cls : slice.call(arguments, 1);    
    }
    // optimize for best, most common case
    if (cls.length === 1 && el.classList) {
        if (cls[0]) el.classList.remove(cls[0]);
        return el;
    }
    // store two copies
    var clsName = ' ' + el.className + ' ';
    var result = clsName;
    var current;
    var start;
    for (var i = 0, l = cls.length; i < l; i++) {
        current = cls[i];
        start = current ? result.indexOf(' ' + current + ' ') : -1;
        if (start !== -1) {
            start += 1;
            result = result.slice(0, start) + result.slice(start + current.length);
        }
    }
    // only write if modified
    if (clsName !== result) {
        el.className = trim(result.replace(cleanup, ' '));
    }
    return el;
};

},{"amp-is-array":8,"amp-is-string":9,"amp-trim":10}],12:[function(require,module,exports){
module.exports = {
  injectSheet: makeSheet,
  addCSSRule: addCSSRule
};

function makeSheet () {
  var sheet;
  var head = document.head;
  var style = document.createElement("style");

  // WebKit hack
  style.appendChild(document.createTextNode(""));

  head.insertBefore(style, head.firstElementChild);

  sheet = style.sheet;
  sheet.addCSSRule = addCSSRule.bind(sheet, sheet);
  return sheet;
}

function addCSSRule(sheet, selector, rules, index) {
  if("insertRule" in sheet) {
    sheet.insertRule(selector + "{" + rules + "}", index);
  }
  else if("addRule" in sheet) {
    sheet.addRule(selector, rules, index);
  }
}
},{}],13:[function(require,module,exports){
module.exports = function(e) {
  if (!e) return false;

  if (typeof HTMLElement === "object") return e instanceof HTMLElement;

  return typeof e === "object" && e.nodeType === 1 && typeof e.nodeName==="string";
};
},{}]},{},[1])