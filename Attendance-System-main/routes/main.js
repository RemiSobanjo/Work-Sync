const express = require('express');
const path = require('path');
const router = express.Router();
const checkinController = require('../controllers/checkinController');

const root = path.resolve(__dirname, '..');

router.get('/staff', (req, res) => {
  const success = req.query.success ? 'Staff check-in successful' : null;
  res.render('check-in/staff', {
    error: null,
    success
  });
});

router.get('/visitor', (req, res) => {
  const success = req.query.success ? 'Visitor check-in successful' : null;
  res.render('check-in/visitor', {
    error: null,
    success
  });
});

router.get('/visitor-out', (req, res) => {
  const success = req.query.success ? 'Visitor has checked-out successfully' : null;
  res.render('check-out/visitor', {
    error: null,
    success
  });
});

router.post('/check-in/visitor', checkinController.submitVisitor);
router.post('/check-out/visitor', checkinController.submitCheckoutVisitor);
router.post('/check-in/staff', (req, res, next) => {
  const checkType = req.query.check;

  if(checkType === 'Out') {
    return checkinController.submitStaffOut(req, res, next);
  }

  return checkinController.submitStaff(req, res, next);
});


module.exports = router;