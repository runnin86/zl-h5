var express = require('express')
var path = require('path')
var app = express()
var favicon = require('express-favicon')

app.use('/static', express.static(path.join(__dirname, './dist/static/')))
app.use('/data', express.static(path.join(__dirname, './src/data')))
app.use('/img', express.static(path.join(__dirname, './src/assets/img')))

app.use(favicon(path.join(__dirname, './favicon.ico')))

var urls = [
  '/',
  '/checkout/:token/:pwd',
  '/recharge/:state'
]

app.get('*', function (req, res) {
  if (req.url === '/MP_verify_pXCiYozvZK5lztM2.txt') {
    res.sendFile('MP_verify_pXCiYozvZK5lztM2.txt', { root: path.join(__dirname, './') })
  } else {
    res.sendFile('index.html', { root: path.join(__dirname, './dist') })
  }
})

app.all('*', function (req, res, next) {
  if (!req.get('Origin')) return next()
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET')
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
  // res.set('Access-Control-Allow-Max-Age', 3600)
  if ('OPTIONS' == req.method) return res.send(200)
  next()
})

var server = app.listen(3030, '0.0.0.0', function () {

  var host = server.address().address
  var port = server.address().port

  console.log('zwk listening at http://%s:%s', host, port)

})
