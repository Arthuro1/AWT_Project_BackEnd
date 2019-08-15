const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true,
  },

  local: {
    name: {
      type: String,
    },

    email: {
      type: String,
      lowercase: true,
    },

    password: {
      type: String,
    },
  },

  google: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },

    email: {
      type: String,
      lowercase: true,
    },
  },

  facebook: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },

    email: {
      type: String,
      lowercase: true,
    },
  },

  imageUrl: {
    type: String,
  },

  commentIds: [],

  creationDate: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function(next) {
  try {
    if (this.method !== 'local') {
      next();
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    this.local.password = passwordHash;
    next();
  } catch (e) {
    next(e);
  }
});

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (e) {
    throw new Error(e);
  }
};

userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({
    sub: user._id,
    name: user.local.name,
    email: user.local.email,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1),
      },
      JWT_SECRET);
  return token;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
