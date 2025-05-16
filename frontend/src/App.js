import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from 'flowbite-react';

import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import BillList from './components/BillList';
import BillForm from './components/BillForm';
import AdminDashboard from './components/admin/adminDashbord/AdminDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import UserLayout from './layout/userLayout/UserLayout';
import LayoutAdmin from './layout/adminLayout/LayoutAdmin';
import UserAuthGuard from './guards/UserAuthGuard';
import AdminAuthGuard from './guards/AdminAuthGuard';
import UsersListAdmin from './components/admin/usersListAdmin/UsersListAdmin';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UserProfile from './pages/UserProfile';
import store from './redux/store';
import { fetchUser, restoreUser } from './redux/slices/userSlice';
import LoadingSpinner from './components/LoadingSpinner';
import LayoutUser from './layout/userLayout/LayoutUser';
import HomePage from './pages/HomePage';

const AppRoutes = () => {
const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const role = user?.role;

  useEffect(() => {
    dispatch(restoreUser());
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {role === "admin" ? (
        <Route path="/" element={
          <AdminAuthGuard>
            <LayoutAdmin />
          </AdminAuthGuard>
        }>
          <Route index element={<AdminDashboard />} />
        </Route>
      ) 
      : (
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="bills" element={<BillList />} />
          <Route path="create-bill" element={<BillForm />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      )}

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
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
