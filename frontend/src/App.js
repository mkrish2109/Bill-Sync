import React from 'react';
import { Provider } from 'react-redux';
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
import store from './redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from 'flowbite-react';
import UsersListAdmin from './components/admin/usersListAdmin/UsersListAdmin';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UserProfile from './pages/UserProfile';


function App() {
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  console.log(role)
  const customTheme = createTheme({
    button: {
      color: {
        primary: "bg-[#44b8ff] hover:bg-[#1f90bc] text-white ",
      },
    },
    sidebar: {
      item: {
        base: "h-full flex items-center justify-center rounded-md p-2 hover:bg-[#2098e3] hover:text-black-900 hover:text-white",
      },
    },
    collapse: {
      base: "w-full md:block md:w-auto text-right md:text-left",
      list: "mt-4 flex flex-col items-end md:items-center md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
      hidden: {
        on: "hidden",
        off: ""
      }
    }
  });
  return (
    <>
    {/* <ThemeProvider theme={customTheme}>  */}
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            {role === "admin" ? (
              <Route path="/" element={
                <UserAuthGuard>
                  <LayoutAdmin />
                </UserAuthGuard>
              }>
                <Route index element={<AdminDashboard />} />
              </Route>
            ) : (
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Dashboard />} />
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
                <UserAuthGuard>
                  <LayoutAdmin />
                </UserAuthGuard>
              }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UsersListAdmin />} />
              <Route path="account" >
                <Route path="profile" element={<UserProfile />} />
              </Route>
            </Route>

            {/* Buyer Routes */}
            <Route
              path="/buyer"
              element={
                <UserAuthGuard>
                  <UserLayout />
                </UserAuthGuard>
              }>
              <Route path="dashboard" element={<BuyerDashboard />} />
            </Route>

            {/* Worker Routes */}
            <Route
              path="/worker"
              element={
                <UserAuthGuard>
                  <UserLayout />
                </UserAuthGuard>
              }>
              <Route path="dashboard" element={<WorkerDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    {/* </ThemeProvider> */}
  </>
  );
}

export default App;
