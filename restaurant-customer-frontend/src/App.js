// src/App.js
import React from 'react';
import './App.css'; // Đảm bảo bạn đã thêm các file CSS cần thiết ở đây
import Head from './components/Head';
import Header from './components/Header'; // Import component Header
import Footer from './components/Footer'; // Import component Footer
import Main from './components/Main'; // Import component Main
import { InformationProvider } from './context/InformationContext';
import { NavmenuProvider } from './context/NavmenuContext';

const App = () => {
  return (
    <InformationProvider>
   
      <Head />
      <Header /> 
      <Main />
      <Footer /> 
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>
    
    </InformationProvider>
  );
};

export default App;
