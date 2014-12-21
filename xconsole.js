/**
 * Copyright (C) 2014 yanni4night.com
 * xconsole.js
 *
 * changelog
 * 2014-12-20[13:26:12]:revised
 * 2014-12-21[14:26:01]:portable to opera(presto)
 *
 * @see https://developer.chrome.com/devtools/docs/console-api
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */
(function(global, factory) {
  'use strict';

  if ('undefined' !== typeof module && module.exports) {
    module.exports = factory();
  } else if ('undefined' !== typeof define && define.amd) {
    define([], factory);
  } else if ('undefined' !== typeof define && define.cmd) {
    define(function(require, module) {
      module.exports = factory();
    });
  } else {
    global.xconsole = factory();
  }
})(this, function() {
  'use strict';

  var expando = '__xconsole-expando__' + (+new Date());
  var origin = expando.replace('expando', 'origin');
  //opera presto does not support "format specifiers" but we cannot detect that
  var presto = 'object' === typeof opera && 'function' === typeof opera.version && opera.version() < '13';

  var i, e, len;

  function caseCamel(str) {
    return str.replace(/\-([a-z])/g, function(m, n) {
      return n.toUpperCase();
    });
  }

  function isString(obj) {
    return obj && obj.constructor === String;
  }

  function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : '[object Array]' === ({}).toString.call(obj);
  }

  function nativeConsoleCall(fnName, args) {
    if ('undefined' !== typeof console && console[fnName]) {
      return console[fnName].apply(console, args);
    }
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
    getStyle: function(name) {
      return this.styles[name];
    },
    getStyles: function() {
      return this.styles;
    },
    colors: function() {
      var colors = 'aqua,black,blue,fuchsia,gray,green,lime,maroon,navy,olive,orange,purple,red,silver,teal,white,yellow'.split(',');
      for (var i = 0, len = colors.length; i < len; ++i) {
        this.setStyle(caseCamel('color-' + colors[i]), 'color:' + colors[i]);
        this.setStyle(colors[i], 'color:' + colors[i]); //alias&shortcut
        this.setStyle(caseCamel('bg-' + colors[i]), 'background-color:' + colors[i]);
      }
    },
    font: function() {
      //font size:12~30,40,50...100px
      for (var i = 12; i <= 100;) {
        this.setStyle('fontSize' + i, 'font-size:' + i + 'px');
        if (i < 30) {
          ++i;
        } else {
          i += 10;
        }
      }
    },
    boxes: function() {
      //boxes:margin/padding 0,5,15...100px
      var boxes = ['margin', 'margin-right', 'margin-left', 'margin-top', 'margin-bottom', 'padding', 'padding-right', 'padding-left', 'padding-top', 'padding-bottom'];
      for (var i = 0; i <= 100; i += 5) {
        for (var j = 0, len = boxes.length; j < len; ++j) {
          this.setStyle(caseCamel(boxes[j]) + i, boxes[j] + ':' + i + 'px');
        }
      }
    }
  };

  var Expandor = {
    initialize: function() {
      for (var e in Style.styles) {
        this.defineStyle(e);
      }
    },
    defineStrGetter: function(name, fn) {
      if (String.prototype.__defineGetter__) {
        if (presto) {
          String.prototype.__defineGetter__(name, function() {
            return this.toString();
          });
        } else {
          String.prototype.__defineGetter__(name, fn);
        }
      } else {
        String.prototype[name] = '';
      }
    },
    defineStyle: function(style) {
      this.defineStrGetter(style, function() {
        //string must be converted to String Object
        var obj;
        if (this instanceof String) {
          obj = this;
        } else {
          /*jshint -W053 */
          obj = new String(this);
          obj[origin] = this;
        }

        obj[expando] = obj[expando] || [];
        //We can ignore duplicated keys
        obj[expando].push(style);
        return obj;
      });
    }
  };

  Style.initialize();
  Expandor.initialize();

  function joinStyle(str) {
    if (str && isArray(str[expando]) && str[expando].length) {
      var styles = [];
      for (var i = 0, len = str[expando].length; i < len; ++i) {
        styles.push(Style.styles[str[expando][i]] || Style.styles.none);
      }
      return styles.join(';');
    } else {
      return '';
    }
  }

  var xconsole = {
    version: '0.1.0',
    getExpando: function() {
      return expando;
    },
    setStyle: function() {
      return Style.setStyle.apply(Style, arguments);
    },
    getStyle: function() {
      return Style.getStyle.apply(Style, arguments);
    },
    getStyles: function() {
      return Style.getStyles.apply(Style, arguments);
    }
  };
  /**
   * Strings with styles must be in the front of arguments.
   *
   * log("red".red,{},function(){},"blue".blue)
   *   =>console.log("%cred","color:red",{},function(){},"blue")
   *
   * log("red".red,"blue".blue,{},function(){})
   *   =>console.log("%cred%cblue","color:red","color:blue",{},function(){})
   *
   * log({},function(){},"red".red)
   *   =>console.log({},function(){},"red")
   *
   */
  function createEnhanceFn(name) {
    return function() {
      var _arguments = Array.prototype.slice.call(arguments);

      var arg, frontStrs = [],
        left = [],
        params = [],
        styles = [],
        ignoring = false;

      //"format specifiers" requires the first argument to be a string
      for (var i = 0, len = _arguments.length; i < len; ++i) {
        arg = _arguments[i];

        if (!ignoring && !isString(arg)) {
          ignoring = true;
        }

        if (ignoring) {
          if (isString(arg)) {
            left.push(arg[origin] || arg);
          } else {
            left.push(arg);
          }
        } else {
          styles.push(joinStyle(arg));
          frontStrs.push(arg);
        }
      }

      if (frontStrs.length) {
        params.push([''].concat(frontStrs).join('%c'));
        params = params.concat(styles);
      }

      nativeConsoleCall(name, params.concat(left));

      return this;
    };
  }

  function createPassThroughFn(name) {
    return function() {
      nativeConsoleCall(name, arguments);
    };
  }

  //functions with "format specifiers" supported
  var fns = 'log,debug,info,error,trace,warn'.split(',');

  for (i = 0, len = fns.length; i < len; ++i) {
    xconsole[fns[i]] = presto ? createPassThroughFn(fns[i]) : createEnhanceFn(fns[i]);
  }

  var passThroughFns = 'assert,clear,count,dirxml,dir,groupCollapsed,group,groupEnd,timeStamp,profile,profileEnd,table,time,timeEnd'.split(',');
  for (i = 0, len = passThroughFns.length; i < len; ++i) {
    xconsole[passThroughFns[i]] = createPassThroughFn(passThroughFns[i]);
  }

  function createFnString(name) {
    return function() {
      return 'function ' + name + '() { [custom code] }';
    };
  }

  for (e in xconsole) {
    if ('function' === typeof xconsole[e] && xconsole.hasOwnProperty(e)) {
      xconsole[e].toString = createFnString(e);
    }
  }

  return xconsole;
});