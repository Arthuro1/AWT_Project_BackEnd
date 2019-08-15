const JWT = require('jsonwebtoken');

const Comment = require('../models/comment');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET;

const signToken = user => {
  return JWT.sign(
    {
      name: user.name,
      sub: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    JWT_SECRET
  );
};

module.exports = {
  register: async(req, res, next) => {
    const {name, email, password} = req.value.body;
    const foundUser = await User.findOne({'local.email': email});

    if (foundUser) {
      return res.status(403).json({error: 'Email is already in use.'});
    }

    const newUser = new User({
      method: 'local',
      local: {name, email, password},
      imageUrl: '',
      commentIds: [],
    });
    await newUser.save();

    const token = await newUser.generateAuthToken();

    res.status(200).json({token});
  },

  logIn: async(req, res, next) => {
    const user = req.user;
    const token = await user.generateAuthToken();
    res.status(200).json({token});
  },

  googleOAuth: async(req, res, next) => {
    console.log('google function called');

    const token = signToken(req.user);
    res.status(200).json({token});
  },

  facebookOAuth: async(req, res, next) => {
    console.log('facebook function called');

    const token = signToken(req.user);
    res.status(200).json({token});
  },

  secret: async(req, res, next) => {
    console.log('secret function called');
    res.json({secret: 'ressource'});
  },

  postComment: async(req, res, next) => {
    console.log('post comment function called');
    const {authorID, message, bookID} = req.body;
    const user = await User.findOne({'local.email': authorID});

    if (user) {
      console.log('User', user);
      const newComment = new Comment({
        message,
        'author.id': authorID,
        'author.username': user.local.name,
        commentedBookId: bookID,
        likes: 0,
        commentIds: [],
      });

      await newComment.save();
    }
  },

  getComment: async(req, res, next) => {
    console.log('get comment function called');
    try {
      console.log(req.body.bookID);
      const comments = await Comment.find({
        commentedBookId: req.body.bookID,
      }).sort({creationDate: -1});
      if (comments) {
        res.status(200).json(comments);
      }
    } catch (e) {
      res.status(400).json(e.message);
    }
  },
};
