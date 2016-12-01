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
  this.bufferLines = []
  this.rlInstance = null;
  this.isEOF = false;
  this.isPause = false;

  this.rlError = null;

  this.init()
}

File.prototype.init = function () {
  var self = this;

  fs.statSync(self.filePath)

  var lineReader = self.rlInstance = readlineLib.createInterface({
    input: fs.createReadStream(self.filePath)
  });

  lineReader.on('line', function (line) {
    self.bufferLines.push(line)
    if (self.bufferLines.length > BUFFER_LINES_LENGTH) {
      if (!self.isPause) {
        lineReader.pause();
      }
    }
  });

  lineReader.once('close', function (line) {
    self.bufferLines.push(EOF)
    self.isEOF = true;
  });

  lineReader.once('error', function (err) {
    self.rlError = err;
  })

  lineReader.on('pause', function () {
    self.isPause = true;
  })
  lineReader.on('resume', function () {
    self.isPause = false;
  })
}

File.prototype.readline = function () {
  var self = this;

  if (self.rlError) {
    return Promise.reject(self.rlError);
  }

  if (self.isPause) {
    self.rlInstance.resume();
  }

  return new Promise(function (resolve, reject) {
    if (self.bufferLines.length > 0) {
      resolve(self.bufferLines.shift())
    } else {
      if (self.isEOF) {
        reject(EOF_ERROR)
      } else {
        setImmediate(function () {
          resolve(self.readline())
        })
      }
    }
  })
}

exports.File = File;
exports.EOF = EOF;