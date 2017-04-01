var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var CryptoJS = require("crypto-js");
var jwt = require('jwt-simple');
var moment = require('moment');

var config = require('./config'); // get our config file

/*model*/
var User = require('./models/user');
var Post = require('./models/post');

mongoose.connect(config.database);     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


app.post('/auth/register', function(req, res) {
  if (!('name' in req.body) || req.body.name == '') {
    return res.status(422).send({ message: 'Name is required'});
  } else {
    var name = req.body.name
  }

  if (!('email' in req.body) || req.body.email == '') {
    return res.status(422).send({ message: 'Email is required'});
  } else {
    var email = req.body.email.trim()
  }

  if (!('password' in req.body) || req.body.password == '') {
    return res.status(422).send({ message: 'Password is required'});
  } else {
    var password = CryptoJS.AES.encrypt(req.body.password, config.secret);
  }

  var user = new User({
    name: name,
    email: email,
    password: password
  });
  user.save(function(err, result) {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    res.send({ message: 'berhasil daftar' });
  });
});

app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, 'name password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }
    console.log(user);
    var bytes  = CryptoJS.AES.decrypt(user.password.toString(), config.secret);
    var password = bytes.toString(CryptoJS.enc.Utf8);

    if(password != req.body.password) {
      return res.status(401).send({ message: 'Password tidak sesuai' })
    }

    res.send({
      name: user.name,
      token: createJWT(user)
    });
  });
});

app.route('/auth/profile')
  .get(ensureAuthenticated, function(req, res) {
    User.findById(req.user, 'name', function(err, user) {
      if(!user)return res.status(403).send({ message: 'You are not registered as user' });
      if(user){
        res.send(user);
      }
    });
  })
  .put(ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
      if(!user)return res.status(403).send({ message: 'You are not registered as user' });
      if(user){
        if("name" in req.body) user.name = req.body.name;
        if("password" in req.body) user.password = CryptoJS.AES.encrypt(req.body.password, config.secret);
        user.save(function(err, user) {
          if (err) res.status(500).send({ message: err.message });
          else res.send(user);
        });
      }
    });
  })
;

app.route('/api/posts')
  .get(ensureAuthenticated, function(req, res) {
    Post.findOne({ user_id: req.user }, function(err, post) {
      if (post) post.list.reverse();
      res.send(post);
    });
  })
  .post(ensureAuthenticated, function(req, res) {
    Post.findOne({ user_id: req.user }, function(err, post) {
      if (!post) {
        var post = new Post({
          user_id: req.user,
          list: [{
            _id: mongoose.Types.ObjectId(),
            text: req.body.text
          }]
        });
        post.save(function(err) {
          if (err) next(err);
          return res.send(post);
        })
      } else {
        post.list.push({
          _id: mongoose.Types.ObjectId(),
          text: req.body.text
        });
        post.save(function(err) {
          if (err) next(err);
          post.list.reverse();
          return res.send(post);
        })
      }

    });
  })
;

app.delete('/api/posts/:id', ensureAuthenticated, function (req, res) {
  Post.update({ user_id: req.user }, { $pull: { list: { _id: req.params.id } } }, function (err, post) {
    res.send(post);
  });
});

function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(360, 'days').unix()
  };
  return jwt.encode(payload, config.secret);
}


function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.secret);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(440).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}

// listen (start app with node server.js) ======================================
app.listen(config.port);
console.log("App listening on port 4500");