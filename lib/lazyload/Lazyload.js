"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forceCheck = exports["default"] = exports.lazyload = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _event = require("./utils/event");

var _scrollParent = _interopRequireDefault(require("./utils/scrollParent"));

var _debounce = _interopRequireDefault(require("./utils/debounce"));

var _throttle = _interopRequireDefault(require("./utils/throttle"));

var _decorator = _interopRequireDefault(require("./decorator"));

/**
 * react-lazyload
 */
var defaultBoundingClientRect = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
};
var LISTEN_FLAG = 'data-lazyload-listened';
var listeners = [];
var pending = []; // try to handle passive events

var passiveEventSupported = false;

try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      passiveEventSupported = true;
    }
  });
  window.addEventListener('test', null, opts);
} catch (e) {} // if they are supported, setup the optional params
// IMPORTANT: FALSE doubles as the default CAPTURE value!


var passiveEvent = passiveEventSupported ? {
  capture: false,
  passive: true
} : false;
/**
 * Check if `component` is visible in overflow container `parent`
 * @param  {node} component React component
 * @param  {node} parent    component's scroll parent
 * @return {bool}
 */

var checkOverflowVisible = function checkOverflowVisible(component, parent) {
  var node = _reactDom["default"].findDOMNode(component);

  var parentTop;
  var parentHeight;

  try {
    var _parent$getBoundingCl = parent.getBoundingClientRect();

    parentTop = _parent$getBoundingCl.top;
    parentHeight = _parent$getBoundingCl.height;
  } catch (e) {
    parentTop = defaultBoundingClientRect.top;
    parentHeight = defaultBoundingClientRect.height;
  }

  var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight; // calculate top and height of the intersection of the element's scrollParent and viewport

  var intersectionTop = Math.max(parentTop, 0); // intersection's top relative to viewport

  var intersectionHeight = Math.min(windowInnerHeight, parentTop + parentHeight) - intersectionTop; // height
  // check whether the element is visible in the intersection

  var top;
  var height;

  try {
    var _node$getBoundingClie = node.getBoundingClientRect();

    top = _node$getBoundingClie.top;
    height = _node$getBoundingClie.height;
  } catch (e) {
    top = defaultBoundingClientRect.top;
    height = defaultBoundingClientRect.height;
  }

  var offsetTop = top - intersectionTop; // element's top relative to intersection

  var offsets = Array.isArray(component.props.offset) ? component.props.offset : [component.props.offset, component.props.offset]; // Be compatible with previous API

  return offsetTop - offsets[0] <= intersectionHeight && offsetTop + height + offsets[1] >= 0;
};
/**
 * Check if `component` is visible in document
 * @param  {node} component React component
 * @return {bool}
 */


var checkNormalVisible = function checkNormalVisible(component) {
  var node = _reactDom["default"].findDOMNode(component); // If this element is hidden by css rules somehow, it's definitely invisible


  if (!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)) return false;
  var top;
  var elementHeight;

  try {
    var _node$getBoundingClie2 = node.getBoundingClientRect();

    top = _node$getBoundingClie2.top;
    elementHeight = _node$getBoundingClie2.height;
  } catch (e) {
    top = defaultBoundingClientRect.top;
    elementHeight = defaultBoundingClientRect.height;
  }

  var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;
  var offsets = Array.isArray(component.props.offset) ? component.props.offset : [component.props.offset, component.props.offset]; // Be compatible with previous API

  return top - offsets[0] <= windowInnerHeight && top + elementHeight + offsets[1] >= 0;
};
/**
 * Detect if element is visible in viewport, if so, set `visible` state to true.
 * If `once` prop is provided true, remove component as listener after checkVisible
 *
 * @param  {React} component   React component that respond to scroll and resize
 */


var checkVisible = function checkVisible(component) {
  var node = _reactDom["default"].findDOMNode(component);

  if (!(node instanceof HTMLElement)) {
    return;
  }

  var parent = (0, _scrollParent["default"])(node);
  var isOverflow = component.props.overflow && parent !== node.ownerDocument && parent !== document && parent !== document.documentElement;
  var visible = isOverflow ? checkOverflowVisible(component, parent) : checkNormalVisible(component);

  if (visible) {
    // Avoid extra render if previously is visible
    if (!component.visible) {
      if (component.props.once) {
        pending.push(component);
      }

      component.visible = true;
      component.forceUpdate();
    }
  } else if (!(component.props.once && component.visible)) {
    component.visible = false;

    if (component.props.unmountIfInvisible) {
      component.forceUpdate();
    }
  }
};

var purgePending = function purgePending() {
  pending.forEach(function (component) {
    var index = listeners.indexOf(component);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  });
  pending = [];
};

var lazyLoadHandler = function lazyLoadHandler() {
  for (var i = 0; i < listeners.length; ++i) {
    var listener = listeners[i];
    checkVisible(listener);
  } // Remove `once` component in listeners


  purgePending();
}; // Depending on component's props


