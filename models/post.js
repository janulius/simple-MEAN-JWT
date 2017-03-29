var mongoose = require('mongoose');

// define the schema for our user model
var postSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  list : [{
    _id: { type: mongoose.Schema.Types.ObjectId },
    text: { type: String },
    created_at: { type: Date, default: Date.now }
  }]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);
