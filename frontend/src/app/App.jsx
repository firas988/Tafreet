import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import CustomerMenu from "./pages/customerMenu/CustomerMenu.jsx";
import Cart from "./pages/cart/Cart.jsx";
import OrderStatus from "./pages/orderStatus/OrderStatus.jsx";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard.jsx";
import WorkerOrders from "./pages/workerOrders/WorkerOrders.jsx";
import MenuManagement from "./pages/menuManagement/MenuManagement.jsx";
import StaffManagement from "./pages/staffManagement/StaffManagement.jsx";
import OrderHistory from "./pages/orderHistory/OrderHistory.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu/public/table/1" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/menu" element={<Navigate to="/menu/public/table/1" />} />
      <Route
        path="/menu/public/table/:tableNumber"
        element={<CustomerMenu />}
      />
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
