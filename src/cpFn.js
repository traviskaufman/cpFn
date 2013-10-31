// Can't use strict here, it causes problems with fat arrow functions :(
/* jshint strict:false */

var {
  Proxy, has, getOwnPropertyNames, set
} = require('harmony-reflect');

var { defineProperty } = Object;
var SPECIAL = ['name', 'length', 'toString'];

function checkOverride(name, props) {
  var idx = props.indexOf(name);
  if (~idx && SPECIAL.indexOf(name) < 0) {
    props.splice(idx, 1);
  }
}

module.exports = function(fn) {
  var props = getOwnPropertyNames(fn);
  var vals = props.reduce(function(m, p) {
    if (['caller', 'callee', 'arguments'].indexOf(p) < 0) {
      m[p] = fn[p];
    }

    return m;
  }, {});
  return new Proxy(fn, {
    get: function(target, name, rcvr) {
      if (name === 'toString') return fn.toString;
      return ~props.indexOf(name) ? vals[name] : this[name];
    },
    set: function(target, name, val) {
      checkOverride(name, props);
      this[name] = val;
      return true;
    },
    defineProperty: function(target, name, desc) {
      checkOverride(name, props);
      defineProperty(this, name, desc);
      return true;
    }
  });
};
