const axios = require('axios');
const moment = require('moment');

const renderDashboard = async (req, res) => {
  let weekDays = [];
  let search = '';
  let page = 1;
  let totalPages = 1;
  try {
    const token = req.session.user?.token;

    if (!token) {
      return res.redirect('/admin/login');
    }

    // Determine week offset from query
    const offset = parseInt(req.query.offset || 0);

    const today = moment().startOf('isoWeek').subtract(offset, 'weeks');
    const startDate = today.clone().startOf('isoWeek'); // Monday
    const endDate = today.clone().endOf('isoWeek').subtract(2, 'days'); // Friday

    //display week date
    weekDays = [];
    for (let i = 0; i < 5; i++) {
      const day = startDate.clone().add(i, 'days');
      weekDays.push({
        name: day.format('dddd'),      // e.g., Monday
        date: day.format('DD/MM/YYYY') // e.g., 02/06/2026
      });
    }

    // Get staff data
    const response = await axios.get(`${process.env.API_BASE_URL}/api/staff`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const staffData = response.data?.data || [];

    const uniqueStaffIDs = new Set(staffData.map(staff => staff.staffID));
    const totalStaffCount = uniqueStaffIDs.size;

    // Get attendance data
    const attendanceRes = await axios.get(`${process.env.API_BASE_URL}/api/attendance`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const records = attendanceRes.data?.data || [];

    const staffMap = {};

    for (const record of records) {
      const timeIn = moment(record.timeIn);
      if (timeIn.isBefore(startDate) || timeIn.isAfter(endDate)) continue;

      const fullName = `${record.firstName} ${record.lastName}`;
      const dayName = timeIn.format('dddd');

      if (!staffMap[fullName]) {
        staffMap[fullName] = {
          name: fullName,
          attendance: {
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false
          },
          total: 0
        };
      }

      if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(dayName)) {
        if (!staffMap[fullName].attendance[dayName]) {
          staffMap[fullName].attendance[dayName] = true;
          staffMap[fullName].total += 1;
        }
      }
    }
    let attendanceData = Object.values(staffMap);

    // Apply search filter if provided
    search = req.query.search?.toLowerCase();
    if (search) {
      attendanceData = attendanceData.filter(staff =>
        staff.name.toLowerCase().includes(search)
      );
    }

    //Pagination for the staff log table
    page = parseInt(req.query.page) || 1;
    const limit = 10; // staff per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = attendanceData.slice(startIndex, endIndex);
    totalPages = Math.ceil(attendanceData.length / limit);

    res.render('admin/dashboard', {
      totalStaffCount,
      attendanceData: paginatedData,
      week: {
        start: startDate.format('DD MMMM, YYYY'),
        end: endDate.format('DD MMMM, YYYY'),
        offset
      },
      weekDays,
      search,
      pagination: {
        current: page,
        total: totalPages
      },
      currentPage: 'dashboard',
      error: null,
      success: null
    });

  } catch (err) {
    console.error("Dashboard fetch error:", err.message);
    res.render('admin/dashboard', {
      totalStaffCount: 0,
      attendanceData: [],
      week: {
        start: '',
        end: '',
        offset: 0
      },
      weekDays,
      search,
      pagination: {
        current: page,
        total: totalPages
      },
      currentPage: 'dashboard',
      error: "Could not load dashboard data.",
      success: null
    });
  }
};

module.exports = { renderDashboard };
