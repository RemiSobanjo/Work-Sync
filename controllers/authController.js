const axios = require('axios');
require('dotenv').config();

const v1_API = process.env.API_BASE_URL;

const login = async (req, res) => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(data.STATUS_CODE || 400).json(data);
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logout successful. Clear token on client side.' });
};

module.exports = { login, logout };

