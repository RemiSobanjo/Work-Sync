const axios = require('axios');
const validator = require('validator');
require('dotenv').config();

const v1_API = process.env.API_BASE_URL;

const renderLoginPage = (req, res) => {
  const display = req.query.d || '';
  res.render('admin/login', { display, error: null, success: null });
}

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!validator.isEmail(email)) {
    console.log("Invalid email format");
    return res.render('admin/login', { error: 'Invalid email format.', success: null });
  }

  if (!password || password.trim() === '') {
    console.log("Empty password");
    return res.render('admin/login', { error: 'Password cannot be empty.', success: null });
  }

  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/api/admin/login`, {
      email,
      password,
    });

    const data = response.data;

    if (data.status === 'success') {
      const admin = data.data.admin;
      const token = data.data.token || null // depends on API response;

      req.session.user = {
        ...admin,
        token
      };

      return res.redirect('/admin/dashboard'); // route to dashboard after login successful
    } else {
      return res.render('admin/login', {
        error: data.message || 'Login failed',
        success: null
      });
    }
  } catch (err) {
    const message = err.response?.data?.message || 'Server error during login';
    // console.error('Error during login:', message);
    return res.render('admin/login', {
      error: message,
      success: null
    });
  }
}

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/admin/dashboard'); // or some fallback
    }

    res.clearCookie('connect.sid'); // Clear session cookie
    res.redirect('/admin/login');   // Redirect to login
  });
};

const resetPassword = async (res, req) => {
  const { email } = req.body;

  // Validation
  if (!validator.isEmail(email)) {
    return res.render('admin/login', { error: 'Invalid email format.', success: null });
  }

  try {
    // Verify if email exists
    const response = await axios.post(`${process.env.API_BASE_URL}/api/admin/forgot-password`, {
      email
    });

    if (response.data.status !== 'success') {
      return res.render('admin/login', { display: 'forgot_pass', error: response.data.message, success: null });
    }

    //show success message
    return res.render('admin/login', { display: 'forgot_pass', error: null, success: 'Reset link sent to your email.' });
  } catch (err) {
    const message = err.response?.data?.message || 'Something went wrong';
    return res.render('admin/login', { display: 'forgot_pass', error: message, success: null });
  }
}

const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("forgot : " + email);

  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/api/admin/forgot-password`, { email });

    console.log(" response : " + reponse );
    
    if(response.data?.status === "success"){
      console.log(" I am here : Success" );
      const message = response.data?.message || 'Check your email for reset link';
       res.render('admin/login', { display: 'forgot_pass', success: message, error: null });
    }else{
      const message = respons.message || 'Something went wrong';
      res.render('admin/login', { display: 'forgot_pass', success: null, error: message });
    }
   
  } catch (err) {
    console.log("I am here : " + err)
    const message = err.response?.data?.message || 'Failed to send reset link';
    res.render('admin/login', { display: 'forgot_pass', success: null, error: message });
  }
};

const handlePasswordReset = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const token = req.params.resetToken;

  if (password !== confirmPassword) {
    return res.render('admin/reset_pass', { token, error: "Passwords do not match", success: null });
  }

  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/api/admin/forgot-password/${token}`, {
      password,
    });

    const message = response.data?.message || 'Password reset successful';
    res.render('admin/login', { display: '', success: message, error: null });
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to reset password';
    res.render('admin/reset_pass', { token, success: null, error: message });
  }
};

// const login = async (req, res) => {
//   try {
//     const response = await fetch('http://localhost:3001/api/admin/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(req.body),
//     });
//     const data = await response.json();
//     if (!response.ok) {
//       return res.status(data.STATUS_CODE || 400).json(data);
//     }
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ message: 'Login failed', error: err.message });
//   }
// };

// const logout = (req, res) => {
//   res.json({ message: 'Logout successful. Clear token on client side.' });
// };

module.exports = { logout, renderLoginPage, handleLogin, resetPassword, handleForgotPassword, handlePasswordReset };