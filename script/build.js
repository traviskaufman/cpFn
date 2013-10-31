#!/usr/bin/env node
'use strict';

var es6ify = require('es6ify');
var browserify = require('browserify');
var fs = require('fs');
var path = require('path');

var src = path.resolve(path.join(__dirname, '..', 'src', 'cpFn.js'));
var target = path.resolve(path.join(__dirname, '..', 'lib', 'cpFn.js'));

// readFile -> compile -> afterWrite
fs.readFile(src, compile);

function compile(err, data) {
  if (err) {
    throw err;
  }

  var compiled = es6ify.compileFile(src, String(data));
  fs.writeFile(target, compiled, afterWrite);
}

function afterWrite(err) {
  if (err) {
    throw err;
  }

  console.log('Done!');
}
