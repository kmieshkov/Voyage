const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/profile', authController.protect, viewController.getAccount);
router.post('/submit-user-data', authController.protect, viewController.updateUserData);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.use(authController.isLoggedIn);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  viewController.getOverview,
);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);

module.exports = router;
