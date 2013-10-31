var {
  Proxy, has, getOwnPropertyNames
} = require('harmony-reflect');

var { defineProperty } = Object;

module.exports = function(fn) {
  var PROPS = getOwnPropertyNames(fn);
  return new Proxy(fn, {
    get: function(target, name, rcvr) {
      if (name === 'toString') return fn.toString;
      return ~PROPS.indexOf(name) ? fn[name] : this[name];
    },
    set: (target, name, val) => (this[name] = val, true),
    defineProperty: (target, name, desc) => (
      defineProperty(this, name, desc), true
    )
  });
};

