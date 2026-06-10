import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import CustomerMenu from "./pages/customerMenu/CustomerMenu.jsx";
import Cart from "./pages/cart/Cart.jsx";
import OrderStatus from "./pages/orderStatus/OrderStatus.jsx";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard.jsx";
import AdminOrders from "./pages/adminOrders/AdminOrders.jsx";
import WorkerOrders from "./pages/workerOrders/WorkerOrders.jsx";
import MenuManagement from "./pages/menuManagement/MenuManagement.jsx";
import StaffManagement from "./pages/staffManagement/StaffManagement.jsx";
import TableManagement from "./pages/tableManagement/TableManagement.jsx";
import OrderHistory from "./pages/orderHistory/OrderHistory.jsx";
import RestaurantSettings from "./pages/restaurantSettings/RestaurantSettings.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/menu/public/table/:tableNumber"
        element={<CustomerMenu />}
      />
      <Route path="/cart" element={<Cart />} />
      <Route path="/status" element={<OrderStatus />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute role="admin">
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute role="admin">
            <MenuManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute role="admin">
            <StaffManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tables"
        element={
          <ProtectedRoute role="admin">
            <TableManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/history"
        element={
          <ProtectedRoute role="admin">
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute role="admin">
            <RestaurantSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker"
        element={
          <ProtectedRoute role="worker">
            <WorkerOrders />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