exports.forceCheck = lazyLoadHandler;
var delayType;
var finalLazyLoadHandler = null;

var isString = function isString(string) {
  return typeof string === 'string';
};

var LazyLoad =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(LazyLoad, _Component);

  function LazyLoad(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, LazyLoad);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LazyLoad).call(this, props));
    _this.visible = false;
    return _this;
  }

  (0, _createClass2["default"])(LazyLoad, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // It's unlikely to change delay type on the fly, this is mainly
      // designed for tests
      var scrollport = window;
      var scrollContainer = this.props.scrollContainer;

      if (scrollContainer) {
        if (isString(scrollContainer)) {
          scrollport = scrollport.document.querySelector(scrollContainer);
        }
      }

      var needResetFinalLazyLoadHandler = this.props.debounce !== undefined && delayType === 'throttle' || delayType === 'debounce' && this.props.debounce === undefined;

      if (needResetFinalLazyLoadHandler) {
        (0, _event.off)(scrollport, 'scroll', finalLazyLoadHandler, passiveEvent);
        (0, _event.off)(window, 'resize', finalLazyLoadHandler, passiveEvent);
        finalLazyLoadHandler = null;
      }

      if (!finalLazyLoadHandler) {
        if (this.props.debounce !== undefined) {
          finalLazyLoadHandler = (0, _debounce["default"])(lazyLoadHandler, typeof this.props.debounce === 'number' ? this.props.debounce : 300);
          delayType = 'debounce';
        } else if (this.props.throttle !== undefined) {
          finalLazyLoadHandler = (0, _throttle["default"])(lazyLoadHandler, typeof this.props.throttle === 'number' ? this.props.throttle : 300);
          delayType = 'throttle';
        } else {
          finalLazyLoadHandler = lazyLoadHandler;
        }
      }

      if (this.props.overflow) {
        var parent = (0, _scrollParent["default"])(_reactDom["default"].findDOMNode(this));

        if (parent && typeof parent.getAttribute === 'function') {
          var listenerCount = 1 + +parent.getAttribute(LISTEN_FLAG);

          if (listenerCount === 1) {
            parent.addEventListener('scroll', finalLazyLoadHandler, passiveEvent);
          }

          parent.setAttribute(LISTEN_FLAG, listenerCount);
        }
      } else if (listeners.length === 0 || needResetFinalLazyLoadHandler) {
        var _this$props = this.props,
            scroll = _this$props.scroll,
            resize = _this$props.resize;

        if (scroll) {
          (0, _event.on)(scrollport, 'scroll', finalLazyLoadHandler, passiveEvent);
        }

        if (resize) {
          (0, _event.on)(window, 'resize', finalLazyLoadHandler, passiveEvent);
        }
      }

      listeners.push(this);
      checkVisible(this);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return this.visible;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.overflow) {
        var parent = (0, _scrollParent["default"])(_reactDom["default"].findDOMNode(this));

        if (parent && typeof parent.getAttribute === 'function') {
          var listenerCount = +parent.getAttribute(LISTEN_FLAG) - 1;

          if (listenerCount === 0) {
            parent.removeEventListener('scroll', finalLazyLoadHandler, passiveEvent);
            parent.removeAttribute(LISTEN_FLAG);
          } else {
            parent.setAttribute(LISTEN_FLAG, listenerCount);
          }
        }
      }

      var index = listeners.indexOf(this);

      if (index !== -1) {
        listeners.splice(index, 1);
      }

      if (listeners.length === 0) {
        (0, _event.off)(window, 'resize', finalLazyLoadHandler, passiveEvent);
        (0, _event.off)(window, 'scroll', finalLazyLoadHandler, passiveEvent);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return this.visible ? this.props.children : this.props.placeholder ? this.props.placeholder : _react["default"].createElement("div", {
        style: {
          height: this.props.height
        },
        className: "lazyload-placeholder"
      });
    }
  }]);
  return LazyLoad;
}(_react.Component);

LazyLoad.propTypes = {
  once: _propTypes["default"].bool,
  height: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  offset: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].arrayOf(_propTypes["default"].number)]),
  overflow: _propTypes["default"].bool,
  resize: _propTypes["default"].bool,
  scroll: _propTypes["default"].bool,
  children: _propTypes["default"].node,
  throttle: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].bool]),
  debounce: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].bool]),
  placeholder: _propTypes["default"].node,
  scrollContainer: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  unmountIfInvisible: _propTypes["default"].bool
};
LazyLoad.defaultProps = {
  once: false,
  offset: 0,
  overflow: false,
  resize: false,
  scroll: true,
  unmountIfInvisible: false
};
var lazyload = _decorator["default"];
exports.lazyload = lazyload;
var _default = LazyLoad;
exports["default"] = _default;