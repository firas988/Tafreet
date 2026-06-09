import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import CustomerMenu from "./pages/CustomerMenu.jsx";
import Cart from "./pages/Cart.jsx";
import OrderStatus from "./pages/OrderStatus.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import WorkerOrders from "./pages/WorkerOrders.jsx";
import MenuManagement from "./pages/MenuManagement.jsx";
import StaffManagement from "./pages/StaffManagement.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/menu" element={<CustomerMenu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/status" element={<OrderStatus />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/menu" element={<MenuManagement />} />
      <Route path="/admin/staff" element={<StaffManagement />} />
      <Route path="/admin/history" element={<OrderHistory />} />
      <Route path="/worker" element={<WorkerOrders />} />
    </Routes>
  );
}
