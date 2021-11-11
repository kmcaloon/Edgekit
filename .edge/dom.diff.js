/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./.edge/__dom.diff.js":
/*!*****************************!*
  !*** ./.edge/__dom.diff.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reef_dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! .././reef/dom.js */ "./reef/dom.js");

      
      window.diff = _reef_dom_js__WEBPACK_IMPORTED_MODULE_0__.diff;
    

/***/ }),

/***/ "./node_modules/dom-parser/index.js":
/*!******************************************!*
  !*** ./node_modules/dom-parser/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DomParser = __webpack_require__(/*! ./lib/DomParser */ "./node_modules/dom-parser/lib/DomParser.js");
module.exports = DomParser;


/***/ }),

/***/ "./node_modules/dom-parser/lib/Dom.js":
/*!********************************************!*
  !*** ./node_modules/dom-parser/lib/Dom.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var
  tagRegExp          = /(<\/?[a-z][a-z0-9]*(?::[a-z][a-z0-9]*)?\s*(?:\s+[a-z0-9-_]+=(?:(?:'[\s\S]*?')|(?:"[\s\S]*?")))*\s*\/?>)|([^<]|<(?![a-z\/]))*/gi,
  attrRegExp         = /\s[a-z0-9-_]+\b(\s*=\s*('|")[\s\S]*?\2)?/gi,
  splitAttrRegExp    = /(\s[a-z0-9-_]+\b\s*)(?:=(\s*('|")[\s\S]*?\3))?/gi,
  startTagExp        = /^<[a-z]/,
  selfCloseTagExp    = /\/>$/,
  closeTagExp        = /^<\//,
  nodeNameExp        = /<\/?([a-z][a-z0-9]*)(?::([a-z][a-z0-9]*))?/i,
  attributeQuotesExp = /^('|")|('|")$/g,
  noClosingTagsExp   = /^(?:area|base|br|col|command|embed|hr|img|input|link|meta|param|source)/i;

var Node = __webpack_require__(/*! ./Node */ "./node_modules/dom-parser/lib/Node.js");

function findByRegExp(html, selector, onlyFirst) {

  var
    result        = [],
    tagsCount     = 0,
    tags          = html.match(tagRegExp),
    composing     = false,
    currentObject = null,
    matchingSelector,
    fullNodeName,
    selfCloseTag,
    attributes,
    attrBuffer,
    attrStr,
    buffer,
    tag;

  for (var i = 0, l = tags.length; i < l; i++) {

    tag = tags[i];
    fullNodeName = tag.match(nodeNameExp);

    matchingSelector = selector.test(tag);

    if (matchingSelector && !composing){
      composing = true;
    }

    if (composing) {

      if (startTagExp.test(tag)) {
        selfCloseTag = selfCloseTagExp.test(tag) || noClosingTagsExp.test(fullNodeName[1]);
        attributes = [];
        attrStr = tag.match(attrRegExp) || [];
        for (var aI = 0, aL = attrStr.length; aI < aL; aI++) {
          splitAttrRegExp.lastIndex = 0;
          attrBuffer = splitAttrRegExp.exec(attrStr[aI]);
          attributes.push({
            name: attrBuffer[1].trim(),
            value: (attrBuffer[2] || '').trim().replace(attributeQuotesExp, '')
          });
        }

        ((currentObject && currentObject.childNodes) || result).push(buffer = new Node({
          nodeType: 1, //element node
          nodeName: fullNodeName[1],
          namespace: fullNodeName[2],
          attributes: attributes,
          childNodes: [],
          parentNode: currentObject,
          startTag: tag,
          selfCloseTag: selfCloseTag
        }));
        tagsCount++;

        if (!onlyFirst && matchingSelector && currentObject){
          result.push(buffer);
        }

        if (selfCloseTag) {
          tagsCount--;
        }
        else {
          currentObject = buffer;
        }

      }
      else if (closeTagExp.test(tag)) {
        if (currentObject.nodeName == fullNodeName[1]){
          currentObject = currentObject.parentNode;
          tagsCount--;
        }
      }
      else {
        currentObject.childNodes.push(new Node({
          nodeType: 3,
          text: tag,
          parentNode: currentObject
        }));
      }

      if (tagsCount == 0) {
        composing = false;
        currentObject = null;

        if (onlyFirst){
          break;
        }
      }

    }

  }

  return onlyFirst ? result[0] || null : result;
}


function Dom(rawHTML) {
  this.rawHTML = rawHTML;
}

Dom.prototype.getElementsByClassName = function (className) {
  var selector = new RegExp('class=(\'|")(.*?\\s)?' + className + '(\\s.*?)?\\1');
  return findByRegExp(this.rawHTML, selector);
};

Dom.prototype.getElementsByTagName = function (tagName) {
  var selector = new RegExp('^<'+tagName, 'i');
  return findByRegExp(this.rawHTML, selector);
};

Dom.prototype.getElementById = function(id){
  var selector = new RegExp('id=(\'|")' + id + '\\1');
  return findByRegExp(this.rawHTML, selector, true);
};

Dom.prototype.getElementsByName = function(name){
    return this.getElementsByAttribute('name', name);
};

Dom.prototype.getElementsByAttribute = function(attr, value){
  var selector = new RegExp('\\s' + attr + '=(\'|")' + value + '\\1');
  return findByRegExp(this.rawHTML, selector);
};


module.exports = Dom;


/***/ }),

/***/ "./node_modules/dom-parser/lib/DomParser.js":
/*!**************************************************!*
  !*** ./node_modules/dom-parser/lib/DomParser.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Dom = __webpack_require__(/*! ./Dom */ "./node_modules/dom-parser/lib/Dom.js");

function DomParser() {
}

DomParser.prototype.parseFromString = function (html) {
  return new Dom(html);
};

module.exports = DomParser;

/***/ }),

/***/ "./node_modules/dom-parser/lib/Node.js":
/*!*********************************************!*
  !*** ./node_modules/dom-parser/lib/Node.js ***!
  \*********************************************/
/***/ ((module) => {

//https://developer.mozilla.org/en-US/docs/Web/API/Element


function Node(cfg) {

  this.namespace     = cfg.namespace || null;
  this.text          = cfg.text;
  this._selfCloseTag = cfg.selfCloseTag;


  Object.defineProperties(this, {
    nodeType: {
      value: cfg.nodeType
    },
    nodeName: {
      value: cfg.nodeType == 1 ? cfg.nodeName : '#text'
    },
    childNodes: {
      value: cfg.childNodes
    },
    firstChild: {
      get: function(){
        return this.childNodes[0] || null;
      }
    },
    lastChild: {
      get: function(){
        return this.childNodes[this.childNodes.length-1] || null;
      }
    },
    parentNode: {
      value: cfg.parentNode || null
    },
    attributes: {
      value: cfg.attributes || []
    },
    innerHTML: {
      get: function(){
        var
          result = '',
          cNode;
        for (var i = 0, l = this.childNodes.length; i < l; i++) {
          cNode = this.childNodes[i];
          result += cNode.nodeType === 3 ? cNode.text : cNode.outerHTML;
        }
        return result;
      }
    },
    outerHTML: {
      get: function(){
        if (this.nodeType != 3){
          var
            str,
            attrs = (this.attributes.map(function(elem){
              return elem.name + (elem.value ? '=' + '"'+ elem.value +'"' : '');
            }) || []).join(' '),
            childs = '';

          str = '<' + this.nodeName + (attrs ? ' ' + attrs : '') + (this._selfCloseTag ? '/' : '') + '>';

          if (!this._selfCloseTag){
            childs = (this._selfCloseTag ? '' : this.childNodes.map(function(child){
              return child.outerHTML;
            }) || []).join('');

            str += childs;
            str += '</' + this.nodeName + '>';
          }
        }
        else{
          str = this.textContent;
        }
        return str;
      }
    },
    textContent: {
      get: function(){
        if (this.nodeType == Node.TEXT_NODE){
          return this.text;
        }
        else{
          return this.childNodes.map(function(node){
            return node.textContent;
          }).join('').replace(/\x20+/g, ' ');
        }
      }
    }
  });
}

Node.prototype.getAttribute = function (attributeName) {
  for (var i = 0, l = this.attributes.length; i < l; i++) {
    if (this.attributes[i].name == attributeName) {
      return this.attributes[i].value;
    }
  }
  return null;
};

function searchElements(root, conditionFn, onlyFirst){
  var result = [];
  onlyFirst = !!onlyFirst;
  if (root.nodeType !== 3) {
    for (var i = 0, l = root.childNodes.length; i < l; i++) {
      if (root.childNodes[i].nodeType !== 3 && conditionFn(root.childNodes[i])) {
        result.push(root.childNodes[i]);
        if (onlyFirst){
          break;
        }
      }
      result = result.concat(searchElements(root.childNodes[i], conditionFn));
    }
  }
  return onlyFirst ? result[0] : result;
}

Node.prototype.getElementsByTagName = function (tagName) {
  return searchElements(this, function(elem){
    return elem.nodeName == tagName;
  })
};

Node.prototype.getElementsByClassName = function (className) {
  var expr = new RegExp('^(.*?\\s)?' + className + '(\\s.*?)?$');
  return searchElements(this, function(elem){
    return elem.attributes.length && expr.test(elem.getAttribute('class'));
  })
};

Node.prototype.getElementById = function (id) {
  return searchElements(this, function(elem){
    return elem.attributes.length && elem.getAttribute('id') == id;
  }, true)
};

Node.prototype.getElementsByName = function (name) {
  return searchElements(this, function(elem){
    return elem.attributes.length && elem.getAttribute('name') == name;
  })
};


Node.ELEMENT_NODE = 1;
Node.TEXT_NODE    = 3;

module.exports = Node;

/***/ }),

/***/ "./reef/dom.js":
/*!*********************!*
  !*** ./reef/dom.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "diff": () => /* binding */ diff,
/* harmony export */   "renderPolyps": () => /* binding */ renderPolyps
/* harmony export */ });
//import * as reefUtils from './utilities.js';

