"use strict";
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// TODO
// recursive mkdir (use module)
// error handling around file permissions
// optional parameter for mode of directories created?

function directory(dirPath, callback) {
  fs.stat(dirPath, function(error, stat) {
    if (error) {
      if (error.code === "ENOENT") {
        fs.mkdir(dirPath, "0755", function(error) {
          callback(error, dirPath);
          return;
        });
        return;
      } else {
        callback(error);
        return;
      }
    }
    if (!stat.isDirectory()) {
      const notDir = new Error(
        "File at path '" + dirPath + "' exists but is not a directory"
      );
      callback(notDir);
      return;
    }
    callback(null, dirPath);
  });
}

function move(inPath, fileName, dirPath, callback) {
  const outPath = path.join(dirPath, fileName);
  fs.rename(inPath, outPath, function(error) {
    callback(error, outPath);
  });
}

function writersDigest(filePath, baseDir, callback) {
  if (typeof baseDir === "function") {
    // Optional baseDir omitted
    callback = baseDir;
    baseDir = "";
  }
  const stream = fs.ReadStream(filePath);
  const digest = crypto.createHash("sha1");
  stream.on("data", function(d) {
    digest.update(d);
  });
  stream.on("error", function(error) {
    return callback(error);
  });
  stream.on("end", function() {
    const hex = digest.digest("hex");
    const dirName = hex.slice(0, 2);
    const fileName = hex.slice(2, 40);
    const dirPath = path.join(baseDir, dirName);
    directory(dirPath, (error, dirPath) => {
      if (error) {
        callback(error);
        return;
      }
      move(filePath, fileName, dirPath, (error, outPath) => {
        const result = {
          path: outPath,
          digest: hex
        };
        return callback(error, result);
      });
    });
  });
}
module.exports = writersDigest;
