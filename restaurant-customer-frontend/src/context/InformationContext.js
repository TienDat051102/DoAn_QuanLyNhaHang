import React, { createContext, useState, useEffect, useContext } from 'react';
import Information from '../models/information'; // Đảm bảo rằng bạn đã có model gọi API

// Tạo context
const InformationContext = createContext();

// Provider component
export const InformationProvider = ({ children }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const id = 1;
        const data = await Information.getinformation(id);
        setInfo(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchInformation();
  }, []);

  return (
    <InformationContext.Provider value={{ info, loading, error }}>
      {children}
    </InformationContext.Provider>
  );
};

// Hook để sử dụng context
export const useInformation = () => useContext(InformationContext);
