import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { Navbar } from "./Navbar";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { Account } from "../Pages/Users/Account";
import { HomePage } from "./Home";
import { AboutUs } from "./Aboutus";
import { ContactUs } from "./ContatcUs";
import { MenuItems } from "../Pages/Users/MenuItems";
import { CartPage } from "../Pages/Users/Cart";
import { MyOrders } from "../Pages/Users/Myorders";
import { TableSelection } from "../Pages/Users/TableSelection";
import { AdminOrders } from "../Pages/Admin/Orders";
import { AdminDashboard } from "../Pages/Admin/Dashboards";
import ManageMenu from "../Pages/Admin/MenuAdd";
import { TableManagement } from "../Pages/Admin/TableManagement";
import { PaymentManagement } from "../Pages/Admin/PaymentManagement";
import { AdminRoute, UserRoute } from "./ProtectedRoute";

// Protected Menu Route Component
function ProtectedMenuRoute() {
  const selectedTable = localStorage.getItem('selectedTable');
  
  if (!selectedTable) {
    return <Navigate to="/user/table-selection" replace />;
  }
  
  return <MenuItems />;
}

// Protected Table Selection Route Component
function ProtectedTableRoute() {
  const selectedTable = localStorage.getItem('selectedTable');
  
  if (selectedTable) {
    return <Navigate to="/user/menu" replace />;
  }
  
  return <TableSelection />;
}

export function AppRouter() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    
    // Clear any previous table selection on new login
    localStorage.removeItem('selectedTable');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Routes */}
          <Route path="/user/table-selection" element={
            <UserRoute user={user}>
              <ProtectedTableRoute />
            </UserRoute>
          } />
          <Route path="/user/menu" element={
            <UserRoute user={user}>
              <ProtectedMenuRoute />
            </UserRoute>
          } />
          <Route path="/user/cart" element={
            <UserRoute user={user}>
              <CartPage />
            </UserRoute>
          } />
          <Route path="/user/orders" element={
            <UserRoute user={user}>
              <MyOrders />
            </UserRoute>
          } />
          <Route path="/account" element={
            user ? <Account user={user} /> : <Navigate to="/login" replace />
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute user={user}>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute user={user}>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/admin/menu" element={
            <AdminRoute user={user}>
              <ManageMenu />
            </AdminRoute>
          } />
          <Route path="/admin/tables" element={
            <AdminRoute user={user}>
              <TableManagement />
            </AdminRoute>
          } />
          <Route path="/admin/payments" element={
            <AdminRoute user={user}>
              <PaymentManagement />
            </AdminRoute>
          } />

          {!user && (
            <>
              <Route path="/account" element={<Navigate to="/login" replace />} />
              <Route path="/user/*" element={<Navigate to="/login" replace />} />
              <Route path="/admin/*" element={<Navigate to="/login" replace />} />
            </>
          )}
      </Routes>
    </>
  );
}
