'use strict'

// ================================ require ================================

let http = require('http')
let url = require('url')
let qs = require('querystring')

// ================================ variables ================================

const PORT = 1234

// ================================ common methods ================================

let writeResponse = (response, content) => {
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  console.log('RESPONSE: ' + (content || ''))
  response.write(content || '')
  response.end()
}

let pushService = {
  timeout: 10000,
  clients: {},
  add (topic, res) {
    // console.log('ADD ' + topic)
    if (!pushService.clients[topic]) {
      pushService.clients[topic] = []
    }
    pushService.clients[topic].push({
      time: Date.now(),
      res
    })
  },
  pub (topic, msg) {
    // console.log('PUB ' + topic)
    if (!pushService.clients[topic]) {
      return
    }
    pushService.clients[topic].forEach(item => {
      if (item.res.headersSent) {
        return
      }
      if (Date.now() - item.time >= pushService.timeout) {
        return
      }
      // item.res.send(msg)
      writeResponse(item.res, msg)
    })
  },
  start () {
    let fn = () => {
      let obj = {}
      let topics = Object.keys(pushService.clients)
      topics.forEach(topic => {
        pushService.clients[topic].forEach(item => {
          if (item.res.headersSent) {
            return
          }
          if (Date.now() - item.time >= pushService.timeout) {
            writeResponse(item.res, '')
            return
          }
          if (!obj[topic]) {
            obj[topic] = []
          }
          obj[topic].push(item)
        })
      })
      pushService.clients = obj
      setTimeout(fn, 1000)
    }
    fn()
  }
}

pushService.start()

let handleRequest = req => {
  // init
  req.method = req.request.method
  req.headers = req.request.headers
  req.originalUrl = req.request.url
  let urlParts = url.parse(req.originalUrl)
  req.url = urlParts.pathname
  req.rawQuery = urlParts.query
  req.query = qs.parse(req.rawQuery)
  req.body = qs.parse(req.rawBody)
  let res = req.response

  // CORS
  let origin = req.headers['origin'] || ''
  let methods = req.headers['Access-Control-Request-Method'] || ''
  let headers = req.headers['Access-Control-Request-Headers'] || ''
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Headers', methods)
  res.setHeader('Access-Control-Allow-Methods', headers)

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS')
    writeResponse(res, 'cors')
  } else if (req.method === 'POST' && req.url === '/service/push') {
    let topic = req.body.topic || req.query.topic
    if (topic) {
      pushService.add(topic, res)
    }
    // writeResponse(res, 'push')
  } else if (req.method === 'POST' && req.url === '/service/publish') {
    let topic = req.body.topic || req.query.topic
    let message = req.body.message || req.query.message || ''
    if (topic) {
      pushService.pub(topic, message)
    }
    writeResponse(res, `publish ${topic} ${message}`)
  } else {
    writeResponse(res, 'welcome')
  }
  // req.request = undefined
  // req.response = undefined
  // console.log(req)
  // writeResponse(res, JSON.stringify(req))
}

let requestList = {}

// ================================ ================================

let server = http.createServer(function (request, response) {
  let data = ''
  request.on('data', d => {
    // buffer
    data += d.toString()
  })
  request.on('end', () => {
    handleRequest({
      rawBody: data,
      request,
      response
    })
    // writeResponse(response, data)
  })
})

// ================================ ================================

server.listen(PORT, function () {
  console.log("Server runing at port: " + PORT + ".")
})
