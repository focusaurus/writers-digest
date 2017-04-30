"use strict";

/* eslint-env mocha */
const assert = require("assert");
const async = require("async");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const store = require("./");

const testData = "123456789\n";
const hex = crypto.createHash("sha1").update(testData).digest("hex");
const first2 = hex.slice(0, 2);
const last38 = hex.slice(2, 40);

const testStorePath = "test_store";
const testFilePath = path.join(testStorePath, "test_file_1");

function cleanup(done) {
  rimraf(testStorePath, done);
}

describe("writers-digest success cases", function() {
  before(cleanup);
  beforeEach(function(done) {
    async.series(
      [
        async.apply(fs.mkdir, testStorePath),
        async.apply(fs.writeFile, testFilePath, testData)
      ],
      done
    );
  });
  afterEach(cleanup);

  it("should work in the base case", function(done) {
    store(testFilePath, testStorePath, function(error, result) {
      assert.isNull(error);
      assert.equal(hex, result.digest);
      done();
    });
  });

  it("should work if first2 directory exists", function(done) {
    fs.mkdir(path.join(testStorePath, first2), function(error) {
      assert.isNull(error);
      store(testFilePath, testStorePath, function(error, result) {
        assert.isNull(error);
        assert.equal(hex, result.digest);
        done();
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
