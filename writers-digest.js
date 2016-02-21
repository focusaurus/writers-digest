var async = require('async')
var crypto = require('crypto')
var fs = require('fs')
var path = require('path')

// TODO
// recursive mkdir (use module)
// error handling around file permissions
// optional parameter for mode of directories created?

var directory = function (dirPath, callback) {
  fs.stat(dirPath, function (error, stat) {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.mkdir(dirPath, '0755', function (error) {
          return callback(error, dirPath)
        })
        return
      } else {
        return callback(error)
      }
    }
    if (!stat.isDirectory()) {
      var notDir = new Error("File at path '" + dirPath + "' exists but is not a directory")
      return callback(notDir)
    }
    return callback(null, dirPath)
  })
}

var move = function (inPath, fileName, dirPath, callback) {
  var outPath = path.join(dirPath, fileName)
  fs.rename(inPath, outPath, function (error) {
    callback(error, outPath)
  })
}

module.exports = function (filePath, baseDir, callback) {
  if (typeof baseDir === 'function') {
    // Optional baseDir omitted
    callback = baseDir
    baseDir = ''
  }
  var stream = fs.ReadStream(filePath)
  var digest = crypto.createHash('sha1')
  stream.on('data', function (d) {digest.update(d);})
  stream.on('error', function (error) {return callback(error);})
  stream.on('end', function () {
    var hex = digest.digest('hex')
    var dirName = hex.slice(0, 2)
    var fileName = hex.slice(2, 40)
    var dirPath = path.join(baseDir, dirName)
    async.waterfall([
      async.apply(directory, dirPath),
      async.apply(move, filePath, fileName)
    ], function (error, outPath) {
      var result = {
        path: outPath,
        digest: hex
      }
      return callback(error, result)
    })
  })
}
