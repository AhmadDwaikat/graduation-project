const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  interests: {
    type: [String],
    required: false,
  },
  hasSelectedInterests: {
    type: Boolean,
    default: false,
  },
  availability: String,
  bio: {
    type: String,
  },
  profilePicture: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`
    },
  },
  joinedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  requestedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  age: {
    type: Number,
  },
  location: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