const reefUtils = __webpack_require__( /*! ./utilities.js */ "./reef/utilities.js" );


// Attributes that might be changed dynamically
var dynamicAttributes = ['checked', 'selected', 'value'];

/**
 * Create an array map of style names and values
 * @param  {String} styles The styles
 * @return {Array}         The styles
 */
var getStyleMap = function (styles) {
	return styles.split(';').reduce(function (arr, style) {
		var col = style.indexOf(':');
		if (col) {
			arr.push({
				name: style.slice(0, col).trim(),
				value: style.slice(col + 1).trim()
			});
		}
		return arr;
	}, []);
};

/**
 * Remove styles from an element
 * @param  {Node}  elem   The element
 * @param  {Array} styles The styles to remove
 */
var removeStyles = function (elem, styles) {
	styles.forEach(function (style) {
		elem.style[style] = '';
	});
};

/**
 * Add or updates styles on an element
 * @param  {Node}  elem   The element
 * @param  {Array} styles The styles to add or update
 */
var changeStyles = function (elem, styles) {
	styles.forEach(function (style) {
		elem.style[style.name] = style.value;
	});
};

/**
 * Diff existing styles from new ones
 * @param  {Node}   elem   The element
 * @param  {String} styles The styles the element should have
 */
var diffStyles = function (elem, styles) {

	// Get style map
	var styleMap = getStyleMap(styles);

	// Get styles to remove
	var remove = Array.prototype.filter.call(elem.style, function (style) {
		var findStyle = reefUtils.find(styleMap, function (newStyle) {
			return newStyle.name === style && newStyle.value === elem.style[style];
		});
		return findStyle === null;
	});

	// Add and remove styles
	removeStyles(elem, remove);
	changeStyles(elem, styleMap);

};

