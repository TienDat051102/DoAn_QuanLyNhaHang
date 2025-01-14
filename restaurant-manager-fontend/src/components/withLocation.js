import React from 'react';
import { useLocation } from 'react-router-dom';

const withLocation = (Component) => {
  return function Wrapper(props) {
    const location = useLocation();
    return <Component {...props} location={location} />;
  };
};

export default withLocation;
