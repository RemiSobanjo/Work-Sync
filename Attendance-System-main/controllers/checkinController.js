const axios = require('axios');

exports.submitVisitor = async (req, res) => {
    const { firstName, lastName, email, phone, personToVisit, purposeOfVisit, consent } = req.body;

    if (!consent) {
        return res.render('check-in/visitor', { error: 'Consent is required', success: null });
    }

    const phonePattern = /^(070|080|081|090|091)\d{8}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phonePattern.test(phone)) {
        return res.render('check-in/visitor', {
            error: 'Invalid phone number format.',
            success: null
        });
    }

    if (!emailPattern.test(email)) {
        return res.render('check-in/visitor', {
            error: 'Invalid email format.',
            success: null
        });
    }

    // Get current date
    const checkInDate = new Date(Date.now() - 5000);
    const timeIn = checkInDate.toISOString();

    try {
        const response = await axios.post(`${process.env.API_BASE_URL}/api/visitor/register`, {
            firstName,
            lastName,
            email,
            phone,
            personToVisit,
            purposeOfVisit,
            timeIn
        });

        const apiStatus = response.data?.status;
        const apiMessage = response.data?.message;

        if (apiStatus === 'true') {
            return res.render('check-in/visitor', { success: apiMessage || 'Check-in successful', error: null });
        } else {
            return res.render('check-in/visitor', {
                error: apiMessage || 'Check-in failed from API.',
                success: null
            });
        }
        // return res.redirect('/visitor?success=1');
        // return res.render('check-in/visitor', { success: 'Check-in successful', error: null });
    } catch (err) {
        console.error('Check-in error:', err.response?.data || err.message);
        return res.render('check-in/visitor', {
            error: 'Failed to check in. Please try again.',
            success: null
        });
    }
};

exports.submitCheckoutVisitor = async (req, res) => {
    const { phone } = req.body;

    const phonePattern = /^(070|080|081|090|091)\d{8}$/;

    if (!phonePattern.test(phone)) {
        return res.render('check-out/visitor', {
            error: 'Invalid phone number format.',
            success: null
        });
    }

    // Get current date
    const checkOutDate = new Date(Date.now() - 5000);
    const timeOut = checkOutDate.toISOString();

    try {
        const response = await axios.post(`${process.env.API_BASE_URL}/api/visitor/clock-in`, {
            phone
        });

        const apiStatus = response.data?.status;
        const apiMessage = response.data?.message;

        console.log(response.data?.DATA?.firstName);

        if (apiStatus === 'true') {
            const visitorData= response.data?.DATA || {};
            return res.render('check-out/visitor', { 
                success: apiMessage || 'Check-out successful', 
                error: null,
                firstName: visitorData.firstName || '',
                lastName: visitorData.lastName || '',
            });
        }
        else {
            return res.render('check-out/visitor', {
                error: apiMessage || 'Check-out failed from API.',
                success: null
            });
        }
        // return res.redirect('/visitor-out?success=1');
        // return res.render('check-in/visitor', { success: 'Check-in successful', error: null });
    } catch (err) {
        console.error('Check-out error:', err.response?.data);

        if (err.response?.data.message === "Invalid VisitorID") {
            return res.render('check-out/visitor', {
                error: 'This visitor is not clocked in.',
                success: null
            });
        }
        return res.render('check-out/visitor', {
            error: 'Failed to check out. Please try again. ' + err.message,
            success: null
        });
    }
};

exports.submitStaff = async (req, res) => {
    const { staffID } = req.body;

    // Get current date
    const checkInDate = new Date(Date.now() - 5000);
    const timeIn = checkInDate.toISOString();

    // const dateStr = checkInDate.toLocaleDateString();
    // const timeStr = checkInDate.toLocaleTimeString();

    try {
        const response = await axios.post(`${process.env.API_BASE_URL}/api/clock-in`, {
            staffID,
            timeIn
        });

        const apiStatus = response.data?.status;
        const apiMessage = response.data?.message;

        return res.redirect('/staff?success=1');
        // return res.render('check-in/visitor', { success: 'Check-in successful', error: null });
    } catch (err) {
        console.error('Check-in error:', err.response?.data || err.message);
        return res.render('check-in/staff', {
            error: 'Failed to check in. Please try again.',
            success: null
        });
    }
}

exports.submitStaffOut = async (req, res) => {
    const { staffID } = req.body;

    // Get current date
    const checkInDate = new Date(Date.now() - 5000);
    const timeOut = checkInDate.toISOString();

    try {
        const response = await axios.post(`${process.env.API_BASE_URL}/api/clock-out`, {
            staffID,
            timeOut
        });
        return res.redirect('/staff?success=1');
        // return res.render('check-in/visitor', { success: 'Check-in successful', error: null });
    } catch (err) {
        console.error('Check-in error:', err.response?.data || err.message);
        return res.render('check-in/staff', {
            error: 'Failed to check in. Please try again.',
            success: null
        });
    }
}