/**
 * Add attributes to an element
 * @param {Node}  elem The element
 * @param {Array} atts The attributes to add
 */
var addAttributes = function (elem, atts) {
	atts.forEach(function (attribute) {
		// If the attribute is a class, use className
		// Else if it's style, diff and update styles
		// Otherwise, set the attribute
		if (attribute.att === 'class') {
			elem.className = attribute.value;
		} else if (attribute.att === 'style') {
			diffStyles(elem, attribute.value);
		} else {
			if (attribute.att in elem) {
				try {
					elem[attribute.att] = attribute.value;
					if (!elem[attribute.att] && elem[attribute.att] !== 0) {
						elem[attribute.att] = true;
					}
				} catch (e) {}
			}
			try {
				elem.setAttribute(attribute.att, attribute.value);
			} catch (e) {}
		}
	});
};

/**
 * Remove attributes from an element
 * @param {Node}  elem The element
 * @param {Array} atts The attributes to remove
 */
var removeAttributes = function (elem, atts) {
	atts.forEach(function (attribute) {
		// If the attribute is a class, use className
		// Else if it's style, remove all styles
		// Otherwise, use removeAttribute()
		if (attribute.att === 'class') {
			elem.className = '';
		} else if (attribute.att === 'style') {
			removeStyles(elem, reefUtils.arrayFrom(elem.style));
		} else {
			if (attribute.att in elem) {
				try {
					elem[attribute.att] = '';
				} catch (e) {}
			}
			try {
				elem.removeAttribute(attribute.att);
			} catch (e) {}
		}
	});
};

