var generateFile = require('./generate_file')

before(function () {
  generateFile.generate()
})
after(function () {
  generateFile.clear()
})
