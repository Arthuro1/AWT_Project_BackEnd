const router = require('express-promise-router')();
const BookController = require('../controller/books');
const passport = require('passport');
// eslint-disable-next-line no-unused-vars
const passportConfig = require('../config/passport');

const passportAutthentification = (strategyName, isWithSession) => {
    return passport.authenticate(strategyName,{session: isWithSession});
};

router
    .route('/addBooks')
    .post(
        BookController.addBooks);

router
    .route('/comment')
    .post(
        passportAutthentification('jwt', false),
        BookController.comment);

router
    .route('/rating')
    .post(
        passportAutthentification('jwt', false),
        BookController.setRating);

router
    .route('/top-rated-books')
    .get(
        passportAutthentification('jwt', false),
        BookController.topRatedBooks);

router
    .route('/most-popular-books')
    .get(
        passportAutthentification('jwt', false),
        BookController.mostPopularBooks);

router
    .route('/search-by-lecture')
    .post(
        passportAutthentification('jwt', false),
        BookController.searchByLecture);

module.exports = router;
