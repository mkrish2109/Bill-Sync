import React from "react";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "flowbite-react";
import { SocketProvider } from "./contexts/SocketContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Toaster } from "react-hot-toast";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import BillList from "./features/bill/components/BillList";
import BillForm from "./features/bill/components/BillForm";
import AdminDashboard from "./features/admin/components/adminDashboard/AdminDashboard";
import WorkerDashboard from "./features/worker/components/WorkerDashboard";
import UserLayout from "./layouts/userLayout/UserLayout";
import LayoutAdmin from "./layouts/adminLayout/LayoutAdmin";
import UserAuthGuard from "./guards/UserAuthGuard";
import AdminAuthGuard from "./guards/AdminAuthGuard";
import UsersListAdmin from "./features/admin/components/usersListAdmin/UsersListAdmin";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import UserProfilePage from "./pages/UserProfilePage";
import store from "./store";
import LoadingSpinner from "./components/common/LoadingSpinner";
import LayoutUser from "./layouts/userLayout/LayoutUser";
import HomePage from "./pages/HomePage";
import BuyerDashboard from "./features/buyer/components/BuyerDashboard";
import AddFabricForm from "./features/buyer/components/AddFabricForm";
import EditFabricForm from "./features/buyer/components/EditFabricForm";
import WorkerFabricList from "./features/worker/components/WorkerFabricList";
import BuyerFabricList from "./features/buyer/components/BuyerFabricList";
import FabricDetails from "./features/fabrics/components/FabricDetails";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import NetworkPage from "./pages/NetworkPage";
import RequestsPage from "./pages/RequestsPage";
import ConnectionsPage from "./pages/ConnectionsPage";

const AppRoutes = () => {
  const { user, loading } = useSelector((state) => state.user);
  const role = user?.role;

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route
          index
          element={
            role === "admin" ? <Navigate to="/admin/dashboard" /> : <HomePage />
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="bills" element={<BillList />} />
        <Route path="create-bill" element={<BillForm />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminAuthGuard>
            <LayoutAdmin />
          </AdminAuthGuard>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersListAdmin />} />
        <Route path="account/profile" element={<UserProfilePage />} />
      </Route>

      {/* Buyer Routes */}
      <Route
        path="/buyer"
        element={
          <UserAuthGuard>
            <LayoutUser />
          </UserAuthGuard>
        }
      >
        <Route path="dashboard" element={<BuyerDashboard />} />
        <Route path="network" element={<NetworkPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="fabrics" element={<BuyerFabricList />} />
        <Route path="fabrics/add" element={<AddFabricForm />} />
        <Route path="fabrics/edit/:id" element={<EditFabricForm />} />
        <Route path="fabrics/:id" element={<FabricDetails />} />
        <Route path="account/profile" element={<UserProfilePage />} />
      </Route>

      {/* Worker Routes */}
      <Route
        path="/worker"
        element={
          <UserAuthGuard>
            <LayoutUser />
          </UserAuthGuard>
        }
      >
        <Route path="dashboard" element={<WorkerDashboard />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="fabrics/:id" element={<FabricDetails />} />
        <Route path="tasks" element={<WorkerFabricList />} />
        <Route path="account/profile" element={<UserProfilePage />} />
      </Route>
    </Routes>
  );
};

function App() {
  const customTheme = createTheme({
    button: {
      color: {
        primary:
          "bg-primary-light text-white hover:bg-primary-hoverLight " +
          "dark:bg-primary-dark dark:hover:bg-primary-hoverDark dark:text-background-dark " +
          "focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-light " +
          "dark:focus:ring-primary-dark transition-colors duration-200",
        secondary:
          "bg-secondary-light text-white hover:bg-secondary-hoverLight " +
          "dark:bg-secondary-dark dark:hover:bg-secondary-hoverDark dark:text-background-dark " +
          "focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-secondary-light " +
          "dark:focus:ring-secondary-dark transition-colors duration-200",
        outline:
          "bg-transparent border-2 border-secondary-light text-secondary-light hover:bg-secondary-light hover:text-white " +
          "dark:border-secondary-dark dark:text-secondary-dark dark:hover:bg-secondary-dark dark:hover:text-background-dark " +
          "focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-secondary-light " +
          "dark:focus:ring-secondary-dark transition-colors duration-200",
      },
    },
    navbar: {
      root: {
        base: "bg-white shadow-lg",
      },
      collapse: {
        base: "w-full md:block md:w-auto",
        list: "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8",
      },
      link: {
        base: "block px-3 py-2 text-text-dark hover:bg-gray-100 md:hover:bg-transparent md:p-0",
        active: {
          on: "text-gray-600",
          off: "text-gray-900",
        },
      },
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <Provider store={store}>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <BrowserRouter>
                <AppRoutes />
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    className: "text-sm rounded shadow-md",
                    duration: 3000,
                  }}
                />
              </BrowserRouter>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