/**
 * Create an object with the attribute name and value
 * @param  {String} name  The attribute name
 * @param  {*}      value The attribute value
 * @return {Object}       The object of attribute details
 */
var getAttribute = function (name, value) {
	return {
		att: name,
		value: value
	};
};

/**
 * Get the dynamic attributes for a node
 * @param  {Node}    node       The node
 * @param  {Array}   atts       The static attributes
 * @param  {Boolean} isTemplate If true, these are for the template
 */
var getDynamicAttributes = function (node, atts, isTemplate) {
	dynamicAttributes.forEach(function (prop) {
		if ((!node[prop] && node[prop] !== 0) || (isTemplate && node.tagName.toLowerCase() === 'option' && prop === 'selected') || (isTemplate && node.tagName.toLowerCase() === 'select' && prop === 'value')) return;
		atts.push(getAttribute(prop, node[prop]));
	});
};

/**
 * Get base attributes for a node
 * @param  {Node} node The node
 * @return {Array}     The node's attributes
 */
var getBaseAttributes = function (node, isTemplate) {
	return Array.prototype.reduce.call(node.attributes, function (arr, attribute) {
		if ((dynamicAttributes.indexOf(attribute.name) < 0 || (isTemplate && attribute.name === 'selected')) && (attribute.name.length > 7 ? attribute.name.slice(0, 7) !== 'default' : true)) {
			arr.push(getAttribute(attribute.name, attribute.value));
		}
		return arr;
	}, []);
};

/**
 * Create an array of the attributes on an element
 * @param  {Node}    node       The node to get attributes from
 * @return {Array}              The attributes on an element as an array of key/value pairs
 */
var getAttributes = function (node, isTemplate) {
	if (node.nodeType !== 1) return [];
	var atts = getBaseAttributes(node, isTemplate);
	getDynamicAttributes(node, atts, isTemplate);
	return atts;
};

/**
 * Diff the attributes on an existing element versus the template
 * @param  {Object} template The new template
 * @param  {Object} elem     The existing DOM node
 */
var diffAtts = function (template, elem) {

	var templateAtts = getAttributes(template, true);
	var elemAtts = getAttributes(elem);

	// Get attributes to remove
	var remove = elemAtts.filter(function (att) {
		if (dynamicAttributes.indexOf(att.att) > -1) return false;
		var getAtt = reefUtils.find(templateAtts, function (newAtt) {
			return att.att === newAtt.att;
		});
		return getAtt === null;
	});

	// Get attributes to change
	var change = templateAtts.filter(function (att) {
		var getAtt = reefUtils.find(elemAtts, function (elemAtt) {
			return att.att === elemAtt.att;
		});
		return getAtt === null || getAtt.value !== att.value;
	});

	// Add/remove any required attributes
	addAttributes(elem, change);
	removeAttributes(elem, remove);

};

/**
 * Get the type for a node
 * @param  {Node}   node The node
 * @return {String}      The type
 */
var getNodeType = function (node) {
	return node.nodeType === 3 ? 'text' : (node.nodeType === 8 ? 'comment' : node.tagName.toLowerCase());
};

/**
 * Get the content from a node
 * @param  {Node}   node The node
 * @return {String}      The type
 */
var getNodeContent = function (node) {
	return node.childNodes && node.childNodes.length > 0 ? null : node.textContent;
};

/**
 * Add default attributes to a newly created node
 * @param  {Node}   node The node
 */
var addDefaultAtts = function (node) {

	// Only run on elements
	if (node.nodeType !== 1) return;

	// Check for default attributes
	// Add/remove as needed
	Array.prototype.forEach.call(node.attributes, function (attribute) {
		if (attribute.name.length < 8 || attribute.name.slice(0, 7) !== 'default') return;
		addAttributes(node, [getAttribute(attribute.name.slice(7).toLowerCase(), attribute.value)]);
		removeAttributes(node, [getAttribute(attribute.name, attribute.value)]);
	});

	// If there are child nodes, recursively check them
	if (node.childNodes) {
		Array.prototype.forEach.call(node.childNodes, function (childNode) {
			addDefaultAtts(childNode);
		});
	}

};

/**
 * Diff the existing DOM node versus the template
 * @param  {Array} template The template HTML
 * @param  {Node}  elem     The current DOM HTML
 * @param  {Array} polyps   Attached components for this element
 */
