var coReadline = require('../..')
var pathLib = require('path')
var fs = require('mz/fs')
var generateFile = require('../generate_file')
var msLib = require('ms')
var Promise = require('bluebird')


var NORMAL_FILE_PATH = pathLib.join(__dirname, '../files/normal_little.txt')

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
      var line = yield rl.readline()

      if (line == coReadline.EOF) {
        break;
      }

      lines.push(line)
    }

    fileContent.should.equal(lines.join('\n'))
  })

  it('should read 1 million lines file', function *() {
    var rl = new coReadline.File(generateFile.filepath.filePath1Million)
    var fileContent = yield fs.readFile(generateFile.filepath.filePath1Million, 'utf-8')

    var lines = []
    while (true) {
      var line = yield rl.readline()

      if (line == coReadline.EOF) {
        break;
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
})