var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password : { type: String, select: false }
});

userSchema.pre('save', true, function(next, done) {
  if (!this.isModified('password')) {
    var self = this;
    mongoose.models["User"].findOne({email : self.email},function(err, results) {
      if (err) {
        done(err);
      } else if (results) { //there was a result found, so the email address exists
        self.invalidate("email","Email already exists");
        done(new Error("Email already exists"));
      } else {
        done();
      }
    });
  } else {
    done();
    next();
  }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
