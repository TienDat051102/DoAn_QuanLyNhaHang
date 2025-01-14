import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavMenu from '../../store/actions/navmenu';

const AdminSidebar = () => {
  const [roleAdmin, setRoleAdmin] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const data = await NavMenu.getNavmenu();
        setRoleAdmin(data.adminData.filter(x => x.static.toLowerCase().includes(storedUser?.role.toLowerCase())));
        console.log('roleAdmin',roleAdmin)
      } catch (e) {
        console.error(e);
      }
    };
    fetchInformation();
  }, []);
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {roleAdmin.map((item, index) => (
          <li key={index} className="nav-item">
            <Link className="nav-link collapsed" to={item.path}>
              <i className={item.icon ? item.icon : "bi bi-grid"}></i>
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
