var readlineLib = require('readline')
var fs = require('fs')
var crypto = require('crypto')
var debug = require('debug')('co-readline')
var Promise = require('bluebird')

var EOF = crypto.randomBytes(256).toString('hex'); // 用这个字符串标记文件读取完毕
var EOF_ERROR = new Error('cant not read a EOF file')


var BUFFER_LINES_LENGTH = 10000;

function File(filePath) {
  if (!(this instanceof File)) {
    return new File(filePath)
  }

  this.filePath = filePath;
  this.bufferLines = new Array(BUFFER_LINES_LENGTH)
  this.readIndex = 0;
  this.writeIndex = 0;

  this.rlInstance = null;
  this.isEOF = false;

  this.init()
  this.restoreReadWriteIndex()
}

File.prototype.restoreReadWriteIndex = function () {
  var self = this;
  debug(`self.readIndex: ${self.readIndex}, self.writeIndex: ${self.writeIndex}`)

  this.readIndex = 0
  this.writeIndex = 0;
}

File.prototype.init = function () {
  var self = this;
  var bufferLines = self.bufferLines

  fs.statSync(self.filePath)

  var lineReader = self.rlInstance = readlineLib.createInterface({
    input: fs.createReadStream(self.filePath)
  });

  lineReader.on('line', function (line) {
    bufferLines[self.writeIndex++] = line
    if (bufferLines.length > BUFFER_LINES_LENGTH) {
      lineReader.pause();
    }
  });

  lineReader.once('close', function (line) {
    bufferLines[self.writeIndex++] = EOF
    self.isEOF = true;
  });
}

File.prototype.readline = function () {
  var self = this;

  self.rlInstance.resume();

  if (self.writeIndex > 0 && self.readIndex < self.writeIndex) {
    return self.bufferLines[self.readIndex++]
  } else {
    if (self.isEOF) {
      throw EOF_ERROR
    }
    self.restoreReadWriteIndex()
    return new Promise(function (resolve, reject) {
      setImmediate(function () {
        resolve(self.readline())
      })
    })
  }
}

File.prototype.gen = function *() {
  var self = this;

  while (true) {
    var line = self.readline()
    if (line == EOF) {
      break;
    }
    yield line;
  }
}

function open(filePath) {
  var rl = new File(filePath)
  return rl.gen()
}

exports = module.exports = open;
exports.open = open;
exports.File = File;
exports.EOF = EOF;