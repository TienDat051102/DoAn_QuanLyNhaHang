import React, { Fragment } from 'react';
import StaffSidebar from '../siderbar/StaffSidebar';  
import './staff.css';

function StaffLayout({ handleLogout, children }) {
  return (
    <div className="staff-layout">
      <div className="staff-sidebar">
        <StaffSidebar  handleLogout={handleLogout} />
      </div>
      <div className="staff-content">
        <Fragment>{children}</Fragment>
      </div>
    </div>
  );
}

export default StaffLayout;
