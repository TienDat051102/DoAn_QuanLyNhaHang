

import React, { useEffect, useState } from 'react';
import NavMenu from '../models/navmenu'
const Nav = () => {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchInformation = async () => {
    try{
      const data = await NavMenu.getNavmenu();
      setInfo(data.customerData)
    }
    catch(e){
      setError(e);
    }
    finally {
      setLoading(false);
    }};
    fetchInformation();
  },[]);
    return(
        <nav id="navmenu" className="navmenu">
        <ul>
          {info.map((item,index)=>(
             <li key={index} className={item.navmenuitems ? 'dropdown' : ''}>
                 <a href={item.path} className={item.active ? 'active' : ''}>
                 {item.title}
                 <br />
               </a>
               {item.navmenuitems && (
              <ul>
                {item.navmenuitems.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <a href={subItem.path}>{subItem.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
          ))}
        </ul>
        <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
      </nav>
    );
};
export default Nav;
