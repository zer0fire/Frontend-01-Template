const net = require('net')

class Request {
  // method, url = host + port + path
  // body: k-v
  // headers
  constructor (options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || 80
    this.body = options.body || {}
    this.headers = options.headers || {}
    this.path = options.path || '/'
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = 'application/x-www-form-urlencoded'
    }
    if (this.headers["Content-Type"] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers["Content-Type"] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${this.body[key]}`).join('&')
    }
    this.headers['Content-Length'] = this.bodyText.length
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}\r`
  }

  open (method, url) {
    
  }

  send (connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          // console.log('success')
          connection.write(this.toString())
        })
      }
      connection.on('data', (data) => {
        parser.receive(data.toString())
        if(parser.isFinished) {
          resolve(parser.response)
        }
        // console.log(parser.statusLine)
        // console.log(parser.headers)
        console.log(parser.response)
        // console.log()
        // resolve(data.toString())
        connection.end()
      })
      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })
    })
  }
}

class Response {

}

class ResponseParser {
  constructor () {
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LINE_END = 5
    this.WAITING_HEADER_BLOCK_END = 6
    this.WAITING_BODY = 7

    this.current  = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.bodyParser = null
  }
  get isFinished () {
    return this.bodyParser && this.bodyParser.isFinished
  }
  
  receive (string) {
    for(let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }
  get response () {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    // console.log(this.statusLine)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
  receiveChar (char) {
    // console.log(char.charCodeAt(0))
    // if (this.current === this.WAITING_STATUS_LINE) {
    //   if(char === '\n') {
    //     this.current = this.WAITING_HEADER_NAME
    //   }
    // }
    if (this.current === this.WAITING_STATUS_LINE) {
      if(char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      } else {
        this.statusLine += char
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      } 
    } else if (this.current === this.WAITING_HEADER_NAME) {
      // console.log(char)
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE
        // console.log("///////////////////")
      } else if (char === '\r') {
        // console.log("///////////////////") 
        this.current = this.WAITING_HEADER_BLOCK_END
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser()
        }
      } else {
        this.headerName += char
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if(char === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      // console.log('enter')
      if(char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        this.headerValue += char
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if(char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if(char === '\n') {
        this.current = this.WAITING_BODY
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char)
    }
  }
}
class TrunkedBodyParser {
  constructor () {
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_TRUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4

    this.length = 0
    this.content = []
    this.isFinished = false
    this.current = this.WAITING_LENGTH
  }
  receive() {

  }
  receiveChar(char) {
    if(this.current === this.WAITING_LENGTH) {
      if(char === '\r') {
        if(this.length === 0) {
          this.isFinished = true
        }
        this.current = this.WAITING_LENGTH_LINE_END
      } else {
        this.length *= 10
        this.length += char.charCodeAt(0) - '0'.charCodeAt(0)
      }
    } else if(this.current === this.WAITING_LENGTH_LINE_END) {
      if(char === '\n') {
        this.current = this.READING_TRUNK
      }
    } else if(this.current === this.READING_TRUNK) {
      this.content.push(char)
      this.length --
      if(this.length === 0) {
        this.current = this.WAITING_NEW_LINE
      }
    } else if(this.current === this.WAITING_NEW_LINE) {
      if(char === '\r') {
        this.current = this.WAITING_NEW_LINE_END
      }
    } else if(this.current === this.WAITING_NEW_LINE_END) {
      if(char === '\n') {
        this.current = this.WAITING_LENGTH
      }
    }
  }
}
// net.connect({
//   host: 'localhost',
//   port: 8088,
//   onread: {
//     buffer: Buffer.alloc(4 * 1024),
//     callback: function (nread, buf) {
//       console.log(buf.toString('utf8', 0, nread))
//     }
//   }
// })

// const client = net.createConnection({
//   host: '127.0.0.1',
//   port: 8088,
// }, () => {
//   console.log('connected success')
void async function () {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8088,
    path: '/',
    headers: {
      ['X-Foo2']: 'customed'
    },
    body: {
      name: 'wm',
    }
  })
  
  let req = await request.send()
  // console.log(req)
}()

  // console.log(request.toString())
  // client.write(request.toString())
//   // Content-Type 有 4 种格式
//   // text/html application/json multiple
//   // Content-Type 和 Content-Length 必须有
//   client.write(`
// POST / HTTP/1.1
// Content-Type: application/x-www-form-urlencoded
// Content-Length: 7

// name=wm
// `)
// })

// client.on('data', (data) => {
//   console.log(data.toString())
//   client.end()
// })

// client.on('error', (err) => {
//   console.log(err)
//   client.end()
// })

// client.on('end', () => {
//   console.log('disconnected')
// })

// Request line
// header
// body