# writers-digest

[![Greenkeeper badge](https://badges.greenkeeper.io/focusaurus/writers-digest.svg)](https://greenkeeper.io/)

Store files on disk based on their SHA1 digest the way git does.

Each file is digested with tha Secure Hash Algorithm SHA1 method and stored on disk based on this 40-character hexidecimal value. A parent directory is created based on the first two characters of the digest, and the remaining 38 characters become the filename within that parent directory.

For example, given a digest of `68ce1ed198f097294448ab7a47e4c4922ef46048`, the files will be stored at path `68/ce1ed198f097294448ab7a47e4c4922ef46048`.

This module exports a single function with the following parameters:

- filePath
  - path to the existing file to store
  - can be relative or absolute
  - this file will be moved (renamed, not copied) into the destination location
- baseDir (optional)
  - base directory for the tree of files stored by digest
  - if omitted, files will be stored below the current directory
- callback
  - callback function arguments:
    - error (if any operations fail)
    - result (on success)
       - this will be an object with attributes:
       - path: full path to the stored file
       - digest: the 40-char hexidecimal SHA1 digest of the file

# Example usage

```javascript
var store = require('writers-digest')

store('someFile', function (error, result) {
  // 'someFile' has been moved to path result.path
  // result.digest is the hexidecimal SHA1 digest of the contents of 'someFile'
  console.dir(result)
})
```

[![Build Status](https://semaphoreci.com/api/v1/focusaurus/writers-digest/branches/master/badge.svg)](https://semaphoreci.com/focusaurus/writers-digest)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# License: MIT License

Copyright (c) 2016 Peter Lyons LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
