"use strict";
const crypto = require("crypto");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

function move(inPath, fileName, dirPath, callback) {
  const outPath = path.join(dirPath, fileName);
  fs.rename(inPath, outPath, error => {
    callback(error, outPath);
  });
}

function writersDigest(filePath, baseDir, callback) {
  if (typeof baseDir === "function") {
    // Optional baseDir omitted
    /* eslint-disable no-param-reassign */
    callback = baseDir;
    baseDir = "";
    /* eslint-enable no-param-reassign */
  }
  const stream = fs.ReadStream(filePath);
  const digest = crypto.createHash("sha1");
  stream.on("data", data => {
    digest.update(data);
  });
  stream.once("error", error2 => callback(error2));
  stream.on("end", () => {
    const hex = digest.digest("hex");
    const dirName = hex.slice(0, 2);
    const fileName = hex.slice(2, 40);
    const dirPath = path.join(baseDir, dirName);
    mkdirp(dirPath, error => {
      if (error) {
        callback(error);
        return;
      }
      move(filePath, fileName, dirPath, (error2, outPath) => {
        const result = {
          path: outPath,
          digest: hex
        };
        return callback(error2, result);
      });
    });
  });
}
module.exports = writersDigest;
