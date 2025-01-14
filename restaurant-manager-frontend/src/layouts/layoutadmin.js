import React, { Fragment } from 'react';
import Header from './header';  
import AdminSidebar from './siderbar/AdminSidebar'; 
import Footer from './footer';
import Head from '../components/Head';

function AdminLayout({ handleLogout, children }) {
  return (
    <>
      <Head />
      <Header handleLogout={handleLogout} />
      <AdminSidebar />
      <Fragment >
        {children}
      </Fragment>
      <Footer />
    </>
  );
}

export default AdminLayout;