var diff = function (template, elem, polyps = [] ) {

	// Get arrays of child nodes
	var domMap = reefUtils.arrayFrom(elem.childNodes);
	var templateMap = reefUtils.arrayFrom(template.childNodes);

	// If extra elements in DOM, remove them
	var count = domMap.length - templateMap.length;
	if (count > 0) {
		for (; count > 0; count--) {
			domMap[domMap.length - count].parentNode.removeChild(domMap[domMap.length - count]);
		}
	}

	// Diff each item in the templateMap
	templateMap.forEach(function (node, index) {

		// If element doesn't exist, create it
		if (!domMap[index]) {
			addDefaultAtts(node);
			elem.appendChild(node.cloneNode(true));
			return;
		}

		// If element is not the same type, replace it with new element
		if (getNodeType(node) !== getNodeType(domMap[index])) {
			domMap[index].parentNode.replaceChild(node.cloneNode(true), domMap[index]);
			return;
		}

		// If attributes are different, update them
		diffAtts(node, domMap[index]);

		// If element is an attached component, skip it
		var isPolyp = polyps.filter(function (polyp) {
			return node.nodeType !== 3 && reefUtils.matches(node, polyp);
		});
		if (isPolyp.length > 0) return;

		// If content is different, update it
		var templateContent = getNodeContent(node);
		if (templateContent && templateContent !== getNodeContent(domMap[index])) {
			domMap[index].textContent = templateContent;
		}

		// If target element should be empty, wipe it
		if (domMap[index].childNodes.length > 0 && node.childNodes.length < 1) {
			domMap[index].innerHTML = '';
			return;
		}

		// If element is empty and shouldn't be, build it up
		// This uses a document fragment to minimize reflows
		if (domMap[index].childNodes.length < 1 && node.childNodes.length > 0) {
			var fragment = document.createDocumentFragment();
			diff(node, fragment, polyps);
			domMap[index].appendChild(fragment);
			return;
		}

		// If there are existing child elements that need to be modified, diff them
		if (node.childNodes.length > 0) {
			diff(node, domMap[index], polyps);
		}

	});

};

/**
 * If there are linked Reefs, render them, too
 * @param  {Array} polyps Attached Reef components
 */
var renderPolyps = function (polyps, reef) {
	if (!polyps) return;
	polyps.forEach(function (coral) {
		if (coral.attached.indexOf(reef) > -1) return reefUtils.err('' + reef.elem + ' has attached nodes that it is also attached to, creating an infinite loop.');
		if ('render' in coral) coral.render();
	});
};




/***/ }),

/***/ "./reef/utilities.js":
/*!***************************!*
  !*** ./reef/utilities.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setDebug": () => /* binding */ setDebug,
/* harmony export */   "matches": () => /* binding */ matches,
/* harmony export */   "arrayFrom": () => /* binding */ arrayFrom,
/* harmony export */   "trueTypeOf": () => /* binding */ trueTypeOf,
/* harmony export */   "err": () => /* binding */ err,
/* harmony export */   "clone": () => /* binding */ clone,
/* harmony export */   "debounceRender": () => /* binding */ debounceRender,
/* harmony export */   "dataHandler": () => /* binding */ dataHandler,
/* harmony export */   "find": () => /* binding */ find,
/* harmony export */   "makeProxy": () => /* binding */ makeProxy,
/* harmony export */   "stringToHTML": () => /* binding */ stringToHTML
/* harmony export */ });
/* harmony import */ var dom_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dom-parser */ "./node_modules/dom-parser/index.js");
/* harmony import */ var dom_parser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dom_parser__WEBPACK_IMPORTED_MODULE_0__);


// If true, debug mode is enabled
var debug = false;

/**
 * Turn debug mode on or off
 * @param  {Boolean} on If true, turn debug mode on
 */
var setDebug = function (on) {
	debug = on ? true : false;
};

// Check browser support
var support = (function () {
	if (! (dom_parser__WEBPACK_IMPORTED_MODULE_0___default())) return false;
	var parser = new (dom_parser__WEBPACK_IMPORTED_MODULE_0___default())();
	try {
		parser.parseFromString('x', 'text/html');
	} catch(err) {
		return false;
	}
	return true;
})();

/**
 * Check if element has selector
 * @param  {Node}    elem     The element
 * @param  {String}  selector The selector
 * @return {Boolean}          If true, the element has the selector
 */
