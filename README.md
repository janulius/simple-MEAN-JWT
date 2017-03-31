## How to run
1. **npm i** in your terminal.
2. **config.js** configurable mongoDB, secret for jwt and encryption

## Additional
   - In larger applications, this should be broken down further to separate duties,
   [Mean.io](http://mean.io/) is a good boilerplate to see best practices and how to separate file structure.
   - [xervo.io](https://xervo.io/). This is great for doing testing and creating databases on the fly.

## HTTP2 (Optional)
```
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
```
```
openssl rsa -passin pass:x -in server.pass.key -out server.key
```
```
rm server.pass.key
```
```
openssl req -new -key server.key -out server.csr
```
```
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```

When you’ll be visiting your server, make sure to select "ADVANCED"
and "Proceed to localhost (unsafe)" or add localhost as an exception.

```
npm i spdy --save
```

change **server.js** file :
```
add var spdy = require('spdy')
```
```
add var fs = require('fs')
```
```
var options = {
   key: fs.readFileSync(__dirname + '/server.key'),
   cert:  fs.readFileSync(__dirname + '/server.crt')
}
```
```
spdy
  .createServer(options, app)
  .listen(config.port, function (error) {
    if (error) {
      return process.exit(1)
    } else {
      console.log('Listening on port: ' + config.port + '.')
    }
  })
```