
# cpFn

  Elegant function replication using next-generation ECMAScript

## Motivation

How does one *truly* copy a function in ECMAScript, without resorting to something like `eval`? The simple answer is, you can't. `name` and `length` are non-writable and non-configurable properties of functions, bind changes the `length` property of the resulting function, and produces a different output for `toString()`. 

The up-and-coming version of ECMAScript, however, includes a [Reflect API](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-reflection.) that contains a constructor for an exotic object called a [Proxy](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-proxy-object-internal-methods-and-internal-data-properties) which does exactly what it says: provides traps for operations on objects. Using Proxies, we can "simulate" the copying of a function, without having to resort to using `eval` with `toString` or something like that, which I personally think is pretty cool :)

Being that this is an experimental module, I decided to go ahead and write it using ES6 syntax (although the code itself is only a few lines so I didn't get to use as much of it as I wanted).

## Usage

You'll *must* run node with the `--harmony` flag. If using in the browser, you must have a runtime that at *least* supports ES5, and contains Proxy objects (even if they are the older version of proxies) and WeakMaps.

```javascript
var hasOwn = Function.prototype.call.bind(({}).hasOwnProperty);
var cpFn = require('cpFn');
var orig = function add(a, b) {
  return (a + b);
};
orig.someVar = 'hello'; 
var copy = cpFn(orig);

console.log(copy instanceof Function); // true
console.log(orig === copy); // false
console.log(orig(1,2) === copy(1,2)); // true
console.log(orig.name === copy.name); // true
console.log(orig.length === copy.length); // true
console.log(orig.prototype === copy.prototype); // true
console.log(orig.someVar === copy.someVar); // true

orig.foo = 1;
console.log(hasOwn(copy, 'foo')); // false

copy.bar = 2;
console.log(hasOwn(orig, 'bar')); // false

Object.defineProperty(orig, 'baz', {
  value: 3,
  configurable: true
});
console.log(hasOwn(copy, 'baz')); // false

// Note that non-configurable properties are currently not 
// supported, but will hopefully be soon!
Object.defineProperty(copy, 'herp', {
  value: 'derp',
  configurable: true
});
console.log(hasOwn(orig, 'herp')); // false
```

## TODO
* Browser builds (should be pretty straightforward)
* What to do when non-configurable properties are defined on the Proxy? Related: [fixed properties](http://wiki.ecmascript.org/doku.php?id=strawman:fixed_properties)

## License 

(The MIT License)

Copyright (c) 2013 Travis Kaufman &lt;travis.kaufman@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
