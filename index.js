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
  var i, j, len;

  function caseCamel(str) {
    return str.replace(/\-([a-z])/g, function(m, n) {
      return n.toUpperCase();
    });
  }



  var Style = {
    styles: {
      none: '',
      bold: 'font-weight:bold',
      italic: 'font-style:italic',
      oblique: 'font-style:oblique',
      underline: 'text-decoration:underline',
      overline: 'text-decoration:overline',
      strikethrough: 'text-decoration:line-through'
    },
    initialize: function() {
      this.colors();
      this.font();
      this.boxes();
    },
    setStyle: function(name, style) {
      this.styles[name] = style;
    },
    getStyle: function(name, style) {
      return this.styles[name];
    },
    getStyles: function(){
      return this.styles;
    },
    colors: function() {
      var colors = 'aqua,black,blue,fuchsia,gray,green,lime,maroon,navy,olive,orange,purple,red,silver,teal,white,yellow'.split(',');
      for (i = 0, len = colors.length; i < len; ++i) {
        this.setStyle(colors[i], 'color:' + colors[i]);
        this.setStyle(caseCamel('bg-' + colors[i]), 'background-color:' + colors[i]);
      }
    },
    font: function() {
      //font size:12~100px
      for (i = 12; i <= 100; ++i) {
        this.setStyle('fontSize' + i, 'font-size:' + i + 'px');
      }
    },
    boxes: function() {
      //boxes:margin/padding 1~100px
      var boxes = ['margin', 'margin-right', 'margin-left', 'margin-top', 'margin-bottom', 'padding', 'padding-right', 'padding-left', 'padding-top', 'padding-bottom'];
      for (i = 1; i <= 100; ++i) {
        for (j = 0, len = boxes.length; j < len; ++j) {
          this.setStyle(caseCamel(boxes[j]) + i, boxes[j] + ':' + i + 'px');
        }
      }
    }
  };

  Style.initialize();


  function defineStrGetter(name, fn) {
    String.prototype.__defineGetter__(name, fn);
  }

  String.prototype.joinStyle = function() {
    if (Array.isArray(this[expando])) {
      return this[expando].map(function(style) {
        return Style.styles[style] || styles.none;
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

  for (var e in Style.styles) {
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
    },
    setStyle: function() {
      Style.setStyle.apply(Style, arguments);
    },
    getStyle: function() {
      Style.getStyle.apply(Style, arguments);
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