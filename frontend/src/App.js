import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from 'flowbite-react';
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'react-hot-toast';

import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import BillList from './components/BillList';
import BillForm from './components/BillForm';
import AdminDashboard from './components/admin/adminDashbord/AdminDashboard';
import WorkerDashboard from './components/worker/WorkerDashboard';
import UserLayout from './layout/userLayout/UserLayout';
import LayoutAdmin from './layout/adminLayout/LayoutAdmin';
import UserAuthGuard from './guards/UserAuthGuard';
import AdminAuthGuard from './guards/AdminAuthGuard';
import UsersListAdmin from './components/admin/usersListAdmin/UsersListAdmin';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UserProfile from './pages/UserProfile';
import store from './redux/store';
import { restoreUser } from './redux/slices/userSlice';
import LoadingSpinner from './components/common/LoadingSpinner';
import LayoutUser from './layout/userLayout/LayoutUser';
import HomePage from './pages/HomePage';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import AddFabricForm from './components/buyer/AddFabricForm';
import EditFabricForm from './components/buyer/EditFabricForm';
import WorkerFabricList from './components/worker/WorkerFabricList';
import BuyerFabricList from './components/buyer/BuyerFabricList';
import FabricDetails from './components/fabrics/FabricDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFoundPage from './pages/NotFoundPage';
import NetworkPage from './pages/NetworkPage';
import RequestsPage from './pages/RequestsPage';
import ConnectionsPage from './pages/ConnectionsPage';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const role = user?.role;

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={
          role === "admin" 
            ? <Navigate to="/admin/dashboard" /> 
            : <HomePage />
        } />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="bills" element={<BillList />} />
        <Route path="create-bill" element={<BillForm />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage/>} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminAuthGuard>
            <LayoutAdmin />
          </AdminAuthGuard>
        }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersListAdmin />} />
        <Route path="account/profile" element={<UserProfile />} />
      </Route>

      {/* Buyer Routes */}
      <Route
        path="/buyer"
        element={
          <UserAuthGuard>
            <LayoutUser />
          </UserAuthGuard>
        }>
        <Route path="dashboard" element={<BuyerDashboard />} />
        <Route path="network" element={<NetworkPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="fabrics" element={<BuyerFabricList />} />
        <Route path="fabrics/add" element={<AddFabricForm />} />
        <Route path="fabrics/edit/:id" element={<EditFabricForm />} />
        <Route path="fabrics/:id" element={<FabricDetails />} />
        <Route path="account/profile" element={<UserProfile />} />
      </Route>

      {/* Worker Routes */}
      <Route
        path="/worker"
        element={
          <UserAuthGuard>
            <LayoutUser />
          </UserAuthGuard>
        }>
        <Route path="dashboard" element={<WorkerDashboard />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="fabrics/:id" element={<FabricDetails />} />
        <Route path="tasks" element={<WorkerFabricList />} />
        <Route path="account/profile" element={<UserProfile />} />
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
          "dark:bg-primary-dark dark:hover:bg-primary-hoverDark dark:text-white " +
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light " +
          "dark:focus:ring-primary-dark transition-colors duration-200",
        secondary:
          "bg-secondary-light text-white hover:bg-secondary-hoverLight " +
          "dark:bg-secondary-dark dark:hover:bg-secondary-hoverDark dark:text-white " +
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light " +
          "dark:focus:ring-secondary-dark transition-colors duration-200",
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
                <Toaster position="top-right" />
              </BrowserRouter>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
