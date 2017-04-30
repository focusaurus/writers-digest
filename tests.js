var assert = require("chai").assert;
var async = require("async");
var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
var store = require("./");

var testData = "123456789\n";
digest = crypto.createHash("sha1");
digest.update(testData);
var hex = digest.digest("hex");
var first2 = hex.slice(0, 2);
var last38 = hex.slice(2, 40);

describe("writers-digest success cases", function() {
  var testStorePath = "test_store";
  var testFilePath = path.join(testStorePath, "test_file_1");

  beforeEach(function(done) {
    async.series(
      [
        async.apply(fs.mkdir, testStorePath),
        async.apply(fs.writeFile, testFilePath, testData)
      ],
      done
    );
  });

  var cleanUp = function(done) {
    async.series(
      [
        async.apply(fs.unlink, path.join(testStorePath, first2, last38)),
        async.apply(fs.rmdir, path.join(testStorePath, first2)),
        async.apply(fs.rmdir, testStorePath)
      ],
      done
    );
  };

  it("should work in the base case", function(done) {
    store(testFilePath, testStorePath, function(error, result) {
      assert.isNull(error);
      assert.equal(hex, result.digest);
      cleanUp(done);
    });
  });

  it("should work if first2 directory exists", function(done) {
    fs.mkdir(path.join(testStorePath, first2), function(error) {
      assert.isNull(error);
      store(testFilePath, testStorePath, function(error, result) {
        assert.isNull(error);
        assert.equal(hex, result.digest);
        cleanUp(done);
      });
    });
  });

  it("should work with no baseDir argument", function(done) {
    store(testFilePath, function(error, result) {
      assert.isNull(error);
      assert.equal(hex, result.digest);
      async.series(
        [
          async.apply(fs.unlink, path.join(first2, last38)),
          async.apply(fs.rmdir, first2),
          async.apply(fs.rmdir, testStorePath)
        ],
        done
      );
    });
  });
});
