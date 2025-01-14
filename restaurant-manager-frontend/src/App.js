import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminLayout from "./layouts/layoutadmin";
import StaffLayout from "./layouts/staff/layoutstaff";
import Dashboard from "./layouts/dashboard"; // Admin Dashboard
import Discounts from "./pages/table/discounts/discounts"; // Trang giảm giá
import User from "./pages/table/User/index"; // Trang người dùng
import ProtectedRoute from "./components/ProtectedRoute"; 
import OrderPageStaff from "./layouts/staff/OrderPage";
import OrderListStaff from "./layouts/staff/OrderList";
import TableBookingStaff from "./layouts/staff/TableBooking";
import Register from "./pages/register"
import Ingredients from "./pages/table/ingredients";
import AddIngredientPage from "./pages/table/ingredients/addingredients";
import Menucategories from "./pages/table/menucategories";
import MenuItems from "./pages/table/menuitem";
import Reservations from "./pages/table/reservations";
import Tables from "./pages/table/tables";
import Customer from "./pages/table/customer";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsAuthenticated(true);
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.role);
    }
  }, []);

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
    setUserRole(user.role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserRole("");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userRole === "admin" ? "admin" : "staff/order"}`} replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route path="/register" element ={<Register/>}/>

        {/* Routes dành cho Admin */}
        <Route
          path="/admin/*"
          element={
            isAuthenticated && userRole === "admin" ? (
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminLayout handleLogout={handleLogout}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/discounts" element={<Discounts />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/ingredients" element={<Ingredients />} />
                    <Route path="/menu" element={<MenuItems />} />
                    <Route path="/menu-categories" element={<Menucategories />} />
                    <Route path="/addingredients" element={<AddIngredientPage />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/tables" element={<Tables />} />
                    <Route path="/customer" element={<Customer />} />
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Routes dành cho Nhân viên */}
        <Route
          path="/staff/*"
          element={
            isAuthenticated && userRole === "staff" ? (
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <StaffLayout handleLogout={handleLogout}>
                  <Routes>
                    <Route path="order" element={<OrderPageStaff />} />
                    <Route path="order-list" element={<OrderListStaff />} />
                    <Route path="table-booking" element={<TableBookingStaff />} />
                  </Routes>
                </StaffLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
