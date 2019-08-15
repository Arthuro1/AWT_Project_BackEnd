const router = require('express-promise-router')();
const passport = require('passport');

// eslint-disable-next-line no-unused-vars
const passportConfig = require('../config/passport');
const UserController = require('../controller/users');
const {validateBody, schemas} = require('../helpers/routeHelpers');

const passportAutthentification = (strategyName, isWithSession) => {
  return passport.authenticate(strategyName, {session: isWithSession});
};

router
  .route('/register')
  .post(validateBody(schemas.registerSchema), UserController.register);

router
  .route('/login')
  .post(
    validateBody(schemas.loginSchema),
    passportAutthentification('local', false),
    UserController.logIn
  );

router
  .route('/secret')
  .get(passportAutthentification('jwt', false), UserController.secret);

router
  .route('/oauth/google')
  .post(
    passportAutthentification('googleToken', false),
    UserController.googleOAuth
  );

router
  .route('/oauth/facebook')
  .post(
    passportAutthentification('facebookToken', false),
    UserController.facebookOAuth
  );

router
    .route('/post-comment')
    .post(
        passportAutthentification('jwt', false),
        UserController.postComment);

router
    .route('/get-comment')
    .post(
        passportAutthentification('jwt', false),
        UserController.getComment);

module.exports = router;
