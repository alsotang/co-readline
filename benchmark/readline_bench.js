var fs = require('fs')
var readline = require('readline')
var generateFile = require('../test/generate_file')
var coReadline = require('..')
var co = require('co')
var Promise = require('bluebird')

suite('readline_bench', function () {

  before(function () {
    generateFile.generate()
  })

  after(function () {
    generateFile.clear();
  })

  bench('new Promise', function () {
    new Promise(function (resolve, reject) {
      resolve(true)
    })
  })

  bench('fs.readFileSync', function() {
    fs.readFileSync(generateFile.filepath.filePath1Million, 'utf-8').split('\n')
  });

  bench('official readline', function (next) {
    var lineReader = readline.createInterface({
      input: fs.createReadStream(generateFile.filepath.filePath1Million)
    });

    lineReader.once('close', function () {
      next()
    })
  })

  bench('co-readline', function (next) {

    co(function *() {
      var rl = new coReadline.File(generateFile.filepath.filePath1Million)

      while (true) {
        var line = yield rl.readline()

        if (line == coReadline.EOF) {
          break;
        }
      }
    }).then(function () {
      next()
    })
  })
});