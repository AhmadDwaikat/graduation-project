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
  requestedEvents: [{
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    status: {
      type: String,
      enum: ['requested', 'joined'],
      default: 'requested',
    },
  }],
});

module.exports = mongoose.model('User', UserSchema);
