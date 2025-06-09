document.addEventListener('DOMContentLoaded', function () {
  let filter_drp = "Staff Log";
  getStaffLog();

  document.getElementById('filter_state')?.addEventListener('change', () => {
    filter_drp === "Staff Log" ? getStaffLog() : getVisitorLog();
  });

  document.getElementById('filter_end')?.addEventListener('change', () => {
    filter_drp === "Staff Log" ? getStaffLog() : getVisitorLog();
  });

  document.getElementById('filterLog')?.addEventListener('change', (e) => {
    filter_drp = e.target.value;
    filter_drp === "Staff Log" ? getStaffLog() : getVisitorLog();
  });
});

function getStaffLog() {
  document.getElementById("log_table").innerHTML = `
    <table id="log" class="display nowrap" style="width:100%">
      <thead>
        <tr>
          <th>S/N</th>
          <th>Staff ID</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
        </tr>
      </thead>
    </table>
  `;

  $('#log').DataTable({
    ajax: {
      url: '/admin/staff-list',
      dataSrc: 'data',
    },
    destroy: true,
    responsive: true,
    columns: [
      { data: null, render: (data, type, row, meta) => meta.row + 1 },
      { data: 'staffID' },
      { data: 'firstName', defaultContent: '' },
      { data: 'lastName', defaultContent: '' },
      { data: 'email', defaultContent: '' },
      { data: 'phone', defaultContent: '' },
      { data: 'role', defaultContent: '' },
    ]
  });
}

function getVisitorLog() {
  document.getElementById("log_table").innerHTML = `
    <table id="log" class="display nowrap" style="width:100%">
      <thead>
        <tr>
          <th>S/N</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone</th>
          <th>Person To Visit</th>
          <th>Purpose Of Visit</th>
        </tr>
      </thead>
    </table>
  `;

  $('#log').DataTable({
    ajax: {
      url: '/admin/visitor-list',
      dataSrc: 'data',
    },
    destroy: true,
    responsive: true,
    columns: [
      { data: null, render: (data, type, row, meta) => meta.row + 1 },
      { data: 'firstName' },
      { data: 'lastName' },
      { data: 'phone' },
      { data: 'personToVisit' },
      { data: 'purposeOfVisit' },
    ]
  });
}
