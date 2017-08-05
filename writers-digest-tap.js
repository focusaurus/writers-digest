"use strict";
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const store = require("./");
const tap = require("tap");

const testStorePath = "test_store";
const testFilePath = path.join(testStorePath, "test_file_1");
const testData = "123456789\n";
const hex = crypto.createHash("sha1").update(testData).digest("hex");
const first2 = hex.slice(0, 2);
const last38 = hex.slice(2, 40);

function cleanUp(done) {
  rimraf(testStorePath, done);
}

tap.afterEach(cleanUp);
tap.beforeEach(done => {
  rimraf.sync(testStorePath);
  fs.mkdirSync(testStorePath);
  fs.writeFileSync(testFilePath, testData);
  done();
});

tap.test("base case", {skip: false}, test => {
  store(testFilePath, testStorePath, (error, result) => {
    test.error(error);
    test.same(hex, result.digest);
    test.done();
  });
});

tap.test("first2 directory exists", {skip: false}, test => {
  fs.mkdirSync(path.join(testStorePath, first2));
  store(testFilePath, testStorePath, (error, result) => {
    test.error(error);
    test.same(hex, result.digest);
    test.end();
  });
});

tap.test("store path is file", {skip: false}, test => {
  rimraf.sync(testStorePath);
  fs.writeFileSync(testStorePath, "");
  store(testFilePath, testStorePath, error => {
    test.ok(error);
    test.match(error.message, "ENOTDIR");
    test.end();
  });
});

tap.test("no baseDir argument", {skip: false}, test => {
  store(testFilePath, (error, result) => {
    test.error(error);
    test.same(hex, result.digest);
    fs.unlinkSync(path.join(first2, last38));
    fs.rmdirSync(first2);
    fs.rmdirSync(testStorePath);
    test.end();
  });
});
