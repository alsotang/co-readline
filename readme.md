# co-readline

[![Build Status](https://travis-ci.org/alsotang/co-readline.svg?branch=master)](https://travis-ci.org/alsotang/co-readline)

[![codecov](https://codecov.io/gh/alsotang/co-readline/branch/master/graph/badge.svg)](https://codecov.io/gh/alsotang/co-readline)


Read a file line by line in generator/co style

## install

`$ npm i co-readline`

## easy example

```js
var coReadline = require('co-readline')
var co = require('co')

co(function * () {
  var NORMAL_FILE_PATH = 'absolute_path_to_file'
  var rlGen = coReadline(NORMAL_FILE_PATH)

  var lines = []

  for (var line of rlGen) {
    if (line.then) { // `line` could be Promise or String
      line = yield line;
    }

    lines.push(line)
  }

  var fileContent = yield fs.readFile(NORMAL_FILE_PATH, 'utf-8')
  fileContent.should.equal(lines.join('\n'))
})

```

## api

`coReadline(filePath)` return a generator, then do `for..of` to it

## benchmark

About 1/3 speed of build-in `readline` module

About 1/6 speed of `fs.readFileSync`

## todo

* publish to npm
