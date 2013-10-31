'use strict';

var cpFn = require('../lib/cpFn');
var assert = require('chai').assert;

describe('cpFn', function() {

  var fn, copy;

  beforeEach(function() {

    fn = function namedFn(a, b) {
      return a + b;
    };

    fn.foo = 'bar';

    copy = cpFn(fn);

  });

  it('creates a new function', function() {
    assert.instanceOf(copy, Function);
  });

  it('creates a copy of the passed in function', function() {
    assert.notStrictEqual(copy, fn);
  });

  it('provides the same functionality as the original function', function() {
    assert.strictEqual(copy(1, 2), fn(1, 2));
  });

  it('yields the same toString() result as the original fn', function() {
    assert.strictEqual(copy.toString(), fn.toString());
  });

  it('has the same name property as the original fn', function() {
    assert.propertyVal(copy, 'name', fn.name);
  });

  it('has the same length as the original fn', function() {
    assert.propertyVal(copy, 'length', fn.length);
  });

  it('has the same prototype as the original fn', function() {
    assert.propertyVal(copy, 'prototype', fn.prototype);
  });

  it('copies non-standard properties on the original fn', function() {
    assert.propertyVal(copy, 'foo', fn.foo);
  });

  it('does not modify the original fn when the copy is changed', function() {
    copy.baz = 1;
    assert.notProperty(fn, 'baz');
  });

  it('does not change when the original function changes', function() {
    fn.blip = 5;
    assert.notProperty(copy, 'blip');
  });

  it('does not change orig if defineProperty is used on copy', function() {
    Object.defineProperty(copy, 'baz', {
      value: 1,
      configurable: true
    });

    assert.notProperty(fn, 'baz');
  });

  it('does not change copy if defineProperty is used on orig', function() {
    Object.defineProperty(fn, 'baz', {
      value: 1,
      configurable: true
    });

    assert.notProperty(copy, 'baz');
  });

});
