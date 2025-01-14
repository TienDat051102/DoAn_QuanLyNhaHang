import React from 'react';
import { Link } from 'react-router-dom';

const StaffSidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = '/'; 
  }
  return (
    <aside className="sidebar">
      <div  className="sidebar-header">
        <h2 style={{color: '#fff'}}>Trang nhân viên</h2>
      </div>
      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <Link to="/staff/table-booking" className="sidebar-link">
            <i className="fas fa-calendar-check sidebar-icon"></i> 
            <span>Xem Đặt Bàn</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/staff/order-list" className="sidebar-link">
            <i className="fas fa-list-alt sidebar-icon"></i> 
            <span>Xem Đơn Hàng</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/staff/order" className="sidebar-link">
            <i className="fas fa-cart-plus sidebar-icon"></i> 
            <span>Đặt Hàng</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <a  className="sidebar-link">
            <i className="fas fa-cart-plus sidebar-icon"></i> 
            <span onClick={handleLogout}>Đăng Xuất</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default StaffSidebar;
