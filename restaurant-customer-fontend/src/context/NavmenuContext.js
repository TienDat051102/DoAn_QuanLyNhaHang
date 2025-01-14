import React, { createContext, useState, useEffect, useContext } from "react";
import NavMenu from "../models/navmenu";

const NavmenuContext = createContext();

export const NavmenuProvider = ({ Children }) => {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const data = await NavMenu.getNavmenu();
        setInfo(data.customerData);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInformation();
  }, []);
  return (
    <NavmenuContext.Provider value={{ info, loading, error }}>
      {Children}
    </NavmenuContext.Provider>
  );
};

export const useNavmenu = () => useContext(NavmenuContext);
