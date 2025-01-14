// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { useInformation } from '../context/InformationContext';
import Nav from './Nav'


const Header = () => {
  const {info, loading, error} = useInformation();
  console.log('infotest',info)
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <header id="header" className="header fixed-top">
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope d-flex align-items-center">
              <a href="mailto:contact@example.com">{info?.email}</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span>{info?.sdt}</span>
            </i>
          </div>
          <div className="languages d-none d-md-flex align-items-center">
            <ul>
              <li>En</li>
              <li>
                <a href="#">De</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* End Top Bar */}

      <div className="branding d-flex align-items-center">
        <div className="container position-relative d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center me-auto me-xl-0">
            {/* Uncomment the line below if you also wish to use an image logo */}
            {/* <img src="assets/img/logo.png" alt="" /> */}
            <h1 className="sitename">{info?.logo}</h1>
          </a>
         <Nav/>
          <a className="btn-book-a-table d-none d-xl-block" href="#book-a-table">Đặt Bàn Ngay</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
