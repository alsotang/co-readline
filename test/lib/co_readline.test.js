var coReadline = require('../..')
var pathLib = require('path')
var fs = require('mz/fs')
var generateFile = require('../generate_file')
var msLib = require('ms')
var Promise = require('bluebird')


var NORMAL_FILE_PATH = pathLib.join(__dirname, '../files/normal_little.txt')
var NOT_EXIST_FILE_PATH = pathLib.join(__dirname, '../files/not_exist.txt')

describe('test/lib/co_readline.test.js', function() {
  this.timeout(msLib('10s'))

  before(function () {
    generateFile.generate()
  })
  after(function () {
    generateFile.clear()
  })

  it('should ok', function *() {
    (yield Promise.resolve(true)).should.true()
  })

  it('should read NORMAL_FILE_PATH', function * () {
    var rl = new coReadline.File(NORMAL_FILE_PATH)
    var fileContent = yield fs.readFile(NORMAL_FILE_PATH, 'utf-8')

    var lines = []
    while (true) {
      var line = rl.readline()

      if (line == coReadline.EOF) {
        break;
      }

      if (line.then) {
        line = yield line
      }

      lines.push(line)
    }

    fileContent.should.equal(lines.join('\n'))
  })

  it('.gen should read NORMAL_FILE_PATH', function * () {
    var rl = new coReadline.File(NORMAL_FILE_PATH)
    var fileContent = yield fs.readFile(NORMAL_FILE_PATH, 'utf-8')

    var lines = []

    for (var line of rl.gen()) {
      if (line.then) {
        line = yield line;
      }

      lines.push(line)
    }

    fileContent.should.equal(lines.join('\n'))
  })

  it('.open should read NORMAL_FILE_PATH', function * () {
    var rlGen = coReadline(NORMAL_FILE_PATH)
    var fileContent = yield fs.readFile(NORMAL_FILE_PATH, 'utf-8')

    var lines = []

    for (var line of rlGen) {
      if (line.then) {
        line = yield line;
      }

      lines.push(line)
    }

    fileContent.should.equal(lines.join('\n'))
  })

  it('should throw when after EOF', function * () {
    var rl = new coReadline.File(NORMAL_FILE_PATH)

    while (true) {
      var line = rl.readline()

      if (line == coReadline.EOF) {
        break;
      }

      if (line.then) {
        line = yield line
      }
    }

    (function () {
      rl.readline()
    }).should.throw('cant not read a EOF file')
  })

  it('should read 1 million lines file', function *() {
    var rl = new coReadline.File(generateFile.filepath.filePath1Million)
    var fileContent = yield fs.readFile(generateFile.filepath.filePath1Million, 'utf-8')

    var lines = []
    while (true) {
      var line = rl.readline()

      if (line == coReadline.EOF) {
        break;
      }

      if (line.then) {
        line = yield line
      }

      lines.push(line)
    }

    fileContent.should.equal(lines.join('\n'))
  })

  it('should stop when no one consume', function *() {
    var rl = new coReadline.File(generateFile.filepath.filePath1Million)

    yield Promise.delay(50)

    var lineLength = rl.bufferLines.length

    yield Promise.delay(20)

    rl.bufferLines.length.should.equal(lineLength);

    yield Promise.delay(20)

    rl.bufferLines.length.should.equal(lineLength);
  })

  it('should throw when file path not exists', function *() {
    (function () {
      var rl = new coReadline.File(NOT_EXIST_FILE_PATH)
    }).should.throw({
      code: 'ENOENT'
    })
  })
})