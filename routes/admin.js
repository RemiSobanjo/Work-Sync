const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require('../controllers/authController');

const root = path.resolve(__dirname, '..');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Render login or forgot password page
router.get('/login', (req, res) => {
  console.log('Rendering login page, query:', req.query); // Debug log
  res.render('admin/login', { display: req.query.d || '' });
});

router.get('/register', (req, res) => {
  res.render('admin/register');
});

router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard', { currentPage: 'dashboard' });
});

router.get('/user', (req, res) => {
  res.render('admin/user', { currentPage: 'user' });
});

router.get('/change_pass', (req, res) => {
  res.render('admin/change_pass', { currentPage: 'password' });
});

router.get('/forgot_pass', (req, res) => {
  res.render('admin/forgot_pass', { currentPage: 'forgot', token: '' });
});

router.get('/leave', function (req, res) {
 res.render('admin/leave', { currentPage: 'leave' });
});

router.get('/create_admin', function (req, res) {
 res.render('admin/create_admin', { currentPage: 'admin' });
});

router.get('/all_users', function (req, res) {
  res.render('admin/all_users', { currentPage: 'all_users' });
});

// Render reset-password page
router.get('/reset-password/:resetToken', (req, res) => {
  console.log('Rendering reset-password page, token:', req.params.resetToken); // Debug log
  res.render('admin/forgot_pass', { token: req.params.resetToken || '' });
});

module.exports = router;