var matches = function (elem, selector) {
	return (Element.prototype.matches && elem.matches(selector)) || (Element.prototype.msMatchesSelector && elem.msMatchesSelector(selector)) || (Element.prototype.webkitMatchesSelector && elem.webkitMatchesSelector(selector));
};

/**
 * Convert an iterable object into an array
 * @param  {*}     arr The NodeList, HTMLCollection, etc. to convert into an array
 * @return {Array}     The array
 */
var arrayFrom = function (arr) {
	return Array.prototype.slice.call(arr);
};

/**
 * More accurately check the type of a JavaScript object
 * @param  {Object} obj The object
 * @return {String}     The object type
 */
var trueTypeOf = function (obj) {
	return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};

/**
 * Throw an error message
 * @param  {String} msg The error message
 */
var err = function (msg) {
	if (debug) {
		throw new Error(msg);
	}
};

/**
 * Create an immutable copy of an object and recursively encode all of its data
 * @param  {*}       obj       The object to clone
 * @param  {Boolean} allowHTML If true, allow HTML in data strings
 * @return {*}                 The immutable, encoded object
 */
var clone = function (obj, allowHTML) {

	// Get the object type
	var type = trueTypeOf(obj);

	// If an object, loop through and recursively encode
	if (type === 'object') {
		var cloned = {};
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				cloned[key] = clone(obj[key], allowHTML);
			}
		}
		return cloned;
	}

	// If an array, create a new array and recursively encode
	if (type === 'array') {
		return obj.map(function (item) {
			return clone(item, allowHTML);
		});
	}

	// If the data is a string, encode it
	// https://portswigger.net/web-security/cross-site-scripting/preventing
	if (type === 'string' && !allowHTML) {
		return obj.replace(/[^\w-_. ]/gi, function(c){
			return '&#' + c.charCodeAt(0) + ';';
		}).replace(/javascript:/gi, '');
	}

	// Otherwise, return object as is
	return obj;

};

/**
 * Debounce rendering for better performance
 * @param  {Constructor} instance The current instantiation
 */
var debounceRender = function (instance) {

	// If there's a pending render, cancel it
	if (instance.debounce) {
		window.cancelAnimationFrame(instance.debounce);
	}

	// Setup the new render to run at the next animation frame
	instance.debounce = window.requestAnimationFrame(function () {
		instance.render();
	});

};

/**
 * Create settings and getters for data Proxy
 * @param  {Constructor} instance The current instantiation
 * @return {Object}               The setter and getter methods for the Proxy
 */
var dataHandler = function (instance) {
	return {
		get: function (obj, prop) {
			if (['object', 'array'].indexOf(trueTypeOf(obj[prop])) > -1) {
				return new Proxy(obj[prop], dataHandler(instance));
			}
			return obj[prop];
		},
		set: function (obj, prop, value) {
			if (obj[prop] === value) return true;
			obj[prop] = value;
			debounceRender(instance);
			return true;
		}
	};
};

/**
 * Find the first matching item in an array
 * @param  {Array}    arr      The array to search in
 * @param  {Function} callback The callback to run to find a match
 * @return {*}                 The matching item
 */
var find = function (arr, callback) {
	var matches = arr.filter(callback);
	if (matches.length < 1) return null;
	return matches[0];
};

/**
 * Create a proxy from a data object
 * @param  {Object}     options  The options object
 * @param  {Contructor} instance The current Reef instantiation
 * @return {Proxy}               The Proxy
 */
var makeProxy = function (options, instance) {
	if (options.setters) return !options.store ? options.data : null;
	return options.data && !options.store ? new Proxy(options.data, dataHandler(instance)) : null;
};

/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
var stringToHTML = function (str) {

	// If DOMParser is supported, use it
	if (support) {

		// Create document
		var parser = new (dom_parser__WEBPACK_IMPORTED_MODULE_0___default())();
		var doc = parser.parseFromString(str, 'text/html');

		// If there are items in the head, move them to the body
		if (doc.head && doc.head.childNodes && doc.head.childNodes.length > 0) {
			arrayFrom(doc.head.childNodes).reverse().forEach(function (node) {
				doc.body.insertBefore(node, doc.body.firstChild);
			});
		}

		return doc.body || document.createElement('body');

	}

	// Otherwise, fallback to old-school method
	var dom = document.createElement('div');
	dom.innerHTML = str;
	return dom;

};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./.edge/__dom.diff.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;