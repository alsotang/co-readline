var fs = require('fs')
var pathLib = require('path')

/*
build a large file of 1 million lines
 */
var filePath1Million = pathLib.join(__dirname, './files/1_million.txt')
function generate1Million() {
  var lines = [];

  for (var i = 0; i < 1000000; i++) {
    lines.push(String(i));
  }

  fs.writeFileSync(filePath1Million, lines.join('\n'))
}

function clear1Million() {
  fs.unlinkSync(filePath1Million)
}

exports.generate = function () {
  generate1Million()
}

exports.clear = function () {
  clear1Million()
}

exports.filepath = {
  filePath1Million: filePath1Million
}
