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
 * @return {Function} Callback to stop this particular waitstate.
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

  element = document.createElement('div'); // TODO: This should be the appropriate child node of the container... li, td etc
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
