var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.post('/', function(req, res, next) {
  // res.render('index', { title: 'Express1' });
  console.log('req.query.filename', req.body.content)
  console.log('req.query.filename', req.query.filename)
  let body = [];
  req.on('data', (chunk) => {
    console.log('chunk', chunk.toString())
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log('body', body.toString())
    fs.writeFileSync(`../server/public/${req.query.filename}`, body)
  })
  res.end('1')
});

module.exports = router;