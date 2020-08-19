const http = require('http')
const fs = require('fs')
const archiver = require('archiver')

let packname = 'package'
const options = {
  host: 'localhost',
  port: 8081,
  path: '/?filename=' + 'package.zip',
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream',
  }
};
var archive = archiver('zip', {
  zlib: {level: 9}
})
archive.directory(packname, false)

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
});
req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`)
})
archive.pipe(req)

archive.on('end', () => {
  req.end()
})

archive.finalize()


