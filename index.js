/**
 * Copyright (C) 2014 yanni4night.com
 * index.js
 *
 * changelog
 * 2014-12-20[13:26:12]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
(function(global, factory) {
  'use strict';

  if ('undefined' !== typeof module && module.exports) {
    module.exports = factory();
  } else if ('undefined' !== typeof define && define.amd) {
    define([], factory);
  } else if ('undefined' !== typeof define && define.cmd) {
    define(function(require, module, exports) {
      module.exports = factory();
    });
  } else {
    global.xconsole = factory();
  }
})(this, function() {
  'use strict';

  var expando = '__console-extra__' + (+new Date());
  var i, len;

  //todo reset
  // 'bold,dim,italic,underline,strikethrough'
  var colors = 'aqua,black,blue,fuchsia,gray,green,lime,maroon,navy,olive,orange,purple,red,silver,teal,white,yellow'.split(',');

  var styles = {
    bold: 'font-weight:bold',
    italic: 'font-style:italic',
    oblique: 'font-style:oblique',
    underline: 'text-decoration:underline',
    overline: 'text-decoration:overline',
    strikethrough: 'text-decoration:line-through'
  };

  for (i = 0, len = colors.length; i < len; ++i) {
    styles[colors[i]] = 'color:' + colors[i];
    styles[colors[i] + 'Bg'] = 'background-color:' + colors[i];
  }

  for (i = 12; i < 40; ++i) {
    styles['font' + i] = 'font-size:' + i + 'px';
  }

  for (i = 1; i < 100; ++i) {
    styles['margin' + i] = 'margin:' + i + 'px';
    styles['marginRight' + i] = 'margin-right:' + i + 'px';
    styles['marginTop' + i] = 'margin-top:' + i + 'px';
    styles['marginBottom' + i] = 'margin-bottom:' + i + 'px';
    styles['marginLeft' + i] = 'margin-left:' + i + 'px';
  }

  function defineStrGetter(name, fn) {
    String.prototype.__defineGetter__(name, fn);
  }

  String.prototype.joinStyle = function() {
    if (Array.isArray(this[expando])) {
      return this[expando].map(function(style) {
        return styles[style] || '';
      }).join(';');
    } else {
      return '';
    }
  };

  function defineStyle(style) {
    defineStrGetter(style, function() {
      var obj = (this instanceof String) ? this : (new String(this));

      obj[expando] = obj[expando] || [];

      var found;
      if (~(found = obj[expando].indexOf(style))) {
        obj[expando].splice(found, 1);
      }
      obj[expando].push(style);
      return obj;
    });
  }

  for (var e in styles) {
    defineStyle(e);
  }

  function nativeConsoleCall(fnName, args) {
    if ('undefined' !== typeof console && console[fnName]) {
      return console[fnName].apply(console, args);
    }
  }

  var xconsole = {
    getExpando: function() {
      return expando;
    }
  };
  xconsole.log = function() {
    var joined, params = [];
    var _arguments = Array.prototype.slice.call(arguments).map(function(item) {
      return item instanceof String ? item : String(item);
    });
    for (i = 0; i < _arguments.length; ++i) {
      params[i] = _arguments[i].joinStyle();
    }
    params.unshift([''].concat(_arguments).join('%c'));
    nativeConsoleCall('log', params);

    return this;
  };

  return xconsole;
});