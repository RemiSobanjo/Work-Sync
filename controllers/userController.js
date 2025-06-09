// controllers/checkinController.js or logController.js
const axios = require('axios');

const fetchStaffList = async (req, res) => {
  try {
    const token = req.session.user?.token;

    if (!token) {
      return res.redirect('/admin/login');
    }

    const response = await axios.get(`${process.env.API_BASE_URL}/api/staff`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const staffArray = response.data?.data || [];

    res.json({ data: staffArray });
  } catch (err) {
    console.error('Staff list error:', err.message);
    res.status(500).json({ message: 'Unable to fetch staff data' });
  }
};

const fetchVisitorList = async (req, res) => {
  try {
        const token = req.session.user?.token;

    if (!token) {
      return res.redirect('/admin/login');
    }
    const response = await axios.get(`${process.env.API_BASE_URL}/api/visitor/visits`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const visitorArray = response.data?.data?.DATA || [];

    res.json({ data: visitorArray });
    console.log("dataVisit : ", visitorArray)
  } catch (err) {
    console.error('Visitor list error:', err.message);
    res.status(500).json({ message: 'Unable to fetch visitor data' });
  }
};

module.exports = {
  fetchStaffList,
  fetchVisitorList
};
