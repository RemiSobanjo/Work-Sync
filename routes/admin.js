const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/auth')

const root = path.resolve(__dirname, '..');

router.get('/login', authController.renderLoginPage);
router.post('/login', authController.handleLogin);
router.get('/logout', authController.logout);

// Forgot password
router.post('/forgot-password', authController.handleForgotPassword);

// Reset password form
router.get('/reset-password/:resetToken', (req, res) => {
  res.render('admin/reset_pass', { token: req.params.resetToken, error: null, success: null });
});

// Reset password POST
router.post('/reset-pass/:resetToken', authController.handlePasswordReset);

router.get('/register', (req, res) => {
  res.render('admin/register', { currentPage: 'addStaff' });
});

router.get('/dashboard', isAuthenticated, dashboardController.renderDashboard);

router.get('/user', isAuthenticated, (req, res) => {
  res.render('admin/user', { currentPage: 'user' });
});

router.get('/change_pass', isAuthenticated, (req, res) => {
  res.render('admin/change_pass', { currentPage: 'password' });
});

// router.get('/forgot_pass', (req, res) => {
//   res.render('admin/forgot_pass', { currentPage: 'forgot', token: '' });
// });

router.get('/leave', function (req, res) {
  res.render('admin/leave', { currentPage: 'leave' });
});

router.get('/create_admin', isAuthenticated, function (req, res) {
  res.render('admin/create_admin', { currentPage: 'admin' });
});

router.get('/all_users', isAuthenticated, function (req, res) {
  res.render('admin/all_users', { currentPage: 'all_users' });
});

router.get('/staff-list', isAuthenticated, userController.fetchStaffList);
router.get('/visitor-list', isAuthenticated, userController.fetchVisitorList);

// Render reset-password page
// router.get('/forgot_pass/:resetToken', async (req, res) => {
//   console.log('Rendering reset-password page, token:', req.params.resetToken); // Debug log

//   const token = req.params.resetToken || '';

//   try {
//     const response = await axios.get(`${process.env.API_BASE_URL}/api/admin/verify-reset-token/${token}`);
//     if (response.data.status !== 'success') throw new Error();

//     res.render('admin/forgot_pass', { token, error: null, success: null });
//   } catch (err) {
//      res.render('admin/forgot_pass', { token: null, error: 'Invalid or expired token', success: null });
//   }
//   // res.render('admin/login', { display, token, error: null, success: null });
// });

module.exports = router;